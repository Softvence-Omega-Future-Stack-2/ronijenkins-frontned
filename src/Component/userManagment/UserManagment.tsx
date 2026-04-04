<<<<<<< HEAD
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import type { User } from "../../types/index";
import { CUSTOMERS_QUERY } from "../../graphql/operations";
import { toast } from "react-toastify";

// Define a UI-specific shape for the table row
=======
import { Trash2, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllUsersQuery } from "../../redux/features/admin/userManagmentApi";


>>>>>>> dff0dbf (overview api integration)

export default function UserManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
<<<<<<< HEAD
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data, loading, error } = useQuery(CUSTOMERS_QUERY, {
    variables: {
      input: {
        pagination: {
          limit: 100,
          page: 1
        },
        searchTerm: search
      }
    }
  });

  console.log(`see data`, data);

  // Handle error with useEffect
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to fetch users");
    }
  }, [error]);

  const users: User[] | unknown = data;

  const getStageDisplay = (pauseType?: string | null) => {
    switch (pauseType) {
      case "PERIMENO": return { text: "PERIMENOPAUSE", bg: "#f3e8ff", color: "#9333ea" };
      case "POSTMENO": return { text: "POSTMENOPAUSE", bg: "#dcfce7", color: "#16a34a" };
      case "PREMENO": return { text: "PREMENOPAUSE", bg: "#fee2e2", color: "#dc2626" };
      default: return { text: "N/A", bg: "#f3f4f6", color: "#4b5563" };
    }
  };


  const handleDeleteClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.stopPropagation(); // Stop row navigation
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
=======
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // ✅ API Call
  const { data: usersData, isLoading, isError } = useGetAllUsersQuery({
    page: currentPage,
    limit: 5,
  });

  console.log("📡 API Raw Response:", usersData);
  if (isError) console.error("❌ API Error Detail:", isError);

  // ✅ আপনার কোডের এই অংশটুকু আপডেট করুন
const users = usersData?.data || []; // 'usersData.users' এর বদলে 'usersData.data' হবে
const meta = usersData?.meta;

