import { MachineType } from "./route";
import { catalogueService } from "./service";

export const catalogueController = {
  listPublishedMachines: () => catalogueService.getPublishedMachines(),

  getPublishedMachine: (id: string) =>
    catalogueService.getPublishedMachineById(id),

  listPublishedPieces: () => catalogueService.getPublishedPieces(),

  getPublishedPiece: (id: string) => catalogueService.getPublishedPieceById(id),

  saveMachine: (input: MachineType) =>
    catalogueService.saveMachine(input),




  savePiece: (input: Parameters<typeof catalogueService.savePiece>[0]) =>
    catalogueService.savePiece(input),
};
