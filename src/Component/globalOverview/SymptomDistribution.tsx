import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useGetSystemOverviewQuery } from '../../redux/features/admin/systemOverview';

interface Symptom {
  name: string;
  count: number;
  avgSeverity: number;
}

const COLORS = ['#8b5e83', '#e9bcab', '#423635', '#cfb5c8', '#a3bfa8', '#d4a5a5'];

const SymptomDistribution: React.FC = () => {
  const { data: statsData, isLoading } = useGetSystemOverviewQuery(undefined);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center bg-white rounded-[45px]">
        Loading...
      </div>
    );
  }

  const symptoms: Symptom[] = statsData?.health?.topSymptoms || [];
console.log(symptoms)
  // chart এর জন্য data map
  const chartData = symptoms.map((s) => ({
    name: s.name.replace('_', ' '), // HOT_FLASHES → HOT FLASHES
    value: s.count,
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-white rounded-[45px]">
        No symptoms data
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8 bg-white rounded-[45px] shadow-sm border border-gray-100 flex flex-col items-center">
      <h2 className="text-base md:text-lg font-extrabold text-titleColor leading-6 mb-8">
        Symptom Distribution
      </h2>

      <div className="h-64 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full space-y-3 mt-4">
        {chartData.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between px-6 py-4 bg-[#fdf8f6] rounded-full"
          >
            <div className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="font-semibold text-[#6b5b5b]">{item.name}</span>
            </div>
            <span className="font-bold text-[#6b5b5b]">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SymptomDistribution;





// import React from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// const data = [
//   { name: 'Hot Flashes', value: 35, color: '#8b5e83' },
//   { name: 'Mood Swings', value: 25, color: '#e9bcab' },
//   { name: 'Insomnia', value: 20, color: '#423635' },
//   { name: 'Brain Fog', value: 20, color: '#cfb5c8' },
// ];

// const SymptomDistribution: React.FC = () => {
//   return (
//     <div className="w-full h-full  p-8 bg-white rounded-[45px] shadow-sm border border-gray-100 flex flex-col items-center">
//       <h2 className="text-base md:text-lg font-extrabold text-titleColor leading-6  mb-8">
//         Symptom Distribution
//       </h2>

//       {/* Chart Container */}
//       <div className="h-64 w-full relative">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               innerRadius={60}
//               outerRadius={90}
//               paddingAngle={5}
//               dataKey="value"
//               stroke="none"
//               // Start from top
//               startAngle={90}
//               endAngle={-270}
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.color} />
//               ))}
//             </Pie>
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Custom Legend */}
//       <div className="w-full space-y-3 mt-4">
//         {data.map((item) => (
//           <div 
//             key={item.name}
//             className="flex items-center justify-between px-6 py-4 bg-[#fdf8f6] rounded-full"
//           >
//             <div className="flex items-center gap-3">
//               <span 
//                 className="w-3 h-3 rounded-full" 
//                 style={{ backgroundColor: item.color }} 
//               />
//               <span className="font-semibold text-[#6b5b5b]">{item.name}</span>
//             </div>
//             <span className="font-bold text-[#6b5b5b]">{item.value}%</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SymptomDistribution; 