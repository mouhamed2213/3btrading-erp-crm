import { z } from "zod";
import { adminProcedure, router } from "../../_core/trpc";
import { pieceController } from "./controller";

export const pieceRouter = router({
  list: adminProcedure.query(() => pieceController.list()),

  getById: adminProcedure
    .input(z.string())
    .query(({ input }: { input: string }) => pieceController.getById(input)),

  search: adminProcedure
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

  getLowStock: adminProcedure.query(() => pieceController.getLowStock()),

  create: adminProcedure
    .input(z.any())
    .mutation(({ input }: any) => pieceController.create(input)),
});
