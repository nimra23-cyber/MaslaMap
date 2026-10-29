import { useMemo, useState } from 'react';
import { Map as MapIcon, List, MapPin, Filter } from 'lucide-react';
import type { CategoryId, ReportRecord, View } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from '@/context/RouterContext';
import { useReports } from '@/context/ReportsContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '@/components/StatusBadge';
import { CategoryIcon } from '@/components/CategoryIcon';
import { ReportCard } from '@/components/ReportCard';

function groupByLocation(reports: ReportRecord[]): Map<string, ReportRecord[]> {
  const map = new Map<string, ReportRecord[]>();
  for (const r of reports) {
    const key = r.city && r.neighbourhood ? `${r.city} — ${r.neighbourhood}` : r.city || 'Unknown location';
    const arr = map.get(key) ?? [];
    arr.push(r);
    map.set(key, arr);
  }
  return map;
}

// Deterministic pseudo-position based on string hash, for a grid-style explorer
function gridPos(key: string): { row: number; col: number } {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0;
  }
  const row = Math.abs(hash % 6);
  const col = Math.abs((hash >> 4) % 10);
  return { row, col };
}

export function MapExplorer() {
  const { t } = useLanguage();
  const { navigate } = useRouter();
  const { reports } = useReports();
  const [view, setView] = useState<View>('map');
  const [filterCategory, setFilterCategory] = useState<CategoryId | ''>('');

  const filtered = useMemo(() => {
    if (!filterCategory) return reports;
    return reports.filter((r) => r.category === filterCategory);
  }, [reports, filterCategory]);

  const grouped = useMemo(() => groupByLocation(filtered), [filtered]);

  const catColor: Record<CategoryId, string> = {
    roads_potholes: 'bg-amber-500',
    garbage_sanitation: 'bg-stone-500',
    water_drainage: 'bg-blue-500',
    streetlights: 'bg-yellow-400',
    public_spaces: 'bg-emerald-500',
    other: 'bg-slate-500',
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">{t('map.title')}</h1>
        <p className="text-sm text-slate-600">{t('map.subtitle')}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as CategoryId | '')}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">{t('reports.filter.category')}: All</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{t(`cat.${c.id}`)}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setView('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              view === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <MapIcon className="h-4 w-4" />
            {t('map.view.map')}
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              view === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <List className="h-4 w-4" />
            {t('map.view.list')}
          </button>
        </div>
      </div>

      {/* Map view */}
      {view === 'map' && (
        <div className="space-y-4">
          <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-[#F5F7F5]" style={{ minHeight: '400px' }}>
            {/* Grid pattern background */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(15, 23, 42, 0.06) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(15, 23, 42, 0.06) 1px, transparent 1px)
                `,
                backgroundSize: '48px 48px',
              }}
            />
            {/* Subtle diagonal lines */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `repeating-linear-gradient(135deg, transparent, transparent 30px, rgba(5, 150, 105, 0.04) 30px, rgba(5, 150, 105, 0.04) 60px)`,
              }}
            />

            {/* Markers */}
            <div className="relative grid grid-cols-10 gap-0 p-4" style={{ minHeight: '400px' }}>
              {Array.from(grouped.entries()).map(([key, group]) => {
                const { row, col } = gridPos(key);
                const topPct = (row + 0.5) * (100 / 6);
                const leftPct = (col + 0.5) * (100 / 10);
                const firstReport = group[0];
                return (
                  <div
                    key={key}
                    className="absolute"
                    style={{ top: `${topPct}%`, left: `${leftPct}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <button
                      onClick={() => navigate({ name: 'detail', id: firstReport.id })}
                      className="group relative flex flex-col items-center"
                      title={`${key} (${group.length} reports)`}
                    >
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full ${catColor[firstReport.category]} text-white text-xs font-bold ring-2 ring-white shadow-md group-hover:scale-110 transition-transform`}>
                        {group.length}
                      </span>
                      <span className="absolute top-full mt-1 px-2 py-0.5 text-xs font-medium text-slate-700 bg-white/90 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        {key}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-slate-500">{t('reports.empty.body')}</p>
              </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur rounded-lg border border-slate-200 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-slate-700 mb-1">Categories</p>
              {CATEGORIES.map((c) => (
                <div key={c.id} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${catColor[c.id]}`} />
                  <span className="text-xs text-slate-600">{t(`cat.${c.id}`)}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {t('map.disclaimer')}
          </p>

          {/* Location-grouped list below map */}
          <div className="space-y-4">
            {Array.from(grouped.entries()).map(([key, group]) => (
              <div key={key} className="space-y-2">
                <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  {key}
                  <Badge className="bg-slate-100 text-slate-600 border-slate-200">{group.length}</Badge>
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.map((r) => (
                    <ReportCard key={r.id} report={r} compact />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card className="p-12 text-center space-y-2">
              <p className="text-sm font-medium text-slate-700">{t('reports.empty.title')}</p>
              <p className="text-sm text-slate-500">{t('reports.empty.body')}</p>
            </Card>
          ) : (
            Array.from(grouped.entries()).map(([key, group]) => (
              <div key={key} className="space-y-2">
                <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 sticky top-16 bg-[#FAF8F4] py-2 z-10">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  {key}
                  <Badge className="bg-slate-100 text-slate-600 border-slate-200">{group.length}</Badge>
                </h2>
                {group.map((r) => (
                  <Card key={r.id} as="article" onClick={() => navigate({ name: 'detail', id: r.id })} className="group p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                        <CategoryIcon icon={CATEGORIES.find(c => c.id === r.category)!.icon} className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">{r.title}</h3>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={r.status} />
                          {r.isDemo && <Badge className="bg-slate-100 text-slate-600 border-slate-200">{t('reports.demo.label')}</Badge>}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
