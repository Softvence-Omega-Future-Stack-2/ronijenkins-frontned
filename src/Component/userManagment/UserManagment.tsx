/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { useActivateUserMutation, useDeactivateUserMutation, useDeleteUserMutation, useGetUsersQuery } from '../../redux/features/admin/userManagmentApi';
import { toast } from 'react-toastify';


const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All User' | 'free' | 'premium'>('All User');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionOpen, setActionOpen] = useState<string | null>(null);
  const PAGE_SIZE = 10;

  const { data, isLoading, error } = useGetUsersQuery({
    page: currentPage,
    page_size: PAGE_SIZE,
    search: searchQuery,
    plan: filterType === 'All User' ? '' : filterType,
  });

  const [activateUser] = useActivateUserMutation();
  const [deactivateUser] = useDeactivateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const totalCount = data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const users = data?.results ?? [];

const [deleteModalUser, setDeleteModalUser] = useState<{id: string, name: string} | null>(null);

// 2. Handler function
const handleDeleteUser = async () => {
  if (!deleteModalUser) return;
  try {
    await deleteUser(deleteModalUser.id).unwrap();
    toast.success('User deleted successfully!', { position: "top-right" });
    setDeleteModalUser(null);
    setActionOpen(null);
  } catch (error) {
    toast.error('Failed to delete user', { position: "top-right" });
    console.log(error);
  }
};

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    clearTimeout((handleSearchChange as any)._t);
    (handleSearchChange as any)._t = setTimeout(() => {
      setSearchQuery(val);
      setCurrentPage(1);
    }, 500);
  }, []);

  const handleFilterChange = (f: 'All User' | 'free' | 'premium') => {
    setFilterType(f);
    setCurrentPage(1);
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else if (currentPage <= 3) pages.push(1, 2, 3, '...', totalPages);
    else if (currentPage >= totalPages - 2) pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
    else pages.push(1, '...', currentPage, '...', totalPages);
    return pages;
  };

  const getPlanInfo = (user: any) => {
    const name = user.subscription?.name ?? '';
    const isPremium = name.toLowerCase().includes('pro') || name.toLowerCase().includes('premium');
    return isPremium ? 'Premium' : 'Free';
  };

  const getExpiryDate = (user: any) => {
    if (!user.subscription?.expire_date) return null;
    return new Date(user.subscription.expire_date).toLocaleDateString('en-US', {
      month: '2-digit', day: '2-digit', year: 'numeric'
    });
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      if (isActive) {
        await deactivateUser(id).unwrap();
        toast.success('User suspended successfully!', { position: "top-right" });
      } else {
        await activateUser(id).unwrap();
        toast.success('User activated successfully!', { position: "top-right" });
      }
      setActionOpen(null);
    } catch (error) {
      toast.error('Failed to update user status', { position: "top-right" });
      console.log(error);
    }
  };

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActionOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    // ✅ FIX 1: min-h-screen + w-full — parent যেন full width নেয়
    <div className="min-h-screen w-full">

      {/* ✅ FIX 2: bg-white card — mx-auto দিয়ে center, w-full + max-w দিয়ে responsive */}
      <div className="bg-white rounded-2xl border border-gray-200 w-full">
        <div className="p-4 md:p-6">

          <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-6">
            User Management
          </h1>

          {/* ✅ FIX 3: Search & Filter — flex-wrap, min-w-0 input, flex-shrink-0 buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">

            {/* Search input — flex-1 + min-w-0 দিলে কখনো overflow করবে না */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search user..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none text-sm"
              />
            </div>

            {/* Filter buttons — flex-shrink-0 দিলে কাটবে না, flex-wrap দিলে নিচে নামবে */}
            <div className="flex gap-2 flex-wrap flex-shrink-0">
              {(['All User', 'free', 'premium'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilterChange(f)}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all cursor-pointer whitespace-nowrap capitalize ${
                    filterType === f
                      ? 'bg-violet-500 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f === 'All User' ? 'All User' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* ✅ FIX 4: Table wrapper — overflow-x-auto দিয়ে scroll, content কাটবে না */}
          <div className="w-full overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full border-collapse" style={{ minWidth: '700px' }}>
              <thead>
                <tr className="bg-[#EEF2FF]">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Profile</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Name</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Subscription</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Usage</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 7 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-4 px-4"><div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" /></td>
                      <td className="py-4 px-4">
                        <div className="h-4 w-28 bg-gray-100 rounded animate-pulse mb-2" />
                        <div className="h-3 w-36 bg-gray-100 rounded animate-pulse" />
                      </td>
                      <td className="py-4 px-4"><div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" /></td>
                      <td className="py-4 px-4">
                        <div className="h-3 w-24 bg-gray-100 rounded animate-pulse mb-2" />
                        <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                      </td>
                      <td className="py-4 px-4"><div className="h-7 w-16 bg-gray-100 rounded-full animate-pulse" /></td>
                      <td className="py-4 px-4"><div className="h-8 w-8 bg-gray-100 rounded animate-pulse" /></td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-red-500 text-sm">Failed to load users.</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400 text-sm">No users found.</td>
                  </tr>
                ) : (
                  users.map((user: any) => {
                    const plan = getPlanInfo(user);
                    const expiry = getExpiryDate(user);
                    const isPremium = plan === 'Premium';

                    return (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">

                        {/* Profile */}
                        <td className="py-4 px-4">
                          {user.image ? (
                            <img src={user.image} alt={user.full_name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-violet-600 font-semibold text-sm">
                                {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Name */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{user.full_name || '—'}</span>
                            <span className="text-xs text-gray-500 whitespace-nowrap">{user.email}</span>
                          </div>
                        </td>

                        {/* Subscription */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full w-fit whitespace-nowrap ${
                              isPremium ? 'text-[#CA3500] bg-[#FFEDD4]' : 'text-blue-500 bg-blue-50'
                            }`}>
                              {isPremium ? (
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M7.70796 2.17745C7.73673 2.12518 7.77901 2.0816 7.83037 2.05125C7.88173 2.02089 7.9403 2.00488 7.99996 2.00488C8.05962 2.00488 8.11818 2.02089 8.16955 2.05125C8.22091 2.0816 8.26318 2.12518 8.29196 2.17745L10.26 5.91345C10.3069 5.99995 10.3724 6.075 10.4518 6.13319C10.5311 6.19138 10.6224 6.23128 10.719 6.25002C10.8156 6.26876 10.9152 6.26587 11.0106 6.24156C11.106 6.21726 11.1948 6.17214 11.2706 6.10945L14.122 3.66678C14.1767 3.62226 14.2441 3.59626 14.3146 3.59251C14.3851 3.58877 14.4549 3.60748 14.514 3.64594C14.5732 3.68441 14.6186 3.74065 14.6437 3.80657C14.6689 3.87249 14.6725 3.94469 14.654 4.01278L12.7646 10.8434C12.7261 10.9832 12.643 11.1066 12.528 11.1949C12.413 11.2832 12.2723 11.3316 12.1273 11.3328H3.87329C3.72818 11.3318 3.58736 11.2834 3.47222 11.1951C3.35707 11.1068 3.27389 10.9833 3.23529 10.8434L1.34662 4.01345C1.32812 3.94536 1.3317 3.87316 1.35685 3.80724C1.382 3.74132 1.42741 3.68508 1.48656 3.64661C1.5457 3.60814 1.61553 3.58944 1.68598 3.59318C1.75644 3.59692 1.82389 3.62293 1.87862 3.66745L4.72929 6.11011C4.80516 6.17281 4.89396 6.21793 4.98933 6.24223C5.0847 6.26654 5.18427 6.26942 5.28089 6.25069C5.37751 6.23195 5.46878 6.19205 5.54815 6.13386C5.62752 6.07567 5.69303 6.00062 5.73996 5.91411L7.70796 2.17745Z" stroke="#F54900" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M3.33337 14H12.6667" stroke="#F54900" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              ) : (
                                <svg width="10" height="14" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9.54737 1.54959C9.23095 1.1564 9.07274 0.959801 8.85645 0.854901C8.64017 0.75 8.39303 0.75 7.89876 0.75H6.48963C5.98381 0.75 5.7309 0.75 5.57376 0.912718C5.41663 1.07544 5.41663 1.33733 5.41663 1.86111V4.08333H7.89876C8.39303 4.08333 8.64017 4.08333 8.85645 3.97843C9.07274 3.87353 9.23095 3.67694 9.54738 3.28374L9.67272 3.12798C9.94644 2.78786 10.0833 2.61781 10.0833 2.41667C10.0833 2.21553 9.94644 2.04547 9.67272 1.70535L9.54737 1.54959Z" stroke="#0372E6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M9.54737 7.54959C9.23095 7.1564 9.07274 6.9598 8.85645 6.8549C8.64017 6.75 8.39303 6.75 7.89876 6.75H5.41663V10.0833H7.89876C8.39303 10.0833 8.64017 10.0833 8.85645 9.97843C9.07274 9.87353 9.23095 9.67694 9.54738 9.28374L9.67272 9.12798C9.94644 8.78786 10.0833 8.61781 10.0833 8.41667C10.0833 8.21553 9.94644 8.04547 9.67272 7.70535L9.54737 7.54959Z" stroke="#0372E6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M1.28592 4.88357C1.60234 4.49038 1.76055 4.29379 1.97684 4.18889C2.19313 4.08398 2.44026 4.08398 2.93453 4.08398H5.41667V7.41732H2.93453C2.44026 7.41732 2.19313 7.41732 1.97684 7.31242C1.76055 7.20752 1.60234 7.01092 1.28592 6.61773L1.16057 6.46197C0.886856 6.12185 0.75 5.95179 0.75 5.75065C0.75 5.54951 0.886856 5.37945 1.16057 5.03933L1.28592 4.88357Z" stroke="#0372E6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M5.41663 14.0837L5.41663 1.41699" stroke="#0372E6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M3.41663 14.084H7.41663" stroke="#0372E6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                              {plan}
                            </span>
                            <span className="text-xs text-gray-400">
                              {expiry ? `Expires: ${expiry}` : 'Expires: N/A'}
                            </span>
                          </div>
                        </td>

                        {/* Usage */}
                        <td className="py-4 px-4">
                          <div className="text-xs text-gray-600 space-y-1 whitespace-nowrap">
                            <div>Behaviours: {user.feature_usages?.behaviours_usage ?? 0}</div>
                            <div>Supplements: {user.feature_usages?.supplements_usage ?? 0}</div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                            user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                          }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* Action — ✅ FIX 5: relative position ঠিক করা */}
                        <td className="py-4 px-4">
                          <div className="relative inline-block">
                            <button
                              onClick={() => setActionOpen(actionOpen === user.id ? null : user.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <MoreVertical className="w-5 h-5 text-gray-600" />
                            </button>
                            {actionOpen === user.id && (
                              <div
                                ref={dropdownRef}
                                className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                              >
                                <button
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 rounded-t-lg cursor-pointer"
                                  onClick={() => {
    setDeleteModalUser({ id: user.id, name: user.full_name || user.email });
    setActionOpen(null);
  }}
                                >
                                  Delete
                                </button>
                                <button
                                  className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-gray-50 rounded-b-lg cursor-pointer"
                                  onClick={() => handleToggleStatus(user.id, user.is_active)}
                                >
                                  {user.is_active ? 'Suspend' : 'Activate'}
                                </button>

   
                              </div>
                            )}
                          </div>


                                                       {deleteModalUser && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 animate-fade-in">
      
      {/* Icon */}
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto mb-4">
        <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </div>

      {/* Text */}
      <h2 className="text-lg font-bold text-gray-900 text-center mb-1">Delete User</h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Are you sure you want to permanently delete{' '}
        <span className="font-semibold text-gray-800">{deleteModalUser.name}</span>?
        This action cannot be undone.
      </p>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setDeleteModalUser(null)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          No, Cancel
        </button>
        <button
          onClick={handleDeleteUser}
          className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors cursor-pointer"
        >
          Yes, Delete
        </button>
      </div>

    </div>
  </div>
)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {renderPageNumbers().map((p, i) => (
              <React.Fragment key={i}>
                {p === '...' ? (
                  <span className="px-2 text-gray-400 text-sm">...</span>
                ) : (
                  <button
                    onClick={() => setCurrentPage(p as number)}
                    className={`px-3.5 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                      currentPage === p ? 'bg-violet-500 text-white' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {p}
                  </button>
                )}
              </React.Fragment>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserManagement;




// import React, { useState } from 'react';
// import { Search, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
// import userImg from '../../../public/images/user.png'

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   subscription: 'Premium' | 'Free';
//   expiryDate: string | null;
//   behaviours: number;
//   supplements: number;
//   status: 'Active' | 'Inactive';
//   avatar: string;
// }

// const UserManagement: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState<'All User' | 'Free' | 'Premium'>('All User');
//   const [currentPage, setCurrentPage] = useState(2);
//    const [actionOpen, setActionOpen] = useState<number | null>(null);


//   const users: User[] = [
//     {
//       id: 1,
//       name: 'John Doe',
//       email: 'john.doe@example.com',
//       subscription: 'Premium',
//       expiryDate: '12/31/2025',
//       behaviours: 0,
//       supplements: 0,
//       status: 'Active',
//       avatar: userImg
//     },
//     {
//       id: 2,
//       name: 'John Doe',
//       email: 'john.doe@example.com',
//       subscription: 'Premium',
//       expiryDate: '12/31/2025',
//       behaviours: 0,
//       supplements: 0,
//       status: 'Active',
//       avatar: userImg
//     },
//     {
//       id: 3,
//       name: 'John Doe',
//       email: 'john.doe@example.com',
//       subscription: 'Free',
//       expiryDate: null,
//       behaviours: 0,
//       supplements: 0,
//       status: 'Active',
//       avatar: userImg
//     },
//     {
//       id: 4,
//       name: 'John Doe',
//       email: 'john.doe@example.com',
//       subscription: 'Premium',
//       expiryDate: '12/31/2025',
//       behaviours: 0,
//       supplements: 0,
//       status: 'Active',
//       avatar: userImg
//     },
//     {
//       id: 5,
//       name: 'John Doe',
//       email: 'john.doe@example.com',
//       subscription: 'Premium',
//       expiryDate: '12/31/2025',
//       behaviours: 0,
//       supplements: 0,
//       status: 'Active',
//       avatar: userImg
//     },
//     {
//       id: 6,
//       name: 'John Doe',
//       email: 'john.doe@example.com',
//       subscription: 'Premium',
//       expiryDate: '12/31/2025',
//       behaviours: 0,
//       supplements: 0,
//       status: 'Active',
//       avatar: userImg
//     },
//     {
//       id: 7,
//       name: 'John Doe',
//       email: 'john.doe@example.com',
//       subscription: 'Premium',
//       expiryDate: '12/31/2025',
//       behaviours: 0,
//       supplements: 0,
//       status: 'Active',
//       avatar: userImg
//     }
//   ];

//   const filteredUsers = users.filter(user => {
//     const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterType === 'All User' || user.subscription === filterType;
//     return matchesSearch && matchesFilter;
//   });

//   const [, setUser] = useState<User[]>(users);
//   const handleSuspend = (id: number) => {
//     setUser((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, status: 'Inactive' } : p))
//     );
//     setActionOpen(null);
//   };

//   return (
//     <div className="min-h-screen ">
//       <div className=" bg-white rounded-2xl border border-gray-400 overflow-hidden">
//         {/* Header */}
//         <div className=" p-2.5 md:p-6 ">
//           <h1 className="text-xl md:text-2xl font-bold text-textColor leading-[120%] mb-6">User Management</h1>
          
//           {/* Search and Filters */}
//           <div className="flex flex-col md:flex-row gap-4 mb-6">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="search review"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-[#8B5CF6]  focus:outline-none text-sm"
//               />
//             </div>
            
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setFilterType('All User')}
//                 className={`px-4 py-3 rounded-lg font-medium text-sm font-inter transition-all cursor-pointer ${
//                   filterType === 'All User'
//                     ? 'bg-[#8B5CF6]  text-white shadow-lg'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 All User
//               </button>
//               <button
//                 onClick={() => setFilterType('Free')}
//                 className={`px-4 py-3 rounded-lg font-medium text-sm font-inter transition-all cursor-pointer ${
//                   filterType === 'Free'
//                     ? 'bg-[#8B5CF6]  text-white shadow-lg'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 Free
//               </button>
//               <button
//                 onClick={() => setFilterType('Premium')}
//                 className={`px-4 py-3 rounded-lg font-medium text-sm font-inter transition-all cursor-pointer ${
//                   filterType === 'Premium'
//                     ? 'bg-[#8B5CF6]  text-white shadow-lg'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 Premium
//               </button>
//             </div>
//           </div>

//           {/* Table - Desktop */}
//           <div className=" overflow-x-auto">
//             <table className="w-full border border-gray-50">
//               <thead>
//                 <tr className="border border-[#EEF2FF] bg-[#EEF2FF] rounded-xl">
//                   <th className="text-left py-4 px-4 text-base  font-medium text-black leading-6 font-inter">Profile</th>
//                   <th className="text-left py-4 px-4 text-base  font-medium text-black leading-6 font-inter">Name</th>
//                   <th className="text-left py-4 px-4 text-base  font-medium text-black leading-6 font-inter">Subscription</th>
//                   <th className="text-left py-4 px-4 text-base  font-medium text-black leading-6 font-inter">Usage</th>
//                   <th className="text-left py-4 px-4 text-base  font-medium text-black leading-6 font-inter">Status</th>
//                   <th className="text-left py-4 px-4 text-base  font-medium text-black leading-6 font-inter">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.map((user) => (
//                   <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                     <td className="py-4 px-4">
//                       <img
//                         src={user.avatar}
//                         alt={user.name}
//                         className="w-10 h-10 rounded-full"
//                       />
//                     </td>
//                     <td className="py-4 px-4">
//                       <div className="flex flex-col">
//                         <span className=" text-base font-normal font-inter  text-textColor leading-6 mb-1">{user.name}</span>
//                         <span className="text-sm text-[#4A5565] font-arial leading-5">{user.email}</span>
//                       </div>
//                     </td>
//                     <td className="py-4 px-4">
//                       <div className="flex flex-col">
//                         <span className={`inline-flex w-25 items-center gap-1 text-sm font-normal leading-5.5 ${
//                           user.subscription === 'Premium' ? 'text-[#CA3500] bg-[#FFEDD4] py-1 px-3 rounded-full' : 'text-blue-400 bg-blue-50 py-1 px-3 rounded-full flex items-center justify-center'
//                         }`}>
//                           {user.subscription === 'Premium' ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//   <path d="M7.70796 2.17745C7.73673 2.12518 7.77901 2.0816 7.83037 2.05125C7.88173 2.02089 7.9403 2.00488 7.99996 2.00488C8.05962 2.00488 8.11818 2.02089 8.16955 2.05125C8.22091 2.0816 8.26318 2.12518 8.29196 2.17745L10.26 5.91345C10.3069 5.99995 10.3724 6.075 10.4518 6.13319C10.5311 6.19138 10.6224 6.23128 10.719 6.25002C10.8156 6.26876 10.9152 6.26587 11.0106 6.24156C11.106 6.21726 11.1948 6.17214 11.2706 6.10945L14.122 3.66678C14.1767 3.62226 14.2441 3.59626 14.3146 3.59251C14.3851 3.58877 14.4549 3.60748 14.514 3.64594C14.5732 3.68441 14.6186 3.74065 14.6437 3.80657C14.6689 3.87249 14.6725 3.94469 14.654 4.01278L12.7646 10.8434C12.7261 10.9832 12.643 11.1066 12.528 11.1949C12.413 11.2832 12.2723 11.3316 12.1273 11.3328H3.87329C3.72818 11.3318 3.58736 11.2834 3.47222 11.1951C3.35707 11.1068 3.27389 10.9833 3.23529 10.8434L1.34662 4.01345C1.32812 3.94536 1.3317 3.87316 1.35685 3.80724C1.382 3.74132 1.42741 3.68508 1.48656 3.64661C1.5457 3.60814 1.61553 3.58944 1.68598 3.59318C1.75644 3.59692 1.82389 3.62293 1.87862 3.66745L4.72929 6.11011C4.80516 6.17281 4.89396 6.21793 4.98933 6.24223C5.0847 6.26654 5.18427 6.26942 5.28089 6.25069C5.37751 6.23195 5.46878 6.19205 5.54815 6.13386C5.62752 6.07567 5.69303 6.00062 5.73996 5.91411L7.70796 2.17745Z" stroke="#F54900" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
//   <path d="M3.33337 14H12.6667" stroke="#F54900" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
// </svg> : <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
//   <path d="M9.54737 1.54959C9.23095 1.1564 9.07274 0.959801 8.85645 0.854901C8.64017 0.75 8.39303 0.75 7.89876 0.75H6.48963C5.98381 0.75 5.7309 0.75 5.57376 0.912718C5.41663 1.07544 5.41663 1.33733 5.41663 1.86111V4.08333H7.89876C8.39303 4.08333 8.64017 4.08333 8.85645 3.97843C9.07274 3.87353 9.23095 3.67694 9.54738 3.28374L9.67272 3.12798C9.94644 2.78786 10.0833 2.61781 10.0833 2.41667C10.0833 2.21553 9.94644 2.04547 9.67272 1.70535L9.54737 1.54959Z" stroke="#0372E6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
//   <path d="M9.54737 7.54959C9.23095 7.1564 9.07274 6.9598 8.85645 6.8549C8.64017 6.75 8.39303 6.75 7.89876 6.75H5.41663V10.0833H7.89876C8.39303 10.0833 8.64017 10.0833 8.85645 9.97843C9.07274 9.87353 9.23095 9.67694 9.54738 9.28374L9.67272 9.12798C9.94644 8.78786 10.0833 8.61781 10.0833 8.41667C10.0833 8.21553 9.94644 8.04547 9.67272 7.70535L9.54737 7.54959Z" stroke="#0372E6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
//   <path d="M1.28592 4.88357C1.60234 4.49038 1.76055 4.29379 1.97684 4.18889C2.19313 4.08398 2.44026 4.08398 2.93453 4.08398H5.41667V7.41732H2.93453C2.44026 7.41732 2.19313 7.41732 1.97684 7.31242C1.76055 7.20752 1.60234 7.01092 1.28592 6.61773L1.16057 6.46197C0.886856 6.12185 0.75 5.95179 0.75 5.75065C0.75 5.54951 0.886856 5.37945 1.16057 5.03933L1.28592 4.88357Z" stroke="#0372E6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
//   <path d="M5.41663 14.0837L5.41663 1.41699" stroke="#0372E6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
//   <path d="M3.41663 14.084H7.41663" stroke="#0372E6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
// </svg>} {user.subscription}
//                         </span>
//                         <span className="text-xs text-[#6A7282] font-inter font-normal leading-4.5 mt-1">
//                           {user.expiryDate ? `Expires: ${user.expiryDate}` : 'Expires: N/a'}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="py-4 px-4">
//                       <div className="text-sm font-normal leading-5 text-[#364153] space-y-1">
//                         <div>Behaviours: {user.behaviours}</div>
//                         <div>Supplements: {user.supplements}</div>
//                       </div>
//                     </td>
//                     <td className="py-4 px-4">
//                       <span className="inline-block px-4 py-2 bg-[#DCFCE7] text-[#008236] rounded-full text-sm font-medium leading-[130%]">
//                         {user.status}
//                       </span>
//                     </td>
//                     <td className="py-4 px-4">
//                       <button 
//                       onClick={() =>
//                         setActionOpen(actionOpen === user.id ? null : user.id)
//                       } className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
//                         <MoreVertical className="w-5 h-5 text-gray-600" />
//                       </button>
//                       {/* Action Dropdown */}
//                     {actionOpen === user.id && (
//                       <div className="absolute right-12 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
//                         <button
//                           className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
//                           onClick={() =>
//                             setUser((prev) =>
//                               prev.filter((p) => p.id !== user.id)
//                             )
//                           }
//                         >
//                           Delete
//                         </button>
//                         <button
//                           className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-gray-100 cursor-pointer"
//                           onClick={() => handleSuspend(user.id)}
//                         >
//                           Suspend
//                         </button>
//                       </div>
//                     )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

  

//           {/* Pagination */}
//           <div className="flex items-center justify-center gap-2 mt-8">
//             <button
//               onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
//               disabled={currentPage === 1}
//             >
//               <ChevronLeft className="w-5 h-5 text-gray-600" />
//             </button>
            
//             <button
//               onClick={() => setCurrentPage(1)}
//               className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
//                 currentPage === 1
//                   ? 'bg-[#8B5CF6]  text-white'
//                   : 'hover:bg-gray-100 text-gray-700'
//               }`}
//             >
//               1
//             </button>
            
//             <button
//               onClick={() => setCurrentPage(2)}
//               className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
//                 currentPage === 2
//                   ? 'bg-[#8B5CF6]  text-white'
//                   : 'hover:bg-gray-100 text-gray-700'
//               }`}
//             >
//               2
//             </button>
            
//             <button
//               onClick={() => setCurrentPage(3)}
//               className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
//                 currentPage === 3
//                   ? 'bg-[#8B5CF6]  text-white'
//                   : 'hover:bg-gray-100 text-gray-700'
//               }`}
//             >
//               3
//             </button>
            
//             <span className="px-2 text-gray-500">...</span>
            
//             <button
//               onClick={() => setCurrentPage(Math.min(10, currentPage + 1))}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
//               disabled={currentPage === 10}
//             >
//               <ChevronRight className="w-5 h-5 text-gray-600" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserManagement;