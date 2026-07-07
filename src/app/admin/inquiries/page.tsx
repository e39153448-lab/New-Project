import { prisma } from "@/lib/prisma";
import { InlineSelect } from "@/components/admin/inline-select";
import { updateInquiryStatus } from "./actions";

const STATUS_OPTIONS = [
  "new",
  "contacted",
  "call_booked",
  "training_booked",
  "enrolled",
  "lost",
].map((s) => ({ value: s, label: s.replace(/_/g, " ") }));

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Inquiries</h1>
      <div className="overflow-x-auto rounded-xl border border-panel-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-panel-border bg-white/5 text-left text-foreground/60">
              <th className="p-3">Parent</th>
              <th className="p-3">Child</th>
              <th className="p-3">Grade</th>
              <th className="p-3">Facilitator</th>
              <th className="p-3">Location</th>
              <th className="p-3">Goal</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq.id} className="border-b border-panel-border/50 last:border-0">
                <td className="p-3">
                  <p className="font-medium">{inq.parentFirstName} {inq.parentLastName}</p>
                  <p className="text-xs text-foreground/50">{inq.email} · {inq.phone}</p>
                </td>
                <td className="p-3">{inq.childFirstName} ({inq.childAge})</td>
                <td className="p-3">{inq.childGrade}</td>
                <td className="p-3 capitalize">{inq.facilitatorType.replace(/_/g, " ")}</td>
                <td className="p-3">{inq.city}, {inq.state} {inq.zip}</td>
                <td className="p-3 capitalize">{inq.goal.replace(/_/g, " ")}</td>
                <td className="p-3">
                  <InlineSelect
                    value={inq.status}
                    options={STATUS_OPTIONS}
                    onChange={updateInquiryStatus.bind(null, inq.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
