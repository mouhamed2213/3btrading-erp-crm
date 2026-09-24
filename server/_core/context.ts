import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../generated/prisma/client";
import { getSessionTokenFromRequest, verifySessionToken } from "./auth";
import * as db from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    const token = getSessionTokenFromRequest(opts.req);
    if (token) {
      const session = await verifySessionToken(token);
      if (session) {
        user = (await db.getUserById(session.userId)) ?? null;
      }
    }
  } catch {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
