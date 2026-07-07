import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatStatus } from "@/lib/constants";
import { CheckCircle2, Circle, Lock } from "lucide-react";

export default async function ChildProfilePage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const session = await requireSession("parent");
  const { childId } = await params;

  const child = await prisma.child.findFirst({
    where: { id: childId, family: { parentUserId: session.userId } },
    include: {
      family: true,
      childMilestones: { include: { milestone: true }, orderBy: { milestone: { sortOrder: "asc" } } },
      childCertifications: { include: { certification: { include: { pin: true } } } },
      childCards: { where: { status: "collected" }, include: { card: true } },
      childCaregivers: { include: { caregiverUser: true } },
    },
  });

  if (!child) notFound();

  const byLevel = new Map<string, typeof child.childMilestones>();
  for (const cm of child.childMilestones) {
    const list = byLevel.get(cm.milestone.level) ?? [];
    list.push(cm);
    byLevel.set(cm.milestone.level, list);
  }

  const earnedPins = child.childCertifications.filter((cc) => cc.status === "passed");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">{child.firstName}</h1>
          <p className="mt-1 text-foreground/60">
            Age {child.age} · {child.currentLevel} · Caregiver:{" "}
            {child.childCaregivers.map((c) => c.caregiverUser.firstName).join(", ") || "Unassigned"}
          </p>
        </div>
        <Badge variant="fuel">{child.rocketFuel} Rocket Fuel</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Milestones by Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[...byLevel.entries()].map(([level, milestones]) => {
            const completed = milestones.filter((m) => m.status === "completed").length;
            return (
              <div key={level}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium">{level}</p>
                  <p className="text-sm text-foreground/60">{completed}/{milestones.length}</p>
                </div>
                <Progress value={(completed / milestones.length) * 100} className="mb-3" />
                <div className="grid gap-2 sm:grid-cols-2">
                  {milestones.map((m) => (
                    <div key={m.id} className="flex items-center gap-2 text-sm text-foreground/70">
                      {m.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                      ) : m.status === "available" ? (
                        <Circle className="h-4 w-4 shrink-0 text-cosmic-blue" />
                      ) : (
                        <Lock className="h-4 w-4 shrink-0 text-foreground/30" />
                      )}
                      {m.milestone.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {child.childCertifications.map((cc) => (
              <div key={cc.id} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <div>
                  <p className="font-medium">{cc.certification.name}</p>
                  <p className="text-xs text-foreground/50">{cc.certification.level}</p>
                </div>
                <Badge variant={cc.status === "passed" ? "success" : cc.status === "in_progress" ? "nebula" : "outline"}>
                  {formatStatus(cc.status)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pins Earned ({earnedPins.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {earnedPins.length === 0 ? (
              <p className="text-sm text-foreground/50">No pins earned yet — keep going!</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {earnedPins.map((cc) => (
                  <Badge key={cc.id} variant="success" className="px-4 py-2">
                    {cc.certification.pin.name}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cards Collected ({child.childCards.length}/24)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {child.childCards.map((cc) => (
              <span
                key={cc.id}
                className="rounded-full bg-gradient-to-br from-nebula to-nebula-2 px-3 py-1 text-xs font-semibold text-white"
              >
                {cc.card.name}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
