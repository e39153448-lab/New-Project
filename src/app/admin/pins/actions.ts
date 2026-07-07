"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updatePinName(id: string, name: string) {
  await requireSession("admin");
  await prisma.pin.update({ where: { id }, data: { name } });
  revalidatePath("/admin/pins");
}
