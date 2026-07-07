import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-panel-border py-10 text-sm text-foreground/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p>© {new Date().getFullYear()} Rocket Club Math at Home. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/how-it-works" className="hover:text-foreground">How It Works</Link>
          <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
          <Link href="/inquiry" className="hover:text-foreground">Get Started</Link>
        </div>
      </div>
    </footer>
  );
}
