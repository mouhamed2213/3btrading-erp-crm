import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./server/db/prisma/schema.prisma",
  migrations: {
    path: "./server/db/prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
