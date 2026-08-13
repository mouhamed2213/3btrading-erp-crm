import { Piece } from "../../../generated/prisma/client";
import { pieceRepository } from "./repository";

export class PieceService {
  async getAllPieces(): Promise<Piece[]> {
    return pieceRepository.findAll();
  }

  async getPieceById(id: string): Promise<Piece | null> {
    return pieceRepository.findById(id);
  }

  async getPieceByReference(reference: string): Promise<Piece | null> {
    return pieceRepository.findByReference(reference);
  }

  async getPiecesByMarque(marque: string): Promise<Piece[]> {
    return pieceRepository.findByMarque(marque);
  }

  async getPiecesByFamille(famille: string): Promise<Piece[]> {
    return pieceRepository.findByFamille(famille);
  }

  async getPiecesByOEM(oemReference: string): Promise<Piece[]> {
    return pieceRepository.findByOEM(oemReference);
  }

  async getLowStockPieces(): Promise<Piece[]> {
    return pieceRepository.findLowStock();
  }

  async searchPieces(
    marque?: string,
    famille?: string,
    reference?: string,
    oemReference?: string
  ): Promise<Piece[]> {
    return pieceRepository.search(marque, famille, reference, oemReference);
  }

  async createPiece(data: {
    id: string;
    reference: string;
    nom: string;
    marque: string;
    famille: string;
    compatibilites: string[];
    prixUnitaire: number;
    fournisseur?: string;
    oemReference?: string;
    seuilAlerte?: number;
  }): Promise<Piece> {
    return pieceRepository.create({
      id: data.id,
      reference: data.reference,
      nom: data.nom,
      marque: data.marque,
      famille: data.famille,
      compatibilites: data.compatibilites,
      prixUnitaire: data.prixUnitaire,
      fournisseur: data.fournisseur,
      oemReference: data.oemReference,
      seuilAlerte: data.seuilAlerte || 5,
      stock: 0,
    });
  }

  async updatePiece(id: string, data: Partial<any>): Promise<Piece> {
    return pieceRepository.update(id, data as any);
  }

  async deletePiece(id: string): Promise<void> {
    return pieceRepository.delete(id);
  }

  async addStock(id: string, quantite: number): Promise<Piece> {
    return pieceRepository.updateStock(id, quantite);
  }

  async removeStock(id: string, quantite: number): Promise<Piece> {
    return pieceRepository.updateStock(id, -quantite);
  }

  async isInStock(id: string, quantite: number): Promise<boolean> {
    const piece = await this.getPieceById(id);
    if (!piece) return false;
    return piece.stock >= quantite;
  }
}

export const pieceService = new PieceService();
