import { Machine, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../db/prisma";

export class MachineRepository {
  async findAll(): Promise<Machine[]> {
    return prisma.machine.findMany();
  }

  async findById(id: string): Promise<Machine | null> {
    return prisma.machine.findUnique({ where: { id } });
  }

  async findByStatut(statut: string): Promise<Machine[]> {
    return prisma.machine.findMany({ where: { statut: statut as any } });
  }

  async findAvailable(): Promise<Machine[]> {
    return prisma.machine.findMany({
      where: { statut: "DISPONIBLE", enLocation: true },
    });
  }

  async findForSale(): Promise<Machine[]> {
    return prisma.machine.findMany({ where: { enVente: true } });
  }

  async create(data: Prisma.MachineCreateInput): Promise<Machine> {
    return prisma.machine.create({ data });
  }

  async update(id: string, data: Prisma.MachineUpdateInput): Promise<Machine> {
    return prisma.machine.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.machine.delete({ where: { id } });
  }

  async updateStatut(id: string, statut: string): Promise<Machine> {
    return this.update(id, { statut } as any);
  }

  async findByType(type: string): Promise<Machine[]> {
    return prisma.machine.findMany({ where: { type } });
  }

  async findByMarque(marque: string): Promise<Machine[]> {
    return prisma.machine.findMany({ where: { marque } });
  }
}

export const machineRepository = new MachineRepository();
