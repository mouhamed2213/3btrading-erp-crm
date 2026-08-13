import { TRPCError } from "@trpc/server";
import { clientService } from "./service";

export class ClientController {
  async list() {
    try {
      return await clientService.getAllClients();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch clients",
      });
    }
  }

  async getById(id: string) {
    try {
      const client = await clientService.getClientById(id);
      if (!client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Client not found",
        });
      }
      return client;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch client",
      });
    }
  }

  async search(nom: string) {
    try {
      return await clientService.searchClients(nom);
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to search clients",
      });
    }
  }

  async create(data: {
    id: string;
    nom: string;
    email?: string;
    telephone?: string;
    adresse?: string;
    typeClient?: "STANDARD" | "PARTENAIRE";
    contact?: string;
    siret?: string;
  }) {
    try {
      return await clientService.createClient(data);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to create client",
      });
    }
  }

  async update(
    id: string,
    data: Partial<{
      nom: string;
      email: string;
      telephone: string;
      adresse: string;
      typeClient: "STANDARD" | "PARTENAIRE";
      contact: string;
      siret: string;
    }>
  ) {
    try {
      return await clientService.updateClient(id, data);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to update client",
      });
    }
  }

  async delete(id: string) {
    try {
      await clientService.deleteClient(id);
      return { success: true };
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to delete client",
      });
    }
  }

  async getPartenaires() {
    try {
      return await clientService.getPartenaires();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch partenaires",
      });
    }
  }

  async canWithdrawMachine(clientId: string) {
    try {
      const canWithdraw = await clientService.canWithdrawMachine(clientId);
      return { canWithdraw };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to check withdrawal permission",
      });
    }
  }
}

export const clientController = new ClientController();
