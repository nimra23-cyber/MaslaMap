import { useState } from 'react';
import { MapPin, Menu, X, Globe, PenSquare } from 'lucide-react';
import { useRouter, type Route } from '@/context/RouterContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';
import type { Lang } from '@/lib/types';

export function Navbar() {
  const { route, navigate } = useRouter();
  const { t, lang, setLang } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { label: string; route: Route }[] = [
    { label: t('nav.howItWorks'), route: { name: 'how' } },
    { label: t('nav.reports'), route: { name: 'reports' } },
    { label: t('nav.map'), route: { name: 'map' } },
    { label: t('nav.assist'), route: { name: 'assist' } },
  ];

  const isActive = (r: Route) => r.name === route.name;

  const handleNav = (r: Route) => {
    navigate(r);
    setMobileOpen(false);
  };

  const toggleLang = () => {
    const next: Lang = lang === 'en' ? 'ur' : 'en';
    setLang(next);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F4]/90 backdrop-blur-md border-b border-slate-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => handleNav({ name: 'home' })}
            className="flex items-center gap-2 flex-shrink-0"
            aria-label="MaslaMap home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-white">
              <MapPin className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold text-slate-900 tracking-tight">MaslaMap</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNav(item.route)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.route)
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Switch language"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{lang === 'en' ? 'EN' : 'UR'}</span>
            </button>
            <Button
              size="sm"
              onClick={() => handleNav({ name: 'report' })}
              className="hidden sm:inline-flex"
            >
              <PenSquare className="h-4 w-4" />
              {t('nav.report')}
            </Button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              aria-label={t('nav.menu')}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-slate-200 pt-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNav(item.route)}
                className={`block w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.route)
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            <Button
              size="md"
              onClick={() => handleNav({ name: 'report' })}
              className="w-full mt-2"
            >
              <PenSquare className="h-4 w-4" />
              {t('nav.report')}
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}
