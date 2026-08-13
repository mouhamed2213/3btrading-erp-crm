import { z } from "zod";
import { publicProcedure, router } from "../../_core/trpc";
import { clientController } from "./controller";

export const clientRouter = router({
  list: publicProcedure.query(() => clientController.list()),

  getById: publicProcedure.input(z.string()).query(({ input }: { input: string }) => clientController.getById(input)),

  search: publicProcedure.input(z.string()).query(({ input }: { input: string }) => clientController.search(input)),

  create: publicProcedure
    .input(
      z.object({
        id: z.string(),
        nom: z.string(),
        email: z.string().email().optional(),
        telephone: z.string().optional(),
        adresse: z.string().optional(),
        typeClient: z.enum(["STANDARD", "PARTENAIRE"]).optional(),
        contact: z.string().optional(),
        siret: z.string().optional(),
      })
    )
    .mutation(({ input }: any) => clientController.create(input)),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          nom: z.string().optional(),
          email: z.string().email().optional(),
          telephone: z.string().optional(),
          adresse: z.string().optional(),
          typeClient: z.enum(["STANDARD", "PARTENAIRE"]).optional(),
          contact: z.string().optional(),
          siret: z.string().optional(),
        }),
      })
    )
    .mutation(({ input }: any) => clientController.update(input.id, input.data)),

  delete: publicProcedure.input(z.string()).mutation(({ input }: { input: string }) => clientController.delete(input)),

  getPartenaires: publicProcedure.query(() => clientController.getPartenaires()),

  canWithdrawMachine: publicProcedure
    .input(z.string())
    .query(({ input }: { input: string }) => clientController.canWithdrawMachine(input)),
});
