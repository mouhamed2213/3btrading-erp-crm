import { TRPCError } from "@trpc/server";
import { pieceService } from "./service";

export class PieceController {
  async list() {
    try {
      return await pieceService.getAllPieces();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch pieces",
      });
    }
  }

  async getById(id: string) {
    try {
      const piece = await pieceService.getPieceById(id);
      if (!piece) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Piece not found",
        });
      }
      return piece;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch piece",
      });
    }
  }

  async search(marque?: string, famille?: string, reference?: string, oemReference?: string) {
    try {
      return await pieceService.searchPieces(marque, famille, reference, oemReference);
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to search pieces",
      });
    }
  }

  async getLowStock() {
    try {
      return await pieceService.getLowStockPieces();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch low stock pieces",
      });
    }
  }

  async create(data: any) {
    try {
      return await pieceService.createPiece(data);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to create piece",
      });
    }
  }
}

export const pieceController = new PieceController();
