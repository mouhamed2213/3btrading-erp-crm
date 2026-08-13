import { Intervention } from '@/types';

export const mockInterventions: Intervention[] = [
  // MAINTENANCE INTERNE
  {
    id: 'INT001',
    machineId: 'MAC001',
    type: 'MAINTENANCE_INTERNE',
    description: 'Révision 50 000 km - Changement huile et filtres',
    dateDebut: new Date('2024-01-10'),
    dateFin: new Date('2024-01-12'),
    statut: 'TERMINEZ',
    piecesUtilisees: [
      { pieceId: 'PEC003', quantite: 2 },
      { pieceId: 'PEC012', quantite: 1 },
    ],
    coutEstime: 450000,
    coutReel: 420000,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: 'INT002',
    machineId: 'MAC005',
    type: 'MAINTENANCE_INTERNE',
    description: 'Inspection générale et maintenance préventive',
    dateDebut: new Date('2024-01-15'),
    dateFin: new Date('2024-01-18'),
    statut: 'TERMINEZ',
    piecesUtilisees: [
      { pieceId: 'PEC001', quantite: 0 },
      { pieceId: 'PEC019', quantite: 0 },
    ],
    coutEstime: 850000,
    coutReel: 820000,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'INT003',
    machineId: 'MAC009',
    type: 'MAINTENANCE_INTERNE',
    description: 'Maintenance courante - Graissage et contrôles',
    dateDebut: new Date('2024-01-20'),
    dateFin: new Date('2024-01-21'),
    statut: 'TERMINEZ',
    piecesUtilisees: [
      { pieceId: 'PEC003', quantite: 1 },
    ],
    coutEstime: 250000,
    coutReel: 240000,
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-21'),
  },
  {
    id: 'INT004',
    machineId: 'MAC013',
    type: 'MAINTENANCE_INTERNE',
    description: 'Révision complète - Changement chaîne et pneus',
    dateDebut: new Date('2024-01-22'),
    dateFin: new Date('2024-01-25'),
    statut: 'EN_COURS',
    piecesUtilisees: [
      { pieceId: 'PEC009', quantite: 1 },
      { pieceId: 'PEC010', quantite: 4 },
    ],
    coutEstime: 1200000,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-23'),
  },
  {
    id: 'INT005',
    machineId: 'MAC016',
    type: 'MAINTENANCE_INTERNE',
    description: 'Maintenance préventive compacteur',
    dateDebut: new Date('2024-01-18'),
    dateFin: new Date('2024-01-19'),
    statut: 'TERMINEZ',
    piecesUtilisees: [
      { pieceId: 'PEC012', quantite: 1 },
    ],
    coutEstime: 320000,
    coutReel: 300000,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-19'),
  },

  // RÉPARATIONS EXTERNES (FACTURÉES)
  {
    id: 'INT006',
    machineId: 'MAC002',
    type: 'REPARATION_EXTERNE',
    description: 'Réparation moteur - Problème turbo',
    dateDebut: new Date('2024-01-08'),
    dateFin: new Date('2024-01-14'),
    statut: 'TERMINEZ',
    piecesUtilisees: [
      { pieceId: 'PEC002', quantite: 1 },
    ],
    coutEstime: 1500000,
    coutReel: 1450000,
    clientId: 'CLI002',
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: 'INT007',
    machineId: 'MAC006',
    type: 'REPARATION_EXTERNE',
    description: 'Réparation système hydraulique',
    dateDebut: new Date('2024-01-16'),
    dateFin: new Date('2024-01-20'),
    statut: 'TERMINEZ',
    piecesUtilisees: [
      { pieceId: 'PEC004', quantite: 1 },
      { pieceId: 'PEC005', quantite: 2 },
      { pieceId: 'PEC020', quantite: 3 },
    ],
    coutEstime: 2200000,
    coutReel: 2150000,
    clientId: 'CLI003',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'INT008',
    machineId: 'MAC010',
    type: 'REPARATION_EXTERNE',
    description: 'Réparation transmission - Embrayage',
    dateDebut: new Date('2024-01-19'),
    dateFin: new Date('2024-01-23'),
    statut: 'EN_COURS',
    piecesUtilisees: [
      { pieceId: 'PEC008', quantite: 1 },
    ],
    coutEstime: 1800000,
    clientId: 'CLI004',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: 'INT009',
    machineId: 'MAC014',
    type: 'REPARATION_EXTERNE',
    description: 'Réparation moteur - Révision complète',
    dateDebut: new Date('2024-01-11'),
    dateFin: new Date('2024-01-17'),
    statut: 'TERMINEZ',
    piecesUtilisees: [
      { pieceId: 'PEC001', quantite: 1 },
      { pieceId: 'PEC003', quantite: 2 },
    ],
    coutEstime: 2000000,
    coutReel: 1950000,
    clientId: 'CLI005',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: 'INT010',
    machineId: 'MAC017',
    type: 'REPARATION_EXTERNE',
    description: 'Réparation électrique - Alternateur',
    dateDebut: new Date('2024-01-21'),
    dateFin: new Date('2024-01-23'),
    statut: 'EN_COURS',
    piecesUtilisees: [
      { pieceId: 'PEC012', quantite: 1 },
      { pieceId: 'PEC013', quantite: 1 },
    ],
    coutEstime: 900000,
    clientId: 'CLI006',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22'),
  },

  // SAV SOUS GARANTIE
  {
    id: 'INT011',
    machineId: 'MAC007',
    type: 'SAV_GARANTIE',
    description: 'Remplacement chaîne - Garantie 2 ans',
    dateDebut: new Date('2024-01-12'),
    dateFin: new Date('2024-01-14'),
    statut: 'TERMINEZ',
    piecesUtilisees: [
      { pieceId: 'PEC009', quantite: 1 },
    ],
    coutEstime: 0,
    coutReel: 0,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: 'INT012',
    machineId: 'MAC011',
    type: 'SAV_GARANTIE',
    description: 'Réparation pompe hydraulique - Garantie constructeur',
    dateDebut: new Date('2024-01-17'),
    dateFin: new Date('2024-01-19'),
    statut: 'TERMINEZ',
    piecesUtilisees: [
      { pieceId: 'PEC004', quantite: 1 },
    ],
    coutEstime: 0,
    coutReel: 0,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-19'),
  },
  {
    id: 'INT013',
    machineId: 'MAC015',
    type: 'SAV_GARANTIE',
    description: 'Remplacement benne - Défaut de fabrication',
    dateDebut: new Date('2024-01-24'),
    dateFin: new Date('2024-01-26'),
    statut: 'EN_COURS',
    piecesUtilisees: [
      { pieceId: 'PEC015', quantite: 1 },
    ],
    coutEstime: 0,
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-24'),
  },
  {
    id: 'INT014',
    machineId: 'MAC018',
    type: 'SAV_GARANTIE',
    description: 'Contrôle et ajustement compacteur - Garantie',
    dateDebut: new Date('2024-01-20'),
    dateFin: new Date('2024-01-21'),
    statut: 'TERMINEZ',
    piecesUtilisees: [],
    coutEstime: 0,
    coutReel: 0,
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-21'),
  },
  {
    id: 'INT015',
    machineId: 'MAC003',
    type: 'SAV_GARANTIE',
    description: 'Maintenance post-vente - Première révision',
    dateDebut: new Date('2024-01-22'),
    dateFin: new Date('2024-01-23'),
    statut: 'EN_COURS',
    piecesUtilisees: [
      { pieceId: 'PEC003', quantite: 1 },
    ],
    coutEstime: 0,
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-22'),
  },
];

