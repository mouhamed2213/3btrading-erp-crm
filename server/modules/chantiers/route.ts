import { z } from "zod";
import { adminProcedure, router } from "../../_core/trpc";
import { chantierController } from "./controller";

export const chantierRouter = router({
  list: adminProcedure.query(() => chantierController.list()),

  getById: adminProcedure
    .input(z.string())
    .query(({ input }: { input: string }) => chantierController.getById(input)),

  getByClient: adminProcedure
    .input(z.string())
    .query(({ input }: { input: string }) => chantierController.getByClient(input)),

  getActive: adminProcedure.query(() => chantierController.getActive()),

  create: adminProcedure
    .input(z.any())
    .mutation(({ input }: any) => chantierController.create(input)),

  update: adminProcedure
    .input(z.object({ id: z.string(), data: z.any() }))
    .mutation(({ input }: any) => chantierController.update(input.id, input.data)),

  delete: adminProcedure
    .input(z.string())
    .mutation(({ input }: { input: string }) => chantierController.delete(input)),

  calculateMontant: adminProcedure
    .input(
      z.object({
        modeFacturation: z.string(),
        montantEstime: z.number(),
        volume: z.number().optional(),
        heures: z.number().optional(),
        jours: z.number().optional(),
      })
    )
    .query(({ input }: any) =>
      chantierController.calculateMontant(input.modeFacturation, input.montantEstime, input.volume, input.heures, input.jours)
    ),
});
