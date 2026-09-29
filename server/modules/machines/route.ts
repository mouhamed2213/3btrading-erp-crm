import { Brand, EngineType } from "@shared/enums";
import { z } from "zod";
import { adminProcedure, router } from "../../_core/trpc";
import { machineController } from "./controller";

export const machineRouter = router({
  list: adminProcedure.query(() => machineController.list()),

  getById: adminProcedure
    .input(z.string())
    .query(({ input }: { input: string }) => machineController.getById(input)),

  getAvailable: adminProcedure.query(() => machineController.getAvailable()),

  getForSale: adminProcedure.query(() => machineController.getForSale()),

  getByType: adminProcedure
    .input(z.enum(EngineType))
    .query(({ input }: { input: EngineType }) =>
      machineController.getByType(input)
    ),

  getByMarque: adminProcedure
    .input(z.enum(Brand))
    .query(({ input }: { input: Brand }) =>
      machineController.getByMarque(input)
    ),

  create: adminProcedure
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

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.any(),
      })
    )
    .mutation(({ input }: any) =>
      machineController.update(input.id, input.data)
    ),

  delete: adminProcedure
    .input(z.string())
    .mutation(({ input }: { input: string }) =>
      machineController.delete(input)
    ),

  setStatut: adminProcedure
    .input(
      z.object({
        id: z.string(),
        statut: z.enum([
          "DISPONIBLE",
          "EN_LOCATION",
          "EN_MAINTENANCE",
          "VENDUE",
        ]),
      })
    )
    .mutation(({ input }: any) =>
      machineController.setStatut(input.id, input.statut)
    ),

  calculateDegressiveRate: adminProcedure
    .input(
      z.object({
        jours: z.number(),
        tarifJournalier: z.number(),
        tarifDegressif: z.number().optional(),
      })
    )
    .query(({ input }: any) =>
      machineController.calculateDegressiveRate(
        input.jours,
        input.tarifJournalier,
        input.tarifDegressif
      )
    ),
});
