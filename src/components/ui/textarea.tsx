import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-24 w-full rounded-lg border border-panel-border bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 outline-none focus:border-nebula focus:ring-2 focus:ring-nebula/30",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
