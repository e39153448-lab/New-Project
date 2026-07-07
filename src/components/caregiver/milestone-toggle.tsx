"use client";

import { useTransition } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { setMilestoneStatus } from "@/app/caregiver/children/[childId]/actions";

export function MilestoneToggle({
  childId,
  milestoneId,
  status,
}: {
  childId: string;
  milestoneId: string;
  status: "locked" | "available" | "completed";
}) {
  const [pending, startTransition] = useTransition();

  if (status === "locked") {
    return <span className="text-xs font-medium text-foreground/30">Locked</span>;
  }

  const completed = status === "completed";

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={pending || !completed}
        onClick={() => startTransition(() => setMilestoneStatus(childId, milestoneId, "available"))}
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
          !completed
            ? "border-panel-border bg-white/10 text-foreground"
            : "border-panel-border text-foreground/50 hover:bg-white/10"
        )}
      >
        <Circle className="mr-1 inline h-3 w-3" /> Not Yet
      </button>
      <button
        type="button"
        disabled={pending || completed}
        onClick={() => startTransition(() => setMilestoneStatus(childId, milestoneId, "completed"))}
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
          completed
            ? "border-success bg-success/15 text-success"
            : "border-panel-border text-foreground/50 hover:bg-success/15 hover:text-success"
        )}
      >
        <CheckCircle2 className="mr-1 inline h-3 w-3" /> Completed
      </button>
    </div>
  );
}
