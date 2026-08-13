# 3BTRADING - Vision Design & Architecture

## Contexte Métier
3BTRADING est une entreprise de **Travaux Publics** spécialisée dans :
- **Prestations** : Terrassement, décapage, fouilles, tranchées, remblayage, assainissement, fondations
- **Location** : Engins "Clés en main" (Chauffeur + Carburant inclus)
- **Commerce** : Vente de machines lourdes et pièces détachées

## Approche Design Choisie : **Industrial Professional**

### Theme Name
**Industrial Professional** - Une interface robuste, confiante et orientée vers l'efficacité opérationnelle.

### Design Movement
Inspirée du design **Brutalist moderne** mélangé à des principes d'**Enterprise UI**. Accent sur la clarté, la hiérarchie fonctionnelle et la confiance.

### Core Principles
1. **Clarté Hiérarchique** : Chaque écran a une structure claire (titre → actions → contenu → détails)
2. **Efficacité Opérationnelle** : Les informations critiques (KPI, alertes, statuts) sont immédiatement visibles
3. **Robustesse Visuelle** : Utilisation de contrastes forts, typographie imposante et espacements généreux
4. **Confiance & Professionnalisme** : Palette sobre, pas de fantaisie, mais du polish

### Color Philosophy
- **Primaire** : Bleu-gris profond (`#1F2937` / `#111827`) - Stabilité, confiance
- **Accent Chantier** : Orange-jaune chaleureux (`#F59E0B` / `#FBBF24`) - Énergie, travaux, danger (attention)
- **Accent Succès** : Vert forestier (`#10B981`) - Confirmations, statuts positifs
- **Accent Alerte** : Rouge industriel (`#EF4444`) - Impayés, ruptures de stock
- **Neutres** : Gris professionnel (50 à 900) - Hiérarchie et clarté

**Logique émotionnelle** : Le bleu inspire confiance et stabilité (ERP/Finance), l'orange rappelle les chantiers et les engins, le vert rassure sur les succès.

### Layout Paradigm
- **Landing Page** : Asymétrique, avec sections alternées (texte à gauche/image à droite, puis inversé)
- **Admin Dashboard** : Layout **Sidebar + Main** (navigation latérale rétractable, contenu fluide)
- **Modules** : Grilles 12 colonnes avec cartes/panneaux pour les données
- **Formulaires** : Deux colonnes sur desktop, une colonne sur mobile

### Signature Elements
1. **Ligne verticale orange** : Accent de marque sur le sidebar et les cartes principales
2. **Typographie imposante** : Titres en gras, corps lisible (18px minimum pour les KPI)
3. **Cartes avec ombre douce** : Chaque section de données dans une carte avec ombre `shadow-md`

### Interaction Philosophy
- **Transitions fluides** : 200-300ms pour les changements d'état
- **Feedback immédiat** : Boutons avec `scale(0.97)` au clic, toasts pour les actions
- **Hover states** : Cartes s'élèvent légèrement, boutons changent de couleur
- **Animations** : Entrées en cascade pour les listes, pas de mouvement excessif

### Animation Guidelines
- **Boutons** : `active:scale-97` avec transition `200ms ease-out`
- **Listes** : Stagger de 30-50ms par item
- **Modales** : Entrée depuis le bas avec `opacity: 0 → 1` et `translateY: 20px → 0`
- **Transitions de page** : Fade-in rapide (150ms)
- **Respect `prefers-reduced-motion`** : Désactiver les animations pour l'accessibilité

### Typography System
- **Display** : `Poppins Bold` (700) - Titres principaux, KPI
- **Heading** : `Poppins SemiBold` (600) - Sous-titres, en-têtes de section
- **Body** : `Inter Regular` (400) - Texte courant, descriptions
- **Mono** : `JetBrains Mono` (400) - Références, numéros de chantier, codes

