"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { setCertificationStatus } from "@/app/caregiver/children/[childId]/actions";

export function CertificationActions({
  childId,
  certificationId,
  status,
}: {
  childId: string;
  certificationId: string;
  status: "locked" | "available" | "in_progress" | "passed" | "failed";
}) {
  const [pending, startTransition] = useTransition();

  if (status === "locked") {
    return <p className="text-sm text-foreground/40">Complete this level&apos;s milestones to unlock.</p>;
  }
  if (status === "passed") {
    return <p className="text-sm font-medium text-success">Passed — pin and card awarded!</p>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {status === "available" && (
        <Button
          disabled={pending}
          onClick={() => startTransition(() => setCertificationStatus(childId, certificationId, "in_progress"))}
        >
          Start Assessment
        </Button>
      )}
      {status === "in_progress" && (
        <>
          <Button
            disabled={pending}
            onClick={() => startTransition(() => setCertificationStatus(childId, certificationId, "passed"))}
          >
            Mark Passed
          </Button>
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => startTransition(() => setCertificationStatus(childId, certificationId, "available"))}
          >
            Try Again Later
          </Button>
        </>
      )}
    </div>
  );
}
