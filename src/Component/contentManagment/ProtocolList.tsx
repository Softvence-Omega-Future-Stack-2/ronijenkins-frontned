/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2, X } from 'lucide-react'; 
import AddProtocolModal from './AddProtocolModal';
import { 
  useGetProtocolsQuery, 
  useDeleteProtocolMutation,
  type Protocol,
  useGetProtocolByIdQuery,
  
} from '../../redux/features/admin/content/protocolApi';
import { toast } from 'react-toastify';


// Category Color Helper
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'gut_health': 'bg-indigo-50 text-indigo-500',
    'detoxification': 'bg-purple-50 text-purple-500',
    'immune_support': 'bg-fuchsia-50 text-fuchsia-500',
    'behavioral': 'bg-emerald-50 text-emerald-500'
  };
  return colors[category.toLowerCase()] || 'bg-gray-50 text-gray-500';
};

// Category Label Helper
const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    'gut_health': 'Gut Health',
    'detoxification': 'Detoxification',
    'immune_support': 'Immune Support',
    'behavioral': 'Behavioral'
  };
  return labels[category.toLowerCase()] || category;
};

// Delete Confirmation Modal
interface DeleteConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  isDeleting?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmProps> = ({ onConfirm, onCancel, message, isDeleting }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Confirm Delete</h2>
          <button onClick={onCancel} disabled={isDeleting}>
            <X />
          </button>
        </div>
        <p className="mb-6">{message}</p>
        <div className="flex justify-center gap-3">
          <button 
            onClick={onCancel} 
            disabled={isDeleting}
            className="border px-8 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            No
          </button>
          <button 
            onClick={onConfirm}
            disabled={isDeleting}
            className={`bg-rose-500 text-white px-8 py-2 rounded-xl transition-colors ${
              isDeleting 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer hover:bg-rose-600'
            }`}
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                    fill="none"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Deleting...
              </span>
            ) : (
              'Yes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Protocol Item Component
const ProtocolItem: React.FC<{ 
  protocol: Protocol; 
  onEdit: (protocol: Protocol) => void; 
  onDelete: (protocol: Protocol) => void 
}> = ({ protocol, onEdit, onDelete }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
      {/* Content */}
      <div className="flex items-start gap-4 flex-1">
        {/* Protocol Image */}
        {protocol.image && (
          <img 
            src={protocol.image} 
            alt={protocol.protocol_name}
            className="w-16 h-16 rounded-lg object-cover border-2 border-gray-100"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        
        <div className="flex-1 space-y-2">
          <div>
            <h3 className="text-lg font-bold text-slate-800 leading-tight">{protocol.protocol_name}</h3>
            <p className="text-sm text-slate-500 mt-1">{protocol.description}</p>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${getCategoryColor(protocol.category)}`}>
              {getCategoryLabel(protocol.category)}
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-sky-100 text-sky-600">
              {protocol.root_causes_count} Root causes
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
              {protocol.supplements_count} supplements
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-4 sm:mt-0 sm:ml-6">
        <button onClick={() => onEdit(protocol)} className="text-indigo-400 hover:text-indigo-600 transition-colors p-1 cursor-pointer">
          <Pencil size={20} />
        </button>
        <button onClick={() => onDelete(protocol)} className="text-rose-400 hover:text-rose-600 transition-colors p-1 cursor-pointer">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

const ProtocolList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [protocolToDelete, setProtocolToDelete] = useState<Protocol | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const itemsPerPage = 10;

  // 🔥 API Hooks
  const { data: protocolsData, isLoading, refetch } = useGetProtocolsQuery({ 
    page: currentPage,
    page_size: itemsPerPage,
    search: searchQuery 
  });

  const [deleteProtocol, { isLoading: isDeleting }] = useDeleteProtocolMutation();

  const protocols = protocolsData?.results || [];
  const totalCount = protocolsData?.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleAdd = () => {
    setSelectedProtocol(null);
    setIsModalOpen(true);
  };
 // State এ id track করুন
const [selectedProtocolId, setSelectedProtocolId] = useState<number | null>(null);

// Single protocol fetch
const { data: protocolDetail } = useGetProtocolByIdQuery(selectedProtocolId!, {
  skip: selectedProtocolId === null,
});
console.log(protocolDetail)

  const handleEdit = (protocol: Protocol) => {
  setSelectedProtocol(protocol); // fallback হিসেবে রাখুন
  setSelectedProtocolId(protocol.id);
  setIsModalOpen(true);
};

  const handleDeleteClick = (protocol: Protocol) => {
    setProtocolToDelete(protocol);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!protocolToDelete) return;
    
    try {
      await deleteProtocol(protocolToDelete.id).unwrap();
      
      // 🎉 Success Toast
      toast.success('Protocol deleted successfully!', {
        // duration: 3000,
        position: 'top-right',
      });
      
      refetch();
      setProtocolToDelete(null);
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      console.error('❌ Failed to delete protocol:', error);
      
      // Error handling
      let errorMessage = 'Failed to delete protocol';
      
      if (error?.data) {
        const errorData = error.data;
        
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      }
      
      toast.error(errorMessage, {
        // duration: 3000,
        position: 'top-right',
      });
    }
  };

  const cancelDelete = () => {
    setProtocolToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    
    return pages;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading protocols...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-2.5 md:p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-slate-800">Protocols  {totalCount > 0 && <span className="text-sm text-gray-500">({totalCount})</span>} </h2>
        <button
          onClick={handleAdd}
          className="bg-violet-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search protocols..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2.5 bg-indigo-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {protocols.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No protocols found</div>
      ) : (
        protocols.map((p) => (
          <ProtocolItem key={p.id} protocol={p} onEdit={handleEdit} onDelete={handleDeleteClick} />
        ))
      )}

      {isModalOpen && (
  <AddProtocolModal
    mode={selectedProtocol || selectedProtocolId ? 'edit' : 'add'}
    initialData={protocolDetail || selectedProtocol}  
    onClose={() => {
      setIsModalOpen(false);
      setSelectedProtocol(null);
      setSelectedProtocolId(null);  // ← reset
      refetch();
    }}
  />
)}

      {isDeleteModalOpen && protocolToDelete && (
        <DeleteConfirmModal
          message={`Are you sure you want to delete "${protocolToDelete.protocol_name}"?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          isDeleting={isDeleting}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {renderPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() => goToPage(page as number)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}

            <button
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtocolList;







// import React, { useState } from 'react';
// import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2, X } from 'lucide-react'; 
// import AddProtocolModal from './AddProtocolModal';

// // Protocol Interface - Updated with all required fields
// export interface Protocol {
//   id: number;
//   title: string;
//   description: string;
//   category: string;
//   rootCausesCount: number;
//   supplementsCount: number;
//   categoryColor: string;
// }

// // Delete Confirmation Modal
// interface DeleteConfirmProps {
//   onConfirm: () => void;
//   onCancel: () => void;
//   message: string;
// }

// const DeleteConfirmModal: React.FC<DeleteConfirmProps> = ({ onConfirm, onCancel, message }) => {
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-medium">Confirm Delete</h2>
//           <button onClick={onCancel}><X /></button>
//         </div>
//         <p className="mb-6">{message}</p>
//         <div className="flex justify-center gap-3">
//           <button onClick={onCancel} className="border px-8 py-2 rounded-xl cursor-pointer">No</button>
//           <button onClick={onConfirm} className="bg-rose-500 text-white px-8 py-2 rounded-xl cursor-pointer">Yes</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Protocol Item Component
// const ProtocolItem: React.FC<{ 
//   protocol: Protocol; 
//   onEdit: (protocol: Protocol) => void; 
//   onDelete: (protocol: Protocol) => void 
// }> = ({ protocol, onEdit, onDelete }) => {
//   return (
//     <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
//       {/* Content */}
//       <div className="flex-1 space-y-2">
//         <div>
//           <h3 className="text-lg font-bold text-slate-800 leading-tight">{protocol.title}</h3>
//           <p className="text-sm text-slate-500 mt-1">{protocol.description}</p>
//         </div>
//         <div className="flex flex-wrap gap-2 pt-1">
//           <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${protocol.categoryColor}`}>
//             {protocol.category}
//           </span>
//           <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-sky-100 text-sky-600">
//             {protocol.rootCausesCount} Root causes
//           </span>
//           <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
//             {protocol.supplementsCount} supplements
//           </span>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex items-center gap-4 mt-4 sm:mt-0 sm:ml-6">
//         <button onClick={() => onEdit(protocol)} className="text-indigo-400 hover:text-indigo-600 transition-colors p-1 cursor-pointer">
//           <Pencil size={20} />
//         </button>
//         <button onClick={() => onDelete(protocol)} className="text-rose-400 hover:text-rose-600 transition-colors p-1 cursor-pointer">
//           <Trash2 size={20} />
//         </button>
//       </div>
//     </div>
//   );
// };

// const ProtocolList: React.FC = () => {
//   const initialProtocols: Protocol[] = [
//     { id: 1, title: 'Gut Healing Protocol', description: 'Comprehensive gut healing approach', category: 'Gut Health', rootCausesCount: 4, supplementsCount: 2, categoryColor: 'bg-indigo-50 text-indigo-500' },
//     { id: 2, title: 'Methylation Support', description: 'Comprehensive detoxification support', category: 'Detoxification', rootCausesCount: 3, supplementsCount: 1, categoryColor: 'bg-purple-50 text-purple-500' },
//     { id: 3, title: 'Immune Support Protocol', description: 'Supports overall immunity', category: 'Immune Support', rootCausesCount: 2, supplementsCount: 2, categoryColor: 'bg-fuchsia-50 text-fuchsia-500' },
//   ];

//   const [protocols, setProtocols] = useState<Protocol[]>(initialProtocols);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [protocolToDelete, setProtocolToDelete] = useState<Protocol | null>(null);

//     const [currentPage, setCurrentPage] = useState(1);
//       const [searchQuery,] = useState('');

//   const itemsPerPage = 6;

//   const handleAdd = () => {
//     setSelectedProtocol(null);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (protocol: Protocol) => {
//     setSelectedProtocol(protocol);
//     setIsModalOpen(true);
//   };

//   const handleDeleteClick = (protocol: Protocol) => {
//     setProtocolToDelete(protocol);
//     setIsDeleteModalOpen(true);
//   };

//   const confirmDelete = () => {
//     if (protocolToDelete) {
//       setProtocols((prev) => prev.filter((p) => p.id !== protocolToDelete.id));
//       setProtocolToDelete(null);
//       setIsDeleteModalOpen(false);
//     }
//   };

//   const cancelDelete = () => {
//     setProtocolToDelete(null);
//     setIsDeleteModalOpen(false);
//   };

//   const handleSave = (protocolData: Omit<Protocol, 'id'> & { id?: number }) => {
//     if (protocolData.id) {
//       setProtocols((prev) =>
//         prev.map((p) => (p.id === protocolData.id ? { ...p, ...protocolData } as Protocol : p))
//       );
//     } else {
//       const newProtocol: Protocol = {
//         ...protocolData,
//         id: protocols.length ? Math.max(...protocols.map(p => p.id)) + 1 : 1,
//         rootCausesCount: protocolData.rootCausesCount || 0,
//         supplementsCount: protocolData.supplementsCount || 0,
//         categoryColor:
//           protocolData.category === "Gut Health" ? "bg-indigo-50 text-indigo-500" :
//           protocolData.category === "Detoxification" ? "bg-purple-50 text-purple-500" :
//           protocolData.category === "Immune Support" ? "bg-fuchsia-50 text-fuchsia-500" :
//           "bg-emerald-50 text-emerald-500"
//       } as Protocol;
//       setProtocols((prev) => [...prev, newProtocol]);
//     }
//     setIsModalOpen(false);
//   };

// const filteredProtocol = initialProtocols.filter(protocol =>
//    protocol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     protocol.description.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//     // Calculate pagination
//   const totalPages = Math.ceil(filteredProtocol.length / itemsPerPage);
//   // const startIndex = (currentPage - 1) * itemsPerPage;
//   // const endIndex = startIndex + itemsPerPage;
//   // const currentSupplements = filteredProtocol.slice(startIndex, endIndex);

  
//   const goToPage = (page: number) => {
//     setCurrentPage(page);
//   };

//   const renderPageNumbers = () => {
//     const pages = [];
    
//     if (totalPages <= 5) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       if (currentPage <= 3) {
//         pages.push(1, 2, 3, '...', totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
//       } else {
//         pages.push(1, '...', currentPage, '...', totalPages);
//       }
//     }
    
//     return pages;
//   };

//   return (
//     <div className=" bg-white p-2.5 md:p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//       <div className="flex items-center justify-between mb-5">
//         <h2 className="text-lg font-semibold text-slate-800">Protocols</h2>
//         <button
//           onClick={handleAdd}
//           className="bg-violet-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-violet-700"
//         >
//           <Plus className="w-5 h-5" />
//           Add New
//         </button>
//       </div>

//       {protocols.length === 0 ? (
//         <div className="text-center py-12 text-gray-400">No protocols found</div>
//       ) : (
//         protocols.map((p) => (
//           <ProtocolItem key={p.id} protocol={p} onEdit={handleEdit} onDelete={handleDeleteClick} />
//         ))
//       )}

//       {isModalOpen && (
//         <AddProtocolModal
//           mode={selectedProtocol ? 'edit' : 'add'}
//           initialData={selectedProtocol}
//           onClose={() => setIsModalOpen(false)}
//           onSave={handleSave}
//         />
//       )}

//       {isDeleteModalOpen && protocolToDelete && (
//         <DeleteConfirmModal
//           message={`Are you sure you want to delete "${protocolToDelete.title}"?`}
//           onConfirm={confirmDelete}
//           onCancel={cancelDelete}
//         />
//       )}


//           {/* Pagination */}
//         <div className="mt-6">
//          <div className="flex flex-wrap items-center justify-center gap-2">             <button
//               onClick={() => goToPage(Math.max(1, currentPage - 1))}
//               disabled={currentPage === 1}
//               className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               <ChevronLeft className="w-4 h-4" />
//               <span className="hidden sm:inline">Previous</span>
//             </button>

//             {renderPageNumbers().map((page, index) => (
//               <React.Fragment key={index}>
//                 {page === '...' ? (
//                   <span className="px-3 py-2 text-gray-500">...</span>
//                 ) : (
//                   <button
//                     onClick={() => goToPage(page as number)}
//                     className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
//                       currentPage === page
//                         ? 'bg-blue-600 text-white'
//                         : 'text-gray-700 hover:bg-gray-100'
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 )}
//               </React.Fragment>
//             ))}

//             <button
//               onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
//               disabled={currentPage === totalPages}
//               className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               <span className="hidden sm:inline">Next</span>
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </div>
   
//   );
// };

// export default ProtocolList;







// import React, { useState } from 'react';
// import { Pencil, Plus, Trash2 } from 'lucide-react'; 
// import AddProtocolModal from './AddProtocolModal';

// // Protocol Interface
// export interface Protocol {
//   id: number;
//   title: string;
//   description: string;
//   category: string;
//   rootCausesCount: number;
//   supplementsCount: number;
//   categoryColor: string;
// }

// // Protocol Item Component
// const ProtocolItem: React.FC<{ protocol: Protocol; onEdit: (protocol: Protocol) => void; onDelete: (id: number) => void }> = ({ protocol, onEdit, onDelete }) => {
//   return (
//     <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
//       {/* Content */}
//       <div className="flex-1 space-y-2">
//         <div>
//           <h3 className="text-lg font-bold text-slate-800 leading-tight">{protocol.title}</h3>
//           <p className="text-sm text-slate-500 mt-1">{protocol.description}</p>
//         </div>
//         <div className="flex flex-wrap gap-2 pt-1">
//           <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${protocol.categoryColor}`}>
//             {protocol.category}
//           </span>
//           <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-sky-100 text-sky-600">
//             {protocol.rootCausesCount} Root causes
//           </span>
//           <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
//             {protocol.supplementsCount} supplements
//           </span>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex items-center gap-4 mt-4 sm:mt-0 sm:ml-6">
//         <button onClick={() => onEdit(protocol)} className="text-indigo-400 hover:text-indigo-600 transition-colors p-1">
//           <Pencil size={20} />
//         </button>
//         <button onClick={() => onDelete(protocol.id)} className="text-rose-400 hover:text-rose-600 transition-colors p-1">
//           <Trash2 size={20} />
//         </button>
//       </div>
//     </div>
//   );
// };

// const ProtocolList: React.FC = () => {
//   // 🔹 JSON Data directly inside the component
//   const initialProtocols: Protocol[] = [
//     { id: 1, title: 'Gut Healing Protocol', description: 'Comprehensive gut healing approach', category: 'Gut Health', rootCausesCount: 4, supplementsCount: 2, categoryColor: 'bg-indigo-50 text-indigo-500' },
//     { id: 2, title: 'Methylation Support', description: 'Comprehensive detoxification support', category: 'Detoxification', rootCausesCount: 3, supplementsCount: 1, categoryColor: 'bg-purple-50 text-purple-500' },
//     { id: 3, title: 'Immune Support Protocol', description: 'Supports overall immunity', category: 'Immune Support', rootCausesCount: 2, supplementsCount: 2, categoryColor: 'bg-fuchsia-50 text-fuchsia-500' },
//   ];

//   const [protocols, setProtocols] = useState<Protocol[]>(initialProtocols);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);

//   // Add new protocol
//   const handleAdd = () => {
//     setSelectedProtocol(null);
//     setIsModalOpen(true);
//   };

//   // Edit protocol
//   const handleEdit = (protocol: Protocol) => {
//     setSelectedProtocol(protocol);
//     setIsModalOpen(true);
//   };

//   // Delete protocol
//   const handleDelete = (id: number) => {
//     if (confirm('Are you sure you want to delete this protocol?')) {
//       setProtocols((prev) => prev.filter((p) => p.id !== id));
//     }
//   };

//   // Save from modal
//   const handleSave = (protocolData: { title: string; category: string; description: string }) => {
//     if (selectedProtocol) {
//       // Edit existing
//       setProtocols((prev) =>
//         prev.map((p) =>
//           p.id === selectedProtocol.id ? { ...p, ...protocolData } : p
//         )
//       );
//     } else {
//       // Add new
//       const newProtocol: Protocol = {
//         ...protocolData,
//         id: protocols.length ? Math.max(...protocols.map(p => p.id)) + 1 : 1,
//         rootCausesCount: 0,
//         supplementsCount: 0,
//         categoryColor:
//           protocolData.category === "Gut Health" ? "bg-indigo-50 text-indigo-500" :
//           protocolData.category === "Detoxification" ? "bg-purple-50 text-purple-500" :
//           protocolData.category === "Immune Support" ? "bg-fuchsia-50 text-fuchsia-500" :
//           "bg-emerald-50 text-emerald-500"
//       };
//       setProtocols((prev) => [...prev, newProtocol]);
//     }
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="my-8 bg-white p-2.5 md:p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//       <div className="flex items-center justify-between mb-5">
//         <h2 className="text-lg font-semibold text-textColor">Protocols</h2>
//         <button
//           onClick={handleAdd}
//           className="bg-violet-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-violet-700"
//         >
//           <Plus className="w-5 h-5" />
//           Add New
//         </button>
//       </div>

//       {protocols.length === 0 ? (
//         <div className="text-center py-12 text-gray-400">No protocols found</div>
//       ) : (
//         protocols.map((p) => (
//           <ProtocolItem key={p.id} protocol={p} onEdit={handleEdit} onDelete={handleDelete} />
//         ))
//       )}

//       {isModalOpen && (
//         <AddProtocolModal
//           mode={selectedProtocol ? 'edit' : 'add'}
//           initialData={selectedProtocol}
//           onClose={() => setIsModalOpen(false)}
//           onSave={handleSave}
//         />
//       )}
//     </div>
//   );
// };

// export default ProtocolList;





// import React, { useState } from 'react';
// import { Pencil, Plus, Trash2 } from 'lucide-react'; 
// import AddProtocolModal from './AddProtocolModal';
// // 1. Define the Protocol Interface
// interface Protocol {
//   id: string;
//   title: string;
//   description: string;
//   category: string;
//   rootCausesCount: number;
//   supplementsCount: number;
//   categoryColor: string; // Tailwind class for the first badge color
// }

// // 2. Protocol Item Component
// const ProtocolItem: React.FC<{ protocol: Protocol }> = ({ protocol }) => {
  
//   return (
//     <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
 
//       {/* Content Section */}
//       <div className="flex-1 space-y-2">
//         <div>
//           <h3 className="text-lg font-bold text-slate-800 leading-tight">
//             {protocol.title}
//           </h3>
//           <p className="text-sm text-slate-500 mt-1">
//             {protocol.description}
//           </p>
//         </div>

//         {/* Badges Section - Responsive Wrap */}
//         <div className="flex flex-wrap gap-2 pt-1">
//           <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${protocol.categoryColor}`}>
//             {protocol.category}
//           </span>
//           <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-sky-100 text-sky-600">
//             {protocol.rootCausesCount} Root causes
//           </span>
//           <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
//             {protocol.supplementsCount} supplements
//           </span>
//         </div>
//       </div>

//       {/* Actions Section */}
//       <div className="flex items-center gap-4 mt-4 sm:mt-0 sm:ml-6">
//         <button className="text-indigo-400 hover:text-indigo-600 transition-colors p-1">
//           <Pencil size={20} />
//         </button>
//         <button className="text-rose-400 hover:text-rose-600 transition-colors p-1">
//           <Trash2 size={20} />
//         </button>
//       </div>
//     </div>
//   );
// };

// // 3. Main Container Component
// const ProtocolList: React.FC = () => {
//   const protocols: Protocol[] = [
//     {
//       id: '1',
//       title: 'Gut Healing Protocol',
//       description: 'Comprehensive gut healing approach',
//       category: 'Gut health',
//       rootCausesCount: 4,
//       supplementsCount: 2,
//       categoryColor: 'bg-indigo-50 text-indigo-500',
//     },
//     {
//       id: '2',
//       title: 'Methylation Support',
//       description: 'Comprehensive gut healing approach',
//       category: 'Detoxification',
//       rootCausesCount: 4,
//       supplementsCount: 2,
//       categoryColor: 'bg-purple-50 text-purple-500',
//     },
//     {
//       id: '3',
//       title: 'Immune Support Protocol',
//       description: 'Comprehensive gut healing approach',
//       category: 'Immune Support',
//       rootCausesCount: 4,
//       supplementsCount: 2,
//       categoryColor: 'bg-fuchsia-50 text-fuchsia-500',
//     },
//   ];

//     const [isModalOpen, setIsModalOpen] = useState(false);
//         const [selectedSupplement, setSelectedSupplement] =
//       useState<Supplement | null>(null);
  
//         const handleAdd = () => {
//       setSelectedSupplement(null); 
//       setIsModalOpen(true);
//     };
  
//        const handleEdit = (supplement: Supplement) => {
//       setSelectedSupplement(supplement); 
//       setIsModalOpen(true);
//     };

//   return (
//     <div className=" my-8 bg-white p-2.5 md:p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//                <div className="flex items-center justify-between mb-5">
//         <h2 className="text-lg font-semibold text-textColor">
//          Protocol
//         </h2>

//              <button
//            onClick={handleAdd}
//             className="bg-violet-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer"
//           >
//             <Plus className="w-5 h-5" />
//             Add New
//           </button>
//       </div>
      
//       {protocols.map((p) => (
//         <ProtocolItem key={p.id} protocol={p} />
//       ))}

//              {isModalOpen && (
//         <AddProtocolModal
//           mode={selectedSupplement ? "edit" : "add"}
//           initialData={selectedSupplement}
//           onClose={() => setIsModalOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default ProtocolList;