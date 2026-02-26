/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Search, ChevronDown, MoreVertical, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import userImg from '../../../public/images/user.png';
import AddProviderModal from './AddProviderModal';
import {
  useGetProvidersQuery,
  useDeleteProviderMutation,
  useUpdateProviderStatusMutation,
  useGetProviderByIdQuery,
} from '../../redux/features/admin/providerApi';
import { useDispatch } from 'react-redux';
import { providerApi } from '../../redux/features/admin/providerApi';
import { toast } from 'react-toastify';

interface Provider {
  id: number;
  name: string;
  image: string;
  provider_category: string;
  designation: string;
  specializations: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  city?: string;
  status?: boolean;
  office_hours?: any;
}

const getSpecialistColor = (specialist: string): string => {
  const colors: Record<string, string> = {
    'MAPS Doctor': 'bg-purple-100 text-purple-600',
    'DANI Practitioner': 'bg-purple-100 text-purple-600',
    'Functional Medicine': 'bg-purple-100 text-purple-600',
    'Nutritionist': 'bg-purple-100 text-purple-600'
  };
  return colors[specialist] || 'bg-gray-100 text-gray-700';
};

// ✅ আলাদা component — প্রতিটা provider এর status /providers/{id}/ থেকে fetch করে
function ProviderStatusFetcher({
  providerId,
  onStatusFetched,
}: {
  providerId: number;
  onStatusFetched: (id: number, status: boolean) => void;
}) {
  const { data } = useGetProviderByIdQuery(providerId);

  useEffect(() => {
    if (data?.status !== undefined) {
      onStatusFetched(providerId, data.status);
    }
  }, [data, providerId, onStatusFetched]);

  return null; // UI render করে না, শুধু data fetch করে
}

