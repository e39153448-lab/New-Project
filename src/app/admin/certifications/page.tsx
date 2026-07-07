import { prisma } from "@/lib/prisma";
import { InlineTextEdit } from "@/components/admin/inline-text-edit";
import { updateCertificationReward } from "./actions";

export default async function AdminCertificationsPage() {
  const certs = await prisma.certification.findMany({
    include: {
      pin: true,
      _count: { select: { certificationMilestones: true, childCertifications: true } },
      childCertifications: { where: { status: "passed" } },
    },
    orderBy: { rocketFuelReward: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Certifications</h1>
      <div className="overflow-x-auto rounded-xl border border-panel-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-panel-border bg-white/5 text-left text-foreground/60">
              <th className="p-3">Name</th>
              <th className="p-3">Level</th>
              <th className="p-3">Pin</th>
              <th className="p-3">Milestones Required</th>
              <th className="p-3">Passed</th>
              <th className="p-3">Rocket Fuel Reward</th>
            </tr>
          </thead>
          <tbody>
            {certs.map((c) => (
              <tr key={c.id} className="border-b border-panel-border/50 last:border-0">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3">{c.level}</td>
                <td className="p-3">{c.pin.name}</td>
                <td className="p-3">{c._count.certificationMilestones}</td>
                <td className="p-3">{c.childCertifications.length}</td>
                <td className="p-3">
                  <InlineTextEdit
                    value={String(c.rocketFuelReward)}
                    onSave={updateCertificationReward.bind(null, c.id)}
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
