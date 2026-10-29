import { MapPin, Github, Heart } from 'lucide-react';
import { useRouter, type Route } from '@/context/RouterContext';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { navigate } = useRouter();
  const { t } = useLanguage();

  const links: { label: string; route: Route }[] = [
    { label: t('footer.about'), route: { name: 'how' } },
    { label: t('footer.privacy'), route: { name: 'privacy' } },
    { label: t('footer.responsibleAi'), route: { name: 'privacy' } },
    { label: t('footer.openSource'), route: { name: 'opensource' } },
  ];

  return (
    <footer className="mt-auto border-t border-slate-200 bg-[#FAF8F4]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-3 max-w-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white">
                <MapPin className="h-4 w-4" />
              </span>
              <span className="text-base font-bold text-slate-900">MaslaMap</span>
            </div>
            <p className="text-sm text-slate-600">{t('app.tagline')}</p>
            <p className="text-xs text-slate-500">{t('footer.disclaimer')}</p>
          </div>

          <nav className="flex flex-col gap-2" aria-label="Footer">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={() => navigate(link.route)}
                className="text-sm text-slate-600 hover:text-emerald-700 transition-colors text-left"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">{t('footer.rights')}</p>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <Github className="h-3.5 w-3.5" />
            Open source · MIT
            <Heart className="h-3.5 w-3.5 ml-1 text-emerald-600" />
          </p>
        </div>
      </div>
    </footer>
  );
}
