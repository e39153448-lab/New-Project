import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedDatabase } from "../src/lib/seed-data";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

seedDatabase(prisma)
  .then(() => {
    console.log("---");
    console.log("Demo logins (password shown in parens):");
    console.log("  Admin:     admin@rocketclub.com (admin123)");
    console.log("  Parent:    jamie.chen@example.com (password123)");
    console.log("  Caregiver: maria.lopez@example.com (password123)");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
