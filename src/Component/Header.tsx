import { Menu, Search, } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profileImg from '../../public/img/Container.png'

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  return (
    <header
      className="flex items-center justify-between px-6 py-2.5 bg-white border-b border-gray-100"
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", minHeight: '60px' }}
    >
      {/* Left — Hamburger + Search */}
      <div className="flex items-center gap-4 flex-1 min-w-0 mr-6">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <Menu size={20} />
        </button>

        <div className="relative w-full max-w-[500px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF7F5] rounded-full text-sm text-gray-600 border border-gray-200 placeholder-gray-400 outline-none focus:ring-2 focus:ring-buttonColor focus:border-purple-200 transition-all"
          />
        </div>
      </div>

      {/* Right — Bell + User */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Notification Bell */}
        <button
          onClick={() => navigate('/dashboard/notifications')}
          className="relative p-2 hover:bg-gray-100  transition-colors cursor-pointer border-r border-gray-200 pr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M8.55469 17.4966C8.70095 17.7499 8.9113 17.9602 9.16461 18.1065C9.41791 18.2527 9.70525 18.3297 9.99774 18.3297C10.2902 18.3297 10.5776 18.2527 10.8309 18.1065C11.0842 17.9602 11.2945 17.7499 11.4408 17.4966" stroke="#4A3A37" stroke-opacity="0.4" stroke-width="1.66634" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2.71768 12.7691C2.60884 12.8884 2.53701 13.0367 2.51094 13.1961C2.48486 13.3555 2.50566 13.519 2.5708 13.6667C2.63594 13.8145 2.74262 13.9402 2.87786 14.0284C3.0131 14.1167 3.17108 14.1637 3.33256 14.1638H16.6633C16.8248 14.1639 16.9828 14.117 17.1181 14.0289C17.2534 13.9408 17.3602 13.8153 17.4255 13.6677C17.4909 13.52 17.5119 13.3565 17.486 13.1972C17.4601 13.0378 17.3885 12.8894 17.2798 12.7699C16.1717 11.6276 14.9969 10.4137 14.9969 6.66528C14.9969 5.33946 14.4703 4.06794 13.5328 3.13044C12.5953 2.19294 11.3237 1.66626 9.99793 1.66626C8.6721 1.66626 7.40058 2.19294 6.46308 3.13044C5.52558 4.06794 4.9989 5.33946 4.9989 6.66528C4.9989 10.4137 3.8233 11.6276 2.71768 12.7691Z" stroke="#4A3A37" stroke-opacity="0.4" stroke-width="1.66634" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
          <span className="absolute top-1.5 right-5 w-2 h-2 bg-purple-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Avatar + Info */}
        <div className="flex items-center border border-borderColor bg-[#FAF7F5] rounded-2xl py-1 px-4 gap-2.5 cursor-pointer group">
          <div className="relative flex-shrink-0">
            <img src={profileImg} alt="" />
            
          </div>

          <div className="hidden sm:block text-left">
            <p className="text-[13px] font-black text-titleColro leading-tight">Nolan</p>
            <p className="text-[11px] text-[#4A3A3766] font-black leading-tight uppercase tracking-wide">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;