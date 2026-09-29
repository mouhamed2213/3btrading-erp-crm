import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Hammer, Truck, ShoppingCart, Wrench, FileText, LogOut, PackageOpen, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname: location } = useLocation();

  const menuGroups = [
    {
      label: 'Pilotage',
      items: [{ label: 'Dashboard', href: '/admin', icon: Home }],
    },
    {
      label: 'Opérations',
      items: [
        { label: 'Chantiers', href: '/admin/chantiers', icon: Hammer },
        { label: 'Locations', href: '/admin/locations', icon: Truck },
        { label: 'Atelier mécanique', href: '/admin/atelier', icon: Wrench },
      ],
    },
    {
      label: 'Commerce',
      items: [
        { label: 'Catalogue & Publication', href: '/admin/catalogue', icon: PackageOpen },
        { label: 'Stock pièces', href: '/admin/boutique', icon: ShoppingCart },
        { label: 'Facturation & Finance', href: '/admin/facturation', icon: FileText },
      ],
    },
  ];

  const isActive = (href: string) => href === '/admin' ? location === href : location.startsWith(href);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {mobileOpen && <button aria-label="Fermer le menu" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" />}
      <aside className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${sidebarOpen ? 'lg:w-72' : 'lg:w-20'} fixed lg:sticky top-0 z-40 h-screen border-r border-slate-200 bg-white transition-all duration-300 flex flex-col shadow-xl lg:shadow-none`}>
        <div className="h-20 border-b border-slate-200 flex items-center justify-between px-4">
          <Link to="/admin" className="flex items-center gap-3 min-w-0">
            <img src="/files/3btrading/logo.png" alt="3BTRADING" className="h-9 w-9 object-contain shrink-0" />
            {sidebarOpen && <div className="min-w-0"><div className="font-extrabold tracking-tight text-slate-900">3BTRADING</div><div className="text-[10px] uppercase tracking-[0.2em] text-amber-600 font-bold">Business Console</div></div>}
          </Link>
          <button onClick={() => setSidebarOpen(value => !value)} className="hidden lg:block p-2 rounded-lg hover:bg-slate-100 text-slate-500" aria-label="Rétracter le menu">{sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500" aria-label="Fermer le menu"><X className="h-5 w-5" /></button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3">
          {menuGroups.map(group => (
            <div key={group.label} className="mb-7">
              {sidebarOpen && <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">{group.label}</div>}
              <div className="space-y-1">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${active ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`} title={!sidebarOpen ? item.label : undefined}><Icon className="h-5 w-5 shrink-0" />{sidebarOpen && <span className="text-sm font-semibold truncate">{item.label}</span>}{sidebarOpen && active && <ChevronRight className="h-4 w-4 ml-auto opacity-70" />}</Link>;
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4 space-y-3">
          {sidebarOpen && <div className="rounded-xl bg-amber-50 border border-amber-100 p-3"><div className="text-xs font-bold text-amber-800">Conseil du jour</div><div className="text-xs text-amber-700 mt-1 leading-relaxed">Publiez les nouvelles machines depuis Catalogue & Publication pour les afficher sur la vitrine.</div></div>}
          <Link to="/" className="block"><Button variant="outline" className="w-full justify-start border-slate-200"><LogOut className="h-4 w-4 mr-2" />{sidebarOpen && <span>Retour au site</span>}</Button></Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100" aria-label="Ouvrir le menu"><Menu className="h-5 w-5" /></button><div><p className="text-xs font-bold uppercase tracking-widest text-amber-600">Console de gestion</p><p className="text-sm font-semibold text-slate-700">{location === '/admin' ? 'Vue d’ensemble' : '3BTRADING ERP / CRM'}</p></div></div>
          <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-slate-900">Voir la vitrine <ChevronRight className="inline h-4 w-4 ml-1" /></Link>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">{children}</main>
      </div>
    </div>
  );
}
