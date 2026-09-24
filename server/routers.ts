import { authRouter } from "./_core/authRouter";
import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";
import { clientRouter } from "./modules/clients/route";
import { machineRouter } from "./modules/machines/route";
import { chantierRouter } from "./modules/chantiers/route";
import { locationRouter } from "./modules/locations/route";
import { pieceRouter } from "./modules/pieces/route";
import { interventionRouter } from "./modules/interventions/route";
import { factureRouter } from "./modules/factures/route";
import { catalogueRouter } from "./modules/catalogue/route";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,

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
