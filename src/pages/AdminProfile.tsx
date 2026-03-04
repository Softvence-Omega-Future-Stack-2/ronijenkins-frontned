import { useState } from "react";
import profile from '../../public/img/adminProfile.png'
import { useNavigate } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatCard {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

interface Permission {
  name: string;
  granted: boolean;
}

// ─── Icons (inline SVG components) ───────────────────────────────────────────
const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const GearIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.59 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.81-.81a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const LocationIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

// ─── Section 1: Profile Header ────────────────────────────────────────────────
const ProfileHeader = () => {
  const [, setEditHovered] = useState(false);
const navigate = useNavigate()
  return (
    <div className="bg-white rounded-2xl md:rounded-4xl border border-borderColor shadow-sm p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Avatar + Name + Badge */}
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-24 sm:w-[119px] sm:h-[119px] rounded-2xl overflow-hidden bg-gray-200 border-2 border-white shadow-md">
              {/* Placeholder avatar – replace src with real image */}
              <img
                src={profile}
                alt="Nolan"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
             
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl mdLtext-4xl font-black text-titleColor leading-6 md:leading-10 tracking-tight">
              Nolan
            </h1>
            <div className="flex items-center gap-1 mt-1 text-buttonColor  text-xs font-medium uppercase leading-4 tracking-[1.5px[">
              <LocationIcon />
              <span>Super Admin</span>
            </div>
             <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4 ">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#9266901A] text-buttonColor">
            <MailIcon />
          </div>
          <div>
            <p className="text-xs text-subTitleColor uppercase tracking-wider font-black">Email</p>
            <p className="text-sm text-titleColor leading-5 font-medium">nolan@navellehealth.com</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#00C9501A] text-green-500">
            <PhoneIcon />
          </div>
          <div>
            <p className="text-xs text-subTitleColor uppercase tracking-wider font-black">Phone</p>
            <p className="ttext-sm text-titleColor leading-5 font-medium">+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button
        onClick={()=> navigate('/dashboard/edit_profile')}
          onMouseEnter={() => setEditHovered(true)}
          onMouseLeave={() => setEditHovered(false)}
          className="flex items-center gap-2 px-4 py-2 bg-buttonColor text-white cursor-pointer rounded-xl text-sm font-semibold transition-all duration-200 self-start sm:self-auto">
      
          <EditIcon />
          Edit Profile
        </button>
      </div>

      {/* Contact Info */}
     
    </div>
  );
};

// ─── Section 2: Stats Cards ───────────────────────────────────────────────────
const StatsSection = () => {
  const stats: StatCard[] = [
    {
      icon: <ClockIcon />,
      label: "Active Sessions",
      value: "42",
      trend: "+6.2%",
      trendUp: true,
    },
    {
      icon: <GearIcon />,
      label: "Total Actions",
      value: "1,245",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      icon: <UserIcon />,
      label: "Last Login",
      value: "Today",
      trend: "10:24 AM",
      trendUp: undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <StatCard key={i} stat={stat} />
      ))}
    </div>
  );
};

const StatCard = ({ stat }: { stat: StatCard }) => {
  const [hovered, setHovered] = useState(false);

//   const iconColors = [
//     { bg: "bg-orange-50", text: "text-orange-400" },
//     { bg: "bg-green-50", text: "text-green-500" },
//     { bg: "bg-blue-50", text: "text-blue-400" },
//   ];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white rounded-2xl md:rounded-4xl border border-borderColor  p-5 md:p-8 transition-all duration-200 cursor-default"
      style={{
        boxShadow: hovered
          ? "0 8px 30px rgba(0,0,0,0.08)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`p-2 rounded-xl ${
            stat.label === "Active Sessions"
              ? "bg-[#9266901A] text-buttonColor"
              : stat.label === "Total Actions"
              ? "bg-green-50 text-green-500"
              : "bg-blue-50 text-blue-400"
          }`}
        >
          {stat.icon}
        </div>

        {stat.trendUp !== undefined ? (
          <span className="flex items-center gap-0.5 text-xs font-semibold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
            <ArrowUpIcon />
            {stat.trend}
          </span>
        ) : (
          <span className="text-xs text-gray-400 font-medium">{stat.trend}</span>
        )}
      </div>

      <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
        {stat.label}
      </p>
      <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
    </div>
  );
};

// ─── Section 3: Permissions & Access ─────────────────────────────────────────
const PermissionsSection = () => {
  const permissions: Permission[] = [
    { name: "User Management", granted: true },
    { name: "Content CMS", granted: true },
    { name: "Mennie™ AI Logic", granted: true },
    { name: "Subscriptions", granted: true },
    { name: "System Settings", granted: true },
    { name: "Analytics Dashboard", granted: true },
    { name: "Broadcast Updates", granted: true },
    { name: "Data Export", granted: true },
  ];

  return (
    <div className="bg-white rounded-2xl md:rounded-4xl border border-borderColor shadow-sm p-5 sm:p-6">
      <h2 className="text-base md:texxt-xl font-black text-titleColor leading-7 mb-4 tracking-tight mb-5">
        Permissions &amp; Access
      </h2>

      <div className="divide-y divide-gray-50">
        {permissions.map((perm, i) => (
          <PermissionRow key={i} permission={perm} index={i} />
        ))}
      </div>
    </div>
  );
};

const PermissionRow = ({
  permission,
  
}: {
  permission: Permission;
  index: number;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center justify-between py-3 transition-all duration-150 rounded-lg px-2 -mx-2"
      style={{
        background: hovered ? "#f9fafb" : "transparent",
      }}
    >
      <span className="text-sm text-titleColor leading-5 font-medium">{permission.name}</span>

      <div className="flex items-center gap-2">
        {/* Animated dot */}
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{
            background: permission.granted ? "#22c55e" : "#ef4444",
            boxShadow: permission.granted
              ? "0 0 0 3px rgba(34,197,94,0.15)"
              : "0 0 0 3px rgba(239,68,68,0.15)",
          }}
        />
        <span
          className="text-xs font-black leading-5 uppercase tracking-widest"
          style={{ color: permission.granted ? "#22c55e" : "#ef4444" }}
        >
          {permission.granted ? "Granted" : "Denied"}
        </span>
      </div>
    </div>
  );
};


// ─── Root Component ───────────────────────────────────────────────────────────
export default function AdminProfile() {
  return (
    <div
      className="min-h-screen p-4 md:p-6"
    
    >
      {/* Google Font import */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <div className=" space-y-4">
        {/* Section 1 */}
        <ProfileHeader />

        {/* Section 2 */}
        <StatsSection />

        {/* Section 3 */}
        <PermissionsSection />

      </div>
    </div>
  );
}