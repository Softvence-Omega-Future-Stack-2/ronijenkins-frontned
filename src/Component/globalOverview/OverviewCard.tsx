import { Users, Activity, MessageSquare, TrendingUp } from "lucide-react";

interface StatCard {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const stats: StatCard[] = [
  {
    id: "users",
    label: "GLOBAL ACTIVE USERS",
    value: "2,840",
    change: "+12.5%",
    isPositive: true,
    icon: <Users size={20} />,
    iconBg: "#F0EDFB",
    iconColor: "#9B8BB4",
  },
  {
    id: "health",
    label: "DAILY HEALTH LOGS",
    value: "1,120",
    change: "+5.4%",
    isPositive: true,
    icon: <Activity size={20} />,
    iconBg: "#E8F5EE",
    iconColor: "#4CAF82",
  },
  {
    id: "ai",
    label: "AI INTELLIGENCE OPS",
    value: "14.2k",
    change: "-2.1%",
    isPositive: false,
    icon: <MessageSquare size={20} />,
    iconBg: "#F0F0F0",
    iconColor: "#9B9B9B",
  },
  {
    id: "revenue",
    label: "PROJECTED REVENUE",
    value: "$42.5k",
    change: "+18%",
    isPositive: true,
    icon: <TrendingUp size={20} />,
    iconBg: "#FEF3EC",
    iconColor: "#F0956A",
  },
];

const OverviewCard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white rounded-4xl p-6  flex flex-col gap-3 border border-borderColor  transition-shadow duration-200"
          style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
        >
          {/* Top row: icon + change */}
          <div className="flex items-center justify-between mb-4">
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}
            >
              {stat.icon}
            </div>

            {/* Change badge */}
            <div
              className="flex items-center gap-1 text-xs font-semibold"
              style={{ color: stat.isPositive ? "#4CAF82" : "#E05A5A" }}
            >
              {stat.isPositive ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 9L6 3L10 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 3L6 9L10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {stat.change}
            </div>
          </div>

          {/* Label */}
          <div
            className="text-subTitleColor font-extrabold text-xs leading-4  tracking-[0.10em] uppercase mb-1"
            style={{ fontSize: "10px" }}
          >
            {stat.label}
          </div>

          {/* Value */}
          <div
            className="text-titleColor text-2xl md:text-[30px] font-extrabold leading-none"
            style={{ fontSize: "28px", letterSpacing: "-0.02em" }}
          >
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewCard;