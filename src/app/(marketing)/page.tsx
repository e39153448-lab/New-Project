import Link from "next/link";
import {
  Rocket,
  Sparkles,
  Package,
  Award,
  Users,
  ClipboardCheck,
  PhoneCall,
  Mail,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CALENDLY_URL } from "@/lib/constants";

const howItWorks = [
  { icon: ClipboardCheck, title: "Tell us about your child", copy: "Share a bit about your child and who will be facilitating learning." },
  { icon: PhoneCall, title: "Book your Rocket Club call", copy: "We'll walk through the program and answer every question on a quick call." },
  { icon: Users, title: "Train your caregiver", copy: "Your caregiver completes a short Rocket Club training session." },
  { icon: Package, title: "Receive your welcome kit", copy: "Printed worksheets, cards, and pins arrive at your door." },
  { icon: Rocket, title: "Start weekly missions", copy: "The caregiver opens the app and follows this week's mission, step by step." },
  { icon: Award, title: "Earn cards, pins, and certifications", copy: "Your child collects Rocket Fuel, cards, and pins as real skills stick." },
];

const perfectFor = ["Nannies", "Parents", "Grandparents", "Au Pairs", "Homeschool Families"];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="star-field relative overflow-hidden px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="nebula" className="mb-6">
            <Sparkles className="h-3.5 w-3.5" /> Ages 3–8 · Built for caregivers
          </Badge>
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-6xl">
            Turn everyday caregiver time into{" "}
            <span className="text-gradient-fuel">meaningful math learning.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/70">
            Rocket Club gives caregivers a weekly plan, printed materials, collectible cards,
            and a proven milestone system so children ages 3–8 build real math confidence at
            home.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/inquiry">
              <Button size="lg">Start Free Month</Button>
            </Link>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">Book a Call</Button>
            </a>
          </div>
          <p className="mt-4 text-sm text-foreground/50">
            First month free, then $150/month. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Explain bullets */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Built for ages 3–8",
            "Designed for caregivers",
            "Child works mostly offline",
            "Caregiver gets digital guidance",
            "Printed worksheets & cards shipped monthly",
            "Monthly certifications and pins",
          ].map((item) => (
            <Card key={item}>
              <CardContent className="flex items-center gap-3 p-5">
                <Rocket className="h-5 w-5 shrink-0 text-fuel" />
                <span className="font-medium">{item}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">
            How It Works
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {howItWorks.map((step, i) => (
              <Card key={step.title} className="relative">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-nebula to-nebula-2 font-display text-lg font-bold">
                    {i + 1}
                  </div>
                  <step.icon className="mb-3 h-6 w-6 text-cosmic-blue" />
                  <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-foreground/60">{step.copy}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Not a screen-time app */}
      <section className="px-6 py-16">
        <Card className="mx-auto max-w-4xl glow-nebula">
          <CardContent className="p-10 text-center">
            <Layers className="mx-auto mb-4 h-8 w-8 text-nebula-2" />
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Not another screen-time app
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-foreground/70">
              The caregiver uses the app. The child uses printed worksheets, physical cards,
              and hands-on activities.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Perfect for */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl font-bold">Perfect for</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {perfectFor.map((who) => (
              <Badge key={who} variant="fuel" className="px-5 py-2 text-sm">
                {who}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-24 pt-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-panel-border bg-gradient-to-br from-nebula/20 to-fuel/10 p-10 text-center">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            You bring the child. Rocket Club brings the plan.
          </h2>
          <p className="mt-3 text-foreground/70">
            A proven math adventure for ages 3–8 — no guessing what to teach next.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/inquiry">
              <Button size="lg">Start Free Month</Button>
            </Link>
            <a href={`mailto:hello@rocketclub.com`}>
              <Button size="lg" variant="ghost">
                <Mail className="h-4 w-4" /> Ask a question
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
