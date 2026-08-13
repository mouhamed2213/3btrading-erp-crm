import { z } from "zod";
import { publicProcedure, router } from "../../_core/trpc";
import { machineController } from "./controller";

export const machineRouter = router({
  list: publicProcedure.query(() => machineController.list()),

  getById: publicProcedure
    .input(z.string())
    .query(({ input }: { input: string }) => machineController.getById(input)),

  getAvailable: publicProcedure.query(() => machineController.getAvailable()),

  getForSale: publicProcedure.query(() => machineController.getForSale()),

  getByType: publicProcedure
    .input(z.string())
    .query(({ input }: { input: string }) => machineController.getByType(input)),

  getByMarque: publicProcedure
    .input(z.string())
    .query(({ input }: { input: string }) => machineController.getByMarque(input)),

  create: publicProcedure
    .input(
      z.object({
        id: z.string(),
        nom: z.string(),
        type: z.string(),
        marque: z.string(),
        modele: z.string().optional(),
        annee: z.number().optional(),
        tarifJournalier: z.number(),
        tarifRotation: z.number().optional(),
        tarifDegressif: z.number().optional(),
        prixVente: z.number().optional(),
        enVente: z.boolean().optional(),
        enLocation: z.boolean().optional(),
      })
    )
    .mutation(({ input }: any) => machineController.create(input)),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.any(),
      })
    )
    .mutation(({ input }: any) => machineController.update(input.id, input.data)),

  delete: publicProcedure
    .input(z.string())
    .mutation(({ input }: { input: string }) => machineController.delete(input)),

  setStatut: publicProcedure
    .input(
      z.object({
        id: z.string(),
        statut: z.enum(["DISPONIBLE", "EN_LOCATION", "EN_MAINTENANCE", "VENDUE"]),
      })
    )
    .mutation(({ input }: any) => machineController.setStatut(input.id, input.statut)),

  calculateDegressiveRate: publicProcedure
    .input(
      z.object({
        jours: z.number(),
        tarifJournalier: z.number(),
        tarifDegressif: z.number().optional(),
      })
    )
    .query(({ input }: any) =>
      machineController.calculateDegressiveRate(input.jours, input.tarifJournalier, input.tarifDegressif)
    ),
});
