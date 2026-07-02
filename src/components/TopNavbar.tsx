'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import StartupFormModal from './StartupFormModal';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useStartupSearch } from '@/hooks/useStartupSearch';

export default function TopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const fallbackImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuBDw8RG7islAC7a6nT-0wWr4MtgLNuO7ra0O_KkizFiA0MRlf5v8b7PLjcdbppYtD7MCSUgOVNtbKv6ogzV3ZqKlJUCARmPuHjDiBoEqWAtUq9Jv4cf3iqjghXJRg-DCa_xX4hadln40Ei9jaCUVj1qhWvP-J-G-7kd9fl1f82c3CHKhcihzB3pVAj64CMJHPb-sfKoxJzmBOrdOLGGwEqQzsVvR5SSS6GxqlV-WQTn4I9TPjF9TA-puqWETFPRu3RgaP6rh-ihHKnz";

  const {
    searchTerm,
    setSearchTerm,
    isFocused,
    setIsFocused,
    isFetching,
    filteredStartups
  } = useStartupSearch();
  
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
  }, [setIsFocused]);

  const getTitle = () => {
    if (pathname === '/') return 'Dashboard';
    const path = pathname.split('/')[1];
    return path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Dashboard';
  };

  return (
    <header className="fixed top-0 left-0 lg:left-[280px] w-full lg:w-[calc(100%-280px)] h-20 lg:h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-4 lg:px-margin-desktop z-40 transition-all duration-300">
      <div className="flex items-center gap-4 lg:gap-6 flex-1">
        <Link href="/" className="flex items-center h-8 sm:h-10 lg:hidden">
          <div className="relative h-8 sm:h-10 w-32 sm:w-40 flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-light.png" alt="PU-iNCENT Logo" className="h-full w-auto object-contain object-left show-in-light" fetchPriority="high" onError={(e) => { e.currentTarget.src = fallbackImg; e.currentTarget.onerror = null; }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-dark.png" alt="PU-iNCENT Logo" className="h-full w-auto object-contain object-left show-in-dark scale-[1.35] origin-left" fetchPriority="high" onError={(e) => { e.currentTarget.src = fallbackImg; e.currentTarget.onerror = null; }} />
          </div>
        </Link>
        
        <div className="relative w-full max-w-md ml-auto lg:ml-8 hidden lg:block" ref={searchRef}>
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
                      <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center shrink-0 overflow-hidden text-brand-orange font-bold text-xs relative">
                        {startup.logo && startup.logo.startsWith('http') ? (
                          <Image src={startup.logo} alt={startup.startup_name} fill sizes="40px" className="object-cover" />
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
