"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { InquiryStatus } from "@/generated/prisma/enums";

export async function updateInquiryStatus(id: string, status: string) {
  await requireSession("admin");
  await prisma.inquiry.update({ where: { id }, data: { status: status as InquiryStatus } });
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}
