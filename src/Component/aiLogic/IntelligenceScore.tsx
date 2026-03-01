import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
 
} from 'recharts';

// --- Types & Mock Data ---
interface DataPoint {
  day: string;
  score: number;
}

const data: DataPoint[] = [
  { day: 'Mon', score: 450 },
  { day: 'Tue', score: 520 },
  { day: 'Wed', score: 480 },
  { day: 'Thu', score: 620 },
  { day: 'Fri', score: 590 },
  { day: 'Sat', score: 430 },
  { day: 'Sun', score: 400 },
];

const IntelligenceScore: React.FC = () => {
  return (
     <div className="w-full h-full p-8 bg-white rounded-[40px] shadow-sm border border-gray-100 min-h-[320px] ">
      <div className=" relative">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-12">
          <div className="flex items-center gap-4">
            <h2 className="text-base md:text-lg font-extrabold text-titleColor leading-6 ">
              Intelligence Accuracy Score
            </h2>
           
          </div>

        </div>

        {/* Chart Container */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
              <CartesianGrid 
                vertical={false} 
                strokeDasharray="3 3" 
                stroke="#e5e7eb" 
              />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fontWeight: 700, fill: '#9ca3af' }}
                dy={20}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                ticks={[80, 230, 380, 530, 610]}
                tick={{ fontSize: 12, fontWeight: 700, fill: '#9ca3af' }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#846584" 
                strokeWidth={5} 
                dot={{ r: 8, fill: '#846584', strokeWidth: 0 }}
                activeDot={{ r: 10, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceScore;