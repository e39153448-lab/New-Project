"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function inviteCaregiver(formData: FormData) {
  const session = await requireSession("parent");

  const childId = formData.get("childId") as string;
  const caregiverEmail = ((formData.get("caregiverEmail") as string) || "").trim().toLowerCase();
  const caregiverName = ((formData.get("caregiverName") as string) || "").trim();

  const child = await prisma.child.findFirst({
    where: { id: childId, family: { parentUserId: session.userId } },
  });
  if (!child) throw new Error("Child not found");

  await prisma.caregiverInvite.create({
    data: {
      familyId: child.familyId,
      childId: child.id,
      caregiverEmail,
      caregiverName: caregiverName || null,
      status: "pending",
    },
  });

  revalidatePath("/parent/invite-caregiver");
}
