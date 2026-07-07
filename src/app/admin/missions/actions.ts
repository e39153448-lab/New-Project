"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateMissionTitle(id: string, title: string) {
  await requireSession("admin");
  await prisma.mission.update({ where: { id }, data: { title } });
  revalidatePath("/admin/missions");
}

export async function updateMissionReward(id: string, value: string) {
  await requireSession("admin");
  const rocketFuelReward = Number(value) || 0;
  await prisma.mission.update({ where: { id }, data: { rocketFuelReward } });
  revalidatePath("/admin/missions");
}
