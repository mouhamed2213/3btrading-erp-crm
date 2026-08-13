import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  AlertCircle,
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  FilePlus2,
  FileText,
  Mail,
  Phone,
  Plus,
  Printer,
  Receipt,
  Send,
  Smartphone,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { mockFactures } from '@/services/mock/factures';
import { mockClients } from '@/services/mock/clients';
import type { Facture, FactureLigne, ModeReglement, StatutFacture, TypeFacture } from '@/types';

type FinanceTab = 'TOUTES' | TypeFacture | 'IMPAYEES' | 'RELANCES';

type DraftLine = { description: string; quantite: number; prixUnitaire: number };

const formatMoney = (value: number) => `${value.toLocaleString('fr-FR')} FCFA`;
const typeLabel: Record<TypeFacture, string> = { PROFORMA: 'Proforma', ACOMPTE: 'Acompte', DEFINITIVE: 'Définitive' };
const statusLabel: Record<StatutFacture, string> = { BROUILLON: 'Brouillon', EMISE: 'Émise', PAYEE: 'Payée', IMPAYEE: 'Impayée', PARTIELLEMENT_PAYEE: 'Partiellement payée' };

function statusClass(status: StatutFacture) {
  if (status === 'PAYEE') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (status === 'IMPAYEE') return 'bg-red-100 text-red-800 border-red-200';
  if (status === 'PARTIELLEMENT_PAYEE') return 'bg-amber-100 text-amber-800 border-amber-200';
  if (status === 'EMISE') return 'bg-blue-100 text-blue-800 border-blue-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

function computeStatus(amountPaid: number, total: number): StatutFacture {
  if (amountPaid >= total) return 'PAYEE';
  if (amountPaid > 0) return 'PARTIELLEMENT_PAYEE';
  return 'IMPAYEE';
}

export default function Facturation() {
  const [factures, setFactures] = useState<Facture[]>(mockFactures);
  const [activeTab, setActiveTab] = useState<FinanceTab>('TOUTES');
  const [selected, setSelected] = useState<Facture | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState<ModeReglement>('CASH');
  const [draftType, setDraftType] = useState<TypeFacture>('PROFORMA');
  const [draftClientId, setDraftClientId] = useState(mockClients[0]?.id ?? '');
  const [draftLines, setDraftLines] = useState<DraftLine[]>([{ description: '', quantite: 1, prixUnitaire: 0 }]);
  const [draftTax, setDraftTax] = useState('18');

  const unpaid = factures.filter(item => item.statut === 'IMPAYEE' || item.statut === 'PARTIELLEMENT_PAYEE');
  const totalHT = factures.reduce((sum, item) => sum + item.montantHT, 0);
  const totalPaid = factures.reduce((sum, item) => sum + (item.montantPaye || 0), 0);
  const totalOutstanding = factures.reduce((sum, item) => sum + Math.max(item.montantTTC - (item.montantPaye || 0), 0), 0);

  const filtered = useMemo(() => {
    if (activeTab === 'TOUTES') return factures;
    if (activeTab === 'IMPAYEES' || activeTab === 'RELANCES') return unpaid;
    return factures.filter(item => item.type === activeTab);
  }, [activeTab, factures, unpaid]);

  const clientName = (clientId: string) => mockClients.find(client => client.id === clientId)?.nom ?? 'Client non renseigné';

  const updateDraftLine = (index: number, field: keyof DraftLine, value: string) => {
    setDraftLines(lines => lines.map((line, lineIndex) => lineIndex === index ? { ...line, [field]: field === 'description' ? value : Number(value) } : line));
  };

  const addDraftLine = () => setDraftLines(lines => [...lines, { description: '', quantite: 1, prixUnitaire: 0 }]);
  const removeDraftLine = (index: number) => setDraftLines(lines => lines.length > 1 ? lines.filter((_, lineIndex) => lineIndex !== index) : lines);

  const createFacture = (event: React.FormEvent) => {
    event.preventDefault();
    const tax = Number(draftTax);
    const validLines = draftLines.filter(line => line.description.trim() && line.quantite > 0 && line.prixUnitaire > 0);
    if (!draftClientId || validLines.length === 0 || tax < 0) {
      toast.error('Ajoutez au moins une ligne complète avec des montants positifs.');
      return;
    }
    const montantHT = validLines.reduce((sum, line) => sum + line.quantite * line.prixUnitaire, 0);
    const montantTVA = montantHT * tax / 100;
    const now = new Date();
    const prefix = draftType === 'PROFORMA' ? 'PROF' : draftType === 'ACOMPTE' ? 'ACOMP' : 'FAC';
    const lines: FactureLigne[] = validLines.map((line, index) => ({ id: `LIG-${Date.now()}-${index}`, description: line.description, quantite: line.quantite, prixUnitaire: line.prixUnitaire, montantHT: line.quantite * line.prixUnitaire }));
    const invoice: Facture = {
      id: `FAC-${Date.now()}`,
      numero: `${prefix}-${now.getFullYear()}-${String(factures.length + 1).padStart(3, '0')}`,
      clientId: draftClientId,
      type: draftType,
      dateEmission: now,
      dateEcheance: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      montantHT,
      tauxTVA: tax,
      montantTVA,
      montantTTC: montantHT + montantTVA,
      statut: 'BROUILLON',
      nombreRelances: 0,
      lignes: lines,
      createdAt: now,
      updatedAt: now,
    };
    setFactures(current => [invoice, ...current]);
    setCreateOpen(false);
    setDraftLines([{ description: '', quantite: 1, prixUnitaire: 0 }]);
    toast.success(`${typeLabel[draftType]} ${invoice.numero} créée en brouillon.`);
  };

  const recordPayment = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    const amount = Number(paymentAmount);
    const outstanding = selected.montantTTC - (selected.montantPaye || 0);
    if (amount <= 0 || amount > outstanding) {
      toast.error('Le montant doit être positif et ne pas dépasser le solde restant.');
      return;
    }
    const nextPaid = (selected.montantPaye || 0) + amount;
    const next = { ...selected, montantPaye: nextPaid, modePaiement: paymentMode, datePaiement: new Date(), statut: computeStatus(nextPaid, selected.montantTTC), updatedAt: new Date() };
    setFactures(current => current.map(item => item.id === selected.id ? next : item));
    setSelected(next);
    setPaymentOpen(false);
    setPaymentAmount('');
    toast.success(`Paiement ${formatMoney(amount)} enregistré via ${paymentMode === 'CASH' ? 'espèces' : 'Mobile Money'}.`);
  };

  const sendReminder = (invoice: Facture) => {
    const next = { ...invoice, nombreRelances: invoice.nombreRelances + 1, dateRelance: new Date(), updatedAt: new Date() };
    setFactures(current => current.map(item => item.id === invoice.id ? next : item));
    setSelected(next);
    toast.success(`Relance ${next.nombreRelances} envoyée à ${clientName(invoice.clientId)}.`);
  };

  const openPreview = (invoice: Facture) => { setSelected(invoice); setPreviewOpen(true); };

  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5"><div><div className="flex items-center gap-2 text-amber-600 text-sm font-bold uppercase tracking-wider mb-2"><Receipt className="h-4 w-4" /> Gestion financière</div><h1 className="text-3xl font-bold tracking-tight text-slate-900">Facturation & Finance</h1><p className="text-slate-500 mt-2">Créez vos documents, suivez les encaissements et pilotez les relances sans perdre le fil client.</p></div><Dialog open={createOpen} onOpenChange={setCreateOpen}><DialogTrigger asChild><Button className="bg-slate-900 hover:bg-slate-800 text-white"><Plus className="h-4 w-4 mr-2" /> Nouveau document</Button></DialogTrigger><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Créer un document commercial</DialogTitle><DialogDescription>Générez une proforma, un acompte ou une facture définitive à partir d'une première ligne de prestation.</DialogDescription></DialogHeader><form onSubmit={createFacture} className="space-y-5"><div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><button type="button" onClick={() => setDraftType('PROFORMA')} className={`p-3 rounded-lg border text-left ${draftType === 'PROFORMA' ? 'border-amber-500 bg-amber-50' : 'border-slate-200'}`}><FileText className="h-5 w-5 text-amber-600 mb-2" /><div className="font-bold text-sm">Proforma</div><div className="text-xs text-slate-500 mt-1">Préparer l'offre</div></button><button type="button" onClick={() => setDraftType('ACOMPTE')} className={`p-3 rounded-lg border text-left ${draftType === 'ACOMPTE' ? 'border-amber-500 bg-amber-50' : 'border-slate-200'}`}><Banknote className="h-5 w-5 text-blue-600 mb-2" /><div className="font-bold text-sm">Acompte</div><div className="text-xs text-slate-500 mt-1">Sécuriser le démarrage</div></button><button type="button" onClick={() => setDraftType('DEFINITIVE')} className={`p-3 rounded-lg border text-left ${draftType === 'DEFINITIVE' ? 'border-amber-500 bg-amber-50' : 'border-slate-200'}`}><CheckCircle2 className="h-5 w-5 text-emerald-600 mb-2" /><div className="font-bold text-sm">Définitive</div><div className="text-xs text-slate-500 mt-1">Facturer la prestation</div></button></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><Label>Client</Label><select value={draftClientId} onChange={event => setDraftClientId(event.target.value)} className="w-full mt-1.5 h-10 rounded-md border bg-background px-3 text-sm">{mockClients.map(client => <option key={client.id} value={client.id}>{client.nom}</option>)}</select></div><div><Label>Taux TVA (%)</Label><Input value={draftTax} onChange={event => setDraftTax(event.target.value)} type="number" min="0" className="mt-1.5" /></div></div><div className="rounded-xl border border-slate-200 overflow-hidden"><div className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200"><div><div className="font-bold text-sm text-slate-900">Lignes du document</div><div className="text-xs text-slate-500 mt-1">Ajoutez chaque prestation, engin ou pièce séparément.</div></div><Button type="button" variant="outline" size="sm" onClick={addDraftLine}><Plus className="h-4 w-4 mr-1" /> Ajouter une ligne</Button></div><div className="p-4 space-y-3">{draftLines.map((line, index) => <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_90px_150px_40px] gap-3 items-end"><div><Label>Description {index + 1}</Label><Input value={line.description} onChange={event => updateDraftLine(index, 'description', event.target.value)} placeholder="Location pelle – 7 jours" className="mt-1.5" /></div><div><Label>Qté</Label><Input value={line.quantite} onChange={event => updateDraftLine(index, 'quantite', event.target.value)} type="number" min="0.01" step="0.01" className="mt-1.5" /></div><div><Label>PU HT (FCFA)</Label><Input value={line.prixUnitaire || ''} onChange={event => updateDraftLine(index, 'prixUnitaire', event.target.value)} type="number" min="1" className="mt-1.5" /></div><Button type="button" variant="ghost" size="icon" onClick={() => removeDraftLine(index)} disabled={draftLines.length === 1} aria-label="Supprimer la ligne"><Trash2 className="h-4 w-4 text-red-500" /></Button></div>)}</div><div className="flex flex-wrap justify-end gap-5 px-4 py-3 bg-slate-50 border-t border-slate-200 text-sm"><span className="text-slate-500">Total HT calculé</span><strong>{formatMoney(draftLines.reduce((sum, line) => sum + line.quantite * line.prixUnitaire, 0))}</strong><span className="text-slate-500">TTC estimé</span><strong className="text-amber-700">{formatMoney(draftLines.reduce((sum, line) => sum + line.quantite * line.prixUnitaire, 0) * (1 + Number(draftTax || 0) / 100))}</strong></div></div><DialogFooter><Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white"><FilePlus2 className="h-4 w-4 mr-2" /> Créer le document</Button></DialogFooter></form></DialogContent></Dialog></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"><Card className="p-5 bg-slate-900 text-white border-none shadow-xl"><p className="text-slate-400 text-sm">Documents</p><p className="text-3xl font-bold mt-2">{factures.length}</p><p className="text-xs text-slate-400 mt-2">Proforma, acomptes et définitives</p></Card><Card className="p-5 border-slate-200"><p className="text-slate-500 text-sm">Montant HT généré</p><p className="text-3xl font-bold mt-2">{formatMoney(totalHT)}</p><p className="text-xs text-slate-400 mt-2">Base de facturation</p></Card><Card className="p-5 border-emerald-100 bg-emerald-50"><p className="text-emerald-700 text-sm font-semibold">Déjà encaissé</p><p className="text-3xl font-bold mt-2 text-emerald-700">{formatMoney(totalPaid)}</p><p className="text-xs text-emerald-700/70 mt-2">Cash + Mobile Money</p></Card><Card className="p-5 border-red-100 bg-red-50"><p className="text-red-700 text-sm font-semibold">Reste à recouvrer</p><p className="text-3xl font-bold mt-2 text-red-700">{formatMoney(totalOutstanding)}</p><button onClick={() => setActiveTab('RELANCES')} className="text-xs text-red-700 font-bold mt-2 hover:underline">Ouvrir le suivi des relances <ArrowUpRight className="inline h-3 w-3" /></button></Card></div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">{(['TOUTES', 'PROFORMA', 'ACOMPTE', 'DEFINITIVE', 'IMPAYEES', 'RELANCES'] as FinanceTab[]).map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{tab === 'TOUTES' ? `Toutes (${factures.length})` : tab === 'IMPAYEES' ? `Impayées (${unpaid.length})` : tab === 'RELANCES' ? `Relances (${unpaid.filter(item => item.nombreRelances > 0).length})` : typeLabel[tab]}</button>)}</div>

      {activeTab === 'RELANCES' ? <Card className="overflow-hidden border-red-100"><div className="p-5 border-b border-red-100 bg-red-50"><div className="flex items-start gap-3"><AlertCircle className="h-5 w-5 text-red-600 mt-0.5" /><div><h2 className="font-bold text-red-900">Suivi des impayés & relances</h2><p className="text-sm text-red-800 mt-1">Chaque ligne peut être relancée individuellement, avec historique du nombre de contacts effectués.</p></div></div></div><div className="divide-y divide-slate-100">{unpaid.map(invoice => <div key={invoice.id} className="p-5 flex flex-col lg:flex-row lg:items-center gap-4 justify-between"><div><div className="flex items-center gap-2"><span className="font-mono font-bold text-slate-900">{invoice.numero}</span><Badge className={statusClass(invoice.statut)}>{statusLabel[invoice.statut]}</Badge></div><div className="text-sm text-slate-600 mt-2">{clientName(invoice.clientId)} · Échéance {new Date(invoice.dateEcheance).toLocaleDateString('fr-FR')}</div><div className="text-xs text-slate-500 mt-1">Solde : <strong className="text-red-700">{formatMoney(invoice.montantTTC - (invoice.montantPaye || 0))}</strong> · {invoice.nombreRelances} relance(s)</div></div><div className="flex gap-2"><Button onClick={() => openPreview(invoice)} variant="outline"><FileText className="h-4 w-4 mr-2" /> Voir</Button><Button onClick={() => sendReminder(invoice)} className="bg-red-600 hover:bg-red-700 text-white"><Send className="h-4 w-4 mr-2" /> Relancer</Button></div></div>)}{unpaid.length === 0 && <div className="p-12 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500 mb-3" /><p className="font-bold text-slate-900">Aucun impayé à relancer</p><p className="text-sm text-slate-500 mt-1">Votre suivi client est à jour.</p></div>}</div></Card> : <Card className="overflow-hidden border-slate-200 shadow-sm"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="text-left px-5 py-4 font-semibold">Document</th><th className="text-left px-5 py-4 font-semibold">Client</th><th className="text-left px-5 py-4 font-semibold">Type</th><th className="text-right px-5 py-4 font-semibold">Total TTC</th><th className="text-left px-5 py-4 font-semibold">Règlement</th><th className="text-left px-5 py-4 font-semibold">Statut</th><th className="text-right px-5 py-4 font-semibold">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map(invoice => <tr key={invoice.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><button onClick={() => openPreview(invoice)} className="font-mono font-bold text-slate-900 hover:text-amber-700">{invoice.numero}</button><div className="text-xs text-slate-400 mt-1">{new Date(invoice.dateEmission).toLocaleDateString('fr-FR')}</div></td><td className="px-5 py-4 text-slate-700">{clientName(invoice.clientId)}</td><td className="px-5 py-4"><Badge variant="secondary">{typeLabel[invoice.type]}</Badge></td><td className="px-5 py-4 text-right font-bold text-slate-900">{formatMoney(invoice.montantTTC)}</td><td className="px-5 py-4">{invoice.modePaiement ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">{invoice.modePaiement === 'CASH' ? <Banknote className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}{invoice.modePaiement === 'CASH' ? 'Espèces' : 'Mobile Money'}</span> : <span className="text-xs text-slate-400">Non réglé</span>}</td><td className="px-5 py-4"><Badge className={statusClass(invoice.statut)}>{statusLabel[invoice.statut]}</Badge></td><td className="px-5 py-4 text-right"><div className="flex justify-end gap-1"><Button onClick={() => openPreview(invoice)} variant="ghost" size="sm"><FileText className="h-4 w-4" /></Button>{invoice.statut !== 'PAYEE' && <Button onClick={() => { setSelected(invoice); setPaymentOpen(true); }} variant="ghost" size="sm" className="text-emerald-700"><Banknote className="h-4 w-4" /></Button>}</div></td></tr>)}</tbody></table></div>{filtered.length === 0 && <div className="p-12 text-center text-slate-500">Aucun document dans cette vue.</div>}</Card>}

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}><DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto"><DialogHeader><DialogTitle>Aperçu du document {selected?.numero}</DialogTitle><DialogDescription>Document prêt à être imprimé ou communiqué au client.</DialogDescription></DialogHeader>{selected && <div id="invoice-print" className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10"><div className="flex flex-col sm:flex-row justify-between gap-5 pb-7 border-b border-slate-200"><div><div className="text-2xl font-extrabold tracking-tight text-slate-900">3BTRADING</div><div className="text-sm text-slate-500 mt-1">Travaux Publics · Location · Vente de pièces</div><div className="text-xs text-slate-400 mt-3">Abidjan · Côte d'Ivoire</div></div><div className="sm:text-right"><div className="text-xs uppercase tracking-widest text-amber-600 font-bold">{typeLabel[selected.type]}</div><div className="font-mono font-bold text-xl text-slate-900 mt-1">{selected.numero}</div><div className="text-sm text-slate-500 mt-2">Émis le {new Date(selected.dateEmission).toLocaleDateString('fr-FR')}</div><div className="text-sm text-slate-500">Échéance le {new Date(selected.dateEcheance).toLocaleDateString('fr-FR')}</div></div></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-7"><div><div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Facturer à</div><div className="font-bold text-slate-900">{clientName(selected.clientId)}</div><div className="text-sm text-slate-500 mt-1">Client enregistré 3BTRADING</div></div><div className="sm:text-right"><div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Statut</div><Badge className={statusClass(selected.statut)}>{statusLabel[selected.statut]}</Badge></div></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="text-left px-3 py-3">Désignation</th><th className="text-right px-3 py-3">Qté</th><th className="text-right px-3 py-3">PU HT</th><th className="text-right px-3 py-3">Total HT</th></tr></thead><tbody className="divide-y divide-slate-100">{selected.lignes.map(line => <tr key={line.id}><td className="px-3 py-4">{line.description}</td><td className="px-3 py-4 text-right">{line.quantite}</td><td className="px-3 py-4 text-right">{formatMoney(line.prixUnitaire)}</td><td className="px-3 py-4 text-right font-semibold">{formatMoney(line.montantHT)}</td></tr>)}</tbody></table></div><div className="flex justify-end mt-7"><div className="w-full sm:w-72 text-sm"><div className="flex justify-between py-2"><span className="text-slate-500">Total HT</span><strong>{formatMoney(selected.montantHT)}</strong></div><div className="flex justify-between py-2 border-b border-slate-200"><span className="text-slate-500">TVA ({selected.tauxTVA}%)</span><strong>{formatMoney(selected.montantTVA)}</strong></div><div className="flex justify-between py-3 mt-1 rounded-lg bg-slate-900 text-white px-3 font-bold"><span>Total TTC</span><span>{formatMoney(selected.montantTTC)}</span></div><div className="flex justify-between py-2 mt-2 text-emerald-700"><span>Déjà payé</span><strong>{formatMoney(selected.montantPaye || 0)}</strong></div><div className="flex justify-between py-2 text-red-700"><span>Reste dû</span><strong>{formatMoney(Math.max(selected.montantTTC - (selected.montantPaye || 0), 0))}</strong></div></div></div></div>}
          <div className="flex flex-col sm:flex-row gap-2"><Button onClick={() => window.print()} variant="outline" className="flex-1"><Printer className="h-4 w-4 mr-2" /> Imprimer</Button>{selected && selected.statut !== 'PAYEE' && <Button onClick={() => { setPreviewOpen(false); setPaymentOpen(true); }} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"><Banknote className="h-4 w-4 mr-2" /> Enregistrer un paiement</Button>}{selected && selected.statut !== 'PAYEE' && <Button onClick={() => selected && sendReminder(selected)} className="flex-1 bg-red-600 hover:bg-red-700 text-white"><Send className="h-4 w-4 mr-2" /> Relancer</Button>}</div>
        </DialogContent></Dialog>

      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}><DialogContent className="max-w-md"><DialogHeader><DialogTitle>Enregistrer un règlement</DialogTitle><DialogDescription>{selected ? `${selected.numero} · Solde restant ${formatMoney(selected.montantTTC - (selected.montantPaye || 0))}` : ''}</DialogDescription></DialogHeader><form onSubmit={recordPayment} className="space-y-5"><div><Label>Montant encaissé (FCFA)</Label><Input value={paymentAmount} onChange={event => setPaymentAmount(event.target.value)} type="number" min="1" className="mt-1.5" required /></div><div><Label>Mode de règlement</Label><div className="grid grid-cols-2 gap-3 mt-2"><button type="button" onClick={() => setPaymentMode('CASH')} className={`p-4 rounded-lg border text-left ${paymentMode === 'CASH' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}><Banknote className="h-5 w-5 text-emerald-600 mb-2" /><div className="font-bold text-sm">Espèces</div><div className="text-xs text-slate-500 mt-1">Cash</div></button><button type="button" onClick={() => setPaymentMode('MOBILE_MONEY')} className={`p-4 rounded-lg border text-left ${paymentMode === 'MOBILE_MONEY' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}><Smartphone className="h-5 w-5 text-blue-600 mb-2" /><div className="font-bold text-sm">Mobile Money</div><div className="text-xs text-slate-500 mt-1">Wave / Orange Money</div></button></div></div><DialogFooter><Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Confirmer le paiement</Button></DialogFooter></form></DialogContent></Dialog>
    </div>
  );
}
