export type CategoryId =
  | 'roads_potholes'
  | 'garbage_sanitation'
  | 'water_drainage'
  | 'streetlights'
  | 'public_spaces'
  | 'other';

export type ReportStatus =
  | 'reported'
  | 'under_review'
  | 'in_progress'
  | 'resolved';

export interface ReportRecord {
  id: string;
  title: string;
  category: CategoryId;
  description: string;
  city: string;
  neighbourhood: string;
  coordinates: string | null;
  imageDataUrl: string | null;
  observedAt: string | null;
  reporterName: string | null;
  consent: boolean;
  status: ReportStatus;
  timeline: ReportTimelineEntry[];
  votes: number;
  flagged: boolean;
  createdAt: string;
  updatedAt: string;
  isDemo: boolean;
}

export interface ReportTimelineEntry {
  id: string;
  status: ReportStatus;
  note: string;
  at: string;
}

export type Lang = 'en' | 'ur';

export type View = 'list' | 'map';

export type SortOrder = 'newest' | 'oldest';

export interface CategoryDef {
  id: CategoryId;
  icon: string;
  defaultKeywords: string[];
}

export const CATEGORIES: CategoryDef[] = [
  { id: 'roads_potholes', icon: 'construction', defaultKeywords: ['pothole', 'road', 'crack', 'speed breaker', 'footpath', 'pavement'] },
  { id: 'garbage_sanitation', icon: 'trash', defaultKeywords: ['garbage', 'trash', 'waste', 'rubbish', 'dump', 'sanitation', 'sweeper'] },
  { id: 'water_drainage', icon: 'droplets', defaultKeywords: ['water', 'leakage', 'drainage', 'sewage', 'nala', 'pipe', 'flooding', 'sewer'] },
  { id: 'streetlights', icon: 'lightbulb', defaultKeywords: ['streetlight', 'street light', 'lamp', 'light', 'pole', 'dark street'] },
  { id: 'public_spaces', icon: 'trees', defaultKeywords: ['park', 'playground', 'bench', 'public space', 'green belt', 'roundabout'] },
  { id: 'other', icon: 'more_horizontal', defaultKeywords: ['other', 'misc'] },
];

export const STATUS_ORDER: ReportStatus[] = ['reported', 'under_review', 'in_progress', 'resolved'];

export const STATUS_META: Record<ReportStatus, { color: string; dot: string }> = {
  reported: { color: 'text-amber-700 bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
  under_review: { color: 'text-blue-700 bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
  in_progress: { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  resolved: { color: 'text-slate-700 bg-slate-100 border-slate-200', dot: 'bg-slate-500' },
};
