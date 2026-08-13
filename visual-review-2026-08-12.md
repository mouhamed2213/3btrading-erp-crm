# Revue visuelle 2026-08-12

La Landing Page présente désormais un hero sombre et premium, une navigation publique fonctionnelle, trois offres métier clairement séparées, un catalogue filtrable et un formulaire de devis. Sur mobile, le hero reste lisible et les CTA sont empilés correctement.

L'espace administrateur dispose d'une navigation structurée avec Dashboard, opérations, commerce, Catalogue & Publication, Stock pièces et Facturation & Finance. Le catalogue affiche les statuts Publié/Brouillon et les actions Publier, Dépublier et Éditer. La facturation affiche les KPI, les onglets par type de document, les statuts de paiement et le suivi des relances.

Les vérifications TypeScript (`pnpm check`) et build (`pnpm build`) passent sans erreur. Le principal axe de polish restant est d'accentuer encore la signature industrielle avec davantage de repères visuels chantier et d'images produits dans les cartes catalogue, sans compromettre la lisibilité responsive.

## Vérification complète des parcours

Les huit routes suivantes ont été capturées en desktop et mobile : `/`, `/admin`, `/admin/catalogue`, `/admin/chantiers`, `/admin/locations`, `/admin/boutique`, `/admin/atelier` et `/admin/facturation`. Les captures sont générées sans erreur TypeScript ni build signalé par le serveur.

Le mobile révèle toutefois une limite UX existante dans plusieurs tableaux métier : les colonnes restent larges et peuvent nécessiter un défilement horizontal. Le layout global, la navigation admin mobile et les CTA restent accessibles. Le Catalogue et la Facturation sont correctement empilés sur petit écran.

Les correctifs appliqués après cette revue sont : remplacement fiable d'une machine lors de l'édition et formulaire de création de facture multi-lignes avec ajout, suppression et recalcul HT/TVA/TTC.

## Catalogue enrichi — pages de détail

Les routes `/catalogue/machine/MAC001` et `/catalogue/piece/PEC001` affichent désormais une fiche publique dédiée avec retour catalogue, galerie (ou état vide explicite), description, statut de publication, prix, stock, référence OEM, spécifications, CTA de demande et appel conseiller. Les données mock sans image utilisent un placeholder sombre afin de préserver la hiérarchie visuelle jusqu'à ce qu'une photo soit ajoutée depuis l'admin.

## Test responsive images et détails

Les fiches machine et pièce restent lisibles sur mobile : retour catalogue, placeholder média, titre, description et CTA se réorganisent verticalement. Le Catalogue admin conserve une navigation compacte et une lecture claire des indicateurs. Le formulaire d'upload s'ouvre dans une boîte de dialogue scrollable, adaptée aux écrans étroits.
