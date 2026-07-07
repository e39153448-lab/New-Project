import { requireSession } from "@/lib/auth";
import { DashboardNav } from "@/components/site/dashboard-nav";

const links = [
  { href: "/parent/dashboard", label: "Dashboard" },
  { href: "/parent/shipments", label: "Shipments" },
  { href: "/parent/invite-caregiver", label: "Invite Caregiver" },
  { href: "/parent/billing", label: "Billing" },
];

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession("parent");

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav links={links} userLabel={session.firstName} badge="Parent" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
