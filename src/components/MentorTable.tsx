import { Mentor } from '@/services/api';

export default function MentorTable({ mentors }: { mentors: Mentor[] }) {
  if (!mentors || mentors.length === 0) {
    return <div className="text-center py-8 text-on-surface-variant">No mentors found.</div>;
  }

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-outline-variant flex justify-between items-center">
        <h4 className="text-lg font-bold text-on-surface">Mentors Directory</h4>
        <button className="text-brand-orange text-sm font-bold hover:underline">View All</button>
      </div>
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-variant/50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Expertise</th>
              <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Company</th>
              <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Assigned Startups</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {mentors.map((mentor, index) => {
              const initials = mentor.Name ? mentor.Name.substring(0, 2).toUpperCase() : 'NA';
              const isEven = index % 2 === 0;
              return (
                <tr key={mentor.ID || `mentor-${index}`} className="hover:bg-surface-variant transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className={`w-8 h-8 rounded flex items-center justify-center font-black text-xs ${isEven ? 'bg-brand-orange/10 text-brand-orange' : 'bg-slate-100 text-on-surface'}`}>
                      {initials}
                    </div>
                    <span className="text-sm font-bold text-on-surface">{mentor.Name || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {mentor.Expertise || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {mentor.Company || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {mentor["Assigned Startups"] || 'None'}
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
