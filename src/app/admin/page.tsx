import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Sparkles,
  CreditCard,
  XCircle,
  Inbox,
  GraduationCap,
  Package,
  Award,
} from "lucide-react";

export default async function AdminOverviewPage() {
  const [
    active,
    freeTrial,
    canceled,
    inquiries,
    trainingsScheduled,
    shipmentsToPrepare,
    certsThisMonth,
  ] = await Promise.all([
    prisma.family.count({ where: { membershipStatus: "active" } }),
    prisma.family.count({ where: { membershipStatus: "free_trial" } }),
    prisma.family.count({ where: { membershipStatus: "canceled" } }),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "training_booked" } }),
    prisma.shipment.count({ where: { status: { in: ["not_prepared", "preparing"] } } }),
    prisma.childCertification.count({
      where: {
        status: "passed",
        passedAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    }),
  ]);

  const cards = [
    { icon: Users, label: "Active Members", value: active },
    { icon: Sparkles, label: "Free Trial Members", value: freeTrial },
    { icon: XCircle, label: "Canceled Members", value: canceled },
    { icon: Inbox, label: "Total Inquiries", value: inquiries },
    { icon: GraduationCap, label: "Caregiver Trainings Scheduled", value: trainingsScheduled },
    { icon: Package, label: "Shipments to Prepare", value: shipmentsToPrepare },
    { icon: Award, label: "Certifications Passed This Month", value: certsThisMonth },
    { icon: CreditCard, label: "Paid Members", value: active },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold">Admin Overview</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-5">
              <c.icon className="h-5 w-5 text-fuel" />
              <p className="mt-3 font-display text-3xl font-bold">{c.value}</p>
              <p className="mt-1 text-sm text-foreground/60">{c.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
