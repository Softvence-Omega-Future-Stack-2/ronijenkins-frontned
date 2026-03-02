import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { BarChart3 } from 'lucide-react';

const data = [
  { name: 'Mon', users: 450, logs: 320 },
  { name: 'Tue', users: 520, logs: 410 },
  { name: 'Wed', users: 480, logs: 380 },
  { name: 'Thu', users: 610, logs: 520 },
  { name: 'Fri', users: 590, logs: 490 },
  { name: 'Sat', users: 420, logs: 300 },
  { name: 'Sun', users: 390, logs: 280 },
];



const UserEngagementChart: React.FC = () => {
  return (
    <div className="w-full h-full p-8 bg-white rounded-[40px] shadow-sm border border-gray-100 min-h-[320px] ">
      {/* Header Section */}
      <div className="flex items-start gap-4 mb-8">
        <div className="p-3 bg-[#FAF7F5] rounded-2xl">
          <BarChart3 className="w-6 h-6 text-[#6d4c7d]" />
        </div>
        <div className='mb-6'>
          <h2 className="text-base md:text-lg font-extrabold text-titleColor leading-6 ">User Engagement Activity</h2>
          <p className="text-subTitleColor text-xs leading-4 font-medium">Daily active users vs log completion</p>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-[300px] pb-6  w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6d4c7d" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6d4c7d" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLogs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e5a89e" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#e5a89e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              vertical={false} 
              strokeDasharray="3 3" 
              stroke="#f0f0f0" 
            />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
              dy={15}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              ticks={[0, 200, 400, 600, 800]}
            />

            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />

            {/* Daily Active Users - Solid Line */}
            <Area
              type="monotone"
              dataKey="users"
              stroke="#6d4c7d"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorUsers)"
            />

            {/* Log Completion - Dashed Line */}
            <Area
              type="monotone"
              dataKey="logs"
              stroke="#e5a89e"
              strokeWidth={3}
              strokeDasharray="6 6"
              fillOpacity={1}
              fill="url(#colorLogs)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserEngagementChart;  