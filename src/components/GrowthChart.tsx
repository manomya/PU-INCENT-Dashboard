'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GrowthChartProps {
  data: { month: string; startups: number }[];
}

export default function GrowthChart({ data }: GrowthChartProps) {
  if (!data || data.length === 0) return <div>No data available</div>;

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline/10 h-96">
      <h3 className="text-lg font-heading font-semibold text-on-surface mb-6">Incubation Growth</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorStartups" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff4500" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ff4500" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="month" stroke="#e2e8f0" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#e2e8f0" fontSize={12} tickLine={false} axisLine={false} />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#ff4500' }}
          />
          <Area type="monotone" dataKey="startups" stroke="#ff4500" strokeWidth={3} fillOpacity={1} fill="url(#colorStartups)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
