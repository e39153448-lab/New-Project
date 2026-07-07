import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatStatus } from "@/lib/constants";

const statusVariant: Record<string, "outline" | "nebula" | "success"> = {
  not_started: "outline",
  in_progress: "nebula",
  completed: "success",
};

export default async function MissionsPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child) notFound();

  const missions = await prisma.mission.findMany({
    orderBy: { weekNumber: "asc" },
    include: { character: true, childMissions: { where: { childId } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Missions</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {missions.map((mission) => {
          const cm = mission.childMissions[0];
          const status = cm?.status ?? "not_started";
          return (
            <Link key={mission.id} href={`/caregiver/children/${childId}/missions/${mission.id}`}>
              <Card className="h-full transition hover:border-nebula">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="fuel">Week {mission.weekNumber}</Badge>
                    <Badge variant={statusVariant[status]}>{formatStatus(status)}</Badge>
                  </div>
                  <CardTitle className="mt-2">{mission.title}</CardTitle>
                  <CardDescription>{mission.theme}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/60">{mission.description}</p>
                  {mission.character && (
                    <p className="mt-3 text-xs text-foreground/50">
                      Featuring {mission.character.name}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
