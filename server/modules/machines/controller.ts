import { TRPCError } from "@trpc/server";
import { machineService } from "./service";

export class MachineController {
  async list() {
    try {
      return await machineService.getAllMachines();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch machines",
      });
    }
  }

  async getById(id: string) {
    try {
      const machine = await machineService.getMachineById(id);
      if (!machine) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Machine not found",
        });
      }
      return machine;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch machine",
      });
    }
  }

  async getAvailable() {
    try {
      return await machineService.getAvailableMachines();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch available machines",
      });
    }
  }

  async getForSale() {
    try {
      return await machineService.getMachinesForSale();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch machines for sale",
      });
    }
  }

  async getByType(type: string) {
    try {
      return await machineService.getMachinesByType(type);
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch machines by type",
      });
    }
  }

  async getByMarque(marque: string) {
    try {
      return await machineService.getMachinesByMarque(marque);
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch machines by marque",
      });
    }
  }

  async create(data: any) {
    try {
      return await machineService.createMachine(data);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to create machine",
      });
    }
  }

  async update(id: string, data: any) {
    try {
      return await machineService.updateMachine(id, data);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to update machine",
      });
    }
  }

  async delete(id: string) {
    try {
      await machineService.deleteMachine(id);
      return { success: true };
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to delete machine",
      });
    }
  }

  async setStatut(id: string, statut: string) {
    try {
      return await machineService.setMachineStatut(id, statut as any);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to update machine status",
      });
    }
  }

  async calculateDegressiveRate(jours: number, tarifJournalier: number, tarifDegressif?: number) {
    try {
      const montant = await machineService.calculateDegressiveRate(jours, tarifJournalier, tarifDegressif);
      return { montant };
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to calculate rate",
      });
    }
  }
}

export const machineController = new MachineController();
