import { requireSession } from "@/lib/auth";
import { DashboardNav } from "@/components/site/dashboard-nav";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/families", label: "Families" },
  { href: "/admin/children", label: "Children" },
  { href: "/admin/caregivers", label: "Caregivers" },
  { href: "/admin/missions", label: "Missions" },
  { href: "/admin/milestones", label: "Milestones" },
  { href: "/admin/certifications", label: "Certifications" },
  { href: "/admin/cards", label: "Cards" },
  { href: "/admin/pins", label: "Pins" },
  { href: "/admin/shipments", label: "Shipments" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession("admin");

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav links={links} userLabel={session.firstName} badge="Admin" />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
