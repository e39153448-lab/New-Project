import Link from "next/link";
import {
  ClipboardCheck,
  PhoneCall,
  Users,
  Package,
  Rocket,
  Award,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: ClipboardCheck,
    title: "1. Tell us about your child",
    copy:
      "Fill out a short inquiry with your child's age, grade, and who will be facilitating learning — parent, nanny, grandparent, au pair, or another caregiver.",
  },
  {
    icon: PhoneCall,
    title: "2. Book your Rocket Club call",
    copy:
      "After you submit your inquiry, you'll book a discovery call with our team to talk through your child's goals.",
  },
  {
    icon: Users,
    title: "3. Train your caregiver",
    copy:
      "On the call, we schedule a caregiver training session — a short walkthrough of the app, the milestone system, and how weekly missions work.",
  },
  {
    icon: Package,
    title: "4. Receive your welcome kit",
    copy:
      "A welcome kit ships to your home with printed worksheets, character cards, and the milestone tracking sheet.",
  },
  {
    icon: Rocket,
    title: "5. Start weekly missions",
    copy:
      "The caregiver logs in, runs a quick diagnostic, and Mission Control recommends what to do with your child this week.",
  },
  {
    icon: Award,
    title: "6. Earn cards, pins, and certifications",
    copy:
      "Every month your child sits for a certification. When the caregiver marks it passed, your child earns a pin, Rocket Fuel, and a new card.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">How It Works</h1>
        <p className="mt-4 text-lg text-foreground/70">
          The caregiver gets the guide. The child gets the adventure.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-3xl space-y-6">
        {steps.map((step) => (
          <Card key={step.title}>
            <CardContent className="flex gap-5 p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-nebula to-nebula-2">
                <step.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-1 text-foreground/60">{step.copy}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-3xl text-center">
        <Link href="/inquiry">
          <Button size="lg">
            Start Free Month <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
