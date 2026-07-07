"use client";

import { useState, useTransition } from "react";
import { X, Lock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { unlockCard } from "@/app/caregiver/children/[childId]/actions";

const rarityColor: Record<string, string> = {
  common: "from-zinc-500 to-zinc-700",
  rare: "from-cosmic-blue to-nebula",
  epic: "from-nebula to-nebula-2",
  legendary: "from-fuel to-nebula-2",
};

export function CardTile({
  childId,
  card,
  collected,
  rocketFuel,
}: {
  childId: string;
  card: { id: string; name: string; rarity: string; rocketFuelCost: number; description: string; superpower: string };
  collected: boolean;
  rocketFuel: number;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const gradient = rarityColor[card.rarity] ?? rarityColor.common;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex flex-col items-center gap-2 rounded-2xl border border-panel-border p-4 text-center transition hover:-translate-y-0.5",
          collected ? `bg-gradient-to-br ${gradient}` : "bg-white/5 grayscale"
        )}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/20 font-display text-2xl font-bold text-white">
          {collected ? card.name.charAt(0) : <Lock className="h-6 w-6 text-foreground/40" />}
        </div>
        <p className={cn("font-display text-sm font-semibold", collected ? "text-white" : "text-foreground/50")}>
          {collected ? card.name : "???"}
        </p>
        {!collected && <p className="text-xs text-foreground/40">{card.rocketFuelCost} RF</p>}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-panel-border bg-panel p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className={cn("flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br font-display text-2xl font-bold text-white", gradient)}>
                {card.name.charAt(0)}
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5 text-foreground/50" />
              </button>
            </div>
            <h3 className="mt-4 font-display text-xl font-bold">{collected ? card.name : "???"}</h3>
            <Badge variant="outline" className="mt-1 capitalize">{card.rarity}</Badge>
            {collected ? (
              <>
                <p className="mt-3 text-sm font-medium text-nebula-2">{card.superpower}</p>
                <p className="mt-1 text-sm text-foreground/60">{card.description}</p>
              </>
            ) : (
              <>
                <p className="mt-3 text-sm text-foreground/60">
                  Unlock this card to reveal its superpower.
                </p>
                <p className="mt-3 text-sm">
                  Cost: <span className="font-semibold text-fuel">{card.rocketFuelCost} Rocket Fuel</span>
                  {" "}(you have {rocketFuel})
                </p>
                {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                <Button
                  className="mt-4 w-full"
                  disabled={pending || rocketFuel < card.rocketFuelCost}
                  onClick={() =>
                    startTransition(async () => {
                      try {
                        await unlockCard(childId, card.id);
                        setOpen(false);
                      } catch (e) {
                        setError(e instanceof Error ? e.message : "Something went wrong.");
                      }
                    })
                  }
                >
                  <Flame className="h-4 w-4" /> Unlock for {card.rocketFuelCost} Rocket Fuel
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
