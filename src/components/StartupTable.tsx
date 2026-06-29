'use client';

import { Startup } from '@/services/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function StartupTable({ startups }: { startups: Startup[] }) {
  const router = useRouter();

  const getDirectImageUrl = (url: string | undefined | null) => {
    if (!url) return null;
    if (url.includes('drive.google.com')) {
      const match = url.match(/id=([^&]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }
    return url;
  };

  if (!startups || startups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm">
        <span className="material-symbols-outlined text-4xl mb-3 opacity-50">search_off</span>
        <p className="font-medium">No startups found.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-2xl border border-outline-variant shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col transition-all duration-300">
      <div className="p-6 border-b border-outline-variant/50 flex justify-between items-center bg-gradient-to-r from-surface-container-lowest to-surface-variant/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-brand-orange text-sm">rocket_launch</span>
          </div>
          <h4 className="text-lg font-bold text-on-surface">Startup Directory</h4>
        </div>
        <button className="text-brand-orange text-sm font-bold hover:text-brand-orange/80 transition-colors flex items-center gap-1 group">
          View All
          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-variant/30 border-b border-outline-variant/50">
              <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Startup</th>
              <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Founder</th>
              <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Stage</th>
              <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Domain</th>
              <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Onboarding</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {startups.map((startup, index) => {
              const initials = startup.startup_name ? startup.startup_name.substring(0, 2).toUpperCase() : 'NA';
              const logoUrl = getDirectImageUrl(startup.logo);
              
              return (
                <tr 
                  key={startup.startup_id || `startup-${index}`} 
                  className="hover:bg-brand-orange/[0.02] transition-colors cursor-pointer group"
                  onClick={() => router.push(`/startups/${startup.startup_id}`)}
                >
                  <td className="px-6 py-5 flex items-center gap-4">
                    {logoUrl && logoUrl.startsWith('http') ? (
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm border border-outline-variant/50 group-hover:shadow-md transition-shadow shrink-0 relative flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logoUrl} alt={startup.startup_name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 text-brand-orange border border-brand-orange/20 shadow-sm group-hover:shadow-md transition-all shrink-0">
                        {initials}
                      </div>
                    )}
                    <div>
                      <a className="text-sm font-bold text-on-surface group-hover:text-brand-orange transition-colors">
                        {startup.startup_name || 'N/A'}
                      </a>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">ID: {startup.startup_id || 'Unknown'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-medium text-on-surface">{startup.founder_name || 'N/A'}</div>
                    {startup.college_email && (
                      <div className="text-xs text-on-surface-variant truncate max-w-[150px]" title={startup.college_email}>
                        {startup.college_email}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-surface-variant/50 text-on-surface border border-outline-variant/50 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block group-hover:border-brand-orange/30 transition-colors">
                      {startup.stage || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-on-surface-variant flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-orange/50"></div>
                      {startup.domain || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-on-surface-variant">
                    {startup.incubation_start_date || 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
