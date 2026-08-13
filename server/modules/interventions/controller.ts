import { TRPCError } from "@trpc/server";
import { interventionService } from "./service";

export class InterventionController {
  async list() {
    try {
      return await interventionService.getAllInterventions();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch interventions",
      });
    }
  }

  async getById(id: string) {
    try {
      const intervention = await interventionService.getInterventionById(id);
      if (!intervention) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Intervention not found",
        });
      }
      return intervention;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch intervention",
      });
    }
  }

  async getActive() {
    try {
      return await interventionService.getActiveInterventions();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch active interventions",
      });
    }
  }

  async create(data: any) {
    try {
      return await interventionService.createIntervention(data);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: (error as any).message || "Failed to create intervention",
      });
    }
  }

  async complete(id: string, coutReel: number) {
    try {
      return await interventionService.completeIntervention(id, coutReel);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to complete intervention",
      });
    }
  }
}

export const interventionController = new InterventionController();
