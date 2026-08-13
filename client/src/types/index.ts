// ============================================================================
// TYPES & INTERFACES - 3BTRADING ERP/CRM
// ============================================================================

// ============================================================================
// CLIENTS
// ============================================================================
export interface Client {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  typeClient: 'STANDARD' | 'PARTENAIRE';
  solde: number; // Solde créditeur/débiteur
  dateCreation: Date;
  contact?: string;
  siret?: string;
}

// ============================================================================
// CHANTIERS (PRESTATIONS)
// ============================================================================
export type ModeFacturation = 'FORFAIT' | 'CUBAGE' | 'HORAIRE' | 'JOURNALIER';
export type TypeTravail = 
  | 'TERRASSEMENT_MASSE'
  | 'DECAPAGE'
  | 'FOUILLES_PROFONDES'
  | 'TRANCHEES'
  | 'REMBLAYAGE'
  | 'ASSAINISSEMENT'
  | 'FONDATIONS';

export interface Chantier {
  id: string;
  clientId: string;
  titre: string;
  description: string;
  typesTravaux: TypeTravail[];
  modeFacturation: ModeFacturation;
  dateDebut: Date;
  dateFin?: Date;
  statut: 'PLANIFIE' | 'EN_COURS' | 'TERMINE' | 'FACTURE';
  montantEstime: number;
  montantReel?: number;
  
  // Champs spécifiques au mode de facturation
  volume?: number; // m³ pour CUBAGE
  heures?: number; // pour HORAIRE
  jours?: number; // pour JOURNALIER
  tauxHoraire?: number; // €/h pour HORAIRE
  tauxJournalier?: number; // €/jour pour JOURNALIER
  tauxParM3?: number; // €/m³ pour CUBAGE
  montantForfait?: number; // € pour FORFAIT
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// MACHINES (LOCATION & VENTE)
// ============================================================================
export type TypeMachine = 'CAMION' | 'PELLE' | 'CHARGEUR' | 'BULLDOZER' | 'COMPACTEUR';
export type StatutMachine = 'DISPONIBLE' | 'LOUE' | 'MAINTENANCE' | 'HORS_SERVICE';

export interface Machine {
  id: string;
  nom: string;
  type: TypeMachine;
  marque: string;
  modele: string;
  annee: number;
  immatriculation: string;
  statut: StatutMachine;
  
  // Tarification Location
  tarifJournalier: number; // €/jour
  tarifRotation?: number; // €/rotation (pour camions-bennes)
  tarifDegressif?: number; // €/jour si durée > 7 jours
  
  // Vente
  prixVente?: number; // € (si en vente)
  enVente: boolean;

  // Description, Images & Détails
  description?: string;
  imageUrl?: string;
  imagesGalerie?: string[];
  specifications?: Record<string, string>;
  isPublie?: boolean;

  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// LOCATIONS
// ============================================================================
export type ModeLocationFacturation = 'JOURNALIER' | 'ROTATION' | 'DEGRESSIF';
export type StatutLocation = 'RESERVEE' | 'SORTIE' | 'RETOURNEE' | 'FACTUREE';

export interface Location {
  id: string;
  clientId: string;
  machineId: string;
  dateDebut: Date;
  dateFin: Date;
  modeFacturation: ModeLocationFacturation;
  tarifJournalier: number;
  nombreJours: number;
  montantTotal: number;
  statut: StatutLocation;
  
  // Paiement
  paiementEffectue: boolean;
  paiementType?: 'CASH' | 'MOBILE_MONEY';
  montantPaye?: number;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// PIÈCES DÉTACHÉES
// ============================================================================
export type MarquePiece = 'CATERPILLAR' | 'HITACHI' | 'POCLAIN' | 'KOMATSU' | 'VOLVO' | 'LIEBHERR' | 'JCB';
export type FamillePiece = 'MOTEUR' | 'HYDRAULIQUE' | 'TRANSMISSION' | 'CHASSIS' | 'ELECTRIQUE' | 'CARROSSERIE';

export interface Piece {
  id: string;
  nom: string;
  reference: string;
  referenceOEM: string;
  marque: MarquePiece;
  famille: FamillePiece;
  compatibilitesMachines: string[]; // IDs des machines compatibles
  stock: number;
  seuilAlerte: number;
  prixUnitaire: number;
  fournisseur: string;

