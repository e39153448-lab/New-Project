"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ShipmentStatus } from "@/generated/prisma/enums";

export async function updateShipmentStatus(id: string, status: string) {
  await requireSession("admin");
  await prisma.shipment.update({ where: { id }, data: { status: status as ShipmentStatus } });
  revalidatePath("/admin/shipments");
  revalidatePath("/admin");
}
