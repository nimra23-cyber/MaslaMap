import type { ReportStatus } from '@/lib/types';
import { STATUS_META } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { Badge } from '@/components/ui/Badge';

export function StatusBadge({ status }: { status: ReportStatus }) {
  const { t } = useLanguage();
  const meta = STATUS_META[status];
  return (
    <Badge className={meta.color}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {t(`status.${status}`)}
    </Badge>
  );
}