export function getInterventionById(id: string): Intervention | undefined {
  return mockInterventions.find(i => i.id === id);
}

export function getInterventionsParMachine(machineId: string): Intervention[] {
  return mockInterventions.filter(i => i.machineId === machineId);
}

export function getInterventionsParType(type: Intervention['type']): Intervention[] {
  return mockInterventions.filter(i => i.type === type);
}

export function getInterventionsParStatut(statut: Intervention['statut']): Intervention[] {
  return mockInterventions.filter(i => i.statut === statut);
}

export function getInterventionsEnCours(): Intervention[] {
  return mockInterventions.filter(i => i.statut === 'EN_COURS');
}

export function getInterventionsTerminees(): Intervention[] {
  return mockInterventions.filter(i => i.statut === 'TERMINEZ');
}

export function getInterventionsExterne(): Intervention[] {
  return mockInterventions.filter(i => i.type === 'REPARATION_EXTERNE');
}

export function getInterventionsSAV(): Intervention[] {
  return mockInterventions.filter(i => i.type === 'SAV_GARANTIE');
}

export function getTotalCoutReparations(): number {
  return mockInterventions
    .filter(i => i.type === 'REPARATION_EXTERNE' && i.coutReel)
    .reduce((sum, i) => sum + (i.coutReel || 0), 0);
}

export function getTotalCoutMaintenanceInterne(): number {
  return mockInterventions
    .filter(i => i.type === 'MAINTENANCE_INTERNE' && i.coutReel)
    .reduce((sum, i) => sum + (i.coutReel || 0), 0);
}
