import { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Image as ImageIcon, Mail, Phone, ShieldCheck, Truck, Wrench } from 'lucide-react';
import { Link, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import NotFound from '@/pages/NotFound';
import { getCatalogMachineById, getCatalogPieceById, type CatalogMachine, type CatalogPiece } from '@/services/catalogStore';
import { trpc } from '@/lib/trpc';

const formatMoney = (value?: number) => value ? `${value.toLocaleString('fr-FR')} FCFA` : 'Sur devis';

function MediaPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-[360px] items-center justify-center bg-slate-950 text-center text-slate-400">
      <div>
        <ImageIcon className="mx-auto mb-3 h-12 w-12 text-amber-500" />
        <p className="text-sm">{label}</p>
        <p className="mt-1 text-xs text-slate-500">Photos disponibles sur demande</p>
      </div>
    </div>
  );
}

export default function CatalogueDetail() {
  const [, params] = useRoute('/catalogue/:type/:id');
  const type = params?.type === 'piece' ? 'piece' : 'machine';
  const productId = params?.id ?? '';
  const queryInput = useMemo(() => ({ id: productId }), [productId]);
  const remoteMachineQuery = trpc.catalogue.getPublishedMachineById.useQuery(queryInput, { enabled: type === 'machine' && Boolean(productId), retry: false });
  const remotePieceQuery = trpc.catalogue.getPublishedPieceById.useQuery(queryInput, { enabled: type === 'piece' && Boolean(productId), retry: false });
  const fallbackItem = useMemo<CatalogMachine | CatalogPiece | undefined>(() => {
    if (!productId) return undefined;
    return type === 'machine' ? getCatalogMachineById(productId) : getCatalogPieceById(productId);
  }, [productId, type]);
  const remoteItem = type === 'machine' ? remoteMachineQuery.data : remotePieceQuery.data;
  const item = remoteItem ?? ((remoteMachineQuery.isError || remotePieceQuery.isError) ? fallbackItem : undefined);
  const isLoading = remoteMachineQuery.isLoading || remotePieceQuery.isLoading;
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) return <div className="min-h-screen bg-slate-50" />;
  if (!item || !item.publie) return <NotFound />;

  const isMachine = type === 'machine';
  const images = item.imagesGalerie ?? [];
  const activeImageUrl = images[activeImage];
  const specifications = Object.entries(item.specifications ?? {});
  const requestType = isMachine ? ((item as CatalogMachine).enVente ? 'ACHAT_MACHINE' : 'LOCATION') : 'PIECES';
  const requestHref = `/?typeDemande=${requestType}&produit=${encodeURIComponent(item.nom)}#contact`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main>
        <section className="bg-slate-950 text-white">
          <div className="container py-5">
            <Link href="/#catalogue" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-amber-400">
              <ArrowLeft className="h-4 w-4" /> Retour au catalogue
            </Link>
          </div>
        </section>

        <section className="container py-10 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-xl">
                {activeImageUrl ? (
                  <img src={activeImageUrl} alt={item.nom} className="h-[360px] w-full object-cover md:h-[520px]" />
                ) : (
                  <MediaPlaceholder label={`Aucune photo publiée pour ${item.nom}`} />
                )}
              </div>
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
                  {images.map((url, index) => (
                    <button
                      key={`${url}-${index}`}
                      type="button"
                      aria-label={`Afficher la photo ${index + 1}`}
                      onClick={() => setActiveImage(index)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 ${activeImage === index ? 'border-amber-500' : 'border-transparent'}`}
                    >
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
                <span>{isMachine ? 'Machine / Engin' : 'Pièce détachée OEM'}</span>
                <span className="text-slate-300">•</span>
                <span>{isMachine ? (item as CatalogMachine).marque : (item as CatalogPiece).marque}</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">{item.nom}</h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">{item.description}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                {isMachine && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" /> {(item as CatalogMachine).statut}
                  </span>
                )}
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
                  <ShieldCheck className="h-4 w-4" /> Publication vérifiée 3BTRADING
                </span>
              </div>

              <Card className="mt-8 border-none bg-white p-6 shadow-lg">
                <div className="grid gap-4 sm:grid-cols-2">
                  {isMachine ? (
                    <>
                      <div><p className="text-sm text-slate-500">Location journalière</p><p className="mt-1 text-xl font-bold text-slate-950">{formatMoney((item as CatalogMachine).tarifJournalier)}</p></div>
                      <div><p className="text-sm text-slate-500">Tarif dégressif</p><p className="mt-1 text-xl font-bold text-slate-950">{formatMoney((item as CatalogMachine).tarifDegressif)}</p></div>
                      <div><p className="text-sm text-slate-500">Tarif par rotation</p><p className="mt-1 text-xl font-bold text-slate-950">{formatMoney((item as CatalogMachine).tarifRotation)}</p></div>
                      <div><p className="text-sm text-slate-500">Vente</p><p className="mt-1 text-xl font-bold text-emerald-700">{(item as CatalogMachine).enVente ? formatMoney((item as CatalogMachine).prixVente) : 'Non proposée'}</p></div>
                    </>
                  ) : (
                    <>
                      <div><p className="text-sm text-slate-500">Référence OEM</p><p className="mt-1 text-xl font-bold text-slate-950">{(item as CatalogPiece).referenceOEM}</p></div>
                      <div><p className="text-sm text-slate-500">Prix unitaire</p><p className="mt-1 text-xl font-bold text-slate-950">{formatMoney((item as CatalogPiece).prixUnitaire)}</p></div>
                      <div><p className="text-sm text-slate-500">Stock disponible</p><p className="mt-1 text-xl font-bold text-emerald-700">{(item as CatalogPiece).stock} unité(s)</p></div>
                      <div><p className="text-sm text-slate-500">Famille</p><p className="mt-1 text-xl font-bold text-slate-950">{(item as CatalogPiece).famille}</p></div>
                    </>
                  )}
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link href={requestHref} className="inline-flex">
                    <Button className="w-full bg-amber-600 text-white hover:bg-amber-700"><Mail className="mr-2 h-4 w-4" /> {isMachine ? 'Réserver cet engin' : 'Demander cette pièce'}</Button>
                  </Link>
                  <a href="tel:+2250700000033" className="inline-flex">
                    <Button variant="outline" className="w-full"><Phone className="mr-2 h-4 w-4" /> Appeler un conseiller</Button>
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-12">
          <div className="container grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-600"><Wrench className="h-4 w-4" /> Fiche technique</div>
              <h2 className="text-3xl font-bold text-slate-950">Les informations à connaître</h2>
              <p className="mt-3 max-w-xl leading-relaxed text-slate-600">Notre équipe commerciale peut compléter cette fiche avec les conditions d'utilisation, la disponibilité et les modalités de réservation adaptées à votre chantier.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {specifications.length > 0 ? specifications.map(([label, value]) => (
                <div key={label} className="border-l-4 border-amber-500 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
                  <p className="mt-1 font-semibold text-slate-950">{value}</p>
                </div>
              )) : (
                <div className="sm:col-span-2 border-l-4 border-amber-500 bg-amber-50 p-5 text-slate-700">Les spécifications détaillées seront confirmées par un conseiller selon votre besoin.</div>
              )}
            </div>
          </div>
        </section>

        {isMachine && (
          <section className="container py-12">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex gap-3 rounded-xl bg-slate-950 p-5 text-white"><Truck className="mt-1 h-5 w-5 text-amber-400" /><div><p className="font-bold">Clés en main</p><p className="mt-1 text-sm text-slate-300">Chauffeur et carburant inclus.</p></div></div>
              <div className="flex gap-3 rounded-xl bg-white p-5 shadow-sm"><ShieldCheck className="mt-1 h-5 w-5 text-emerald-600" /><div><p className="font-bold">Sortie sécurisée</p><p className="mt-1 text-sm text-slate-600">Paiement intégral ou entreprise partenaire.</p></div></div>
              <div className="flex gap-3 rounded-xl bg-white p-5 shadow-sm"><Wrench className="mt-1 h-5 w-5 text-amber-600" /><div><p className="font-bold">Support atelier</p><p className="mt-1 text-sm text-slate-600">Une équipe technique suit le matériel.</p></div></div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
