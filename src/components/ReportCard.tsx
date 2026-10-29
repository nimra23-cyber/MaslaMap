import { MapPin, Calendar, Image as ImageIcon, ThumbsUp, AlertTriangle } from 'lucide-react';
import type { ReportRecord } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from '@/context/RouterContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '@/components/StatusBadge';
import { CategoryIcon } from '@/components/CategoryIcon';
import { CATEGORIES } from '@/lib/types';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

interface ReportCardProps {
  report: ReportRecord;
  compact?: boolean;
}

export function ReportCard({ report, compact = false }: ReportCardProps) {
  const { t } = useLanguage();
  const { navigate } = useRouter();
  const cat = CATEGORIES.find((c) => c.id === report.category)!;

  const handleClick = () => navigate({ name: 'detail', id: report.id });

  return (
    <Card as="article" onClick={handleClick} className="overflow-hidden group">
      {report.imageDataUrl && !compact && (
        <div className="relative h-40 bg-slate-100 overflow-hidden">
          <img
            src={report.imageDataUrl}
            alt={report.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
              <CategoryIcon icon={cat.icon} className="h-3.5 w-3.5" />
              {t(`cat.${report.category}`)}
            </Badge>
            {report.isDemo && (
              <Badge className="bg-slate-100 text-slate-600 border-slate-200">
                {t('reports.demo.label')}
              </Badge>
            )}
            {report.flagged && (
              <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                <AlertTriangle className="h-3 w-3" />
                Flagged
              </Badge>
            )}
          </div>
          <StatusBadge status={report.status} />
        </div>

        <h3 className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
          {report.title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {report.city ? `${report.city}, ${report.neighbourhood}` : t('detail.noLocation')}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(report.createdAt)}
          </span>
        </div>

        {!compact && (
          <p className="text-sm text-slate-600 line-clamp-2">
            {report.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <span className="text-xs font-mono text-slate-400">{report.id}</span>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {report.imageDataUrl && (
              <span className="flex items-center gap-1">
                <ImageIcon className="h-3.5 w-3.5" />
              </span>
            )}
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3.5 w-3.5" />
              {report.votes}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ReportListItem({ report }: { report: ReportRecord }) {
  const { t } = useLanguage();
  const { navigate } = useRouter();
  const cat = CATEGORIES.find((c) => c.id === report.category)!;

  return (
    <Card as="article" onClick={() => navigate({ name: 'detail', id: report.id })} className="group">
      <div className="flex items-start gap-3 p-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <CategoryIcon icon={cat.icon} className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
              {report.title}
            </h3>
            <StatusBadge status={report.status} />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {report.city ? `${report.city}, ${report.neighbourhood}` : t('detail.noLocation')}
            </span>
            <span>{formatDate(report.createdAt)}</span>
            {report.isDemo && (
              <Badge className="bg-slate-100 text-slate-600 border-slate-200">
                {t('reports.demo.label')}
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-mono text-slate-400">{report.id}</span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <ThumbsUp className="h-3 w-3" />
              {report.votes}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
