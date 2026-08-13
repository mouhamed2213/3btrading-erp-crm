import { Chantier } from "../../../generated/prisma/client";
import { chantierRepository } from "./repository";

export class ChantierService {
  async getAllChantiers(): Promise<Chantier[]> {
    return chantierRepository.findAll();
  }

  async getChantierById(id: string): Promise<Chantier | null> {
    return chantierRepository.findById(id);
  }

  async getChantiersByClient(clientId: string): Promise<Chantier[]> {
    return chantierRepository.findByClientId(clientId);
  }

  async getActiveChantiers(): Promise<Chantier[]> {
    return chantierRepository.findActive();
  }

  async getTerminatedChantiers(): Promise<Chantier[]> {
    return chantierRepository.findTerminated();
  }

  async createChantier(data: {
    id: string;
    clientId: string;
    titre: string;
    description?: string;
    typesTravaux: string[];
    modeFacturation: "FORFAIT" | "CUBAGE" | "HORAIRE" | "JOURNALIER";
    dateDebut: Date;
    dateFin?: Date;
    montantEstime: number;
    volume?: number;
    heures?: number;
    jours?: number;
  }): Promise<Chantier> {
    return chantierRepository.create({
      id: data.id,
      titre: data.titre,
      description: data.description,
      typesTravaux: data.typesTravaux,
      modeFacturation: data.modeFacturation,
      dateDebut: data.dateDebut,
      dateFin: data.dateFin,
      montantEstime: data.montantEstime,
      volume: data.volume,
      heures: data.heures,
      jours: data.jours,
      client: { connect: { id: data.clientId } },
    } as any);
  }

  async updateChantier(id: string, data: Partial<any>): Promise<Chantier> {
    return chantierRepository.update(id, data as any);
  }

  async deleteChantier(id: string): Promise<void> {
    return chantierRepository.delete(id);
  }

  async calculateMontant(
    modeFacturation: string,
    montantEstime: number,
    volume?: number,
    heures?: number,
    jours?: number
  ): Promise<number> {
    switch (modeFacturation) {
      case "FORFAIT":
        return montantEstime;
      case "CUBAGE":
        return (volume || 0) * montantEstime;
      case "HORAIRE":
        return (heures || 0) * montantEstime;
      case "JOURNALIER":
        return (jours || 0) * montantEstime;
      default:
        return montantEstime;
    }
  }

  async setChantierStatut(id: string, statut: "PLANIFIE" | "EN_COURS" | "TERMINE" | "FACTURE"): Promise<Chantier> {
    return this.updateChantier(id, { statut });
  }
}

export const chantierService = new ChantierService();
