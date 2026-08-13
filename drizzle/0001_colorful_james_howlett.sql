CREATE TABLE `chantiers` (
	`id` varchar(36) NOT NULL,
	`clientId` varchar(36) NOT NULL,
	`titre` varchar(255) NOT NULL,
	`description` text,
	`typesTravaux` json NOT NULL,
	`modeFacturation` enum('FORFAIT','CUBAGE','HORAIRE','JOURNALIER') NOT NULL,
	`dateDebut` timestamp NOT NULL,
	`dateFin` timestamp,
	`statut` enum('PLANIFIE','EN_COURS','TERMINE','FACTURE') NOT NULL DEFAULT 'PLANIFIE',
	`montantEstime` decimal(15,2) NOT NULL,
	`montantReel` decimal(15,2),
	`volume` decimal(12,2),
	`heures` decimal(12,2),
	`jours` int,
	`dateCreation` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chantiers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` varchar(36) NOT NULL,
	`nom` varchar(255) NOT NULL,
	`email` varchar(320),
	`telephone` varchar(20),
	`adresse` text,
	`typeClient` enum('STANDARD','PARTENAIRE') NOT NULL DEFAULT 'STANDARD',
	`solde` decimal(15,2) NOT NULL DEFAULT '0',
	`dateCreation` timestamp NOT NULL DEFAULT (now()),
	`contact` varchar(255),
	`siret` varchar(20),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `factures` (
	`id` varchar(36) NOT NULL,
	`numero` varchar(50) NOT NULL,
	`clientId` varchar(36) NOT NULL,
	`type` enum('PROFORMA','ACOMPTE','DEFINITIVE') NOT NULL,
	`dateEmission` timestamp NOT NULL,
	`dateEcheance` timestamp,
	`montantHT` decimal(15,2) NOT NULL,
	`tauxTVA` decimal(5,2) NOT NULL DEFAULT '18',
	`montantTVA` decimal(15,2) NOT NULL,
	`montantTTC` decimal(15,2) NOT NULL,
	`statut` enum('BROUILLON','EMISE','PAYEE','IMPAYEE','PARTIELLEMENT_PAYEE') NOT NULL DEFAULT 'BROUILLON',
	`modePaiement` enum('CASH','MOBILE_MONEY'),
	`montantPaye` decimal(15,2) NOT NULL DEFAULT '0',
	`datePaiement` timestamp,
	`dateRelance` timestamp,
	`nombreRelances` int NOT NULL DEFAULT 0,
	`dateCreation` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `factures_id` PRIMARY KEY(`id`),
	CONSTRAINT `factures_numero_unique` UNIQUE(`numero`)
);
--> statement-breakpoint
CREATE TABLE `interventions` (
	`id` varchar(36) NOT NULL,
	`machineId` varchar(36) NOT NULL,
	`type` enum('MAINTENANCE_INTERNE','REPARATION_EXTERNE','SAV_GARANTIE') NOT NULL,
	`description` text NOT NULL,
	`dateDebut` timestamp NOT NULL,
	`dateFin` timestamp,
	`piecesUtilisees` json NOT NULL,
	`coutEstime` decimal(15,2) NOT NULL,
	`coutReel` decimal(15,2),
	`statut` enum('EN_COURS','TERMINE','EN_ATTENTE') NOT NULL DEFAULT 'EN_COURS',
	`dateCreation` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `interventions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` varchar(36) NOT NULL,
	`machineId` varchar(36) NOT NULL,
	`clientId` varchar(36) NOT NULL,
	`dateDebut` timestamp NOT NULL,
	`dateFin` timestamp NOT NULL,
	`jours` int NOT NULL,
	`tarifType` enum('JOURNALIER','ROTATION','DEGRESSIF') NOT NULL,
	`montantTotal` decimal(15,2) NOT NULL,
	`montantPaye` decimal(15,2) NOT NULL DEFAULT '0',
	`modePaiement` enum('CASH','MOBILE_MONEY'),
	`statut` enum('RESERVEE','SORTIE','RETOURNEE') NOT NULL DEFAULT 'RESERVEE',
	`dateCreation` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `machines` (
	`id` varchar(36) NOT NULL,
	`nom` varchar(255) NOT NULL,
	`type` varchar(100) NOT NULL,
	`marque` varchar(100) NOT NULL,
	`modele` varchar(100),
	`annee` int,
	`statut` enum('DISPONIBLE','EN_LOCATION','EN_MAINTENANCE','VENDUE') NOT NULL DEFAULT 'DISPONIBLE',
	`tarifJournalier` decimal(15,2) NOT NULL,
	`tarifRotation` decimal(15,2),
	`tarifDegressif` decimal(15,2),
	`prixVente` decimal(15,2),
	`enVente` boolean NOT NULL DEFAULT false,
	`enLocation` boolean NOT NULL DEFAULT false,
	`dateCreation` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `machines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pieces` (
	`id` varchar(36) NOT NULL,
	`reference` varchar(100) NOT NULL,
	`nom` varchar(255) NOT NULL,
	`marque` varchar(100) NOT NULL,
	`famille` varchar(100) NOT NULL,
	`compatibilites` json NOT NULL,
	`stock` int NOT NULL DEFAULT 0,
	`seuilAlerte` int NOT NULL DEFAULT 5,
	`prixUnitaire` decimal(15,2) NOT NULL,
	`fournisseur` varchar(255),
	`oemReference` varchar(100),
	`dateCreation` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pieces_id` PRIMARY KEY(`id`),
	CONSTRAINT `pieces_reference_unique` UNIQUE(`reference`)
);
