import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed-data";

async function handleSeed(request: NextRequest) {
  const provided = request.headers.get("x-seed-secret") ?? request.nextUrl.searchParams.get("secret");
  const expected = process.env.SEED_SECRET;

  if (!expected) {
    return NextResponse.json({ error: "SEED_SECRET is not configured on the server." }, { status: 500 });
  }
  if (provided !== expected) {
    return NextResponse.json({ error: "Invalid or missing seed secret." }, { status: 401 });
  }

  await seedDatabase(prisma);

  return NextResponse.json({ ok: true, message: "Database seeded with demo data." });
}

export async function GET(request: NextRequest) {
  return handleSeed(request);
}

export async function POST(request: NextRequest) {
  return handleSeed(request);
}
