import { prisma } from "@/lib/prisma";
import { InlineTextEdit } from "@/components/admin/inline-text-edit";
import { InlineSelect } from "@/components/admin/inline-select";
import { updateCardCost, updateCardRarity } from "./actions";

const RARITY_OPTIONS = ["common", "rare", "epic", "legendary"].map((r) => ({ value: r, label: r }));

export default async function AdminCardsPage() {
  const cards = await prisma.card.findMany({
    include: { character: true, _count: { select: { childCards: true } } },
    orderBy: { rocketFuelCost: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Cards</h1>
        <p className="mt-1 text-sm text-foreground/50">{cards.length} cards in The Astronites set.</p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-panel-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-panel-border bg-white/5 text-left text-foreground/60">
              <th className="p-3">Name</th>
              <th className="p-3">Superpower</th>
              <th className="p-3">Rarity</th>
              <th className="p-3">Rocket Fuel Cost</th>
              <th className="p-3">Owned By</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((c) => (
              <tr key={c.id} className="border-b border-panel-border/50 last:border-0">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-foreground/60">{c.character.superpower}</td>
                <td className="p-3">
                  <InlineSelect value={c.rarity} options={RARITY_OPTIONS} onChange={updateCardRarity.bind(null, c.id)} />
                </td>
                <td className="p-3">
                  <InlineTextEdit value={String(c.rocketFuelCost)} onSave={updateCardCost.bind(null, c.id)} />
                </td>
                <td className="p-3">{c._count.childCards} children</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
