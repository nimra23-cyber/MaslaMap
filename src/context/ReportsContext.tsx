import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { ReportRecord, ReportStatus } from '@/lib/types';
import {
  loadReports,
  saveReports,
  loadVotes,
  saveVotes,
  loadFlags,
  saveFlags,
  hasSeeded,
  markSeeded,
  generateReportId,
  makeTimelineEntry,
} from '@/lib/storage';
import { buildSeedReports } from '@/lib/seed';

interface ReportsContextValue {
  reports: ReportRecord[];
  addReport: (data: Omit<ReportRecord, 'id' | 'status' | 'timeline' | 'votes' | 'flagged' | 'createdAt' | 'updatedAt' | 'isDemo'>) => ReportRecord;
  getReport: (id: string) => ReportRecord | undefined;
  updateStatus: (id: string, status: ReportStatus, note: string) => void;
  toggleVote: (id: string) => boolean;
  hasVoted: (id: string) => boolean;
  flagReport: (id: string) => void;
  hasFlagged: (id: string) => boolean;
}

const ReportsContext = createContext<ReportsContextValue | null>(null);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [votes, setVotes] = useState<Record<string, boolean>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let loaded = loadReports();
    if (!hasSeeded() && loaded.length === 0) {
      loaded = buildSeedReports();
      saveReports(loaded);
      markSeeded();
    }
    setReports(loaded);
    setVotes(loadVotes());
    setFlags(loadFlags());
  }, []);

  const persist = useCallback((next: ReportRecord[]) => {
    setReports(next);
    saveReports(next);
  }, []);

  const addReport: ReportsContextValue['addReport'] = useCallback(
    (data) => {
      const now = new Date().toISOString();
      const id = generateReportId();
      const report: ReportRecord = {
        ...data,
        id,
        status: 'reported',
        timeline: [makeTimelineEntry('reported', 'Report created')],
        votes: 0,
        flagged: false,
        createdAt: now,
        updatedAt: now,
        isDemo: false,
      };
      setReports((prev) => {
        const next = [report, ...prev];
        saveReports(next);
        return next;
      });
      return report;
    },
    []
  );

  const getReport = useCallback(
    (id: string) => reports.find((r) => r.id === id),
    [reports]
  );

  const updateStatus = useCallback(
    (id: string, status: ReportStatus, note: string) => {
      setReports((prev) => {
        const next = prev.map((r) => {
          if (r.id !== id) return r;
          return {
            ...r,
            status,
            updatedAt: new Date().toISOString(),
            timeline: [...r.timeline, makeTimelineEntry(status, note)],
          };
        });
        saveReports(next);
        return next;
      });
    },
    []
  );

  const toggleVote = useCallback(
    (id: string): boolean => {
      const alreadyVoted = !!votes[id];
      const newVotes = { ...votes, [id]: !alreadyVoted };
      setVotes(newVotes);
      saveVotes(newVotes);
      setReports((prev) => {
        const next = prev.map((r) => {
          if (r.id !== id) return r;
          return { ...r, votes: Math.max(0, r.votes + (alreadyVoted ? -1 : 1)) };
        });
        saveReports(next);
        return next;
      });
      return !alreadyVoted;
    },
    [votes]
  );

  const hasVoted = useCallback((id: string) => !!votes[id], [votes]);

  const flagReport = useCallback(
    (id: string) => {
      const newFlags = { ...flags, [id]: true };
      setFlags(newFlags);
      saveFlags(newFlags);
      setReports((prev) => {
        const next = prev.map((r) => (r.id === id ? { ...r, flagged: true } : r));
        saveReports(next);
        return next;
      });
    },
    [flags]
  );

  const hasFlagged = useCallback((id: string) => !!flags[id], [flags]);

  return (
    <ReportsContext.Provider
      value={{ reports, addReport, getReport, updateStatus, toggleVote, hasVoted, flagReport, hasFlagged }}
    >
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports(): ReportsContextValue {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error('useReports must be used within ReportsProvider');
  return ctx;
}
