import { prisma } from "@/lib/prisma";
import { InlineTextEdit } from "@/components/admin/inline-text-edit";
import { updatePinName } from "./actions";

export default async function AdminPinsPage() {
  const pins = await prisma.pin.findMany({
    include: { certifications: { include: { childCertifications: { where: { status: "passed" } } } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Pins</h1>
      <div className="overflow-x-auto rounded-xl border border-panel-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-panel-border bg-white/5 text-left text-foreground/60">
              <th className="p-3">Name</th>
              <th className="p-3">Level</th>
              <th className="p-3">Description</th>
              <th className="p-3">Earned By</th>
            </tr>
          </thead>
          <tbody>
            {pins.map((p) => {
              const earnedCount = p.certifications.reduce((sum, c) => sum + c.childCertifications.length, 0);
              return (
                <tr key={p.id} className="border-b border-panel-border/50 last:border-0">
                  <td className="p-3 font-medium">
                    <InlineTextEdit value={p.name} onSave={updatePinName.bind(null, p.id)} />
                  </td>
                  <td className="p-3">{p.level}</td>
                  <td className="p-3 text-foreground/60">{p.description}</td>
                  <td className="p-3">{earnedCount} children</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
