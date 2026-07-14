import { Github, Linkedin, Mail, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 md:px-10 py-3 flex items-center justify-between glass-panel border-x-0 border-t-0 rounded-none">
      <a
        href="/"
        className="flex items-center gap-2 text-[#1d1d1f] dark:text-[#f5f5f7] font-medium uppercase tracking-widest text-xs sm:text-sm md:text-base group"
      >
        <span className="score-gradient font-black text-lg sm:text-xl md:text-2xl group-hover:scale-105 transition-transform duration-200">
          ATS
        </span>
        Resume Analyzer
      </a>
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06]">
          <a
            href="https://github.com/Kishor-git22/ats-resume-analyzer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1d1d1f]/50 dark:text-[#f5f5f7]/50 hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors duration-200"
            title="GitHub"
          >
            <Github className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </a>
          <a
            href="https://www.linkedin.com/in/kishor-annamalai/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1d1d1f]/50 dark:text-[#f5f5f7]/50 hover:text-[#0A66C2] transition-colors duration-200"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </a>
          <a
            href="mailto:kishora.2204@gmail.com"
            className="text-[#1d1d1f]/50 dark:text-[#f5f5f7]/50 hover:text-[#EA4335] transition-colors duration-200"
            title="Email"
          >
            <Mail className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </a>
        </div>

        <button
          type="button"
          onClick={(e) => {
            if (
              !document.startViewTransition ||
              window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ) {
              toggleTheme();
              return;
            }
            const rect = e.currentTarget.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            const endRadius = Math.hypot(
              Math.max(x, window.innerWidth - x),
              Math.max(y, window.innerHeight - y),
            );
            const transition = document.startViewTransition(() => {
              toggleTheme();
            });
            transition.ready.then(() => {
              document.documentElement.animate(
                [
                  { clipPath: `circle(0px at ${x}px ${y}px)` },
                  { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` },
                ],
                {
                  duration: 500,
                  easing: 'cubic-bezier(0.3, 0, 0, 1)',
                  pseudoElement: '::view-transition-new(root)',
                },
              );
            });
          }}
          className="p-2 rounded-lg glass-button text-[#1d1d1f] dark:text-[#f5f5f7] hover:scale-105 transition-all duration-200 flex items-center justify-center"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          )}
        </button>

        <div className="hidden sm:block w-px h-5 bg-black/[0.06] dark:bg-white/[0.08]" />

        <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] text-[#1d1d1f]/35 dark:text-[#f5f5f7]/35 hidden sm:flex items-center gap-1.5">
          Powered by
          <span className="score-gradient font-bold">Gemini</span>
        </span>
      </div>
    </header>
  );
}
