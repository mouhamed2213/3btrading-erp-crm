import { z } from "zod";
import { publicProcedure, router } from "../../_core/trpc";
import { interventionController } from "./controller";

export const interventionRouter = router({
  list: publicProcedure.query(() => interventionController.list()),

  getById: publicProcedure
    .input(z.string())
    .query(({ input }: { input: string }) => interventionController.getById(input)),

  getActive: publicProcedure.query(() => interventionController.getActive()),

  create: publicProcedure
    .input(z.any())
    .mutation(({ input }: any) => interventionController.create(input)),

  complete: publicProcedure
    .input(z.object({ id: z.string(), coutReel: z.number() }))
    .mutation(({ input }: any) => interventionController.complete(input.id, input.coutReel)),
});
