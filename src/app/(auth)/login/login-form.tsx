"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginAction, type AuthState } from "../actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-300">{state.error}</p>
      )}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Logging in..." : "Log In"}
      </Button>
    </form>
  );
}
