import { Piece, Prisma } from "../../../generated/prisma/client";

import { prisma } from "../../db/prisma";

export class PieceRepository {
  async findAll(): Promise<Piece[]> {
    return prisma.piece.findMany();
  }

  async findById(id: string): Promise<Piece | null> {
    return prisma.piece.findUnique({ where: { id } });
  }

  async findByReference(reference: string): Promise<Piece | null> {
    return prisma.piece.findUnique({ where: { reference } });
  }

  async findByMarque(marque: string): Promise<Piece[]> {
    return prisma.piece.findMany({ where: { marque } });
  }

  async findByFamille(famille: string): Promise<Piece[]> {
    return prisma.piece.findMany({ where: { famille } });
  }

  async findByOEM(oemReference: string): Promise<Piece[]> {
    return prisma.piece.findMany({ where: { oemReference } });
  }

  async findLowStock(): Promise<Piece[]> {
    return prisma.piece.findMany({
      where: { stock: { lte: prisma.piece.fields.seuilAlerte } },
    });
  }

  async create(data: Prisma.PieceCreateInput): Promise<Piece> {
    return prisma.piece.create({ data });
  }

  async update(id: string, data: Prisma.PieceUpdateInput): Promise<Piece> {
    return prisma.piece.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.piece.delete({ where: { id } });
  }

  async updateStock(id: string, quantite: number): Promise<Piece> {
    const piece = await this.findById(id);
    if (!piece) throw new Error("Piece not found");

    const newStock = piece.stock + quantite;
    return this.update(id, { stock: newStock });
  }

  async search(
    marque?: string,
    famille?: string,
    reference?: string,
    oemReference?: string
  ): Promise<Piece[]> {
    const where: any = {};
    if (marque) where.marque = marque;
    if (famille) where.famille = famille;
    if (reference) where.reference = { contains: reference };
    if (oemReference) where.oemReference = oemReference;

    return prisma.piece.findMany({ where });
  }
}

export const pieceRepository = new PieceRepository();
