import { Github, Linkedin, Mail } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full px-6 md:px-10 py-4 md:py-5 flex items-center justify-between glass-panel border-x-0 border-t-0 rounded-none bg-white/5 backdrop-blur-2xl">
      <a
        href="/"
        className="flex items-center gap-2 text-[#D7E2EA] font-medium uppercase tracking-widest text-sm sm:text-base group"
      >
        <span className="score-gradient font-black text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">
          ATS
        </span>
        Resume Analyzer
      </a>
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-inner backdrop-blur-md">
          <a
            href="https://github.com/Kishor-git22/ats-resume-analyzer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D7E2EA]/60 hover:text-white hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-300"
            title="GitHub"
          >
            <Github className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </a>
          <a
            href="https://www.linkedin.com/in/kishor-annamalai/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D7E2EA]/60 hover:text-[#0A66C2] hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(10,102,194,0.4)] transition-all duration-300"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </a>
          <a
            href="mailto:kishora.2204@gmail.com"
            className="text-[#D7E2EA]/60 hover:text-[#EA4335] hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(234,67,53,0.4)] transition-all duration-300"
            title="Email"
          >
            <Mail className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </a>
        </div>

        <div className="hidden sm:block w-px h-6 bg-white/10" />

        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#D7E2EA]/40 hidden sm:flex items-center gap-1.5">
          Powered by
          <span className="score-gradient font-bold">Gemini</span>
        </span>
      </div>
    </header>
  );
}
