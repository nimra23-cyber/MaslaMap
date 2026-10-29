import { useMemo, useState } from 'react';
import { Search, LayoutGrid, List, Inbox, X } from 'lucide-react';
import type { CategoryId, ReportStatus, SortOrder, View } from '@/lib/types';
import { CATEGORIES, STATUS_ORDER } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { useReports } from '@/context/ReportsContext';
import { Card } from '@/components/ui/Card';
import { ReportCard, ReportListItem } from '@/components/ReportCard';

export function CommunityReportsPage() {
  const { t } = useLanguage();
  const { reports } = useReports();
  const [query, setQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<CategoryId | ''>('');
  const [filterCity, setFilterCity] = useState('');
  const [filterStatus, setFilterStatus] = useState<ReportStatus | ''>('');
  const [sort, setSort] = useState<SortOrder>('newest');
  const [view, setView] = useState<View>('list');

  const cities = useMemo(() => {
    const set = new Set(reports.map((r) => r.city).filter(Boolean));
    return Array.from(set).sort();
  }, [reports]);

  const filtered = useMemo(() => {
    let result = [...reports];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.neighbourhood.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    }
    if (filterCategory) result = result.filter((r) => r.category === filterCategory);
    if (filterCity) result = result.filter((r) => r.city === filterCity);
    if (filterStatus) result = result.filter((r) => r.status === filterStatus);

    result.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sort === 'newest' ? bTime - aTime : aTime - bTime;
    });

    return result;
  }, [reports, query, filterCategory, filterCity, filterStatus, sort]);

  const hasActiveFilters = query || filterCategory || filterCity || filterStatus;

  const clearFilters = () => {
    setQuery('');
    setFilterCategory('');
    setFilterCity('');
    setFilterStatus('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">{t('reports.title')}</h1>
        <p className="text-sm text-slate-600">{t('reports.subtitle')}</p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="search"
          placeholder={t('reports.search')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white pl-11 pr-10 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
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

        <select
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">{t('reports.filter.city')}: All</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as ReportStatus | '')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">{t('reports.filter.status')}: All</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>{t(`status.${s}`)}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOrder)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="newest">{t('reports.sort.newest')}</option>
          <option value="oldest">{t('reports.sort.oldest')}</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}

        <div className="ml-auto flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setView('cards')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium rounded-md transition-colors ${
              view === 'cards' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">{t('reports.view.cards')}</span>
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium rounded-md transition-colors ${
              view === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">{t('reports.view.list')}</span>
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500">
        {filtered.length} {t('reports.results')}
      </p>

      {/* Results */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <div className="flex justify-center">
            <Inbox className="h-10 w-10 text-slate-300" />
          </div>
          <h2 className="text-base font-semibold text-slate-700">{t('reports.empty.title')}</h2>
          <p className="text-sm text-slate-500">{t('reports.empty.body')}</p>
        </Card>
      ) : view === 'cards' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => (
            <ReportListItem key={r.id} report={r} />
          ))}
        </div>
      )}
    </div>
  );
}
