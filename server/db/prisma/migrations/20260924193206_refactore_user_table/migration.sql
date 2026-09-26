-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "TypeClient" AS ENUM ('STANDARD', 'PARTENAIRE');

-- CreateEnum
CREATE TYPE "StatutMachine" AS ENUM ('DISPONIBLE', 'EN_LOCATION', 'EN_MAINTENANCE', 'VENDUE');

-- CreateEnum
CREATE TYPE "ModeFacturation" AS ENUM ('FORFAIT', 'CUBAGE', 'HORAIRE', 'JOURNALIER');

-- CreateEnum
CREATE TYPE "StatutChantier" AS ENUM ('PLANIFIE', 'EN_COURS', 'TERMINE', 'FACTURE');

-- CreateEnum
CREATE TYPE "TarifType" AS ENUM ('JOURNALIER', 'ROTATION', 'DEGRESSIF');

-- CreateEnum
CREATE TYPE "StatutLocation" AS ENUM ('RESERVEE', 'SORTIE', 'RETOURNEE');

-- CreateEnum
CREATE TYPE "TypeIntervention" AS ENUM ('MAINTENANCE_INTERNE', 'REPARATION_EXTERNE', 'SAV_GARANTIE');

-- CreateEnum
CREATE TYPE "StatutIntervention" AS ENUM ('EN_COURS', 'TERMINE', 'EN_ATTENTE');

-- CreateEnum
CREATE TYPE "TypeFacture" AS ENUM ('PROFORMA', 'ACOMPTE', 'DEFINITIVE');

-- CreateEnum
CREATE TYPE "StatutFacture" AS ENUM ('BROUILLON', 'EMISE', 'PAYEE', 'IMPAYEE', 'PARTIELLEMENT_PAYEE');

-- CreateEnum
CREATE TYPE "ModePaiement" AS ENUM ('CASH', 'MOBILE_MONEY');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastSignedIn" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT,
    "adresse" TEXT,
    "typeClient" "TypeClient" NOT NULL DEFAULT 'STANDARD',
    "solde" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contact" TEXT,
    "siret" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "machines" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "marque" TEXT NOT NULL,
    "modele" TEXT,
    "annee" INTEGER,
    "immatriculation" TEXT,
    "statut" "StatutMachine" NOT NULL DEFAULT 'DISPONIBLE',
    "tarifJournalier" DECIMAL(15,2) NOT NULL,
    "tarifRotation" DECIMAL(15,2),
    "tarifDegressif" DECIMAL(15,2),
    "prixVente" DECIMAL(15,2),
    "enVente" BOOLEAN NOT NULL DEFAULT false,
    "enLocation" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "images" JSONB NOT NULL DEFAULT '[]',
    "specifications" JSONB NOT NULL DEFAULT '{}',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "machines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chantiers" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "typesTravaux" JSONB NOT NULL,
    "modeFacturation" "ModeFacturation" NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3),
    "statut" "StatutChantier" NOT NULL DEFAULT 'PLANIFIE',
    "montantEstime" DECIMAL(15,2) NOT NULL,
    "montantReel" DECIMAL(15,2),
    "volume" DECIMAL(12,2),
    "heures" DECIMAL(12,2),
    "jours" INTEGER,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chantiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "jours" INTEGER NOT NULL,
    "tarifType" "TarifType" NOT NULL,
    "montantTotal" DECIMAL(15,2) NOT NULL,
    "montantPaye" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "modePaiement" "ModePaiement",
    "statut" "StatutLocation" NOT NULL DEFAULT 'RESERVEE',
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pieces" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "marque" TEXT NOT NULL,
    "famille" TEXT NOT NULL,
    "compatibilites" JSONB NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "seuilAlerte" INTEGER NOT NULL DEFAULT 5,
    "prixUnitaire" DECIMAL(15,2) NOT NULL,
    "fournisseur" TEXT,
    "oemReference" TEXT,
    "description" TEXT,
    "images" JSONB NOT NULL DEFAULT '[]',
    "specifications" JSONB NOT NULL DEFAULT '{}',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pieces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interventions" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "type" "TypeIntervention" NOT NULL,
    "description" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3),
    "piecesUtilisees" JSONB NOT NULL,
    "coutEstime" DECIMAL(15,2) NOT NULL,
    "coutReel" DECIMAL(15,2),
    "statut" "StatutIntervention" NOT NULL DEFAULT 'EN_COURS',
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interventions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factures" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "type" "TypeFacture" NOT NULL,
    "dateEmission" TIMESTAMP(3) NOT NULL,
    "dateEcheance" TIMESTAMP(3),
    "montantHT" DECIMAL(15,2) NOT NULL,
    "tauxTVA" DECIMAL(5,2) NOT NULL DEFAULT 18,
    "montantTVA" DECIMAL(15,2) NOT NULL,
    "montantTTC" DECIMAL(15,2) NOT NULL,
    "statut" "StatutFacture" NOT NULL DEFAULT 'BROUILLON',
    "modePaiement" "ModePaiement",
    "montantPaye" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "datePaiement" TIMESTAMP(3),
    "dateRelance" TIMESTAMP(3),
    "nombreRelances" INTEGER NOT NULL DEFAULT 0,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "factures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "chantiers_clientId_idx" ON "chantiers"("clientId");

-- CreateIndex
CREATE INDEX "locations_machineId_idx" ON "locations"("machineId");

-- CreateIndex
CREATE INDEX "locations_clientId_idx" ON "locations"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "pieces_reference_key" ON "pieces"("reference");

-- CreateIndex
CREATE INDEX "interventions_machineId_idx" ON "interventions"("machineId");

-- CreateIndex
CREATE UNIQUE INDEX "factures_numero_key" ON "factures"("numero");

-- CreateIndex
CREATE INDEX "factures_clientId_idx" ON "factures"("clientId");

-- AddForeignKey
ALTER TABLE "chantiers" ADD CONSTRAINT "chantiers_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factures" ADD CONSTRAINT "factures_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
