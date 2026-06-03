import { motion, AnimatePresence } from 'framer-motion';

interface CookieBannerProps {
  show: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function CookieBanner({ show, onAccept, onDecline }: CookieBannerProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 30, scale: 0.95, x: '-50%' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-1/2 w-[calc(100%-2rem)] max-w-3xl glass-panel-heavy rounded-3xl p-5 sm:p-6 z-50 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <div className="text-sm font-light text-[#D7E2EA] text-center sm:text-left leading-relaxed">
            We use a cookie to save your review history locally. No account needed.
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={onDecline}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium glass-button text-[#D7E2EA]/80 hover:text-white"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium bg-white text-[#0C0C0C] hover:bg-[#D7E2EA] transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
            >
              Accept & Save
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
