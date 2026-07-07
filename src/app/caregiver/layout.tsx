import { requireSession } from "@/lib/auth";
import { DashboardNav } from "@/components/site/dashboard-nav";

const links = [{ href: "/caregiver/dashboard", label: "My Children" }];

export default async function CaregiverLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession("caregiver");

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav links={links} userLabel={session.firstName} badge="Caregiver" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
