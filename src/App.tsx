import { RouterProvider, useRouter } from '@/context/RouterContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ReportsProvider } from '@/context/ReportsContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Hero, CategoriesSection, HowItWorksSection, FeaturedReports } from '@/components/LandingSections';
import { ReportForm } from '@/components/ReportForm';
import { CommunityReportsPage } from '@/components/CommunityReportsPage';
import { ReportDetail } from '@/components/ReportDetail';
import { MapExplorer } from '@/components/MapExplorer';
import { SmartAssist } from '@/components/SmartAssist';
import { HowItWorksPage, PrivacyPage, OpenSourcePage } from '@/components/StaticPages';

function PageContent() {
  const { route } = useRouter();

  switch (route.name) {
    case 'home':
      return (
        <>
          <Hero />
          <CategoriesSection />
          <HowItWorksSection />
          <FeaturedReports />
        </>
      );
    case 'report':
      return <ReportForm />;
    case 'reports':
      return <CommunityReportsPage />;
    case 'detail':
      return <ReportDetail id={route.id} />;
    case 'map':
      return <MapExplorer />;
    case 'assist':
      return <SmartAssist />;
    case 'how':
      return <HowItWorksPage />;
    case 'privacy':
      return <PrivacyPage />;
    case 'opensource':
      return <OpenSourcePage />;
    default:
      return <Hero />;
  }
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-slate-900">
      <Navbar />
      <main className="flex-1">
        <PageContent />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <RouterProvider>
        <ReportsProvider>
          <AppContent />
        </ReportsProvider>
      </RouterProvider>
    </LanguageProvider>
  );
}

export default App;
