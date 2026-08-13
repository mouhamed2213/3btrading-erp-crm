import { Intervention } from "../../../generated/prisma/client";
import { interventionRepository } from "./repository";
import { pieceService } from "../pieces/service";

export class InterventionService {
  async getAllInterventions(): Promise<Intervention[]> {
    return interventionRepository.findAll();
  }

  async getInterventionById(id: string): Promise<Intervention | null> {
    return interventionRepository.findById(id);
  }

  async getInterventionsByMachine(machineId: string): Promise<Intervention[]> {
    return interventionRepository.findByMachineId(machineId);
  }

  async getInterventionsByType(type: "MAINTENANCE_INTERNE" | "REPARATION_EXTERNE" | "SAV_GARANTIE"): Promise<Intervention[]> {
    return interventionRepository.findByType(type);
  }

  async getActiveInterventions(): Promise<Intervention[]> {
    return interventionRepository.findActive();
  }

  async getCompletedInterventions(): Promise<Intervention[]> {
    return interventionRepository.findCompleted();
  }

  async createIntervention(data: {
    id: string;
    machineId: string;
    type: "MAINTENANCE_INTERNE" | "REPARATION_EXTERNE" | "SAV_GARANTIE";
    description: string;
    dateDebut: Date;
    piecesUtilisees: Array<{ pieceId: string; quantite: number; prixUnitaire: number }>;
    coutEstime: number;
  }): Promise<Intervention> {
    // Vérifier le stock des pièces
    for (const piece of data.piecesUtilisees) {
      const isInStock = await pieceService.isInStock(piece.pieceId, piece.quantite);
      if (!isInStock) {
        throw new Error(`Insufficient stock for piece ${piece.pieceId}`);
      }
    }

    return interventionRepository.create({
      id: data.id,
      machine: { connect: { id: data.machineId } },
      type: data.type,
      description: data.description,
      dateDebut: data.dateDebut,
      piecesUtilisees: data.piecesUtilisees,
      coutEstime: data.coutEstime,
      statut: "EN_COURS",
    } as any);
  }

  async updateIntervention(id: string, data: Partial<any>): Promise<Intervention> {
    return interventionRepository.update(id, data as any);
  }

  async deleteIntervention(id: string): Promise<void> {
    return interventionRepository.delete(id);
  }

  async completeIntervention(id: string, coutReel: number): Promise<Intervention> {
    return this.updateIntervention(id, {
      statut: "TERMINE",
      dateFin: new Date(),
      coutReel,
    });
  }

  async calculateCost(piecesUtilisees: Array<{ quantite: number; prixUnitaire: number }>): Promise<number> {
    return piecesUtilisees.reduce((total, piece) => total + piece.quantite * piece.prixUnitaire, 0);
  }

  async consumePieces(piecesUtilisees: Array<{ pieceId: string; quantite: number }>): Promise<void> {
    for (const piece of piecesUtilisees) {
      await pieceService.removeStock(piece.pieceId, piece.quantite);
    }
  }
}

export const interventionService = new InterventionService();
