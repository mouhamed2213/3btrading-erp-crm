import { Prisma, Role } from "../generated/prisma/client";
import type { User } from "../generated/prisma/client";
import { prisma } from "./db/prisma";
import { ENV } from "./_core/env";

export type InsertUser = {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  role?: Role;
  lastSignedIn?: Date;
};

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  try {
    const data: Prisma.UserUncheckedCreateInput = {
      openId: user.openId,
    };

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      data[field] = value ?? null;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      data.lastSignedIn = user.lastSignedIn;
    } else {
      data.lastSignedIn = new Date();
    }

    if (user.role !== undefined) {
      data.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      data.role = Role.ADMIN;
    }

    const { openId, ...updateData } = data;

    await prisma.user.upsert({
      where: { openId: user.openId },
      create: data,
      update: updateData,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  try {
    const user = await prisma.user.findUnique({ where: { openId } });
    return user ?? undefined;
  } catch (error) {
    console.warn("[Database] Cannot get user:", error);
    return undefined;
  }
}

// TODO: add feature queries here as your schema grows.
