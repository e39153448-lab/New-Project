import { prisma } from "@/lib/prisma";

export async function assertCaregiverOwnsChild(caregiverUserId: string, childId: string) {
  const link = await prisma.childCaregiver.findUnique({
    where: { childId_caregiverUserId: { childId, caregiverUserId } },
  });
  return !!link;
}
