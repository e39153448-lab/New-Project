"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateChildLevel(childId: string, level: string) {
  await requireSession("admin");
  const cert = await prisma.certification.findFirst({ where: { level } });
  await prisma.child.update({
    where: { id: childId },
    data: { currentLevel: level, gradeLevel: level, currentCertificationId: cert?.id ?? null },
  });
  revalidatePath("/admin/children");
}

export async function assignCaregiver(childId: string, formData: FormData) {
  await requireSession("admin");
  const caregiverUserId = formData.get("caregiverUserId") as string;
  if (!caregiverUserId) return;
  await prisma.childCaregiver.upsert({
    where: { childId_caregiverUserId: { childId, caregiverUserId } },
    create: { childId, caregiverUserId },
    update: {},
  });
  revalidatePath("/admin/children");
  revalidatePath("/admin/caregivers");
}
