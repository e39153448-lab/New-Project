import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CardTile } from "@/components/caregiver/card-tile";

export default async function CardsPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child) notFound();

  const allCards = await prisma.card.findMany({ include: { character: true } });
  const childCards = await prisma.childCard.findMany({ where: { childId } });
  const collectedIds = new Set(childCards.filter((cc) => cc.status === "collected").map((cc) => cc.cardId));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">The Astronites</h1>
          <p className="mt-1 text-foreground/60">
            Collected {collectedIds.size}/{allCards.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
        {allCards.map((card) => (
          <CardTile
            key={card.id}
            childId={childId}
            card={{ ...card, superpower: card.character.superpower }}
            collected={collectedIds.has(card.id)}
            rocketFuel={child.rocketFuel}
          />
        ))}
      </div>
    </div>
  );
}
