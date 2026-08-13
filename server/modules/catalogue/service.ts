import { catalogueRepository } from './repository';

const asNumber = (value: unknown) => Number(value ?? 0);
const asStringArray = (value: unknown) => Array.isArray(value) ? value.filter(item => typeof item === 'string') as string[] : [];
const asStringMap = (value: unknown) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.entries(value as Record<string, unknown>).reduce<Record<string, string>>((result, [key, item]) => {
    if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') result[key] = String(item);
    return result;
  }, {});
};

const fromPrismaStatus = (value: unknown) => {
  if (value === 'EN_LOCATION') return 'LOUE';
  if (value === 'EN_MAINTENANCE') return 'MAINTENANCE';
  if (value === 'VENDUE') return 'HORS_SERVICE';
  return 'DISPONIBLE';
};

const toPrismaStatus = (value: unknown) => {
  if (value === 'LOUE') return 'EN_LOCATION' as const;
  if (value === 'MAINTENANCE') return 'EN_MAINTENANCE' as const;
  if (value === 'HORS_SERVICE') return 'VENDUE' as const;
  return 'DISPONIBLE' as const;
};

const toMachine = (row: Record<string, any>) => ({
  id: row.id,
  nom: row.nom,
  type: row.type,
  marque: row.marque,
  modele: row.modele ?? '',
  annee: row.annee ?? new Date().getFullYear(),
  immatriculation: row.immatriculation ?? 'À renseigner',
  statut: fromPrismaStatus(row.statut),
  tarifJournalier: asNumber(row.tarifJournalier),
  tarifRotation: row.tarifRotation == null ? undefined : asNumber(row.tarifRotation),
  tarifDegressif: row.tarifDegressif == null ? undefined : asNumber(row.tarifDegressif),
  prixVente: row.prixVente == null ? undefined : asNumber(row.prixVente),
  enVente: Boolean(row.enVente),
  description: row.description ?? '',
  imagesGalerie: asStringArray(row.images),
  specifications: asStringMap(row.specifications),
  publie: Boolean(row.isPublished),
  vedette: Boolean(row.isFeatured),
  createdAt: row.dateCreation,
  updatedAt: row.updatedAt,
});

const toPiece = (row: Record<string, any>) => ({
  id: row.id,
  nom: row.nom,
  reference: row.reference,
  referenceOEM: row.oemReference ?? '',
  marque: row.marque,
  famille: row.famille,
  compatibilitesMachines: asStringArray(row.compatibilites),
  stock: row.stock,
  seuilAlerte: row.seuilAlerte,
  prixUnitaire: asNumber(row.prixUnitaire),
  fournisseur: row.fournisseur ?? '',
  description: row.description ?? '',
  imagesGalerie: asStringArray(row.images),
  specifications: asStringMap(row.specifications),
  publie: Boolean(row.isPublished),
  createdAt: row.dateCreation,
  updatedAt: row.updatedAt,
});

type CatalogueMachineInput = Omit<Parameters<typeof catalogueRepository.upsertMachine>[0], 'statut'> & {
  statut?: 'DISPONIBLE' | 'LOUE' | 'MAINTENANCE' | 'HORS_SERVICE';
};

export const catalogueService = {
  async getAdminMachines() {
    return (await catalogueRepository.listAllMachines()).map(row => toMachine(row as Record<string, any>));
  },

  async getPublishedMachines() {
    return (await catalogueRepository.listPublishedMachines()).map(row => toMachine(row as Record<string, any>));
  },

  async getPublishedMachineById(id: string) {
    const row = await catalogueRepository.findPublishedMachineById(id);
    return row ? toMachine(row as Record<string, any>) : null;
  },

  async getAdminPieces() {
    return (await catalogueRepository.listAllPieces()).map(row => toPiece(row as Record<string, any>));
  },

  async getPublishedPieces() {
    return (await catalogueRepository.listPublishedPieces()).map(row => toPiece(row as Record<string, any>));
  },

  async getPublishedPieceById(id: string) {
    const row = await catalogueRepository.findPublishedPieceById(id);
    return row ? toPiece(row as Record<string, any>) : null;
  },

  async saveMachine(input: CatalogueMachineInput) {
    const { statut, ...rest } = input;
    return toMachine(await catalogueRepository.upsertMachine({
      ...rest,
      statut: toPrismaStatus(statut),
    }) as Record<string, any>);
  },

  async savePiece(input: Parameters<typeof catalogueRepository.upsertPiece>[0]) {
    return toPiece(await catalogueRepository.upsertPiece(input) as Record<string, any>);
  },
};
