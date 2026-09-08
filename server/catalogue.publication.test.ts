import { describe, expect, it, vi } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

const { machineState, upsertMachineMock } = vi.hoisted(() => {
  const machineState = new Map<string, Record<string, unknown>>();
  const upsertMachineMock = vi.fn(async (input: Record<string, unknown>) => {
    const now = new Date();
    const previous = machineState.get(String(input.id));
    const row = {
      ...(previous ?? {}),
      ...input,
      dateCreation: previous?.dateCreation ?? now,
      updatedAt: now,
    };
    machineState.set(String(input.id), row);
    return row;
  });
  return { machineState, upsertMachineMock };
});

vi.mock('./modules/catalogue/repository', () => ({
  catalogueRepository: {
    listAllMachines: vi.fn(async () => [...machineState.values()]),
    listPublishedMachines: vi.fn(async () => [...machineState.values()].filter(row => row.isPublished === true)),
    findPublishedMachineById: vi.fn(async (id: string) => {
      const row = machineState.get(id);
      return row?.isPublished === true ? row : null;
    }),
    listAllPieces: vi.fn(async () => []),
    listPublishedPieces: vi.fn(async () => []),
    findPublishedPieceById: vi.fn(async () => null),
    upsertMachine: upsertMachineMock,
    upsertPiece: vi.fn(),
  },
}));

const adminContext = (): TrpcContext => ({
  user: {
    id: 1,
    openId: 'test-admin',
    name: 'Test Admin',
    email: 'admin@test.local',
    loginMethod: 'test',
    role: 'ADMIN',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: {} as TrpcContext['req'],
  res: {} as TrpcContext['res'],
});

const publicContext = (): TrpcContext => ({
  user: null,
  req: {} as TrpcContext['req'],
  res: {} as TrpcContext['res'],
});

describe('catalogue publication flow', () => {
  it('publie une machine depuis l’admin puis la rend disponible dans la vitrine et le détail', async () => {
    const admin = appRouter.createCaller(adminContext());
    const publicCaller = appRouter.createCaller(publicContext());

    await admin.catalogue.saveMachine({
      id: 'MAC-INTEGRATION-001',
      nom: 'Pelle de validation',
      type: 'PELLE',
      marque: 'Caterpillar',
      modele: '320D',
      annee: 2022,
      immatriculation: 'SN-TEST-001',
      statut: 'DISPONIBLE',
      tarifJournalier: 175000,
      tarifDegressif: 145000,
      prixVente: 85000000,
      enVente: true,
      enLocation: true,
      description: 'Machine publiée pour vérifier le flux partagé.',
      images: ['/manus-storage/test-pelle.png'],
      specifications: { Puissance: '160 kW' },
      isPublished: true,
      isFeatured: true,
    });

    const catalogue = await publicCaller.catalogue.listPublishedMachines();
    expect(catalogue).toHaveLength(1);
    expect(catalogue[0]).toMatchObject({
      id: 'MAC-INTEGRATION-001',
      publie: true,
      immatriculation: 'SN-TEST-001',
      imagesGalerie: ['/manus-storage/test-pelle.png'],
    });

    const detail = await publicCaller.catalogue.getPublishedMachineById({ id: 'MAC-INTEGRATION-001' });
    expect(detail).toMatchObject({
      id: 'MAC-INTEGRATION-001',
      nom: 'Pelle de validation',
      publie: true,
      specifications: { Puissance: '160 kW' },
    });
  });
});
