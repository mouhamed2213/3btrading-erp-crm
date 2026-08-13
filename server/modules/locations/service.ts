import { Location } from "../../../generated/prisma/client";
import { locationRepository } from "./repository";
import { clientService } from "../clients/service";
import { machineService } from "../machines/service";

export class LocationService {
  async getAllLocations(): Promise<Location[]> {
    return locationRepository.findAll();
  }

  async getLocationById(id: string): Promise<Location | null> {
    return locationRepository.findById(id);
  }

  async getLocationsByClient(clientId: string): Promise<Location[]> {
    return locationRepository.findByClientId(clientId);
  }

  async getLocationsByMachine(machineId: string): Promise<Location[]> {
    return locationRepository.findByMachineId(machineId);
  }

  async getActiveLocations(): Promise<Location[]> {
    return locationRepository.findActive();
  }

  async getUnpaidLocations(): Promise<Location[]> {
    return locationRepository.findUnpaid();
  }

  async createLocation(data: {
    id: string;
    machineId: string;
    clientId: string;
    dateDebut: Date;
    dateFin: Date;
    jours: number;
    tarifType: "JOURNALIER" | "ROTATION" | "DEGRESSIF";
    montantTotal: number;
  }): Promise<Location> {
    // Vérifier que le client peut sortir la machine
    const canWithdraw = await clientService.canWithdrawMachine(data.clientId);
    if (!canWithdraw) {
      throw new Error("Client cannot withdraw machine: payment required or not a partner");
    }

    return locationRepository.create({
      id: data.id,
      machine: { connect: { id: data.machineId } },
      client: { connect: { id: data.clientId } },
      dateDebut: data.dateDebut,
      dateFin: data.dateFin,
      jours: data.jours,
      tarifType: data.tarifType,
      montantTotal: data.montantTotal,
      statut: "RESERVEE",
    } as any);
  }

  async updateLocation(id: string, data: Partial<any>): Promise<Location> {
    return locationRepository.update(id, data as any);
  }

  async deleteLocation(id: string): Promise<void> {
    return locationRepository.delete(id);
  }

  async calculateLocationPrice(
    machineId: string,
    jours: number,
    tarifType: "JOURNALIER" | "ROTATION" | "DEGRESSIF"
  ): Promise<number> {
    const machine = await machineService.getMachineById(machineId);
    if (!machine) throw new Error("Machine not found");

    if (tarifType === "JOURNALIER") {
      return machine.tarifJournalier.toNumber() * jours;
    } else if (tarifType === "ROTATION" && machine.tarifRotation) {
      return machine.tarifRotation.toNumber() * jours;
    } else if (tarifType === "DEGRESSIF" && jours > 7) {
      return await machineService.calculateDegressiveRate(jours, machine.tarifJournalier.toNumber(), machine.tarifDegressif?.toNumber());
    }

    return machine.tarifJournalier.toNumber() * jours;
  }

  async setLocationStatut(id: string, statut: "RESERVEE" | "SORTIE" | "RETOURNEE"): Promise<Location> {
    return this.updateLocation(id, { statut });
  }

  async recordPayment(id: string, montant: number, modePaiement: "CASH" | "MOBILE_MONEY"): Promise<Location> {
    const location = await this.getLocationById(id);
    if (!location) throw new Error("Location not found");

    const newMontantPaye = parseFloat(location.montantPaye.toString()) + montant;
    return this.updateLocation(id, {
      montantPaye: newMontantPaye,
      modePaiement,
      statut: newMontantPaye >= parseFloat(location.montantTotal.toString()) ? "RETOURNEE" : "SORTIE",
    });
  }
}

export const locationService = new LocationService();
