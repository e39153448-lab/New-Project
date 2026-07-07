import { prisma } from "@/lib/prisma";
import { InlineSelect } from "@/components/admin/inline-select";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LEVELS } from "@/lib/constants";
import { updateChildLevel, assignCaregiver } from "./actions";

export default async function AdminChildrenPage() {
  const [children, caregivers] = await Promise.all([
    prisma.child.findMany({
      include: { family: { include: { parentUser: true } }, childCaregivers: { include: { caregiverUser: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({ where: { role: "caregiver" } }),
  ]);

  const levelOptions = LEVELS.map((l) => ({ value: l, label: l }));

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Children</h1>
      <div className="overflow-x-auto rounded-xl border border-panel-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-panel-border bg-white/5 text-left text-foreground/60">
              <th className="p-3">Child</th>
              <th className="p-3">Family</th>
              <th className="p-3">Level</th>
              <th className="p-3">Rocket Fuel</th>
              <th className="p-3">Caregiver</th>
              <th className="p-3">Assign Caregiver</th>
            </tr>
          </thead>
          <tbody>
            {children.map((child) => (
              <tr key={child.id} className="border-b border-panel-border/50 last:border-0">
                <td className="p-3 font-medium">{child.firstName} ({child.age})</td>
                <td className="p-3">{child.family.parentUser.firstName} {child.family.parentUser.lastName}</td>
                <td className="p-3">
                  <InlineSelect
                    value={child.currentLevel}
                    options={levelOptions}
                    onChange={updateChildLevel.bind(null, child.id)}
                  />
                </td>
                <td className="p-3">{child.rocketFuel}</td>
                <td className="p-3">
                  {child.childCaregivers.map((cc) => cc.caregiverUser.firstName).join(", ") || "Unassigned"}
                </td>
                <td className="p-3">
                  <form action={assignCaregiver.bind(null, child.id)} className="flex gap-2">
                    <Select name="caregiverUserId" className="h-9 w-auto py-0 text-xs" defaultValue="">
                      <option value="" disabled>Choose caregiver</option>
                      {caregivers.map((c) => (
                        <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                      ))}
                    </Select>
                    <Button size="sm" type="submit">Assign</Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
