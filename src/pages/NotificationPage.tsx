import React, { useState } from "react";
import { useGetNotificationsQuery, useMarkAllNotificationsAsReadMutation } from "../redux/features/admin/notificationApi";




type NotificationType =
  | "SUBSCRIPTION_REMINDER"
  | "GROUP_ASSIGNMENT"
  | "SECURITY_ALERT"
  | "DATABASE_UPDATE"
  | "REVENUE_MILESTONE"
  | "CONTENT_FLAGGED"
  | string;

interface ApiNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data: string | null;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}



const formatTime = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

type IconType = "security" | "database" | "revenue" | "flag";

const getIconType = (type: NotificationType): IconType => {
  const map: Record<string, IconType> = {
    SUBSCRIPTION_REMINDER: "revenue",
    REVENUE_MILESTONE: "revenue",
    GROUP_ASSIGNMENT: "flag",
    CONTENT_FLAGGED: "flag",
    SECURITY_ALERT: "security",
    DATABASE_UPDATE: "database",
  };
  return map[type] ?? "flag";
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  const iconType = getIconType(type);

  const styles: Record<IconType, { bg: string; color: string; icon: React.ReactNode }> = {
    security: {
      bg: "bg-rose-50",
      color: "text-rose-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19.9935 12.9955C19.9935 17.9937 16.4947 20.4929 12.3361 21.9424C12.1184 22.0162 11.8818 22.0126 11.6664 21.9324C7.4978 20.4929 3.99902 17.9937 3.99902 12.9955V5.99791C3.99902 5.73279 4.10434 5.47852 4.29181 5.29105C4.47929 5.10358 4.73355 4.99826 4.99868 4.99826C6.99798 4.99826 9.49711 3.79868 11.2365 2.27921C11.4483 2.09827 11.7177 1.99886 11.9962 1.99886C12.2748 1.99886 12.5442 2.09827 12.756 2.27921C14.5054 3.80867 16.9945 4.99826 18.9938 4.99826C19.2589 4.99826 19.5132 5.10358 19.7007 5.29105C19.8881 5.47852 19.9935 5.73279 19.9935 5.99791V12.9955Z" stroke="#E7000B" strokeWidth="1.9993" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8.99707 11.9958L10.9964 13.9951L14.995 9.99652" stroke="#E7000B" strokeWidth="1.9993" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    database: {
      bg: "bg-emerald-50",
      color: "text-emerald-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M11.9959 7.99722C16.9647 7.99722 20.9928 6.65454 20.9928 4.99826C20.9928 3.34198 16.9647 1.99931 11.9959 1.99931C7.02706 1.99931 2.99902 3.34198 2.99902 4.99826C2.99902 6.65454 7.02706 7.99722 11.9959 7.99722Z" stroke="#00A63E" strokeWidth="1.9993" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.99902 4.99826V18.9934C2.99902 19.7888 3.9469 20.5516 5.63414 21.114C7.32138 21.6764 9.60977 21.9923 11.9959 21.9923C14.382 21.9923 16.6704 21.6764 18.3576 21.114C20.0449 20.5516 20.9928 19.7888 20.9928 18.9934V4.99826" stroke="#00A63E" strokeWidth="1.9993" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.99902 11.9958C2.99902 12.7912 3.9469 13.554 5.63414 14.1164C7.32138 14.6788 9.60977 14.9948 11.9959 14.9948C14.382 14.9948 16.6704 14.6788 18.3576 14.1164C20.0449 13.554 20.9928 12.7912 20.9928 11.9958" stroke="#00A63E" strokeWidth="1.9993" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    revenue: {
      bg: "bg-purple-50",
      color: "text-purple-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#7C3AED" opacity="0.15" />
          <path d="M11.9961 2.99895V20.9927M8.49707 6.99756C8.49707 6.99756 8.99707 4.99826 11.9961 4.99826C14.9951 4.99826 15.4951 6.99756 15.4951 8.49721C15.4951 11.4962 8.49707 10.9962 8.49707 13.9951C8.49707 15.9944 9.99658 17.9937 11.9961 17.9937C13.9955 17.9937 15.4951 15.9944 15.4951 15.9944" stroke="#7C3AED" strokeWidth="1.9993" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    flag: {
      bg: "bg-orange-50",
      color: "text-orange-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M11.9961 6.99756V20.9927" stroke="#F54900" strokeWidth="1.9993" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.99868 17.9937C2.73355 17.9937 2.47929 17.8884 2.29181 17.7009C2.10434 17.5135 1.99902 17.2592 1.99902 16.9941V3.99861C1.99902 3.73348 2.10434 3.47922 2.29181 3.29175C2.47929 3.10427 2.73355 2.99895 2.99868 2.99895H7.99693C9.05743 2.99895 10.0745 3.42024 10.8244 4.17012C11.5743 4.92 11.9955 5.93706 11.9955 6.99756C11.9955 5.93706 12.4168 4.92 13.1667 4.17012C13.9166 3.42024 14.9337 2.99895 15.9941 2.99895H20.9924C21.2575 2.99895 21.5118 3.10427 21.6993 3.29175C21.8867 3.47922 21.9921 3.73348 21.9921 3.99861V16.9941C21.9921 17.2592 21.8867 17.5135 21.6993 17.7009C21.5118 17.8884 21.2575 17.9937 20.9924 17.9937H14.9945C14.1991 17.9937 13.4363 18.3097 12.8739 18.8721C12.3115 19.4345 11.9955 20.1973 11.9955 20.9927C11.9955 20.1973 11.6796 19.4345 11.1172 18.8721C10.5548 18.3097 9.79196 17.9937 8.99659 17.9937H2.99868Z" stroke="#F54900" strokeWidth="1.9993" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  };

  const current = styles[iconType];
  return (
    <div className={`w-12 h-12 rounded-2xl ${current.bg} ${current.color} flex items-center justify-center text-xl shrink-0`}>
      {current.icon}
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const NotificationSkeleton = () => (
  <div className="bg-white border border-borderColor p-4 md:p-6 rounded-2xl md:rounded-4xl flex flex-col md:flex-row gap-4 md:items-center animate-pulse">
    <div className="w-12 h-12 rounded-2xl bg-gray-100 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-100 rounded w-1/3" />
      <div className="h-3 bg-gray-100 rounded w-2/3" />
    </div>
    <div className="h-3 bg-gray-100 rounded w-12" />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const NotificationPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, isFetching } = useGetNotificationsQuery({ page, limit });
  const [markAllAsRead, { isLoading: isMarking }] = useMarkAllNotificationsAsReadMutation();

  const notifications: ApiNotification[] = data?.notifications ?? [];
  const meta = data?.meta ?? { page: 1, limit: 10, total: 0, totalPage: 1 };
  const totalPages = meta.totalPage ?? 1;
  const allRead = notifications.every((n) => n.read);

  console.log(notifications)

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-end">
        <div>
          <h2 className="text-titleColor text-xl sm:text-2xl md:text-[30px] font-extrabold leading-6 md:leading-[36px]">
            Notifications
          </h2>
          <p className="text-subTitleColor text-sm font-medium leading-5 mt-0.5">
            Critical alerts and system updates requiring your attention
          </p>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          disabled={isMarking || allRead || isLoading}
          className="text-xs font-black uppercase tracking-widest text-buttonColor cursor-pointer transition-opacity pb-1 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isMarking ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <NotificationSkeleton key={i} />)
        ) : isError ? (
          <div className="text-center py-12 text-rose-500 font-semibold">
            Failed to load notifications. Please try again.
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-subTitleColor font-medium">
            You're all caught up! No notifications.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`group relative bg-white border p-4 md:p-6 rounded-2xl md:rounded-4xl flex flex-col md:flex-row gap-4 md:items-center transition-all hover:shadow-md hover:border-stone-200 ${
                !notif.read ? "border-buttonColor/30" : "border-borderColor"
              }`}
            >
              <NotificationIcon type={notif.type} />

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-titleColor leading-5 md:leading-7 text-lg mb-1">
                    {notif.title}
                  </h3>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-buttonColor shrink-0" />
                  )}
                </div>
                <p className="text-subTitleColor text-sm font-medium line-clamp-2 md:line-clamp-1 leading-relaxed">
                  {notif.body}
                </p>

                {/* Optional: render parsed `data` field */}
                {notif.data && (() => {
                  try {
                    const parsed = JSON.parse(notif.data);
                    return (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Object.entries(parsed).map(([key, val]) => (
                          <span
                            key={key}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 uppercase tracking-wider"
                          >
                            {key}: {String(val)}
                          </span>
                        ))}
                      </div>
                    );
                  } catch {
                    return null;
                  }
                })()}
              </div>

              <div className="text-[#4A3A3799] text-xs font-bold whitespace-nowrap leading-4 md:pt-0 pt-2 border-t md:border-none border-stone-50">
                {formatTime(notif.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isFetching}
            className="px-4 py-2 rounded-xl border border-borderColor text-sm font-bold text-titleColor disabled:opacity-40 disabled:cursor-not-allowed hover:border-stone-300 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-subTitleColor">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isFetching}
            className="px-4 py-2 rounded-xl border border-borderColor text-sm font-bold text-titleColor disabled:opacity-40 disabled:cursor-not-allowed hover:border-stone-300 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;


// import React from 'react';

// interface Notification {
//   id: number;
//   type: 'security' | 'database' | 'revenue' | 'flag';
//   title: string;
//   description: string;
//   time: string;
//   isUnread: boolean;
// }

// const notifications: Notification[] = [
//   {
//     id: 1,
//     type: 'security',
//     title: 'Unauthorized Login Attempt',
//     description: 'Blocked a login attempt from suspicious IP: 192.168.1.1. Region detected: North',
//     time: '5m ago',
//     isUnread: true
//   },
//   {
//     id: 2,
//     type: 'database',
//     title: 'Database Optimization Complete',
//     description: 'Weekly automated maintenance finished successfully. 1.2GB storage reclaimed. Query',
//     time: '2h ago',
//     isUnread: false
//   },
//   {
//     id: 3,
//     type: 'revenue',
//     title: 'New Premium Milestone',
//     description: 'Revenue surpassed $500k ARR today. Celebration protocol initiated. This represents a',
//     time: '4h ago',
//     isUnread: true
//   },
//   {
//     id: 4,
//     type: 'flag',
//     title: 'Article Flagged by Community',
//     description: "User #4502 flagged 'Hormone Relief' for inaccuracy. Requires human review by a clinical",
//     time: '1d ago',
//     isUnread: false
//   }
// ];

// const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
//   const styles = {
//     security: { bg: 'bg-rose-50', color: 'text-rose-500', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//   <path d="M19.9935 12.9955C19.9935 17.9937 16.4947 20.4929 12.3361 21.9424C12.1184 22.0162 11.8818 22.0126 11.6664 21.9324C7.4978 20.4929 3.99902 17.9937 3.99902 12.9955V5.99791C3.99902 5.73279 4.10434 5.47852 4.29181 5.29105C4.47929 5.10358 4.73355 4.99826 4.99868 4.99826C6.99798 4.99826 9.49711 3.79868 11.2365 2.27921C11.4483 2.09827 11.7177 1.99886 11.9962 1.99886C12.2748 1.99886 12.5442 2.09827 12.756 2.27921C14.5054 3.80867 16.9945 4.99826 18.9938 4.99826C19.2589 4.99826 19.5132 5.10358 19.7007 5.29105C19.8881 5.47852 19.9935 5.73279 19.9935 5.99791V12.9955Z" stroke="#E7000B" stroke-width="1.9993" stroke-linecap="round" stroke-linejoin="round"/>
//   <path d="M8.99707 11.9958L10.9964 13.9951L14.995 9.99652" stroke="#E7000B" stroke-width="1.9993" stroke-linecap="round" stroke-linejoin="round"/>
// </svg>
//  },
//     database: { bg: 'bg-emerald-50', color: 'text-emerald-500', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//   <path d="M11.9959 7.99722C16.9647 7.99722 20.9928 6.65454 20.9928 4.99826C20.9928 3.34198 16.9647 1.99931 11.9959 1.99931C7.02706 1.99931 2.99902 3.34198 2.99902 4.99826C2.99902 6.65454 7.02706 7.99722 11.9959 7.99722Z" stroke="#00A63E" stroke-width="1.9993" stroke-linecap="round" stroke-linejoin="round"/>
//   <path d="M2.99902 4.99826V18.9934C2.99902 19.7888 3.9469 20.5516 5.63414 21.114C7.32138 21.6764 9.60977 21.9923 11.9959 21.9923C14.382 21.9923 16.6704 21.6764 18.3576 21.114C20.0449 20.5516 20.9928 19.7888 20.9928 18.9934V4.99826" stroke="#00A63E" stroke-width="1.9993" stroke-linecap="round" stroke-linejoin="round"/>
//   <path d="M2.99902 11.9958C2.99902 12.7912 3.9469 13.554 5.63414 14.1164C7.32138 14.6788 9.60977 14.9948 11.9959 14.9948C14.382 14.9948 16.6704 14.6788 18.3576 14.1164C20.0449 13.554 20.9928 12.7912 20.9928 11.9958" stroke="#00A63E" stroke-width="1.9993" stroke-linecap="round" stroke-linejoin="round"/>
// </svg>
//      },
//     revenue: { bg: 'bg-purple-50', color: 'text-purple-500', icon: '$' },
//     flag: { bg: 'bg-orange-50', color: 'text-orange-500', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//   <path d="M11.9961 6.99756V20.9927" stroke="#F54900" stroke-width="1.9993" stroke-linecap="round" stroke-linejoin="round"/>
//   <path d="M2.99868 17.9937C2.73355 17.9937 2.47929 17.8884 2.29181 17.7009C2.10434 17.5135 1.99902 17.2592 1.99902 16.9941V3.99861C1.99902 3.73348 2.10434 3.47922 2.29181 3.29175C2.47929 3.10427 2.73355 2.99895 2.99868 2.99895H7.99693C9.05743 2.99895 10.0745 3.42024 10.8244 4.17012C11.5743 4.92 11.9955 5.93706 11.9955 6.99756C11.9955 5.93706 12.4168 4.92 13.1667 4.17012C13.9166 3.42024 14.9337 2.99895 15.9941 2.99895H20.9924C21.2575 2.99895 21.5118 3.10427 21.6993 3.29175C21.8867 3.47922 21.9921 3.73348 21.9921 3.99861V16.9941C21.9921 17.2592 21.8867 17.5135 21.6993 17.7009C21.5118 17.8884 21.2575 17.9937 20.9924 17.9937H14.9945C14.1991 17.9937 13.4363 18.3097 12.8739 18.8721C12.3115 19.4345 11.9955 20.1973 11.9955 20.9927C11.9955 20.1973 11.6796 19.4345 11.1172 18.8721C10.5548 18.3097 9.79196 17.9937 8.99659 17.9937H2.99868Z" stroke="#F54900" stroke-width="1.9993" stroke-linecap="round" stroke-linejoin="round"/>
// </svg>
//  },
//   };

//   const current = styles[type];

//   return (
//     <div className={`w-12 h-12 rounded-2xl ${current.bg} ${current.color} flex items-center justify-center text-xl shrink-0`}>
//       {current.icon}
//     </div>
//   );
// };

// const NotificationPage: React.FC = () => {
//   return (
//     <div className=" p-4 md:p-8 space-y-8">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-end">
//         <div>
//           <h2 className="text-titleColor text-xl sm:text-2xl md:text-[30px] font-extrabold leading-6 md:leading-[36px]">Notifications</h2>
//           <p className="text-subTitleColor text-sm font-medium leading-5 mt-0.5">
//             Critical alerts and system updates requiring your attention
//           </p>
//         </div>
//         <button className="text-xs font-black uppercase tracking-widest text-buttonColor cursor-pointer transition-opacity pb-1">
//           Mark all as read
//         </button>
//       </div>

//       {/* Notification List */}
//       <div className="space-y-4">
//         {notifications.map((notif) => (
//           <div 
//             key={notif.id}
//             className="group relative bg-white border border-borderColor p-4 md:p-6 rounded-2xl md:rounded-4xl  flex flex-col md:flex-row gap-4 md:items-center transition-all hover:shadow-md hover:border-stone-200"
//           >
//             <NotificationIcon type={notif.type} />
            
//             <div className="flex-1 space-y-1">
//               <div className="flex items-center gap-2">
//                 <h3 className="font-black text-titleColor leading-5 md:leading-7 text-lg mb-1">
//                   {notif.title}
//                 </h3>
//                 {notif.isUnread && (
//                   <span className="w-2 h-2 rounded-full bg-buttonColor" />
//                 )}
//               </div>
//               <p className="text-subTitleColor text-sm font-medium line-clamp-2 md:line-clamp-1 leading-relaxed">
//                 {notif.description}
//               </p>
//             </div>

//             <div className="text-[#4A3A3799] text-xs font-bold whitespace-nowrap leading-4 md:pt-0 pt-2 border-t md:border-none border-stone-50">
//               {notif.time}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default NotificationPage;