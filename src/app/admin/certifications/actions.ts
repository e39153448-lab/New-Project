"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateCertificationReward(id: string, value: string) {
  await requireSession("admin");
  const rocketFuelReward = Number(value) || 0;
  await prisma.certification.update({ where: { id }, data: { rocketFuelReward } });
  revalidatePath("/admin/certifications");
}
