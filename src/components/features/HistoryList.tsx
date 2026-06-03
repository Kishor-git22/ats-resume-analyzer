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
    <div className="w-full max-w-3xl mx-auto mt-6 space-y-4">
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
            className="w-full text-left p-5 sm:p-6 rounded-[24px] glass-panel hover:glass-panel-heavy hover:scale-[1.01] active:scale-100 transition-all duration-300 group flex items-center justify-between"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-[#D7E2EA] font-medium text-lg">
                  Score: {item.result.overallScore}
                </span>
                <span className="text-[#D7E2EA]/40 text-xs uppercase tracking-widest">{date}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-[#D7E2EA]/70">
                <div className="flex items-center gap-1.5">
                  <FileText size={14} className="text-[#D7E2EA]/50" />
                  <span className="truncate max-w-[150px] sm:max-w-[200px]">
                    {item.resumeText.slice(0, 30)}...
                  </span>
                </div>
                {item.jobDescription && (
                  <div className="flex items-center gap-1.5 hidden sm:flex">
                    <Briefcase size={14} className="text-[#D7E2EA]/50" />
                    <span className="truncate max-w-[200px]">Tailored for Job</span>
                  </div>
                )}
              </div>
            </div>

            <ChevronRight
              size={24}
              className="text-[#D7E2EA]/20 group-hover:text-[#D7E2EA]/60 transition-colors"
            />
          </button>
        );
      })}
    </div>
  );
};

export default HistoryList;
