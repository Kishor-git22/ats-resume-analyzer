import { useState, useEffect, useCallback } from 'react';
import type { GlobalStats } from '../lib/types';
import { fetchStats } from '../services/api';

export function useStats() {
  const [stats, setStats] = useState<GlobalStats | null>(() => {
    const cached = localStorage.getItem('app_globalStats');
    return cached ? JSON.parse(cached) : null;
  });

  const refreshStats = useCallback(() => {
    fetchStats()
      .then((data) => {
        setStats(data);
        localStorage.setItem('app_globalStats', JSON.stringify(data));
      })
      .catch((err) => console.error('Failed to load stats', err));
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return { stats, refreshStats };
}
