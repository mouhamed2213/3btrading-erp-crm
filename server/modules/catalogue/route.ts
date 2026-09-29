import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../../_core/trpc";
import { storagePut } from "../../storage";
import { catalogueController } from "./controller";
import { catalogueService } from "./service";
import { machineInput, pieceInput } from "server/_core/schemas";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageBytes = 8 * 1024 * 1024;

const sanitizeFileName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "catalogue-image";


export const catalogueRouter = router({
  listPublishedMachines: publicProcedure.query(() =>
    catalogueController.listPublishedMachines()
  ),
  getPublishedMachineById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ input }) => catalogueController.getPublishedMachine(input.id)),
  listPublishedPieces: publicProcedure.query(() =>
    catalogueController.listPublishedPieces()
  ),
  getPublishedPieceById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ input }) => catalogueController.getPublishedPiece(input.id)),
  listAdminMachines: adminProcedure.query(() =>
    catalogueService.getAdminMachines()
  ),
  listAdminPieces: adminProcedure.query(() =>
    catalogueService.getAdminPieces()
  ),
  saveMachine: adminProcedure
    .input(machineInput)
    .mutation(({ input }) => catalogueController.saveMachine(input)),
  savePiece: adminProcedure
    .input(pieceInput)
    .mutation(({ input }) => catalogueController.savePiece(input)),
  uploadImage: adminProcedure
    .input(
      z.object({
        fileName: z.string().min(1).max(180),
        contentType: z.string().refine(value => allowedImageTypes.has(value), {
          message: "Format accepté : JPG, PNG ou WebP.",
        }),
        dataBase64: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.dataBase64, "base64");
      if (!buffer.length) throw new Error("Image vide.");
      if (buffer.length > maxImageBytes)
        throw new Error("L'image ne doit pas dépasser 8 Mo.");
      const extension = input.contentType.split("/")[1] ?? "bin";
      return storagePut(
        `3btrading/catalogue/${Date.now()}-${sanitizeFileName(input.fileName)}.${extension}`,
        buffer,
        input.contentType
      );
    }),
});
