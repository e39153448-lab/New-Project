import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MilestoneToggle } from "@/components/caregiver/milestone-toggle";

export default async function DiagnosticPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child) notFound();

  const milestones = await prisma.childMilestone.findMany({
    where: { childId, milestone: { level: child.currentLevel } },
    include: { milestone: true },
    orderBy: { milestone: { sortOrder: "asc" } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Diagnostic: {child.firstName}</h1>
        <p className="mt-1 text-foreground/60">
          Go through each skill below with {child.firstName}. Mark what they can already do —
          this sets their starting point at the {child.currentLevel} level.
        </p>
      </div>

      <div className="space-y-3">
        {milestones.map((cm) => (
          <Card key={cm.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-display font-semibold">{cm.milestone.title}</p>
                <p className="mt-1 text-sm text-foreground/60">{cm.milestone.instructions}</p>
              </div>
              <MilestoneToggle childId={childId} milestoneId={cm.milestoneId} status={cm.status} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What&apos;s next?</CardTitle>
          <CardDescription>
            Once the diagnostic is done, head to Mission Control to start this week&apos;s mission.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
