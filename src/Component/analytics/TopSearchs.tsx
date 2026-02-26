import React from 'react';

interface SearchItem {
  id: number;
  term: string;
  count: number;
}

const searchData: SearchItem[] = Array(10).fill({
  term: "Hand Flapping",
  count: 342,
}).map((item, index) => ({ ...item, id: index }));

const TopSearches: React.FC = () => {
  return (
    <div className="mt-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-2.5 md:p-6 ">
        <h2 className="text-xl md:text-2xl font-bold text-black leading-[120%]  mb-6">Top Searches</h2>
        
        {/* Responsive Grid: 1 col on mobile, 2 cols on tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          {searchData.map((item) => (
            <div 
              key={item.id}
              className="flex justify-between items-center bg-blue-50 hover:bg-blue-100 transition-colors px-4 py-3 rounded-lg cursor-pointer group"
            >
              <span className="text-gray-900 text-base font-normal leading-4">
                {item.term}
              </span>
              <span className="text-[#2F80ED] font-medium text-base group-hover:underline">
                {item.count} Search
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopSearches;