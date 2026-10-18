
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

// เชื่อมต่อฐานข้อมูล PostgreSQL บน Neon
const adapter = new PrismaPg({
  connectionString: process.env.POSTGRES_URL!,
});

// สร้าง Prisma Client สำหรับจัดการฐานข้อมูล
const prisma = new PrismaClient({
  adapter,
});

export default prisma;
