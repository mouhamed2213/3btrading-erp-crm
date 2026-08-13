import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Calendar, AlertCircle } from 'lucide-react';
import { mockLocations } from '@/services/mock/locations';
import { mockClients } from '@/services/mock/clients';
import { mockMachines } from '@/services/mock/machines';
import { Location } from '@/types';

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [filtreStatut, setFiltreStatut] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    machineId: '',
    dateDebut: '',
    dateFin: '',
    modeFacturation: 'JOURNALIER',
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Ajouter la location
    setFormData({
      clientId: '',
      machineId: '',
      dateDebut: '',
      dateFin: '',
      modeFacturation: 'JOURNALIER',
    });
    setDialogOpen(false);
  };

  const locationsFiltres = filtreStatut
    ? locations.filter(l => l.statut === filtreStatut)
    : locations;

  const getStatutBadge = (statut: Location['statut']) => {
    const variants: Record<Location['statut'], string> = {
      'RESERVEE': 'bg-blue-100 text-blue-800',
      'SORTIE': 'bg-amber-100 text-amber-800',
      'RETOURNEE': 'bg-green-100 text-green-800',
      'FACTUREE': 'bg-purple-100 text-purple-800',
    };
    return variants[statut];
  };

  const getClientName = (clientId: string) => {
    return mockClients.find(c => c.id === clientId)?.nom || 'Inconnu';
  };

  const getMachineName = (machineId: string) => {
    return mockMachines.find(m => m.id === machineId)?.nom || 'Inconnu';
  };

  const calculateTarifDegressif = (nombreJours: number, tarifJournalier: number) => {
    if (nombreJours > 7) {
      return nombreJours * (tarifJournalier * 0.8); // 20% de réduction
    }
    return nombreJours * tarifJournalier;
  };

  const locationsNonPayees = locations.filter(l => !l.paiementEffectue);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Locations</h1>
          <p className="text-muted-foreground">Planning et réservations d'engins</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Location
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une Nouvelle Location</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client</Label>
                  <select
                    id="clientId"
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-border rounded-md"
                    required
                  >
                    <option value="">Sélectionner un client</option>
                    {mockClients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.nom} {client.typeClient === 'PARTENAIRE' ? '(Partenaire)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="machineId">Machine</Label>
                  <select
                    id="machineId"
                    name="machineId"
                    value={formData.machineId}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-border rounded-md"
                    required
                  >
                    <option value="">Sélectionner une machine</option>
                    {mockMachines.filter(m => m.statut === 'DISPONIBLE').map(machine => (
                      <option key={machine.id} value={machine.id}>
                        {machine.nom} - {machine.tarifJournalier.toLocaleString()} FCFA/jour
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dateDebut">Date de Début</Label>
                  <Input
                    id="dateDebut"
                    name="dateDebut"
                    type="date"
                    value={formData.dateDebut}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFin">Date de Fin</Label>
                  <Input
                    id="dateFin"
                    name="dateFin"
                    type="date"
                    value={formData.dateFin}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modeFacturation">Mode de Facturation</Label>
                <select
                  id="modeFacturation"
                  name="modeFacturation"
                  value={formData.modeFacturation}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-border rounded-md"
                >
                  <option value="JOURNALIER">Tarif Journalier</option>
                  <option value="ROTATION">Par Rotation (Camions-bennes)</option>
                  <option value="DEGRESSIF">Tarif Dégressif (&gt;7 jours)</option>
                </select>
              </div>

              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Note :</strong> Le tarif dégressif (20% de réduction) s'applique automatiquement 
                  pour les locations de plus de 7 jours.
                </p>
              </div>

              <Button type="submit" className="w-full">
                Créer la Location
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alertes */}
      {locationsNonPayees.length > 0 && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">Locations non payées</p>
              <p className="text-sm text-red-800 mt-1">
                {locationsNonPayees.length} location(s) en attente de paiement. 
                Vérifiez que le client est à jour ou qu'il est un partenaire.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Filtres */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="filtreStatut">Filtrer par Statut</Label>
            <select
              id="filtreStatut"
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md mt-2"
            >
              <option value="">Tous les statuts</option>
              <option value="RESERVEE">Réservée</option>
              <option value="SORTIE">Sortie</option>
              <option value="RETOURNEE">Retournée</option>
              <option value="FACTUREE">Facturée</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <Button variant="outline" onClick={() => setFiltreStatut('')}>
              Réinitialiser
            </Button>
          </div>
        </div>
      </Card>

      {/* Tableau */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Machine</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Paiement</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locationsFiltres.map(location => {
                const dateDebut = new Date(location.dateDebut);
                const dateFin = new Date(location.dateFin);
                const jours = Math.ceil((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">{getMachineName(location.machineId)}</TableCell>
                    <TableCell>{getClientName(location.clientId)}</TableCell>
                    <TableCell className="text-sm">
                      {dateDebut.toLocaleDateString('fr-FR')} → {dateFin.toLocaleDateString('fr-FR')}
                      <br />
                      <span className="text-muted-foreground">{jours} jours</span>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {location.montantTotal.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell>
                      {location.paiementEffectue ? (
                        <Badge className="bg-green-100 text-green-800">
                          {location.paiementType === 'CASH' ? 'Cash' : 'Mobile Money'}
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">Non payé</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatutBadge(location.statut)}>
                        {location.statut}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Statistiques */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Total Locations</p>
          <p className="text-3xl font-bold mt-2">{locations.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">En Sortie</p>
          <p className="text-3xl font-bold mt-2 text-amber-600">
            {locations.filter(l => l.statut === 'SORTIE').length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Revenue Total</p>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {(locations.reduce((sum, l) => sum + l.montantTotal, 0) / 1000000).toFixed(1)}M
          </p>
        </Card>
        <Card className="p-6 border-red-200 bg-red-50">
          <p className="text-sm font-medium text-red-700">Non Payées</p>
          <p className="text-3xl font-bold mt-2 text-red-600">
            {locationsNonPayees.length}
          </p>
        </Card>
      </div>
    </div>
  );
}
