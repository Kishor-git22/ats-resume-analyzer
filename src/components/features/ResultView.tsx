import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertTriangle, Sparkles, ChevronRight } from 'lucide-react';
import type { ReviewResult, CategoryScores } from '../../lib/types';

interface ResultViewProps {
  result: ReviewResult;
  resumeText: string;
  onReset: () => void;
}

const CATEGORY_LABELS: Record<keyof CategoryScores, string> = {
  clarity: 'Clarity',
  impact: 'Impact',
  atsCompatibility: 'ATS',
  structure: 'Structure',
};

const scoreColor = (score: number): string => {
  if (score >= 80) return '#4ade80'; // green
  if (score >= 60) return '#facc15'; // yellow
  if (score >= 40) return '#fb923c'; // orange
  return '#f87171'; // red
};

const scoreLabel = (score: number): string => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Strong';
  if (score >= 55) return 'Decent';
  if (score >= 40) return 'Needs work';
  return 'Weak';
};

const ResultView = ({ result, resumeText, onReset }: ResultViewProps) => {
  return (
    <div className="w-full flex-1 min-h-0 overflow-y-auto no-scrollbar px-1">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-10 sm:gap-14 pb-10 pt-2">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest glass-button px-4 py-2 rounded-xl text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 hover:text-[#1d1d1f] dark:hover:text-white min-h-[44px]"
          >
            <ArrowLeft size={16} strokeWidth={1.8} />
            Review another
          </button>
          <span className="text-xs uppercase tracking-widest text-[#1d1d1f]/45 dark:text-[#f5f5f7]/40">
            {resumeText.length.toLocaleString()} chars analysed
          </span>
        </div>

        {/* Hero score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center flex flex-col items-center gap-4 sm:gap-6"
        >
          <span className="text-xs sm:text-sm uppercase tracking-widest text-[#1d1d1f]/60 dark:text-[#f5f5f7]/50">
            Overall Score
          </span>
          <div className="flex flex-col items-center">
            <span
              className="score-gradient font-black leading-none"
              style={{ fontSize: 'clamp(6rem, 22vw, 18rem)' }}
            >
              {result.overallScore}
            </span>
            <span
              className="font-medium uppercase tracking-widest mt-2"
              style={{ color: scoreColor(result.overallScore) }}
            >
              {scoreLabel(result.overallScore)}
            </span>
          </div>
          <p
            className="max-w-2xl font-light text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 leading-relaxed"
            style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)' }}
          >
            {result.summary}
          </p>
        </motion.div>

        {/* Category bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          {(Object.keys(CATEGORY_LABELS) as Array<keyof CategoryScores>).map((key) => {
            const score = result.categoryScores[key];
            return (
              <div key={key} className="rounded-2xl glass-panel p-5 sm:p-6 flex flex-col gap-3">
                <span className="text-xs uppercase tracking-widest text-[#1d1d1f]/60 dark:text-[#f5f5f7]/50">
                  {CATEGORY_LABELS[key]}
                </span>
                <span
                  className="text-3xl sm:text-4xl font-black"
                  style={{ color: scoreColor(score) }}
                >
                  {score}
                  <span className="text-base text-[#1d1d1f]/40 dark:text-[#f5f5f7]/30 font-light">
                    /100
                  </span>
                </span>
                <div className="h-1.5 w-full rounded-full bg-black/10 dark:bg-black/40 overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: scoreColor(score) }}
                  />
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Strengths + Weaknesses two-column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="rounded-2xl border border-green-600/15 dark:border-green-500/20 bg-green-50/40 dark:bg-green-500/5 backdrop-blur-md p-6 sm:p-8 flex flex-col gap-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2
                size={22}
                className="text-green-600 dark:text-green-400"
                strokeWidth={1.6}
              />
              <h3 className="text-lg sm:text-xl font-medium uppercase tracking-widest text-[#1d1d1f] dark:text-[#f5f5f7]">
                Strengths
              </h3>
            </div>
            <ul className="flex flex-col gap-4">
              {result.strengths.map((s, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-[#1d1d1f]/90 dark:text-[#f5f5f7]/90 leading-relaxed"
                >
                  <span className="text-green-600/70 dark:text-green-400/60 font-medium shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-2xl border border-amber-600/15 dark:border-amber-500/20 bg-amber-50/40 dark:bg-amber-500/5 backdrop-blur-md p-6 sm:p-8 flex flex-col gap-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle
                size={22}
                className="text-amber-600 dark:text-amber-400"
                strokeWidth={1.6}
              />
              <h3 className="text-lg sm:text-xl font-medium uppercase tracking-widest text-[#1d1d1f] dark:text-[#f5f5f7]">
                Weaknesses
              </h3>
            </div>
            <ul className="flex flex-col gap-4">
              {result.weaknesses.map((w, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-[#1d1d1f]/90 dark:text-[#f5f5f7]/90 leading-relaxed"
                >
                  <span className="text-amber-600/70 dark:text-amber-400/60 font-medium shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        </div>

        {/* Missing sections */}
        {result.missingSections && result.missingSections.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="rounded-2xl glass-panel p-6 sm:p-8 flex flex-col gap-4"
          >
            <h3 className="text-lg sm:text-xl font-medium uppercase tracking-widest text-[#1d1d1f] dark:text-[#f5f5f7]">
              Missing sections
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.missingSections.map((m, i) => (
                <span
                  key={i}
                  className="px-4 py-1.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.04] text-sm text-[#1d1d1f]/90 dark:text-[#f5f5f7]/90"
                >
                  {m}
                </span>
              ))}
            </div>
          </motion.section>
        )}

        {/* Rewrites */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-3">
            <Sparkles size={22} className="text-[#B600A8]" strokeWidth={1.6} />
            <h3 className="text-lg sm:text-xl font-medium uppercase tracking-widest text-[#1d1d1f] dark:text-[#f5f5f7]">
              Suggested rewrites
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            {result.rewrites.map((r, i) => (
              <article
                key={i}
                className="rounded-2xl glass-panel p-5 sm:p-6 md:p-7 flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-widest text-[#1d1d1f]/45 dark:text-[#f5f5f7]/40">
                    Rewrite {i + 1}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-[#1d1d1f]/70 dark:text-[#f5f5f7]/60">
                    · {r.reason}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-5 items-stretch">
                  <div className="rounded-xl glass-input border-amber-500/20 p-4 sm:p-5">
                    <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400/70 block mb-2">
                      Original
                    </span>
                    <p className="text-sm sm:text-base text-[#1d1d1f]/75 dark:text-[#f5f5f7]/70 leading-relaxed line-through decoration-amber-500/40">
                      {r.original}
                    </p>
                  </div>

                  <div className="hidden md:flex items-center justify-center">
                    <ChevronRight
                      size={22}
                      className="text-[#1d1d1f]/40 dark:text-[#f5f5f7]/40"
                      strokeWidth={1.6}
                    />
                  </div>

                  <div className="rounded-xl glass-input border-green-500/25 p-4 sm:p-5 shadow-sm">
                    <span className="text-xs uppercase tracking-widest text-green-600 dark:text-green-400/80 block mb-2">
                      Suggested
                    </span>
                    <p className="text-sm sm:text-base text-[#1d1d1f] dark:text-[#f5f5f7] leading-relaxed font-medium">
                      {r.suggested}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </motion.section>

        {/* Footer CTA */}
        <div className="flex justify-center pt-4 pb-12">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-3 rounded-xl glass-button border border-black/10 dark:border-white/10 px-10 py-3.5 text-sm sm:text-base font-medium uppercase tracking-widest text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all shadow-sm min-h-[44px]"
          >
            <ArrowLeft size={18} strokeWidth={1.8} />
            Review another resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
