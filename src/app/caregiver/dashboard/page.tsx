import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Rocket } from "lucide-react";

export default async function CaregiverDashboardPage() {
  const session = await requireSession("caregiver");

  const links = await prisma.childCaregiver.findMany({
    where: { caregiverUserId: session.userId },
    include: { child: { include: { family: true } } },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Welcome back, {session.firstName}</h1>
        <p className="mt-1 text-foreground/60">Pick a child to open Mission Control.</p>
      </div>

      {links.length === 0 ? (
        <p className="text-foreground/60">No children assigned to you yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {links.map(({ child }) => (
            <Card key={child.id} className="glow-fuel">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{child.firstName}</CardTitle>
                  <Badge variant="nebula">{child.currentLevel}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <Flame className="h-4 w-4 text-fuel" />
                  {child.rocketFuel} Rocket Fuel
                </div>
                <Link href={`/caregiver/children/${child.id}/mission-control`}>
                  <Button className="w-full">
                    <Rocket className="h-4 w-4" /> Open Mission Control
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
