interface FooterProps {
  cookieConsent: boolean;
}

export default function Footer({ cookieConsent }: FooterProps) {
  return (
    <footer className="glass-panel border-x-0 border-b-0 rounded-none px-6 md:px-10 pt-6 pb-6 sm:flex-row items-center justify-between gap-4 text-xs uppercase tracking-widest text-[#D7E2EA]/60 flex flex-col">
      <span>© 2026 Kishor Annamalai</span>
      <span className="text-center sm:text-right">
        {cookieConsent
          ? 'Your history is saved in your browser via cookies.'
          : 'Your resume is processed in real time and never stored.'}
      </span>
    </footer>
  );
}
