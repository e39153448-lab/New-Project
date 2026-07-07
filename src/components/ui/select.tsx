import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-lg border border-panel-border bg-white/5 px-4 text-sm text-foreground outline-none focus:border-nebula focus:ring-2 focus:ring-nebula/30",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
