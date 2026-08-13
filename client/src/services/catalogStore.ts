import { mockMachines } from './mock/machines';
import { mockPieces } from './mock/pieces';
import type { Machine, Piece } from '@/types';

export type CatalogMachine = Machine & {
  publie: boolean;
  description: string;
  vedette: boolean;
  imagesGalerie: string[];
  specifications: Record<string, string>;
};

export type CatalogPiece = Piece & {
  publie: boolean;
  description: string;
  imagesGalerie: string[];
  specifications: Record<string, string>;
};

const MACHINES_KEY = '3btrading.catalog.machines';
const PIECES_KEY = '3btrading.catalog.pieces';

const defaultMachineDescription = (machine: Machine) =>
  `${machine.nom} ${machine.modele ? `(${machine.modele})` : ''}, disponible à la location clés en main avec chauffeur et carburant inclus.`;

const defaultPieceDescription = (piece: Piece) =>
  `${piece.nom} ${piece.referenceOEM ? `– référence OEM ${piece.referenceOEM}` : ''}, pièce contrôlée pour matériel lourd.`;

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(value));
}

const normalizeMachine = (machine: CatalogMachine): CatalogMachine => ({
  ...machine,
  description: machine.description || defaultMachineDescription(machine),
  imagesGalerie: machine.imagesGalerie ?? (machine.imageUrl ? [machine.imageUrl] : []),
  specifications: machine.specifications ?? {},
  publie: machine.publie ?? machine.isPublie ?? false,
  vedette: machine.vedette ?? false,
});

const normalizePiece = (piece: CatalogPiece): CatalogPiece => ({
  ...piece,
  description: piece.description || defaultPieceDescription(piece),
  imagesGalerie: piece.imagesGalerie ?? (piece.imageUrl ? [piece.imageUrl] : []),
  specifications: piece.specifications ?? {},
  publie: piece.publie ?? piece.isPublie ?? false,
});

export function getCatalogMachines(): CatalogMachine[] {
  const fallback = mockMachines.map(machine => normalizeMachine({
    ...machine,
    publie: machine.enVente || machine.statut === 'DISPONIBLE',
    description: defaultMachineDescription(machine),
    vedette: machine.enVente,
    imagesGalerie: [],
    specifications: {
      'Année': String(machine.annee),
      'Immatriculation': machine.immatriculation,
      'Statut flotte': machine.statut,
    },
  }));
  return read<CatalogMachine[]>(MACHINES_KEY, fallback).map(normalizeMachine);
}

export function getCatalogPieces(): CatalogPiece[] {
  const fallback = mockPieces.map(piece => normalizePiece({
    ...piece,
    publie: piece.stock > 0,
    description: defaultPieceDescription(piece),
    imagesGalerie: [],
    specifications: {
      'Référence OEM': piece.referenceOEM,
      'Famille': piece.famille,
      'Fournisseur': piece.fournisseur,
    },
  }));
  return read<CatalogPiece[]>(PIECES_KEY, fallback).map(normalizePiece);
}

export function saveCatalogMachines(items: CatalogMachine[]) {
  write(MACHINES_KEY, items.map(normalizeMachine));
}

export function saveCatalogPieces(items: CatalogPiece[]) {
  write(PIECES_KEY, items.map(normalizePiece));
}

export function getPublishedMachines() {
  return getCatalogMachines().filter(item => item.publie);
}

export function getPublishedPieces() {
  return getCatalogPieces().filter(item => item.publie);
}

export function getCatalogMachineById(id: string) {
  return getCatalogMachines().find(item => item.id === id);
}

export function getCatalogPieceById(id: string) {
  return getCatalogPieces().find(item => item.id === id);
}
