import { TRPCError } from "@trpc/server";
import { chantierService } from "./service";

export class ChantierController {
  async list() {
    try {
      return await chantierService.getAllChantiers();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch chantiers",
      });
    }
  }

  async getById(id: string) {
    try {
      const chantier = await chantierService.getChantierById(id);
      if (!chantier) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chantier not found",
        });
      }
      return chantier;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch chantier",
      });
    }
  }

  async getByClient(clientId: string) {
    try {
      return await chantierService.getChantiersByClient(clientId);
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch client chantiers",
      });
    }
  }

  async getActive() {
    try {
      return await chantierService.getActiveChantiers();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch active chantiers",
      });
    }
  }

  async create(data: any) {
    try {
      return await chantierService.createChantier(data);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to create chantier",
      });
    }
  }

  async update(id: string, data: any) {
    try {
      return await chantierService.updateChantier(id, data);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to update chantier",
      });
    }
  }

  async delete(id: string) {
    try {
      await chantierService.deleteChantier(id);
      return { success: true };
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to delete chantier",
      });
    }
  }

  async calculateMontant(modeFacturation: string, montantEstime: number, volume?: number, heures?: number, jours?: number) {
    try {
      const montant = await chantierService.calculateMontant(modeFacturation, montantEstime, volume, heures, jours);
      return { montant };
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to calculate montant",
      });
    }
  }
}

export const chantierController = new ChantierController();
