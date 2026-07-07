"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createInquiry(formData: FormData) {
  const get = (key: string) => (formData.get(key) as string | null)?.trim() ?? "";

  await prisma.inquiry.create({
    data: {
      parentFirstName: get("parentFirstName"),
      parentLastName: get("parentLastName"),
      email: get("email"),
      phone: get("phone"),
      childFirstName: get("childFirstName"),
      childAge: Number(get("childAge")) || 0,
      childGrade: get("childGrade"),
      facilitatorType: get("facilitatorType"),
      caregiverName: get("caregiverName") || null,
      city: get("city"),
      state: get("state"),
      zip: get("zip"),
      goal: get("goal"),
      notes: get("notes") || null,
      status: "new",
    },
  });

  redirect("/thank-you");
}
