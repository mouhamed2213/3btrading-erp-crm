import { describe, expect, it, vi } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

const { machineState, pieceState, upsertMachineMock, upsertPieceMock } = vi.hoisted(() => {
  const machineState = new Map<string, Record<string, unknown>>();
  const pieceState = new Map<string, Record<string, unknown>>();
  const upsert = (state: Map<string, Record<string, unknown>>) =>
    vi.fn(async (input: Record<string, unknown>) => {
      const now = new Date();
      const previous = state.get(String(input.id));
      const row = {
        ...(previous ?? {}),
        ...input,
        dateCreation: previous?.dateCreation ?? now,
        updatedAt: now,
      };
      state.set(String(input.id), row);
      return row;
    });
  const upsertMachineMock = upsert(machineState);
  const upsertPieceMock = upsert(pieceState);
  return { machineState, pieceState, upsertMachineMock, upsertPieceMock };
});

vi.mock('./modules/catalogue/repository', () => ({
  catalogueRepository: {
    listAllMachines: vi.fn(async () => [...machineState.values()]),
    listPublishedMachines: vi.fn(async () => [...machineState.values()].filter(row => row.isPublished === true)),
    findPublishedMachineById: vi.fn(async (id: string) => {
      const row = machineState.get(id);
      return row?.isPublished === true ? row : null;
    }),
    listAllPieces: vi.fn(async () => [...pieceState.values()]),
    listPublishedPieces: vi.fn(async () => [...pieceState.values()].filter(row => row.isPublished === true)),
    findPublishedPieceById: vi.fn(async (id: string) => {
      const row = pieceState.get(id);
      return row?.isPublished === true ? row : null;
    }),
    upsertMachine: upsertMachineMock,
    upsertPiece: upsertPieceMock,
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

    const machineInput = {
      id: 'MAC-INTEGRATION-001',
      nom: 'Pelle de validation',
      type: 'PELLE',
      marque: 'Caterpillar',
      modele: '320D',
      annee: 2022,
      immatriculation: 'SN-TEST-001',
      statut: 'DISPONIBLE' as const,
      tarifJournalier: 175000,
      tarifDegressif: 145000,
      prixVente: 85000000,
      enVente: true,
      enLocation: true,
      description: 'Machine publiée pour vérifier le flux partagé.',
      images: ['/files/test-pelle.png'],
      specifications: { Puissance: '160 kW' },
      isPublished: true,
      isFeatured: true,
    };
    await expect(publicCaller.catalogue.saveMachine(machineInput)).rejects.toMatchObject({ code: 'FORBIDDEN' });
    await expect(publicCaller.catalogue.listAdminMachines()).rejects.toMatchObject({ code: 'FORBIDDEN' });
    await admin.catalogue.saveMachine(machineInput);

    const catalogue = await publicCaller.catalogue.listPublishedMachines();
    expect(catalogue).toHaveLength(1);
    expect(catalogue[0]).toMatchObject({
      id: 'MAC-INTEGRATION-001',
      publie: true,
      immatriculation: 'SN-TEST-001',
      imagesGalerie: ['/files/test-pelle.png'],
    });

    const detail = await publicCaller.catalogue.getPublishedMachineById({ id: 'MAC-INTEGRATION-001' });
    expect(detail).toMatchObject({
      id: 'MAC-INTEGRATION-001',
      nom: 'Pelle de validation',
      publie: true,
      specifications: { Puissance: '160 kW' },
    });

    await admin.catalogue.saveMachine({
      ...machineInput,
      id: 'MAC-INTEGRATION-UNPUBLISHED',
      nom: 'Machine brouillon',
      isPublished: false,
    });

    const publicCatalogue = await publicCaller.catalogue.listPublishedMachines();
    expect(publicCatalogue.some(machine => machine.id === 'MAC-INTEGRATION-UNPUBLISHED')).toBe(false);
    await expect(
      publicCaller.catalogue.getPublishedMachineById({ id: 'MAC-INTEGRATION-UNPUBLISHED' })
    ).resolves.toBeNull();

    const pieceInput = {
      id: 'PCE-INTEGRATION-001',
      reference: 'FILTRE-001',
      nom: 'Filtre hydraulique',
      marque: 'CATERPILLAR',
      famille: 'HYDRAULIQUE',
      compatibilites: ['320D'],
      stock: 12,
      seuilAlerte: 2,
      prixUnitaire: 45000,
      fournisseur: 'Fournisseur test',
      oemReference: 'OEM-320D-001',
      description: 'Pièce de test publiée.',
      images: ['/files/test-filtre.png'],
      specifications: { Matière: 'Composite' },
      isPublished: true,
    };
    await expect(publicCaller.catalogue.savePiece(pieceInput)).rejects.toMatchObject({ code: 'FORBIDDEN' });
    await admin.catalogue.savePiece(pieceInput);

    const publicPieces = await publicCaller.catalogue.listPublishedPieces();
    expect(publicPieces).toHaveLength(1);
    expect(publicPieces[0]).toMatchObject({
      id: 'PCE-INTEGRATION-001',
      publie: true,
      reference: 'FILTRE-001',
      imagesGalerie: ['/files/test-filtre.png'],
    });
    await expect(
      publicCaller.catalogue.getPublishedPieceById({ id: 'PCE-INTEGRATION-001' })
    ).resolves.toMatchObject({ id: 'PCE-INTEGRATION-001', publie: true });

    await admin.catalogue.savePiece({ ...pieceInput, id: 'PCE-INTEGRATION-DRAFT', isPublished: false });
    expect((await publicCaller.catalogue.listPublishedPieces()).some(piece => piece.id === 'PCE-INTEGRATION-DRAFT')).toBe(false);
    await expect(
      publicCaller.catalogue.getPublishedPieceById({ id: 'PCE-INTEGRATION-DRAFT' })
    ).resolves.toBeNull();
  });
});
