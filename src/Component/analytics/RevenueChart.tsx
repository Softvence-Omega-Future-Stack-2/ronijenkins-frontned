import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useGetRevenueGrowthQuery } from '../../redux/features/admin/analyticsApi'; 

// Loading Skeleton
const ChartSkeleton = () => (
  <div className="w-full p-6 mt-6 bg-white rounded-2xl shadow-sm border border-gray-100">
    <div className="mb-6">
      <div className="h-7 w-52 bg-gray-200 rounded-lg animate-pulse mb-3" />
      <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
    </div>
    <div className="w-full h-[304px] flex items-end gap-2 px-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="flex-1 bg-purple-100 rounded-t-md animate-pulse"
          style={{
            height: `${30 + Math.random() * 60}%`,
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  </div>
);

const RevenueChart: React.FC = () => {
  const { data, isLoading, error } = useGetRevenueGrowthQuery();

  const currentMonth = new Date().toLocaleDateString("en-US", { month: "long" });

  if (isLoading) return <ChartSkeleton />;

  if (error || !data) return (
    <div className="w-full p-6 mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center h-[420px]">
      <p className="text-gray-400 text-sm">Failed to load revenue data.</p>
    </div>
  );

  const chartData = (data ?? []).map((item) => ({
    month: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: item.amount,
  }));


  const amounts = chartData.map(d => d.revenue);
  const minVal = Math.min(...amounts);
  const maxVal = Math.max(...amounts);
  const padding = maxVal === minVal ? maxVal * 0.5 || 10 : (maxVal - minVal) * 0.3;

  return (
    <div className="w-full p-6 mt-6 bg-white rounded-2xl shadow-sm font-sans border border-gray-100">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-black leading-[120%] mb-2">
          Revenue (Monthly)
        </h2>
        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
          {currentMonth}
        </p>
      </div>

      {/* Chart */}
      <div className="w-full" style={{ height: '304px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
              margin={{ top: 20, right: 20, left: -20, bottom: 20 }} 
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF', fontWeight: 500 }}
              dy={15}
            />

            {/*  YAxis domain fix */}
            <YAxis
              hide
              domain={[minVal - padding, maxVal + padding]}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white px-3 py-2 border border-purple-100 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">{payload[0]?.payload?.month}</p>
                      <p className="text-sm font-bold text-[#8B5CF6]">
                        ${Number(payload[0].value).toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ stroke: '#8B5CF6', strokeWidth: 1, strokeDasharray: '4 4' }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#8B5CF6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              dot={{ r: 4, fill: '#8B5CF6', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart