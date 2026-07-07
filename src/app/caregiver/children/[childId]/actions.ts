"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertCaregiverOwnsChild } from "@/lib/queries";
import { awardRocketFuel, advanceChildAfterCertification } from "@/lib/rocket-fuel";

const MILESTONE_FUEL = 100;
const SECTION_FUEL = 50;
const WORKSHEET_FUEL = 100;
const QUESTION_FUEL_DEFAULT = 25;

async function authorize(childId: string) {
  const session = await requireSession("caregiver");
  const ok = await assertCaregiverOwnsChild(session.userId, childId);
  if (!ok) throw new Error("Not authorized for this child");
  return session;
}

function revalidateChild(childId: string) {
  revalidatePath(`/caregiver/children/${childId}`, "layout");
  revalidatePath("/caregiver/dashboard");
}

export async function setMilestoneStatus(
  childId: string,
  milestoneId: string,
  status: "completed" | "available"
) {
  await authorize(childId);

  const childMilestone = await prisma.childMilestone.update({
    where: { childId_milestoneId: { childId, milestoneId } },
    data: { status, completedAt: status === "completed" ? new Date() : null },
    include: { milestone: true },
  });

  if (status === "completed") {
    await awardRocketFuel(childId, MILESTONE_FUEL, `Completed milestone: ${childMilestone.milestone.title}`, "milestone", milestoneId);

    // If every milestone at this level is now complete, unlock the matching certification.
    const level = childMilestone.milestone.level;
    const levelMilestones = await prisma.childMilestone.findMany({
      where: { childId, milestone: { level } },
    });
    const allDone = levelMilestones.every((m) => m.status === "completed");
    if (allDone) {
      const cert = await prisma.certification.findFirst({ where: { level } });
      if (cert) {
        await prisma.childCertification.updateMany({
          where: { childId, certificationId: cert.id, status: { in: ["locked", "in_progress"] } },
          data: { status: "available" },
        });
      }
    }
  }

  revalidateChild(childId);
}

export async function startMission(childId: string, missionId: string) {
  await authorize(childId);
  await prisma.childMission.upsert({
    where: { childId_missionId: { childId, missionId } },
    create: { childId, missionId, status: "in_progress", startedAt: new Date() },
    update: { status: "in_progress", startedAt: new Date() },
  });
  revalidateChild(childId);
}

async function checkMissionCompletion(childId: string, missionId: string) {
  const childMission = await prisma.childMission.findUnique({
    where: { childId_missionId: { childId, missionId } },
    include: { childMissionSections: true, mission: { include: { sections: true } } },
  });
  if (!childMission) return;

  const allSectionsDone =
    childMission.mission.sections.length > 0 &&
    childMission.mission.sections.every((s) =>
      childMission.childMissionSections.some((cs) => cs.missionSectionId === s.id && cs.completedAt)
    );

  if (allSectionsDone && childMission.worksheetCompletedAt && childMission.status !== "completed") {
    await prisma.childMission.update({
      where: { id: childMission.id },
      data: { status: "completed", completedAt: new Date() },
    });
    await awardRocketFuel(
      childId,
      childMission.mission.rocketFuelReward,
      `Completed mission: ${childMission.mission.title}`,
      "mission",
      missionId
    );
  }
}

export async function completeMissionSection(
  childId: string,
  missionId: string,
  missionSectionId: string
) {
  await authorize(childId);

  const childMission = await prisma.childMission.upsert({
    where: { childId_missionId: { childId, missionId } },
    create: { childId, missionId, status: "in_progress", startedAt: new Date() },
    update: {},
  });

  await prisma.childMissionSection.upsert({
    where: { childMissionId_missionSectionId: { childMissionId: childMission.id, missionSectionId } },
    create: { childMissionId: childMission.id, missionSectionId, completedAt: new Date() },
    update: { completedAt: new Date() },
  });

  const section = await prisma.missionSection.findUnique({ where: { id: missionSectionId } });
  await awardRocketFuel(childId, SECTION_FUEL, `Completed section: ${section?.title}`, "mission_section", missionSectionId);

  await checkMissionCompletion(childId, missionId);
  revalidateChild(childId);
}

export async function markWorksheetComplete(childId: string, missionId: string) {
  await authorize(childId);

  const childMission = await prisma.childMission.upsert({
    where: { childId_missionId: { childId, missionId } },
    create: { childId, missionId, status: "in_progress", startedAt: new Date(), worksheetCompletedAt: new Date() },
    update: { worksheetCompletedAt: new Date() },
  });

  await awardRocketFuel(childId, WORKSHEET_FUEL, "Completed mission worksheet", "worksheet", childMission.id);

  await checkMissionCompletion(childId, missionId);
  revalidateChild(childId);
}

export async function awardQuestionFuel(childId: string, questionId: string, question: string) {
  await authorize(childId);
  await awardRocketFuel(childId, QUESTION_FUEL_DEFAULT, `Answered: ${question}`, "mission_question", questionId);
  revalidateChild(childId);
}

export async function setCertificationStatus(
  childId: string,
  certificationId: string,
  status: "in_progress" | "passed" | "available"
) {
  await authorize(childId);

  const cc = await prisma.childCertification.update({
    where: { childId_certificationId: { childId, certificationId } },
    data: { status, passedAt: status === "passed" ? new Date() : null },
    include: { certification: true },
  });

  if (status === "passed") {
    await awardRocketFuel(
      childId,
      cc.certification.rocketFuelReward,
      `Passed certification: ${cc.certification.name}`,
      "certification",
      certificationId
    );
    await advanceChildAfterCertification(childId);
  }

  revalidateChild(childId);
}

export async function unlockCard(childId: string, cardId: string) {
  await authorize(childId);

  const card = await prisma.card.findUniqueOrThrow({ where: { id: cardId } });
  const child = await prisma.child.findUniqueOrThrow({ where: { id: childId } });

  if (child.rocketFuel < card.rocketFuelCost) {
    throw new Error("Not enough Rocket Fuel to unlock this card yet.");
  }

  await prisma.childCard.upsert({
    where: { childId_cardId: { childId, cardId } },
    create: { childId, cardId, status: "collected", collectedAt: new Date() },
    update: { status: "collected", collectedAt: new Date() },
  });

  await awardRocketFuel(childId, -card.rocketFuelCost, `Unlocked card: ${card.name}`, "card", cardId);

  revalidateChild(childId);
}
