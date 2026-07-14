import { useEffect, useState } from 'react';
import type { GlobalStats } from '../../lib/types';

interface CountUpProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

function CountUp({ value, duration = 1500, prefix = '', suffix = '', decimals = 0 }: CountUpProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Easing out quad
      const easeProgress = progress * (2 - progress);
      setCount(easeProgress * value);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  const display = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString();

  return (
    <>
      {prefix}
      {display}
      {suffix}
    </>
  );
}

interface GlobalStatsBannerProps {
  stats: GlobalStats | null;
  className?: string;
}

export default function GlobalStatsBanner({ stats, className = '' }: GlobalStatsBannerProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 text-center ${className}`}>
      {[
        {
          num: stats ? <CountUp value={stats.totalReviews} /> : '-',
          label: 'Resumes Analyzed',
        },
        {
          num: stats ? <CountUp value={stats.totalRewrites} /> : '-',
          label: 'Bullets Rewritten',
        },
        {
          num: stats ? (
            <CountUp value={stats.avgTimeMs / 1000} decimals={1} prefix="~" suffix="s" />
          ) : (
            '-'
          ),
          label: 'Avg Response Time',
        },
      ].map((stat) => (
        <div
          key={stat.label}
          className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 duration-200"
        >
          <span className="score-gradient text-2xl sm:text-3xl font-black">{stat.num}</span>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#1d1d1f]/45 dark:text-[#f5f5f7]/40 leading-tight">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
