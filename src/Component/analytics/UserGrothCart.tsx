import React, { useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useLazyGetUserGrouthQuery } from '../../redux/features/admin/analyticsApi';

interface ChartData {
  date: string;
  value: number;
}


const UserGrowthChart: React.FC = () => {
  const [triggerGetUserGrowth, { data, isLoading, error }] = useLazyGetUserGrouthQuery(); 

  useEffect(() => {
    triggerGetUserGrowth(); 
  }, [triggerGetUserGrowth]);

 if (isLoading) {
    return (
      <div className="w-full mt-6 p-6 bg-white rounded-xl shadow-sm text-center">
        Loading chart...
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full mt-6 p-6 bg-white rounded-xl shadow-sm text-center text-red-500">
        Failed to load chart data
      </div>
    );
  }

    const chartData: ChartData[] =
    data?.map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: item.count,
    })) || [];


const currentMonth = new Date().toLocaleDateString("en-US", {
  month: "long",
});

  return (
    <div className="w-full mt-6 p-2.5 md:p-6 bg-white rounded-xl shadow-sm font-sans">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-black leading-[120%]  mb-6">User Growth (Last 30 Days)</h2>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{currentMonth}</p>
      </div>

      {/* Recharts BarChart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7280' }} />
            <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} />
            <Tooltip
              contentStyle={{ fontSize: 12, backgroundColor: '#F9FAFB', borderRadius: 6 }}
            />
            <Bar
              dataKey="value"
              fill="#8B5CF6"
              radius={[6, 6, 0, 0]} // rounded top corners
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserGrowthChart;
