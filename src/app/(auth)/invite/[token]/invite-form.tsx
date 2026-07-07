"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { acceptInviteAction, type AuthState } from "../../actions";

export function InviteForm({ token, email }: { token: string; email: string }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    acceptInviteAction,
    undefined
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="token" value={token} />
      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-300">{state.error}</p>
      )}
      <div>
        <Label>Email</Label>
        <Input value={email} disabled className="opacity-60" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" name="firstName" required autoComplete="given-name" />
        </div>
        <div>
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" name="lastName" required autoComplete="family-name" />
        </div>
      </div>
      <div>
        <Label htmlFor="password">Create a password</Label>
        <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Setting up..." : "Accept Invite & Log In"}
      </Button>
    </form>
  );
}
