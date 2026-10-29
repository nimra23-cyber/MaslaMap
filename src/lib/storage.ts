import type { ReportRecord, ReportStatus, ReportTimelineEntry } from './types';

const REPORTS_KEY = 'maslamap.reports.v1';
const VOTES_KEY = 'maslamap.votes.v1';
const FLAGS_KEY = 'maslamap.flags.v1';
const SEEDED_KEY = 'maslamap.seeded.v1';

export function loadReports(): ReportRecord[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ReportRecord[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveReports(reports: ReportRecord[]): void {
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  } catch {
    // storage full or unavailable — fail silently for demo
  }
}

export function loadVotes(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(VOTES_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function saveVotes(votes: Record<string, boolean>): void {
  try {
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
  } catch {
    // ignore
  }
}

export function loadFlags(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(FLAGS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function saveFlags(flags: Record<string, boolean>): void {
  try {
    localStorage.setItem(FLAGS_KEY, JSON.stringify(flags));
  } catch {
    // ignore
  }
}

export function hasSeeded(): boolean {
  return localStorage.getItem(SEEDED_KEY) === '1';
}

export function markSeeded(): void {
  localStorage.setItem(SEEDED_KEY, '1');
}

export function generateReportId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'MM-';
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export function makeTimelineEntry(status: ReportStatus, note: string): ReportTimelineEntry {
  return {
    id: `tl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status,
    note,
    at: new Date().toISOString(),
  };
}

export function voteCount(reports: ReportRecord[], id: string): number {
  // We store vote counts on the report itself for demo simplicity
  const r = reports.find((x) => x.id === id);
  return r?.votes ?? 0;
}
