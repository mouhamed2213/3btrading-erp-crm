import { z } from "zod";
import { publicProcedure, router } from "../../_core/trpc";
import { factureController } from "./controller";

export const factureRouter = router({
  list: publicProcedure.query(() => factureController.list()),

  getById: publicProcedure
    .input(z.string())
    .query(({ input }: { input: string }) => factureController.getById(input)),

  getUnpaid: publicProcedure.query(() => factureController.getUnpaid()),

  create: publicProcedure
    .input(z.any())
    .mutation(({ input }: any) => factureController.create(input)),

  recordPayment: publicProcedure
    .input(z.object({ id: z.string(), montant: z.number(), modePaiement: z.string() }))
    .mutation(({ input }: any) => factureController.recordPayment(input.id, input.montant, input.modePaiement)),

  emit: publicProcedure
    .input(z.string())
    .mutation(({ input }: { input: string }) => factureController.emit(input)),

  addReminder: publicProcedure
    .input(z.string())
    .mutation(({ input }: { input: string }) => factureController.addReminder(input)),
});
