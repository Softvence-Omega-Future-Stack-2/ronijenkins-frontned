import { Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useGetPaymentsQuery } from "../../redux/features/admin/subsciptionApi";

const SubscriberTable: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, error } = useGetPaymentsQuery({
    page: 1,
    limit: 10,
  });

 const payments = data?.payments || [];
// const meta = data?.meta || {};


  const handleDeleteClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.stopPropagation();
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUserId) {
      setDeletedIds((prev) => [...prev, selectedUserId]);
    }
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  // FILTERED DATA
  const filteredPayments = payments
    .filter((pay: any) => !deletedIds.includes(pay.id))
    .filter((pay: any) => {
      if (!startDate && !endDate) return true;

      const payDate = new Date(pay.paymentDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && payDate < start) return false;
      if (end && payDate > end) return false;

      return true;
    });

  // close dropdown outside click
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

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  if (isLoading) {
    return <div className="p-10 text-center font-bold">Loading...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">Error loading data</div>;
  }

  return (
<div>
      <div className="bg-white rounded-[2rem]  border border-stone-100 shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="p-8 flex justify-between items-center">
        <div>
          <h2 className="text-titleColor text-base font-extrabold">
            All Payments
          </h2>
          <p className="text-xs text-gray-400">
            Showing {filteredPayments.length} payments
          </p>
        </div>

        {/* FILTER */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="px-4 py-2 border rounded-xl text-sm font-bold"
          >
            Filter
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-xl p-4 rounded-xl w-[220px] z-50">
              <div className="flex flex-col gap-3">

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border p-2 rounded-lg text-sm"
                />

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border p-2 rounded-lg text-sm"
                />

                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="bg-black text-white py-2 rounded-lg text-sm"
                >
                  Apply
                </button>

                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="text-red-500 text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto h-screen">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 text-xs uppercase">
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Plan</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
             {filteredPayments.length === 0 ? (
  <tr>
    <td colSpan={6} className="text-center py-10 text-gray-400">
      No data found
    </td>
  </tr>
) : (
  filteredPayments.map((pay: any) => (
              <tr key={pay.id} className="border-t border-stone-100 hover:bg-gray-50">

                {/* USER */}
                <td className="p-4">
                  <div className="font-bold text-sm">
                    {pay.customerId?.slice(0, 10)}...
                  </div>
                  <div className="text-xs text-gray-400">
                    {pay.currency}
                  </div>
                </td>

                {/* PLAN */}
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                    N/A
                  </span>
                </td>

                {/* STATUS */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      pay.paymentStatus === "SUCCEEDED"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {pay.paymentStatus}
                  </span>
                </td>

                {/* DATE */}
                <td className="p-4 text-sm text-gray-600">
                  {new Date(pay.paymentDate).toLocaleDateString()}
                </td>

                {/* AMOUNT */}
                <td className="p-4 font-bold">
                  ${pay.amount} {pay.currency}
                </td>

                {/* DELETE */}
                <td className="p-4 text-right">
                  <button
                    onClick={(e) => handleDeleteClick(e, pay.id)}
                    className="text-red-500"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            )
          ))}
          </tbody>
        </table>
      </div>

      {/* DELETE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[300px]">
            <h2 className="font-bold mb-3">Delete Payment</h2>
            <p className="text-sm mb-5">Are you sure?</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 border rounded"
              >
                No
              </button>

              <button
                onClick={confirmDelete}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
    <div className="mt-6 flex justify-center gap-2">
  {Array.from({ length: payments?.meta?.totalPage || 1 }, (_, i) => (
    <button
      key={i + 1}
      onClick={() => setPage(i)}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
        page === i
          ? "bg-buttonColor text-white border border-buttonColor"
          : "border border-borderColor bg-white text-subTitleColor hover:bg-gray-50"
      }`}
    >
      {i + 1}
    </button>
  ))}
</div>
</div>
  );
};

export default SubscriberTable;








// import { Trash2 } from 'lucide-react';
// import React, { useEffect, useRef, useState } from 'react';
// import { useGetPaymentsQuery } from '../../redux/features/admin/subsciptionApi';

// interface Subscriber {
//   id:number;
//   name: string;
//   email: string;
//   plan: 'Core' | 'Plus' | 'Complete';
//   status: 'Active' | 'Cancelled';
//   joinDate: string;
//   revenue: string;
// }

// const subscribers: Subscriber[] = [
//   {id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', plan: 'Core', status: 'Active', joinDate: 'Jan 15, 2024', revenue: '$0/mo' },
//   {id:2, name: 'Emma Wilson', email: 'emma@example.com', plan: 'Plus', status: 'Active', joinDate: 'Jan 20, 2024', revenue: '$99/mo' },
//   {id:3, name: 'Lisa Anderson', email: 'lisa@example.com', plan: 'Complete', status: 'Active', joinDate: 'Feb 1, 2024', revenue: '$199/mo' },
//   {id:4, name: 'Maria Garcia', email: 'maria@example.com', plan: 'Plus', status: 'Active', joinDate: 'Feb 5, 2024', revenue: '$99/mo' },
//   {id:5, name: 'Jennifer Lee', email: 'jennifer@example.com', plan: 'Core', status: 'Active', joinDate: 'Feb 10, 2024', revenue: '$0/mo' },
//   {id:6, name: 'Amanda Brown', email: 'amanda@example.com', plan: 'Complete', status: 'Cancelled', joinDate: 'Jan 10, 2024', revenue: '$199/mo' },
// ];

// const SubscriberTable: React.FC = () => {

// const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
// const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
// const [deletedIds, setDeletedIds] = useState<number[]>([]);
// const [isFilterOpen, setIsFilterOpen] = useState(false);
// const [startDate, setStartDate] = useState<string>("");
// const [endDate, setEndDate] = useState<string>("");
// const [, setFilteredSubscribers] = useState<Subscriber[]>(subscribers);

// const { data, isLoading, error } = useGetPaymentsQuery({ page: 1, limit: 10 });

// console.log("DATA 👉", data);
// console.log("ERROR 👉", error);

// const payments = data?.payments || [];

// console.log(payments)

//   const handleDeleteClick = (
//   e: React.MouseEvent<HTMLButtonElement>,
//   id: number
// ) => {
//   e.stopPropagation(); 
//   setSelectedUserId(id);
//   setIsModalOpen(true);
// };

// const confirmDelete = () => {
//   if (selectedUserId !== null) {
//     setDeletedIds((prev) => [...prev, selectedUserId]);
//   }
//   setIsModalOpen(false);
//   setSelectedUserId(null);
// };


// const filteredSubscribers = payments
//   .filter((pay: any) => !deletedIds.includes(pay.id))
//   .filter((pay: any) => {
//     if (!startDate && !endDate) return true;

//     const subDate = new Date(pay.paymentDate);

//     const start = startDate ? new Date(startDate) : null;
//     const end = endDate ? new Date(endDate) : null;

//     if (start && subDate < start) return false;
//     if (end && subDate > end) return false;

//     return true;
//   });

//   const dropdownRef = useRef<HTMLDivElement | null>(null);
//   useEffect(() => {
//   const handleClickOutside = (event: MouseEvent) => {
//     if (
//       dropdownRef.current &&
//       !dropdownRef.current.contains(event.target as Node)
//     ) {
//       setIsFilterOpen(false);
//     }
//   };

//   if (isFilterOpen) {
//     document.addEventListener("mousedown", handleClickOutside);
//   }

//   return () => {
//     document.removeEventListener("mousedown", handleClickOutside);
//   };
// }, [isFilterOpen]);

//   return (
//     <div className="bg-white rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden">
//       {/* Header Section */}
//       <div className="p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-titleColor text-base font-extrabold leading-6">All Subscribers</h2>
//           <p className="text-subTitleColor text-xs font-medium leading-5 mt-0.5">Showing 6 of 2,044 total subscribers</p>
//         </div>
//         <div ref={dropdownRef} className="flex gap-3 relative">
//           <button   onClick={() => setIsFilterOpen((prev) => !prev)}  className="flex items-center justify-center gap-2 px-4 py-2 w-[200px] border border-borderColor rounded-[12px] text-sm font-bold text-stone-600 hover:bg-stone-50 transition-colors">
//             <span className="text-lg"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
//   <path d="M1.8584 3.71533H13.0047" stroke="#4A3A37" stroke-width="1.39329" stroke-linecap="round"/>
//   <path d="M3.71582 7.43115H11.1467" stroke="#4A3A37" stroke-width="1.39329" stroke-linecap="round"/>
//   <path d="M5.57324 11.1465H9.28868" stroke="#4A3A37" stroke-width="1.39329" stroke-linecap="round"/>
// </svg></span> Filter
//           </button>

//                               {isFilterOpen && (
// <div className="absolute top-full right-0 mt-2 bg-white shadow-xl rounded-2xl p-5 w-[200px] border border-borderColor z-50">
//     <div className="flex flex-col gap-4">
      
//       <div>
//         <label className="text-xs font-bold text-gray-500">Start Date</label>
//         <input
//           type="date"
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//           className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
//         />
//       </div>

//       <div>
//         <label className="text-xs font-bold text-gray-500">End Date</label>
//         <input
//           type="date"
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//           className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
//         />
//       </div>
//          <button 
//            onClick={() => {
//     const filtered = subscribers.filter((sub) => {
//       const subDate = new Date(sub.joinDate);
//       const start = startDate ? new Date(startDate) : null;
//       const end = endDate ? new Date(endDate) : null;

//       if (start && subDate < start) return false;
//       if (end && subDate > end) return false;
//       return true;
//     });

//     setFilteredSubscribers(filtered);
//     setIsFilterOpen(false); // dropdown close hobe
//   }}
//          className='bg-buttonColor text-sm py-2 px-3 text-white rounded-2xl cursor-pointer'>
//         Apply
//       </button>

//       <button
//         onClick={() => {
//           setStartDate("");
//           setEndDate("");
//         }}
//         className="text-sm text-red-500 border border-borderColor rounded-2xl py-2 px-3 font-bold cursor-pointer "
//       >
//         Cancel
//       </button>
    
//     </div>
//   </div>
// )}
     
       
//         </div>
//       </div>

//       {/* Responsive Scroll Container */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-left border-collapse min-w-[800px]">
//           <thead>
//             <tr className="bg-[#FCFAF8] border-y border-stone-100">
//               <th className="text-left px-6 py-4 text-[10px] font-extrabold leading-4 tracking-[1px] text-[#4A3A3799] uppercase">User</th>
//               <th className="text-left px-6 py-4 text-[10px] font-extrabold leading-4 tracking-[1px] text-[#4A3A3799] uppercase">Plan</th>
//               <th className="text-left px-6 py-4 text-[10px] font-extrabold leading-4 tracking-[1px] text-[#4A3A3799] uppercase">Status</th>
//               <th className="text-left px-6 py-4 text-[10px] font-extrabold leading-4 tracking-[1px] text-[#4A3A3799] uppercase">Join Date</th>
//               <th className="text-left px-6 py-4 text-[10px] font-extrabold leading-4 tracking-[1px] text-[#4A3A3799] uppercase">Revenue</th>
//               <th className="text-right px-6 py-4 text-[10px] font-extrabold leading-4 tracking-[1px] text-[#4A3A3799] uppercase text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-stone-100">
//             {filteredSubscribers.map((pay: any, idx:any) => (
//               <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
//                 <td className="px-8 py-5">
//                   <div className="font-black text-titleColor text-sm leading-4.5">{pay.name}</div>
//                   <div className="text-xs text-[#4A3A3780] font-medium leading-4">{pay.email}</div>
//                 </td>
//                 <td className="px-8 py-5">
//                     <span
//     className={`px-4 py-2 rounded-full text-xs font-bold
//       ${
//         pay.plan === "Complete"
//           ? "bg-buttonColor text-white"
//           : pay.plan === "Plus"
//           ? "bg-[#E8C3B44D] text-buttonColor"
//           : "bg-[#9266901A] text-buttonColor"
//       }
//     `}
//   >
//     {pay.paymentStatus}
//   </span>
//                 </td>
//                 <td className="px-8 py-5">
//                   <span className={`px-4 py-2 rounded-full text-xs font-bold 
//                     ${pay.status === 'Active' ? 'bg-[#00D0841A] text-[#00D084]' : 'bg-[#FF6B6B1A] text-[#FF6B6B]'}`}>
//                     {pay.status}
//                   </span>
//                 </td>
//                 <td className="px-8 py-5 text-sm font-medium text-[#4A3A37B2]">{pay.joinDate}</td>
//                 <td className="px-8 py-5 font-black text-titleColor text-sm">{pay.revenue}</td>
//                 <td className="px-8 py-5 text-right">
//                   <button onClick={(e) => handleDeleteClick(e, pay.id)} className="text-sm font-bold text-red-500 hover:text-[#845E84] cursor-pointer"><Trash2/></button>
//                 </td>
//                                 {isModalOpen && (
//   <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
//     <div className="bg-white w-[90%] sm:w-[400px] rounded-2xl p-6 shadow-xl">
//       <h2 className="text-lg font-bold mb-3">Delete Subscription</h2>

//       <p className="text-sm mb-6">
//         Are you sure you want to delete this Subscription?
//       </p>

//       <div className="flex justify-end gap-3">
//         <button
//           onClick={() => setIsModalOpen(false)}
//           className="px-4 py-2 rounded-xl border"
//         >
//           No
//         </button>

//         <button
//           onClick={confirmDelete}
//           className="px-4 py-2 rounded-xl bg-red-500 text-white"
//         >
//           Yes
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//               </tr>
//             ))}

//      </tbody>
//         </table>


//       </div>
//     </div>
//   );
// };

// export default SubscriberTable;