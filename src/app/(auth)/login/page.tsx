import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Log in to Rocket Club</CardTitle>
        <CardDescription>
          Parents, caregivers, and admins all log in here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-foreground/60">
          New family?{" "}
          <Link href="/signup" className="font-medium text-nebula-2 hover:underline">
            Create an account
          </Link>
        </p>
        <div className="mt-6 rounded-lg border border-panel-border bg-white/5 p-4 text-xs text-foreground/50">
          <p className="mb-1 font-semibold text-foreground/70">Demo logins</p>
          <p>Admin: admin@rocketclub.com / admin123</p>
          <p>Parent: jamie.chen@example.com / password123</p>
          <p>Caregiver: maria.lopez@example.com / password123</p>
        </div>
      </CardContent>
    </Card>
  );
}
