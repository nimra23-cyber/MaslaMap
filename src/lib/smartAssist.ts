import type { CategoryId } from './types';
import { CATEGORIES } from './types';

export interface AssistResult {
  category: CategoryId;
  categoryConfidence: 'high' | 'low';
  suggestedTitle: string;
  structuredDescription: string;
  draftEn: string;
  draftUr: string;
  matchedKeywords: string[];
}

interface CategoryMatch {
  id: CategoryId;
  matched: string[];
}

function detectCategory(text: string): CategoryMatch {
  const lower = text.toLowerCase();
  let best: CategoryMatch = { id: 'other', matched: [] };

  for (const cat of CATEGORIES) {
    const matched = cat.defaultKeywords.filter((kw) => lower.includes(kw));
    if (matched.length > best.matched.length) {
      best = { id: cat.id, matched };
    }
  }
  return best;
}

function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildTitle(text: string, category: CategoryId): string {
  const trimmed = text.trim().slice(0, 80);
  if (trimmed.length > 10) {
    return titleCase(trimmed);
  }
  const fallback: Record<CategoryId, string> = {
    roads_potholes: 'Damaged road surface in the neighbourhood',
    garbage_sanitation: 'Accumulated garbage in the area',
    water_drainage: 'Water leakage and drainage issue',
    streetlights: 'Streetlight not working',
    public_spaces: 'Public space maintenance needed',
    other: 'Community issue requiring attention',
  };
  return fallback[category];
}

function buildStructuredDescription(text: string, category: CategoryId): string {
  const catLabel: Record<CategoryId, string> = {
    roads_potholes: 'Roads & Potholes',
    garbage_sanitation: 'Garbage & Sanitation',
    water_drainage: 'Water & Drainage',
    streetlights: 'Streetlights',
    public_spaces: 'Public Spaces',
    other: 'Other',
  };
  const cleaned = text.trim().replace(/\s+/g, ' ');
  return [
    `Category: ${catLabel[category]}`,
    ``,
    `Issue description: ${cleaned}`,
    ``,
    `Approximate location: [Please add your city and neighbourhood]`,
    `When noticed: [Please add date if known]`,
    ``,
    `Impact on community: [Describe how this affects residents, commuters, or children]`,
  ].join('\n');
}

function buildDraftEn(text: string, category: CategoryId): string {
  const catLabel: Record<CategoryId, string> = {
    roads_potholes: 'damaged road / pothole',
    garbage_sanitation: 'garbage and sanitation',
    water_drainage: 'water leakage / drainage',
    streetlights: 'streetlight not working',
    public_spaces: 'public space maintenance',
    other: 'a community issue',
  };
  return [
    `Subject: Request to address ${catLabel[category]} in our neighbourhood`,
    ``,
    `Respected Sir/Madam,`,
    ``,
    `I would like to bring to your attention the following issue in our area:`,
    ``,
    `${text.trim()}`,
    ``,
    `Location: [City, Neighbourhood]`,
    `This has been causing difficulty for residents and visitors. I kindly request that the concerned department look into this matter at the earliest convenience.`,
    ``,
    `Thank you.`,
    ``,
    `[Your name]`,
  ].join('\n');
}

function buildDraftUr(text: string, category: CategoryId): string {
  const catLabel: Record<CategoryId, string> = {
    roads_potholes: 'sadak kharab / gartha',
    garbage_sanitation: 'kachra aur safai',
    water_drainage: 'pani leakage / drainage',
    streetlights: 'streetlight kharab',
    public_spaces: 'public space ki maintenance',
    other: 'ek community masla',
  };
  return [
    `Mozo: Hamare ilake me ${catLabel[category]} ke masle ke hawale se`,
    ``,
    `Mohtaram,`,
    ``,
    `Mein apne ilake ke ek masle ki taraf aapki tawajjo lena chahta/chahti hoon:`,
    ``,
    `${text.trim()}`,
    ``,
    `Location: [Sheher, Ilaka]`,
    `Yeh rahne walon aur aane janewalon ko mushkil me daal raha hai. Bara-e-meharbani related department se is masle ko jaldi dekhne ki guzarish karta/karti hoon.`,
    ``,
    `Shukriya.`,
    ``,
    `[Aapka naam]`,
  ].join('\n');
}

export function analyzeText(text: string): AssistResult {
  const match = detectCategory(text);
  const confidence: 'high' | 'low' = match.matched.length >= 1 ? 'high' : 'low';
  return {
    category: match.id,
    categoryConfidence: confidence,
    suggestedTitle: buildTitle(text, match.id),
    structuredDescription: buildStructuredDescription(text, match.id),
    draftEn: buildDraftEn(text, match.id),
    draftUr: buildDraftUr(text, match.id),
    matchedKeywords: match.matched,
  };
}

// Clean service interface for a future real model integration (e.g. Gemma 4)
// via a secure server-side API. Never place API keys in frontend code.
export interface IssueAssistantService {
  analyze(text: string): Promise<AssistResult>;
}

// Local demo implementation
export const localAssistantService: IssueAssistantService = {
  analyze: async (text: string) => analyzeText(text),
};
