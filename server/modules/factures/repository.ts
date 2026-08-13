import { Facture, Prisma } from "../../../generated/prisma/client";

import { prisma } from "../../db/prisma";

export class FactureRepository {
  async findAll(): Promise<Facture[]> {
    return prisma.facture.findMany({ include: { client: true } });
  }

  async findById(id: string): Promise<Facture | null> {
    return prisma.facture.findUnique({ where: { id }, include: { client: true } });
  }

  async findByNumero(numero: string): Promise<Facture | null> {
    return prisma.facture.findUnique({ where: { numero }, include: { client: true } });
  }

  async findByClientId(clientId: string): Promise<Facture[]> {
    return prisma.facture.findMany({ where: { clientId }, include: { client: true } });
  }

  async findByStatut(statut: string): Promise<Facture[]> {
    return prisma.facture.findMany({ where: { statut: statut as any }, include: { client: true } });
  }

  async findByType(type: string): Promise<Facture[]> {
    return prisma.facture.findMany({ where: { type: type as any }, include: { client: true } });
  }

  async create(data: Prisma.FactureCreateInput): Promise<Facture> {
    return prisma.facture.create({ data, include: { client: true } });
  }

  async update(id: string, data: Prisma.FactureUpdateInput): Promise<Facture> {
    return prisma.facture.update({ where: { id }, data, include: { client: true } });
  }

  async delete(id: string): Promise<void> {
    await prisma.facture.delete({ where: { id } });
  }

  async findUnpaid(): Promise<Facture[]> {
    return prisma.facture.findMany({
      where: { statut: "IMPAYEE" },
      include: { client: true },
    });
  }

  async findPartiallyPaid(): Promise<Facture[]> {
    return prisma.facture.findMany({
      where: { statut: "PARTIELLEMENT_PAYEE" },
      include: { client: true },
    });
  }

  async findPaid(): Promise<Facture[]> {
    return prisma.facture.findMany({
      where: { statut: "PAYEE" },
      include: { client: true },
    });
  }
}

export const factureRepository = new FactureRepository();
