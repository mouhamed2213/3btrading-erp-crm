import { Link } from 'wouter';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const links = [
  { label: 'Accueil', href: '/' },
  { label: 'Nos expertises', href: '/#services' },
  { label: 'Catalogue', href: '/#catalogue' },
  { label: 'Contact', href: '/#contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="container flex h-[76px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl shrink-0">
          <img src="/manus-storage/3btrading-logo_4274decd.png" alt="3BTRADING" className="h-10 w-10 object-contain" />
          <div className="hidden sm:block"><div className="text-slate-900 tracking-tight">3BTRADING</div><div className="text-[9px] tracking-[0.18em] uppercase font-bold text-amber-600 -mt-1">Travaux · Location · Pièces</div></div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map(link => <Link key={link.href} href={link.href} className="text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors">{link.label}</Link>)}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/admin" className="hidden sm:inline-flex"><Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/10">Espace Admin <ArrowUpRight className="h-4 w-4 ml-1" /></Button></Link>
          <button onClick={() => setMobileMenuOpen(value => !value)} className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-700" aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}>{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>

      {mobileMenuOpen && <div className="md:hidden border-t border-slate-200 bg-white shadow-xl"><nav className="container py-5 flex flex-col gap-1">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="px-3 py-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100">{link.label}</Link>)}<Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="mt-3"><Button className="w-full bg-slate-900 text-white">Espace Administrateur</Button></Link></nav></div>}
    </header>
  );
}
