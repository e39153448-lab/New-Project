import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CertificationActions } from "@/components/caregiver/certification-actions";
import { formatStatus } from "@/lib/constants";
import { CheckCircle2, Circle } from "lucide-react";

const statusVariant: Record<string, "outline" | "fuel" | "nebula" | "success"> = {
  locked: "outline",
  available: "fuel",
  in_progress: "nebula",
  passed: "success",
  failed: "outline",
};

export default async function CertificationPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child) notFound();

  const childCerts = await prisma.childCertification.findMany({
    where: { childId },
    include: {
      certification: {
        include: {
          pin: true,
          certificationMilestones: { include: { milestone: true } },
        },
      },
    },
    orderBy: { certification: { rocketFuelReward: "asc" } },
  });

  const milestoneStatuses = await prisma.childMilestone.findMany({ where: { childId } });
  const statusByMilestoneId = new Map(milestoneStatuses.map((m) => [m.milestoneId, m.status]));

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Certifications</h1>

      <div className="space-y-4">
        {childCerts.map((cc) => (
          <Card key={cc.id} className={cc.certificationId === child.currentCertificationId ? "glow-nebula" : ""}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle>{cc.certification.name}</CardTitle>
                  <CardDescription>{cc.certification.description}</CardDescription>
                </div>
                <Badge variant={statusVariant[cc.status]}>{formatStatus(cc.status)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-foreground/70">Required milestones</p>
                <div className="grid gap-1 sm:grid-cols-2">
                  {cc.certification.certificationMilestones.map((cm) => {
                    const done = statusByMilestoneId.get(cm.milestoneId) === "completed";
                    return (
                      <div key={cm.id} className="flex items-center gap-2 text-sm text-foreground/60">
                        {done ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <Circle className="h-4 w-4 text-foreground/30" />
                        )}
                        {cm.milestone.title}
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className="text-sm text-foreground/50">
                Reward: {cc.certification.rocketFuelReward} Rocket Fuel + {cc.certification.pin.name} pin
              </p>
              <CertificationActions childId={childId} certificationId={cc.certificationId} status={cc.status} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
