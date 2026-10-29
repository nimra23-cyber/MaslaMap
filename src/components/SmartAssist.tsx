import { useState } from 'react';
import { Sparkles, Copy, CheckCircle2, AlertTriangle, Wand2 } from 'lucide-react';
import type { CategoryId } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { analyzeText, type AssistResult } from '@/lib/smartAssist';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Field';
import { CategoryIcon } from '@/components/CategoryIcon';

export function SmartAssist() {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<AssistResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setAnalyzing(true);
    // Simulate brief processing for UX feedback
    setTimeout(() => {
      setResult(analyzeText(input));
      setAnalyzing(false);
    }, 300);
  };

  const copyField = async (field: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900">{t('assist.title')}</h1>
          <Badge className="bg-amber-50 text-amber-700 border-amber-200">Demo Mode</Badge>
        </div>
        <p className="text-sm text-slate-600">{t('assist.subtitle')}</p>
      </div>

      {/* Input */}
      <Card className="p-6 space-y-4">
        <label htmlFor="assist-input" className="block text-sm font-medium text-slate-700">
          {t('assist.inputLabel')}
        </label>
        <Textarea
          id="assist-input"
          placeholder={t('assist.placeholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="min-h-[120px]"
        />
        <Button onClick={handleAnalyze} disabled={analyzing || !input.trim()}>
          {analyzing ? (
            <>
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              {t('assist.analyze')}
            </>
          )}
        </Button>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Suggested category */}
          <Card className="p-5 space-y-3">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{t('assist.suggestedCategory')}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                <CategoryIcon icon={CATEGORIES.find((c) => c.id === result.category)!.icon} className="h-3.5 w-3.5" />
                {t(`cat.${result.category}`)}
              </Badge>
              {result.categoryConfidence === 'low' && (
                <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                  <AlertTriangle className="h-3 w-3" />
                  Low confidence
                </Badge>
              )}
            </div>
            {result.matchedKeywords.length > 0 && (
              <p className="text-xs text-slate-500">
                Matched keywords: {result.matchedKeywords.join(', ')}
              </p>
            )}
          </Card>

          {/* Suggested title */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{t('assist.suggestedTitle')}</h2>
              <Button variant="ghost" size="sm" onClick={() => copyField('title', result.suggestedTitle)}>
                {copiedField === 'title' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                {t('assist.copy')}
              </Button>
            </div>
            <p className="text-sm text-slate-700 font-medium bg-slate-50 rounded-lg p-3">{result.suggestedTitle}</p>
          </Card>

          {/* Structured description */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{t('assist.structuredDescription')}</h2>
              <Button variant="ghost" size="sm" onClick={() => copyField('structured', result.structuredDescription)}>
                {copiedField === 'structured' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                {t('assist.copy')}
              </Button>
            </div>
            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans bg-slate-50 rounded-lg p-3 leading-relaxed">
              {result.structuredDescription}
            </pre>
          </Card>

          {/* English draft */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{t('assist.draft.en')}</h2>
              <Button variant="ghost" size="sm" onClick={() => copyField('draftEn', result.draftEn)}>
                {copiedField === 'draftEn' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                {t('assist.copyDraft')}
              </Button>
            </div>
            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans bg-slate-50 rounded-lg p-3 leading-relaxed">
              {result.draftEn}
            </pre>
          </Card>

          {/* Roman Urdu draft */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{t('assist.draft.ur')}</h2>
              <Button variant="ghost" size="sm" onClick={() => copyField('draftUr', result.draftUr)}>
                {copiedField === 'draftUr' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                {t('assist.copyDraft')}
              </Button>
            </div>
            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans bg-slate-50 rounded-lg p-3 leading-relaxed">
              {result.draftUr}
            </pre>
          </Card>
        </div>
      )}

      {!result && !analyzing && (
        <Card className="p-8 text-center space-y-2">
          <Sparkles className="h-8 w-8 text-emerald-400 mx-auto" />
          <p className="text-sm text-slate-500">{t('assist.empty')}</p>
        </Card>
      )}

      {/* Disclaimers */}
      <div className="space-y-3">
        <div className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>{t('assist.disclaimer')}</p>
        </div>
        <div className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-4">
          <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>{t('assist.submitNote')}</p>
        </div>
      </div>
    </div>
  );
}
