/* eslint-disable @typescript-eslint/no-explicit-any */



import React, { useState } from 'react';

import SuplimentsList from './SuplimentList';
import ProtocolList from './ProtocolList';
import BehaviorList from './BeaviorsList';
import DailyInspirationList from './DailyInspireation';





type TabType = 'protocols' | 'behaviours' | 'supplements' | 'daily-inspiration';


const ContentManagementTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('protocols');
  const [, setSearchQuery] = useState('');
  const [, setCurrentPage] = useState(1);
  
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'supplements': return <SuplimentsList/>;
      case 'protocols': return <ProtocolList  />;
      case 'behaviours': return <BehaviorList  />;
      case 'daily-inspiration': return <DailyInspirationList />;

    }
  };


  const tabs: { value: TabType; label: string }[] = [
  { value: 'protocols', label: 'Protocols' },
  { value: 'behaviours', label: 'Behaviours' },
  { value: 'supplements', label: 'Supplements' },
  { value: 'daily-inspiration', label: 'Daily Inspiration' },
];

  return (
    <div className="">
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Content Management</h1>
            <p className="text-gray-600">Manage app content & data</p>
          </div>
        
        </div>

        <div className="flex flex-col md:flex-row gap-3 mt-6">
           {tabs.map((tab) => (
    <button
      key={tab.value}
      onClick={() => handleTabChange(tab.value)}
      className={`px-5 py-3 rounded-xl cursor-pointer ${
        activeTab === tab.value
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100'
      }`}
    >





      {tab.label}
    </button>
  ))}




        </div>

        {/* <div className="relative mt-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-12 pr-4 py-3 bg-indigo-50 rounded-xl"
          />
        </div> */}
      </div>

      {renderActiveComponent()}

    </div>
  );
};



export default ContentManagementTab;
