import { z } from "zod";
import { adminProcedure, router } from "../../_core/trpc";
import { locationController } from "./controller";

export const locationRouter = router({
  list: adminProcedure.query(() => locationController.list()),

  getById: adminProcedure
    .input(z.string())
    .query(({ input }: { input: string }) => locationController.getById(input)),

  getActive: adminProcedure.query(() => locationController.getActive()),

  create: adminProcedure
    .input(z.any())
    .mutation(({ input }: any) => locationController.create(input)),

  recordPayment: adminProcedure
    .input(z.object({ id: z.string(), montant: z.number(), modePaiement: z.string() }))
    .mutation(({ input }: any) => locationController.recordPayment(input.id, input.montant, input.modePaiement)),
});
