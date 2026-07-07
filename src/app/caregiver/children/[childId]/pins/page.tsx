import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Medal, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function PinsPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child) notFound();

  const childCerts = await prisma.childCertification.findMany({
    where: { childId },
    include: { certification: { include: { pin: true } } },
    orderBy: { certification: { rocketFuelReward: "asc" } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Pins</h1>
        <p className="mt-1 text-foreground/60">
          Earned by passing certifications — one pin per level.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {childCerts.map((cc) => {
          const earned = cc.status === "passed";
          const current = cc.certification.id === child.currentCertificationId && !earned;
          return (
            <Card key={cc.id} className={cn(earned && "glow-fuel")}>
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                <div
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full",
                    earned ? "bg-gradient-to-br from-fuel to-nebula-2" : "bg-white/10"
                  )}
                >
                  {earned ? (
                    <Medal className="h-8 w-8 text-white" />
                  ) : (
                    <Lock className="h-6 w-6 text-foreground/30" />
                  )}
                </div>
                <p className="font-display font-semibold">{cc.certification.pin.name}</p>
                <p className="text-xs text-foreground/50">{cc.certification.level}</p>
                {earned && <Badge variant="success">Earned</Badge>}
                {current && <Badge variant="nebula">In Progress</Badge>}
                {!earned && !current && <Badge variant="outline">Locked</Badge>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
