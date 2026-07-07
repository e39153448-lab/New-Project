import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatMembershipStatus } from "@/lib/constants";
import { Flame, Layers, Award, ArrowRight } from "lucide-react";

export default async function ParentDashboardPage() {
  const session = await requireSession("parent");

  const family = await prisma.family.findFirst({
    where: { parentUserId: session.userId },
    include: {
      children: {
        include: {
          childMilestones: true,
          childCards: true,
          currentCertification: true,
          childCaregivers: { include: { caregiverUser: true } },
        },
      },
    },
  });

  if (!family) {
    return <p>No family found for this account.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Welcome back, {session.firstName}</h1>
          <p className="mt-1 text-foreground/60">Here&apos;s how your family is doing on Rocket Club.</p>
        </div>
        <Badge variant={family.membershipStatus === "active" ? "success" : "fuel"}>
          {formatMembershipStatus(family.membershipStatus)}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {family.children.map((child) => {
          const total = child.childMilestones.length;
          const completed = child.childMilestones.filter((m) => m.status === "completed").length;
          const cardsCollected = child.childCards.filter((c) => c.status === "collected").length;
          const caregiverNames = child.childCaregivers.map((cc) => cc.caregiverUser.firstName).join(", ");

          return (
            <Card key={child.id} className="glow-nebula">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{child.firstName}&apos;s Progress</CardTitle>
                  <Badge variant="nebula">{child.currentLevel}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-white/5 p-3">
                    <Flame className="mx-auto h-4 w-4 text-fuel" />
                    <p className="mt-1 font-display text-lg font-bold">{child.rocketFuel}</p>
                    <p className="text-xs text-foreground/50">Rocket Fuel</p>
                  </div>
                  <div className="rounded-lg bg-white/5 p-3">
                    <Layers className="mx-auto h-4 w-4 text-cosmic-blue" />
                    <p className="mt-1 font-display text-lg font-bold">{cardsCollected}/24</p>
                    <p className="text-xs text-foreground/50">Cards</p>
                  </div>
                  <div className="rounded-lg bg-white/5 p-3">
                    <Award className="mx-auto h-4 w-4 text-nebula-2" />
                    <p className="mt-1 font-display text-lg font-bold">
                      {child.currentCertification ? "In Progress" : "—"}
                    </p>
                    <p className="text-xs text-foreground/50">Certification</p>
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-sm text-foreground/60">
                    <span>Milestones</span>
                    <span>{completed} of {total} complete</span>
                  </div>
                  <Progress value={total ? (completed / total) * 100 : 0} />
                </div>

                <p className="text-sm text-foreground/60">
                  Caregiver: {caregiverNames || "None assigned yet"}
                </p>

                <Link href={`/parent/children/${child.id}`}>
                  <Button variant="outline" className="w-full">
                    View {child.firstName}&apos;s Profile <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/parent/shipments">
          <Card className="h-full transition hover:border-nebula">
            <CardContent className="p-5">
              <h3 className="font-display font-semibold">Shipment Status</h3>
              <p className="mt-1 text-sm text-foreground/60">See where this month&apos;s kit is.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/parent/invite-caregiver">
          <Card className="h-full transition hover:border-nebula">
            <CardContent className="p-5">
              <h3 className="font-display font-semibold">Invite a Caregiver</h3>
              <p className="mt-1 text-sm text-foreground/60">Give a nanny or grandparent access.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/parent/billing">
          <Card className="h-full transition hover:border-nebula">
            <CardContent className="p-5">
              <h3 className="font-display font-semibold">Billing</h3>
              <p className="mt-1 text-sm text-foreground/60">Manage your membership.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
