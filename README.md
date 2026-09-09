# 3BTRADING - Guide de Démarrage Local et Migration PostgreSQL

Ce projet complet regroupe la partie **Frontend** (React 19, Tailwind CSS, composants ERP) et la partie **Backend** modulaire (Node.js, Express, tRPC, Prisma 7, PostgreSQL avec `@prisma/adapter-pg`).

---

## 🚀 Prérequis sur votre machine locale

- **Node.js** (version 20.19 ou supérieure recommandée)
- **pnpm** (ou npm / yarn)
- Un serveur **PostgreSQL** opérationnel en local ou distant (par exemple via XAMPP/Postgres, Docker ou un service géré).

---

## 📦 1. Installation des dépendances

Extrayez l'archive du projet, puis dans le dossier racine, installez les dépendances avec pnpm :

```bash
pnpm install
```

---

## ⚙️ 2. Configuration de la base de données (PostgreSQL)

1. Créez un fichier `.env` à la racine du projet en copiant la structure ci-dessous. Ne committez jamais ce fichier :

```env
DATABASE_URL="postgresql://votre_utilisateur:votre_mot_de_passe@localhost:5432/3btrading_db?sslmode=prefer"
JWT_SECRET="votre_secret_jwt_securise"
```

2. Le schéma Prisma (`prisma/schema.prisma`) est déjà configuré pour PostgreSQL avec le générateur ESM et l'adaptateur `@prisma/adapter-pg`. Le modèle `Machine` persiste maintenant aussi `immatriculation` et `statut`. L’interface conserve ses libellés métier (`LOUE`, `MAINTENANCE`, `HORS_SERVICE`) tandis que le service catalogue les convertit vers les valeurs Prisma (`EN_LOCATION`, `EN_MAINTENANCE`, `VENDUE`).

---

## 🛠️ 3. Migration et Génération de Prisma

Générez le client Prisma et appliquez les migrations sur votre base PostgreSQL locale :

```bash
# Générer le client Prisma ESM
pnpm prisma generate

# Appliquer la migration initiale sur PostgreSQL
pnpm prisma migrate dev --name init

# Pour une base déjà initialisée avec une version antérieure du projet,
# appliquer la colonne immatriculation ajoutée au modèle Machine :
pnpm prisma migrate dev --name add-machine-immatriculation
```

---

## ▶️ 4. Démarrage de l'application en développement

Lancez simultanément le serveur backend et le serveur de développement frontend :

```bash
pnpm dev
```

L'application sera accessible localement à l'adresse indiquée par Vite (généralement `http://localhost:3000` ou `http://localhost:3001`).

---

## 🧪 5. Tests et Build de Production

- **Lancer les tests unitaires (Vitest)** :
  ```bash
  pnpm test
  ```

- **Compiler pour la production** :
  ```bash
  pnpm build
  pnpm start
  ```
