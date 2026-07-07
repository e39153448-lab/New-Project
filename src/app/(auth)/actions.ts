"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, hashPassword, roleHome, verifyPassword } from "@/lib/auth";

export type AuthState = { error?: string } | undefined;

export async function loginAction(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Invalid email or password." };
  }

  await createSession({
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });

  redirect(roleHome(user.role));
}

export async function signupAction(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!firstName || !lastName || !email || !password) {
    return { error: "Please fill out every field." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const passwordHash = await hashPassword(password);
  const now = new Date();
  const trialEnd = new Date(now);
  trialEnd.setDate(trialEnd.getDate() + 30);

  const user = await prisma.user.create({
    data: { firstName, lastName, email, passwordHash, role: "parent" },
  });

  await prisma.family.create({
    data: {
      parentUserId: user.id,
      membershipStatus: "free_trial",
      trialStartDate: now,
      trialEndDate: trialEnd,
    },
  });

  await createSession({
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });

  redirect(roleHome(user.role));
}

export async function acceptInviteAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const token = formData.get("token") as string;
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const password = formData.get("password") as string;

  if (!firstName || !lastName || !password) {
    return { error: "Please fill out every field." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const invite = await prisma.caregiverInvite.findUnique({ where: { token } });
  if (!invite || invite.status === "accepted") {
    return { error: "This invite is no longer valid." };
  }

  let user = await prisma.user.findUnique({ where: { email: invite.caregiverEmail } });
  if (!user) {
    const passwordHash = await hashPassword(password);
    user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: invite.caregiverEmail,
        passwordHash,
        role: "caregiver",
      },
    });
  }

  await prisma.childCaregiver.upsert({
    where: { childId_caregiverUserId: { childId: invite.childId, caregiverUserId: user.id } },
    create: { childId: invite.childId, caregiverUserId: user.id },
    update: {},
  });

  await prisma.caregiverInvite.update({
    where: { id: invite.id },
    data: { status: "accepted" },
  });

  await createSession({
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });

  redirect(roleHome(user.role));
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
