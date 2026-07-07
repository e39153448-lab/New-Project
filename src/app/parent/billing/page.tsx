import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMembershipStatus, MEMBERSHIP_PRICE } from "@/lib/constants";
import { CreditCard } from "lucide-react";

export default async function BillingPage() {
  const session = await requireSession("parent");
  const family = await prisma.family.findFirst({ where: { parentUserId: session.userId } });

  if (!family) return <p>No family found.</p>;

  const trialEnd = family.trialEndDate ? new Date(family.trialEndDate) : null;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-3xl font-bold">Billing</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Membership Status</CardTitle>
            <Badge variant={family.membershipStatus === "active" ? "success" : "fuel"}>
              {formatMembershipStatus(family.membershipStatus)}
            </Badge>
          </div>
          <CardDescription>
            Rocket Club Math at Home — ${MEMBERSHIP_PRICE}/month, first month free.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {family.membershipStatus === "free_trial" && trialEnd && (
            <p className="text-sm text-foreground/70">
              Your free trial ends on{" "}
              <span className="font-medium text-foreground">
                {trialEnd.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              . Your card will then be charged ${MEMBERSHIP_PRICE}/month.
            </p>
          )}
          {family.membershipStatus === "active" && (
            <p className="text-sm text-foreground/70">
              Your membership is active. You&apos;ll be billed ${MEMBERSHIP_PRICE} each month.
            </p>
          )}
          <div className="flex items-center gap-3 rounded-lg border border-panel-border bg-white/5 p-4">
            <CreditCard className="h-5 w-5 text-foreground/50" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                {family.stripeCustomerId ? "Payment method on file" : "No payment method on file yet"}
              </p>
              <p className="text-xs text-foreground/50">Stripe billing integration coming soon.</p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Manage Billing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
