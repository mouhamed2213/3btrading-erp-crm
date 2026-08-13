import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================================
// CLIENTS
// ============================================================================
export const clients = mysqlTable("clients", {
  id: varchar("id", { length: 36 }).primaryKey(),
  nom: varchar("nom", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  telephone: varchar("telephone", { length: 20 }),
  adresse: text("adresse"),
  typeClient: mysqlEnum("typeClient", ["STANDARD", "PARTENAIRE"]).default("STANDARD").notNull(),
  solde: decimal("solde", { precision: 15, scale: 2 }).default("0").notNull(),
  dateCreation: timestamp("dateCreation").defaultNow().notNull(),
  contact: varchar("contact", { length: 255 }),
  siret: varchar("siret", { length: 20 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

// ============================================================================
// MACHINES
// ============================================================================
export const machines = mysqlTable("machines", {
  id: varchar("id", { length: 36 }).primaryKey(),
  nom: varchar("nom", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  marque: varchar("marque", { length: 100 }).notNull(),
  modele: varchar("modele", { length: 100 }),
  annee: int("annee"),
  statut: mysqlEnum("statut", ["DISPONIBLE", "EN_LOCATION", "EN_MAINTENANCE", "VENDUE"]).default("DISPONIBLE").notNull(),
  tarifJournalier: decimal("tarifJournalier", { precision: 15, scale: 2 }).notNull(),
  tarifRotation: decimal("tarifRotation", { precision: 15, scale: 2 }),
  tarifDegressif: decimal("tarifDegressif", { precision: 15, scale: 2 }),
  prixVente: decimal("prixVente", { precision: 15, scale: 2 }),
  enVente: boolean("enVente").default(false).notNull(),
  enLocation: boolean("enLocation").default(false).notNull(),
  dateCreation: timestamp("dateCreation").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Machine = typeof machines.$inferSelect;
export type InsertMachine = typeof machines.$inferInsert;

// ============================================================================
// CHANTIERS (PRESTATIONS)
// ============================================================================
export const chantiers = mysqlTable("chantiers", {
  id: varchar("id", { length: 36 }).primaryKey(),
  clientId: varchar("clientId", { length: 36 }).notNull(),
  titre: varchar("titre", { length: 255 }).notNull(),
  description: text("description"),
  typesTravaux: json("typesTravaux").$type<string[]>().notNull(),
  modeFacturation: mysqlEnum("modeFacturation", ["FORFAIT", "CUBAGE", "HORAIRE", "JOURNALIER"]).notNull(),
  dateDebut: timestamp("dateDebut").notNull(),
  dateFin: timestamp("dateFin"),
  statut: mysqlEnum("statut", ["PLANIFIE", "EN_COURS", "TERMINE", "FACTURE"]).default("PLANIFIE").notNull(),
  montantEstime: decimal("montantEstime", { precision: 15, scale: 2 }).notNull(),
  montantReel: decimal("montantReel", { precision: 15, scale: 2 }),
  volume: decimal("volume", { precision: 12, scale: 2 }),
  heures: decimal("heures", { precision: 12, scale: 2 }),
  jours: int("jours"),
  dateCreation: timestamp("dateCreation").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Chantier = typeof chantiers.$inferSelect;
export type InsertChantier = typeof chantiers.$inferInsert;

// ============================================================================
// LOCATIONS
// ============================================================================
export const locations = mysqlTable("locations", {
  id: varchar("id", { length: 36 }).primaryKey(),
  machineId: varchar("machineId", { length: 36 }).notNull(),
  clientId: varchar("clientId", { length: 36 }).notNull(),
  dateDebut: timestamp("dateDebut").notNull(),
  dateFin: timestamp("dateFin").notNull(),
  jours: int("jours").notNull(),
  tarifType: mysqlEnum("tarifType", ["JOURNALIER", "ROTATION", "DEGRESSIF"]).notNull(),
  montantTotal: decimal("montantTotal", { precision: 15, scale: 2 }).notNull(),
  montantPaye: decimal("montantPaye", { precision: 15, scale: 2 }).default("0").notNull(),
  modePaiement: mysqlEnum("modePaiement", ["CASH", "MOBILE_MONEY"]),
  statut: mysqlEnum("statut", ["RESERVEE", "SORTIE", "RETOURNEE"]).default("RESERVEE").notNull(),
  dateCreation: timestamp("dateCreation").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Location = typeof locations.$inferSelect;
export type InsertLocation = typeof locations.$inferInsert;

// ============================================================================
// PIECES DETACHEES
// ============================================================================
export const pieces = mysqlTable("pieces", {
  id: varchar("id", { length: 36 }).primaryKey(),
  reference: varchar("reference", { length: 100 }).notNull().unique(),
  nom: varchar("nom", { length: 255 }).notNull(),
  marque: varchar("marque", { length: 100 }).notNull(),
  famille: varchar("famille", { length: 100 }).notNull(),
  compatibilites: json("compatibilites").$type<string[]>().notNull(),
  stock: int("stock").default(0).notNull(),
  seuilAlerte: int("seuilAlerte").default(5).notNull(),
  prixUnitaire: decimal("prixUnitaire", { precision: 15, scale: 2 }).notNull(),
  fournisseur: varchar("fournisseur", { length: 255 }),
  oemReference: varchar("oemReference", { length: 100 }),
  dateCreation: timestamp("dateCreation").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Piece = typeof pieces.$inferSelect;
export type InsertPiece = typeof pieces.$inferInsert;

// ============================================================================
// INTERVENTIONS ATELIER
// ============================================================================
export const interventions = mysqlTable("interventions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  machineId: varchar("machineId", { length: 36 }).notNull(),
  type: mysqlEnum("type", ["MAINTENANCE_INTERNE", "REPARATION_EXTERNE", "SAV_GARANTIE"]).notNull(),
  description: text("description").notNull(),
  dateDebut: timestamp("dateDebut").notNull(),
  dateFin: timestamp("dateFin"),
  piecesUtilisees: json("piecesUtilisees").$type<Array<{ pieceId: string; quantite: number; prixUnitaire: number }>>().notNull(),
  coutEstime: decimal("coutEstime", { precision: 15, scale: 2 }).notNull(),
  coutReel: decimal("coutReel", { precision: 15, scale: 2 }),
  statut: mysqlEnum("statut", ["EN_COURS", "TERMINE", "EN_ATTENTE"]).default("EN_COURS").notNull(),
  dateCreation: timestamp("dateCreation").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Intervention = typeof interventions.$inferSelect;
export type InsertIntervention = typeof interventions.$inferInsert;

// ============================================================================
// FACTURES
// ============================================================================
export const factures = mysqlTable("factures", {
  id: varchar("id", { length: 36 }).primaryKey(),
  numero: varchar("numero", { length: 50 }).notNull().unique(),
  clientId: varchar("clientId", { length: 36 }).notNull(),
  type: mysqlEnum("type", ["PROFORMA", "ACOMPTE", "DEFINITIVE"]).notNull(),
  dateEmission: timestamp("dateEmission").notNull(),
  dateEcheance: timestamp("dateEcheance"),
  montantHT: decimal("montantHT", { precision: 15, scale: 2 }).notNull(),
  tauxTVA: decimal("tauxTVA", { precision: 5, scale: 2 }).default("18").notNull(),
  montantTVA: decimal("montantTVA", { precision: 15, scale: 2 }).notNull(),
  montantTTC: decimal("montantTTC", { precision: 15, scale: 2 }).notNull(),
  statut: mysqlEnum("statut", ["BROUILLON", "EMISE", "PAYEE", "IMPAYEE", "PARTIELLEMENT_PAYEE"]).default("BROUILLON").notNull(),
  modePaiement: mysqlEnum("modePaiement", ["CASH", "MOBILE_MONEY"]),
  montantPaye: decimal("montantPaye", { precision: 15, scale: 2 }).default("0").notNull(),
  datePaiement: timestamp("datePaiement"),
  dateRelance: timestamp("dateRelance"),
  nombreRelances: int("nombreRelances").default(0).notNull(),
  dateCreation: timestamp("dateCreation").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Facture = typeof factures.$inferSelect;
export type InsertFacture = typeof factures.$inferInsert;