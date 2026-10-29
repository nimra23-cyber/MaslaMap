import { useState, useRef, useCallback } from 'react';
import { Upload, X, CheckCircle2, Copy, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import type { CategoryId } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from '@/context/RouterContext';
import { useReports } from '@/context/ReportsContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Field';
import { CategoryIcon } from '@/components/CategoryIcon';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface FormState {
  title: string;
  category: CategoryId | '';
  description: string;
  city: string;
  neighbourhood: string;
  coordinates: string;
  imageDataUrl: string | null;
  observedAt: string;
  reporterName: string;
  consent: boolean;
}

const initialState: FormState = {
  title: '',
  category: '',
  description: '',
  city: '',
  neighbourhood: '',
  coordinates: '',
  imageDataUrl: null,
  observedAt: '',
  reporterName: '',
  consent: false,
};

export function ReportForm() {
  const { t } = useLanguage();
  const { navigate } = useRouter();
  const { addReport } = useReports();
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, imageDataUrl: t('form.error.photo.type') }));
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setErrors((prev) => ({ ...prev, imageDataUrl: t('form.error.photo.size') }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      update('imageDataUrl', reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [t, update]);

  const removePhoto = useCallback(() => {
    update('imageDataUrl', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [update]);

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) e.title = t('form.error.title');
    if (form.description.trim().length < 10) e.description = t('form.error.description');
    if (!form.city.trim()) e.city = t('form.error.city');
    if (!form.neighbourhood.trim()) e.neighbourhood = t('form.error.neighbourhood');
    if (!form.consent) e.consent = t('form.error.consent');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;
    setSubmitting(true);

    // Simulate small delay for UX
    setTimeout(() => {
      const report = addReport({
        title: form.title.trim(),
        category: (form.category || 'other') as CategoryId,
        description: form.description.trim(),
        city: form.city.trim(),
        neighbourhood: form.neighbourhood.trim(),
        coordinates: form.coordinates.trim() || null,
        imageDataUrl: form.imageDataUrl,
        observedAt: form.observedAt || null,
        reporterName: form.reporterName.trim() || null,
        consent: form.consent,
      });
      setSubmittedId(report.id);
      setSubmitting(false);
    }, 400);
  };

  const copyId = async () => {
    if (!submittedId) return;
    try {
      await navigator.clipboard.writeText(submittedId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  // Success screen
  if (submittedId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">{t('form.success.title')}</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">{t('form.success.body')}</p>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{t('form.success.reportId')}</p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-lg font-mono font-bold text-slate-900">{submittedId}</code>
              <Button variant="secondary" size="sm" onClick={copyId}>
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? t('cta.copied') : t('cta.copyId')}
              </Button>
            </div>
          </div>

          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex items-start gap-2 text-left">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            {t('form.success.disclaimer')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate({ name: 'detail', id: submittedId })}>
              {t('form.success.viewReport')}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setForm(initialState);
                setSubmittedId(null);
                setErrors({});
              }}
            >
              {t('form.success.submitAnother')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">{t('form.title')}</h1>
        <p className="text-sm text-slate-600">{t('form.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Section: Issue details */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Issue details</legend>
          <Input
            name="title"
            label={t('form.label.title')}
            placeholder={t('form.placeholder.title')}
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            error={errors.title}
            maxLength={120}
          />
          <Select
            name="category"
            label={t('form.label.category')}
            value={form.category}
            onChange={(e) => update('category', e.target.value as CategoryId)}
            error={errors.category}
          >
            <option value="">— Select a category —</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {t(`cat.${c.id}`)}
              </option>
            ))}
          </Select>
          <Textarea
            name="description"
            label={t('form.label.description')}
            placeholder={t('form.placeholder.description')}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            error={errors.description}
            maxLength={1000}
            rows={4}
          />
        </fieldset>

        {/* Section: Location */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Location</legend>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              name="city"
              label={t('form.label.city')}
              placeholder={t('form.placeholder.city')}
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              error={errors.city}
              maxLength={60}
            />
            <Input
              name="neighbourhood"
              label={t('form.label.neighbourhood')}
              placeholder={t('form.placeholder.neighbourhood')}
              value={form.neighbourhood}
              onChange={(e) => update('neighbourhood', e.target.value)}
              error={errors.neighbourhood}
              maxLength={80}
            />
          </div>
          <Input
            name="coordinates"
            label={t('form.label.coordinates')}
            placeholder={t('form.placeholder.coordinates')}
            value={form.coordinates}
            onChange={(e) => update('coordinates', e.target.value)}
            error={errors.coordinates}
            maxLength={60}
          />
        </fieldset>

        {/* Section: Evidence */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Evidence (optional)</legend>

          {form.imageDataUrl ? (
            <div className="relative rounded-xl border border-slate-200 overflow-hidden">
              <img src={form.imageDataUrl} alt="Preview" className="w-full max-h-64 object-cover" />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-white/90 text-slate-700 rounded-lg hover:bg-white shadow-sm transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                {t('form.photo.remove')}
              </button>
            </div>
          ) : (
            <div>
              <label
                htmlFor="photo"
                className="flex flex-col items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors"
              >
                <Upload className="h-6 w-6 text-slate-400" />
                <span className="text-sm text-slate-600">{t('form.label.photo')}</span>
              </label>
              <input
                ref={fileInputRef}
                id="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="sr-only"
              />
              {errors.imageDataUrl && (
                <p className="mt-1.5 text-sm text-red-600">{errors.imageDataUrl}</p>
              )}
              <p className="mt-1.5 text-xs text-slate-500">{t('form.photo.hint')}</p>
            </div>
          )}

          <Input
            name="observedAt"
            type="datetime-local"
            label={t('form.label.observed')}
            value={form.observedAt}
            onChange={(e) => update('observedAt', e.target.value)}
            error={errors.observedAt}
          />
        </fieldset>

        {/* Section: Reporter */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Reporter (optional)</legend>
          <Input
            name="reporterName"
            label={t('form.label.reporter')}
            placeholder={t('form.placeholder.reporter')}
            value={form.reporterName}
            onChange={(e) => update('reporterName', e.target.value)}
            error={errors.reporterName}
            maxLength={50}
          />
        </fieldset>

        {/* Section: Consent */}
        <fieldset className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => update('consent', e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              aria-describedby="consent-error"
            />
            <span className="text-sm text-slate-700">{t('form.label.consent')}</span>
          </label>
          {errors.consent && (
            <p id="consent-error" className="text-sm text-red-600">{errors.consent}</p>
          )}
        </fieldset>

        {/* Assist hint */}
        <div className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-sm text-emerald-800 flex items-center gap-2">
            <Sparkles className="h-4 w-4 flex-shrink-0" />
            {t('form.assistHint')}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate({ name: 'assist' })}
            className="flex-shrink-0"
          >
            {t('form.openAssist')}
          </Button>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? (
              <>
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t('cta.submitting')}
              </>
            ) : (
              t('cta.submit')
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
