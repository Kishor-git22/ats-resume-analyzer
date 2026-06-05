import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CookieBanner from './components/layout/CookieBanner';
import GlobalStatsBanner from './components/ui/GlobalStatsBanner';
import UploadZone from './components/features/UploadZone';
import LoadingState from './components/features/LoadingState';
import ResultView from './components/features/ResultView';
import HistoryList from './components/features/HistoryList';

import { useStats } from './hooks/useStats';
import { useAppTabs } from './hooks/useAppTabs';
import { useReview } from './hooks/useReview';

export default function App() {
  const { stats, refreshStats } = useStats();
  const { activeTab, setActiveTab } = useAppTabs();
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const { state, handleReview, showHistoryItem, reset } = useReview(() => {
    setHistoryRefresh((prev) => prev + 1);
    refreshStats();
  });

  const [cookieConsent, setCookieConsent] = useState<boolean>(!!Cookies.get('userId'));

  const handleAcceptCookies = () => {
    Cookies.set('userId', uuidv4(), { expires: 365 });
    setCookieConsent(true);
  };

  useEffect(() => {
    const handleHashChange = () => {
      if (!window.location.hash) {
        reset();
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [reset]);

  return (
    <main className="relative h-screen overflow-hidden w-full bg-transparent flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 md:px-10 py-6 md:py-8 overflow-hidden">
        {state.phase === 'idle' && (
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-10 items-center lg:items-start my-auto h-full">
            <div className="flex flex-col gap-8 lg:gap-12 pt-0 lg:pt-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-col gap-6 text-center lg:text-left"
              >
                <h1
                  className="hero-heading font-black uppercase leading-none tracking-tight"
                  style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}
                >
                  Resume reviewer
                </h1>
                <p
                  className="font-light text-[#D7E2EA]/70 leading-relaxed max-w-xl mx-auto lg:mx-0"
                  style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)' }}
                >
                  Drop in your resume. Get a brutally honest, AI powered review with scores,
                  strengths, weaknesses, and rewritten bullets in seconds.
                </p>
              </motion.div>

              <GlobalStatsBanner
                stats={stats}
                className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3"
              />
            </div>

            <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto lg:mx-0 lg:max-w-none h-full max-h-[80vh] overflow-hidden">
              <div className="grid grid-cols-2 gap-3 max-w-[400px] w-full mx-auto">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`w-full py-3.5 rounded-full text-sm uppercase tracking-widest font-medium transition-all duration-300 ${
                    activeTab === 'upload'
                      ? 'bg-white text-[#0C0C0C] shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                      : 'glass-button text-[#D7E2EA]/70'
                  }`}
                >
                  Analyze Resume
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`w-full py-3.5 rounded-full text-sm uppercase tracking-widest font-medium transition-all duration-300 ${
                    activeTab === 'history'
                      ? 'bg-white text-[#0C0C0C] shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                      : 'glass-button text-[#D7E2EA]/70'
                  }`}
                >
                  My History
                </button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full relative flex-1 min-h-0 flex flex-col"
              >
                <div
                  className={`w-full flex-1 min-h-0 ${activeTab === 'upload' ? 'flex flex-col' : 'hidden'}`}
                >
                  <UploadZone onSubmit={handleReview} isProcessing={false} />
                </div>
                <div
                  className={`w-full flex-1 min-h-0 ${activeTab === 'history' ? 'flex flex-col' : 'hidden'}`}
                >
                  <HistoryList
                    onSelect={(item) => showHistoryItem(item.resumeText, item.result)}
                    userId={cookieConsent ? Cookies.get('userId') || null : null}
                    refreshTrigger={historyRefresh}
                  />
                </div>
              </motion.div>

              <GlobalStatsBanner stats={stats} className="grid lg:hidden mt-4" />
            </div>
          </div>
        )}

        {state.phase === 'loading' && <LoadingState />}

        {state.phase === 'result' && state.result && state.resumeText && (
          <ResultView
            result={state.result}
            resumeText={state.resumeText}
            onReset={() => {
              reset();
              setActiveTab('upload');
            }}
          />
        )}

        {state.phase === 'error' && (
          <div className="max-w-xl mx-auto flex flex-col items-center gap-6 py-16 text-center">
            <AlertCircle size={48} className="text-red-400" strokeWidth={1.4} />
            <h2 className="text-2xl font-medium text-[#D7E2EA]">Couldn't review that resume</h2>
            <p className="text-[#D7E2EA]/70 leading-relaxed">{state.error}</p>
            <button
              type="button"
              onClick={() => {
                reset();
                setActiveTab('upload');
              }}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] hover:bg-[#D7E2EA]/10 transition-colors"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      <Footer cookieConsent={cookieConsent} />

      <CookieBanner
        show={!cookieConsent}
        onAccept={handleAcceptCookies}
        onDecline={() => setCookieConsent(true)}
      />
    </main>
  );
}
