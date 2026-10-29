import { PenSquare, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from '@/context/RouterContext';
import { Button } from '@/components/ui/Button';
import { CategoryIcon } from '@/components/CategoryIcon';
import { CATEGORIES } from '@/lib/types';
import { useReports } from '@/context/ReportsContext';
import { ReportCard } from '@/components/ReportCard';

export function Hero() {
  const { t } = useLanguage();
  const { navigate } = useRouter();

  return (
    <section className="relative overflow-hidden bg-[#FAF8F4]">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(5, 150, 105, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(5, 150, 105, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
              <MapPin className="h-3.5 w-3.5" />
              {t('app.tagline')}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-[1.15] tracking-tight">
              {t('hero.title')}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" onClick={() => navigate({ name: 'report' })}>
                <PenSquare className="h-5 w-5" />
                {t('cta.report')}
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate({ name: 'reports' })}>
                {t('cta.explore')}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 flex items-start gap-1.5 max-w-md">
              <Sparkles className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
              {t('hero.disclaimer')}
            </p>
          </div>

          {/* Visual */}
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  const { t } = useLanguage();
  const { navigate } = useRouter();
  const { reports } = useReports();
  const demoReports = reports.filter((r) => r.isDemo).slice(0, 4);

  return (
    <div className="relative">
      {/* Map-style card */}
      <div className="relative rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(15, 23, 42, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(15, 23, 42, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating markers */}
        <div className="relative p-6 space-y-3" style={{ minHeight: '320px' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Community Reports</span>
            <span className="text-xs text-slate-400">{demoReports.length} demo</span>
          </div>

          {/* Marker pins positioned on the grid */}
          <div className="relative h-56">
            {demoReports.map((r, i) => {
              const positions = [
                { top: '15%', left: '20%' },
                { top: '35%', left: '60%' },
                { top: '60%', left: '35%' },
                { top: '75%', left: '70%' },
              ];
              const pos = positions[i % positions.length];
              const cat = CATEGORIES.find((c) => c.id === r.category)!;
              const colors: Record<string, string> = {
                roads_potholes: 'bg-amber-500',
                garbage_sanitation: 'bg-stone-500',
                water_drainage: 'bg-blue-500',
                streetlights: 'bg-yellow-400',
                public_spaces: 'bg-emerald-500',
                other: 'bg-slate-500',
              };
              return (
                <button
                  key={r.id}
                  onClick={() => navigate({ name: 'detail', id: r.id })}
                  className="group absolute flex flex-col items-center"
                  style={pos}
                  title={r.title}
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full ${colors[r.category]} text-white ring-2 ring-white shadow-md group-hover:scale-125 transition-transform duration-200`}>
                    <CategoryIcon icon={cat.icon} className="h-4 w-4" />
                  </span>
                  <span className="absolute top-full mt-1 px-2 py-0.5 text-xs font-medium text-slate-700 bg-white/90 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    {r.neighbourhood}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mini report preview cards */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            {demoReports.slice(0, 2).map((r) => (
              <button
                key={r.id}
                onClick={() => navigate({ name: 'detail', id: r.id })}
                className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <CategoryIcon icon={CATEGORIES.find((c) => c.id === r.category)!.icon} className="h-3 w-3 text-emerald-600" />
                  <span className="text-xs font-medium text-slate-600 truncate">{t(`cat.${r.category}`)}</span>
                </div>
                <p className="text-xs text-slate-700 font-medium line-clamp-1">{r.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{r.city}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative floating card */}
      <div className="absolute -bottom-3 -right-3 sm:-right-6 bg-white rounded-xl border border-slate-200 shadow-md p-3 hidden sm:block">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <MapPin className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold text-slate-700">Live demo</p>
            <p className="text-xs text-slate-400">Browser-local data</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CategoriesSection() {
  const { t } = useLanguage();
  const { navigate } = useRouter();

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('categories.title')}</h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">{t('categories.subtitle')}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate({ name: 'report' })}
              className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md transition-all duration-200"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 transition-colors">
                <CategoryIcon icon={cat.icon} className="h-6 w-6" />
              </span>
              <span className="text-sm font-medium text-slate-700 text-center group-hover:text-emerald-700 transition-colors">
                {t(`cat.${cat.id}`)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const { t } = useLanguage();

  const steps = [
    { num: '1', title: t('how.step1.title'), body: t('how.step1.body'), icon: 'pen' },
    { num: '2', title: t('how.step2.title'), body: t('how.step2.body'), icon: 'eye' },
    { num: '3', title: t('how.step3.title'), body: t('how.step3.body'), icon: 'chart' },
  ];

  return (
    <section className="py-16 bg-[#FAF8F4]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('how.title')}</h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">{t('how.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 h-full">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-white text-sm font-bold">
                    {step.num}
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.body}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 z-10 text-slate-300">
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
          <p className="text-sm text-emerald-800">
            <strong>{t('how.trust.title')}</strong> — {t('how.trust.body')}
          </p>
        </div>
      </div>
    </section>
  );
}

export function FeaturedReports() {
  const { t } = useLanguage();
  const { navigate } = useRouter();
  const { reports } = useReports();
  const featured = reports.slice(0, 6);

  if (featured.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('reports.title')}</h2>
            <p className="text-sm text-slate-600">{t('reports.subtitle')}</p>
          </div>
          <Button variant="outline" onClick={() => navigate({ name: 'reports' })}>
            {t('cta.explore')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
