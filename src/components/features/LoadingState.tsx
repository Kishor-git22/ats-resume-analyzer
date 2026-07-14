import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const MESSAGES = [
  'Reading your resume…',
  'Checking impact and quantification…',
  'Scoring clarity & writing quality…',
  'Looking at ATS keywords…',
  'Drafting rewrite suggestions…',
  'Almost there…',
];

const LoadingState = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 w-full max-w-lg mx-auto glass-panel rounded-2xl">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-2 border-black/10 dark:border-white/10 border-t-[#1d1d1f] dark:border-t-[#f5f5f7] shadow-sm animate-spin-slow" />
        <Sparkles
          size={32}
          className="absolute inset-0 m-auto text-[#1d1d1f] dark:text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.15)] animate-soft-pulse"
          strokeWidth={1.4}
        />
      </div>
      <p
        key={idx}
        className="text-base sm:text-lg font-light uppercase tracking-widest text-[#1d1d1f] dark:text-[#f5f5f7] animate-soft-pulse text-center px-6"
      >
        {MESSAGES[idx]}
      </p>
    </div>
  );
};

export default LoadingState;
