"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { MembershipStatus } from "@/generated/prisma/enums";

export async function updateMembershipStatus(id: string, status: string) {
  await requireSession("admin");
  await prisma.family.update({ where: { id }, data: { membershipStatus: status as MembershipStatus } });
  revalidatePath("/admin/families");
  revalidatePath("/admin");
}
