import type { GlobalStats } from '../../lib/types';

interface GlobalStatsBannerProps {
  stats: GlobalStats | null;
  className?: string;
}

export default function GlobalStatsBanner({ stats, className = '' }: GlobalStatsBannerProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 text-center ${className}`}>
      {[
        { num: stats ? stats.totalReviews.toLocaleString() : '-', label: 'Resumes Analyzed' },
        { num: stats ? stats.totalRewrites.toLocaleString() : '-', label: 'Bullets Rewritten' },
        {
          num: stats ? `~${(stats.avgTimeMs / 1000).toFixed(1)}s` : '-',
          label: 'Avg Response Time',
        },
      ].map((stat) => (
        <div
          key={stat.label}
          className="glass-panel rounded-3xl p-5 flex flex-col items-center justify-center gap-2 transition-transform hover:-translate-y-1 duration-300"
        >
          <span className="score-gradient text-2xl sm:text-3xl font-black">{stat.num}</span>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#D7E2EA]/50 leading-tight">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
