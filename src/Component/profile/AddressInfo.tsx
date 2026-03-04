import React from 'react';
import { MapPin } from 'lucide-react';

const AddressInformation: React.FC = () => {
  return (
    // Main container with full width, padding, background, and rounded corners
    <div className="w-full h-full p-4 md:p-8 bg-white rounded-[45px] shadow-sm border border-gray-100 flex flex-col">
      {/* Card Header */}
      <h2 className="text-base md:text-xl font-black text-titleColor mb-4 tracking-tight mb-6">
        Address Information
      </h2>

      {/* Form Grid: Single column by default, two columns on medium ('md') screens and above */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        
        {/* Street Address - Full width */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="block text-xs text-subTitleColor  uppercase tracking-widest font-black leading-5 tracking-[1px] mb-3">
            Street Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              placeholder="123 Health Street"
              className="w-full bg-[#fcfaf9] border border-gray-100 rounded-2xl py-4 pl-11 pr-4 text-sm text-[#332a2a] placeholder-subTileColor  focus:outline-none focus:ring-2 focus:ring-[#6d4c7d]/10 focus:border-[#6d4c7d] transition-all"
            />
          </div>
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <label className="block text-xs text-subTitleColor  uppercase tracking-widest font-black leading-5 tracking-[1px] mb-3">
            City
          </label>
          <input
            type="text"
            placeholder="San Francisco"
            className="w-full bg-[#fcfaf9] border border-gray-100 rounded-2xl py-4 px-5 text-sm text-[#332a2a] placeholder-subTileColor  focus:outline-none focus:ring-2 focus:ring-[#6d4c7d]/10 focus:border-[#6d4c7d] transition-all"
          />
        </div>

        {/* State */}
        <div className="space-y-1.5">
          <label className="block text-xs text-subTitleColor  uppercase tracking-widest font-black leading-5 tracking-[1px] mb-3">
            State
          </label>
          <input
            type="text"
            placeholder="CA"
            className="w-full bg-[#fcfaf9] border border-gray-100 rounded-2xl py-4 px-5 text-sm text-[#332a2a] placeholder-subTileColor  focus:outline-none focus:ring-2 focus:ring-[#6d4c7d]/10 focus:border-[#6d4c7d] transition-all"
          />
        </div>

        {/* ZIP Code */}
        <div className="space-y-1.5">
          <label className="block text-xs text-subTitleColor  uppercase tracking-widest font-black leading-5 tracking-[1px] mb-3">
            ZIP Code
          </label>
          <input
            type="text"
            placeholder="94102"
            className="w-full bg-[#fcfaf9] border border-gray-100 rounded-2xl py-4 px-5 text-sm text-[#332a2a] placeholder-subTileColor  focus:outline-none focus:ring-2 focus:ring-[#6d4c7d]/10 focus:border-[#6d4c7d] transition-all"
          />
        </div>

        {/* Location Display - with MapPin icon */}
        <div className="space-y-1.5">
          <label className="block text-xs text-subTitleColor  uppercase tracking-widest font-black leading-5 tracking-[1px] mb-3">
            Location Display
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              placeholder="San Francisco, CA"
              className="w-full bg-[#fcfaf9] border border-gray-100 rounded-2xl py-4 pl-11 pr-4 text-sm text-[#332a2a] placeholder-subTileColor  focus:outline-none focus:ring-2 focus:ring-[#6d4c7d]/10 focus:border-[#6d4c7d] transition-all"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddressInformation;