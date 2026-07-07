import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { inviteCaregiver } from "./actions";

export default async function InviteCaregiverPage() {
  const session = await requireSession("parent");

  const family = await prisma.family.findFirst({
    where: { parentUserId: session.userId },
    include: {
      children: true,
      caregiverInvites: { include: { child: true }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!family) return <p>No family found.</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-3xl font-bold">Invite a Caregiver</h1>

      <Card>
        <CardHeader>
          <CardTitle>Send an invite</CardTitle>
          <CardDescription>
            We&apos;ll generate an invite link. Share it with your nanny, grandparent, or au pair
            so they can create their caregiver account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={inviteCaregiver} className="space-y-4">
            <div>
              <Label htmlFor="childId">Child</Label>
              <Select id="childId" name="childId" required defaultValue={family.children[0]?.id}>
                {family.children.map((c) => (
                  <option key={c.id} value={c.id}>{c.firstName}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="caregiverEmail">Caregiver email</Label>
              <Input id="caregiverEmail" name="caregiverEmail" type="email" required />
            </div>
            <div>
              <Label htmlFor="caregiverName">Caregiver name (optional)</Label>
              <Input id="caregiverName" name="caregiverName" />
            </div>
            <Button type="submit" className="w-full">Send Invite</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invites</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {family.caregiverInvites.length === 0 && (
            <p className="text-sm text-foreground/50">No invites sent yet.</p>
          )}
          {family.caregiverInvites.map((invite) => (
            <div key={invite.id} className="rounded-lg bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{invite.caregiverName || invite.caregiverEmail}</p>
                  <p className="text-xs text-foreground/50">
                    For {invite.child.firstName} · {invite.caregiverEmail}
                  </p>
                </div>
                <Badge variant={invite.status === "accepted" ? "success" : "outline"}>
                  {invite.status === "accepted" ? "Accepted" : "Pending"}
                </Badge>
              </div>
              {invite.status === "pending" && (
                <p className="mt-2 truncate rounded bg-black/30 px-2 py-1 font-mono text-xs text-cosmic-blue">
                  /invite/{invite.token}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
