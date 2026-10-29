import { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Copy,
  CheckCircle2,
  ThumbsUp,
  Flag,
  AlertTriangle,
  User,
  Clock,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';
import type { ReportStatus } from '@/lib/types';
import { CATEGORIES, STATUS_ORDER, STATUS_META } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from '@/context/RouterContext';
import { useReports } from '@/context/ReportsContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '@/components/StatusBadge';
import { CategoryIcon } from '@/components/CategoryIcon';

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function ReportDetail({ id }: { id: string }) {
  const { t } = useLanguage();
  const { navigate } = useRouter();
  const { getReport, updateStatus, toggleVote, hasVoted, flagReport, hasFlagged } = useReports();
  const report = getReport(id);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const [showSimulated, setShowSimulated] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>('under_review');

  if (!report) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">Report not found</h1>
        <p className="text-sm text-slate-600">
          This report may have been removed or the ID is incorrect.
        </p>
        <Button onClick={() => navigate({ name: 'reports' })}>
          <ArrowLeft className="h-4 w-4" />
          {t('cta.backToReports')}
        </Button>
      </div>
    );
  }

  const cat = CATEGORIES.find((c) => c.id === report.category)!;
  const voted = hasVoted(report.id);
  const alreadyFlagged = hasFlagged(report.id) || flagged;

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(report.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      // ignore
    }
  };

  const copySummary = async () => {
    const summary = [
      `MaslaMap Report ${report.id}`,
      `Title: ${report.title}`,
      `Category: ${t(`cat.${report.category}`)}`,
      `Status: ${t(`status.${report.status}`)}`,
      `Location: ${report.city}, ${report.neighbourhood}`,
      `Reported: ${formatDateTime(report.createdAt)}`,
      ``,
      report.description,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(summary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleVote = () => {
    toggleVote(report.id);
  };

  const handleFlag = () => {
    flagReport(report.id);
    setFlagged(true);
  };

  const handleSimulatedUpdate = () => {
    const note = `Simulated status change to ${t(`status.${selectedStatus}`)}`;
    updateStatus(report.id, selectedStatus, note);
    setShowSimulated(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <button
        onClick={() => navigate({ name: 'reports' })}
        className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('cta.backToReports')}
      </button>

      {/* Header card */}
      <Card className="overflow-hidden">
        {report.imageDataUrl && (
          <div className="h-56 sm:h-64 bg-slate-100">
            <img src={report.imageDataUrl} alt={report.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
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
            </div>
            <StatusBadge status={report.status} />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            {report.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {report.city ? `${report.city}, ${report.neighbourhood}` : t('detail.noLocation')}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDateTime(report.createdAt)}
            </span>
            {report.reporterName && (
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {report.reporterName}
              </span>
            )}
          </div>

          {report.coordinates && (
            <p className="text-xs text-slate-400 font-mono">
              Approx. coordinates: {report.coordinates}
            </p>
          )}

          <div className="flex items-center gap-2 pt-2">
            <code className="text-sm font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded">{report.id}</code>
            <Button variant="ghost" size="sm" onClick={copyId}>
              {copiedId ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              {copiedId ? t('cta.copied') : t('cta.copyId')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Description */}
      <Card className="p-6 space-y-3">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{t('detail.description')}</h2>
        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{report.description}</p>
        {report.observedAt && (
          <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
            {t('detail.observed')}: {formatDateTime(report.observedAt)}
          </p>
        )}
      </Card>

      {/* Timeline */}
      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{t('detail.timeline')}</h2>
        <ol className="space-y-4">
          {report.timeline.map((entry, i) => {
            const meta = STATUS_META[entry.status];
            const isLast = i === report.timeline.length - 1;
            return (
              <li key={entry.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className={`h-3 w-3 rounded-full ${meta.dot} ring-4 ring-white`} />
                  {!isLast && <span className="w-px flex-1 bg-slate-200 my-1" />}
                </div>
                <div className="pb-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">{t(`status.${entry.status}`)}</span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Clock className="h-3 w-3" />
                    {formatDateTime(entry.at)}
                  </p>
                  {entry.note && <p className="text-xs text-slate-500 mt-1">{entry.note}</p>}
                </div>
              </li>
            );
          })}
        </ol>

        {/* Status explanations */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          {STATUS_ORDER.map((s) => (
            <div key={s} className="flex items-start gap-2 text-xs text-slate-500">
              <span className={`h-2 w-2 rounded-full ${STATUS_META[s].dot} mt-1 flex-shrink-0`} />
              <span><strong className="text-slate-700">{t(`status.${s}`)}</strong> — {t(`status.expl.${s}`)}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Community support */}
      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{t('detail.community')}</h2>
        <div className="flex items-center gap-3">
          <Button
            variant={voted ? 'secondary' : 'outline'}
            onClick={handleVote}
            disabled={voted}
          >
            <ThumbsUp className="h-4 w-4" />
            {voted ? t('cta.voted') : t('cta.vote')}
          </Button>
          <span className="text-sm text-slate-600">
            <strong className="text-slate-900">{report.votes}</strong> {t('detail.votes')}
          </span>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <Button variant="ghost" size="sm" onClick={copySummary}>
            {copiedSummary ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            {copiedSummary ? t('cta.copied') : t('cta.copySummary')}
          </Button>
        </div>
        <p className="text-xs text-slate-400">
          Community votes show support only. They do not verify an issue or guarantee action by authorities.
        </p>
      </Card>

      {/* Flag for review */}
      <Card className="p-6 space-y-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <h2 className="text-sm font-semibold text-slate-700">{t('detail.flag.title')}</h2>
            <p className="text-sm text-slate-600">{t('detail.flag.body')}</p>
            {alreadyFlagged ? (
              <p className="text-sm text-emerald-700 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                {t('cta.flagged')}
              </p>
            ) : (
              <Button variant="outline" size="sm" onClick={handleFlag}>
                <Flag className="h-4 w-4" />
                {t('cta.flag')}
              </Button>
            )}
            <p className="text-xs text-slate-400">{t('detail.flag.note')}</p>
          </div>
        </div>
      </Card>

      {/* Simulated status control */}
      <Card className="p-6 space-y-3 border-amber-200 bg-amber-50/30">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <h2 className="text-sm font-semibold text-slate-700">{t('detail.simulated.title')}</h2>
            <p className="text-sm text-slate-600">{t('detail.simulated.body')}</p>

            <button
              onClick={() => setShowSimulated((v) => !v)}
              className="flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors mt-2"
            >
              {t('detail.simulated.update')}
              <ChevronDown className={`h-4 w-4 transition-transform ${showSimulated ? 'rotate-180' : ''}`} />
            </button>

            {showSimulated && (
              <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-amber-200">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ReportStatus)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>{t(`status.${s}`)}</option>
                  ))}
                </select>
                <Button variant="secondary" size="sm" onClick={handleSimulatedUpdate}>
                  Apply
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
