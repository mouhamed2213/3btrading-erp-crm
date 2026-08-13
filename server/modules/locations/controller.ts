import { TRPCError } from "@trpc/server";
import { locationService } from "./service";

export class LocationController {
  async list() {
    try {
      return await locationService.getAllLocations();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch locations",
      });
    }
  }

  async getById(id: string) {
    try {
      const location = await locationService.getLocationById(id);
      if (!location) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Location not found",
        });
      }
      return location;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch location",
      });
    }
  }

  async getActive() {
    try {
      return await locationService.getActiveLocations();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch active locations",
      });
    }
  }

  async create(data: any) {
    try {
      return await locationService.createLocation(data);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: (error as any).message || "Failed to create location",
      });
    }
  }

  async recordPayment(id: string, montant: number, modePaiement: string) {
    try {
      return await locationService.recordPayment(id, montant, modePaiement as any);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to record payment",
      });
    }
  }
}

export const locationController = new LocationController();
