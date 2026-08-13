import { Chantier, Prisma } from "../../../generated/prisma/client";

import { prisma } from "../../db/prisma";

export class ChantierRepository {
  async findAll(): Promise<Chantier[]> {
    return prisma.chantier.findMany({ include: { client: true } });
  }

  async findById(id: string): Promise<Chantier | null> {
    return prisma.chantier.findUnique({ where: { id }, include: { client: true } });
  }

  async findByClientId(clientId: string): Promise<Chantier[]> {
    return prisma.chantier.findMany({ where: { clientId }, include: { client: true } });
  }

  async findByStatut(statut: string): Promise<Chantier[]> {
    return prisma.chantier.findMany({ where: { statut: statut as any }, include: { client: true } });
  }

  async create(data: Prisma.ChantierCreateInput): Promise<Chantier> {
    return prisma.chantier.create({ data, include: { client: true } });
  }

  async update(id: string, data: Prisma.ChantierUpdateInput): Promise<Chantier> {
    return prisma.chantier.update({ where: { id }, data, include: { client: true } });
  }

  async delete(id: string): Promise<void> {
    await prisma.chantier.delete({ where: { id } });
  }

  async findActive(): Promise<Chantier[]> {
    return prisma.chantier.findMany({
      where: { statut: { in: ["PLANIFIE", "EN_COURS"] } },
      include: { client: true },
    });
  }

  async findTerminated(): Promise<Chantier[]> {
    return prisma.chantier.findMany({
      where: { statut: "TERMINE" },
      include: { client: true },
    });
  }
}

export const chantierRepository = new ChantierRepository();
