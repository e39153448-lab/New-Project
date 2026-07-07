import Link from "next/link";
import { Rocket, LogOut } from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";

export function DashboardNav({
  links,
  userLabel,
  badge,
}: {
  links: { href: string; label: string }[];
  userLabel: string;
  badge?: string;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-panel-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <Rocket className="h-6 w-6 text-fuel" />
            Rocket Club
          </Link>
          {badge && (
            <span className="hidden rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground/60 sm:inline">
              {badge}
            </span>
          )}
        </div>
        <nav className="flex flex-wrap items-center gap-1 text-sm font-medium text-foreground/70">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-2 hover:bg-white/10 hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="text-sm text-foreground/60">{userLabel}</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-full border border-panel-border px-3 py-2 text-sm text-foreground/70 hover:bg-white/10 hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" /> Log Out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
