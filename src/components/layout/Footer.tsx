interface FooterProps {
  cookieConsent: boolean;
}

export default function Footer({ cookieConsent }: FooterProps) {
  return (
    <footer className="glass-panel border-x-0 border-b-0 rounded-none px-4 sm:px-6 md:px-10 py-5 sm:flex-row items-center justify-between gap-3 text-xs uppercase tracking-widest text-[#1d1d1f]/40 dark:text-[#f5f5f7]/40 flex flex-col">
      <span>© {new Date().getFullYear()} Kishor Annamalai</span>
      <span className="text-center sm:text-right">
        {cookieConsent
          ? 'Your history is saved in your browser via cookies.'
          : 'Your resume is processed in real time and never stored.'}
      </span>
    </footer>
  );
}
