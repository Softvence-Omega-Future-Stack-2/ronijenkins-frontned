import { useState } from "react";
import { Trash2 } from "lucide-react";
import AddEditInspirationModal from "./AddEditInspirationModal";

import {
  useGetInspirationsQuery,
  useCreateInspirationMutation,
  useUpdateInspirationMutation,
  useDeleteInspirationMutation,
} from "../../redux/features/admin/content/inspirationApi";

import DeleteConfirmationModal from "./DeleteInspirationMOdal";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 6;

interface InspirationItem {
  id: number;
  inspiration: string;
}

export default function DailyInspirationList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InspirationItem | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const { data, isLoading, isError } = useGetInspirationsQuery({
    page: currentPage,
    ordering: "",
    search: "",
  });

  const [createInspiration, { isLoading: isCreating }] = useCreateInspirationMutation();
  const [updateInspiration, { isLoading: isUpdating }] = useUpdateInspirationMutation();
  const [deleteInspiration, { isLoading: isDeleting }] = useDeleteInspirationMutation();

  const items: InspirationItem[] = data?.results ?? [];
  const totalCount: number = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const handleOpenAdd = () => {
    setEditingItem(null);
    setAddEditOpen(true);
  };

  const handleOpenEdit = (item: InspirationItem) => {
    setEditingItem(item);
    setAddEditOpen(true);
  };

 
  const handleSave = async (description: string) => {
    try {
      if (editingItem) {
        await updateInspiration({
          id: editingItem.id,
          inspiration: description, 
        }).unwrap();
        toast.success("Inspiration updated successfully!" , {position: "top-right"});
      } else {
        await createInspiration({
          inspiration: description, 
        }).unwrap();
        toast.success("Inspiration added successfully!" , {position: "top-right"});
        const newTotal = totalCount + 1;
        setCurrentPage(Math.ceil(newTotal / ITEMS_PER_PAGE));
      }
      setAddEditOpen(false); 
    } catch (err: any) {
      console.error("Save error:", err); 
      const msg =
        err?.data?.detail ||
        err?.data?.inspiration?.[0] ||
        err?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(msg , {position: "top-right"});
    }
  };

  const handleOpenDelete = (id: number) => {
    setDeleteTargetId(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId === null) return;
    try {
      await deleteInspiration(deleteTargetId).unwrap();
      toast.success("Inspiration deleted successfully!" , {position: "top-right"});
      const newTotalPages = Math.max(1, Math.ceil((totalCount - 1) / ITEMS_PER_PAGE));
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
      setDeleteOpen(false);
      setDeleteTargetId(null);
    } catch (err: any) {
      console.error("Delete error:", err);
      const msg =
        err?.data?.detail ||
        err?.data?.message ||
        "Failed to delete. Please try again.";
      toast.error(msg , {position: "top-right"});
      setDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      )
        pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>


      <div className="flex items-center justify-center font-sans">
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6">

            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            )}

            {isError && !isLoading && (
              <div className="text-center py-16">
                <p className="text-red-400 text-sm font-medium">
                  Failed to load inspirations. Please refresh.
                </p>
              </div>
            )}

            {!isLoading && !isError && items.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-400 text-sm">No inspirations yet. Add your first one!</p>
              </div>
            )}

            {!isLoading && !isError && items.length > 0 && (
              <div className="space-y-1">
                {items.map((item, index) => {
                  const globalIndex = startIndex + index + 1;
                  return (
                    <div
                      key={item.id}
                      className="rounded-xl px-4 py-3 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">
                            {globalIndex}. {item.inspiration}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="text-indigo-400 hover:text-indigo-600 transition-colors p-1 cursor-pointer"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
                              <path d="M13.2599 3.60022L5.04985 12.2902C4.73985 12.6202 4.43985 13.2702 4.37985 13.7202L4.00985 16.9602C3.87985 18.1302 4.71985 18.9302 5.87985 18.7302L9.09985 18.1802C9.54985 18.1002 10.1799 17.7702 10.4899 17.4302L18.6999 8.74022C20.1199 7.24022 20.7599 5.53022 18.5499 3.44022C16.3499 1.37022 14.6799 2.10022 13.2599 3.60022Z" stroke="#8571EC" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M11.8901 5.0498C12.3201 7.8098 14.5601 9.9198 17.3401 10.1998" stroke="#8571EC" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M3 22H21" stroke="#8571EC" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleOpenDelete(item.id)}
                            className="text-red-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-5">
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors shadow-sm hover:shadow-md cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add New
              </button>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Previous
              </button>

              {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                  <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-sm text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${page}`}
                    onClick={() => setCurrentPage(page as number)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-indigo-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <AddEditInspirationModal
        isOpen={addEditOpen}
        onClose={() => setAddEditOpen(false)}
        onSave={handleSave}
        editItem={editingItem}
        isSaving={isCreating || isUpdating}
      />

      <DeleteConfirmationModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
