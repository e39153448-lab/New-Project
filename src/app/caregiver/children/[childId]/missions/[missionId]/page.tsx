import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  StartMissionButton,
  SectionCompleteButton,
  WorksheetCompleteButton,
  QuestionCard,
} from "@/components/caregiver/mission/action-buttons";
import { Flame, Rocket } from "lucide-react";

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ childId: string; missionId: string }>;
}) {
  const { childId, missionId } = await params;

  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
    include: {
      character: true,
      sections: { orderBy: { sortOrder: "asc" } },
      questions: true,
    },
  });
  if (!mission) notFound();

  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child) notFound();

  const childMission = await prisma.childMission.findUnique({
    where: { childId_missionId: { childId, missionId } },
    include: { childMissionSections: true },
  });

  const isSectionDone = (sectionId: string) =>
    !!childMission?.childMissionSections.find((cs) => cs.missionSectionId === sectionId)?.completedAt;

  const questionsByGrade = new Map<string, typeof mission.questions>();
  for (const q of mission.questions) {
    const list = questionsByGrade.get(q.gradeLevel) ?? [];
    list.push(q);
    questionsByGrade.set(q.gradeLevel, list);
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="fuel">Week {mission.weekNumber}</Badge>
          {mission.character && <Badge variant="nebula">Featuring {mission.character.name}</Badge>}
          {childMission?.status === "completed" && <Badge variant="success">Completed</Badge>}
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold">{mission.title}</h1>
        <p className="mt-1 text-foreground/60">{mission.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-fuel" /> Caregiver Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/70">{mission.caregiverInstructions}</p>
          <div className="mt-4 flex items-center gap-3">
            <StartMissionButton childId={childId} missionId={missionId} started={!!childMission} />
            {childMission && (
              <span className="flex items-center gap-1.5 text-sm text-foreground/50">
                <Flame className="h-4 w-4 text-fuel" /> Mission reward: {mission.rocketFuelReward} Rocket Fuel
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {mission.sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{section.title}</CardTitle>
                <SectionCompleteButton
                  childId={childId}
                  missionId={missionId}
                  missionSectionId={section.id}
                  completed={isSectionDone(section.id)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-foreground/70">{section.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {[...questionsByGrade.entries()].map(([grade, questions]) => (
        <Card key={grade}>
          <CardHeader>
            <CardTitle>{grade} Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {questions.map((q) => (
              <QuestionCard
                key={q.id}
                childId={childId}
                questionId={q.id}
                question={q.question}
                answer={q.answer}
                choices={(q.choices as string[] | null) ?? null}
                rocketFuelReward={q.rocketFuelReward}
              />
            ))}
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="font-display font-semibold">Worksheet</p>
            <p className="text-sm text-foreground/60">
              Once {child.firstName} finishes the printed worksheet for this mission, mark it complete.
            </p>
          </div>
          <WorksheetCompleteButton
            childId={childId}
            missionId={missionId}
            completed={!!childMission?.worksheetCompletedAt}
          />
        </CardContent>
      </Card>
    </div>
  );
}
