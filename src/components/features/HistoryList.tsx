import { useEffect, useState } from 'react';
import { Clock, ChevronRight, FileText, Briefcase } from 'lucide-react';
import type { ReviewHistoryItem } from '../../lib/types';

interface HistoryListProps {
  onSelect: (item: ReviewHistoryItem) => void;
  userId: string | null;
  refreshTrigger?: number;
}

const HistoryList = ({ onSelect, userId, refreshTrigger }: HistoryListProps) => {
  const [history, setHistory] = useState<ReviewHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(!!userId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/history');
        if (!res.ok) throw new Error('Failed to fetch history');
        const data = await res.json();
        setHistory(data);
      } catch {
        setError('Could not load history.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [userId, refreshTrigger]);

  if (!userId) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-10 p-10 text-center rounded-2xl glass-panel">
        <Clock
          size={40}
          className="mx-auto mb-4 text-[#1d1d1f]/40 dark:text-[#f5f5f7]/40"
          strokeWidth={1.5}
        />
        <h3 className="text-xl font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
          History Disabled
        </h3>
        <p className="text-[#1d1d1f]/70 dark:text-[#f5f5f7]/60 font-light max-w-sm mx-auto">
          Please accept cookies at the bottom of the screen to enable saving and viewing your review
          history.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-10 p-10 text-center rounded-2xl glass-panel">
        <div className="animate-soft-pulse text-[#1d1d1f]/75 dark:text-[#f5f5f7]/70 uppercase tracking-widest text-sm">
          Loading history...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-10 p-10 text-center rounded-2xl glass-panel border-red-500/30 bg-red-500/10">
        <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-10 p-10 text-center rounded-2xl glass-panel">
        <Clock
          size={40}
          className="mx-auto mb-4 text-[#1d1d1f]/40 dark:text-[#f5f5f7]/40"
          strokeWidth={1.5}
        />
        <h3 className="text-xl font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
          No past reviews
        </h3>
        <p className="text-[#1d1d1f]/70 dark:text-[#f5f5f7]/60 font-light max-w-sm mx-auto">
          Submit your first resume to see your history here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 space-y-2.5 h-full overflow-y-auto no-scrollbar pb-8 px-1">
      {history.map((item) => {
        const date = new Date(item.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        return (
          <button
            key={item._id}
            onClick={() => onSelect(item)}
            className="w-full text-left p-4 sm:p-5 rounded-2xl glass-panel hover:glass-panel-heavy transition-all duration-200 group flex items-center justify-between min-h-[64px]"
          >
            <div className="flex items-center gap-4 overflow-hidden">
              {/* Score Badge */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-white/40 dark:bg-black/20 group-hover:bg-white/60 dark:group-hover:bg-black/30 transition-colors shadow-sm">
                <span className="text-xl font-black score-gradient leading-none">
                  {item.result.overallScore}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#1d1d1f]/50 dark:text-[#f5f5f7]/40 mt-1 font-medium">
                  Score
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1 overflow-hidden">
                <div className="flex items-center gap-3">
                  <span className="text-[#1d1d1f] dark:text-[#f5f5f7] font-medium text-base sm:text-lg truncate">
                    {item.jobDescription ? 'Tailored Review' : 'General Review'}
                  </span>
                  <span className="text-[#1d1d1f]/50 dark:text-[#f5f5f7]/40 text-[10px] sm:text-[11px] uppercase tracking-widest px-2.5 py-0.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.04] whitespace-nowrap">
                    {date}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs sm:text-sm text-[#1d1d1f]/60 dark:text-[#f5f5f7]/60">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <FileText
                      size={14}
                      className="text-[#1d1d1f]/40 dark:text-[#f5f5f7]/30 shrink-0"
                    />
                    <span className="truncate max-w-[150px] sm:max-w-[250px]">
                      {item.resumeText.replace(/\n/g, ' ').slice(0, 45).trim()}...
                    </span>
                  </div>
                  {item.jobDescription && (
                    <div className="hidden sm:flex items-center gap-1.5 shrink-0 pl-3 border-l border-black/10 dark:border-white/10">
                      <Briefcase size={14} className="text-[#1d1d1f]/40 dark:text-[#f5f5f7]/30" />
                      <span>Targeted</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-transparent group-hover:bg-black/[0.04] dark:group-hover:bg-white/[0.04] transition-colors shrink-0 ml-2 sm:ml-4">
              <ChevronRight
                size={18}
                className="text-[#1d1d1f]/35 dark:text-[#f5f5f7]/35 group-hover:text-[#1d1d1f]/80 dark:group-hover:text-[#f5f5f7]/80 group-hover:translate-x-0.5 transition-all"
              />
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default HistoryList;
