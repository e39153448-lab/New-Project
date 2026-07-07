import { prisma } from "@/lib/prisma";

export default async function AdminCaregiversPage() {
  const caregivers = await prisma.user.findMany({
    where: { role: "caregiver" },
    include: { caregiverOf: { include: { child: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Caregivers</h1>
      <div className="overflow-x-auto rounded-xl border border-panel-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-panel-border bg-white/5 text-left text-foreground/60">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Children</th>
            </tr>
          </thead>
          <tbody>
            {caregivers.map((c) => (
              <tr key={c.id} className="border-b border-panel-border/50 last:border-0">
                <td className="p-3 font-medium">{c.firstName} {c.lastName}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.caregiverOf.map((co) => co.child.firstName).join(", ") || "None"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
