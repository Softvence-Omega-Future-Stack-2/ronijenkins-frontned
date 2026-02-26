import React from 'react';
import { UserPlus, Activity, DollarSign } from 'lucide-react';
import { useGetRecentActivitiesQuery } from '../../redux/features/admin/recentActivityApi';

// ✅ API response এর actual structure
interface ActivityItem {
  id: number;
  user_email: string;
  action: string;
  timestamp: string;
}

const getTypeConfig = (action: string) => {
  const lower = action.toLowerCase();
  if (lower.includes('registration') || lower.includes('user')) {
    return { icon: UserPlus, color: 'bg-blue-100 text-blue-600' };
  } else if (lower.includes('subscription') || lower.includes('payment')) {
    return { icon: DollarSign, color: 'bg-green-100 text-green-600' };
  } else {
    return { icon: Activity, color: 'bg-purple-100 text-purple-600' };
  }
};

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const RecentActivity: React.FC = () => {
  const { data, isLoading, isError } = useGetRecentActivitiesQuery({
    ordering: '',
    search: '',
  });

  // ✅ API array directly return করে, results নেই
  const activities: ActivityItem[] = Array.isArray(data) ? data : [];

  return (
    <div className="w-full mt-5 bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-50">
        <h2 className="text-xl md:text-2xl font-bold text-textColor leading-[120%]">
          Recent Activity
        </h2>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-7 h-7 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="text-center py-16">
          <p className="text-red-400 text-sm font-medium">
            Failed to load activities. Please refresh.
          </p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && activities.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No recent activity found.</p>
        </div>
      )}

      {/* List */}
      {!isLoading && !isError && activities.length > 0 && (
        <div className="divide-y divide-slate-50">
          {activities.map((item) => {
            const Config = getTypeConfig(item.action);
            return (
              <div
                key={item.id}
                className="p-4 sm:p-6 hover:bg-slate-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Icon */}
                    <div className={`flex-shrink-0 p-3 rounded-xl ${Config.color}`}>
                      <Config.icon size={20} />
                    </div>

                    {/* Text */}
                    <div className="min-w-0">
                      {/* ✅ item.action */}
                      <h4 className="text-sm sm:text-base font-medium text-textColor truncate leading-5 font-inter mb-1">
                        {item.action}
                      </h4>
                      {/* ✅ item.user_email */}
                      <p className="text-xs sm:text-sm text-[#4A5565] font-inter font-normal leading-5 truncate">
                        {item.user_email}
                      </p>
                    </div>
                  </div>

                  {/* ✅ formatted timestamp */}
                  <div className="shrink-0">
                    <span className="text-xs sm:text-sm text-[#4A5565] font-inter font-normal whitespace-nowrap">
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};







// import React from 'react';
// import { UserPlus, Activity, DollarSign } from 'lucide-react'; // Using Lucide for icons]
// type ActivityType = 'registration' | 'search' | 'subscription';

// interface ActivityItem {
//   id: string;
//   type: ActivityType;
//   title: string;
//   userEmail: string;
//   timestamp: string;
// }

// const activities: ActivityItem[] = [
//   { id: '1', type: 'registration', title: 'New user registration', userEmail: 'john.doe@example.com', timestamp: '2 minutes ago' },
//   { id: '2', type: 'search', title: 'Behaviour search performed', userEmail: 'john.doe@example.com', timestamp: '2 minutes ago' },
//   { id: '3', type: 'subscription', title: 'Premium subscription purchased', userEmail: 'john.doe@example.com', timestamp: '2 minutes ago' },
//   { id: '4', type: 'search', title: 'Behaviour search performed', userEmail: 'john.doe@example.com', timestamp: '2 minutes ago' },
//   { id: '5', type: 'search', title: 'Behaviour search performed', userEmail: 'john.doe@example.com', timestamp: '2 minutes ago' },
// ];

// const typeConfigs = {
//   registration: { icon: UserPlus, color: 'bg-blue-100 text-blue-600' },
//   search: { icon: Activity, color: 'bg-purple-100 text-purple-600' },
//   subscription: { icon: DollarSign, color: 'bg-green-100 text-green-600' },
// };

// export const RecentActivity: React.FC = () => {
//   return (
//     <div className="w-full mt-5 bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 overflow-hidden">
//       <div className="px-6 py-5 border-b border-slate-50">
//         <h2 className="text-xl md:text-2xl font-bold text-textColor leading-[120%]">Recent Activity</h2>
//       </div>

//       <div className="divide-y divide-slate-50">
//         {activities.map((item) => {
//           const Config = typeConfigs[item.type];
//           return (
//             <div key={item.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors duration-200">
//               <div className="flex items-center justify-between gap-4">
//                 <div className="flex items-center gap-4 min-w-0">
//                   {/* Icon Container */}
//                   <div className={`flex-shrink-0 p-3 rounded-xl ${Config.color}`}>
//                     <Config.icon size={20} />
//                   </div>
                  
//                   {/* Text Content */}
//                   <div className="min-w-0">
//                     <h4 className="text-sm sm:text-base font-medium text-textColor truncate leading-5 font-inter mb-1">
//                       {item.title}
//                     </h4>
//                     <p className="text-xs sm:text-sm text-[#4A5565] font-inter font-normal leading-5.5 truncate">
//                       {item.userEmail}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Timestamp */}
//                 <div className="shrink-0">
//                   <span className="text-xs sm:text-sm text-[#4A5565] font-inter font-normal leading-5.5  whitespace-nowrap">
//                     {item.timestamp}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };