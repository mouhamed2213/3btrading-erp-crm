import { Location } from '@/types';

export const mockLocations: Location[] = [
  {
    id: 'LOC001',
    clientId: 'CLI001',
    machineId: 'MAC001',
    dateDebut: new Date('2024-01-15'),
    dateFin: new Date('2024-01-22'),
    modeFacturation: 'JOURNALIER',
    tarifJournalier: 150000,
    nombreJours: 7,
    montantTotal: 1050000,
    statut: 'RETOURNEE',
    paiementEffectue: true,
    paiementType: 'CASH',
    montantPaye: 1050000,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: 'LOC002',
    clientId: 'CLI002',
    machineId: 'MAC002',
    dateDebut: new Date('2024-01-18'),
    dateFin: new Date('2024-01-25'),
    modeFacturation: 'JOURNALIER',
    tarifJournalier: 150000,
    nombreJours: 7,
    montantTotal: 1050000,
    statut: 'SORTIE',
    paiementEffectue: true,
    paiementType: 'MOBILE_MONEY',
    montantPaye: 1050000,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'LOC003',
    clientId: 'CLI003',
    machineId: 'MAC005',
    dateDebut: new Date('2024-01-10'),
    dateFin: new Date('2024-01-20'),
    modeFacturation: 'JOURNALIER',
    tarifJournalier: 200000,
    nombreJours: 10,
    montantTotal: 1800000,
    statut: 'RETOURNEE',
    paiementEffectue: true,
    paiementType: 'CASH',
    montantPaye: 1800000,
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'LOC004',
    clientId: 'CLI004',
    machineId: 'MAC009',
    dateDebut: new Date('2024-01-20'),
    dateFin: new Date('2024-02-05'),
    modeFacturation: 'DEGRESSIF',
    tarifJournalier: 160000,
    nombreJours: 16,
    montantTotal: 2240000,
    statut: 'SORTIE',
    paiementEffectue: true,
    paiementType: 'MOBILE_MONEY',
    montantPaye: 2240000,
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'LOC005',
    clientId: 'CLI005',
    machineId: 'MAC013',
    dateDebut: new Date('2024-01-12'),
    dateFin: new Date('2024-01-26'),
    modeFacturation: 'DEGRESSIF',
    tarifJournalier: 250000,
    nombreJours: 14,
    montantTotal: 3360000,
    statut: 'RETOURNEE',
    paiementEffectue: true,
    paiementType: 'CASH',
    montantPaye: 3360000,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-26'),
  },
  {
    id: 'LOC006',
    clientId: 'CLI006',
    machineId: 'MAC010',
    dateDebut: new Date('2024-01-22'),
    dateFin: new Date('2024-02-08'),
    modeFacturation: 'DEGRESSIF',
    tarifJournalier: 155000,
    nombreJours: 17,
    montantTotal: 2325000,
    statut: 'SORTIE',
    paiementEffectue: false,
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: 'LOC007',
    clientId: 'CLI007',
    machineId: 'MAC006',
    dateDebut: new Date('2024-01-25'),
    dateFin: new Date('2024-02-15'),
    modeFacturation: 'DEGRESSIF',
    tarifJournalier: 180000,
    nombreJours: 21,
    montantTotal: 3240000,
    statut: 'SORTIE',
    paiementEffectue: true,
    paiementType: 'MOBILE_MONEY',
    montantPaye: 3240000,
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: 'LOC008',
    clientId: 'CLI008',
    machineId: 'MAC016',
    dateDebut: new Date('2024-01-08'),
    dateFin: new Date('2024-01-15'),
    modeFacturation: 'JOURNALIER',
    tarifJournalier: 100000,
    nombreJours: 7,
    montantTotal: 700000,
    statut: 'RETOURNEE',
    paiementEffectue: true,
    paiementType: 'CASH',
    montantPaye: 700000,
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'LOC009',
    clientId: 'CLI009',
    machineId: 'MAC014',
    dateDebut: new Date('2024-01-20'),
    dateFin: new Date('2024-02-10'),
    modeFacturation: 'DEGRESSIF',
    tarifJournalier: 240000,
    nombreJours: 21,
    montantTotal: 3600000,
    statut: 'SORTIE',
    paiementEffectue: true,
    paiementType: 'MOBILE_MONEY',
    montantPaye: 3600000,
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'LOC010',
    clientId: 'CLI010',
    machineId: 'MAC011',
    dateDebut: new Date('2024-01-23'),
    dateFin: new Date('2024-02-06'),
    modeFacturation: 'JOURNALIER',
    tarifJournalier: 140000,
    nombreJours: 14,
    montantTotal: 1960000,
    statut: 'SORTIE',
    paiementEffectue: false,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-23'),
  },
  {
    id: 'LOC011',
    clientId: 'CLI011',
    machineId: 'MAC015',
    dateDebut: new Date('2024-01-05'),
    dateFin: new Date('2024-01-19'),
    modeFacturation: 'DEGRESSIF',
    tarifJournalier: 230000,
    nombreJours: 14,
    montantTotal: 3220000,
    statut: 'RETOURNEE',
    paiementEffectue: true,
    paiementType: 'CASH',
    montantPaye: 3220000,
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-19'),
  },
  {
    id: 'LOC012',
    clientId: 'CLI012',
    machineId: 'MAC017',
    dateDebut: new Date('2024-01-26'),
    dateFin: new Date('2024-02-09'),
    modeFacturation: 'DEGRESSIF',
    tarifJournalier: 95000,
    nombreJours: 14,
    montantTotal: 1330000,
    statut: 'SORTIE',
    paiementEffectue: true,
    paiementType: 'MOBILE_MONEY',
    montantPaye: 1330000,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-26'),
  },
  {
    id: 'LOC013',
    clientId: 'CLI013',
    machineId: 'MAC007',
    dateDebut: new Date('2024-02-01'),
    dateFin: new Date('2024-02-22'),
    modeFacturation: 'DEGRESSIF',
    tarifJournalier: 190000,
    nombreJours: 21,
    montantTotal: 3420000,
    statut: 'RESERVEE',
    paiementEffectue: true,
    paiementType: 'CASH',
    montantPaye: 3420000,
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-31'),
  },
  {
    id: 'LOC014',
    clientId: 'CLI014',
    machineId: 'MAC018',
    dateDebut: new Date('2024-02-05'),
    dateFin: new Date('2024-02-19'),
    modeFacturation: 'JOURNALIER',
    tarifJournalier: 90000,
    nombreJours: 14,
    montantTotal: 1260000,
    statut: 'RESERVEE',
    paiementEffectue: false,
    createdAt: new Date('2024-02-03'),
    updatedAt: new Date('2024-02-04'),
  },
  {
    id: 'LOC015',
    clientId: 'CLI015',
    machineId: 'MAC004',
    dateDebut: new Date('2024-02-10'),
    dateFin: new Date('2024-03-05'),
    modeFacturation: 'DEGRESSIF',
    tarifJournalier: 120000,
    nombreJours: 24,
    montantTotal: 2400000,
    statut: 'RESERVEE',
    paiementEffectue: true,
    paiementType: 'CASH',
    montantPaye: 2400000,
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-09'),
  },
];

export function getLocationById(id: string): Location | undefined {
  return mockLocations.find(l => l.id === id);
}

export function getLocationsParClient(clientId: string): Location[] {
  return mockLocations.filter(l => l.clientId === clientId);
}

export function getLocationsParMachine(machineId: string): Location[] {
  return mockLocations.filter(l => l.machineId === machineId);
}

export function getLocationsParStatut(statut: Location['statut']): Location[] {
  return mockLocations.filter(l => l.statut === statut);
}

export function getLocationsSortie(): Location[] {
  return mockLocations.filter(l => l.statut === 'SORTIE');
}

export function getLocationsNonPayees(): Location[] {
  return mockLocations.filter(l => !l.paiementEffectue);
}

export function getTotalRevenueLocations(): number {
  return mockLocations.reduce((sum, l) => sum + l.montantTotal, 0);
}

export function getTotalCashLocations(): number {
  return mockLocations
    .filter(l => l.paiementType === 'CASH' && l.paiementEffectue)
    .reduce((sum, l) => sum + (l.montantPaye || 0), 0);
}

export function getTotalMobileMoneyLocations(): number {
  return mockLocations
    .filter(l => l.paiementType === 'MOBILE_MONEY' && l.paiementEffectue)
    .reduce((sum, l) => sum + (l.montantPaye || 0), 0);
}
