import React, { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {  Users, LogOut,   FileText } from 'lucide-react';
import logo from '../../public/img/logo.png'

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

// Custom SVG Icons to match the design
const ContentCMSIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const MennieIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
    <path d="M9 9h.01M15 9h.01"/>
    <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
  </svg>
);

const SubscriptionsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <path d="M2 10h20"/>
    <path d="M6 15h4"/>
  </svg>
);

const NavelleLogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" fill="#8B6FE8" opacity="0.15"/>
    <path d="M12 28L20 12L28 28" stroke="#8B6FE8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.5 23h11" stroke="#8B6FE8" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const menuItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Global Overview',
      icon: <ContentCMSIcon />,
      path: '/dashboard',
    },
    {
      id: 'users',
      label: 'User Management',
      icon: <Users size={19} />,
      path: '/dashboard/users-managment',
    },
    {
      id: 'content',
      label: 'Content CMS',
      icon: <FileText size={19} />,
      path: '/dashboard/content-cms',
    },
    {
      id: 'mennie',
      label: 'Mennie™ AI Logic',
      icon: <MennieIcon />,
      path: '/dashboard/ai-logic',
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: <SubscriptionsIcon />,
      path: '/dashboard/subscription',
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
     
      className="w-full h-full bg-[#FAFAFA] flex flex-col overflow-hidden"
    >
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 flex items-center gap-2.5">
       
        <div>
          <img src={logo} alt="" />
        </div>
      </div>

      {/* Main Menu Label */}
      <div
        className="px-6 pb-3 text-[#B0A3C4] font-semibold uppercase tracking-[0.12em]"
        style={{ fontSize: '10px' }}
      >
        Main Menu
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3">
        <div className="space-y-0.5">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-[10px] rounded-xl transition-all duration-200 cursor-pointer text-left group ${
                  active
                    ? 'bg-[#926690] text-white shadow-md shadow-purple-200'
                    : 'text-[#6B6480] hover:bg-[#F0EBF8] hover:text-[#7C5CBF]'
                }`}
              >
                <div
                  className={`shrink-0 transition-colors ${
                    active ? 'text-white' : 'text-[#9B8BB4] group-hover:text-[#7C5CBF]'
                  }`}
                >
                  {item.icon}
                </div>
                <span
                  className={`font-medium leading-tight whitespace-pre-line ${
                    active ? 'text-white' : 'text-[#4A3F62]'
                  }`}
                  style={{ fontSize: '13.5px' }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Log Out - Fixed at Bottom */}
      <div className="px-3 py-5 border-t border-gray-100">
        <button
          onClick={() => {
            /* handle logout */
          }}
          className="w-full flex items-center gap-3 px-4 py-[10px] rounded-xl text-[#E05A5A] hover:bg-red-50 transition-all duration-200 cursor-pointer group"
        >
          <LogOut size={18} className="shrink-0 text-[#E05A5A]" />
          <span className="font-medium" style={{ fontSize: '13.5px' }}>
            Log Out
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;