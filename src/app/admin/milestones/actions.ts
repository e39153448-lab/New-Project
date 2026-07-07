"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateMilestoneTitle(id: string, title: string) {
  await requireSession("admin");
  await prisma.milestone.update({ where: { id }, data: { title } });
  revalidatePath("/admin/milestones");
}

export async function updateMilestoneDescription(id: string, description: string) {
  await requireSession("admin");
  await prisma.milestone.update({ where: { id }, data: { description } });
  revalidatePath("/admin/milestones");
}