// console log দিয়ে নিশ্চিত হয়ে নিন এখন users এ ডাটা আছে কি না
console.log("👥 Displaying Users:", users);

  // Search filter (Client side for current page)
  const filtered = users.filter(
    (u: any) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    // এখানে আপনার deleteUser mutation কল করতে পারেন
    console.log("Deleting User ID:", selectedUserId);
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  if (isLoading) return <div className="p-10 text-center">Loading users...</div>;
  if (isError) return <div className="p-10 text-center text-red-500">Error loading users!</div>;
>>>>>>> dff0dbf (overview api integration)

  return (
    <div className="min-h-screen bg-[#f5f0eb] p-4 sm:p-6 lg:p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row sm:items-center sm:justify-between gap-4 mb-6">
<<<<<<< HEAD
        <div className="w-full text-center">
          <h1 className="text-titleColor text-xl sm:text-2xl md:text-[30px] font-extrabold leading-6 md:leading-[36px]">User Management</h1>
          <p className="text-subTitleColor text-sm font-medium leading-5 mt-0.5">Manage {users?.length} registered members</p>
=======
        <div className="w-full text-center lg:text-left">
          <h1 className="text-titleColor text-xl sm:text-2xl md:text-[30px] font-extrabold">User Management</h1>
          <p className="text-subTitleColor text-sm font-medium mt-0.5">Manage {meta?.total || 0} registered members</p>
>>>>>>> dff0dbf (overview api integration)
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-borderColor rounded-full px-4 py-2.5 shadow-sm w-full sm:w-64">
            <Search size={16} className="text-gray-300" />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-[#2a1f1f] focus:outline-none w-full"
            />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-borderColor overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-4 text-[10px] font-extrabold tracking-[2px] text-subTitleColor uppercase">Full Name</th>
                <th className="text-left px-4 py-4 text-[10px] font-extrabold tracking-[2px] text-subTitleColor uppercase">Role </th>
                <th className="text-left px-4 py-4 text-[10px] font-extrabold tracking-[2px] text-subTitleColor uppercase">Status</th>
                <th className="text-left px-4 py-4 text-[10px] font-extrabold tracking-[2px] text-subTitleColor uppercase">Contact No</th>
                <th className="text-left px-4 py-4 text-[10px] font-extrabold tracking-[2px] text-subTitleColor uppercase">Language</th>
                <th className="text-left px-4 py-4 text-[10px] font-extrabold tracking-[2px] text-subTitleColor uppercase">Joined Date</th>
                {/* <th className="text-right px-6 py-4 text-[10px] font-extrabold tracking-[2px] text-subTitleColor uppercase">Actions</th> */}
              </tr>
            </thead>
            <tbody>
<<<<<<< HEAD
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-300 font-medium">
                    <div className="flex items-center justify-center gap-2">
                       <svg className="animate-spin h-5 w-5 text-[#845E84]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       <span>Loading registered members...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-red-500">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <span className="text-sm font-medium">{error.message || "Something went wrong"}</span>
                      <button onClick={() => window.location.reload()} className="text-xs underline mt-2 hover:text-red-700">Try again</button>
                    </div>
                  </td>
                </tr>
              ) : users?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-300">
                    No users found.
                  </td>
                </tr>
              ) : (
                users?.map((user: User, idx: number) => {
                  const stageMode = getStageDisplay(user.customer?.pauseType);
                  const fullName = user.customer?.fullName || user.username || "Unknown";
                  const avatarUrl = user.avatar || `https://i.pravatar.cc/40?u=${user.id}`;
                  const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit'
                  }) : "N/A";

                  return (
                    <tr
                      key={user.id}
                      onClick={() => navigate(`/dashboard/users-managment/${user.id}`)}
                      className={`border-b border-borderColor hover:bg-[#fdf9f7] transition-colors cursor-pointer ${
                        idx === users?.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      {/* Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={avatarUrl}
                            alt={fullName}
                            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                              e.currentTarget.style.display = "none";
                              const sibling = e.currentTarget.nextElementSibling as HTMLElement | null;
                              if (sibling) sibling.style.display = "flex";
                            }}
                          />
                          <div className="w-9 h-9 rounded-full bg-[#e9d5f5] items-center justify-center text-[#7c4d8a] text-sm font-bold flex-shrink-0 hidden">
                            {fullName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-extrabold text-titleColor leading-5 whitespace-nowrap">{fullName}</p>
                            <p className="text-xs text-subTitleColor leading-4">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Stage */}
                      <td className="px-4 py-4">
                        <span
                          className="text-[10px] font-extrabold tracking-wider px-3 py-1.5 rounded-full whitespace-nowrap"
                          style={{ backgroundColor: stageMode.bg, color: stageMode.color }}
                        >
                          {user?.customer?.pauseType}
                        </span>
                      </td>

                      {/* city */}
                      <td className="px-4 py-4">
                        <span className="text-sm text-subTitleColor font-bold leading-4 whitespace-nowrap">{user.customer?.city || "N/A"}</span>
                      </td>
                      {/* State */}
                      <td className="px-4 py-4">
                        <span className="text-sm text-subTitleColor font-bold leading-4 whitespace-nowrap">{user.customer?.state || "N/A"}</span>
                      </td>
                      {/* country*/}
                      <td className="px-4 py-4">
                        <span className="text-sm text-subTitleColor font-bold leading-4 whitespace-nowrap">{user.customer?.country || "N/A"}</span>
                      </td>

                      {/* Topics */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {user.customer?.topics?.slice(0, 3).map((t: string) => (
                            <span
                              key={t}
                              className="text-[10px] text-subTitleColor font-medium leading-4 bg-[#4A3A370D]  px-3 py-1 rounded-full whitespace-nowrap"
                            >
                              {t}
                            </span>
                          ))}
                          {user?.customer?.topics && user.customer.topics.length > 3 && (
                            <span className="text-[10px] text-[#4A3A3733] font-medium">+{user.customer.topics.length - 3} more</span>
                          )}
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-4">
                        <span className="text-xs text-[#4A3A3766] font-medium leading-4  whitespace-nowrap">{joinedDate}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => handleDeleteClick(e, user.id)}
                          className="w-8 h-8   flex items-center justify-center ml-auto text-red-500 cursor-pointer rounded-xl hover:bg-red-50 transition-colors"
                          title="Delete user"
                        >
                        <Trash2/>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
=======
              {filtered.map((user: any) => (
                <tr
                  key={user.id}
                  onClick={() => navigate(`/dashboard/users-managment/${user.id}`)}
                  className="border-b border-borderColor hover:bg-[#fdf9f7] transition-colors cursor-pointer"
                >
                  {/* Name & Avatar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#e9d5f5] flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[#7c4d8a] text-sm font-bold">{user.email[0].toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-titleColor leading-5">{user.username || "Anonymous"}</p>
                        <p className="text-xs text-subTitleColor leading-4">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role & Status */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">{user.role}</span>
                     
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                       <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full w-fit ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {user.status}
                      </span>
                     
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-sm text-subTitleColor font-bold">{user.contactNo || "N/A"}</span>
                  </td>

                  <td className="px-4 py-4 text-sm font-bold text-subTitleColor">
                    {user.lang}
                  </td>

                  <td className="px-4 py-4 text-xs text-[#4A3A3766] font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  {/* <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => handleDeleteClick(e, user.id)}
                      className="w-8 h-8 flex items-center justify-center ml-auto text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td> */}
                </tr>
              ))}
>>>>>>> dff0dbf (overview api integration)
            </tbody>
          </table>
        </div>
      </div>

<<<<<<< HEAD
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] sm:w-[400px] rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold mb-3">Delete User</h2>
            <p className="text-sm mb-6">Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border">No</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-xl bg-red-500 text-white">Yes</button>
=======
      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: meta?.totalPage || 1 }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              currentPage === i + 1 ? "bg-buttonColor text-white border border-buttonColor" : "border border-borderColor bg-white text-subTitleColor hover:bg-gray-50"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Delete Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[90%] sm:w-[400px] rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold mb-3 text-titleColor">Delete User</h2>
            <p className="text-sm text-subTitleColor mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border font-bold text-sm">Cancel</button>
              <button onClick={confirmDelete} className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm">Delete</button>
>>>>>>> dff0dbf (overview api integration)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}









// import { Trash2 } from "lucide-react";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";



// interface User {
//   id: number;
//   name: string;
//   email: string;
//   avatar: string;
//   stage: string;
//   stageColor: string;
//   stageText: string;
//   city:string;
//   state: string;
//   country:string;
//   topics: string[];
//   extra: number;
//   joined: string;
// }


// const users: User[] = [
//   {
//     id: 1,
//     name: "Maren Dias",
//     email: "maren@fardis.com",
//     avatar: "https://i.pravatar.cc/40?img=47",
//     stage: "PERIMENOPAUSE",
//     stageColor: "#f3e8ff",
//     stageText: "#9333ea",
//     city: "Austin",
//     state: "Texas",
//     country: "USA",
//     topics: ["Hormones & HRT"],
//     extra: 1,
//     joined: "Jan 12, 2026",
//   },
//   {
//     id: 2,
//     name: "Elena Gilbert",
//     email: "elena@emails.com",
//     avatar: "https://i.pravatar.cc/40?img=48",
//     stage: "POST-MENOPAUSE",
//     stageColor: "#fce7f3",
//     stageText: "#db2777",
//     city: "Chicago",
//     state: "Illinois",
//     country: "USA",
//     topics: ["Mental Wellbeing"],
//     extra: 0,
//     joined: "Feb 05, 2026",
//   },
//   {
//     id: 3,
//     name: "Sarah Connor",
//     email: "sarah@future.net",
//     avatar: "https://i.pravatar.cc/40?img=49",
//     stage: "PERIMENOPAUSE",
//     stageColor: "#f3e8ff",
//     stageText: "#9333ea",
//     city: "Los Angeles",
//     state: "California",
//     country: "USA",
//     topics: ["Strength & Mobility"],
//     extra: 2,
//     joined: "Dec 28, 2025",
//   },
//   {
//     id: 4,
//     name: "Jasmine Lee",
//     email: "j.lee@health.es",
//     avatar: "https://i.pravatar.cc/40?img=50",
//     stage: "PERIMENOPAUSE",
//     stageColor: "#f3e8ff",
//     stageText: "#9333ea",
//     city: "Seoul",
//     state: "Seoul",
//     country: "South Korea",
//     topics: ["Nutrition & Weight"],
//     extra: 0,
//     joined: "Nov 15, 2025",
//   },
//   {
//     id: 5,
//     name: "Maria Garcia",
//     email: "maria@hola.com",
//     avatar: "https://i.pravatar.cc/40?img=51",
//     stage: "MENOPAUSE",
//     stageColor: "#fef3c7",
//     stageText: "#d97706",
//     city: "Madrid",
//     state: "Madrid",
//     country: "Spain",
//     topics: ["Mental Wellbeing"],
//     extra: 1,
//     joined: "Jan 20, 2026",
//   },
//   {
//     id: 6,
//     name: "Rachel Zane",
//     email: "rachel@pearson.com",
//     avatar: "https://i.pravatar.cc/40?img=52",
//     stage: "POST-MENOPAUSE",
//     stageColor: "#fce7f3",
//     stageText: "#db2777",
//     city: "New York",
//     state: "New York",
//     country: "USA",
//     topics: ["Hormones & HRT"],
//     extra: 0,
//     joined: "Feb 10, 2026",
//   },
// ];

// export default function UserManagement() {
//   const [search, setSearch] = useState<string>("");
//   const [deletedIds, setDeletedIds] = useState<number[]>([]);
//   const navigate = useNavigate()

// const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
// const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

//   const filtered = users.filter(
//     (u) =>
//       !deletedIds.includes(u.id) &&
//       (u.name.toLowerCase().includes(search.toLowerCase()) ||
//         u.email.toLowerCase().includes(search.toLowerCase()))
//   );

// const handleDeleteClick = (
//   e: React.MouseEvent<HTMLButtonElement>,
//   id: number
// ) => {
//   e.stopPropagation(); // row navigation বন্ধ করবে
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

//   return (
//     <div className="min-h-screen bg-[#f5f0eb] p-4 sm:p-6 lg:p-8 font-sans">
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//         <div className="w-full text-center">
//           <h1 className="text-titleColor text-xl sm:text-2xl md:text-[30px] font-extrabold leading-6 md:leading-[36px]">User Management</h1>
//           <p className="text-subTitleColor text-sm font-medium leading-5 mt-0.5">Manage {filtered.length} registered members</p>
//         </div>
//         <div className="flex items-center gap-2">
//           {/* Search */}
//           <div className="flex items-center gap-2 bg-white border border-borderColor rounded-full px-4 py-2.5 shadow-sm w-full sm:w-64">
//             <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-300 flex-shrink-0">
//               <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
//               <path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
//             </svg>
//             <input
//               type="text"
//               placeholder="Search by name, email..."
//               value={search}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
//               className="bg-transparent text-sm text-[#2a1f1f] placeholder-gray-300 focus:outline-none w-full"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Table Card */}
//       <div className="bg-white  rounded-3xl shadow-sm border border-borderColor overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[700px]">
//             <thead>
//               <tr className="border-b border-gray-100">
//                 <th className="text-left px-6 py-4 text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">Full Name</th>
//                 <th className="text-left px-4 py-4 text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">Menopause Stage</th>
//                 <th className="text-left px-4 py-4 text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">City</th>
//                 <th className="text-left px-4 py-4 text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">State</th>
//                 <th className="text-left px-4 py-4 text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">Country</th>
//                 <th className="text-left px-4 py-4 text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">Topics of Interest</th>
//                 <th className="text-left px-4 py-4 text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">Joined</th>
//                 <th className="text-right px-6 py-4 text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((user: User, idx: number) => (
//                 <tr
//                   key={user.id}
//                   onClick={() => navigate(`/dashboard/users-managment/${user.id}`)}
//                   className={`border-b border-borderColor hover:bg-[#fdf9f7] transition-colors cursor-pointer ${
//                     idx === filtered.length - 1 ? "border-b-0" : ""
//                   }`}
//                 >
//                   {/* Name */}
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <img
//                         src={user.avatar}
//                         alt={user.name}
//                         className="w-9 h-9 rounded-full object-cover flex-shrink-0"
//                         onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
//                           e.currentTarget.style.display = "none";
//                           const sibling = e.currentTarget.nextElementSibling as HTMLElement | null;
//                           if (sibling) sibling.style.display = "flex";
//                         }}
//                       />
//                       <div className="w-9 h-9 rounded-full bg-[#e9d5f5] items-center justify-center text-[#7c4d8a] text-sm font-bold flex-shrink-0 hidden">
//                         {user.name[0]}
//                       </div>
//                       <div>
//                         <p className="text-sm font-extrabold text-titleColor leading-5 whitespace-nowrap">{user.name}</p>
//                         <p className="text-xs text-subTitleColor leading-4">{user.email}</p>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Stage */}
//                   <td className="px-4 py-4">
//                     <span
//                       className="text-[10px] font-extrabold tracking-wider px-3 py-1.5 rounded-full whitespace-nowrap"
//                       style={{ backgroundColor: user.stageColor, color: user.stageText }}
//                     >
//                       {user.stage}
//                     </span>
//                   </td>

//                   {/* city */}
//                   <td className="px-4 py-4">
//                     <span className="text-sm text-subTitleColor font-bold leading-4 whitespace-nowrap">{user.city}</span>
//                   </td>
//                   {/* State */}
//                   <td className="px-4 py-4">
//                     <span className="text-sm text-subTitleColor font-bold leading-4 whitespace-nowrap">{user.state}</span>
//                   </td>
//                   {/* country*/}
//                   <td className="px-4 py-4">
//                     <span className="text-sm text-subTitleColor font-bold leading-4 whitespace-nowrap">{user.country}</span>
//                   </td>

//                   {/* Topics */}
//                   <td className="px-4 py-4">
//                     <div className="flex items-center gap-1.5 flex-wrap">
//                       {user.topics.map((t: string) => (
//                         <span
//                           key={t}
//                           className="text-[10px] text-subTitleColor font-medium leading-4 bg-[#4A3A370D]  px-3 py-1 rounded-full font-medium whitespace-nowrap"
//                         >
//                           {t}
//                         </span>
//                       ))}
//                       {user.extra > 0 && (
//                         <span className="text-[10px] text-[#4A3A3733] font-medium">+{user.extra} more</span>
//                       )}
//                     </div>
//                   </td>

//                   {/* Joined */}
//                   <td className="px-4 py-4">
//                     <span className="text-xs text-[#4A3A3766] font-medium leading-4  whitespace-nowrap">{user.joined}</span>
//                   </td>

//                   {/* Actions */}
//                   <td className="px-6 py-4 text-right">
//                     <button
//                       onClick={(e) => handleDeleteClick(e, user.id)}
//                       className="w-8 h-8   flex items-center justify-center ml-auto text-red-500 cursor-pointer rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
//                       title="Delete user"
//                     >
//                     <Trash2/>
//                     </button>
//                   </td>
//                   {isModalOpen && (
//   <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
//     <div className="bg-white w-[90%] sm:w-[400px] rounded-2xl p-6 shadow-xl">
//       <h2 className="text-lg font-bold mb-3">Delete User</h2>

//       <p className="text-sm mb-6">
//         Are you sure you want to delete this user?
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
//                 </tr>
//               ))}

//               {filtered.length === 0 && (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-300">
//                     No users found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }