import { useState, useEffect, useDeferredValue } from 'react';
import { Startup } from '@/services/api';

export function useStartupSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [isFocused, setIsFocused] = useState(false);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  // Fetch startups when focused (cache it)
  useEffect(() => {
    if (isFocused && startups.length === 0 && !isFetching) {
      setIsFetching(true);
      fetch('/api/startups', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setStartups(data);
        })
        .catch(console.error)
        .finally(() => setIsFetching(false));
    }
  }, [isFocused, startups.length, isFetching]);

  const filteredStartups = deferredSearchTerm.trim() === '' ? [] : startups.filter(s => 
    s.startup_name?.toLowerCase().includes(deferredSearchTerm.toLowerCase()) || 
    s.startup_id?.toLowerCase().includes(deferredSearchTerm.toLowerCase()) || 
    s.founder_name?.toLowerCase().includes(deferredSearchTerm.toLowerCase())
  ).slice(0, 5);

  return {
    searchTerm,
    setSearchTerm,
    isFocused,
    setIsFocused,
    isFetching,
    filteredStartups
  };
}
