import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MilestoneToggle } from "@/components/caregiver/milestone-toggle";
import { LEVELS } from "@/lib/constants";

export default async function MilestonesPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child) notFound();

  const milestones = await prisma.childMilestone.findMany({
    where: { childId },
    include: { milestone: true },
    orderBy: { milestone: { sortOrder: "asc" } },
  });

  const byLevel = new Map<string, typeof milestones>();
  for (const cm of milestones) {
    const list = byLevel.get(cm.milestone.level) ?? [];
    list.push(cm);
    byLevel.set(cm.milestone.level, list);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Milestones</h1>
        <p className="mt-1 text-foreground/60">
          {child.firstName}&apos;s full milestone map, level by level.
        </p>
      </div>

      {LEVELS.map((level) => {
        const list = byLevel.get(level) ?? [];
        if (list.length === 0) return null;
        const completed = list.filter((m) => m.status === "completed").length;
        const isCurrent = level === child.currentLevel;

        return (
          <Card key={level}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{level}</CardTitle>
                <div className="flex items-center gap-2">
                  {isCurrent && <Badge variant="nebula">Current Level</Badge>}
                  <span className="text-sm text-foreground/60">{completed}/{list.length}</span>
                </div>
              </div>
              <Progress value={(completed / list.length) * 100} className="mt-2" />
            </CardHeader>
            <CardContent className="space-y-3">
              {list.map((cm) => (
                <div
                  key={cm.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white/5 p-3"
                >
                  <div>
                    <p className="font-medium">{cm.milestone.title}</p>
                    <p className="text-xs text-foreground/50">{cm.milestone.description}</p>
                  </div>
                  <MilestoneToggle childId={childId} milestoneId={cm.milestoneId} status={cm.status} />
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
