import React from 'react';
import { BrainCircuit } from 'lucide-react';

// --- Types ---
interface QueryItem {
  id: string;
  query: string;
  tokens: number;
  confidence: number;
}

const recentQueries: QueryItem[] = [
  {
    id: '1',
    query: "How to handle mood swings at work?",
    tokens: 420,
    confidence: 98,
  },
  {
    id: '2',
    query: "HRT benefits and risks summary",
    tokens: 850,
    confidence: 94,
  },
  {
    id: '3',
    query: "Sleep hygiene for perimenopause",
    tokens: 310,
    confidence: 99,
  },
];

const RecentQueries: React.FC = () => {
  return (
    <div className="w-full h-full bg-white rounded-[40px] p-3 xl:p-8  shadow-sm border border-gray-50">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-base md:text-lg font-extrabold text-titleColor mt-3 leading-6">
          Recent Queries Analysis
        </h2>
        <p className="text-subTitleColor text-sm font-medium leading-5">
          Live stream of model interaction performance
        </p>
      </div>

      {/* Query List */}
      <div className="space-y-4">
        {recentQueries.map((item) => (
          <div 
            key={item.id}
            className="group flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-[#FBF8F6] border border-borderColor rounded-[28px] border border-orange-50/50 hover:shadow-md transition-all duration-300"
          >
            {/* Left Side: Icon & Text */}
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 shrink-0 bg-white rounded-2xl flex items-center justify-center text-[#846584] shadow-sm border border-gray-50 group-hover:scale-110 transition-transform">
                <BrainCircuit size={22} />
              </div>
              <div>
                <h4 className="font-bold text-titleColor text-sm  leading-5">
                  "{item.query}"
                </h4>
                <p className="text-[10px] font-bold text-[#4A3A3766] uppercase tracking-4 mt-1 ">
                  {item.tokens} TOKENS PROCESSED
                </p>
              </div>
            </div>

            {/* Right Side: Metrics */}
            <div className="mt-4 md:mt-0 text-left md:text-right w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
              <div className="font-black text-xs text-[#00A63E] leading-4">
                {item.confidence}% Confidence
              </div>
              <div className="text-[10px] font-extrabold text-[#4A3A3733] uppercase  mt-0.5">
                RESPONSE QUALITY
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentQueries;