import { Intervention, Prisma } from "../../../generated/prisma/client";

import { prisma } from "../../db/prisma";

export class InterventionRepository {
  async findAll(): Promise<Intervention[]> {
    return prisma.intervention.findMany({ include: { machine: true } });
  }

  async findById(id: string): Promise<Intervention | null> {
    return prisma.intervention.findUnique({ where: { id }, include: { machine: true } });
  }

  async findByMachineId(machineId: string): Promise<Intervention[]> {
    return prisma.intervention.findMany({ where: { machineId }, include: { machine: true } });
  }

  async findByType(type: string): Promise<Intervention[]> {
    return prisma.intervention.findMany({ where: { type: type as any }, include: { machine: true } });
  }

  async findByStatut(statut: string): Promise<Intervention[]> {
    return prisma.intervention.findMany({ where: { statut: statut as any }, include: { machine: true } });
  }

  async create(data: Prisma.InterventionCreateInput): Promise<Intervention> {
    return prisma.intervention.create({ data, include: { machine: true } });
  }

  async update(id: string, data: Prisma.InterventionUpdateInput): Promise<Intervention> {
    return prisma.intervention.update({ where: { id }, data, include: { machine: true } });
  }

  async delete(id: string): Promise<void> {
    await prisma.intervention.delete({ where: { id } });
  }

  async findActive(): Promise<Intervention[]> {
    return prisma.intervention.findMany({
      where: { statut: { in: ["EN_COURS", "EN_ATTENTE"] } },
      include: { machine: true },
    });
  }

  async findCompleted(): Promise<Intervention[]> {
    return prisma.intervention.findMany({
      where: { statut: "TERMINE" },
      include: { machine: true },
    });
  }
}

export const interventionRepository = new InterventionRepository();
