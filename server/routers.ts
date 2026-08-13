import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { clientRouter } from "./modules/clients/route";
import { machineRouter } from "./modules/machines/route";
import { chantierRouter } from "./modules/chantiers/route";
import { locationRouter } from "./modules/locations/route";
import { pieceRouter } from "./modules/pieces/route";
import { interventionRouter } from "./modules/interventions/route";
import { factureRouter } from "./modules/factures/route";
import { catalogueRouter } from "./modules/catalogue/route";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // 3BTRADING Modules
  clients: clientRouter,
  machines: machineRouter,
  chantiers: chantierRouter,
  locations: locationRouter,
  pieces: pieceRouter,
  interventions: interventionRouter,
  factures: factureRouter,
  catalogue: catalogueRouter,
});

export type AppRouter = typeof appRouter;
