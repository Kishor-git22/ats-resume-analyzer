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
          className="fixed bottom-6 left-1/2 w-[calc(100%-2rem)] max-w-3xl glass-panel-heavy rounded-2xl p-5 sm:p-6 z-50 flex flex-col sm:flex-row items-center justify-between gap-5"
        >
          <div className="text-sm font-light text-[#1d1d1f] dark:text-[#f5f5f7] text-center sm:text-left leading-relaxed">
            We use a cookie to save your review history locally. No account needed.
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={onDecline}
              className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-medium glass-button text-[#1d1d1f]/60 dark:text-[#f5f5f7]/60 hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-medium bg-[#1d1d1f] dark:bg-[#f5f5f7] text-white dark:text-[#1d1d1f] hover:opacity-90 transition-all duration-200 shadow-sm"
            >
              Accept & Save
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
