import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@ma-criniere.com" },
    create: {
      email: "admin@ma-criniere.com",
      passwordHash: hash,
      name: "Super Admin",
      role: "SUPER_ADMIN",
    },
    update: {},
  });

  await prisma.shippingZone.createMany({
    data: [
      { name: "Express 24h (70 km)", code: "express-24", price: 15, delay: "24h" },
      { name: "Express 48h", code: "express-48", price: 10, delay: "48h" },
      { name: "Standard", code: "standard", price: 5, delay: "48-72h" },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
