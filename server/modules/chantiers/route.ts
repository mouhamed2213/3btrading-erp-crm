import { z } from "zod";
import { publicProcedure, router } from "../../_core/trpc";
import { chantierController } from "./controller";

export const chantierRouter = router({
  list: publicProcedure.query(() => chantierController.list()),

  getById: publicProcedure
    .input(z.string())
    .query(({ input }: { input: string }) => chantierController.getById(input)),

  getByClient: publicProcedure
    .input(z.string())
    .query(({ input }: { input: string }) => chantierController.getByClient(input)),

  getActive: publicProcedure.query(() => chantierController.getActive()),

  create: publicProcedure
    .input(z.any())
    .mutation(({ input }: any) => chantierController.create(input)),

  update: publicProcedure
    .input(z.object({ id: z.string(), data: z.any() }))
    .mutation(({ input }: any) => chantierController.update(input.id, input.data)),

  delete: publicProcedure
    .input(z.string())
    .mutation(({ input }: { input: string }) => chantierController.delete(input)),

  calculateMontant: publicProcedure
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