**Hiérarchie** :
- H1 : 32px, Poppins Bold
- H2 : 24px, Poppins SemiBold
- H3 : 18px, Poppins SemiBold
- Body : 14px, Inter Regular
- Small : 12px, Inter Regular

### Brand Essence
**Positioning** : Logiciel ERP pour les entreprises de travaux publics qui veulent gérer leurs chantiers, locations et finances avec confiance et clarté.

**Personality** : Fiable, Direct, Professionnel

**Brand Voice** :
- Titres : Directs, sans fioritures. Ex : "Gestion des Chantiers", "Factures Impayées"
- CTA : Actifs, clairs. Ex : "Créer un Chantier", "Générer Facture Proforma"
- Microcopy : Utile et concis. Ex : "Aucun chantier en cours" (pas "Oups, rien ici !")

### Wordmark & Logo
**Concept** : Un symbole géométrique représentant une **pelle stylisée** (outil de travaux publics) combinée avec une **flèche ascendante** (croissance/succès).

- Forme : Pelle + flèche en un seul glyph minimaliste
- Couleur : Orange-jaune (`#F59E0B`) sur fond blanc/transparent
- Utilisation : Logo dans le header (40px), favicon (16px)
- Pas de texte dans le logo (wordmark séparé si nécessaire)

### Signature Brand Color
**Orange-Jaune Chantier** : `#F59E0B` (Tailwind: `amber-500`)
- Utilisé pour : Accent principal, boutons CTA, lignes de marque, icônes d'alerte
- Raison : Rappelle l'énergie des chantiers, l'équipement lourd, et crée une identité visuelle forte

---

## Structure Technique

### Dossiers Clés
```
client/src/
├── pages/
│   ├── Home.tsx                 (Landing Page)
│   ├── admin/
│   │   ├── Dashboard.tsx        (Vue d'ensemble)
│   │   ├── Chantiers.tsx        (Gestion des prestations)
│   │   ├── Locations.tsx        (Planning + Réservations)
│   │   ├── Boutique.tsx         (Stock & Vente)
│   │   ├── Atelier.tsx          (Mécanique)
│   │   └── Facturation.tsx      (Finance)
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx          (Navigation latérale)
│   │   ├── AdminLayout.tsx      (Wrapper pour admin)
│   │   └── Header.tsx
│   ├── dashboard/
│   │   ├── KPICard.tsx
│   │   ├── AlertCard.tsx
│   │   └── FleetStatus.tsx
│   └── (autres composants réutilisables)
├── hooks/
│   ├── useChantiers.ts
│   ├── useLocations.ts
│   ├── useStock.ts
│   └── useFactures.ts
├── services/
│   ├── mock/
│   │   ├── clients.ts
│   │   ├── chantiers.ts
│   │   ├── locations.ts
│   │   ├── machines.ts
│   │   ├── pieces.ts
│   │   ├── interventions.ts
│   │   └── factures.ts
│   └── calculations.ts          (Logique métier : calculs de prix, taxes, etc.)
└── types/
    └── index.ts                 (Interfaces TypeScript)
```

### Interfaces TypeScript Principales

