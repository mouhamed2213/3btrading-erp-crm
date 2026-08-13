import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Wrench } from 'lucide-react';
import { mockInterventions } from '@/services/mock/interventions';
import { mockMachines } from '@/services/mock/machines';
import { mockClients } from '@/services/mock/clients';
import { Intervention } from '@/types';

export default function Atelier() {
  const [interventions] = useState<Intervention[]>(mockInterventions);

  const getTypeLabel = (type: Intervention['type']) => {
    const labels: Record<Intervention['type'], string> = {
      'MAINTENANCE_INTERNE': 'Maintenance Interne',
      'REPARATION_EXTERNE': 'Réparation Externe',
      'SAV_GARANTIE': 'SAV Garantie',
    };
    return labels[type];
  };

  const getTypeColor = (type: Intervention['type']) => {
    const colors: Record<Intervention['type'], string> = {
      'MAINTENANCE_INTERNE': 'bg-blue-100 text-blue-800',
      'REPARATION_EXTERNE': 'bg-amber-100 text-amber-800',
      'SAV_GARANTIE': 'bg-green-100 text-green-800',
    };
    return colors[type];
  };

  const getStatutColor = (statut: Intervention['statut']) => {
    const colors: Record<Intervention['statut'], string> = {
      'PLANIFIEE': 'bg-slate-100 text-slate-800',
      'EN_COURS': 'bg-amber-100 text-amber-800',
      'TERMINEZ': 'bg-green-100 text-green-800',
    };
    return colors[statut];
  };

  const getMachineName = (machineId: string) => {
    return mockMachines.find(m => m.id === machineId)?.nom || 'Inconnu';
  };

  const getClientName = (clientId?: string) => {
    if (!clientId) return '-';
    return mockClients.find(c => c.id === clientId)?.nom || 'Inconnu';
  };

  const interventionsParType = {
    MAINTENANCE_INTERNE: interventions.filter(i => i.type === 'MAINTENANCE_INTERNE'),
    REPARATION_EXTERNE: interventions.filter(i => i.type === 'REPARATION_EXTERNE'),
    SAV_GARANTIE: interventions.filter(i => i.type === 'SAV_GARANTIE'),
  };

  const totalCoutReparations = interventionsParType.REPARATION_EXTERNE
    .filter(i => i.coutReel)
    .reduce((sum, i) => sum + (i.coutReel || 0), 0);

  const totalCoutMaintenance = interventionsParType.MAINTENANCE_INTERNE
    .filter(i => i.coutReel)
    .reduce((sum, i) => sum + (i.coutReel || 0), 0);

  const InterventionTable = ({ data }: { data: Intervention[] }) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Machine</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Pièces Utilisées</TableHead>
            <TableHead>Coût</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(intervention => (
            <TableRow key={intervention.id}>
              <TableCell className="font-medium">{getMachineName(intervention.machineId)}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{intervention.description}</p>
                  {intervention.clientId && (
                    <p className="text-sm text-muted-foreground">Client: {getClientName(intervention.clientId)}</p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {new Date(intervention.dateDebut).toLocaleDateString('fr-FR')}
                {intervention.dateFin && (
                  <>
                    <br />→ {new Date(intervention.dateFin).toLocaleDateString('fr-FR')}
                  </>
                )}
              </TableCell>
              <TableCell>
                {intervention.piecesUtilisees.length > 0 ? (
                  <div className="text-sm">
                    {intervention.piecesUtilisees.map((p, idx) => (
                      <div key={idx}>{p.quantite}x pièce</div>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="font-semibold">
                {intervention.coutReel ? (
                  <div>
                    <p>{intervention.coutReel.toLocaleString()} FCFA</p>
                    {intervention.coutEstime && (
                      <p className="text-xs text-muted-foreground">
                        Estimé: {intervention.coutEstime.toLocaleString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="text-green-600">Gratuit</span>
                )}
              </TableCell>
              <TableCell>
                <Badge className={getStatutColor(intervention.statut)}>
                  {intervention.statut}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Atelier Mécanique</h1>
          <p className="text-muted-foreground">Gestion des interventions et maintenance</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Intervention
        </Button>
      </div>

      {/* KPI */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Total Interventions</p>
          <p className="text-3xl font-bold mt-2">{interventions.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">En Cours</p>
          <p className="text-3xl font-bold mt-2 text-amber-600">
            {interventions.filter(i => i.statut === 'EN_COURS').length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Coût Réparations</p>
          <p className="text-3xl font-bold mt-2 text-orange-600">
            {(totalCoutReparations / 1000000).toFixed(1)}M
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Coût Maintenance</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">
            {(totalCoutMaintenance / 1000000).toFixed(1)}M
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <Tabs defaultValue="maintenance" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
            <TabsTrigger
              value="maintenance"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <Wrench className="mr-2 h-4 w-4" />
              Maintenance Interne ({interventionsParType.MAINTENANCE_INTERNE.length})
            </TabsTrigger>
            <TabsTrigger
              value="reparations"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <Wrench className="mr-2 h-4 w-4" />
              Réparations Externes ({interventionsParType.REPARATION_EXTERNE.length})
            </TabsTrigger>
            <TabsTrigger
              value="sav"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <Wrench className="mr-2 h-4 w-4" />
              SAV Garantie ({interventionsParType.SAV_GARANTIE.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="maintenance" className="p-6">
            <InterventionTable data={interventionsParType.MAINTENANCE_INTERNE} />
          </TabsContent>

          <TabsContent value="reparations" className="p-6">
            <InterventionTable data={interventionsParType.REPARATION_EXTERNE} />
          </TabsContent>

          <TabsContent value="sav" className="p-6">
            <InterventionTable data={interventionsParType.SAV_GARANTIE} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
