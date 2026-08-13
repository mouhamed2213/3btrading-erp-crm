import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Archive,
  Check,
  Eye,
  EyeOff,
  PackagePlus,
  Pencil,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Truck,
  Wrench,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getCatalogMachines,
  getCatalogPieces,
  saveCatalogMachines,
  saveCatalogPieces,
  type CatalogMachine,
  type CatalogPiece,
} from '@/services/catalogStore';
import type { TypeMachine, MarquePiece, FamillePiece } from '@/types';
import { ImageGalleryField } from '@/components/catalogue/ImageGalleryField';
import { trpc } from '@/lib/trpc';

const formatMoney = (value: number) => `${value.toLocaleString('fr-FR')} FCFA`;

const machineTypes: TypeMachine[] = ['CAMION', 'PELLE', 'CHARGEUR', 'BULLDOZER', 'COMPACTEUR'];
const pieceBrands: MarquePiece[] = ['CATERPILLAR', 'HITACHI', 'POCLAIN', 'KOMATSU', 'VOLVO', 'LIEBHERR', 'JCB'];
const pieceFamilies: FamillePiece[] = ['MOTEUR', 'HYDRAULIQUE', 'TRANSMISSION', 'CHASSIS', 'ELECTRIQUE', 'CARROSSERIE'];

const parseSpecifications = (value: string): Record<string, string> =>
  value.split('\n').reduce<Record<string, string>>((result, line) => {
    const [label, ...rest] = line.split(':');
    if (label?.trim() && rest.join(':').trim()) result[label.trim()] = rest.join(':').trim();
    return result;
  }, {});

const stringifySpecifications = (specifications: Record<string, string> = {}) =>
  Object.entries(specifications).map(([label, value]) => `${label}: ${value}`).join('\n');

