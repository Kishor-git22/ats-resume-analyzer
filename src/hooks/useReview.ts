import { useState } from 'react';
import type { ReviewResult } from '../lib/types';
import { analyzeResume } from '../services/api';

export type AppPhase = 'idle' | 'loading' | 'result' | 'error';

export interface AppState {
  phase: AppPhase;
  resumeText?: string;
  result?: ReviewResult;
  error?: string;
}

export function useReview(onSuccess?: () => void) {
  const [state, setState] = useState<AppState>({ phase: 'idle' });

  const handleReview = async (resumeText: string, jobDescription?: string) => {
    setState({ phase: 'loading', resumeText });
    window.location.hash = 'loading';

    try {
      const data = await analyzeResume(resumeText, jobDescription);

      setState({ phase: 'result', resumeText, result: data });
      window.location.replace(window.location.pathname + window.location.search + '#result');
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setState({ phase: 'error', resumeText, error: msg });
      window.location.replace(window.location.pathname + window.location.search + '#error');
    }
  };

  const showHistoryItem = (resumeText: string, result: ReviewResult) => {
    window.location.hash = 'result';
    setState({ phase: 'result', resumeText, result });
  };

  const reset = () => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setState({ phase: 'idle' });
  };

  return {
    state,
    handleReview,
    showHistoryItem,
    reset,
  };
}
