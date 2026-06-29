'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DomainDistributionProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#ff4500', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b'];

export default function DomainDistributionChart({ data }: DomainDistributionProps) {
  if (!data || data.length === 0) return <div>No data available</div>;

  return (
    <div className="bg-surface-container-lowest rounded-lg p-6 shadow-sm border border-outline-variant h-96 flex flex-col">
      <h4 className="text-lg font-bold text-on-surface mb-2">Domain Distribution</h4>
      <div className="flex-1 w-full h-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
