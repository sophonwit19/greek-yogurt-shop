
import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// โหลด Environment Variables จากไฟล์ .env
config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  // เชื่อมต่อ Neon PostgreSQL
  datasource: {
    url: env("POSTGRES_URL"),
  },
});
