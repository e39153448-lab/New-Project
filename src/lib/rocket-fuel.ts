import { prisma } from "@/lib/prisma";
import { LEVELS } from "@/lib/constants";

export async function awardRocketFuel(
  childId: string,
  amount: number,
  reason: string,
  sourceType: string,
  sourceId?: string
) {
  await prisma.$transaction([
    prisma.rocketFuelTransaction.create({
      data: { childId, amount, reason, sourceType, sourceId },
    }),
    prisma.child.update({
      where: { id: childId },
      data: { rocketFuel: { increment: amount } },
    }),
  ]);
}

export function nextLevel(level: string): string | null {
  const idx = LEVELS.indexOf(level as (typeof LEVELS)[number]);
  if (idx === -1 || idx === LEVELS.length - 1) return null;
  return LEVELS[idx + 1];
}

/** Advance a child to the next level after a certification passes: unlock next
 * level's milestones + certification, and grant one free card as a reward. */
export async function advanceChildAfterCertification(childId: string) {
  const child = await prisma.child.findUniqueOrThrow({ where: { id: childId } });
  const next = nextLevel(child.currentLevel);

  if (next) {
    const nextCert = await prisma.certification.findFirst({ where: { level: next } });
    await prisma.child.update({
      where: { id: childId },
      data: { currentLevel: next, currentCertificationId: nextCert?.id ?? null },
    });
    await prisma.childMilestone.updateMany({
      where: { childId, milestone: { level: next }, status: "locked" },
      data: { status: "available" },
    });
    if (nextCert) {
      await prisma.childCertification.updateMany({
        where: { childId, certificationId: nextCert.id, status: "locked" },
        data: { status: "available" },
      });
    }
  }

  const lockedCard = await prisma.childCard.findFirst({
    where: { childId, status: "locked" },
    orderBy: { id: "asc" },
  });
  if (lockedCard) {
    await prisma.childCard.update({
      where: { id: lockedCard.id },
      data: { status: "collected", collectedAt: new Date() },
    });
  }

  return { unlockedNextLevel: next, unlockedCardId: lockedCard?.id ?? null };
}
