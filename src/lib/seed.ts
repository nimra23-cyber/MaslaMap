import type { ReportRecord } from './types';
import { makeTimelineEntry } from './storage';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export function buildSeedReports(): ReportRecord[] {
  const now = new Date().toISOString();
  const seeds: Omit<ReportRecord, 'timeline'>[] = [
    {
      id: 'MM-DEMO0001',
      title: 'Large pothole on main Tariq Road intersection',
      category: 'roads_potholes',
      description:
        'A large pothole has formed near the Tariq Road and Shaheed-e-Millat intersection. It fills with water during rain and has caused several near-misses with motorbikes. Has been there for about three weeks.',
      city: 'Karachi',
      neighbourhood: 'PECHS Block 2',
      coordinates: null,
      imageDataUrl: null,
      observedAt: daysAgo(21),
      reporterName: null,
      consent: true,
      status: 'under_review',
      votes: 14,
      flagged: false,
      createdAt: daysAgo(20),
      updatedAt: daysAgo(5),
      isDemo: true,
    },
    {
      id: 'MM-DEMO0002',
      title: 'Garbage piling up near the corner of Gulberg main boulevard',
      category: 'garbage_sanitation',
      description:
        'Garbage has been accumulating at the corner of the main boulevard for over a week. Stray animals scatter it across the road and the smell has become difficult for nearby shops and residents.',
      city: 'Lahore',
      neighbourhood: 'Gulberg III',
      coordinates: null,
      imageDataUrl: null,
      observedAt: daysAgo(9),
      reporterName: null,
      consent: true,
      status: 'reported',
      votes: 7,
      flagged: false,
      createdAt: daysAgo(8),
      updatedAt: daysAgo(8),
      isDemo: true,
    },
    {
      id: 'MM-DEMO0003',
      title: 'Streetlight not working on entire lane for two weeks',
      category: 'streetlights',
      description:
        'The streetlight on our lane has been out for about two weeks. The lane is very dark at night and families feel unsafe walking after evening prayer. Two poles seem to have no power.',
      city: 'Islamabad',
      neighbourhood: 'G-10 Markaz',
      coordinates: null,
      imageDataUrl: null,
      observedAt: daysAgo(14),
      reporterName: null,
      consent: true,
      status: 'in_progress',
      votes: 21,
      flagged: false,
      createdAt: daysAgo(13),
      updatedAt: daysAgo(2),
      isDemo: true,
    },
    {
      id: 'MM-DEMO0004',
      title: 'Water leakage causing standing water on the street',
      category: 'water_drainage',
      description:
        'A water pipe has been leaking near the chowk for several days. Standing water covers half the road, making it hard for cars and pedestrians. Possible health risk from stagnant water.',
      city: 'Faisalabad',
      neighbourhood: 'People Colony',
      coordinates: null,
      imageDataUrl: null,
      observedAt: daysAgo(5),
      reporterName: null,
      consent: true,
      status: 'reported',
      votes: 4,
      flagged: false,
      createdAt: daysAgo(4),
      updatedAt: daysAgo(4),
      isDemo: true,
    },
    {
      id: 'MM-DEMO0005',
      title: 'Public park bench broken and playing area needs cleaning',
      category: 'public_spaces',
      description:
        'Two benches in the neighbourhood park are broken and the children playing area has litter and overgrown grass. Families have stopped bringing kids in the evening.',
      city: 'Rawalpindi',
      neighbourhood: 'Saddar',
      coordinates: null,
      imageDataUrl: null,
      observedAt: daysAgo(18),
      reporterName: null,
      consent: true,
      status: 'resolved',
      votes: 11,
      flagged: false,
      createdAt: daysAgo(17),
      updatedAt: daysAgo(1),
      isDemo: true,
    },
    {
      id: 'MM-DEMO0006',
      title: 'Open manhole near school — dangerous for children',
      category: 'other',
      description:
        'A manhole cover is missing on the street near the school entrance. Children walk past it daily and it is a serious safety hazard, especially in the morning rush.',
      city: 'Multan',
      neighbourhood: 'Bosan Road',
      coordinates: null,
      imageDataUrl: null,
      observedAt: daysAgo(3),
      reporterName: null,
      consent: true,
      status: 'under_review',
      votes: 32,
      flagged: false,
      createdAt: daysAgo(2),
      updatedAt: daysAgo(1),
      isDemo: true,
    },
  ];

  return seeds.map((s) => {
    const timeline = [makeTimelineEntry('reported', 'Report created')];
    if (s.status === 'under_review' || s.status === 'in_progress' || s.status === 'resolved') {
      timeline.push(makeTimelineEntry('under_review', 'Report picked up for review'));
    }
    if (s.status === 'in_progress' || s.status === 'resolved') {
      timeline.push(makeTimelineEntry('in_progress', 'Work started on the issue'));
    }
    if (s.status === 'resolved') {
      timeline.push(makeTimelineEntry('resolved', 'Issue marked as resolved'));
    }
    // Fix timeline timestamps to be in the past
    timeline.forEach((t, i) => {
      t.at = daysAgo(20 - i * 5);
    });
    return { ...s, timeline };
  });
}
