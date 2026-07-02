'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useMobileMenu } from '@/contexts/MobileMenuContext';
import StartupFormModal from './StartupFormModal';
import Link from 'next/link';
import { Startup } from '@/services/api';
import ThemeToggle from './ThemeToggle';

export default function TopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { toggle } = useMobileMenu();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const getTitle = () => {
    if (pathname === '/') return 'Dashboard';
    const path = pathname.split('/')[1];
    return path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Dashboard';
  };

  const filteredStartups = searchTerm.trim() === '' ? [] : startups.filter(s => 
    s.startup_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.startup_id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.founder_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  return (
    <header className="fixed top-0 left-0 lg:left-[280px] w-full lg:w-[calc(100%-280px)] h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-4 lg:px-margin-desktop z-40 transition-all duration-300">
      <div className="flex items-center gap-4 lg:gap-6 flex-1">
        <button 
          onClick={toggle}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-xl lg:text-2xl font-headline-md text-on-surface font-bold hidden sm:block">{getTitle()}</h2>
        
        <div className="relative w-full max-w-md lg:ml-8" ref={searchRef}>
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            className="w-full bg-surface-variant border border-transparent rounded-lg pl-10 pr-4 py-2 text-sm focus:border-brand-orange focus:bg-surface-container-lowest transition-all text-on-surface placeholder-on-surface-variant/70 outline-none" 
            placeholder="Search..." 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
          
          {/* Search Dropdown */}
          {isFocused && searchTerm.trim() !== '' && (
            <div className="absolute top-full left-0 w-full mt-2 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg shadow-black/5 overflow-hidden z-50">
              {isFetching ? (
                <div className="p-4 text-center text-sm text-on-surface-variant flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  Loading...
                </div>
              ) : filteredStartups.length > 0 ? (
                <div className="py-2">
                  {filteredStartups.map(startup => (
                    <button
                      key={startup.startup_id}
                      onClick={() => {
                        router.push(`/startups/${startup.startup_id}`);
                        setIsFocused(false);
                        setSearchTerm('');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-surface-variant/50 transition-colors flex items-center gap-3 border-b border-outline-variant/30 last:border-0"
                    >
                      <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center shrink-0 overflow-hidden text-brand-orange font-bold text-xs">
                        {startup.logo && startup.logo.startsWith('http') ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={startup.logo} alt="" className="w-full h-full object-cover" />
                        ) : (
                          startup.startup_name.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-on-surface truncate">{startup.startup_name}</p>
                        <p className="text-xs text-on-surface-variant truncate flex gap-2">
                          <span>{startup.startup_id}</span>
                          <span>•</span>
                          <span>{startup.founder_name}</span>
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-on-surface-variant">
                  No results found for "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <ThemeToggle />
        
        {(session?.user as any)?.permissions?.canAdd && (
          <>
            <div className="h-8 w-[1px] bg-outline-variant"></div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-brand-orange text-white px-3 md:px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition-all shadow-md shadow-brand-orange/20"
              title="New Startup"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
              <span className="hidden md:inline">New Startup</span>
            </button>
          </>
        )}
      </div>

      <StartupFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="create"
      />
    </header>
  );
}
