"use client";

import { useTransition } from "react";
import { Select } from "@/components/ui/select";

export function InlineSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={value}
      disabled={pending}
      onChange={(e) => startTransition(() => onChange(e.target.value))}
      className="h-9 w-auto py-0 text-xs"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </Select>
  );
}
