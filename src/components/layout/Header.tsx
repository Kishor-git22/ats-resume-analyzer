export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full px-6 md:px-10 py-4 md:py-5 flex items-center justify-between glass-panel border-x-0 border-t-0 rounded-none bg-white/5 backdrop-blur-2xl">
      <a
        href="/"
        className="flex items-center gap-2 text-[#D7E2EA] font-medium uppercase tracking-widest text-sm sm:text-base"
      >
        <span className="score-gradient font-black text-xl sm:text-2xl">R</span>
        ATS Resume Analyzer
      </a>
      <span className="text-xs sm:text-sm uppercase tracking-widest text-[#D7E2EA]/40">
        Powered by Gemini
      </span>
    </header>
  );
}
