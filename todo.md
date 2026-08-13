# Project TODO

- [x] Initialiser le frontend React 19 avec Tailwind CSS
- [x] Créer la Landing Page publique et le Dashboard Admin
- [x] Ajouter les modules métier frontend 3BTRADING
- [x] Ajouter l'architecture backend modulaire Controller-Route-Service-Repository
- [x] Ajouter le schéma métier Prisma 3BTRADING
- [x] Configurer Prisma 7 selon le quickstart officiel avec PostgreSQL et l'adaptateur @prisma/adapter-pg
- [x] Migrer les imports backend vers le client Prisma ESM généré
- [ ] Valider la connexion PostgreSQL réelle (à faire en local avec URL SSL)
- [ ] Sauvegarder un checkpoint stable après validation locale complète
- [ ] Remplacer l'URL DATABASE_URL par une URL PostgreSQL sécurisée avec SSL en local
- [x] Refaire la Landing Page avec navigation publique fonctionnelle, CTA cohérents et présentation plus premium
- [x] Corriger les routes et liens cassés de la vitrine et de l'espace admin
- [x] Ajouter un module Catalogue & Publication permettant de créer, modifier, publier et dépublier machines et pièces
- [x] Ajouter les statuts de publication et la visibilité publique dans les données catalogue
- [x] Reconcevoir le module Facturation avec lignes de facture, taxes, paiements Cash/Mobile Money, relances et aperçu imprimable
- [x] Renforcer le Dashboard Admin avec accès rapides aux créations et indicateurs opérationnels
- [x] Tester les parcours publics et administrateur sur desktop et mobile
- [x] Ajouter les champs de description détaillée, spécifications techniques et galeries d'images dans les types et mocks catalogue
- [x] Mettre à jour le module admin Catalogue & Publication pour permettre l'upload d'images et la saisie de fiches techniques
- [x] Créer la page de détails publique accessible depuis la vitrine pour chaque machine et pièce détachée
- [x] Intégrer les boutons "Voir les détails" et le parcours de réservation/devis sur la vitrine publique
- [x] Valider le build de production et le typage après l'ajout des détails et des images catalogue
- [ ] Finaliser la synchronisation Prisma/tRPC des créations, éditions et publications du catalogue admin (validation PostgreSQL réelle restante)
- [x] Utiliser les données Prisma publiées dans la vitrine et les pages de détails avec repli de compatibilité explicite
- [x] Sécuriser les lectures admin, mutations et uploads catalogue avec le rôle administrateur
- [ ] Vérifier les tests, le build et les parcours de publication après la migration catalogue (validation PostgreSQL réelle restante)
- [ ] Enregistrer un checkpoint de livraison après validation finale

- [x] Ajouter un test d’intégration du flux publication admin vers vitrine et page détail
- [x] Documenter la migration immatriculation et le statut machine pour PostgreSQL local

