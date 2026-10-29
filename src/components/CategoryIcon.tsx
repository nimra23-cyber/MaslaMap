import {
  Construction,
  Trash2,
  Droplets,
  Lightbulb,
  Trees,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react';
import type { CategoryId } from '@/lib/types';

const ICON_MAP: Record<string, LucideIcon> = {
  construction: Construction,
  trash: Trash2,
  droplets: Droplets,
  lightbulb: Lightbulb,
  trees: Trees,
  more_horizontal: MoreHorizontal,
};

export function CategoryIcon({ icon, className = 'w-5 h-5' }: { icon: string; className?: string }) {
  const Icon = ICON_MAP[icon] ?? MoreHorizontal;
  return <Icon className={className} aria-hidden="true" />;
}