```typescript
// Clients
interface Client {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  typeClient: 'STANDARD' | 'PARTENAIRE';
  solde: number;
  dateCreation: Date;
}

// Chantiers (Prestations)
interface Chantier {
  id: string;
  clientId: string;
  titre: string;
  description: string;
  typesTravaux: string[]; // Terrassement, Décapage, etc.
  modeFacturation: 'FORFAIT' | 'CUBAGE' | 'HORAIRE' | 'JOURNALIER';
  dateDebut: Date;
  dateFin?: Date;
  statut: 'PLANIFIE' | 'EN_COURS' | 'TERMINE' | 'FACTURE';
  montantEstime: number;
  montantReel?: number;
  // Champs spécifiques au mode
  volume?: number; // m³ pour CUBAGE
  heures?: number; // pour HORAIRE
  jours?: number; // pour JOURNALIER
  tauxHoraire?: number;
  tauxJournalier?: number;
  tauxParM3?: number;
}

// Locations
interface Location {
  id: string;
  clientId: string;
  machineId: string;
  dateDebut: Date;
  dateFin: Date;
  modeFacturation: 'JOURNALIER' | 'ROTATION' | 'DEGRESSIF';
  tarifJournalier: number;
  nombreJours: number;
  montantTotal: number;
  statut: 'RESERVEE' | 'SORTIE' | 'RETOURNEE' | 'FACTUREE';
  paiementEffectue: boolean;
  paiementType?: 'CASH' | 'MOBILE_MONEY';
}

// Machines
interface Machine {
  id: string;
  nom: string;
  type: 'CAMION' | 'PELLE' | 'CHARGEUR' | 'BULLDOZER' | 'COMPACTEUR';
  marque: string;
  modele: string;
  annee: number;
  immatriculation: string;
  statut: 'DISPONIBLE' | 'LOUE' | 'MAINTENANCE' | 'HORS_SERVICE';
  tarifJournalier: number;
  tarifRotation?: number;
  prixVente?: number;
}

// Pièces Détachées
interface Piece {
  id: string;
  nom: string;
  reference: string;
  referenceOEM: string;
  marque: 'CATERPILLAR' | 'HITACHI' | 'POCLAIN' | 'KOMATSU' | 'VOLVO';
  famille: 'MOTEUR' | 'HYDRAULIQUE' | 'TRANSMISSION' | 'CHASSIS' | 'ELECTRIQUE';
  compatibilitesMachines: string[]; // IDs des machines compatibles
  stock: number;
  seuilAlerte: number;
  prixUnitaire: number;
  fournisseur: string;
}

// Interventions Atelier
interface Intervention {
  id: string;
  machineId: string;
  type: 'MAINTENANCE_INTERNE' | 'REPARATION_EXTERNE' | 'SAV_GARANTIE';
  description: string;
  dateDebut: Date;
  dateFin?: Date;
  statut: 'PLANIFIEE' | 'EN_COURS' | 'TERMINEZ';
  piecesUtilisees: { pieceId: string; quantite: number }[];
  coutEstime?: number;
  coutReel?: number;
  clientId?: string; // Pour les réparations externes
}

// Factures
interface Facture {
  id: string;
  numero: string;
  clientId: string;
  type: 'PROFORMA' | 'ACOMPTE' | 'DEFINITIVE';
  dateEmission: Date;
  dateEcheance: Date;
  montantHT: number;
  tauxTVA: number;
  montantTVA: number;
  montantTTC: number;
  statut: 'BROUILLON' | 'EMISE' | 'PAYEE' | 'IMPAYEE' | 'PARTIELLEMENT_PAYEE';
  modePaiement?: 'CASH' | 'MOBILE_MONEY';
  montantPaye?: number;
  dateRelance?: Date;
  nombreRelances: number;
  lignes: FactureLigne[];
}

interface FactureLigne {
  id: string;
  description: string;
  quantite: number;
  prixUnitaire: number;
  montantHT: number;
}
```

---

## Données Mock - Stratégie

Les données mock seront **complètes et réalistes** :
- **10-15 clients** (mix STANDARD et PARTENAIRE)
- **20-30 chantiers** (différents modes de facturation, statuts variés)
- **15-20 machines** (tous les types, statuts mixtes)
- **50+ pièces détachées** (toutes les marques et familles)
- **30+ interventions** (tous les types)
- **40+ factures** (tous les statuts, avec impayés)

Chaque mock sera généré avec des données cohérentes (ex : une location ne peut pas avoir une machine qui n'existe pas).

---

## Prochaines Étapes

1. ✅ Brainstorming design (CE DOCUMENT)
2. ⏳ Créer les interfaces TypeScript et les services mock
3. ⏳ Générer les images de marque (logo, backgrounds)
4. ⏳ Développer la Landing Page
5. ⏳ Développer l'Admin Dashboard
6. ⏳ Développer les modules spécialisés
