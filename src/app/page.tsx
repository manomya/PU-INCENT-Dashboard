import { getDashboardData } from '@/services/api';
import KPICard from '@/components/KPICard';

export default async function Dashboard() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-on-surface-variant text-lg">Failed to load dashboard data. Please check the backend connection.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="Total Startups" 
          value={data.total_startups || 0} 
          icon="rocket_launch" 
        />
        <KPICard 
          title="Active Startups" 
          value={data.active_startups || 0} 
          icon="bolt" 
        />
        <KPICard 
          title="Total Domains" 
          value={data.total_domains || 0} 
          icon="category" 
        />
      </div>
    </div>
  );
}