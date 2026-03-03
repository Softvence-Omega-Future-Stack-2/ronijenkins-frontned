import { Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface Subscriber {
  id:number;
  name: string;
  email: string;
  plan: 'Core' | 'Plus' | 'Complete';
  status: 'Active' | 'Cancelled';
  joinDate: string;
  revenue: string;
}

const subscribers: Subscriber[] = [
  {id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', plan: 'Core', status: 'Active', joinDate: 'Jan 15, 2024', revenue: '$0/mo' },
  {id:2, name: 'Emma Wilson', email: 'emma@example.com', plan: 'Plus', status: 'Active', joinDate: 'Jan 20, 2024', revenue: '$99/mo' },
  {id:3, name: 'Lisa Anderson', email: 'lisa@example.com', plan: 'Complete', status: 'Active', joinDate: 'Feb 1, 2024', revenue: '$199/mo' },
  {id:4, name: 'Maria Garcia', email: 'maria@example.com', plan: 'Plus', status: 'Active', joinDate: 'Feb 5, 2024', revenue: '$99/mo' },
  {id:5, name: 'Jennifer Lee', email: 'jennifer@example.com', plan: 'Core', status: 'Active', joinDate: 'Feb 10, 2024', revenue: '$0/mo' },
  {id:6, name: 'Amanda Brown', email: 'amanda@example.com', plan: 'Complete', status: 'Cancelled', joinDate: 'Jan 10, 2024', revenue: '$199/mo' },
];

const SubscriberTable: React.FC = () => {

const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
const [deletedIds, setDeletedIds] = useState<number[]>([]);
const [isFilterOpen, setIsFilterOpen] = useState(false);
const [startDate, setStartDate] = useState<string>("");
const [endDate, setEndDate] = useState<string>("");
const [, setFilteredSubscribers] = useState<Subscriber[]>(subscribers);

  const handleDeleteClick = (
  e: React.MouseEvent<HTMLButtonElement>,
  id: number
) => {
  e.stopPropagation(); 
  setSelectedUserId(id);
  setIsModalOpen(true);
};

const confirmDelete = () => {
  if (selectedUserId !== null) {
    setDeletedIds((prev) => [...prev, selectedUserId]);
  }
  setIsModalOpen(false);
  setSelectedUserId(null);
};


const filteredSubscribers = subscribers
  .filter((sub) => !deletedIds.includes(sub.id))
  .filter((sub) => {
    if (!startDate && !endDate) return true;

    const subDate = new Date(sub.joinDate);

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && subDate < start) return false;
    if (end && subDate > end) return false;

    return true;
  });

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsFilterOpen(false);
    }
  };

  if (isFilterOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isFilterOpen]);

  return (
    <div className="bg-white rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-titleColor text-base font-extrabold leading-6">All Subscribers</h2>
          <p className="text-subTitleColor text-xs font-medium leading-5 mt-0.5">Showing 6 of 2,044 total subscribers</p>
        </div>
        <div ref={dropdownRef} className="flex gap-3 relative">
          <button   onClick={() => setIsFilterOpen((prev) => !prev)}  className="flex items-center justify-center gap-2 px-4 py-2 w-[200px] border border-borderColor rounded-[12px] text-sm font-bold text-stone-600 hover:bg-stone-50 transition-colors">
            <span className="text-lg"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
  <path d="M1.8584 3.71533H13.0047" stroke="#4A3A37" stroke-width="1.39329" stroke-linecap="round"/>
  <path d="M3.71582 7.43115H11.1467" stroke="#4A3A37" stroke-width="1.39329" stroke-linecap="round"/>
  <path d="M5.57324 11.1465H9.28868" stroke="#4A3A37" stroke-width="1.39329" stroke-linecap="round"/>
</svg></span> Filter
          </button>

                              {isFilterOpen && (
<div className="absolute top-full right-0 mt-2 bg-white shadow-xl rounded-2xl p-5 w-[200px] border border-borderColor z-50">
    <div className="flex flex-col gap-4">
      
      <div>
        <label className="text-xs font-bold text-gray-500">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
        />
      </div>
         <button 
           onClick={() => {
    const filtered = subscribers.filter((sub) => {
      const subDate = new Date(sub.joinDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && subDate < start) return false;
      if (end && subDate > end) return false;
      return true;
    });

    setFilteredSubscribers(filtered);
    setIsFilterOpen(false); // dropdown close hobe
  }}
         className='bg-buttonColor text-sm py-2 px-3 text-white rounded-2xl cursor-pointer'>
        Apply
      </button>

      <button
        onClick={() => {
          setStartDate("");
          setEndDate("");
        }}
        className="text-sm text-red-500 border border-borderColor rounded-2xl py-2 px-3 font-bold cursor-pointer "
      >
        Cancel
      </button>
    
    </div>
  </div>
)}
     
       
        </div>
      </div>

      {/* Responsive Scroll Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#FCFAF8] border-y border-stone-100">
              <th className="text-left px-6 py-4 text-[10px] font-extrabold leading-4 tracking-[1px] text-[#4A3A3799] uppercase">User</th>
              <th className="text-left px-6 py-4 text-[10px] font-extrabold leading-4 tracking-[1px] text-[#4A3A3799] uppercase">Plan</th>
              <th className="text-left px-6 py-4 text-[10px] font-extrabold leading-4 tracking-[1px] text-[#4A3A3799] uppercase">Status</th>
              <th className="text-left px-6 py-4 text-[10px] font-extrabold leading-4 tracking-[1px] text-[#4A3A3799] uppercase">Join Date</th>
              <th className="text-left px-6 py-4 text-[10px] font-extrabold leading-4 tracking-[1px] text-[#4A3A3799] uppercase">Revenue</th>
              <th className="text-right px-6 py-4 text-[10px] font-extrabold leading-4 tracking-[1px] text-[#4A3A3799] uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredSubscribers.map((sub, idx) => (
              <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="font-black text-titleColor text-sm leading-4.5">{sub.name}</div>
                  <div className="text-xs text-[#4A3A3780] font-medium leading-4">{sub.email}</div>
                </td>
                <td className="px-8 py-5">
                    <span
    className={`px-4 py-2 rounded-full text-xs font-bold
      ${
        sub.plan === "Complete"
          ? "bg-buttonColor text-white"
          : sub.plan === "Plus"
          ? "bg-[#E8C3B44D] text-buttonColor"
          : "bg-[#9266901A] text-buttonColor"
      }
    `}
  >
    {sub.plan}
  </span>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-4 py-2 rounded-full text-xs font-bold 
                    ${sub.status === 'Active' ? 'bg-[#00D0841A] text-[#00D084]' : 'bg-[#FF6B6B1A] text-[#FF6B6B]'}`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm font-medium text-[#4A3A37B2]">{sub.joinDate}</td>
                <td className="px-8 py-5 font-black text-titleColor text-sm">{sub.revenue}</td>
                <td className="px-8 py-5 text-right">
                  <button onClick={(e) => handleDeleteClick(e, sub.id)} className="text-sm font-bold text-red-500 hover:text-[#845E84] cursor-pointer"><Trash2/></button>
                </td>
                                {isModalOpen && (
  <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
    <div className="bg-white w-[90%] sm:w-[400px] rounded-2xl p-6 shadow-xl">
      <h2 className="text-lg font-bold mb-3">Delete Subscription</h2>

      <p className="text-sm mb-6">
        Are you sure you want to delete this Subscription?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 rounded-xl border"
        >
          No
        </button>

        <button
          onClick={confirmDelete}
          className="px-4 py-2 rounded-xl bg-red-500 text-white"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
)}
              </tr>
            ))}

     </tbody>
        </table>


      </div>
    </div>
  );
};

export default SubscriberTable;