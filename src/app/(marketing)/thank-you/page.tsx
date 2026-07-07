import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CALENDLY_URL } from "@/lib/constants";
import { CalendlyRedirect } from "./calendly-redirect";

export default function ThankYouPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-24">
      <Card className="max-w-lg glow-fuel">
        <CardContent className="p-10 text-center">
          <PartyPopper className="mx-auto mb-4 h-10 w-10 text-fuel" />
          <h1 className="font-display text-3xl font-bold">You&apos;re on the launchpad!</h1>
          <p className="mt-3 text-foreground/70">
            Thanks for telling us about your child. Next, book a quick discovery call so we can
            plan your Rocket Club journey together.
          </p>
          <p className="mt-4 text-sm text-foreground/50">
            Redirecting you to Calendly in a moment...
          </p>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="mt-8 block">
            <Button size="lg" className="w-full">Book Your Call Now</Button>
          </a>
          <Link href="/" className="mt-4 block text-sm text-foreground/50 hover:text-foreground">
            Back to homepage
          </Link>
        </CardContent>
      </Card>
      <CalendlyRedirect url={CALENDLY_URL} />
    </div>
  );
}
