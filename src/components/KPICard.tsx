import { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: string;
}

export default function KPICard({ title, value, trend, trendUp, icon }: KPICardProps) {
  return (
    <div className="relative group overflow-hidden bg-surface-container-lowest/80 backdrop-blur-md p-6 rounded-2xl border border-outline-variant/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/50">
      {/* Decorative Background Gradient */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-orange/20 rounded-full blur-2xl group-hover:bg-brand-orange/30 transition-colors duration-500"></div>
      
      <div className="relative z-10 flex justify-between items-start mb-4">
        <span className="p-3 bg-gradient-to-br from-brand-orange/10 to-brand-orange/5 text-brand-orange rounded-xl border border-brand-orange/20 shadow-sm group-hover:scale-110 transition-transform duration-300">
          <span className="material-symbols-outlined">{icon}</span>
        </span>
        {trend && (
          <span className={`text-xs font-black px-2.5 py-1 rounded-full shadow-sm flex items-center gap-0.5 ${trendUp ? 'text-green-700 bg-green-100 border border-green-200' : 'text-red-700 bg-red-100 border border-red-200'}`}>
            <span className="material-symbols-outlined text-[12px]">{trendUp ? 'trending_up' : 'trending_down'}</span>
            {trend}
          </span>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{title}</p>
        <h3 className="text-3xl font-black mt-2 text-on-surface tracking-tight bg-gradient-to-r from-on-surface to-on-surface/70 bg-clip-text text-transparent">{value}</h3>
      </div>
    </div>
  );
}
