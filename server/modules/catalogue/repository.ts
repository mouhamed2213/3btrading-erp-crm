import { getPrismaClient } from '../../db/prisma';

const db = () => getPrismaClient();

export const catalogueRepository = {
  async listAllMachines() {
    return db().machine.findMany({ orderBy: { updatedAt: 'desc' } });
  },

  async listPublishedMachines() {
    return db().machine.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: 'desc' }, { updatedAt: 'desc' }],
    });
  },

  async findPublishedMachineById(id: string) {
    return db().machine.findFirst({ where: { id, isPublished: true } });
  },

  async listAllPieces() {
    return db().piece.findMany({ orderBy: { updatedAt: 'desc' } });
  },

  async listPublishedPieces() {
    return db().piece.findMany({
      where: { isPublished: true },
      orderBy: { updatedAt: 'desc' },
    });
  },

  async findPublishedPieceById(id: string) {
    return db().piece.findFirst({ where: { id, isPublished: true } });
  },

  async upsertMachine(input: {
    id: string;
    nom: string;
    type: string;
    marque: string;
    modele?: string;
    annee?: number;
    immatriculation?: string;
    statut?: 'DISPONIBLE' | 'EN_LOCATION' | 'EN_MAINTENANCE' | 'VENDUE';
    tarifJournalier: number;
    tarifRotation?: number;
    tarifDegressif?: number;
    prixVente?: number;
    enVente: boolean;
    enLocation: boolean;
    description?: string;
    images: string[];
    specifications: Record<string, string>;
    isPublished: boolean;
    isFeatured: boolean;
  }) {
    const { id, ...data } = input;
    return db().machine.upsert({
      where: { id },
      create: { id, ...data },
      update: data,
    });
  },

  async upsertPiece(input: {
    id: string;
    reference: string;
    nom: string;
    marque: string;
    famille: string;
    compatibilites: string[];
    stock: number;
    seuilAlerte: number;
    prixUnitaire: number;
    fournisseur?: string;
    oemReference?: string;
    description?: string;
    images: string[];
    specifications: Record<string, string>;
    isPublished: boolean;
  }) {
    const { id, ...data } = input;
    return db().piece.upsert({
      where: { id },
      create: { id, ...data },
      update: data,
    });
  },
};
