import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { FloatingActions } from './components/FloatingActions.tsx';
import { Home } from './components/Home.tsx';
import { AllTools } from './components/AllTools.tsx';
import { Services } from './components/Services.tsx';
import { GovtJobs } from './components/GovtJobs.tsx';
import { Contact } from './components/Contact.tsx';
import { CustomerPortal } from './components/CustomerPortal.tsx';
import { AdminPortal } from './components/AdminPortal.tsx';
import { LegalPages } from './components/LegalPages.tsx';

import { SeoHelmet } from './components/SeoHelmet.tsx';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="flex-1">
      {activeTab === 'home' && <Home />}
      {activeTab === 'tools' && <AllTools />}
      {activeTab === 'services' && <Services />}
      {activeTab === 'govt' && <GovtJobs />}
      {activeTab === 'contact' && <Contact />}
      {activeTab === 'status' && <CustomerPortal />}
      {activeTab === 'admin' && <AdminPortal />}
      {activeTab === 'about' && <LegalPages page="about" />}
      {activeTab === 'privacy' && <LegalPages page="privacy" />}
      {activeTab === 'terms' && <LegalPages page="terms" />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <SeoHelmet />
      <div className="min-h-screen flex flex-col bg-[#F1F5F9] dark:bg-[#0B0F19] text-[#1E293B] dark:text-[#F8FAFC] transition-colors selection:bg-orange-500 selection:text-white">
        <Header />
        <MainContent />
        <Footer />
        <FloatingActions />
      </div>
    </AppProvider>
  );
}
