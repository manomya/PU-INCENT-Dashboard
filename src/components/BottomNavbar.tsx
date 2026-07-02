'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useStartupSearch } from '@/hooks/useStartupSearch';

export default function BottomNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    searchTerm,
    setSearchTerm,
    setIsFocused,
    isFetching,
    filteredStartups
  } = useStartupSearch();

  useEffect(() => {
    if (isSearchOpen) {
      setIsFocused(true);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setIsFocused(false);
      setSearchTerm('');
    }
  }, [isSearchOpen, setIsFocused, setSearchTerm]);

  const navItems = [
    { name: 'Home', href: '/', icon: 'dashboard' },
    { name: 'Search', href: '#', icon: 'search', onClick: () => setIsSearchOpen(true) },
    { name: 'Startups', href: '/startups', icon: 'rocket_launch' }
  ];

  if ((session?.user as any)?.role === 'admin') {
    navItems.push({ name: 'Admin', href: '/admin/users', icon: 'admin_panel_settings' });
  }

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 w-full h-16 bg-surface-container-lowest border-t border-outline-variant z-40 px-6 pb-safe flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = item.href !== '#' && (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)));
          
          if (item.onClick) {
            return (
              <button
                key={item.name}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center gap-1 w-16 h-full text-on-surface-variant hover:text-brand-orange transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                <span className="text-[10px] font-bold tracking-wider">{item.name}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${
                isActive ? 'text-brand-orange' : 'text-on-surface-variant hover:text-brand-orange'
              }`}
            >
              <div className="relative">
                <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                {isActive && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-orange"></span>
                )}
              </div>
              <span className={`text-[10px] font-bold tracking-wider ${isActive ? 'text-brand-orange' : ''}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-surface-container-lowest flex flex-col animate-in slide-in-from-bottom-2 duration-200">
          <div className="p-4 border-b border-outline-variant flex items-center gap-3 bg-surface-container-lowest sticky top-0">
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                ref={searchInputRef}
                className="w-full bg-surface-variant border border-transparent rounded-xl pl-10 pr-4 py-3 text-sm focus:border-brand-orange focus:bg-surface-container-lowest transition-all text-on-surface placeholder-on-surface-variant/70 outline-none" 
                placeholder="Search startups, founders, IDs..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-on-surface-variant/20 text-on-surface"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-background">
            {isFetching ? (
              <div className="py-8 text-center text-sm text-on-surface-variant flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined animate-spin text-[24px] text-brand-orange">progress_activity</span>
                Searching...
              </div>
            ) : filteredStartups.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 px-1">Results</p>
                {filteredStartups.map(startup => (
                  <button
                    key={startup.startup_id}
                    onClick={() => {
                      router.push(`/startups/${startup.startup_id}`);
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left p-4 bg-surface-container rounded-2xl hover:bg-surface-variant transition-colors flex items-center gap-4 border border-outline-variant/30"
                  >
                    <div className="w-12 h-12 rounded-xl bg-surface-variant flex items-center justify-center shrink-0 overflow-hidden text-brand-orange font-bold text-sm shadow-sm">
                      {startup.logo && startup.logo.startsWith('http') ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={startup.logo} alt="" className="w-full h-full object-cover" />
                      ) : (
                        startup.startup_name.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-base font-bold text-on-surface truncate">{startup.startup_name}</p>
                      <p className="text-xs text-on-surface-variant truncate flex gap-2 mt-1">
                        <span className="font-medium text-brand-orange">{startup.startup_id}</span>
                        <span>•</span>
                        <span>{startup.founder_name}</span>
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant ml-auto text-[20px]">chevron_right</span>
                  </button>
                ))}
              </div>
            ) : searchTerm.trim() !== '' ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center mb-4 text-on-surface-variant/50">
                  <span className="material-symbols-outlined text-[32px]">search_off</span>
                </div>
                <p className="text-sm font-bold text-on-surface">No results found</p>
                <p className="text-xs text-on-surface-variant mt-1">Try searching for a different term.</p>
              </div>
            ) : (
              <div className="py-12 text-center flex flex-col items-center justify-center opacity-50">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">search</span>
                <p className="text-sm font-medium text-on-surface-variant">Start typing to search startups...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
