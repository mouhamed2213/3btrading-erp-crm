import { catalogueService } from './service';

export const catalogueController = {
  listPublishedMachines: () => catalogueService.getPublishedMachines(),
  getPublishedMachine: (id: string) => catalogueService.getPublishedMachineById(id),
  listPublishedPieces: () => catalogueService.getPublishedPieces(),
  getPublishedPiece: (id: string) => catalogueService.getPublishedPieceById(id),
  saveMachine: (input: Parameters<typeof catalogueService.saveMachine>[0]) => catalogueService.saveMachine(input),
  savePiece: (input: Parameters<typeof catalogueService.savePiece>[0]) => catalogueService.savePiece(input),
};
