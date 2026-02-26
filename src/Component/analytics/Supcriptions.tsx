import React from 'react';
import { useGetSubscriptionBreakdownQuery, useGetTopSupplementQuery } from '../../redux/features/admin/analyticsApi';

interface CircularProgressProps {
  value: number;
  maxValue: number;
  label: string;
  color: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ value, maxValue, label, color }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40 sm:w-44 sm:h-44">
        <svg className="transform -rotate-90 w-full h-full">
          <circle cx="80" cy="80" r={radius} stroke="#f3f4f6" strokeWidth="12" fill="none" />
          <circle
            cx="80" cy="80" r={radius}
            stroke={color} strokeWidth="12" fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl sm:text-4xl font-bold text-gray-900">
            {maxValue.toLocaleString()}
          </span>
          <span className="text-sm font-medium text-gray-500">{value}%</span>
        </div>
      </div>
      <p className="mt-4 text-sm sm:text-base font-medium text-gray-700">{label}</p>
    </div>
  );
};

// ✅ w-full এবং text-center যাতে এটি গ্রিড সেলের পুরোটা নেয়
const SupplementTag: React.FC<{ name: string }> = ({ name }) => (
  <div className="w-full text-center px-3 py-2 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200 hover:bg-green-100 transition-all whitespace-nowrap">
    {name}
  </div>
);

export default function SubscriptionDashboard() {
  const { data, isLoading, error } = useGetSubscriptionBreakdownQuery(); 
  const { data: suppData, isLoading: suppLoading } = useGetTopSupplementQuery();

  if (isLoading || suppLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 text-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 text-center text-red-500">
        Failed to load dashboard data
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Subscription Breakdown Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 w-full">
        <h2 className="text-xl md:text-2xl font-bold text-black mb-6">
          Subscription Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
          <CircularProgress
            value={data?.premium?.percentage ?? 0}  
            maxValue={data?.premium?.count ?? 0}   
            label="Premium Users"
            color="#c2694f"
          />
          <CircularProgress
            value={data?.free?.percentage ?? 0}    
            maxValue={data?.free?.count ?? 0}       
            label="Free Users"
            color="#0d7377"
          />
        </div>
      </div>

      {/* Top Supplements Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Top Supplements
        </h2>
        
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-3 w-full">
          {suppData?.top_supplement && suppData.top_supplement.length > 0 ? (
            suppData.top_supplement.map((supplement: string, index: number) => (
              <SupplementTag key={index} name={supplement} />
            ))
          ) : (
            <p className="col-span-full text-gray-400 italic text-center">No supplements available</p>
          )}
        </div>
      </div>
    </div>
  );
}