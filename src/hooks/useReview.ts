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

    try {
      const data = await analyzeResume(resumeText, jobDescription);

      setState({ phase: 'result', resumeText, result: data });
      onSuccess?.();

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setState({ phase: 'error', resumeText, error: msg });
    }
  };

  const showHistoryItem = (resumeText: string, result: ReviewResult) => {
    setState({ phase: 'result', resumeText, result });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => {
    setState({ phase: 'idle' });
  };

  return {
    state,
    handleReview,
    showHistoryItem,
    reset,
  };
}
