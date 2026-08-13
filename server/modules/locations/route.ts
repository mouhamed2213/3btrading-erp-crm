import { z } from "zod";
import { publicProcedure, router } from "../../_core/trpc";
import { locationController } from "./controller";

export const locationRouter = router({
  list: publicProcedure.query(() => locationController.list()),

  getById: publicProcedure
    .input(z.string())
    .query(({ input }: { input: string }) => locationController.getById(input)),

  getActive: publicProcedure.query(() => locationController.getActive()),

  create: publicProcedure
    .input(z.any())
    .mutation(({ input }: any) => locationController.create(input)),

  recordPayment: publicProcedure
    .input(z.object({ id: z.string(), montant: z.number(), modePaiement: z.string() }))
    .mutation(({ input }: any) => locationController.recordPayment(input.id, input.montant, input.modePaiement)),
});
