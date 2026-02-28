import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  stage: string;
  stageColor: string;
  stageText: string;
  state: string;
  topics: string[];
  extra: number;
  joined: string;
}


const users: User[] = [
  {
    id: 1,
    name: "Maren Dias",
    email: "maren@fardis.com",
    avatar: "https://i.pravatar.cc/40?img=47",
    stage: "PERIMENOPAUSE",
    stageColor: "#f3e8ff",
    stageText: "#9333ea",
    state: "Europe",
    topics: ["Hormones & HRT"],
    extra: 1,
    joined: "Jan 12, 2026",
  },
  {
    id: 2,
    name: "Elena Gilbert",
    email: "elena@emails.com",
    avatar: "https://i.pravatar.cc/40?img=48",
    stage: "POST-MENOPAUSE",
    stageColor: "#fce7f3",
    stageText: "#db2777",
    state: "North America",
    topics: ["Mental Wellbeing"],
    extra: 0,
    joined: "Feb 05, 2026",
  },
  {
    id: 3,
    name: "Sarah Connor",
    email: "sarah@future.net",
    avatar: "https://i.pravatar.cc/40?img=49",
    stage: "PERIMENOPAUSE",
    stageColor: "#f3e8ff",
    stageText: "#9333ea",
    state: "North America",
    topics: ["Strength & Mobility"],
    extra: 2,
    joined: "Dec 28, 2025",
  },
  {
    id: 4,
    name: "Jasmine Lee",
    email: "j.lee@health.es",
    avatar: "https://i.pravatar.cc/40?img=50",
    stage: "PERIMENOPAUSE",
    stageColor: "#f3e8ff",
    stageText: "#9333ea",
    state: "Asia",
    topics: ["Nutrition & Weight"],
    extra: 0,
    joined: "Nov 15, 2025",
  },
  {
    id: 5,
    name: "Maria Garcia",
    email: "maria@hola.com",
    avatar: "https://i.pravatar.cc/40?img=51",
    stage: "MENOPAUSE",
    stageColor: "#fef3c7",
    stageText: "#d97706",
    state: "South America",
    topics: ["Mental Wellbeing"],
    extra: 1,
    joined: "Jan 20, 2026",
  },
  {
    id: 6,
    name: "Rachel Zane",
    email: "rachel@pearson.com",
    avatar: "https://i.pravatar.cc/40?img=52",
    stage: "POST-MENOPAUSE",
    stageColor: "#fce7f3",
    stageText: "#db2777",
    state: "North America",
    topics: ["Hormones & HRT"],
    extra: 0,
    joined: "Feb 10, 2026",
  },
];

