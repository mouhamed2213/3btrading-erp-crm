import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../../_core/trpc";
import { storagePut } from "../../storage";
import { catalogueController } from "./controller";
import { catalogueService } from "./service";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageBytes = 8 * 1024 * 1024;

const sanitizeFileName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "catalogue-image";

const machineInput = z.object({
  id: z.string().min(1),
  nom: z.string().min(2),
  type: z.string().min(1),
  marque: z.string().min(1),
  modele: z.string().optional(),
  annee: z.number().int().min(1950).max(2100).optional(),
  immatriculation: z.string().max(80).optional(),
  statut: z
    .enum(["DISPONIBLE", "LOUE", "MAINTENANCE", "HORS_SERVICE"])
    .optional(),
  tarifJournalier: z.number().nonnegative(),
  tarifRotation: z.number().nonnegative().optional(),
  tarifDegressif: z.number().nonnegative().optional(),
  prixVente: z.number().nonnegative().optional(),
  enVente: z.boolean(),
  enLocation: z.boolean(),
  description: z.string().max(10000).optional(),
  images: z.array(z.string().url().or(z.string().startsWith("/files/"))).max(6),
  specifications: z.record(z.string(), z.string()).default({}),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
});

const pieceInput = z.object({
  id: z.string().min(1),
  reference: z.string().min(1),
  nom: z.string().min(2),
  marque: z.string().min(1),
  famille: z.string().min(1),
  compatibilites: z.array(z.string()).default([]),
  stock: z.number().int().nonnegative(),
  seuilAlerte: z.number().int().nonnegative(),
  prixUnitaire: z.number().nonnegative(),
  fournisseur: z.string().optional(),
  oemReference: z.string().optional(),
  description: z.string().max(10000).optional(),
  images: z.array(z.string().url().or(z.string().startsWith("/files/"))).max(6),
  specifications: z.record(z.string(), z.string()).default({}),
  isPublished: z.boolean(),
});

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
        dataBase64: z
          .string()
          .min(1)
          .max(11_184_812)
          .regex(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/, {
            message: "Le contenu de l’image est invalide.",
          }),
      })
    )
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.dataBase64, "base64");
      if (!buffer.length) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Image vide." });
      }
      if (buffer.length > maxImageBytes) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "L'image ne doit pas dépasser 8 Mo.",
        });
      }
      const isJpeg = buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
      const isPng = buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
      const isWebp = buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
      const matchesContentType =
        (input.contentType === "image/jpeg" && isJpeg) ||
        (input.contentType === "image/png" && isPng) ||
        (input.contentType === "image/webp" && isWebp);
      if (!matchesContentType) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Le contenu du fichier ne correspond pas au format image annoncé.",
        });
      }
      const extension = input.contentType.split("/")[1] ?? "bin";
      return storagePut(
        `3btrading/catalogue/${Date.now()}-${sanitizeFileName(input.fileName)}.${extension}`,
        buffer,
        input.contentType
      );
    }),
});
