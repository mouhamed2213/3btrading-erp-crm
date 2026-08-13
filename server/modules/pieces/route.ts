import { z } from "zod";
import { publicProcedure, router } from "../../_core/trpc";
import { pieceController } from "./controller";

export const pieceRouter = router({
  list: publicProcedure.query(() => pieceController.list()),

  getById: publicProcedure
    .input(z.string())
    .query(({ input }: { input: string }) => pieceController.getById(input)),

  search: publicProcedure
    .input(
      z.object({
        marque: z.string().optional(),
        famille: z.string().optional(),
        reference: z.string().optional(),
        oemReference: z.string().optional(),
      })
    )
    .query(({ input }: any) =>
      pieceController.search(input.marque, input.famille, input.reference, input.oemReference)
    ),

  getLowStock: publicProcedure.query(() => pieceController.getLowStock()),

  create: publicProcedure
    .input(z.any())
    .mutation(({ input }: any) => pieceController.create(input)),
});
