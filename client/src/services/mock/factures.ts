import { Facture } from '@/types';

export const mockFactures: Facture[] = [
  // FACTURES PROFORMA
  {
    id: 'FAC001',
    numero: 'PROF-2024-001',
    clientId: 'CLI001',
    type: 'PROFORMA',
    dateEmission: new Date('2024-01-20'),
    dateEcheance: new Date('2024-02-20'),
    montantHT: 5000000,
    tauxTVA: 18,
    montantTVA: 900000,
    montantTTC: 5900000,
    statut: 'EMISE',
    nombreRelances: 0,
    lignes: [
      {
        id: 'LIG001',
        description: 'Terrassement - Immeuble Plateau (2500 m³)',
        quantite: 2500,
        prixUnitaire: 2000,
        montantHT: 5000000,
      },
    ],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'FAC002',
    numero: 'PROF-2024-002',
    clientId: 'CLI004',
    type: 'PROFORMA',
    dateEmission: new Date('2024-01-22'),
    dateEcheance: new Date('2024-02-22'),
    montantHT: 2500000,
    tauxTVA: 18,
    montantTVA: 450000,
    montantTTC: 2950000,
    statut: 'BROUILLON',
    nombreRelances: 0,
    lignes: [
      {
        id: 'LIG002',
        description: 'Remblayage - Zone Industrielle (1500 m³)',
        quantite: 1500,
        prixUnitaire: 1800,
        montantHT: 2700000,
      },
    ],
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
  },

  // FACTURES D'ACOMPTE
  {
    id: 'FAC003',
    numero: 'ACOMP-2024-001',
    clientId: 'CLI002',
    type: 'ACOMPTE',
    dateEmission: new Date('2024-01-15'),
    dateEcheance: new Date('2024-02-15'),
    montantHT: 4000000,
    tauxTVA: 18,
    montantTVA: 720000,
    montantTTC: 4720000,
    statut: 'PAYEE',
    modePaiement: 'CASH',
    montantPaye: 4720000,
    datePaiement: new Date('2024-01-16'),
    nombreRelances: 0,
    lignes: [
      {
        id: 'LIG003',
        description: 'Acompte 50% - Fouilles Profondes',
        quantite: 1,
        prixUnitaire: 4000000,
        montantHT: 4000000,
      },
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 'FAC004',
    numero: 'ACOMP-2024-002',
    clientId: 'CLI005',
    type: 'ACOMPTE',
    dateEmission: new Date('2024-01-18'),
    dateEcheance: new Date('2024-02-18'),
    montantHT: 3000000,
    tauxTVA: 18,
    montantTVA: 540000,
    montantTTC: 3540000,
    statut: 'PAYEE',
    modePaiement: 'MOBILE_MONEY',
    montantPaye: 3540000,
    datePaiement: new Date('2024-01-19'),
    nombreRelances: 0,
    lignes: [
      {
        id: 'LIG004',
        description: 'Acompte 40% - Fondations Complexe Résidentiel',
        quantite: 1,
        prixUnitaire: 3000000,
        montantHT: 3000000,
      },
    ],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-19'),
  },

  // FACTURES DÉFINITIVES - PAYÉES
  {
    id: 'FAC005',
    numero: 'FAC-2024-001',
    clientId: 'CLI003',
    type: 'DEFINITIVE',
    dateEmission: new Date('2024-01-25'),
    dateEcheance: new Date('2024-02-25'),
    montantHT: 3450000,
    tauxTVA: 18,
    montantTVA: 621000,
    montantTTC: 4071000,
    statut: 'PAYEE',
    modePaiement: 'CASH',
    montantPaye: 4071000,
    datePaiement: new Date('2024-01-26'),
    nombreRelances: 0,
    lignes: [
      {
        id: 'LIG005',
        description: 'Tranchées - Réseau Assainissement (45 jours)',
        quantite: 45,
        prixUnitaire: 75000,
        montantHT: 3375000,
      },
      {
        id: 'LIG006',
        description: 'Frais de transport',
        quantite: 1,
        prixUnitaire: 75000,
        montantHT: 75000,
      },
    ],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-26'),
  },
  {
    id: 'FAC006',
    numero: 'FAC-2024-002',
    clientId: 'CLI006',
    type: 'DEFINITIVE',
    dateEmission: new Date('2024-01-20'),
    dateEcheance: new Date('2024-02-20'),
    montantHT: 1750000,
    tauxTVA: 18,
    montantTVA: 315000,
    montantTTC: 2065000,
    statut: 'PAYEE',
    modePaiement: 'MOBILE_MONEY',
    montantPaye: 2065000,
    datePaiement: new Date('2024-01-21'),
    nombreRelances: 0,
    lignes: [
      {
        id: 'LIG007',
        description: 'Décapage - Route Nationale (25 jours)',
        quantite: 25,
        prixUnitaire: 70000,
        montantHT: 1750000,
      },
    ],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-21'),
  },

  // FACTURES DÉFINITIVES - IMPAYÉES
  {
    id: 'FAC007',
    numero: 'FAC-2024-003',
    clientId: 'CLI008',
    type: 'DEFINITIVE',
    dateEmission: new Date('2024-01-10'),
    dateEcheance: new Date('2024-02-10'),
    montantHT: 3150000,
    tauxTVA: 18,
    montantTVA: 567000,
    montantTTC: 3717000,
    statut: 'IMPAYEE',
    nombreRelances: 1,
    dateRelance: new Date('2024-01-20'),
    lignes: [
      {
        id: 'LIG008',
        description: 'Terrassement - Parc Industriel (1800 m³)',
        quantite: 1800,
        prixUnitaire: 1900,
        montantHT: 3420000,
      },
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'FAC008',
    numero: 'FAC-2024-004',
    clientId: 'CLI010',
    type: 'DEFINITIVE',
    dateEmission: new Date('2024-01-05'),
    dateEcheance: new Date('2024-02-05'),
    montantHT: 750000,
    tauxTVA: 18,
    montantTVA: 135000,
    montantTTC: 885000,
    statut: 'IMPAYEE',
    nombreRelances: 2,
    dateRelance: new Date('2024-01-22'),
    lignes: [
      {
        id: 'LIG009',
        description: 'Remblayage Petit Chantier (10 jours)',
        quantite: 10,
        prixUnitaire: 75000,
        montantHT: 750000,
      },
    ],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-22'),
  },

  // FACTURES DÉFINITIVES - PARTIELLEMENT PAYÉES
  {
    id: 'FAC009',
    numero: 'FAC-2024-005',
    clientId: 'CLI007',
    type: 'DEFINITIVE',
    dateEmission: new Date('2024-01-12'),
    dateEcheance: new Date('2024-02-12'),
    montantHT: 6000000,
    tauxTVA: 18,
    montantTVA: 1080000,
    montantTTC: 7080000,
    statut: 'PARTIELLEMENT_PAYEE',
    modePaiement: 'CASH',
    montantPaye: 3540000,
    nombreRelances: 1,
    dateRelance: new Date('2024-01-18'),
    lignes: [
      {
        id: 'LIG010',
        description: 'Fondations - Complexe Résidentiel (400 heures)',
        quantite: 400,
        prixUnitaire: 15000,
        montantHT: 6000000,
      },
    ],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'FAC010',
    numero: 'FAC-2024-006',
    clientId: 'CLI009',
    type: 'DEFINITIVE',
    dateEmission: new Date('2024-01-08'),
    dateEcheance: new Date('2024-02-08'),
    montantHT: 3150000,
    tauxTVA: 18,
    montantTVA: 567000,
    montantTTC: 3717000,
    statut: 'PARTIELLEMENT_PAYEE',
    modePaiement: 'MOBILE_MONEY',
    montantPaye: 1858500,
    nombreRelances: 0,
    lignes: [
      {
        id: 'LIG011',
        description: 'Fouilles et Fondations - Immeuble Premium (210 heures)',
        quantite: 210,
        prixUnitaire: 15000,
        montantHT: 3150000,
      },
    ],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-15'),
  },

  // FACTURES BROUILLON
  {
    id: 'FAC011',
    numero: 'FAC-2024-007',
    clientId: 'CLI011',
    type: 'DEFINITIVE',
    dateEmission: new Date('2024-01-23'),
    dateEcheance: new Date('2024-02-23'),
    montantHT: 6500000,
    tauxTVA: 18,
    montantTVA: 1170000,
    montantTTC: 7670000,
    statut: 'BROUILLON',
    nombreRelances: 0,
    lignes: [
      {
        id: 'LIG012',
        description: 'Terrassement - Complexe Commercial (3000 m³)',
        quantite: 3000,
        prixUnitaire: 2100,
        montantHT: 6300000,
      },
      {
        id: 'LIG013',
        description: 'Frais supplémentaires',
        quantite: 1,
        prixUnitaire: 200000,
        montantHT: 200000,
      },
    ],
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-23'),
  },
  {
    id: 'FAC012',
    numero: 'FAC-2024-008',
    clientId: 'CLI012',
    type: 'DEFINITIVE',
    dateEmission: new Date('2024-01-20'),
    dateEcheance: new Date('2024-02-20'),
    montantHT: 2200000,
    tauxTVA: 18,
    montantTVA: 396000,
    montantTTC: 2596000,
    statut: 'BROUILLON',
    nombreRelances: 0,
    lignes: [
      {
        id: 'LIG014',
        description: 'Tranchées Spécialisées - Forfait',
        quantite: 1,
        prixUnitaire: 2200000,
        montantHT: 2200000,
      },
    ],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
];

export function getFactureById(id: string): Facture | undefined {
  return mockFactures.find(f => f.id === id);
}

export function getFacturesParClient(clientId: string): Facture[] {
  return mockFactures.filter(f => f.clientId === clientId);
}

export function getFacturesParType(type: Facture['type']): Facture[] {
  return mockFactures.filter(f => f.type === type);
}

export function getFacturesParStatut(statut: Facture['statut']): Facture[] {
  return mockFactures.filter(f => f.statut === statut);
}

export function getFacturesPayees(): Facture[] {
  return mockFactures.filter(f => f.statut === 'PAYEE');
}

export function getFacturesImpayees(): Facture[] {
  return mockFactures.filter(f => f.statut === 'IMPAYEE');
}

export function getFacturesPartiellemntPayees(): Facture[] {
  return mockFactures.filter(f => f.statut === 'PARTIELLEMENT_PAYEE');
}

export function getTotalFacturesEmises(): number {
  return mockFactures
    .filter(f => f.statut !== 'BROUILLON')
    .reduce((sum, f) => sum + f.montantTTC, 0);
}

export function getTotalFacturesPayees(): number {
  return mockFactures
    .filter(f => f.statut === 'PAYEE')
    .reduce((sum, f) => sum + f.montantTTC, 0);
}

export function getTotalFacturesImpayees(): number {
  return mockFactures
    .filter(f => f.statut === 'IMPAYEE')
    .reduce((sum, f) => sum + f.montantTTC, 0);
}

export function getTotalCashRecus(): number {
  return mockFactures
    .filter(f => f.modePaiement === 'CASH' && f.montantPaye)
    .reduce((sum, f) => sum + (f.montantPaye || 0), 0);
}

export function getTotalMobileMoneyRecus(): number {
  return mockFactures
    .filter(f => f.modePaiement === 'MOBILE_MONEY' && f.montantPaye)
    .reduce((sum, f) => sum + (f.montantPaye || 0), 0);
}
