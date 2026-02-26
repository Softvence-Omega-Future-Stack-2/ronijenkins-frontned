import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';
import { useGetFeatureUsageQuery } from '../../redux/features/admin/analyticsApi';


const COLORS = ['#82B1FF', '#FF4081', '#6366F1', '#E040FB', '#C06644', '#00897B'];

const FeatureUsageChart: React.FC = () => {
  const { data, isLoading, error } = useGetFeatureUsageQuery(); 

  if (isLoading) {
    return (
      <div className="w-full p-6 bg-white rounded-2xl shadow-sm text-center">
        Loading chart...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-white rounded-2xl shadow-sm text-center text-red-500">
        Failed to load feature usage data
      </div>
    );
  }


  const chartData = (data?.features ?? []).map((item, index) => ({
     name: item.feature,
    value: item.count,
    color: COLORS[index % COLORS.length], // cycles colors if more than 6 items
  }));

  return (
    <div className="w-full h-full p-6 bg-white rounded-2xl shadow-sm font-sans border border-gray-100">
      <h2 className="text-xl md:text-2xl font-bold text-black leading-[120%] mb-6">
        Feature Usage
      </h2>

      <div className="flex flex-col items-center">
        <div className="w-full h-64 md:h-85.25">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius="90%"
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 w-full">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-md shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-normal text-gray-800">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureUsageChart;




// import React from 'react';
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip,
// } from 'recharts';

// interface FeatureData {
//   name: string;
//   value: number;
//   color: string;
// }

// const data: FeatureData[] = [
//   { name: 'Behavior Decoder', value: 300, color: '#82B1FF' }, 
//   { name: 'Protocol Browser', value: 200, color: '#FF4081' }, 
//   { name: 'Find Provider', value: 450, color: '#6366F1' },    
//   { name: 'Supplement Trucker', value: 50, color: '#E040FB' },  
//   { name: 'Journal', value: 100, color: '#C06644' },         
//   { name: 'Supplement Lookup', value: 150, color: '#00897B' }, 
// ];

// const FeatureUsageChart: React.FC = () => {
//   return (
//     <div className="w-full p-6 bg-white rounded-2xl shadow-sm font-sans border border-gray-100">
//       {/* Header */}
//       <h2 className="text-xl md:text-2xl font-bold text-black leading-[120%]  mb-6">Feature Usage</h2>

//       <div className="flex flex-col items-center">
//         {/* Chart Container */}
//         <div className="w-full h-64 md:h-85.25">
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 data={data}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={0}
//                 outerRadius="90%"
//                 paddingAngle={0}
//                 dataKey="value"
//                 stroke="none"
//               >
//                 {data.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip 
//                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
//               />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Custom Legend Grid */}
//         <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 w-full">
//           {data.map((item, index) => (
//             <div key={index} className="flex items-center gap-3">
//               <div 
//                 className="w-4 h-4 rounded-md shrink-0" 
//                 style={{ backgroundColor: item.color }}
//               />
//               <span className="text-xs font-normal text-gray-800 ">
//                 {item.name}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FeatureUsageChart;