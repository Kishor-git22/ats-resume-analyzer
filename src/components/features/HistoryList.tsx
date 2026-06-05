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
      <div className="w-full max-w-3xl mx-auto mt-10 p-10 text-center rounded-[32px] glass-panel">
        <Clock size={40} className="mx-auto mb-4 text-[#D7E2EA]/40" strokeWidth={1.5} />
        <h3 className="text-xl font-medium text-[#D7E2EA] mb-2">History Disabled</h3>
        <p className="text-[#D7E2EA]/60 font-light max-w-sm mx-auto">
          Please accept cookies at the bottom of the screen to enable saving and viewing your review
          history.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-10 p-10 text-center rounded-[32px] glass-panel">
        <div className="animate-soft-pulse text-[#D7E2EA]/70 uppercase tracking-widest text-sm">
          Loading history...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-10 p-10 text-center rounded-[32px] glass-panel border-red-500/40 bg-red-500/10">
        <p className="text-red-200 text-sm">{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-10 p-10 text-center rounded-[32px] glass-panel">
        <Clock size={40} className="mx-auto mb-4 text-[#D7E2EA]/40" strokeWidth={1.5} />
        <h3 className="text-xl font-medium text-[#D7E2EA] mb-2">No past reviews</h3>
        <p className="text-[#D7E2EA]/60 font-light max-w-sm mx-auto">
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
            className="w-full text-left p-4 sm:p-5 rounded-[32px] glass-panel hover:glass-panel-heavy transition-all duration-300 group flex items-center justify-between"
          >
            <div className="flex items-center gap-5 overflow-hidden">
              {/* Score Badge */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-[18px] bg-black/20 group-hover:bg-black/30 transition-colors shadow-inner">
                <span className="text-2xl font-black score-gradient leading-none">
                  {item.result.overallScore}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#D7E2EA]/40 mt-1 font-medium">
                  Score
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1.5 overflow-hidden">
                <div className="flex items-center gap-3">
                  <span className="text-[#D7E2EA] font-medium text-base sm:text-lg truncate">
                    {item.jobDescription ? 'Tailored Review' : 'General Review'}
                  </span>
                  <span className="text-[#D7E2EA]/40 text-[10px] sm:text-[11px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-black/20 whitespace-nowrap">
                    {date}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs sm:text-sm text-[#D7E2EA]/60">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <FileText size={14} className="text-[#D7E2EA]/30 shrink-0" />
                    <span className="truncate max-w-[150px] sm:max-w-[250px]">
                      {item.resumeText.replace(/\n/g, ' ').slice(0, 45).trim()}...
                    </span>
                  </div>
                  {item.jobDescription && (
                    <div className="hidden sm:flex items-center gap-1.5 shrink-0 pl-3 border-l border-white/10">
                      <Briefcase size={14} className="text-[#D7E2EA]/30" />
                      <span>Targeted</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-transparent group-hover:bg-white/5 transition-colors shrink-0 ml-2 sm:ml-4">
              <ChevronRight
                size={20}
                className="text-[#D7E2EA]/30 group-hover:text-[#D7E2EA]/80 group-hover:translate-x-0.5 transition-all"
              />
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default HistoryList;
