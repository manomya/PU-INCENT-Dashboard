"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

interface AuditLog {
  _id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  startupId: string;
  startupName: string;
  user: string;
  timestamp: string;
  changes: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/admin/audit-logs");
        if (!res.ok) {
          throw new Error("Failed to fetch logs");
        }
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800 border-green-200';
      case 'UPDATE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DELETE': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-on-surface">Audit Logs</h2>
        <p className="text-on-surface-variant">Track all modifications made to startups.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          {error}
        </div>
      ) : logs.length === 0 ? (
        <div className="p-12 text-center text-on-surface-variant bg-surface-container-lowest rounded-xl border border-outline-variant">
          No audit logs found.
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-on-surface-variant uppercase bg-surface-variant/30 border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-4 font-semibold">Timestamp (Server Time)</th>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                  <th className="px-6 py-4 font-semibold">Startup</th>
                  <th className="px-6 py-4 font-semibold">Changes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-surface-variant/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-on-surface-variant">
                      {format(new Date(log.timestamp), "MMM d, yyyy HH:mm:ss")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {log.user === 'Google Sheet (Direct Edit)' ? (
                          <span className="material-symbols-outlined text-green-600 text-[18px]">table_chart</span>
                        ) : (
                          <span className="material-symbols-outlined text-blue-600 text-[18px]">person</span>
                        )}
                        <span className="font-medium text-on-surface">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-on-surface">{log.startupName}</p>
                      <p className="text-xs text-on-surface-variant">{log.startupId}</p>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      {log.changes && log.changes.length > 0 ? (
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                          {log.changes.map((change, idx) => (
                            <div key={idx} className="text-xs bg-surface-variant/30 p-2 rounded border border-outline-variant/30">
                              <span className="font-bold text-on-surface block mb-1">{change.field}</span>
                              <div className="grid grid-cols-2 gap-2 text-on-surface-variant">
                                <div>
                                  <span className="text-[9px] uppercase tracking-wider text-red-500/70 block">Old</span>
                                  <span className="line-through opacity-70 break-all">{change.oldValue || 'Empty'}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] uppercase tracking-wider text-green-500/70 block">New</span>
                                  <span className="break-all">{change.newValue || 'Empty'}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-on-surface-variant italic">No explicit field changes</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
