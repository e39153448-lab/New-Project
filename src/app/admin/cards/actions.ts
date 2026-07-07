"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateCardCost(id: string, value: string) {
  await requireSession("admin");
  const rocketFuelCost = Number(value) || 0;
  await prisma.card.update({ where: { id }, data: { rocketFuelCost } });
  revalidatePath("/admin/cards");
}

export async function updateCardRarity(id: string, rarity: string) {
  await requireSession("admin");
  await prisma.card.update({ where: { id }, data: { rarity } });
  revalidatePath("/admin/cards");
}
