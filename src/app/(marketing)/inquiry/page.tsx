import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FACILITATOR_TYPES, GOALS, GRADE_OPTIONS, US_STATES } from "@/lib/constants";
import { createInquiry } from "./actions";

export default function InquiryPage() {
  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-extrabold">Tell us about your child</h1>
        <p className="mt-3 text-foreground/70">
          Takes about 2 minutes. Next, you&apos;ll book a quick call to meet the Rocket Club team.
        </p>
      </div>

      <Card className="mx-auto mt-10 max-w-2xl">
        <CardHeader>
          <CardTitle>Family Inquiry</CardTitle>
          <CardDescription>All fields except notes and caregiver name are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createInquiry} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="parentFirstName">Parent first name</Label>
                <Input id="parentFirstName" name="parentFirstName" required />
              </div>
              <div>
                <Label htmlFor="parentLastName">Parent last name</Label>
                <Input id="parentLastName" name="parentLastName" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" required />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="childFirstName">Child first name</Label>
                <Input id="childFirstName" name="childFirstName" required />
              </div>
              <div>
                <Label htmlFor="childAge">Child age</Label>
                <Input id="childAge" name="childAge" type="number" min={2} max={10} required />
              </div>
            </div>

            <div>
              <Label htmlFor="childGrade">Child grade/level</Label>
              <Select id="childGrade" name="childGrade" required defaultValue="">
                <option value="" disabled>Select a grade or level</option>
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="facilitatorType">Who will facilitate learning?</Label>
                <Select id="facilitatorType" name="facilitatorType" required defaultValue="">
                  <option value="" disabled>Select one</option>
                  {FACILITATOR_TYPES.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="caregiverName">Caregiver name (optional)</Label>
                <Input id="caregiverName" name="caregiverName" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select id="state" name="state" required defaultValue="">
                  <option value="" disabled>State</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="zip">Shipping ZIP</Label>
                <Input id="zip" name="zip" required />
              </div>
            </div>

            <div>
              <Label htmlFor="goal">What are you looking for?</Label>
              <Select id="goal" name="goal" required defaultValue="">
                <option value="" disabled>Select one</option>
                {GOALS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" name="notes" placeholder="Anything else we should know?" />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Submit & Book My Call
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
