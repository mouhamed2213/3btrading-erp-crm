import { Client, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../db/prisma";

export class ClientRepository {
  async findAll(): Promise<Client[]> {
    return prisma.client.findMany();
  }

  async findById(id: string): Promise<Client | null> {
    return prisma.client.findUnique({
      where: { id },
    });
  }

  async findByNom(nom: string): Promise<Client[]> {
    return prisma.client.findMany({
      where: {
        nom: {
          contains: nom,
        },
      },
    });
  }

  async create(data: Prisma.ClientCreateInput): Promise<Client> {
    return prisma.client.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ClientUpdateInput): Promise<Client> {
    return prisma.client.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.client.delete({
      where: { id },
    });
  }

  async findByType(typeClient: "STANDARD" | "PARTENAIRE"): Promise<Client[]> {
    return prisma.client.findMany({
      where: { typeClient },
    });
  }

  async updateSolde(id: string, montant: number): Promise<Client> {
    const client = await this.findById(id);
    if (!client) throw new Error("Client not found");

    const newSolde = parseFloat(client.solde.toString()) + montant;
    return this.update(id, { solde: newSolde });
  }

  async findPartenaires(): Promise<Client[]> {
    return this.findByType("PARTENAIRE");
  }
}

export const clientRepository = new ClientRepository();
