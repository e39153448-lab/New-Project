import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertCaregiverOwnsChild } from "@/lib/queries";

export default async function ChildLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ childId: string }>;
}) {
  const session = await requireSession("caregiver");
  const { childId } = await params;

  const authorized = await assertCaregiverOwnsChild(session.userId, childId);
  if (!authorized) notFound();

  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child) notFound();

  const base = `/caregiver/children/${childId}`;
  const tabs = [
    { href: `${base}/mission-control`, label: "Mission Control" },
    { href: `${base}/diagnostic`, label: "Diagnostic" },
    { href: `${base}/missions`, label: "Missions" },
    { href: `${base}/milestones`, label: "Milestones" },
    { href: `${base}/cards`, label: "Cards" },
    { href: `${base}/pins`, label: "Pins" },
    { href: `${base}/certification`, label: "Certification" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 border-b border-panel-border pb-4">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="rounded-full px-4 py-2 text-sm font-medium text-foreground/60 hover:bg-white/10 hover:text-foreground"
          >
            {t.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
