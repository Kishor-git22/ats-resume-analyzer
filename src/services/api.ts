import type { GlobalStats, ReviewHistoryItem, ReviewResult } from '../lib/types';

export async function fetchStats(): Promise<GlobalStats> {
  const res = await fetch('/api/stats');
  if (!res.ok) {
    throw new Error('Failed to fetch stats');
  }
  return res.json();
}

export async function fetchHistory(): Promise<ReviewHistoryItem[]> {
  const res = await fetch('/api/history');
  if (!res.ok) {
    throw new Error('Failed to fetch history');
  }
  return res.json();
}

export async function analyzeResume(
  resumeText: string,
  jobDescription?: string,
): Promise<ReviewResult> {
  const res = await fetch('/api/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText, jobDescription }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Review failed.');
  }

  return data as ReviewResult;
}
