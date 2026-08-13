import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Briefcase, Truck, Wrench, ArrowRight, CheckCircle2, ShieldCheck, Phone, Mail, MapPin, ChevronRight, Star, Image as ImageIcon } from 'lucide-react';
import { getPublishedMachines, getPublishedPieces } from '@/services/catalogStore';
import { Link } from 'wouter';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

export default function Home() {
  const [contactForm, setContactForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    typeDemande: 'TRAVAUX',
    message: '',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const product = params.get('produit');
    const type = params.get('typeDemande');
    if (!product && !type) return;
    setContactForm(current => ({
      ...current,
      typeDemande: type || current.typeDemande,
      message: product ? `Bonjour, je souhaite obtenir des informations sur : ${product}.` : current.message,
    }));
  }, []);

  const [activeTab, setActiveTab] = useState<'machines' | 'pieces'>('machines');
  const [selectedCategory, setSelectedCategory] = useState<string>('TOUS');

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.nom || !contactForm.telephone) {
      toast.error('Veuillez remplir votre nom et votre numéro de téléphone.');
      return;
    }
    toast.success('Votre demande a bien été transmise à notre équipe commerciale ! Nous vous recontacterons sous 24h.');
    setContactForm({ nom: '', email: '', telephone: '', typeDemande: 'TRAVAUX', message: '' });
  };

  const remoteMachinesQuery = trpc.catalogue.listPublishedMachines.useQuery(undefined, { retry: false });
  const remotePiecesQuery = trpc.catalogue.listPublishedPieces.useQuery(undefined, { retry: false });
  const publishedMachines = remoteMachinesQuery.data ?? getPublishedMachines();
  const publishedPieces = remotePiecesQuery.data ?? getPublishedPieces();
  const filteredMachines = selectedCategory === 'TOUS' 
    ? publishedMachines 
    : publishedMachines.filter(m => m.type.toUpperCase() === selectedCategory.toUpperCase());

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header />

      {/* HERO SECTION - HAUTE QUALITÉ VISUELLE */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-40">
          <img
            src="/manus-storage/3btrading-hero-bg_8a60d44e.png"
            alt="Chantier de Travaux Publics 3BTRADING"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="container relative z-10 py-24 md:py-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold mb-6">
              <ShieldCheck className="h-4 w-4" /> Travaux Publics · Engins · Pièces OEM
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Terrassement, location clés en main et <span className="text-amber-500">pièces OEM</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
              Expertise globale en terrassement, location d'engins clés en main (chauffeur & carburant inclus) et distribution de pièces d'origine certifiée OEM.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact">
                <Button size="lg" className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-4 shadow-lg shadow-amber-600/20">
                  Demander un Devis Gratuit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a href="#catalogue">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-slate-700 bg-slate-900/50 text-white hover:bg-slate-800 hover:text-white px-8 py-4 backdrop-blur-sm"
                >
                  Explorer le Catalogue
                </Button>
              </a>
              <Link href="/admin" className="inline-flex">
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 px-6 py-4"
                >
                  Espace Administrateur
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-16 pt-12 border-t border-slate-800/80">
              <div>
                <div className="text-3xl font-bold text-amber-500">+20 Ans</div>
                <div className="text-sm text-slate-400">D'expérience terrain</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-500">100% Clés en Main</div>
                <div className="text-sm text-slate-400">Chauffeur & Carburant inclus</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-500">24/7</div>
                <div className="text-sm text-slate-400">Support & Atelier mécanique</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 PILIERS MÉTIER */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Une chaîne métier pensée pour vos chantiers
            </h2>
            <p className="text-lg text-slate-600">
              Du terrassement à la pièce de rechange, 3BTRADING vous accompagne avec des engins disponibles, des équipes terrain et une gestion commerciale structurée.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pilier 1 */}
            <Card className="p-8 border-none shadow-xl bg-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full transition-transform group-hover:scale-110" />
              <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-amber-600/30">
                <Briefcase className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Travaux & Chantiers</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Terrassement de masse, décapage, fouilles profondes, tranchées, remblayage, assainissement et fondations. 4 modes de calcul adaptés : Forfait, m³, Heures et Jours.
              </p>
              <ul className="space-y-2 mb-8 text-sm text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-600" /> Polyvalence ultra-poussée</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-600" /> Suivi de chantier rigoureux</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-600" /> Équipe d'ingénieurs dédiée</li>
              </ul>
              <a href="#contact" className="inline-flex items-center text-amber-600 font-semibold hover:text-amber-700">
                Lancer un chantier <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </Card>

            {/* Pilier 2 */}
            <Card className="p-8 border-none shadow-xl bg-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full transition-transform group-hover:scale-110" />
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-blue-600/30">
                <Truck className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Location Clés en Main</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Location de machines avec chauffeur et carburant toujours inclus. Tarification journalière, par rotation (camions-bennes) ou dégressive automatique (&gt; 7 jours).
              </p>
              <ul className="space-y-2 mb-8 text-sm text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-600" /> Zéro souci de maintenance</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-600" /> Tarifs dégressifs transparents</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-600" /> Partenaires : paiement à terme</li>
              </ul>
              <a href="#catalogue" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700">
                Voir les engins dispo <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </Card>

            {/* Pilier 3 */}
            <Card className="p-8 border-none shadow-xl bg-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full transition-transform group-hover:scale-110" />
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-emerald-600/30">
                <Wrench className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Vente & Pièces OEM</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Vente de machines lourdes (pelles, chargeurs, bulldozers, compacteurs, camions) et catalogue de pièces d'origine avec recherche multicritère et références OEM.
              </p>
              <ul className="space-y-2 mb-8 text-sm text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Recherche OEM multicritère</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Atelier mécanique intégré</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> SAV & maintenance garantie</li>
              </ul>
              <a href="#catalogue" className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700">
                Explorer le stock <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </Card>
          </div>
        </div>
      </section>

      {/* CATALOGUE PUBLIC DYNAMIQUE */}
      <section id="catalogue" className="py-24 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
                Catalogue Public & Équipements
              </h2>
              <p className="text-lg text-slate-600">
                Consultez notre flotte disponible à la location ou à l'achat immédiat.
              </p>
            </div>
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('machines')}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'machines' ? 'bg-amber-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Machines & Engins ({publishedMachines.length})
              </button>
              <button
                onClick={() => setActiveTab('pieces')}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'pieces' ? 'bg-amber-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pièces Détachées OEM ({publishedPieces.length})
              </button>
            </div>
          </div>

          {activeTab === 'machines' ? (
            <div>
              <div className="flex flex-wrap gap-2 mb-8">
                {['TOUS', 'Pelle', 'Camion', 'Chargeur', 'Bulldozer', 'Compacteur'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredMachines.map(machine => (
                  <Card key={machine.id} className="overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                      {machine.imagesGalerie?.[0] ? <img src={machine.imagesGalerie[0]} alt={machine.nom} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-500"><ImageIcon className="h-9 w-9 text-amber-500" /></div>}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                      <div className="absolute bottom-4 left-5 text-xs font-bold uppercase tracking-wider text-amber-400">{machine.marque}</div>
                    </div>
                    <div className="bg-slate-900 p-6 text-white relative">
                      <div className="absolute top-4 right-4 bg-amber-500/20 border border-amber-500/40 text-amber-400 px-3 py-1 rounded-full text-xs font-bold">
                        {machine.statut}
                      </div>
                      <h3 className="text-xl font-bold mt-1 mb-2">{machine.nom}</h3>
                      <p className="text-sm text-slate-300">Type : {machine.type} {machine.modele ? `(${machine.modele})` : ''}</p>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Tarif Journalier :</span>
                        <span className="font-bold text-slate-900">{machine.tarifJournalier.toLocaleString()} FCFA</span>
                      </div>
                      {machine.tarifRotation && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">Tarif Rotation :</span>
                          <span className="font-bold text-slate-900">{machine.tarifRotation.toLocaleString()} FCFA</span>
                        </div>
                      )}
                      {machine.prixVente && machine.enVente && (
                        <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100">
                          <span className="text-emerald-600 font-medium">Prix de Vente :</span>
                          <span className="font-bold text-emerald-700">{machine.prixVente.toLocaleString()} FCFA</span>
                        </div>
                      )}
                      <div className="pt-4 grid grid-cols-2 gap-2">
                        <Link href={`/catalogue/machine/${machine.id}`} className="inline-flex items-center justify-center rounded-md border border-slate-200 px-3 py-2 text-center text-xs font-bold text-slate-700 transition-colors hover:border-amber-500 hover:text-amber-700">
                          Voir les détails
                        </Link>
                        <Link href="/#contact" className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-center text-xs font-bold text-white transition-colors hover:bg-slate-800">
                          Réserver / Acheter
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {publishedPieces.map(piece => (
                <Card key={piece.id} className="overflow-hidden border border-slate-200 shadow-sm">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                    {piece.imagesGalerie?.[0] ? <img src={piece.imagesGalerie[0]} alt={piece.nom} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-500"><ImageIcon className="h-8 w-8 text-amber-500" /></div>}
                  </div>
                  <div className="p-6">
                  <div className="text-xs font-bold text-amber-600 mb-1">{piece.marque} - Famille: {piece.famille}</div>
                  <h4 className="font-bold text-lg text-slate-900 mb-2">{piece.nom}</h4>
                  <p className="text-xs text-slate-500 mb-4">Réf: {piece.reference}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-semibold text-slate-700">{piece.prixUnitaire.toLocaleString()} FCFA</span>
                    <span className={`text-xs px-2 py-1 rounded font-bold ${piece.stock > piece.seuilAlerte ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      Stock: {piece.stock}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/catalogue/piece/${piece.id}`} className="inline-flex items-center justify-center rounded-md border border-slate-200 px-2 py-2 text-center text-xs font-bold text-slate-700 hover:border-amber-500 hover:text-amber-700">Voir les détails</Link>
                    <Link href="/#contact" className="inline-flex items-center justify-center rounded-md bg-slate-900 px-2 py-2 text-center text-xs font-bold text-white hover:bg-slate-800">Commander</Link>
                  </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION CONTACT & DEVIS SIMPLIFIÉ */}
      <section id="contact" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-amber-500 font-bold uppercase tracking-wider text-sm">Contactez Nos Experts</span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-2 mb-6">
                Besoin d'un Devis ou d'une Intervention ?
              </h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Remplissez ce formulaire rapide. Notre service commercial et technique vous répondra dans les plus brefs délais avec une cotation précise (Forfait, Cubage, Journalier ou Rotation).
              </p>

              <div className="space-y-6 text-slate-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Téléphone Direct</div>
                    <div className="font-bold text-white text-lg">+225 07 00 00 00 33</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Email Professionnel</div>
                    <div className="font-bold text-white text-lg">contact@3btrading-tp.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Siège & Dépôt Principal</div>
                    <div className="font-bold text-white text-lg">Zone Industrielle, Abidjan, Côte d'Ivoire</div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-8 bg-slate-950 border-slate-800 shadow-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">Formulaire de Demande</h3>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <Label className="text-slate-300">Nom complet ou Entreprise</Label>
                  <Input
                    name="nom"
                    value={contactForm.nom}
                    onChange={handleContactChange}
                    placeholder="Ex: SARL Bâtisseurs Unis"
                    className="bg-slate-900 border-slate-700 text-white mt-1.5"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Téléphone</Label>
                    <Input
                      name="telephone"
                      value={contactForm.telephone}
                      onChange={handleContactChange}
                      placeholder="+225 ..."
                      className="bg-slate-900 border-slate-700 text-white mt-1.5"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Email</Label>
                    <Input
                      name="email"
                      type="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      placeholder="contact@domaine.com"
                      className="bg-slate-900 border-slate-700 text-white mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300">Type de Prestation / Demande</Label>
                  <select
                    name="typeDemande"
                    value={contactForm.typeDemande}
                    onChange={handleContactChange}
                    className="w-full mt-1.5 p-3 rounded-md bg-slate-900 border border-slate-700 text-white text-sm"
                  >
                    <option value="TRAVAUX">Chantier / Travaux Publics</option>
                    <option value="LOCATION">Location d'engin (Clés en main)</option>
                    <option value="ACHAT_MACHINE">Achat de machine lourde</option>
                    <option value="PIECES">Achat de pièces détachées OEM</option>
                    <option value="ATELIER">Intervention Atelier / SAV</option>
                  </select>
                </div>

                <div>
                  <Label className="text-slate-300">Détails de votre projet / Message</Label>
                  <Textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    rows={4}
                    placeholder="Précisez les volumes, durées, références de pièces ou types d'engins souhaités..."
                    className="bg-slate-900 border-slate-700 text-white mt-1.5"
                  />
                </div>

                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 shadow-lg">
                  Envoyer la Demande
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center font-bold justify-center shadow-lg shadow-amber-600/30">
              3B
            </div>
            <span className="text-white font-bold text-lg tracking-tight">3BTRADING ERP</span>
          </div>
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} 3BTRADING. Tous droits réservés. Spécialiste Travaux Publics, Location & Pièces Lourdes.
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/admin" className="text-amber-500 hover:underline">Administration</Link>
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#catalogue" className="hover:text-white">Catalogue</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
