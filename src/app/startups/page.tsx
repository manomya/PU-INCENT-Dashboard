import { getStartups } from '@/services/api';
import StartupTable from '@/components/StartupTable';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function StartupsPage() {
  const session = await getServerSession(authOptions);
  let startups = await getStartups();

  if (!startups) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-on-surface-variant text-lg">Failed to load startups. Please check the backend connection.</p>
      </div>
    );
  }

  // Filter startups based on user permissions
  const permissions = (session?.user as any)?.permissions;
  if (permissions?.accessibleStartups !== 'ALL' && Array.isArray(permissions?.accessibleStartups)) {
    const allowedIds = permissions.accessibleStartups.map((id: string) => id.trim().toLowerCase());
    startups = startups.filter(startup => 
      allowedIds.includes(startup.startup_id?.toLowerCase())
    );
  }

  const canAdd = permissions?.canAdd;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-heading font-semibold text-on-surface">Incubated Startups</h2>
          <p className="text-sm text-on-surface-variant mt-1">Manage and view details of all startups currently in the program.</p>
        </div>
        {canAdd && (
          <button className="bg-primary hover:bg-primary-container text-on-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            Add Startup
          </button>
        )}
      </div>

      <StartupTable startups={startups} />
    </div>
  );
}
