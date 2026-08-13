import { Machine } from "../../../generated/prisma/client";
import { machineRepository } from "./repository";

export class MachineService {
  async getAllMachines(): Promise<Machine[]> {
    return machineRepository.findAll();
  }

  async getMachineById(id: string): Promise<Machine | null> {
    return machineRepository.findById(id);
  }

  async getAvailableMachines(): Promise<Machine[]> {
    return machineRepository.findAvailable();
  }

  async getMachinesForSale(): Promise<Machine[]> {
    return machineRepository.findForSale();
  }

  async getMachinesByType(type: string): Promise<Machine[]> {
    return machineRepository.findByType(type);
  }

  async getMachinesByMarque(marque: string): Promise<Machine[]> {
    return machineRepository.findByMarque(marque);
  }

  async createMachine(data: {
    id: string;
    nom: string;
    type: string;
    marque: string;
    modele?: string;
    annee?: number;
    tarifJournalier: number;
    tarifRotation?: number;
    tarifDegressif?: number;
    prixVente?: number;
    enVente?: boolean;
    enLocation?: boolean;
  }): Promise<Machine> {
    return machineRepository.create({
      id: data.id,
      nom: data.nom,
      type: data.type,
      marque: data.marque,
      modele: data.modele,
      annee: data.annee,
      tarifJournalier: data.tarifJournalier,
      tarifRotation: data.tarifRotation,
      tarifDegressif: data.tarifDegressif,
      prixVente: data.prixVente,
      enVente: data.enVente || false,
      enLocation: data.enLocation || false,
    });
  }

  async updateMachine(
    id: string,
    data: Partial<{
      nom: string;
      type: string;
      marque: string;
      modele: string;
      annee: number;
      statut: string;
      tarifJournalier: number;
      tarifRotation: number;
      tarifDegressif: number;
      prixVente: number;
      enVente: boolean;
      enLocation: boolean;
    }>
  ): Promise<Machine> {
    return machineRepository.update(id, data as any);
  }

  async deleteMachine(id: string): Promise<void> {
    return machineRepository.delete(id);
  }

  async setMachineStatut(id: string, statut: "DISPONIBLE" | "EN_LOCATION" | "EN_MAINTENANCE" | "VENDUE"): Promise<Machine> {
    return machineRepository.updateStatut(id, statut);
  }

  async calculateDegressiveRate(jours: number, tarifJournalier: number, tarifDegressif?: number): Promise<number> {
    if (!tarifDegressif || jours <= 7) {
      return tarifJournalier * jours;
    }
    // Tarif dégressif appliqué après 7 jours
    const normalDays = 7 * tarifJournalier;
    const degressiveDays = (jours - 7) * tarifDegressif;
    return normalDays + degressiveDays;
  }
}

export const machineService = new MachineService();
