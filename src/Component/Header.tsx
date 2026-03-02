import { Menu, Search, Bell } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate()

  return (
    <header
      className="flex items-center justify-between px-5 py-2.5 bg-white border-b border-gray-100"
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", minHeight: '60px' }}
    >
      {/* Left — Hamburger */}
      <div className="flex items-center gap-4">
<div>
      <button onClick={onMenuClick} className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
  <Menu size={20} />
  
</button>
</div>
  
 <div className="relative flex-1 min-w-0 max-w-[500px]">
  <Search
    size={15}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
  />
  <input
    type="text"
    placeholder="Search..."
    value={searchValue}
    onChange={(e) => setSearchValue(e.target.value)}
    className="w-full pl-9 pr-4 py-2 bg-[#FAF7F5] rounded-full text-sm text-gray-600 border border-borderColor placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-200 transition-all"
  />
</div>
      </div>

    

      {/* Right — Bell + User */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button onClick={()=> navigate('/dashboard/notifications')} className="relative p-2  hover:bg-gray-100 transition-colors cursor-pointer  border-r border-borderColor">
          <Bell size={19} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Avatar + Info */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          {/* Avatar with green ring like design */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[#4CAF82] flex items-center justify-center text-white font-bold text-sm ring-2 ring-[#4CAF82]/30">
              K
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-white" />
          </div>

          <div className="hidden sm:block text-left">
            <p className="text-[13px] font-semibold text-gray-800 leading-tight">Nolan</p>
            <p className="text-[11px] text-gray-400 font-medium leading-tight uppercase tracking-wide">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;