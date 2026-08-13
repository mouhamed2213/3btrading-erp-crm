import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, ArrowUpRight, Boxes, CalendarDays, CheckCircle2, CircleDollarSign, FilePlus2, PackagePlus, Plus, Rocket, Truck, Wrench } from 'lucide-react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockChantiers } from '@/services/mock/chantiers';
import { mockLocations } from '@/services/mock/locations';
import { mockFactures } from '@/services/mock/factures';
import { getCatalogPieces, getCatalogMachines } from '@/services/catalogStore';

const money = (value: number) => `${Math.round(value / 1000000).toLocaleString('fr-FR')}M FCFA`;

export default function Dashboard() {
  const machines = getCatalogMachines();
  const pieces = getCatalogPieces();
  const chiffresAffaires = mockChantiers.reduce((sum, c) => sum + (c.montantReel || c.montantEstime), 0);
  const locationRevenue = mockLocations.reduce((sum, l) => sum + l.montantTotal, 0);
  const cashTotal = mockFactures.filter(f => f.modePaiement === 'CASH' && f.montantPaye).reduce((sum, f) => sum + (f.montantPaye || 0), 0);
  const mobileMoneyTotal = mockFactures.filter(f => f.modePaiement === 'MOBILE_MONEY' && f.montantPaye).reduce((sum, f) => sum + (f.montantPaye || 0), 0);
  const impayesTotal = mockFactures.filter(f => f.statut === 'IMPAYEE').reduce((sum, f) => sum + f.montantTTC, 0);
  const chantiersActifs = mockChantiers.filter(c => c.statut === 'EN_COURS').length;
  const machinesLouees = mockLocations.filter(l => l.statut === 'SORTIE').length;
  const piecesRupture = pieces.filter(p => p.stock <= p.seuilAlerte).length;
  const publishedCount = machines.filter(item => item.publie).length + pieces.filter(item => item.publie).length;

  const chartData = [
    { name: 'Chantiers', value: chiffresAffaires / 1000000, fill: '#d97706' },
    { name: 'Locations', value: locationRevenue / 1000000, fill: '#1d4ed8' },
    { name: 'Ventes', value: publishedCount * 0.2, fill: '#047857' },
  ];

  const quickActions = [
    { href: '/admin/catalogue', label: 'Publier une machine', description: 'Ajouter une offre visible sur la vitrine', icon: Rocket, color: 'bg-amber-100 text-amber-700' },
    { href: '/admin/catalogue', label: 'Ajouter une pièce', description: 'Référence OEM et stock disponible', icon: PackagePlus, color: 'bg-emerald-100 text-emerald-700' },
    { href: '/admin/chantiers', label: 'Créer un chantier', description: 'Choisir le mode de facturation', icon: FilePlus2, color: 'bg-blue-100 text-blue-700' },
    { href: '/admin/facturation', label: 'Émettre une facture', description: 'Proforma, acompte ou définitive', icon: CircleDollarSign, color: 'bg-violet-100 text-violet-700' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5"><div><div className="flex items-center gap-2 text-amber-600 text-sm font-bold uppercase tracking-wider mb-2"><span className="w-2 h-2 rounded-full bg-amber-500" /> Centre de pilotage</div><h1 className="text-3xl font-bold tracking-tight text-slate-900">Bonjour, équipe 3BTRADING</h1><p className="text-slate-500 mt-2">Voici l'état de votre activité aujourd'hui. Les alertes opérationnelles sont regroupées ci-dessous.</p></div><div className="flex gap-3"><Link href="/admin/catalogue"><Button className="bg-slate-900 hover:bg-slate-800 text-white"><Plus className="h-4 w-4 mr-2" /> Nouvelle publication</Button></Link></div></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="p-5 border-none bg-slate-900 text-white shadow-xl"><div className="flex items-start justify-between"><div><p className="text-slate-400 text-sm">Chiffre d'affaires</p><p className="text-3xl font-bold mt-2">{money(chiffresAffaires + locationRevenue)}</p><p className="text-xs text-emerald-400 mt-2">+12,4% vs période précédente</p></div><CircleDollarSign className="h-8 w-8 text-amber-400" /></div></Card>
        <Card className="p-5 border-slate-200 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-slate-500 text-sm">Cash encaissé</p><p className="text-3xl font-bold mt-2 text-slate-900">{money(cashTotal)}</p><p className="text-xs text-slate-400 mt-2">Règlement espèces</p></div><CircleDollarSign className="h-8 w-8 text-blue-600" /></div></Card>
        <Card className="p-5 border-slate-200 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-slate-500 text-sm">Mobile Money</p><p className="text-3xl font-bold mt-2 text-slate-900">{money(mobileMoneyTotal)}</p><p className="text-xs text-slate-400 mt-2">Wave & Orange Money</p></div><CircleDollarSign className="h-8 w-8 text-emerald-600" /></div></Card>
        <Card className="p-5 border-red-100 bg-red-50 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-red-700 text-sm font-semibold">Impayés à relancer</p><p className="text-3xl font-bold mt-2 text-red-700">{money(impayesTotal)}</p><Link href="/admin/facturation" className="text-xs text-red-700 font-bold mt-2 inline-block hover:underline">Voir les relances <ArrowUpRight className="inline h-3 w-3" /></Link></div><AlertCircle className="h-8 w-8 text-red-600" /></div></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        <Card className="p-6 border-slate-200 shadow-sm"><div className="flex items-center justify-between mb-5"><div><h2 className="text-lg font-bold text-slate-900">Accès rapides</h2><p className="text-sm text-slate-500 mt-1">Les actions les plus utilisées par vos équipes.</p></div><Badge variant="secondary">Opérations</Badge></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{quickActions.map(action => { const Icon = action.icon; return <Link key={action.href + action.label} href={action.href} className="group flex gap-3 p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 transition-colors"><div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${action.color}`}><Icon className="h-5 w-5" /></div><div className="min-w-0"><div className="font-bold text-sm text-slate-900 group-hover:text-amber-700">{action.label}</div><div className="text-xs text-slate-500 mt-1 leading-relaxed">{action.description}</div></div><ArrowUpRight className="h-4 w-4 ml-auto text-slate-300 group-hover:text-amber-600 shrink-0" /></Link>; })}</div></Card>
        <Card className="p-6 border-slate-200 shadow-sm"><div className="flex items-center justify-between mb-5"><div><h2 className="text-lg font-bold text-slate-900">Vue opérationnelle</h2><p className="text-sm text-slate-500 mt-1">Capacité et alertes immédiates</p></div><Truck className="h-6 w-6 text-slate-400" /></div><div className="space-y-4"><div className="flex items-center justify-between p-3 rounded-lg bg-slate-50"><span className="flex items-center gap-2 text-sm text-slate-600"><CalendarDays className="h-4 w-4 text-blue-600" /> Chantiers actifs</span><strong>{chantiersActifs}</strong></div><div className="flex items-center justify-between p-3 rounded-lg bg-slate-50"><span className="flex items-center gap-2 text-sm text-slate-600"><Truck className="h-4 w-4 text-amber-600" /> Machines sorties</span><strong>{machinesLouees}</strong></div><div className={`flex items-center justify-between p-3 rounded-lg ${piecesRupture > 0 ? 'bg-red-50' : 'bg-emerald-50'}`}><span className="flex items-center gap-2 text-sm"><Boxes className={`h-4 w-4 ${piecesRupture > 0 ? 'text-red-600' : 'text-emerald-600'}`} /> Pièces sous le seuil</span><strong className={piecesRupture > 0 ? 'text-red-700' : 'text-emerald-700'}>{piecesRupture}</strong></div><div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50"><span className="flex items-center gap-2 text-sm text-emerald-800"><CheckCircle2 className="h-4 w-4" /> Produits visibles en ligne</span><strong className="text-emerald-800">{publishedCount}</strong></div></div></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6"><Card className="p-6 border-slate-200 shadow-sm"><div className="flex items-center justify-between mb-4"><div><h2 className="text-lg font-bold text-slate-900">Revenus par activité</h2><p className="text-sm text-slate-500 mt-1">Lecture indicative des flux gérés</p></div><Wrench className="h-6 w-6 text-slate-400" /></div><ResponsiveContainer width="100%" height={300}><BarChart data={chartData} barSize={46}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip formatter={(value) => `${typeof value === 'number' ? value.toFixed(1) : value}M FCFA`} /><Bar dataKey="value" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></Card><Card className="p-6 border-amber-100 bg-amber-50/50 shadow-sm"><h2 className="text-lg font-bold text-amber-950 mb-4">À traiter aujourd'hui</h2><div className="space-y-3">{piecesRupture > 0 && <div className="flex gap-3 p-3 rounded-lg bg-white border border-amber-100"><AlertCircle className="h-5 w-5 text-amber-600 shrink-0" /><div><div className="font-semibold text-sm text-slate-900">Stock critique</div><div className="text-xs text-slate-600 mt-1">{piecesRupture} référence(s) sous le seuil. <Link href="/admin/catalogue" className="text-amber-700 font-bold hover:underline">Réapprovisionner</Link></div></div></div>}{impayesTotal > 0 && <div className="flex gap-3 p-3 rounded-lg bg-white border border-red-100"><AlertCircle className="h-5 w-5 text-red-600 shrink-0" /><div><div className="font-semibold text-sm text-slate-900">Relances clients</div><div className="text-xs text-slate-600 mt-1">{mockFactures.filter(f => f.statut === 'IMPAYEE').length} facture(s) nécessitent un suivi. <Link href="/admin/facturation" className="text-red-700 font-bold hover:underline">Ouvrir Finance</Link></div></div></div>}{piecesRupture === 0 && impayesTotal === 0 && <div className="flex gap-3 p-3 rounded-lg bg-white border border-emerald-100"><CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" /><div><div className="font-semibold text-sm text-slate-900">Tout est sous contrôle</div><div className="text-xs text-slate-600 mt-1">Aucune alerte critique détectée.</div></div></div>}</div></Card></div>
    </div>
  );
}