  // Description, Images & Détails
  description?: string;
  imageUrl?: string;
  imagesGalerie?: string[];
  specifications?: Record<string, string>;
  isPublie?: boolean;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// INTERVENTIONS ATELIER
// ============================================================================
export type TypeIntervention = 'MAINTENANCE_INTERNE' | 'REPARATION_EXTERNE' | 'SAV_GARANTIE';
export type StatutIntervention = 'PLANIFIEE' | 'EN_COURS' | 'TERMINEZ';

export interface InterventionPiece {
  pieceId: string;
  quantite: number;
  prixUnitaire?: number;
}

export interface Intervention {
  id: string;
  machineId: string;
  type: TypeIntervention;
  description: string;
  dateDebut: Date;
  dateFin?: Date;
  statut: StatutIntervention;
  piecesUtilisees: InterventionPiece[];
  coutEstime?: number;
  coutReel?: number;
  clientId?: string; // Pour les réparations externes
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// FACTURES
// ============================================================================
export type TypeFacture = 'PROFORMA' | 'ACOMPTE' | 'DEFINITIVE';
export type StatutFacture = 'BROUILLON' | 'EMISE' | 'PAYEE' | 'IMPAYEE' | 'PARTIELLEMENT_PAYEE';
export type ModeReglement = 'CASH' | 'MOBILE_MONEY';

export interface FactureLigne {
  id: string;
  description: string;
  quantite: number;
  prixUnitaire: number;
  montantHT: number;
}

export interface Facture {
  id: string;
  numero: string;
  clientId: string;
  type: TypeFacture;
  dateEmission: Date;
  dateEcheance: Date;
  montantHT: number;
  tauxTVA: number; // En %
  montantTVA: number;
  montantTTC: number;
  statut: StatutFacture;
  
  // Paiement
  modePaiement?: ModeReglement;
  montantPaye?: number;
  datePaiement?: Date;
  
  // Relances
  dateRelance?: Date;
  nombreRelances: number;
  
  // Contenu
  lignes: FactureLigne[];
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// KPI & STATISTIQUES
// ============================================================================
export interface KPIDashboard {
  chiffre_affaires_total: number;
  cash_total: number;
  mobile_money_total: number;
  impayees_total: number;
  nombre_chantiers_actifs: number;
  nombre_machines_louees: number;
  nombre_pieces_rupture_stock: number;
}

export interface AlerteStock {
  pieceId: string;
  nom: string;
  stock: number;
  seuilAlerte: number;
}

export interface AlerteFacture {
  factureId: string;
  numero: string;
  clientId: string;
  montantImpaye: number;
  jours_impaye: number;
}

// ============================================================================
// FILTRES & RECHERCHE
// ============================================================================
export interface FiltreChantier {
  statut?: Chantier['statut'];
  clientId?: string;
  typesTravaux?: TypeTravail[];
  dateDebut?: Date;
  dateFin?: Date;
}

export interface FiltreLocation {
  statut?: StatutLocation;
  clientId?: string;
  machineId?: string;
  dateDebut?: Date;
  dateFin?: Date;
}

export interface FiltrePiece {
  marque?: MarquePiece;
  famille?: FamillePiece;
  compatibilite?: string; // ID machine
  recherche?: string; // Recherche par nom/référence
}

export interface FiltreFacture {
  statut?: StatutFacture;
  type?: TypeFacture;
  clientId?: string;
  dateDebut?: Date;
  dateFin?: Date;
}
