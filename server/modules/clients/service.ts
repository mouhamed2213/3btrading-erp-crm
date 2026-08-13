import { Prisma, Client } from "../../../generated/prisma/client";
import { clientRepository } from "./repository";

export class ClientService {
  async getAllClients(): Promise<Client[]> {
    return clientRepository.findAll();
  }

  async getClientById(id: string): Promise<Client | null> {
    return clientRepository.findById(id);
  }

  async searchClients(nom: string): Promise<Client[]> {
    return clientRepository.findByNom(nom);
  }

  async createClient(data: {
    id: string;
    nom: string;
    email?: string;
    telephone?: string;
    adresse?: string;
    typeClient?: "STANDARD" | "PARTENAIRE";
    contact?: string;
    siret?: string;
  }): Promise<Client> {
    return clientRepository.create({
      id: data.id,
      nom: data.nom,
      email: data.email,
      telephone: data.telephone,
      adresse: data.adresse,
      typeClient: data.typeClient || "STANDARD",
      contact: data.contact,
      siret: data.siret,
      solde: 0,
    });
  }

  async updateClient(
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
  ): Promise<Client> {
    return clientRepository.update(id, data);
  }

  async deleteClient(id: string): Promise<void> {
    return clientRepository.delete(id);
  }

  async getPartenaires(): Promise<Client[]> {
    return clientRepository.findPartenaires();
  }

  async addSolde(id: string, montant: number): Promise<Client> {
    return clientRepository.updateSolde(id, montant);
  }

  async subtractSolde(id: string, montant: number): Promise<Client> {
    return clientRepository.updateSolde(id, -montant);
  }

  async canWithdrawMachine(clientId: string): Promise<boolean> {
    const client = await this.getClientById(clientId);
    if (!client) return false;

    // Peut sortir si: PARTENAIRE ou solde >= 0 (payé 100%)
    return client.typeClient === "PARTENAIRE" || parseFloat(client.solde.toString()) >= 0;
  }
}

export const clientService = new ClientService();
