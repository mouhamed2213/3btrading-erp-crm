import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL ?? ""}`;

if (!connectionString) {
  console.warn("[Database] DATABASE_URL is not configured; database queries will fail until it is provided.");
}

const adapter = new PrismaPg({ connectionString });
let prismaInstance: PrismaClient | undefined;

export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({ adapter });
  }
  return prismaInstance;
}

export async function closePrisma(): Promise<void> {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    prismaInstance = undefined;
  }
}

export const prisma = getPrismaClient();