export default function Catalogue() {
  const [tab, setTab] = useState<'machines' | 'pieces'>('machines');
  const [machines, setMachines] = useState<CatalogMachine[]>(getCatalogMachines);
  const [pieces, setPieces] = useState<CatalogPiece[]>(getCatalogPieces);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [open, setOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<CatalogMachine | null>(null);
  const [editingPiece, setEditingPiece] = useState<CatalogPiece | null>(null);
  const [draftImages, setDraftImages] = useState<string[]>([]);
  const remoteMachinesQuery = trpc.catalogue.listAdminMachines.useQuery(undefined, { retry: false });
  const remotePiecesQuery = trpc.catalogue.listAdminPieces.useQuery(undefined, { retry: false });
  const saveMachineRemote = trpc.catalogue.saveMachine.useMutation();
  const savePieceRemote = trpc.catalogue.savePiece.useMutation();

  useEffect(() => {
    if (remoteMachinesQuery.data) setMachines(remoteMachinesQuery.data as CatalogMachine[]);
  }, [remoteMachinesQuery.data]);

  useEffect(() => {
    if (remotePiecesQuery.data) setPieces(remotePiecesQuery.data as unknown as CatalogPiece[]);
  }, [remotePiecesQuery.data]);

  const persistMachineRemote = (item: CatalogMachine) => {
    saveMachineRemote.mutate({
      id: item.id,
      nom: item.nom,
      type: item.type,
      marque: item.marque,
      modele: item.modele,
      annee: item.annee,
      immatriculation: item.immatriculation,
      statut: item.statut,
      tarifJournalier: item.tarifJournalier,
      tarifRotation: item.tarifRotation,
      tarifDegressif: item.tarifDegressif,
      prixVente: item.prixVente,
      enVente: item.enVente,
      enLocation: true,
      description: item.description,
      images: item.imagesGalerie ?? [],
      specifications: item.specifications ?? {},
      isPublished: item.publie,
      isFeatured: item.vedette,
    }, {
      onError: () => toast.info('Publication locale conservée. La synchronisation serveur sera réessayée après configuration de PostgreSQL.'),
    });
  };

  const persistPieceRemote = (item: CatalogPiece) => {
    savePieceRemote.mutate({
      id: item.id,
      reference: item.reference,
      nom: item.nom,
      marque: item.marque,
      famille: item.famille,
      compatibilites: item.compatibilitesMachines ?? [],
      stock: item.stock,
      seuilAlerte: item.seuilAlerte,
      prixUnitaire: item.prixUnitaire,
      fournisseur: item.fournisseur,
      oemReference: item.referenceOEM,
      description: item.description,
      images: item.imagesGalerie ?? [],
      specifications: item.specifications ?? {},
      isPublished: item.publie,
    }, {
      onError: () => toast.info('Publication locale conservée. La synchronisation serveur sera réessayée après configuration de PostgreSQL.'),
    });
  };

  const visibleMachines = useMemo(() => {
    const q = search.toLowerCase().trim();
    return machines.filter(item => {
      const matchesSearch = !q || `${item.nom} ${item.marque} ${item.modele} ${item.type}`.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'PUBLISHED' ? item.publie : !item.publie);
      return matchesSearch && matchesStatus;
    });
  }, [machines, search, statusFilter]);

  const visiblePieces = useMemo(() => {
    const q = search.toLowerCase().trim();
    return pieces.filter(item => {
      const matchesSearch = !q || `${item.nom} ${item.reference} ${item.referenceOEM} ${item.marque} ${item.famille}`.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'PUBLISHED' ? item.publie : !item.publie);
      return matchesSearch && matchesStatus;
    });
  }, [pieces, search, statusFilter]);

  const toggleMachine = (id: string) => {
    const next = machines.map(item => item.id === id ? { ...item, publie: !item.publie } : item);
    setMachines(next);
    saveCatalogMachines(next);
    const updated = next.find(item => item.id === id);
    if (updated) persistMachineRemote(updated);
    toast.success('Visibilité du produit mise à jour.');
  };

  const togglePiece = (id: string) => {
    const next = pieces.map(item => item.id === id ? { ...item, publie: !item.publie } : item);
    setPieces(next);
    saveCatalogPieces(next);
    const updated = next.find(item => item.id === id);
    if (updated) persistPieceRemote(updated);
    toast.success('Visibilité de la pièce mise à jour.');
  };

  const startNew = () => {
    setEditingMachine(null);
    setEditingPiece(null);
    setDraftImages([]);
    setOpen(true);
  };

  const startEditMachine = (machine: CatalogMachine) => {
    setEditingMachine(machine);
    setEditingPiece(null);
    setDraftImages(machine.imagesGalerie ?? []);
    setOpen(true);
  };

  const startEditPiece = (piece: CatalogPiece) => {
    setEditingPiece(piece);
    setEditingMachine(null);
    setDraftImages(piece.imagesGalerie ?? []);
    setOpen(true);
  };

  const saveMachine = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const existing = editingMachine;
    const item: CatalogMachine = {
      id: existing?.id ?? `MAC-${Date.now()}`,
      nom: String(form.get('nom') || ''),
      type: String(form.get('type') || 'PELLE') as TypeMachine,
      marque: String(form.get('marque') || ''),
      modele: String(form.get('modele') || ''),
      annee: Number(form.get('annee') || new Date().getFullYear()),
      immatriculation: String(form.get('immatriculation') || 'À renseigner'),
      statut: existing?.statut ?? 'DISPONIBLE',
      tarifJournalier: Number(form.get('tarifJournalier') || 0),
      tarifRotation: Number(form.get('tarifRotation') || 0) || undefined,
      tarifDegressif: Number(form.get('tarifDegressif') || 0) || undefined,
      prixVente: Number(form.get('prixVente') || 0) || undefined,
      enVente: form.get('enVente') === 'on',
      createdAt: existing?.createdAt ?? new Date(),
      updatedAt: new Date(),
      publie: form.get('publie') === 'on',
      vedette: form.get('vedette') === 'on',
      description: String(form.get('description') || ''),
      imagesGalerie: draftImages,
      specifications: parseSpecifications(String(form.get('specifications') || '')),
    };
    const next = existing ? machines.map(current => current.id === existing.id ? item : current) : [item, ...machines];
    setMachines(next);
    saveCatalogMachines(next);
    persistMachineRemote(item);
    setOpen(false);
    toast.success(existing ? 'Machine modifiée avec succès.' : 'Machine ajoutée au catalogue.');
  };

  const savePiece = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const existing = editingPiece;
    const item: CatalogPiece = {
      id: existing?.id ?? `PCE-${Date.now()}`,
      nom: String(form.get('nom') || ''),
      reference: String(form.get('reference') || ''),
      referenceOEM: String(form.get('referenceOEM') || ''),
      marque: String(form.get('marque') || 'CATERPILLAR') as MarquePiece,
      famille: String(form.get('famille') || 'MOTEUR') as FamillePiece,
      compatibilitesMachines: existing?.compatibilitesMachines ?? [],
      stock: Number(form.get('stock') || 0),
      seuilAlerte: Number(form.get('seuilAlerte') || 5),
      prixUnitaire: Number(form.get('prixUnitaire') || 0),
      fournisseur: String(form.get('fournisseur') || ''),
      createdAt: existing?.createdAt ?? new Date(),
      updatedAt: new Date(),
      publie: form.get('publie') === 'on',
      description: String(form.get('description') || ''),
      imagesGalerie: draftImages,
      specifications: parseSpecifications(String(form.get('specifications') || '')),
    };
    const next = existing ? pieces.map(piece => piece.id === existing.id ? item : piece) : [item, ...pieces];
    setPieces(next);
    saveCatalogPieces(next);
    persistPieceRemote(item);
    setOpen(false);
    toast.success(existing ? 'Pièce modifiée avec succès.' : 'Pièce ajoutée au catalogue.');
  };

  const modalTitle = editingMachine ? 'Modifier une machine' : editingPiece ? 'Modifier une pièce' : tab === 'machines' ? 'Ajouter une machine' : 'Ajouter une pièce';

  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-sm font-bold uppercase tracking-wider mb-2">
            <Sparkles className="h-4 w-4" /> Vitrine commerciale
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Catalogue & Publication</h1>
          <p className="text-slate-500 mt-2 max-w-2xl">Créez vos offres, gérez la visibilité publique et mettez à jour les prix et disponibilités de vos machines et pièces détachées.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={startNew} className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg">
              <Plus className="h-4 w-4 mr-2" /> {tab === 'machines' ? 'Nouvelle machine' : 'Nouvelle pièce'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{modalTitle}</DialogTitle>
              <DialogDescription>Les champs enregistrés sont disponibles immédiatement dans votre espace catalogue.</DialogDescription>
            </DialogHeader>
            {tab === 'machines' || editingMachine ? (
              <form onSubmit={saveMachine} className="grid gap-5 py-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="nom">Nom commercial</Label><Input id="nom" name="nom" defaultValue={editingMachine?.nom} required placeholder="Pelle Caterpillar 320" /></div>
                  <div><Label htmlFor="type">Catégorie</Label><select id="type" name="type" defaultValue={editingMachine?.type ?? 'PELLE'} className="w-full h-10 rounded-md border bg-background px-3 text-sm">{machineTypes.map(type => <option key={type} value={type}>{type}</option>)}</select></div>
                  <div><Label htmlFor="marque">Marque</Label><Input id="marque" name="marque" defaultValue={editingMachine?.marque} required placeholder="Caterpillar" /></div>
                  <div><Label htmlFor="modele">Modèle</Label><Input id="modele" name="modele" defaultValue={editingMachine?.modele} required placeholder="320D" /></div>
                  <div><Label htmlFor="annee">Année</Label><Input id="annee" name="annee" type="number" min="1950" max="2100" defaultValue={editingMachine?.annee ?? new Date().getFullYear()} required /></div>
                  <div><Label htmlFor="immatriculation">Immatriculation</Label><Input id="immatriculation" name="immatriculation" defaultValue={editingMachine?.immatriculation} placeholder="SN-2026-A001" /></div>
                  <div><Label htmlFor="tarifJournalier">Tarif journalier (FCFA)</Label><Input id="tarifJournalier" name="tarifJournalier" type="number" min="0" defaultValue={editingMachine?.tarifJournalier} required /></div>
                  <div><Label htmlFor="tarifRotation">Tarif rotation (FCFA)</Label><Input id="tarifRotation" name="tarifRotation" type="number" min="0" defaultValue={editingMachine?.tarifRotation} /></div>
                  <div><Label htmlFor="tarifDegressif">Tarif dégressif (FCFA)</Label><Input id="tarifDegressif" name="tarifDegressif" type="number" min="0" defaultValue={editingMachine?.tarifDegressif} /></div>
                  <div><Label htmlFor="prixVente">Prix de vente (FCFA)</Label><Input id="prixVente" name="prixVente" type="number" min="0" defaultValue={editingMachine?.prixVente} /></div>
                </div>
                <div><Label htmlFor="description">Description publique</Label><textarea id="description" name="description" defaultValue={editingMachine?.description} className="min-h-24 w-full rounded-md border bg-background p-3 text-sm" placeholder="Décrivez l'usage, l'état et les conditions de l'offre." /></div>
                <div><Label htmlFor="specifications">Spécifications techniques</Label><textarea id="specifications" name="specifications" defaultValue={stringifySpecifications(editingMachine?.specifications)} className="min-h-24 w-full rounded-md border bg-background p-3 text-sm" placeholder="Puissance: 150 kW\nPoids opérationnel: 22 t\nCapacité godet: 1,2 m³" /><p className="mt-1 text-xs text-slate-500">Une ligne par caractéristique au format « Libellé: valeur ».</p></div>
                <ImageGalleryField value={draftImages} onChange={setDraftImages} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <label className="flex items-center gap-2 rounded-lg border p-3"><input type="checkbox" name="enVente" defaultChecked={editingMachine?.enVente} /> Disponible à la vente</label>
                  <label className="flex items-center gap-2 rounded-lg border p-3"><input type="checkbox" name="publie" defaultChecked={editingMachine?.publie ?? true} /> Publier en vitrine</label>
                  <label className="flex items-center gap-2 rounded-lg border p-3"><input type="checkbox" name="vedette" defaultChecked={editingMachine?.vedette} /> Mettre en vedette</label>
                </div>
                <DialogFooter><Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white"><Check className="h-4 w-4 mr-2" /> Enregistrer la machine</Button></DialogFooter>
              </form>
            ) : (
              <form onSubmit={savePiece} className="grid gap-5 py-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="nom">Nom de la pièce</Label><Input id="nom" name="nom" defaultValue={editingPiece?.nom} required placeholder="Filtre hydraulique" /></div>
                  <div><Label htmlFor="reference">Référence interne</Label><Input id="reference" name="reference" defaultValue={editingPiece?.reference} required placeholder="PCE-HYD-001" /></div>
                  <div><Label htmlFor="referenceOEM">Référence d'origine OEM</Label><Input id="referenceOEM" name="referenceOEM" defaultValue={editingPiece?.referenceOEM} placeholder="1R-1808" /></div>
                  <div><Label htmlFor="marque">Marque</Label><select id="marque" name="marque" defaultValue={editingPiece?.marque ?? 'CATERPILLAR'} className="w-full h-10 rounded-md border bg-background px-3 text-sm">{pieceBrands.map(value => <option key={value} value={value}>{value}</option>)}</select></div>
                  <div><Label htmlFor="famille">Famille</Label><select id="famille" name="famille" defaultValue={editingPiece?.famille ?? 'MOTEUR'} className="w-full h-10 rounded-md border bg-background px-3 text-sm">{pieceFamilies.map(value => <option key={value} value={value}>{value}</option>)}</select></div>
                  <div><Label htmlFor="fournisseur">Fournisseur</Label><Input id="fournisseur" name="fournisseur" defaultValue={editingPiece?.fournisseur} placeholder="Fournisseur agréé" /></div>
                  <div><Label htmlFor="stock">Stock actuel</Label><Input id="stock" name="stock" type="number" min="0" defaultValue={editingPiece?.stock ?? 0} required /></div>
                  <div><Label htmlFor="seuilAlerte">Seuil d'alerte</Label><Input id="seuilAlerte" name="seuilAlerte" type="number" min="0" defaultValue={editingPiece?.seuilAlerte ?? 5} required /></div>
                  <div><Label htmlFor="prixUnitaire">Prix unitaire (FCFA)</Label><Input id="prixUnitaire" name="prixUnitaire" type="number" min="0" defaultValue={editingPiece?.prixUnitaire} required /></div>
                </div>
                <div><Label htmlFor="description">Description publique</Label><textarea id="description" name="description" defaultValue={editingPiece?.description} className="min-h-24 w-full rounded-md border bg-background p-3 text-sm" placeholder="Compatibilités et informations utiles." /></div>
                <div><Label htmlFor="specifications">Spécifications de la pièce</Label><textarea id="specifications" name="specifications" defaultValue={stringifySpecifications(editingPiece?.specifications)} className="min-h-24 w-full rounded-md border bg-background p-3 text-sm" placeholder="Matière: Acier trempé\nCompatibilité: Caterpillar 320\nGarantie: 12 mois" /><p className="mt-1 text-xs text-slate-500">Une ligne par caractéristique au format « Libellé: valeur ».</p></div>
                <ImageGalleryField value={draftImages} onChange={setDraftImages} />
                <label className="flex items-center gap-2 rounded-lg border p-3 text-sm"><input type="checkbox" name="publie" defaultChecked={editingPiece?.publie ?? true} /> Publier en vitrine</label>
                <DialogFooter><Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white"><Check className="h-4 w-4 mr-2" /> Enregistrer la pièce</Button></DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-slate-900 text-white border-none"><div className="flex items-center justify-between"><div><p className="text-slate-400 text-sm">Total catalogue</p><p className="text-3xl font-bold mt-1">{machines.length + pieces.length}</p></div><Archive className="h-8 w-8 text-amber-400" /></div></Card>
        <Card className="p-5 border-slate-200"><div className="flex items-center justify-between"><div><p className="text-slate-500 text-sm">Produits publiés</p><p className="text-3xl font-bold mt-1 text-emerald-600">{machines.filter(item => item.publie).length + pieces.filter(item => item.publie).length}</p></div><Eye className="h-8 w-8 text-emerald-500" /></div></Card>
        <Card className="p-5 border-slate-200"><div className="flex items-center justify-between"><div><p className="text-slate-500 text-sm">Brouillons</p><p className="text-3xl font-bold mt-1 text-slate-700">{machines.filter(item => !item.publie).length + pieces.filter(item => !item.publie).length}</p></div><EyeOff className="h-8 w-8 text-slate-400" /></div></Card>
        <Card className="p-5 border-slate-200"><div className="flex items-center justify-between"><div><p className="text-slate-500 text-sm">Stock à surveiller</p><p className="text-3xl font-bold mt-1 text-red-600">{pieces.filter(item => item.stock <= item.seuilAlerte).length}</p></div><PackagePlus className="h-8 w-8 text-red-500" /></div></Card>
      </div>

      <Card className="p-5 border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          <div className="flex bg-slate-100 rounded-lg p-1 w-fit">
            <button onClick={() => { setTab('machines'); setSearch(''); }} className={`px-4 py-2 rounded-md text-sm font-semibold ${tab === 'machines' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}><Truck className="inline h-4 w-4 mr-2" />Machines</button>
            <button onClick={() => { setTab('pieces'); setSearch(''); }} className={`px-4 py-2 rounded-md text-sm font-semibold ${tab === 'pieces' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}><Wrench className="inline h-4 w-4 mr-2" />Pièces</button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><Input value={search} onChange={event => setSearch(event.target.value)} className="pl-9 w-full sm:w-72" placeholder={tab === 'machines' ? 'Nom, marque, modèle...' : 'Nom, référence, OEM...'} /></div>
            <select value={statusFilter} onChange={event => setStatusFilter(event.target.value as typeof statusFilter)} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="ALL">Tous les statuts</option><option value="PUBLISHED">Publiés</option><option value="DRAFT">Brouillons</option></select>
          </div>
        </div>
      </Card>

      {tab === 'machines' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {visibleMachines.map(machine => (
            <Card key={machine.id} className="p-5 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4"><div className="flex gap-4"><div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700"><Truck className="h-6 w-6" /></div><div><div className="flex items-center gap-2"><h3 className="font-bold text-slate-900">{machine.nom}</h3><Badge variant={machine.publie ? 'default' : 'secondary'}>{machine.publie ? 'Publié' : 'Brouillon'}</Badge></div><p className="text-sm text-slate-500 mt-1">{machine.marque} · {machine.modele} · {machine.type}</p></div></div><button onClick={() => startEditMachine(machine)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500" aria-label="Modifier"><Pencil className="h-4 w-4" /></button></div>
              <p className="text-sm text-slate-600 mt-4 line-clamp-2">{machine.description}</p>
              <div className="grid grid-cols-3 gap-3 mt-5 text-sm"><div><span className="text-slate-400 block">Location / jour</span><strong>{formatMoney(machine.tarifJournalier)}</strong></div><div><span className="text-slate-400 block">Vente</span><strong>{machine.prixVente ? formatMoney(machine.prixVente) : 'Sur devis'}</strong></div><div><span className="text-slate-400 block">Statut flotte</span><strong>{machine.statut}</strong></div></div>
              <div className="flex gap-2 mt-5 pt-4 border-t border-slate-100"><Button onClick={() => toggleMachine(machine.id)} variant="outline" className="flex-1">{machine.publie ? <><EyeOff className="h-4 w-4 mr-2" /> Dépublier</> : <><Eye className="h-4 w-4 mr-2" /> Publier</>}</Button><Button onClick={() => startEditMachine(machine)} variant="ghost"><Settings2 className="h-4 w-4 mr-2" /> Éditer</Button></div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {visiblePieces.map(piece => (
            <Card key={piece.id} className="p-5 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4"><div className="flex gap-4"><div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700"><Wrench className="h-6 w-6" /></div><div><div className="flex items-center gap-2"><h3 className="font-bold text-slate-900">{piece.nom}</h3><Badge variant={piece.publie ? 'default' : 'secondary'}>{piece.publie ? 'Publié' : 'Brouillon'}</Badge></div><p className="text-sm text-slate-500 mt-1">{piece.marque} · {piece.famille} · OEM {piece.referenceOEM}</p></div></div><button onClick={() => startEditPiece(piece)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500" aria-label="Modifier"><Pencil className="h-4 w-4" /></button></div>
              <p className="text-sm text-slate-600 mt-4 line-clamp-2">{piece.description}</p>
              <div className="grid grid-cols-3 gap-3 mt-5 text-sm"><div><span className="text-slate-400 block">Référence</span><strong>{piece.reference}</strong></div><div><span className="text-slate-400 block">Prix unitaire</span><strong>{formatMoney(piece.prixUnitaire)}</strong></div><div><span className="text-slate-400 block">Stock</span><strong className={piece.stock <= piece.seuilAlerte ? 'text-red-600' : 'text-emerald-600'}>{piece.stock} unités</strong></div></div>
              <div className="flex gap-2 mt-5 pt-4 border-t border-slate-100"><Button onClick={() => togglePiece(piece.id)} variant="outline" className="flex-1">{piece.publie ? <><EyeOff className="h-4 w-4 mr-2" /> Dépublier</> : <><Eye className="h-4 w-4 mr-2" /> Publier</>}</Button><Button onClick={() => startEditPiece(piece)} variant="ghost"><Settings2 className="h-4 w-4 mr-2" /> Éditer</Button></div>
            </Card>
          ))}
        </div>
      )}

      {(tab === 'machines' ? visibleMachines.length === 0 : visiblePieces.length === 0) && <Card className="p-12 text-center border-dashed"><Archive className="mx-auto h-10 w-10 text-slate-300 mb-4" /><h3 className="font-bold text-slate-900">Aucun élément trouvé</h3><p className="text-slate-500 mt-2">Modifiez votre recherche ou créez une nouvelle fiche catalogue.</p></Card>}
    </div>
  );
}
