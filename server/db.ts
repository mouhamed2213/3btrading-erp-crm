import type { Role, User } from "../generated/prisma/client";
import { prisma } from "./db/prisma";

export type CreateUserInput = {
  email: string;
  passwordHash: string;
  name?: string | null;
  role?: Role;
};

export async function createUser(input: CreateUserInput): Promise<User> {
  return prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      name: input.name ?? null,
      role: input.role,
    },
  });
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  return user ?? undefined;
}

export async function getUserById(id: number): Promise<User | undefined> {
  const user = await prisma.user.findUnique({ where: { id } });
  return user ?? undefined;
}

export async function touchLastSignedIn(id: number): Promise<void> {
  await prisma.user.update({
    where: { id },
    data: { lastSignedIn: new Date() },
  });
}

export async function countUsers(): Promise<number> {
  return prisma.user.count();
}

// TODO: add feature queries here as your schema grows.
