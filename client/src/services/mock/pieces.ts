import { Piece } from '@/types';

export const mockPieces: Piece[] = [
  // MOTEURS - CATERPILLAR
  {
    id: 'PEC001',
    nom: 'Moteur Caterpillar C15',
    reference: 'CAT-C15-001',
    referenceOEM: '3456789',
    marque: 'CATERPILLAR',
    famille: 'MOTEUR',
    compatibilitesMachines: ['MAC005', 'MAC009', 'MAC013'],
    stock: 3,
    seuilAlerte: 2,
    prixUnitaire: 8500000,
    fournisseur: 'Caterpillar Senegal',
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'PEC002',
    nom: 'Turbo Caterpillar C15',
    reference: 'CAT-TURBO-C15',
    referenceOEM: '3456790',
    marque: 'CATERPILLAR',
    famille: 'MOTEUR',
    compatibilitesMachines: ['MAC005', 'MAC009', 'MAC013'],
    stock: 0,
    seuilAlerte: 1,
    prixUnitaire: 1200000,
    fournisseur: 'Caterpillar Senegal',
    createdAt: new Date('2023-07-10'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'PEC003',
    nom: 'Filtre à Air Caterpillar',
    reference: 'CAT-AIR-FILTER',
    referenceOEM: '3456791',
    marque: 'CATERPILLAR',
    famille: 'MOTEUR',
    compatibilitesMachines: ['MAC005', 'MAC009', 'MAC013', 'MAC001', 'MAC002'],
    stock: 15,
    seuilAlerte: 5,
    prixUnitaire: 85000,
    fournisseur: 'Caterpillar Senegal',
    createdAt: new Date('2023-05-20'),
    updatedAt: new Date('2024-01-18'),
  },

  // HYDRAULIQUE - HITACHI
  {
    id: 'PEC004',
    nom: 'Pompe Hydraulique Hitachi',
    reference: 'HIT-PUMP-001',
    referenceOEM: '9876543',
    marque: 'HITACHI',
    famille: 'HYDRAULIQUE',
    compatibilitesMachines: ['MAC006', 'MAC007'],
    stock: 2,
    seuilAlerte: 2,
    prixUnitaire: 2500000,
    fournisseur: 'Hitachi Dakar',
    createdAt: new Date('2023-08-12'),
    updatedAt: new Date('2024-01-19'),
  },
  {
    id: 'PEC005',
    nom: 'Cylindre Hydraulique Hitachi',
    reference: 'HIT-CYL-001',
    referenceOEM: '9876544',
    marque: 'HITACHI',
    famille: 'HYDRAULIQUE',
    compatibilitesMachines: ['MAC006', 'MAC007'],
    stock: 8,
    seuilAlerte: 3,
    prixUnitaire: 450000,
    fournisseur: 'Hitachi Dakar',
    createdAt: new Date('2023-09-05'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: 'PEC006',
    nom: 'Valve Hydraulique Hitachi',
    reference: 'HIT-VALVE-001',
    referenceOEM: '9876545',
    marque: 'HITACHI',
    famille: 'HYDRAULIQUE',
    compatibilitesMachines: ['MAC006', 'MAC007'],
    stock: 12,
    seuilAlerte: 4,
    prixUnitaire: 250000,
    fournisseur: 'Hitachi Dakar',
    createdAt: new Date('2023-07-22'),
    updatedAt: new Date('2024-01-16'),
  },

  // TRANSMISSION - POCLAIN
  {
    id: 'PEC007',
    nom: 'Boîte de Vitesse Poclain',
    reference: 'POC-TRANS-001',
    referenceOEM: '5555555',
    marque: 'POCLAIN',
    famille: 'TRANSMISSION',
    compatibilitesMachines: ['MAC008'],
    stock: 1,
    seuilAlerte: 1,
    prixUnitaire: 3200000,
    fournisseur: 'Poclain Europe',
    createdAt: new Date('2023-10-14'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: 'PEC008',
    nom: 'Embrayage Poclain',
    reference: 'POC-CLUTCH-001',
    referenceOEM: '5555556',
    marque: 'POCLAIN',
    famille: 'TRANSMISSION',
    compatibilitesMachines: ['MAC008'],
    stock: 3,
    seuilAlerte: 2,
    prixUnitaire: 650000,
    fournisseur: 'Poclain Europe',
    createdAt: new Date('2023-11-08'),
    updatedAt: new Date('2024-01-13'),
  },

  // CHASSIS - KOMATSU
  {
    id: 'PEC009',
    nom: 'Chaîne de Roulement Komatsu',
    reference: 'KOM-TRACK-001',
    referenceOEM: '7777777',
    marque: 'KOMATSU',
    famille: 'CHASSIS',
    compatibilitesMachines: ['MAC007'],
    stock: 2,
    seuilAlerte: 2,
    prixUnitaire: 1800000,
    fournisseur: 'Komatsu Japon',
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: 'PEC010',
    nom: 'Galet de Roulement Komatsu',
    reference: 'KOM-ROLLER-001',
    referenceOEM: '7777778',
    marque: 'KOMATSU',
    famille: 'CHASSIS',
    compatibilitesMachines: ['MAC007'],
    stock: 6,
    seuilAlerte: 3,
    prixUnitaire: 350000,
    fournisseur: 'Komatsu Japon',
    createdAt: new Date('2023-12-10'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: 'PEC011',
    nom: 'Ressort de Suspension Komatsu',
    reference: 'KOM-SPRING-001',
    referenceOEM: '7777779',
    marque: 'KOMATSU',
    famille: 'CHASSIS',
    compatibilitesMachines: ['MAC007'],
    stock: 4,
    seuilAlerte: 2,
    prixUnitaire: 280000,
    fournisseur: 'Komatsu Japon',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-10'),
  },

  // ELECTRIQUE - VOLVO
  {
    id: 'PEC012',
    nom: 'Alternateur Volvo',
    reference: 'VOL-ALT-001',
    referenceOEM: '4444444',
    marque: 'VOLVO',
    famille: 'ELECTRIQUE',
    compatibilitesMachines: ['MAC001', 'MAC002', 'MAC010', 'MAC017'],
    stock: 5,
    seuilAlerte: 2,
    prixUnitaire: 450000,
    fournisseur: 'Volvo Trucks',
    createdAt: new Date('2023-06-20'),
    updatedAt: new Date('2024-01-09'),
  },
  {
    id: 'PEC013',
    nom: 'Démarreur Volvo',
    reference: 'VOL-START-001',
    referenceOEM: '4444445',
    marque: 'VOLVO',
    famille: 'ELECTRIQUE',
    compatibilitesMachines: ['MAC001', 'MAC002', 'MAC010', 'MAC017'],
    stock: 7,
    seuilAlerte: 3,
    prixUnitaire: 320000,
    fournisseur: 'Volvo Trucks',
    createdAt: new Date('2023-07-15'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: 'PEC014',
    nom: 'Batterie Volvo 12V',
    reference: 'VOL-BATT-12V',
    referenceOEM: '4444446',
    marque: 'VOLVO',
    famille: 'ELECTRIQUE',
    compatibilitesMachines: ['MAC001', 'MAC002', 'MAC010', 'MAC017'],
    stock: 10,
    seuilAlerte: 5,
    prixUnitaire: 180000,
    fournisseur: 'Volvo Trucks',
    createdAt: new Date('2023-08-22'),
    updatedAt: new Date('2024-01-07'),
  },

  // CARROSSERIE - LIEBHERR
  {
    id: 'PEC015',
    nom: 'Benne Liebherr',
    reference: 'LIE-BUCKET-001',
    referenceOEM: '6666666',
    marque: 'LIEBHERR',
    famille: 'CARROSSERIE',
    compatibilitesMachines: ['MAC012', 'MAC015'],
    stock: 1,
    seuilAlerte: 1,
    prixUnitaire: 5000000,
    fournisseur: 'Liebherr France',
    createdAt: new Date('2023-09-10'),
    updatedAt: new Date('2024-01-06'),
  },
  {
    id: 'PEC016',
    nom: 'Bras Liebherr',
    reference: 'LIE-ARM-001',
    referenceOEM: '6666667',
    marque: 'LIEBHERR',
    famille: 'CARROSSERIE',
    compatibilitesMachines: ['MAC012', 'MAC015'],
    stock: 2,
    seuilAlerte: 1,
    prixUnitaire: 3500000,
    fournisseur: 'Liebherr France',
    createdAt: new Date('2023-10-05'),
    updatedAt: new Date('2024-01-05'),
  },

  // MOTEUR - SINOTRUK
  {
    id: 'PEC017',
    nom: 'Moteur Sinotruk HOWO',
    reference: 'SIN-ENGINE-001',
    referenceOEM: '8888888',
    marque: 'VOLVO',
    famille: 'MOTEUR',
    compatibilitesMachines: ['MAC004'],
    stock: 2,
    seuilAlerte: 1,
    prixUnitaire: 4500000,
    fournisseur: 'Sinotruk Chine',
    createdAt: new Date('2023-11-12'),
    updatedAt: new Date('2024-01-04'),
  },
  {
    id: 'PEC018',
    nom: 'Radiateur Sinotruk',
    reference: 'SIN-RAD-001',
    referenceOEM: '8888889',
    marque: 'VOLVO',
    famille: 'MOTEUR',
    compatibilitesMachines: ['MAC004'],
    stock: 4,
    seuilAlerte: 2,
    prixUnitaire: 320000,
    fournisseur: 'Sinotruk Chine',
    createdAt: new Date('2023-12-08'),
    updatedAt: new Date('2024-01-03'),
  },

  // HYDRAULIQUE - CATERPILLAR
  {
    id: 'PEC019',
    nom: 'Pompe Hydraulique Caterpillar',
    reference: 'CAT-PUMP-HYD',
    referenceOEM: '3456792',
    marque: 'CATERPILLAR',
    famille: 'HYDRAULIQUE',
    compatibilitesMachines: ['MAC005', 'MAC009', 'MAC013'],
    stock: 1,
    seuilAlerte: 1,
    prixUnitaire: 2800000,
    fournisseur: 'Caterpillar Senegal',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: 'PEC020',
    nom: 'Tuyau Hydraulique Caterpillar',
    reference: 'CAT-HOSE-HYD',
    referenceOEM: '3456793',
    marque: 'CATERPILLAR',
    famille: 'HYDRAULIQUE',
    compatibilitesMachines: ['MAC005', 'MAC009', 'MAC013'],
    stock: 20,
    seuilAlerte: 5,
    prixUnitaire: 45000,
    fournisseur: 'Caterpillar Senegal',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export function getPieceById(id: string): Piece | undefined {
  return mockPieces.find(p => p.id === id);
}

export function getPiecesParMarque(marque: Piece['marque']): Piece[] {
  return mockPieces.filter(p => p.marque === marque);
}

export function getPiecesParFamille(famille: Piece['famille']): Piece[] {
  return mockPieces.filter(p => p.famille === famille);
}

export function getPiecesRuptureStock(): Piece[] {
  return mockPieces.filter(p => p.stock <= p.seuilAlerte);
}

export function getPiecesCompatibles(machineId: string): Piece[] {
  return mockPieces.filter(p => p.compatibilitesMachines.includes(machineId));
}

export function rechercherPieces(terme: string): Piece[] {
  const termeLower = terme.toLowerCase();
  return mockPieces.filter(
    p =>
      p.nom.toLowerCase().includes(termeLower) ||
      p.reference.toLowerCase().includes(termeLower) ||
      p.referenceOEM.toLowerCase().includes(termeLower)
  );
}

export function getPiecesFiltrées(
  marque?: Piece['marque'],
  famille?: Piece['famille'],
  machineId?: string,
  recherche?: string
): Piece[] {
  let resultat = [...mockPieces];

  if (marque) {
    resultat = resultat.filter(p => p.marque === marque);
  }

  if (famille) {
    resultat = resultat.filter(p => p.famille === famille);
  }

  if (machineId) {
    resultat = resultat.filter(p => p.compatibilitesMachines.includes(machineId));
  }

  if (recherche) {
    const termeLower = recherche.toLowerCase();
    resultat = resultat.filter(
      p =>
        p.nom.toLowerCase().includes(termeLower) ||
        p.reference.toLowerCase().includes(termeLower) ||
        p.referenceOEM.toLowerCase().includes(termeLower)
    );
  }

  return resultat;
}