export default function ProviderTable() {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [specialistFilter, setSpecialistFilter] = useState<string>('All');
  const [actionOpen, setActionOpen] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [localProviders, setLocalProviders] = useState<Provider[]>([]);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { data: providersData, isLoading } = useGetProvidersQuery({
    page: currentPage,
    search: searchTerm,
  }, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteProvider] = useDeleteProviderMutation();
  const [updateProviderStatus] = useUpdateProviderStatusMutation();

  const itemsPerPage = 10;

  // ✅ List API থেকে data আসলে localProviders এ set করো
  // আগের status থাকলে সেটা রাখো, না থাকলে undefined (ProviderStatusFetcher এ আসবে)
  useEffect(() => {
    if (providersData?.results) {
      setLocalProviders(prev => {
        return providersData.results.map((p) => {
          const existing = prev.find(ep => ep.id === p.id);
          return {
            ...p,
            status: existing?.status,
          };
        });
      });
    }
  }, [providersData]);

  // ✅ ProviderStatusFetcher থেকে status আসলে update করো
  const handleStatusFetched = useCallback((id: number, status: boolean) => {
    setLocalProviders(prev =>
      prev.map(p => p.id === id ? { ...p, status } : p)
    );
  }, []);

  // Outside click → dropdown close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActionOpen(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Suspend / Activate
  const handleSuspend = async (provider: Provider) => {
    try {
      const currentStatus = provider.status === true;
      const newStatus = !currentStatus;

      await updateProviderStatus({
        id: provider.id,
        status: newStatus,
      }).unwrap();

      toast.success(currentStatus ? 'Provider suspended!' : 'Provider activated!');
      setActionOpen(null);

      // ✅ সাথে সাথে local state update করো
      setLocalProviders(prev =>
        prev.map(p => p.id === provider.id ? { ...p, status: newStatus } : p)
      );

    } catch (error) {
      toast.error('Failed to update provider status', { position: "top-right" });
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProvider(deleteId).unwrap();
      toast.success('Provider deleted successfully!', { position: "top-right" });
      setLocalProviders(prev => prev.filter(p => p.id !== deleteId));
      dispatch(providerApi.util.invalidateTags(['Providers']));
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete provider:', error);
      toast.error('Failed to delete provider', { position: "top-right" });
    }
  };

  // Filter — localProviders থেকে
  const filteredProviders = localProviders.filter((p: Provider) => {
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' ? p.status === true : p.status === false || p.status === undefined);
    const matchesSpecialist =
      specialistFilter === 'All' || p.provider_category === specialistFilter;
    return matchesStatus && matchesSpecialist;
  });

  const totalPages = Math.ceil((providersData?.count || 0) / itemsPerPage);
  const specialistOptions = ['All', ...Array.from(new Set(localProviders.map((p: Provider) => p.provider_category)))];

  if (isLoading) {
    return (
      <div className="mt-6 flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading providers...</div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* ✅ প্রতিটা provider এর জন্য silently status fetch করো */}
      {localProviders.map(provider => (
        <ProviderStatusFetcher
          key={provider.id}
          providerId={provider.id}
          onStatusFetched={handleStatusFetched}
        />
      ))}

      <div className="bg-white rounded-2xl shadow-lg flex flex-col p-4 md:p-6">

        {/* Filters — এটা fixed থাকবে, scroll হবে না */}
        <div className="flex flex-col xl:flex-row gap-4 justify-between items-center mb-4 flex-shrink-0">
          <div className="flex flex-1 gap-4 flex-wrap">

            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => {
                setIsEdit(false);
                setSelectedProvider(null);
                setIsModalOpen(true);
              }}
              className="bg-violet-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-violet-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New
            </button>

            <div className="relative">
              <select
                className="appearance-none px-4 py-2.5 pr-8 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={specialistFilter}
                onChange={(e) => setSpecialistFilter(e.target.value)}
              >
                {specialistOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                className="appearance-none px-4 py-2.5 pr-8 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Active' | 'Inactive')}
              >
                {['All', 'Active', 'Inactive'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

          </div>
        </div>

        {/* Table — শুধু এই অংশ scroll হবে */}
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialist</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProviders.map((provider: Provider) => (
                <tr key={provider.id} className="hover:bg-gray-50 transition-colors">

                  <td className="px-6 py-4">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={provider.image || userImg}
                      alt={provider.name}
                      onError={(e) => { (e.target as HTMLImageElement).src = userImg; }}
                    />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{provider.name}</span>
                      <span className="text-sm text-gray-500">{provider.designation || provider.email}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex py-2 px-4 rounded-full text-xs font-medium ${getSpecialistColor(provider.provider_category)}`}>
                      {provider.provider_category}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900">{provider.address}</span>
                      <span className="text-sm text-gray-500">{provider.city}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900">{provider.phone}</span>
                      <span className="text-sm text-gray-500">{provider.email}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {/* ✅ status undefined হলে loading দেখাও */}
                    {provider.status === undefined ? (
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-400">
                        Loading...
                      </span>
                    ) : (
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${provider.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {provider.status ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setActionOpen(actionOpen === provider.id ? null : provider.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {actionOpen === provider.id && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 top-8 w-36 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
                        >
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-gray-50 rounded-t-lg cursor-pointer"
                            onClick={() => {
                              setIsEdit(true);
                              setSelectedProvider(provider);
                              setIsModalOpen(true);
                              setActionOpen(null);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              setDeleteId(provider.id);
                              setActionOpen(null);
                            }}
                          >
                            Delete
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-gray-50 rounded-b-lg cursor-pointer"
                            onClick={() => handleSuspend(provider)}
                          >
                            {provider.status ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {filteredProviders.length === 0 && (
            <div className="text-center py-8 text-gray-500">No providers found</div>
          )}
        </div>

        {/* Delete Modal */}
        {deleteId && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setDeleteId(null)}
          >
            <div className="bg-white rounded-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-semibold text-center mb-6">
                Are you sure,<br />you want to delete this provider?
              </h2>
              <div className="flex justify-center gap-3">
                <button onClick={() => setDeleteId(null)} className="px-8 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer">No</button>
                <button onClick={handleDelete} className="px-8 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer">Yes</button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <AddProviderModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedProvider(null);
              // ✅ invalidateTags সরানো হয়েছে — এটা status reset করত
            }}
            isEdit={isEdit}
            providerData={selectedProvider}
          />
        )}

        {/* Pagination — fixed থাকবে */}
        <div className="mt-4 flex justify-center items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100'}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}












// import { useState } from 'react';
// import { Search, ChevronDown, MoreVertical, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
// import userImg from '../../../public/images/user.png';
// import AddProviderModal from './AddProviderModal';

// interface Provider {
//   id: number;
//   name: string;
//   credentials: string;
//   email: string;
//   specialist: string;
//   location: string;
//   distance: string;
//   contact: string;
//   status: 'Active' | 'Inactive';
//   image: string;
// }

// // Initial providers
// const initialProviders: Provider[] = [
//   {
//     id: 1,
//     name: 'Dr. Sarah Mitchell',
//     credentials: 'MD, MAPS',
//     email: 'info@drmitchell.com',
//     specialist: 'MAPS Doctor',
//     location: 'San Francisco, CA 94102',
//     distance: '2.5 mi',
//     contact: '(555) 123-4567',
//     status: 'Active',
//     image: userImg
//   },
//   {
//     id: 2,
//     name: 'John Doe',
//     credentials: '',
//     email: 'john.doe@example.com',
//     specialist: 'DANI Practitioner',
//     location: 'San Francisco, CA 94102',
//     distance: '2.5 mi',
//     contact: '(555) 123-4567',
//     status: 'Active',
//     image: userImg
//   },
//   {
//     id: 3,
//     name: 'Jane Smith',
//     credentials: '',
//     email: 'jane.smith@example.com',
//     specialist: 'Functional Medicine',
//     location: 'San Francisco, CA 94102',
//     distance: '2.5 mi',
//     contact: '(555) 987-6543',
//     status: 'Inactive',
//     image: userImg
//   },
//   {
//     id: 4,
//     name: 'Mike Johnson',
//     credentials: '',
//     email: 'mike.johnson@example.com',
//     specialist: 'Nutritionist',
//     location: 'San Francisco, CA 94102',
//     distance: '3.0 mi',
//     contact: '(555) 555-1234',
//     status: 'Active',
//     image: userImg
//   },
//   {
//     id: 5,
//     name: 'Alice Brown',
//     credentials: '',
//     email: 'alice.brown@example.com',
//     specialist: 'MAPS Doctor',
//     location: 'San Francisco, CA 94102',
//     distance: '4.2 mi',
//     contact: '(555) 321-9876',
//     status: 'Inactive',
//     image: userImg
//   }
// ];

// // Specialist colors
// const getSpecialistColor = (specialist: string): string => {
//   const colors: Record<string, string> = {
//     'MAPS Doctor': 'bg-purple-100 text-purple-600',
//     'DANI Practitioner': 'bg-purple-100 text-purple-600',
//     'Functional Medicine': 'bg-purple-100 text-purple-600',
//     'Nutritionist': 'bg-purple-100 text-purple-600'
//   };
//   return colors[specialist] || 'bg-gray-100 text-gray-700';
// };

// export default function ProviderTable() {
//   const [providers, setProviders] = useState<Provider[]>(initialProviders);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
//   const [specialistFilter, setSpecialistFilter] = useState<'All' | string>('All');
//   const [actionOpen, setActionOpen] = useState<number | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   const itemsPerPage = 3; // number of rows per page


//       const [isModalOpen, setIsModalOpen] = useState(false);
// const [isEdit, setIsEdit] = useState(false);
// const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

//   const handleSuspend = (id: number) => {
//     setProviders((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, status: 'Inactive' } : p))
//     );
//     setActionOpen(null);
//   };

//   // Filter providers based on search + filters
//   const filteredProviders = providers.filter((p) => {
//     const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
//     const matchesSpecialist = specialistFilter === 'All' || p.specialist === specialistFilter;
//     return matchesSearch && matchesStatus && matchesSpecialist;
//   });

//   // Pagination logic
//   const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
//   const paginatedProviders = filteredProviders.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // Unique specialist list for dropdown
//   const specialistOptions = ['All', ...Array.from(new Set(providers.map(p => p.specialist)))];

//   return (
//     <div className="mt-6">
//       <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-4 md:p-6">
//         {/* Header Filters */}
//         <div className="flex flex-col xl:flex-row gap-4 justify-between items-center mb-4">
//           <div className="flex flex-1 gap-4">
//             {/* Search */}
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search providers..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               />
//             </div>
//                <div>
//           <button
//                onClick={() => {
//     setIsEdit(false);          
//     setSelectedProvider(null); 
//     setIsModalOpen(true);     
//   }}
//             className="bg-violet-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer"
//           >
//             <Plus className="w-5 h-5" />
//             Add New
//           </button>
//       </div>

//             {/* Specialist Dropdown */}
//             <div className="relative">
//               <select
//                 className="appearance-none flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 value={specialistFilter}
//                 onChange={(e) => setSpecialistFilter(e.target.value)}
//               >
//                 {specialistOptions.map((s) => (
//                   <option key={s} value={s}>{s}</option>
//                 ))}
//               </select>
//               <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//             </div>

//             {/* Status Dropdown */}
//             <div className="relative">
//               <select
//                 className="appearance-none flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Active' | 'Inactive')}
//               >
//                 {['All', 'Active', 'Inactive'].map((status) => (
//                   <option key={status} value={status}>{status}</option>
//                 ))}
//               </select>
//               <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th>Profile</th>
//                 <th>Provider</th>
//                 <th>Specialist</th>
//                 <th>Location</th>
//                 <th>Contact</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {paginatedProviders.map((provider) => (
//                 <tr key={provider.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-6 py-4">
//                     <img className="w-10 h-10 rounded-full" src={provider.image} alt="" />
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex flex-col">
//                       <span>{provider.name}</span>
//                       <span>{provider.credentials || provider.email}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span
//                       className={`inline-flex py-2 px-4 rounded-full text-xs font-medium ${getSpecialistColor(
//                         provider.specialist
//                       )}`}
//                     >
//                       {provider.specialist}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex flex-col">
//                       <span>{provider.location}</span>
//                       <span>{provider.distance}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex flex-col">
//                       <span>{provider.contact}</span>
//                       <span>{provider.email}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span
//                       className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
//                         provider.status === 'Active'
//                           ? 'bg-green-100 text-green-700'
//                           : 'bg-red-100 text-red-700'
//                       }`}
//                     >
//                       {provider.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 relative">
//                     <button
//                       onClick={() =>
//                         setActionOpen(actionOpen === provider.id ? null : provider.id)
//                       }
//                       className="text-gray-400 hover:text-gray-600 transition-colors"
//                     >
//                       <MoreVertical className="w-5 h-5" />
//                     </button>

//                     {/* Action Dropdown */}
//                     {actionOpen === provider.id && (
//                       <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
//                             <button
//                           className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-gray-100 cursor-pointer"
//                             onClick={() => {
//     setIsEdit(true);
//     setSelectedProvider(provider);
//     setIsModalOpen(true);
//     setActionOpen(null);
//   }}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                        
//                         >
//                           Delete
//                         </button>
//                         <button
//                           className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-gray-100 cursor-pointer"
//                           onClick={() => handleSuspend(provider.id)}
//                         >
//                           Suspend
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//  {isModalOpen && (
//   <AddProviderModal
//     isOpen={isModalOpen}
//     onClose={() => setIsModalOpen(false)}
//     isEdit={isEdit}
//     providerData={selectedProvider}
//   />
// )}
//         </div>

//         {/* Pagination */}
//         <div className="mt-4 flex justify-center items-center gap-2">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
//           >
//             <ChevronLeft className="w-5 h-5" />
//           </button>

//           {Array.from({ length: totalPages }, (_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => setCurrentPage(i + 1)}
//               className={`px-3 py-1 rounded ${
//                 currentPage === i + 1 ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100'
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}

//           <button
//             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
//           >
//             <ChevronRight className="w-5 h-5" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// } 







// import  { useState } from 'react';
// import { Search, ChevronDown, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
// import userImg from '../../../public/images/user.png'

// interface Provider {
//   id: number;
//   name: string;
//   credentials: string;
//   email: string;
//   specialist: string;
//   location: string;
//   distance: string;
//   contact: string;
//   status: 'Active' | 'Inactive';
//   image: string;
// }

// const initialProviders: Provider[] = [
//   {
//     id: 1,
//     name: 'Dr. Sarah Mitchell',
//     credentials: 'MD, MAPS',
//     email: 'info@drmitchell.com',
//     specialist: 'MAPS Doctor',
//     location: 'San Francisco, CA 94102',
//     distance: '2.5 mi',
//     contact: '(555) 123-4567',
//     status: 'Active',
//     image: userImg
//   },
//   {
//     id: 2,
//     name: 'John Doe',
//     credentials: '',
//     email: 'john.doe@example.com',
//     specialist: 'DANI Practitioner',
//     location: 'San Francisco, CA 94102',
//     distance: '2.5 mi',
//     contact: '(555) 123-4567',
//     status: 'Active',
//     image: userImg
//   },
//   {
//     id: 3,
//     name: 'John Doe',
//     credentials: '',
//     email: 'john.doe@example.com',
//     specialist: 'Functional Medicine',
//     location: 'San Francisco, CA 94102',
//     distance: '2.5 mi',
//     contact: '(555) 123-4567',
//     status: 'Active',
//     image: userImg
//   },
//   {
//     id: 4,
//     name: 'John Doe',
//     credentials: '',
//     email: 'john.doe@example.com',
//     specialist: 'Nutritionist',
//     location: 'San Francisco, CA 94102',
//     distance: '2.5 mi',
//     contact: '(555) 123-4567',
//     status: 'Active',
//     image: userImg
//   },
//   {
//     id: 5,
//     name: 'John Doe',
//     credentials: '',
//     email: 'john.doe@example.com',
//     specialist: 'MAPS Doctor',
//     location: 'San Francisco, CA 94102',
//     distance: '2.5 mi',
//     contact: '(555) 123-4567',
//     status: 'Active',
//     image: userImg
//   },
//   {
//     id: 6,
//     name: 'John Doe',
//     credentials: '',
//     email: 'john.doe@example.com',
//     specialist: 'MAPS Doctor',
//     location: 'San Francisco, CA 94102',
//     distance: '2.5 mi',
//     contact: '(555) 123-4567',
//     status: 'Active',
//     image: userImg
//   }
// ];

// const getSpecialistColor = (specialist: string): string => {
//   const colors: Record<string, string> = {
//     'MAPS Doctor': 'bg-purple-100 text-purple-600',
//     'DANI Practitioner': 'bg-purple-100 text-purple-600',
//     'Functional Medicine': 'bg-purple-100 text-purple-600',
//     'Nutritionist': 'bg-purple-100 text-purple-600'
//   };
//   return colors[specialist] || 'bg-gray-100 text-gray-700';
// };

// export default function ProviderTable() {
//   const [providers, setProviders] = useState<Provider[]>(initialProviders);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
//   const [specialistFilter, setSpecialistFilter] = useState<'All' | string>('All');
//   const [actionOpen, setActionOpen] = useState<number | null>(null);

//   const handleSuspend = (id: number) => {
//     setProviders((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, status: 'Inactive' } : p))
//     );
//     setActionOpen(null); // close dropdown
//   };

//   const filteredProviders = providers.filter((p) => {
//     const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
//     const matchesSpecialist = specialistFilter === 'All' || p.specialist === specialistFilter;
//     return matchesSearch && matchesStatus && matchesSpecialist;
//   });

//   return (
//     <div className="mt-6">
//       <div className=" bg-white rounded-2xl shadow-lg overflow-hidden">
//         {/* Header with filters */}
//         <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col xl:flex-row gap-4 justify-between items-center">
//           <div className="flex flex-1 gap-4">
//             {/* Search */}
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search providers..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               />
//             </div>

//             {/* Provider Type Filter */}
//             <div className="relative">
//               <button
//                 className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
//                 onClick={() =>
//                   setSpecialistFilter(specialistFilter === 'All' ? 'MAPS Doctor' : 'All')
//                 }
//               >
//                 <span className="text-gray-600 text-sm">
//                   {specialistFilter === 'All' ? 'Provider Type' : specialistFilter}
//                 </span>
//                 <ChevronDown className="w-4 h-4 text-gray-400" />
//               </button>
//               {/* Add full dropdown if needed */}
//             </div>

//             {/* Status Filter */}
//             <div className="relative">
//               <button
//                 className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
//                 onClick={() =>
//                   setStatusFilter(
//                     statusFilter === 'All'
//                       ? 'Active'
//                       : statusFilter === 'Active'
//                       ? 'Inactive'
//                       : 'All'
//                   )
//                 }
//               >
//                 <span className="text-gray-600 text-sm">{statusFilter}</span>
//                 <ChevronDown className="w-4 h-4 text-gray-400" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Desktop Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th>Profile</th>
//                 <th>Provider</th>
//                 <th>Specialist</th>
//                 <th>Location</th>
//                 <th>Contact</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredProviders.map((provider) => (
//                 <tr key={provider.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-6 py-4">
//                     <img className="w-10 h-10 rounded-full" src={provider.image} alt="" />
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex flex-col">
//                       <span>{provider.name}</span>
//                       <span>{provider.credentials || provider.email}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span
//                       className={`inline-flex py-2 px-4 rounded-full text-xs font-medium ${getSpecialistColor(
//                         provider.specialist
//                       )}`}
//                     >
//                       {provider.specialist}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex flex-col">
//                       <span>{provider.location}</span>
//                       <span>{provider.distance}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex flex-col">
//                       <span>{provider.contact}</span>
//                       <span>{provider.email}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span
//                       className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
//                         provider.status === 'Active'
//                           ? 'bg-green-100 text-green-700'
//                           : 'bg-red-100 text-red-700'
//                       }`}
//                     >
//                       {provider.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 relative">
//                     <button
//                       onClick={() =>
//                         setActionOpen(actionOpen === provider.id ? null : provider.id)
//                       }
//                       className="text-gray-400 hover:text-gray-600 transition-colors"
//                     >
//                       <MoreVertical className="w-5 h-5" />
//                     </button>

//                     {/* Action Dropdown */}
//                     {actionOpen === provider.id && (
//                       <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
//                         <button
//                           className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
//                           onClick={() =>
//                             setProviders((prev) =>
//                               prev.filter((p) => p.id !== provider.id)
//                             )
//                           }
//                         >
//                           Delete
//                         </button>
//                         <button
//                           className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-gray-100"
//                           onClick={() => handleSuspend(provider.id)}
//                         >
//                           Suspend
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

     

//         {/* Pagination */}
//         <div className="px-4 md:px-6 py-4 border-t border-gray-200 flex items-center justify-center gap-2">
//           <button
//             onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//             className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={currentPage === 1}
//           >
//             <ChevronLeft className="w-5 h-5 text-gray-600" />
//           </button>
          
//           <button className="px-4 py-2 rounded-lg bg-indigo-200 text-black font-medium text-sm cursor-pointer">
//             1
//           </button>
//           <button className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 font-medium text-sm cursor-pointer">
//             2
//           </button>
//           <button className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 font-medium text-sm cursor-pointer">
//             3
//           </button>
//           <span className="px-2 text-gray-400">...</span>
//           <button className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 font-medium text-sm cursor-pointer">
//             Next
//           </button>
          
//           <button
//             onClick={() => setCurrentPage(currentPage + 1)}
//             className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//           >
//             <ChevronRight className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }