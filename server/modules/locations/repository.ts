import { Location, Prisma } from "../../../generated/prisma/client";

import { prisma } from "../../db/prisma";

export class LocationRepository {
  async findAll(): Promise<Location[]> {
    return prisma.location.findMany({ include: { machine: true, client: true } });
  }

  async findById(id: string): Promise<Location | null> {
    return prisma.location.findUnique({ where: { id }, include: { machine: true, client: true } });
  }

  async findByClientId(clientId: string): Promise<Location[]> {
    return prisma.location.findMany({ where: { clientId }, include: { machine: true, client: true } });
  }

  async findByMachineId(machineId: string): Promise<Location[]> {
    return prisma.location.findMany({ where: { machineId }, include: { machine: true, client: true } });
  }

  async findByStatut(statut: string): Promise<Location[]> {
    return prisma.location.findMany({ where: { statut: statut as any }, include: { machine: true, client: true } });
  }

  async create(data: Prisma.LocationCreateInput): Promise<Location> {
    return prisma.location.create({ data, include: { machine: true, client: true } });
  }

  async update(id: string, data: Prisma.LocationUpdateInput): Promise<Location> {
    return prisma.location.update({ where: { id }, data, include: { machine: true, client: true } });
  }

  async delete(id: string): Promise<void> {
    await prisma.location.delete({ where: { id } });
  }

  async findActive(): Promise<Location[]> {
    return prisma.location.findMany({
      where: { statut: { in: ["RESERVEE", "SORTIE"] } },
      include: { machine: true, client: true },
    });
  }

  async findUnpaid(): Promise<Location[]> {
    return prisma.location.findMany({
      where: { montantPaye: { lt: prisma.location.fields.montantTotal } },
      include: { machine: true, client: true },
    });
  }
}

export const locationRepository = new LocationRepository();
