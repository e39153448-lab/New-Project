import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flame, Layers, Award, ClipboardList, CreditCard, Medal, Rocket } from "lucide-react";

export default async function MissionControlPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;

  const child = await prisma.child.findUnique({
    where: { id: childId },
    include: {
      childMilestones: { include: { milestone: true } },
      childCards: { where: { status: "collected" } },
      currentCertification: { include: { pin: true } },
      childMissions: { include: { mission: true } },
    },
  });
  if (!child) notFound();

  const levelMilestones = child.childMilestones.filter((m) => m.milestone.level === child.currentLevel);
  const completedCount = levelMilestones.filter((m) => m.status === "completed").length;

  const allMissions = await prisma.mission.findMany({ orderBy: { weekNumber: "asc" } });
  const nextMission =
    allMissions.find((m) => {
      const cm = child.childMissions.find((x) => x.missionId === m.id);
      return !cm || cm.status !== "completed";
    }) ?? allMissions[0];
  const nextMissionProgress = child.childMissions.find((cm) => cm.missionId === nextMission?.id);

  const cc = child.currentCertification
    ? await prisma.childCertification.findUnique({
        where: { childId_certificationId: { childId, certificationId: child.currentCertification.id } },
      })
    : null;

  const certStatusLabel: Record<string, string> = {
    locked: `${levelMilestones.length - completedCount} milestones to go`,
    available: "Ready for assessment!",
    in_progress: "Assessment in progress",
    passed: "Certified!",
    failed: "Try again soon",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">
          {child.firstName}&apos;s Mission Control
        </h1>
        <p className="mt-1 text-foreground/60">
          {child.firstName} is {child.age} years old · {child.currentLevel}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={Rocket} label="Level" value={child.currentLevel} small />
        <StatCard icon={Flame} label="Rocket Fuel" value={child.rocketFuel.toLocaleString()} />
        <StatCard icon={Layers} label="Cards" value={`${child.childCards.length}/24`} />
        <StatCard icon={Medal} label="Current Pin" value={child.currentCertification?.pin.name ?? "—"} small />
        <StatCard icon={Award} label="Certification" value={cc ? certStatusLabel[cc.status] : "—"} small />
      </div>

      <div>
        <div className="mb-2 flex justify-between text-sm text-foreground/60">
          <span>Milestone Progress ({child.currentLevel})</span>
          <span>{completedCount} of {levelMilestones.length} complete</span>
        </div>
        <Progress value={levelMilestones.length ? (completedCount / levelMilestones.length) * 100 : 0} />
      </div>

      {nextMission && (
        <Card className="glow-fuel">
          <CardContent className="p-6">
            <Badge variant="fuel" className="mb-3">Week {nextMission.weekNumber} Mission</Badge>
            <h2 className="font-display text-xl font-bold">{nextMission.title}</h2>
            <p className="mt-2 text-foreground/70">{nextMission.description}</p>
            <Link href={`/caregiver/children/${childId}/missions/${nextMission.id}`}>
              <Button size="lg" className="mt-6">
                {nextMissionProgress?.status === "in_progress" ? "Continue This Week's Mission" : "Start This Week's Mission"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <QuickLink href={`/caregiver/children/${childId}/milestones`} icon={ClipboardList} label="Update Milestones" />
        <QuickLink href={`/caregiver/children/${childId}/cards`} icon={CreditCard} label="View Cards" />
        <QuickLink href={`/caregiver/children/${childId}/pins`} icon={Medal} label="View Pins" />
        <QuickLink href={`/caregiver/children/${childId}/certification`} icon={Award} label="Certification" />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  small,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <Icon className="mx-auto h-4 w-4 text-fuel" />
        <p className={`mt-1 font-display font-bold ${small ? "text-sm" : "text-lg"}`}>{value}</p>
        <p className="text-xs text-foreground/50">{label}</p>
      </CardContent>
    </Card>
  );
}

function QuickLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <Link href={href}>
      <Card className="h-full transition hover:border-nebula">
        <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
          <Icon className="h-5 w-5 text-cosmic-blue" />
          <span className="text-sm font-medium">{label}</span>
        </CardContent>
      </Card>
    </Link>
  );
}
