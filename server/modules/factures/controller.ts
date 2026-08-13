import { TRPCError } from "@trpc/server";
import { factureService } from "./service";

export class FactureController {
  async list() {
    try {
      return await factureService.getAllFactures();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch factures",
      });
    }
  }

  async getById(id: string) {
    try {
      const facture = await factureService.getFactureById(id);
      if (!facture) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Facture not found",
        });
      }
      return facture;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch facture",
      });
    }
  }

  async getUnpaid() {
    try {
      return await factureService.getUnpaidFactures();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch unpaid factures",
      });
    }
  }

  async create(data: any) {
    try {
      return await factureService.createFacture(data);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to create facture",
      });
    }
  }

  async recordPayment(id: string, montant: number, modePaiement: string) {
    try {
      return await factureService.recordPayment(id, montant, modePaiement as any);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to record payment",
      });
    }
  }

  async emit(id: string) {
    try {
      return await factureService.emitFacture(id);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to emit facture",
      });
    }
  }

  async addReminder(id: string) {
    try {
      return await factureService.addReminder(id);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to add reminder",
      });
    }
  }
}

export const factureController = new FactureController();
