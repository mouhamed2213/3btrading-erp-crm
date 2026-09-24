import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Role } from "../../generated/prisma/client";
import * as db from "../db";
import { createSessionToken, hashPassword, verifyPassword } from "./auth";
import { getSessionCookieOptions } from "./cookies";
import { publicProcedure, router } from "./trpc";

const emailSchema = z.string().trim().toLowerCase().email();
const passwordSchema = z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères.");

export const authRouter = router({
  me: publicProcedure.query(opts => opts.ctx.user),

  // Registration is open only until the first user exists, then requires an
  // existing admin session — so a fresh deployment can bootstrap its first
  // account, but the public can't self-register admin users afterwards.
  register: publicProcedure
    .input(
      z.object({
        email: emailSchema,
        password: passwordSchema,
        name: z.string().trim().min(1).max(120).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingUsersCount = await db.countUsers();
      const isFirstUser = existingUsersCount === 0;

      if (!isFirstUser && ctx.user?.role !== Role.ADMIN) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Seul un administrateur peut créer de nouveaux comptes.",
        });
      }

      const existing = await db.getUserByEmail(input.email);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Un compte existe déjà avec cet email.",
        });
      }

      const passwordHash = await hashPassword(input.password);
      const user = await db.createUser({
        email: input.email,
        passwordHash,
        name: input.name,
        role: isFirstUser ? Role.ADMIN : Role.USER,
      });

      // Auto-login only the very first (bootstrap admin) account. Accounts
      // created by an admin for someone else should not hijack the admin's
      // session.
      if (isFirstUser) {
        const sessionToken = await createSessionToken(user.id);
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      }

      return { id: user.id, email: user.email, name: user.name, role: user.role };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: emailSchema,
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await db.getUserByEmail(input.email);
      const genericError = new TRPCError({
        code: "UNAUTHORIZED",
        message: "Email ou mot de passe incorrect.",
      });

      if (!user) throw genericError;

      const valid = await verifyPassword(input.password, user.passwordHash);
      if (!valid) throw genericError;

      await db.touchLastSignedIn(user.id);

      const sessionToken = await createSessionToken(user.id);
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      return { id: user.id, email: user.email, name: user.name, role: user.role };
    }),

  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true } as const;
  }),
});
