import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatStatus } from "@/lib/constants";
import { Package } from "lucide-react";

const statusVariant: Record<string, "outline" | "fuel" | "nebula" | "success"> = {
  not_prepared: "outline",
  preparing: "fuel",
  shipped: "nebula",
  delivered: "success",
};

export default async function ShipmentsPage() {
  const session = await requireSession("parent");

  const shipments = await prisma.shipment.findMany({
    where: { child: { family: { parentUserId: session.userId } } },
    include: { child: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Shipments</h1>

      {shipments.length === 0 ? (
        <p className="text-foreground/60">No shipments yet.</p>
      ) : (
        <div className="space-y-4">
          {shipments.map((s) => (
            <Card key={s.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-cosmic-blue" />
                    {s.child.firstName}&apos;s {s.month} Kit
                  </CardTitle>
                  <Badge variant={statusVariant[s.status] ?? "outline"}>{formatStatus(s.status)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-1 text-sm text-foreground/60 sm:grid-cols-2">
                  {s.items.map((item) => (
                    <li key={item.id}>
                      {item.quantity}× {item.itemName}
                    </li>
                  ))}
                </ul>
                {s.trackingNumber && (
                  <p className="mt-3 text-xs text-foreground/50">Tracking #: {s.trackingNumber}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
