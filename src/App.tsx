import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');
  const [cookieConsent, setCookieConsent] = useState<boolean>(!!Cookies.get('userId'));
  const [stats, setStats] = useState<GlobalStats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error('Failed to load stats', err));
  }, []);

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
    <main className="relative min-h-screen w-full bg-[#0C0C0C] pb-24">
      {/* Header */}
      <header className="w-full px-6 md:px-10 pt-6 md:pt-8 flex items-center justify-between">
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

      <div className="px-5 sm:px-8 md:px-10 pt-12 sm:pt-20 md:pt-24 pb-16">
        {state.phase === 'idle' && (
          <>
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center flex flex-col items-center gap-6 mb-12 sm:mb-16"
            >
              <h1
                className="hero-heading font-black uppercase leading-none tracking-tight"
                style={{ fontSize: 'clamp(3rem, 11vw, 9rem)' }}
              >
                Resume reviewer
              </h1>
              <p
                className="max-w-2xl font-light text-[#D7E2EA]/70 leading-relaxed"
                style={{ fontSize: 'clamp(1rem, 1.7vw, 1.25rem)' }}
              >
                Drop in your resume. Get a brutally honest, AI-powered review with
                scores, strengths, weaknesses, and rewritten bullets — in seconds.
              </p>
            </motion.div>

            {/* Main Tabs */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-6 py-3 rounded-full text-sm uppercase tracking-widest font-medium transition-colors ${
                  activeTab === 'upload'
                    ? 'bg-[#D7E2EA] text-[#0C0C0C]'
                    : 'bg-[#141418] text-[#D7E2EA]/60 hover:text-[#D7E2EA] border border-[#D7E2EA]/15'
                }`}
              >
                Analyze Resume
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-3 rounded-full text-sm uppercase tracking-widest font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'bg-[#D7E2EA] text-[#0C0C0C]'
                    : 'bg-[#141418] text-[#D7E2EA]/60 hover:text-[#D7E2EA] border border-[#D7E2EA]/15'
                }`}
              >
                My History
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {activeTab === 'upload' ? (
                <UploadZone onSubmit={handleReview} isProcessing={false} />
              ) : (
                <HistoryList onSelect={handleSelectHistory} userId={cookieConsent ? Cookies.get('userId') || null : null} />
              )}
            </motion.div>

            {/* Trust strip */}
            {activeTab === 'upload' && (
              <div className="mt-16 sm:mt-20 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                {[
                  { num: stats ? stats.totalReviews.toLocaleString() : '-', label: 'Resumes Analyzed' },
                  { num: stats ? stats.totalRewrites.toLocaleString() : '-', label: 'Bullets Rewritten' },
                  { num: stats ? `~${(stats.avgTimeMs / 1000).toFixed(1)}s` : '-', label: 'Avg Response Time' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-[#D7E2EA]/10 bg-[#141418]/50 p-5 flex flex-col items-center gap-2"
                  >
                    <span className="score-gradient text-3xl sm:text-4xl font-black">
                      {stat.num}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-[#D7E2EA]/50">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
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
      <footer className="border-t border-[#D7E2EA]/10 px-6 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs uppercase tracking-widest text-[#D7E2EA]/40">
        <span>© 2026 Harsh Goyal</span>
        <span>
          {cookieConsent 
            ? 'Your history is saved in your browser via cookies.' 
            : 'Your resume is processed in real time and never stored.'}
        </span>
      </footer>

      {/* Cookie Consent Banner */}
      {!cookieConsent && (
        <div className="fixed bottom-0 left-0 w-full bg-[#B600A8]/20 border-t border-[#B600A8]/40 backdrop-blur-md p-4 sm:p-6 z-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[#D7E2EA]">
            We use a cookie to save your review history locally. No account needed.
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setCookieConsent(true)}
              className="px-5 py-2 rounded-full text-xs uppercase tracking-widest font-medium border border-[#D7E2EA]/30 text-[#D7E2EA]/70 hover:text-[#D7E2EA] hover:bg-[#D7E2EA]/10 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAcceptCookies}
              className="px-5 py-2 rounded-full text-xs uppercase tracking-widest font-medium bg-[#D7E2EA] text-[#0C0C0C] hover:bg-white transition-colors"
            >
              Accept & Save History
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
