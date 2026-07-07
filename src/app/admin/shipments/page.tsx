import { prisma } from "@/lib/prisma";
import { InlineSelect } from "@/components/admin/inline-select";
import { updateShipmentStatus } from "./actions";

const STATUS_OPTIONS = ["not_prepared", "preparing", "shipped", "delivered"].map((s) => ({
  value: s,
  label: s.replace(/_/g, " "),
}));

export default async function AdminShipmentsPage() {
  const shipments = await prisma.shipment.findMany({
    include: { child: { include: { family: { include: { parentUser: true } } } }, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Shipments</h1>
      <div className="overflow-x-auto rounded-xl border border-panel-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-panel-border bg-white/5 text-left text-foreground/60">
              <th className="p-3">Child</th>
              <th className="p-3">Family</th>
              <th className="p-3">Month</th>
              <th className="p-3">Items</th>
              <th className="p-3">Tracking #</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((s) => (
              <tr key={s.id} className="border-b border-panel-border/50 last:border-0">
                <td className="p-3 font-medium">{s.child.firstName}</td>
                <td className="p-3">{s.child.family.parentUser.lastName}</td>
                <td className="p-3">{s.month}</td>
                <td className="p-3 text-foreground/60">{s.items.length} items</td>
                <td className="p-3 text-foreground/60">{s.trackingNumber ?? "—"}</td>
                <td className="p-3">
                  <InlineSelect
                    value={s.status}
                    options={STATUS_OPTIONS}
                    onChange={updateShipmentStatus.bind(null, s.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
