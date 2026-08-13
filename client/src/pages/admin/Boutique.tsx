import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Search } from 'lucide-react';
import { mockPieces } from '@/services/mock/pieces';
import { mockMachines } from '@/services/mock/machines';
import { Piece, MarquePiece, FamillePiece } from '@/types';

export default function Boutique() {
  const [pieces, setPieces] = useState<Piece[]>(mockPieces);
  const [filtreMarque, setFiltreMarque] = useState<string>('');
  const [filtreFamille, setFiltreFamille] = useState<string>('');
  const [filtreCompatibilite, setFiltreCompatibilite] = useState<string>('');
  const [filtreRecherche, setFiltreRecherche] = useState<string>('');

  const marques: MarquePiece[] = ['CATERPILLAR', 'HITACHI', 'POCLAIN', 'KOMATSU', 'VOLVO', 'LIEBHERR', 'JCB'];
  const familles: FamillePiece[] = ['MOTEUR', 'HYDRAULIQUE', 'TRANSMISSION', 'CHASSIS', 'ELECTRIQUE', 'CARROSSERIE'];

  const piecesFiltrees = pieces.filter(p => {
    if (filtreMarque && p.marque !== filtreMarque) return false;
    if (filtreFamille && p.famille !== filtreFamille) return false;
    if (filtreCompatibilite && !p.compatibilitesMachines.includes(filtreCompatibilite)) return false;
    if (filtreRecherche) {
      const terme = filtreRecherche.toLowerCase();
      return (
        p.nom.toLowerCase().includes(terme) ||
        p.reference.toLowerCase().includes(terme) ||
        p.referenceOEM.toLowerCase().includes(terme)
      );
    }
    return true;
  });

  const piecesRupture = pieces.filter(p => p.stock <= p.seuilAlerte);

  const getMachineName = (machineId: string) => {
    return mockMachines.find(m => m.id === machineId)?.nom || 'Inconnu';
  };

  const handleReinitialiser = () => {
    setFiltreMarque('');
    setFiltreFamille('');
    setFiltreCompatibilite('');
    setFiltreRecherche('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Boutique & Stock de Pièces</h1>
        <p className="text-muted-foreground">Gestion des pièces détachées et catalogue de vente</p>
      </div>

      {/* Alertes */}
      {piecesRupture.length > 0 && (
        <Card className="p-6 border-orange-200 bg-orange-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-orange-900">Ruptures de Stock</p>
              <p className="text-sm text-orange-800 mt-1">
                {piecesRupture.length} pièce(s) en rupture ou sous le seuil d'alerte. 
                Réapprovisionnement recommandé.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Recherche Multicritère */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Search className="h-5 w-5" />
          Recherche Avancée
        </h2>

        <div className="space-y-6">
          {/* Recherche par Texte */}
          <div>
            <Label htmlFor="recherche">Rechercher par Nom, Référence ou OEM</Label>
            <Input
              id="recherche"
              placeholder="Ex: Moteur, CAT-C15, 3456789"
              value={filtreRecherche}
              onChange={(e) => setFiltreRecherche(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Filtres Multicritères */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="marque">Marque</Label>
              <select
                id="marque"
                value={filtreMarque}
                onChange={(e) => setFiltreMarque(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md mt-2"
              >
                <option value="">Toutes les marques</option>
                {marques.map(marque => (
                  <option key={marque} value={marque}>
                    {marque}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="famille">Famille de Pièces</Label>
              <select
                id="famille"
                value={filtreFamille}
                onChange={(e) => setFiltreFamille(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md mt-2"
              >
                <option value="">Toutes les familles</option>
                {familles.map(famille => (
                  <option key={famille} value={famille}>
                    {famille}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="compatibilite">Compatible avec</Label>
              <select
                id="compatibilite"
                value={filtreCompatibilite}
                onChange={(e) => setFiltreCompatibilite(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md mt-2"
              >
                <option value="">Toutes les machines</option>
                {mockMachines.map(machine => (
                  <option key={machine.id} value={machine.id}>
                    {machine.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button variant="outline" onClick={handleReinitialiser} className="w-full">
            Réinitialiser les Filtres
          </Button>
        </div>
      </Card>

      {/* Résultats */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-border">
          <p className="text-sm font-medium text-muted-foreground">
            {piecesFiltrees.length} pièce(s) trouvée(s)
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Marque</TableHead>
                <TableHead>Famille</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Prix Unitaire</TableHead>
                <TableHead>Fournisseur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {piecesFiltrees.map(piece => (
                <TableRow key={piece.id}>
                  <TableCell className="font-mono text-sm">
                    {piece.reference}
                    <br />
                    <span className="text-xs text-muted-foreground">OEM: {piece.referenceOEM}</span>
                  </TableCell>
                  <TableCell className="font-medium">{piece.nom}</TableCell>
                  <TableCell>{piece.marque}</TableCell>
                  <TableCell>{piece.famille}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{piece.stock}</span>
                      {piece.stock <= piece.seuilAlerte && (
                        <Badge className="bg-red-100 text-red-800">Alerte</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {piece.prixUnitaire.toLocaleString()} FCFA
                  </TableCell>
                  <TableCell className="text-sm">{piece.fournisseur}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Statistiques */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Total Pièces</p>
          <p className="text-3xl font-bold mt-2">{pieces.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Stock Total</p>
          <p className="text-3xl font-bold mt-2">
            {pieces.reduce((sum, p) => sum + p.stock, 0)}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Valeur Stock</p>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {(pieces.reduce((sum, p) => sum + (p.stock * p.prixUnitaire), 0) / 1000000).toFixed(1)}M
          </p>
        </Card>
        <Card className="p-6 border-orange-200 bg-orange-50">
          <p className="text-sm font-medium text-orange-700">Ruptures</p>
          <p className="text-3xl font-bold mt-2 text-orange-600">
            {piecesRupture.length}
          </p>
        </Card>
      </div>
    </div>
  );
}
