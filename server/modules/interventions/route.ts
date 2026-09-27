import { z } from "zod";
import { adminProcedure, router } from "../../_core/trpc";
import { interventionController } from "./controller";

export const interventionRouter = router({
  list: adminProcedure.query(() => interventionController.list()),

  getById: adminProcedure
    .input(z.string())
    .query(({ input }: { input: string }) => interventionController.getById(input)),

  getActive: adminProcedure.query(() => interventionController.getActive()),

  create: adminProcedure
    .input(z.any())
    .mutation(({ input }: any) => interventionController.create(input)),

  complete: adminProcedure
    .input(z.object({ id: z.string(), coutReel: z.number() }))
    .mutation(({ input }: any) => interventionController.complete(input.id, input.coutReel)),
});
