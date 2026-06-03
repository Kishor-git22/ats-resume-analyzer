import { useState, useEffect } from 'react';

type Tab = 'upload' | 'history';

export function useAppTabs() {
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    return (localStorage.getItem('app_activeTab') as Tab) || 'upload';
  });

  useEffect(() => {
    localStorage.setItem('app_activeTab', activeTab);
  }, [activeTab]);

  return { activeTab, setActiveTab };
}
