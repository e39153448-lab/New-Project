import { prisma } from "@/lib/prisma";
import { InlineSelect } from "@/components/admin/inline-select";
import { updateMembershipStatus } from "./actions";

const STATUS_OPTIONS = ["inquiry", "free_trial", "active", "past_due", "canceled"].map((s) => ({
  value: s,
  label: s.replace(/_/g, " "),
}));

export default async function AdminFamiliesPage() {
  const families = await prisma.family.findMany({
    include: { parentUser: true, children: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Families</h1>
      <div className="overflow-x-auto rounded-xl border border-panel-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-panel-border bg-white/5 text-left text-foreground/60">
              <th className="p-3">Parent</th>
              <th className="p-3">Children</th>
              <th className="p-3">Trial Ends</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {families.map((f) => (
              <tr key={f.id} className="border-b border-panel-border/50 last:border-0">
                <td className="p-3">
                  <p className="font-medium">{f.parentUser.firstName} {f.parentUser.lastName}</p>
                  <p className="text-xs text-foreground/50">{f.parentUser.email}</p>
                </td>
                <td className="p-3">{f.children.map((c) => c.firstName).join(", ") || "—"}</td>
                <td className="p-3">
                  {f.trialEndDate ? new Date(f.trialEndDate).toLocaleDateString() : "—"}
                </td>
                <td className="p-3">
                  <InlineSelect
                    value={f.membershipStatus}
                    options={STATUS_OPTIONS}
                    onChange={updateMembershipStatus.bind(null, f.id)}
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