export default function UserManagement() {
  const [search, setSearch] = useState<string>("");
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const navigate = useNavigate()

  const filtered = users.filter(
    (u) =>
      !deletedIds.includes(u.id) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = (id: number) => {
    setDeletedIds((prev: number[]) => [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb] p-4 sm:p-6 lg:p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-titleColor text-xl sm:text-2xl md:text-[30px] font-extrabold leading-6 md:leading-[36px]">User Management</h1>
          <p className="text-subTitleColor text-sm font-medium leading-5 mt-0.5">Manage {filtered.length} registered members</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-borderColor rounded-full px-4 py-2.5 shadow-sm w-full sm:w-64">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-300 flex-shrink-0">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-[#2a1f1f] placeholder-gray-300 focus:outline-none w-full"
            />
          </div>

          {/* Filter */}
          <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-sm hover:bg-gray-50 transition-colors flex-shrink-0 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <g clip-path="url(#clip0_211_8928)">
    <path d="M8.33206 16.6634C8.33198 16.8182 8.37505 16.97 8.45644 17.1017C8.53782 17.2335 8.6543 17.3399 8.7928 17.4091L10.4591 18.2423C10.5862 18.3058 10.7274 18.3357 10.8693 18.3293C11.0112 18.3229 11.149 18.2803 11.2698 18.2055C11.3906 18.1308 11.4903 18.0265 11.5594 17.9024C11.6286 17.7783 11.6648 17.6386 11.6647 17.4966V11.6644C11.6649 11.2515 11.8184 10.8533 12.0955 10.5471L18.1135 3.89091C18.2213 3.7714 18.2923 3.62319 18.3177 3.46423C18.3431 3.30526 18.3219 3.14233 18.2567 2.99514C18.1915 2.84796 18.085 2.72282 17.9502 2.63486C17.8153 2.5469 17.6579 2.49989 17.4969 2.49951H2.49986C2.33873 2.49957 2.18108 2.54635 2.04599 2.63418C1.91091 2.72202 1.80419 2.84713 1.73876 2.99438C1.67334 3.14163 1.65202 3.30469 1.67738 3.46382C1.70274 3.62294 1.77369 3.77129 1.88165 3.89091L7.90131 10.5471C8.17837 10.8533 8.33187 11.2515 8.33206 11.6644V16.6634Z" stroke="#4A3A37" stroke-width="1.66634" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_211_8928">
      <rect width="19.9961" height="19.9961" fill="white"/>
    </clipPath>
  </defs>
</svg>
          </button>

   
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white  rounded-3xl shadow-sm border border-borderColor overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">Full Name</th>
                <th className="text-left px-4 py-4 text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">Menopause Stage</th>
                <th className="text-left px-4 py-4 text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">State</th>
                <th className="text-left px-4 py-4 text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">Topics of Interest</th>
                <th className="text-left px-4 py-4 text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">Joined</th>
                <th className="text-right px-6 py-4 text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user: User, idx: number) => (
                <tr
                  key={user.id}
                  onClick={() => navigate(`/dashboard/users-managment/${user.id}`)}
                  className={`border-b border-borderColor hover:bg-[#fdf9f7] transition-colors cursor-pointer ${
                    idx === filtered.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.style.display = "none";
                          const sibling = e.currentTarget.nextElementSibling as HTMLElement | null;
                          if (sibling) sibling.style.display = "flex";
                        }}
                      />
                      <div className="w-9 h-9 rounded-full bg-[#e9d5f5] items-center justify-center text-[#7c4d8a] text-sm font-bold flex-shrink-0 hidden">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-titleColor leading-5 whitespace-nowrap">{user.name}</p>
                        <p className="text-xs text-subTitleColor leading-4">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Stage */}
                  <td className="px-4 py-4">
                    <span
                      className="text-[10px] font-extrabold tracking-wider px-3 py-1.5 rounded-full whitespace-nowrap"
                      style={{ backgroundColor: user.stageColor, color: user.stageText }}
                    >
                      {user.stage}
                    </span>
                  </td>

                  {/* State */}
                  <td className="px-4 py-4">
                    <span className="text-sm text-subTitleColor font-bold leading-4 whitespace-nowrap">{user.state}</span>
                  </td>

                  {/* Topics */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {user.topics.map((t: string) => (
                        <span
                          key={t}
                          className="text-[10px] text-subTitleColor font-medium leading-4 bg-[#4A3A370D]  px-3 py-1 rounded-full font-medium whitespace-nowrap"
                        >
                          {t}
                        </span>
                      ))}
                      {user.extra > 0 && (
                        <span className="text-[10px] text-[#4A3A3733] font-medium">+{user.extra} more</span>
                      )}
                    </div>
                  </td>

                  {/* Joined */}
                  <td className="px-4 py-4">
                    <span className="text-xs text-[#4A3A3766] font-medium leading-4  whitespace-nowrap">{user.joined}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="w-8 h-8 flex items-center justify-center ml-auto text-red-500 cursor-pointer rounded-xl hover:bg-red-50 transition-colors"
                      title="Delete user"
                    >
                    <Trash2/>
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-300">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}