import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

import UploadZone from './components/UploadZone';
import LoadingState from './components/LoadingState';
import ResultView from './components/ResultView';
import HistoryList from './components/HistoryList';
import type { ReviewResult, GlobalStats, ReviewHistoryItem } from './lib/types';

type AppState =
  | { phase: 'idle' }
  | { phase: 'loading'; resumeText: string }
  | { phase: 'result'; resumeText: string; result: ReviewResult }
  | { phase: 'error'; resumeText: string; error: string };

const App = () => {
  const [state, setState] = useState<AppState>({ phase: 'idle' });
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>(() => {
    return (localStorage.getItem('app_activeTab') as 'upload' | 'history') || 'upload';
  });
  const [cookieConsent, setCookieConsent] = useState<boolean>(!!Cookies.get('userId'));
  const [stats, setStats] = useState<GlobalStats | null>(() => {
    const cached = localStorage.getItem('app_globalStats');
    return cached ? JSON.parse(cached) : null;
  });
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const renderStats = (className: string) => (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 text-center ${className}`}>
      {[
        { num: stats ? stats.totalReviews.toLocaleString() : '-', label: 'Resumes Analyzed' },
        { num: stats ? stats.totalRewrites.toLocaleString() : '-', label: 'Bullets Rewritten' },
        { num: stats ? `~${(stats.avgTimeMs / 1000).toFixed(1)}s` : '-', label: 'Avg Response Time' },
      ].map((stat) => (
        <div
          key={stat.label}
          className="glass-panel rounded-3xl p-5 flex flex-col items-center justify-center gap-2 transition-transform hover:-translate-y-1 duration-300"
        >
          <span className="score-gradient text-2xl sm:text-3xl font-black">
            {stat.num}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#D7E2EA]/50 leading-tight">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        localStorage.setItem('app_globalStats', JSON.stringify(data));
      })
      .catch((err) => console.error('Failed to load stats', err));
  }, []);

  useEffect(() => {
    localStorage.setItem('app_activeTab', activeTab);
  }, [activeTab]);

  const handleAcceptCookies = () => {
    Cookies.set('userId', uuidv4(), { expires: 365 });
    setCookieConsent(true);
  };

  const handleReview = async (resumeText: string, jobDescription?: string) => {
    setState({ phase: 'loading', resumeText });

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Review failed.');
      }

      setHistoryRefresh(prev => prev + 1);
      setState({ phase: 'result', resumeText, result: data as ReviewResult });

      // Scroll to top so the user sees the score
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setState({ phase: 'error', resumeText, error: msg });
    }
  };

  const handleSelectHistory = (item: ReviewHistoryItem) => {
    setState({ phase: 'result', resumeText: item.resumeText, result: item.result });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => {
    setState({ phase: 'idle' });
    setActiveTab('upload');
  };

  return (
    <main className="relative min-h-screen w-full bg-transparent flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full px-6 md:px-10 py-4 md:py-5 flex items-center justify-between glass-panel border-x-0 border-t-0 rounded-none bg-white/5 backdrop-blur-2xl">
        <a
          href="/"
          className="flex items-center gap-2 text-[#D7E2EA] font-medium uppercase tracking-widest text-sm sm:text-base"
        >
          <span className="score-gradient font-black text-xl sm:text-2xl">
            R
          </span>
          ATS Resume Analyzer
        </a>
        <span className="text-xs sm:text-sm uppercase tracking-widest text-[#D7E2EA]/40">
          Powered by Gemini
        </span>
      </header>

      <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 md:px-10 py-6 md:py-8">
        {state.phase === 'idle' && (
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-10 items-center lg:items-start my-auto">
            {/* Left Column: Hero & Stats */}
            <div className="flex flex-col gap-8 lg:gap-12 pt-0 lg:pt-4">
              {/* Hero */}
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
                  Drop in your resume. Get a brutally honest, AI-powered review with
                  scores, strengths, weaknesses, and rewritten bullets — in seconds.
                </p>
              </motion.div>

              {/* Trust strip for Desktop (Hidden on Mobile) */}
              {renderStats('hidden lg:grid lg:grid-cols-2 xl:grid-cols-3')}
            </div>

            {/* Right Column: Tabs & Upload/History */}
            <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto lg:mx-0 lg:max-w-none min-h-[500px] lg:min-h-[650px]">
              {/* Main Tabs */}
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
                className="w-full relative"
              >
                <div className={activeTab === 'upload' ? 'block' : 'hidden'}>
                  <UploadZone onSubmit={handleReview} isProcessing={false} />
                </div>
                <div className={activeTab === 'history' ? 'block' : 'hidden'}>
                  <HistoryList 
                    onSelect={handleSelectHistory} 
                    userId={cookieConsent ? Cookies.get('userId') || null : null} 
                    refreshTrigger={historyRefresh} 
                  />
                </div>
              </motion.div>

              {/* Trust strip for Mobile (Hidden on Desktop) */}
              {renderStats('grid lg:hidden mt-4')}
            </div>
          </div>
        )}

        {state.phase === 'loading' && <LoadingState />}

        {state.phase === 'result' && (
          <ResultView
            result={state.result}
            resumeText={state.resumeText}
            onReset={reset}
          />
        )}

        {state.phase === 'error' && (
          <div className="max-w-xl mx-auto flex flex-col items-center gap-6 py-16 text-center">
            <AlertCircle size={48} className="text-red-400" strokeWidth={1.4} />
            <h2 className="text-2xl font-medium text-[#D7E2EA]">
              Couldn't review that resume
            </h2>
            <p className="text-[#D7E2EA]/70 leading-relaxed">{state.error}</p>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] hover:bg-[#D7E2EA]/10 transition-colors"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="glass-panel border-x-0 border-b-0 rounded-none px-6 md:px-10 pt-6 pb-6 sm:flex-row items-center justify-between gap-4 text-xs uppercase tracking-widest text-[#D7E2EA]/60 flex flex-col">
        <span>© 2026 Kishor Annamalai</span>
        <span className="text-center sm:text-right">
          {cookieConsent 
            ? 'Your history is saved in your browser via cookies.' 
            : 'Your resume is processed in real time and never stored.'}
        </span>
      </footer>

      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {!cookieConsent && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 30, scale: 0.95, x: '-50%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 left-1/2 w-[calc(100%-2rem)] max-w-3xl glass-panel-heavy rounded-3xl p-5 sm:p-6 z-50 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="text-sm font-light text-[#D7E2EA] text-center sm:text-left leading-relaxed">
              We use a cookie to save your review history locally. No account needed.
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <button
                onClick={() => setCookieConsent(true)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium glass-button text-[#D7E2EA]/80 hover:text-white"
              >
                Decline
              </button>
              <button
                onClick={handleAcceptCookies}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium bg-white text-[#0C0C0C] hover:bg-[#D7E2EA] transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
              >
                Accept & Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default App;
