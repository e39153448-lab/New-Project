import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create your family account</CardTitle>
        <CardDescription>Your first month is free — no credit card required today.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
        <p className="mt-6 text-center text-sm text-foreground/60">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-nebula-2 hover:underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
