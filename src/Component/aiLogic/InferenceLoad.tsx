import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const InferenceLoad: React.FC = () => {
  // Data for the segmented circle (4 active segments, 4 empty)
  const data = [
    { value: 10, color: '#846584' }, { value: 5, color: '#f3f4f6' },
    { value: 10, color: '#846584' }, { value: 5, color: '#f3f4f6' },
    { value: 10, color: '#846584' }, { value: 5, color: '#f3f4f6' },
    { value: 10, color: '#846584' }, { value: 5, color: '#f3f4f6' },
  ];

  return (
    <div className="w-full h-full  bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 flex flex-col items-center">
      <h2 className="text-base md:text-lg font-extrabold text-titleColor leading-6 ">Inference Load</h2>
      
      {/* Radial Gauge */}
      <div className="relative w-64 h-64 mb-10">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={80}
              outerRadius={100}
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={450}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-[#433535]">72%</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mt-1">
            Active Load
          </span>
        </div>
      </div>

      {/* Metrics List */}
      <div className="w-full space-y-5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-extrabold text-[#4A3A3799] leading-4 uppercase ">Response Time</span>
          <span className="font-black text-buttonColor leading-4 ">142MS</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-extrabold text-[#4A3A3799] uppercase tracking-widest leading-4 ">Memory Usage</span>
          <span className="font-black text-buttonColor leading-4">4.2 GB</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-extrabold text-[#4A3A3799] uppercase tracking-widest leading-4">Uptime</span>
          <span className="font-black text-[#00A63E] leading-4">99.98%</span>
        </div>
      </div>
    </div>
  );
};
export default InferenceLoad