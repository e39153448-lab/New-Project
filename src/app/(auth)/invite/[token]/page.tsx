import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { InviteForm } from "./invite-form";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await prisma.caregiverInvite.findUnique({
    where: { token },
    include: { child: true, family: true },
  });

  if (!invite || invite.status === "accepted") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Invite not found</CardTitle>
          <CardDescription>
            This invite link is invalid or has already been used. Ask your family to send a new
            invite from their Rocket Club dashboard.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome, {invite.caregiverName || "caregiver"}!</CardTitle>
        <CardDescription>
          You&apos;ve been invited to be {invite.child.firstName}&apos;s caregiver on Rocket Club.
          Set a password to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InviteForm token={token} email={invite.caregiverEmail} />
      </CardContent>
    </Card>
  );
}
