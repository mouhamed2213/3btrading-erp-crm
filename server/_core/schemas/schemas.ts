import { Brand, EngineType, StatutMachine } from "@shared/enums";
import z from "zod";

export const machineInput = z.object({
  id: z.string().min(1),
  nom: z.string().min(2),
  type: z.enum(EngineType),
  marque: z.enum(Brand),
  modele: z.string().optional(),
  annee: z.number().int().min(1950).max(2100).optional(),
  immatriculation: z.string().max(80).optional(),
  statut: z.enum(StatutMachine),
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

export type MachineType = z.infer<typeof machineInput>;

export const pieceInput = z.object({
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
export type PieceType = z.infer<typeof pieceInput>;
