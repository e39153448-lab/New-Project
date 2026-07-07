import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const included = [
  "Weekly missions with printed worksheets",
  "Monthly kit: cards, pins, and milestone sheet",
  "Milestone-based diagnostic and progress tracking",
  "Monthly certification assessments",
  "Caregiver training session",
  "Full character card collection to unlock",
];

export default function PricingPage() {
  return (
    <div className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
          Simple, honest pricing
        </h1>
        <p className="mt-4 text-lg text-foreground/70">
          One membership. Everything included. No hidden fees.
        </p>
      </div>

      <Card className="mx-auto mt-14 max-w-lg glow-fuel">
        <CardContent className="p-10 text-center">
          <Badge variant="fuel" className="mb-4">First month free</Badge>
          <div className="font-display text-5xl font-extrabold">
            $150<span className="text-xl font-medium text-foreground/50">/month</span>
          </div>
          <p className="mt-2 text-sm text-foreground/50">
            Billing starts in month 2. Cancel anytime.
          </p>
          <ul className="mt-8 space-y-3 text-left">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <span className="text-foreground/80">{item}</span>
              </li>
            ))}
          </ul>
          <Link href="/inquiry" className="mt-10 block">
            <Button size="lg" className="w-full">Start Free Month</Button>
          </Link>
        </CardContent>
      </Card>

      <p className="mx-auto mt-10 max-w-lg text-center text-sm text-foreground/50">
        Rocket Club Math at Home is a membership, not a one-time purchase — your child keeps
        progressing, and your kit keeps arriving, for as long as you&apos;re a member.
      </p>
    </div>
  );
}
