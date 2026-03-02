import React from 'react';

interface Subscriber {
  name: string;
  email: string;
  plan: 'Core' | 'Plus' | 'Complete';
  status: 'Active' | 'Cancelled';
  joinDate: string;
  revenue: string;
}

const subscribers: Subscriber[] = [
  { name: 'Sarah Johnson', email: 'sarah@example.com', plan: 'Core', status: 'Active', joinDate: 'Jan 15, 2024', revenue: '$0/mo' },
  { name: 'Emma Wilson', email: 'emma@example.com', plan: 'Plus', status: 'Active', joinDate: 'Jan 20, 2024', revenue: '$99/mo' },
  { name: 'Lisa Anderson', email: 'lisa@example.com', plan: 'Complete', status: 'Active', joinDate: 'Feb 1, 2024', revenue: '$199/mo' },
  { name: 'Maria Garcia', email: 'maria@example.com', plan: 'Plus', status: 'Active', joinDate: 'Feb 5, 2024', revenue: '$99/mo' },
  { name: 'Jennifer Lee', email: 'jennifer@example.com', plan: 'Core', status: 'Active', joinDate: 'Feb 10, 2024', revenue: '$0/mo' },
  { name: 'Amanda Brown', email: 'amanda@example.com', plan: 'Complete', status: 'Cancelled', joinDate: 'Jan 10, 2024', revenue: '$199/mo' },
];

const SubscriberTable: React.FC = () => {
  return (
    <div className="bg-white rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-titleColor text-base font-extrabold leading-6">All Subscribers</h2>
          <p className="text-subTitleColor text-xs font-medium leading-5 mt-0.5">Showing 6 of 2,044 total subscribers</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-borderColor rounded-[12px] text-sm font-bold text-stone-600 hover:bg-stone-50 transition-colors">
            <span className="text-lg">≡</span> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-borderColor rounded-[12px] text-sm font-bold text-stone-600 hover:bg-stone-50 transition-colors">
            <span className="text-lg">+</span> Export
          </button>
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
            {subscribers.map((sub, idx) => (
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
                  <button className="text-sm font-bold text-buttonColor hover:text-[#845E84] cursor-pointer">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriberTable;