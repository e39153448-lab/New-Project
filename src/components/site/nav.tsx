import Link from "next/link";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-panel-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <Rocket className="h-6 w-6 text-fuel" />
          Rocket Club <span className="text-foreground/50 font-normal hidden sm:inline">at Home</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/70 md:flex">
          <Link href="/how-it-works" className="hover:text-foreground">How It Works</Link>
          <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
          <Link href="/login" className="hover:text-foreground">Log In</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/inquiry">
            <Button size="sm">Start Free Month</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
