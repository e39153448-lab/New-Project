import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-lg border border-panel-border bg-white/5 px-4 text-sm text-foreground placeholder:text-foreground/40 outline-none focus:border-nebula focus:ring-2 focus:ring-nebula/30",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
