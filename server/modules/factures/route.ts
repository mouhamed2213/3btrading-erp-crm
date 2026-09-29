import { z } from "zod";
import { adminProcedure, router } from "../../_core/trpc";
import { factureController } from "./controller";

export const factureRouter = router({
  list: adminProcedure.query(() => factureController.list()),

  getById: adminProcedure
    .input(z.string())
    .query(({ input }: { input: string }) => factureController.getById(input)),

  getUnpaid: adminProcedure.query(() => factureController.getUnpaid()),

  create: adminProcedure
    .input(z.any())
    .mutation(({ input }: any) => factureController.create(input)),

  recordPayment: adminProcedure
    .input(z.object({ id: z.string(), montant: z.number(), modePaiement: z.string() }))
    .mutation(({ input }: any) => factureController.recordPayment(input.id, input.montant, input.modePaiement)),

  emit: adminProcedure
    .input(z.string())
    .mutation(({ input }: { input: string }) => factureController.emit(input)),

  addReminder: adminProcedure
    .input(z.string())
    .mutation(({ input }: { input: string }) => factureController.addReminder(input)),
});
