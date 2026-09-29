import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Chantier, ModeFacturation } from "@/types";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Chantiers() {
  const [chantiers, setChantiers] = useState<Chantier[] | null>(null);
  const [filtreStatut, setFiltreStatut] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    titre: "",
    description: "",
    modeFacturation: "FORFAIT" as ModeFacturation,
    montantEstime: "",
    tauxJournalier: "",
  });

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Ajouter le chantier
    setFormData({
      clientId: "",
      titre: "",
      description: "",
      modeFacturation: "FORFAIT",
      montantEstime: "",
      tauxJournalier: "",
    });
    setDialogOpen(false);
  };

  const chantiersFiltres = "filtreStatut";

  const getStatutBadge = (statut: Chantier["statut"]) => {
    const variants: Record<Chantier["statut"], string> = {
      PLANIFIE: "bg-blue-100 text-blue-800",
      EN_COURS: "bg-amber-100 text-amber-800",
      TERMINE: "bg-green-100 text-green-800",
      FACTURE: "bg-purple-100 text-purple-800",
    };
    return variants[statut];
  };

  const getModeLabel = (mode: ModeFacturation) => {
    const labels: Record<ModeFacturation, string> = {
      FORFAIT: "Forfait",
      CUBAGE: "Cubage (m³)",
      HORAIRE: "Horaire",
      JOURNALIER: "Journalier",
    };
    return labels[mode];
  };

  const getClientName = (clientId: string) => {
    return "Inconnu";
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Chantiers</h1>
          <p className="text-muted-foreground">
            Créer et suivre vos prestations
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Chantier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un Nouveau Chantier</DialogTitle>
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
                    {[].map(client => (
                      <option key={0} value={0}>
                        {"client.nom"}
                      </option>
                    ))}
                  </select>
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
                    <option value="FORFAIT">Forfait Global</option>
                    <option value="CUBAGE">Cubage (m³)</option>
                    <option value="HORAIRE">Compteur Horaire</option>
                    <option value="JOURNALIER">À la Journée</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="titre">Titre du Chantier</Label>
                <Input
                  id="titre"
                  name="titre"
                  value={formData.titre}
                  onChange={handleFormChange}
                  placeholder="Ex: Terrassement - Immeuble Plateau"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Détails du chantier..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="montantEstime">Montant Estimé (FCFA)</Label>
                  <Input
                    id="montantEstime"
                    name="montantEstime"
                    type="number"
                    value={formData.montantEstime}
                    onChange={handleFormChange}
                    placeholder="0"
                    required
                  />
                </div>
                {formData.modeFacturation === "JOURNALIER" && (
                  <div className="space-y-2">
                    <Label htmlFor="tauxJournalier">
                      Taux Journalier (FCFA)
                    </Label>
                    <Input
                      id="tauxJournalier"
                      name="tauxJournalier"
                      type="number"
                      value={formData.tauxJournalier}
                      onChange={handleFormChange}
                      placeholder="0"
                    />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full">
                Créer le Chantier
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtres */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="filtreStatut">Filtrer par Statut</Label>
            <select
              id="filtreStatut"
              value={filtreStatut}
              onChange={e => setFiltreStatut(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md mt-2"
            >
              <option value="">Tous les statuts</option>
              <option value="PLANIFIE">Planifié</option>
              <option value="EN_COURS">En Cours</option>
              <option value="TERMINE">Terminé</option>
              <option value="FACTURE">Facturé</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <Button variant="outline" onClick={() => setFiltreStatut("")}>
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
                <TableHead>Titre</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[].map(chantier => (
                <TableRow key={0}>
                  <TableCell className="font-medium">
                    {"chantier.titre"}
                  </TableCell>
                  <TableCell>{getClientName("name")}</TableCell>
                  <TableCell>
                    {/* {getModeLabel(chantier.modeFacturation)} */}
                    {getModeLabel("CUBAGE")}
                  </TableCell>
                  <TableCell>{0} FCFA</TableCell>
                  <TableCell>
                    {/* <Badge className={getStatutBadge(chantier.statut)}> */}
                    <Badge className={getStatutBadge("FACTURE")}>
                      {"chantier.statut"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Statistiques */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Total Chantiers
          </p>
          <p className="text-3xl font-bold mt-2">{0}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">En Cours</p>
          <p className="text-3xl font-bold mt-2 text-amber-600">{0}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Chiffre d'Affaires
          </p>
          <p className="text-3xl font-bold mt-2 text-green-600">{0}M</p>
        </Card>
      </div>
    </div>
  );
}
