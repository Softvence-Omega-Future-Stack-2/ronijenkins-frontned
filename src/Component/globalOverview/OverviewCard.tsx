import { Users, Activity, MessageSquare, TrendingUp } from "lucide-react";
import { useGetSystemOverviewQuery } from "../../redux/features/admin/systemOverview";

const OverviewCard = () => {
  const { data: statsData, isLoading } = useGetSystemOverviewQuery(undefined);

  const stats = [
    {
      id: "users",
      label: "GLOBAL ACTIVE USERS",
      value: statsData?.users?.total ?? 0,
      sub: `${statsData?.users?.active ?? 0} active`,
      icon: <Users size={20} />,
      iconBg: "#F0EDFB",
      iconColor: "#9B8BB4",
    },
    {
      id: "health",
      label: "TOTAL HEALTH LOGS",
      value: statsData?.health?.totalLogs ?? 0,
      sub: `Avg severity ${statsData?.health?.overallAvgSeverity?.toFixed(1) ?? 0}`,
      icon: <Activity size={20} />,
      iconBg: "#E8F5EE",
      iconColor: "#4CAF82",
    },
    {
      id: "engagement",
      label: "TOTAL CONTENT",
      value: statsData?.engagement?.totalContent ?? 0,
      sub: `${statsData?.engagement?.totalImpressions ?? 0} impressions`,
      icon: <MessageSquare size={20} />,
      iconBg: "#F0F0F0",
      iconColor: "#9B9B9B",
    },
    {
      id: "revenue",
      label: "TOTAL REVENUE",
      value: `$${statsData?.revenue?.totalRevenue?.toFixed(2) ?? "0.00"}`,
      sub: `${statsData?.revenue?.activeSubscriptions ?? 0} active subs`,
      icon: <TrendingUp size={20} />,
      iconBg: "#FEF3EC",
      iconColor: "#F0956A",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-4xl p-6 border border-borderColor animate-pulse">
            <div className="flex justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gray-200" />
              <div className="h-4 w-12 bg-gray-200 rounded" />
            </div>
            <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
            <div className="h-8 w-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white rounded-4xl p-6 flex flex-col gap-3 border border-borderColor transition-shadow duration-200"
        >
          {/* Top row */}
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}
            >
              {stat.icon}
            </div>
            <span className="text-xs font-semibold text-subTitleColor">{stat.sub}</span>
          </div>

          {/* Label */}
          <div className="text-subTitleColor font-extrabold text-[10px] leading-4 tracking-[0.10em] uppercase mb-1">
            {stat.label}
          </div>

          {/* Value */}
          <div className="text-titleColor text-2xl md:text-[28px] font-extrabold leading-none" style={{ letterSpacing: "-0.02em" }}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewCard;





// import { Users, Activity, MessageSquare, TrendingUp } from "lucide-react";

// interface StatCard {
//   id: string;
//   label: string;
//   value: string;
//   change: string;
//   isPositive: boolean;
//   icon: React.ReactNode;
//   iconBg: string;
//   iconColor: string;
// }

// const stats: StatCard[] = [
//   {
//     id: "users",
//     label: "GLOBAL ACTIVE USERS",
//     value: "2,840",
//     change: "+12.5%",
//     isPositive: true,
//     icon: <Users size={20} />,
//     iconBg: "#F0EDFB",
//     iconColor: "#9B8BB4",
//   },
//   {
//     id: "health",
//     label: "DAILY HEALTH LOGS",
//     value: "1,120",
//     change: "+5.4%",
//     isPositive: true,
//     icon: <Activity size={20} />,
//     iconBg: "#E8F5EE",
//     iconColor: "#4CAF82",
//   },
//   {
//     id: "ai",
//     label: "AI INTELLIGENCE OPS",
//     value: "14.2k",
//     change: "-2.1%",
//     isPositive: false,
//     icon: <MessageSquare size={20} />,
//     iconBg: "#F0F0F0",
//     iconColor: "#9B9B9B",
//   },
//   {
//     id: "revenue",
//     label: "PROJECTED REVENUE",
//     value: "$42.5k",
//     change: "+18%",
//     isPositive: true,
//     icon: <TrendingUp size={20} />,
//     iconBg: "#FEF3EC",
//     iconColor: "#F0956A",
//   },
// ];

// const OverviewCard = () => {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
//       {stats.map((stat) => (
//         <div
//           key={stat.id}
//           className="bg-white rounded-4xl p-6  flex flex-col gap-3 border border-borderColor  transition-shadow duration-200"
//           style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
//         >
//           {/* Top row: icon + change */}
//           <div className="flex items-center justify-between mb-4">
//             {/* Icon */}
//             <div
//               className="w-10 h-10 rounded-xl flex items-center justify-center"
//               style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}
//             >
//               {stat.icon}
//             </div>

//             {/* Change badge */}
//             <div
//               className="flex items-center gap-1 text-xs font-semibold"
//               style={{ color: stat.isPositive ? "#4CAF82" : "#E05A5A" }}
//             >
//               {stat.isPositive ? (
//                 <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//                   <path d="M2 9L6 3L10 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//               ) : (
//                 <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//                   <path d="M2 3L6 9L10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//               )}
//               {stat.change}
//             </div>
//           </div>

//           {/* Label */}
//           <div
//             className="text-subTitleColor font-extrabold text-xs leading-4  tracking-[0.10em] uppercase mb-1"
//             style={{ fontSize: "10px" }}
//           >
//             {stat.label}
//           </div>

//           {/* Value */}
//           <div
//             className="text-titleColor text-2xl md:text-[30px] font-extrabold leading-none"
//             style={{ fontSize: "28px", letterSpacing: "-0.02em" }}
//           >
//             {stat.value}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default OverviewCard;