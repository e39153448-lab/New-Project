"use client";

import { useState, useTransition } from "react";
import { Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function InlineTextEdit({
  value,
  onSave,
  className,
}: {
  value: string;
  onSave: (value: string) => Promise<void>;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [pending, startTransition] = useTransition();

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className={`group flex items-center gap-1.5 text-left ${className ?? ""}`}
      >
        <span>{value}</span>
        <Pencil className="h-3 w-3 opacity-0 transition group-hover:opacity-50" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="h-8 w-40 text-xs"
      />
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await onSave(draft);
            setEditing(false);
          })
        }
      >
        <Check className="h-4 w-4 text-success" />
      </button>
      <button type="button" onClick={() => { setDraft(value); setEditing(false); }}>
        <X className="h-4 w-4 text-foreground/40" />
      </button>
    </div>
  );
}
