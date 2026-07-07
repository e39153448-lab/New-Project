import { prisma } from "@/lib/prisma";
import { InlineTextEdit } from "@/components/admin/inline-text-edit";
import { updateMissionTitle, updateMissionReward } from "./actions";

export default async function AdminMissionsPage() {
  const missions = await prisma.mission.findMany({
    include: { character: true, _count: { select: { questions: true, sections: true } } },
    orderBy: { weekNumber: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Missions</h1>
      <div className="overflow-x-auto rounded-xl border border-panel-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-panel-border bg-white/5 text-left text-foreground/60">
              <th className="p-3">Week</th>
              <th className="p-3">Title</th>
              <th className="p-3">Level</th>
              <th className="p-3">Character</th>
              <th className="p-3">Sections</th>
              <th className="p-3">Questions</th>
              <th className="p-3">Rocket Fuel Reward</th>
            </tr>
          </thead>
          <tbody>
            {missions.map((m) => (
              <tr key={m.id} className="border-b border-panel-border/50 last:border-0">
                <td className="p-3">{m.weekNumber}</td>
                <td className="p-3 font-medium">
                  <InlineTextEdit value={m.title} onSave={updateMissionTitle.bind(null, m.id)} />
                </td>
                <td className="p-3">{m.level}</td>
                <td className="p-3">{m.character?.name ?? "—"}</td>
                <td className="p-3">{m._count.sections}</td>
                <td className="p-3">{m._count.questions}</td>
                <td className="p-3">
                  <InlineTextEdit
                    value={String(m.rocketFuelReward)}
                    onSave={updateMissionReward.bind(null, m.id)}
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
