import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { InlineTextEdit } from "@/components/admin/inline-text-edit";
import { LEVELS } from "@/lib/constants";
import { updateMilestoneTitle, updateMilestoneDescription } from "./actions";

export default async function AdminMilestonesPage() {
  const milestones = await prisma.milestone.findMany({ orderBy: [{ level: "asc" }, { sortOrder: "asc" }] });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Milestones</h1>
        <p className="mt-1 text-sm text-foreground/50">Click any title or description to edit it in place.</p>
      </div>
      {LEVELS.map((level) => {
        const list = milestones.filter((m) => m.level === level);
        if (list.length === 0) return null;
        return (
          <div key={level}>
            <Badge variant="nebula" className="mb-2">{level}</Badge>
            <div className="overflow-x-auto rounded-xl border border-panel-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-panel-border bg-white/5 text-left text-foreground/60">
                    <th className="p-3 w-1/3">Title</th>
                    <th className="p-3">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((m) => (
                    <tr key={m.id} className="border-b border-panel-border/50 last:border-0">
                      <td className="p-3 font-medium">
                        <InlineTextEdit value={m.title} onSave={updateMilestoneTitle.bind(null, m.id)} />
                      </td>
                      <td className="p-3 text-foreground/70">
                        <InlineTextEdit value={m.description} onSave={updateMilestoneDescription.bind(null, m.id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
