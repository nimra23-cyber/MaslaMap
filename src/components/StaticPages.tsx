import { ShieldCheck, Eye, FileText, Database, Lock, Cpu, Map as MapIcon, Users } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from '@/context/RouterContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function HowItWorksPage() {
  const { t } = useLanguage();
  const { navigate } = useRouter();

  const roadmapItems = [
    t('roadmap.item1'),
    t('roadmap.item2'),
    t('roadmap.item3'),
    t('roadmap.item4'),
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">{t('how.title')}</h1>
        <p className="text-sm text-slate-600">{t('how.subtitle')}</p>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {[
          { title: t('how.step1.title'), body: t('how.step1.body'), num: '1' },
          { title: t('how.step2.title'), body: t('how.step2.body'), num: '2' },
          { title: t('how.step3.title'), body: t('how.step3.body'), num: '3' },
        ].map((step) => (
          <Card key={step.num} className="p-5 flex items-start gap-4">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white text-sm font-bold">
              {step.num}
            </span>
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-slate-900">{step.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{step.body}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Trust section */}
      <Card className="p-6 space-y-4 border-emerald-200 bg-emerald-50/30">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-slate-700">{t('how.trust.title')}</h2>
            <p className="text-sm text-slate-600">{t('how.trust.body')}</p>
          </div>
        </div>
      </Card>

      {/* Privacy notice */}
      <Card className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-slate-700" />
          <h2 className="text-sm font-semibold text-slate-700">{t('privacy.title')}</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{t('privacy.body1')}</p>
        <p className="text-sm text-slate-600 leading-relaxed">{t('privacy.body2')}</p>
      </Card>

      {/* Responsible AI */}
      <Card className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-slate-700" />
          <h2 className="text-sm font-semibold text-slate-700">{t('ai.title')}</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{t('ai.body')}</p>
      </Card>

      {/* Roadmap */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <MapIcon className="h-5 w-5 text-emerald-700" />
          <h2 className="text-sm font-semibold text-slate-700">{t('roadmap.title')}</h2>
        </div>
        <ul className="space-y-2">
          {roadmapItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={() => navigate({ name: 'report' })}>
          {t('cta.report')}
        </Button>
        <Button variant="outline" onClick={() => navigate({ name: 'reports' })}>
          {t('cta.explore')}
        </Button>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('privacy.title')}</h1>

      <Card className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-slate-700" />
          <h2 className="text-sm font-semibold text-slate-700">What we collect</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{t('privacy.body1')}</p>
      </Card>

      <Card className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-slate-700" />
          <h2 className="text-sm font-semibold text-slate-700">Where data is stored</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{t('privacy.body2')}</p>
      </Card>

      <Card className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-slate-700" />
          <h2 className="text-sm font-semibold text-slate-700">{t('ai.title')}</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{t('ai.body')}</p>
      </Card>

      <Card className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-slate-700" />
          <h2 className="text-sm font-semibold text-slate-700">Community interactions</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Community support votes and flag-for-review actions are stored locally in your browser only.
          Votes show support and do not verify an issue or guarantee action by authorities. Flagging
          a report does not notify any authority — it is a demo control for review within this prototype.
        </p>
      </Card>
    </div>
  );
}

export function OpenSourcePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Open Source</h1>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-700" />
          <h2 className="text-sm font-semibold text-slate-700">MIT License</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          MaslaMap is released under the MIT License. You are free to use, modify, and distribute
          this project. See the LICENSE file in the repository for full terms.
        </p>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">Contributing</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Contributions are welcome. Please read CONTRIBUTING.md for guidelines on how to submit
          issues, feature requests, and pull requests. We follow a simple fork-and-PR workflow.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          When contributing, please respect the privacy-first design: never add features that
          collect CNIC, phone numbers, or exact home addresses. Never place API keys in frontend code.
        </p>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">Local setup</h2>
        <pre className="text-sm text-slate-700 bg-slate-50 rounded-lg p-4 overflow-x-auto"><code>{`npm install\nnpm run dev    # start dev server\nnpm run build  # production build\nnpm run lint   # lint check\nnpm run typecheck  # type check`}</code></pre>
      </Card>
    </div>
  );
}
