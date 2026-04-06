import { useState } from "react";
import { FileText, Video, Trash2, Clock, Search, Plus, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useDeleteContentMutation,
  useGetAllContentsQuery,
  type ContentItem,
} from "../../redux/features/admin/content/contentApi";
import { toast } from "react-toastify";


type TabKey = "all" | "articles" | "video-guides";

const tabs: { key: TabKey; label: string }[] = [
  { key: "all",          label: "ALL CONTENT"  },
  { key: "articles",     label: "ARTICLES"     },
  { key: "video-guides", label: "VIDEO GUIDES" },
];

// ✅ uppercase — must match ContentItem["type"] exactly
const filterMap: Record<TabKey, ContentItem["type"][]> = {
  all:           ["ARTICLE", "VIDEO"],
  articles:      ["ARTICLE"],
  "video-guides":["VIDEO"],
};

// ─── Content Card ─────────────────────────────────────────────────────────────
function ContentCard({
  item,
  onDelete,
}: {
  item: ContentItem;
  onDelete: (id: string) => void;
}) {
  const navigate = useNavigate();
  const isMedia = item.type === "VIDEO";

  return (
    <div className="bg-[#FAF7F5] rounded-2xl md:rounded-4xl p-5 border border-borderColor shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isMedia ? "bg-[#FAF5FF] border border-[#F3E8FF]" : "bg-[#EFF6FF] border border-[#DBEAFE]"}`}>
          {isMedia
            ? <Video size={20} className="text-[#9810FA]" />
            : <FileText size={20} className="text-[#155DFC]" />
          }
        </div>
        <span className={`text-xs font-bold tracking-wider rounded-full py-2 px-4 ${
          item.status === "PUBLISHED"
            ? "text-[#00A63E] border border-[#DCFCE7] bg-[#F0FDF4]"
            : "text-[#F54900] bg-[#FFF7ED] border border-borderColor"
        }`}>
          {item.status}
        </span>
      </div>

      <div className="border-b border-borderColor pb-5">
        {/* ✅ item.name — ContentItem has `name`, not `title` */}
        <h3 className="font-extrabold text-base md:text-lg text-titleColor leading-6 mt-2">
          {item.name}
        </h3>
        <p className="text-[11px] text-subTitleColor font-extrabold tracking-wide mt-1">
          {item.category}
        </p>
      </div>

      <div className="flex justify-between items-center mt-auto pt-2 border-t border-[#f5f3ff]">
        <div className="flex items-center gap-1">
          <Clock size={13} className="text-[#b0a8cc]" />
          {/* ✅ item.createdAt — ContentItem has createdAt */}
          <span className="text-[10px] text-[#4A3A3766] font-bold">
            {item.createdAt?.slice(0, 10)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/dashboard/edit-content/${item.id}`)}
            className="py-2 px-3 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <g clipPath="url(#clip0_211_12122)">
                <path d="M7.99138 1.9978H3.3299C2.97667 1.9978 2.63791 2.13812 2.38814 2.38789C2.13837 2.63766 1.99805 2.97642 1.99805 3.32965V12.6526C1.99805 13.0058 2.13837 13.3446 2.38814 13.5944C2.63791 13.8441 2.97667 13.9845 3.3299 13.9845H12.6529C13.0061 13.9845 13.3448 13.8441 13.5946 13.5944C13.8444 13.3446 13.9847 13.0058 13.9847 12.6526V7.99113" stroke="#4A3A37" strokeOpacity="0.4" strokeWidth="1.33185" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.2368 1.74798C12.5018 1.48306 12.8611 1.33423 13.2357 1.33423C13.6104 1.33423 13.9697 1.48306 14.2346 1.74798C14.4995 2.0129 14.6484 2.37221 14.6484 2.74687C14.6484 3.12153 14.4995 3.48084 14.2346 3.74576L8.23263 9.74841C8.0745 9.9064 7.87916 10.022 7.66459 10.0847L5.75139 10.6441C5.69409 10.6608 5.63334 10.6618 5.57552 10.647C5.5177 10.6322 5.46492 10.6021 5.42272 10.5599C5.38051 10.5177 5.35043 10.4649 5.33561 10.4071C5.3208 10.3492 5.3218 10.2885 5.33851 10.2312L5.89789 8.318C5.96084 8.10361 6.07671 7.9085 6.23485 7.75063L12.2368 1.74798Z" stroke="#4A3A37" strokeOpacity="0.4" strokeWidth="1.33185" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
            </svg>
          </button>
          <button onClick={() => onDelete(item.id)} className="cursor-pointer">
            <Trash2 size={14} className="text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ContentSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-[#FAF7F5] rounded-2xl md:rounded-4xl p-5 border border-borderColor animate-pulse">
          <div className="flex justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-gray-200" />
            <div className="h-7 w-20 rounded-full bg-gray-200" />
          </div>
          <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-1/3 bg-gray-200 rounded mb-6" />
          <div className="h-px bg-gray-200 mb-4" />
          <div className="flex justify-between">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-5 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({
  currentPage,
  totalPage,
  onPageChange,
}: {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPage <= 1) return null;
  const pages = Array.from({ length: totalPage }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl border border-borderColor bg-white disabled:opacity-40 cursor-pointer hover:bg-gray-50 transition-all"
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            currentPage === page
              ? "bg-buttonColor text-white border border-buttonColor"
              : "border border-borderColor bg-white text-subTitleColor hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPage}
        className="p-2 rounded-xl border border-borderColor bg-white disabled:opacity-40 cursor-pointer hover:bg-gray-50 transition-all"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ContentCMS() {
  const [activeTab, setActiveTab]   = useState<TabKey>("all");
  const [search, setSearch]         = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId]     = useState<string | null>(null);
  const LIMIT = 5;
  const navigate = useNavigate();

const { data: result, isLoading, isFetching, isError } = useGetAllContentsQuery(
  { page: currentPage, limit: LIMIT },
);
console.log('🔍 currentPage:', currentPage, '| isFetching:', isFetching, '| data count:', result?.data?.length);

// isFetching দিয়ে page change এর সময় loading দেখান

  const [deleteContent] = useDeleteContentMutation();

  const handleDeleteClick = (id: string) => setDeleteId(id);
  const cancelDelete      = ()            => setDeleteId(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteContent(deleteId).unwrap();
      toast.success("Content deleted successfully!", { position: "top-right" });
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete content", { position: "top-right" });
    }
  };

  // ✅ Use data directly — no remapping needed
  // rawContents is already ContentItem[] from the API
  const rawContents: ContentItem[] = result?.data ?? [];
  const meta = result?.meta ?? { page: 1, limit: LIMIT, total: 0, totalPage: 1 };

  // ✅ Filter: type is already uppercase ("ARTICLE" | "VIDEO"), search by item.name
  const filtered = rawContents.filter(
    (item) =>
      filterMap[activeTab].includes(item.type) &&
      (item.name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-titleColor text-xl sm:text-2xl md:text-[30px] font-extrabold leading-6 md:leading-[36px]">
            Content CMS
          </h1>
          <p className="text-subTitleColor text-sm font-medium leading-5 mt-0.5">
            Manage articles, videos, and guides
            {meta.total > 0 && (
              <span className="ml-2 text-buttonColor font-bold">({meta.total} total)</span>
            )}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center gap-4">
          <div className="flex items-center gap-2 bg-white border border-borderColor w-full sm:w-auto px-2 py-3 rounded-2xl">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search library..."
              className="outline-none text-sm bg-transparent w-full"
            />
          </div>
          <button
            onClick={() => navigate("/dashboard/create-content")}
            className="flex w-full sm:w-auto md:w-full lg:w-auto justify-center items-center gap-2 bg-buttonColor font-extrabold px-6 py-3 text-white rounded-2xl cursor-pointer"
          >
            <Plus size={14} /> ADD NEW CONTENT
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-2 mb-6 w-full">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
            className={`px-9 py-4 rounded-full text-xs font-extrabold leading-4 tracking-[1px] transition-all cursor-pointer ${
              activeTab === tab.key
                ? "border border-[#9266904D] text-buttonColor"
                : "border border-[#ECC3B44D] text-[#4A3A374D]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="bg-white rounded-2xl md:rounded-[40px] p-3 md:p-8 border border-borderColor">
        {(isLoading || isFetching) ? (
  <ContentSkeleton />
) : isError ? (
          <div className="text-center text-red-400 py-12 text-sm">
            Failed to load content. Please try again.
          </div>
        ) : filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((item) => (
                <ContentCard key={item.id} item={item} onDelete={handleDeleteClick} />
              ))}
            </div>
           <Pagination
  currentPage={currentPage}   // ← state থেকে নিন, meta থেকে না
  totalPage={meta.totalPage}
  onPageChange={handlePageChange}
/>
          </>
        ) : (
          <div className="text-center text-[#c4b8e8] py-12 text-sm">
            No content found.
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div
          onClick={cancelDelete}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg"
          >
            <div className="flex items-center justify-end mb-2 cursor-pointer" onClick={cancelDelete}>
              <X />
            </div>
            <h2 className="text-lg font-extrabold text-titleColor text-center mb-3">
              Confirm Delete
            </h2>
            <p className="text-sm text-center text-gray-700 mb-6">
              Are you sure you want to delete this content?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 hover:bg-gray-100 rounded-md border border-borderColor text-sm font-semibold cursor-pointer"
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm font-semibold cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}




// import { useState } from "react";
// import { FileText, Video, Trash2, Clock, Search, Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useContentStore, contentStore, type ContentType, type ContentItem, 
  
//  } from "./contentStore";

// type TabKey = "all" | "articles" | "video-guides" | "audio";

// const tabs: { key: TabKey; label: string }[] = [
//   { key: "all", label: "ALL CONTENT" },
//   { key: "articles", label: "ARTICLES" },
//   { key: "video-guides", label: "VIDEO GUIDES" },
//   { key: "audio", label: "AUDIO" },
// ];

// const filterMap: Record<TabKey, ContentType[]> = {
//   all: ["article", "video", "audio"],
//   articles: ["article"],
//   "video-guides": ["video"],
//   audio: ["audio"],
// };

// function ContentCard({ item }: { item: ContentItem }) {
//   const navigate = useNavigate();

//   return (
//     <div className="bg-[#FAF7F5] rounded-2xl md:rounded-4xl p-5 border border-borderColor shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-3">

//       {/* Top */}
//       <div className="flex justify-between items-start">
//         <div
//           className={`w-10 h-10 rounded-lg flex items-center justify-center p-2
//             ${item.type === "video" || item.type === "audio"
//               ? "bg-[#FAF5FF] border border-[#F3E8FF]"
//               : "bg-[#EFF6FF] border border-[#DBEAFE]"}`}
//         >
//           {item.type === "video" || item.type === "audio" ? (
//             <Video size={20} className="text-[#9810FA]" />
//           ) : (
//             <FileText size={20} className="text-[#155DFC]" />
//           )}
//         </div>

//         <span
//           className={`text-xs font-bold tracking-wider rounded-full py-2 px-4 ${
//             item.status === "PUBLISHED"
//               ? "text-[#00A63E] border border-[#DCFCE7] bg-[#F0FDF4]"
//               : "text-[#F54900] bg-[#FFF7ED] border border-borderColor"
//           }`}
//         >
//           {item.status}
//         </span>
//       </div>

//       {/* Title */}
//       <div className="border-b border-borderColor pb-5">
//         <h3 className="font-extrabold text-base md:text-lg text-titleColor leading-6 mt-2">
//           {item.title}
//         </h3>
//         <p className="text-[11px] text-subTitleColor font-extrabold tracking-wide mt-1">
//           {item.category}
//         </p>
//       </div>

//       {/* Footer */}
//       <div className="flex justify-between items-center mt-auto pt-2 border-t border-[#f5f3ff]">
//         <div className="flex items-center gap-3 text-xs text-[#b0a8cc]">
//           <div className="flex items-center gap-1">
//             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
//               <g clipPath="url(#clip0_211_11946)">
//                 <path d="M12.8187 6.99213H11.3737C11.119 6.99159 10.8712 7.07447 10.6681 7.2281C10.465 7.38173 10.3178 7.59766 10.2491 7.84285L8.87978 12.7141C8.87096 12.7444 8.85256 12.7709 8.82734 12.7898C8.80213 12.8088 8.77146 12.819 8.73994 12.819C8.70842 12.819 8.67775 12.8088 8.65254 12.7898C8.62732 12.7709 8.60892 12.7444 8.6001 12.7141L5.38368 1.27017C5.37485 1.23991 5.35645 1.21333 5.33123 1.19442C5.30602 1.17551 5.27535 1.16528 5.24383 1.16528C5.21231 1.16528 5.18164 1.17551 5.15643 1.19442C5.13121 1.21333 5.11281 1.23991 5.10399 1.27017L3.73468 6.14141C3.66619 6.38565 3.51989 6.60087 3.31798 6.7544C3.11607 6.90794 2.86958 6.9914 2.61592 6.99213H1.16504" stroke="#4A3A37" strokeOpacity="0.4" strokeWidth="1.16537" strokeLinecap="round" strokeLinejoin="round"/>
//               </g>
//             </svg>
//             <span className="text-[10px] text-[#4A3A3766] font-bold leading-4">{item.views}</span>
//           </div>

//           {item.date && (
//             <div className="flex items-center gap-1">
//               <Clock size={13} />
//               <span className="text-[10px] text-[#4A3A3766] font-bold leading-4">{item.date}</span>
//             </div>
//           )}

//           {item.inReview && (
//             <span className="text-[10px] text-[#4A3A3766] font-bold leading-4">In Review</span>
//           )}
//         </div>

//         <div className="flex items-center gap-2 text-[#c4b8e8]">
//           {/* View button */}
//           <button className="h-6 w-6 cursor-pointer">
//             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
//               <g clipPath="url(#clip0_211_12118)">
//                 <path d="M1.37268 8.22289C1.31718 8.07338 1.31718 7.90891 1.37268 7.7594C1.91321 6.44877 2.83073 5.32814 4.00892 4.53959C5.18712 3.75104 6.57292 3.33008 7.99065 3.33008C9.40837 3.33008 10.7942 3.75104 11.9724 4.53959C13.1506 5.32814 14.0681 6.44877 14.6086 7.7594C14.6641 7.90891 14.6641 8.07338 14.6086 8.22289C14.0681 9.53353 13.1506 10.6542 11.9724 11.4427C10.7942 12.2313 9.40837 12.6522 7.99065 12.6522C6.57292 12.6522 5.18712 12.2313 4.00892 11.4427C2.83073 10.6542 1.91321 9.53353 1.37268 8.22289Z" stroke="#4A3A37" strokeOpacity="0.4" strokeWidth="1.33185" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M7.99094 9.98896C9.09428 9.98896 9.98872 9.09453 9.98872 7.99118C9.98872 6.88784 9.09428 5.99341 7.99094 5.99341C6.8876 5.99341 5.99316 6.88784 5.99316 7.99118C5.99316 9.09453 6.8876 9.98896 7.99094 9.98896Z" stroke="#4A3A37" strokeOpacity="0.4" strokeWidth="1.33185" strokeLinecap="round" strokeLinejoin="round"/>
//               </g>
//             </svg>
//           </button>

//           {/* Edit button */}
//           <button
//             onClick={() => navigate(`/dashboard/edit-content/${item.id}`)}
//             className="py-2 px-4 cursor-pointer"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
//               <g clipPath="url(#clip0_211_12122)">
//                 <path d="M7.99138 1.9978H3.3299C2.97667 1.9978 2.63791 2.13812 2.38814 2.38789C2.13837 2.63766 1.99805 2.97642 1.99805 3.32965V12.6526C1.99805 13.0058 2.13837 13.3446 2.38814 13.5944C2.63791 13.8441 2.97667 13.9845 3.3299 13.9845H12.6529C13.0061 13.9845 13.3448 13.8441 13.5946 13.5944C13.8444 13.3446 13.9847 13.0058 13.9847 12.6526V7.99113" stroke="#4A3A37" strokeOpacity="0.4" strokeWidth="1.33185" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M12.2368 1.74798C12.5018 1.48306 12.8611 1.33423 13.2357 1.33423C13.6104 1.33423 13.9697 1.48306 14.2346 1.74798C14.4995 2.0129 14.6484 2.37221 14.6484 2.74687C14.6484 3.12153 14.4995 3.48084 14.2346 3.74576L8.23263 9.74841C8.0745 9.9064 7.87916 10.022 7.66459 10.0847L5.75139 10.6441C5.69409 10.6608 5.63334 10.6618 5.57552 10.647C5.5177 10.6322 5.46492 10.6021 5.42272 10.5599C5.38051 10.5177 5.35043 10.4649 5.33561 10.4071C5.3208 10.3492 5.3218 10.2885 5.33851 10.2312L5.89789 8.318C5.96084 8.10361 6.07671 7.9085 6.23485 7.75063L12.2368 1.74798Z" stroke="#4A3A37" strokeOpacity="0.4" strokeWidth="1.33185" strokeLinecap="round" strokeLinejoin="round"/>
//               </g>
//             </svg>
//           </button>

//           {/* Delete button */}
//           <button
//             onClick={() => contentStore.delete(item.id)}
//             className="cursor-pointer"
//           >
//             <Trash2 size={14} className="text-red-400" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function ContentCMS() {
//   const [activeTab, setActiveTab] = useState<TabKey>("all");
//   const [search, setSearch] = useState("");
//   const navigate = useNavigate();

//   // ✅ Store থেকে live data নেয় — add/edit/delete এ auto update হবে
//   const allContent = useContentStore();

//   const filtered = allContent.filter(
//     (item) =>
//       filterMap[activeTab].includes(item.type) &&
//       item.title.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen p-4 md:p-8">
//       <div className="">

//         {/* Header */}
//         <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-between items-center mb-8 gap-4">
//           <div>
//             <h1 className="text-titleColor text-xl sm:text-2xl md:text-[30px] font-extrabold leading-6 md:leading-[36px]">
//               Content CMS
//             </h1>
//             <p className="text-subTitleColor text-sm font-medium leading-5 mt-0.5">
//               Manage articles, videos, and guides
//             </p>
//           </div>

//           <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center gap-4">
//             <div className="flex items-center gap-2 bg-white border border-borderColor w-full sm:w-auto justify-center px-2 py-3 rounded-2xl cursor-pointer">
//               <Search size={15} className="text-gray-400" />
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search library..."
//                 className="outline-none text-sm bg-transparent w-full"
//               />
//             </div>

//             <button
//               onClick={() => navigate('/dashboard/create-content')}
//               className="flex w-full sm:w-auto md:w-full lg:w-auto justify-center items-center gap-2 bg-buttonColor font-extrabold px-6 py-3 text-white rounded-2xl cursor-pointer"
//             >
//               <Plus size={14} />
//               ADD NEW CONTENT
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-2 mb-6 w-full">
//           {tabs.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               className={`px-9 py-4 rounded-full text-xs font-extrabold leading-4 tracking-[1px] transition-all cursor-pointer ${
//                 activeTab === tab.key
//                   ? "border border-[#9266904D] text-buttonColor"
//                   : "border border-[#ECC3B44D] text-[#4A3A374D]"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Grid */}
//         <div className="bg-white rounded-2xl md:rounded-[40px] p-3 md:p-8 border border-borderColor">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {filtered.length > 0 ? (
//               filtered.map((item) => (
//                 <ContentCard key={item.id} item={item} />
//               ))
//             ) : (
//               <div className="col-span-full text-center text-[#c4b8e8] py-12 text-sm">
//                 No content found.
//               </div>
//             )}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }






// import { useState } from "react";
// import {
//   FileText,
//   Video,


//   Trash2,

//   Clock,
//   Search,
//   Plus,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// type ContentStatus = "PUBLISHED" | "DRAFT";
// type ContentType = "article" | "video" | "audio";
// type TabKey = "all" | "articles" | "video-guides" | "audio";

// interface ContentItem {
//   id: number;
//   title: string;
//   category: string;
//   status: ContentStatus;
//   type: ContentType;
//   views: string;
//   date: string;
//   inReview?: boolean;
//   assignees?: { name: string; color: string }[];
// }

// const allContent: ContentItem[] = [
//   {
//     id: 1,
//     title: "Managing Night Sweats",
//     category: "SYMPTOM RELIEF",
//     status: "PUBLISHED",
//     type: "article",
//     views: "12.4k",
//     date: "Feb 12, 2026",
//   },
//   {
//     id: 2,
//     title: "10-Minute Evening audio",
//     category: "MENTAL HEALTH",
//     status: "PUBLISHED",
//     type: "audio",
//     views: "8.2k",
//     date: "Feb 10, 2026",
//   },
//   {
//     id: 3,
//     title: "Hormone Replacement Therapy 101",
//     category: "MEDICAL",
//     status: "DRAFT",
//     type: "article",
//     views: "-",
//     date: "",
//     inReview: true,
//   },
//   {
//     id: 4,
//     title: "Nutrition for Menopause",
//     category: "WELLNESS",
//     status: "PUBLISHED",
//     type: "article",
//     views: "15.1k",
//     date: "Jan 28, 2026",
//   },
//   {
//     id: 5,
//     title: "Strength Training Guide",
//     category: "FITNESS",
//     status: "PUBLISHED",
//     type: "video",
//     views: "5.6k",
//     date: "Feb 01, 2026",
//   },
// ];

// // const [isAllContent, setIsAllContent] = useState(allContent);

// //   // Notun content add korar function
// //   const handleAddContent = (newContent:any) => {
// //     setIsAllContent([newContent, ...allContent]);
// //   };


// const tabs: { key: TabKey; label: string }[] = [
//   { key: "all", label: "ALL CONTENT" },
//   { key: "articles", label: "ARTICLES" },
//   { key: "video-guides", label: "VIDEO GUIDES" },
//   { key: "audio", label: "audio" },
// ];

// const filterMap: Record<TabKey, ContentType[]> = {
//   all: ["article", "video", "audio"],
//   articles: ["article"],
//   "video-guides": ["video"],
//   audio: ["audio"],
// };

// function ContentCard({ item }: { item: ContentItem }) {
//     const navigate = useNavigate()
//   return (
//     <div className="bg-[#FAF7F5] rounded-2xl md:rounded-4xl p-5 border border-borderColor shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-3">

//       {/* Top */}
//       <div className="flex justify-between items-start">
//     <div
//   className={`
//     w-10 h-10 rounded-lg flex items-center justify-center p-2
//     ${item.type === "video" || item.type === "audio" 
//         ? "bg-[#FAF5FF] border border-[#F3E8FF]" 
//         : "bg-[#EFF6FF] border border-[#DBEAFE]"}
//   `}
// >
//   {item.type === "video" || item.type === "audio" ? (
//     <Video size={20} className="text-[#9810FA]" />
//   ) : (
//     <FileText size={20} className="text-[#155DFC]" />
//   )}
// </div>

//         <span
//           className={`text-xs font-bold tracking-wider rounded-full py-2 px-4 ${
//             item.status === "PUBLISHED"
//               ? "text-[#00A63E] border border-[#DCFCE7] bg-[#F0FDF4] "
//               : "text-[#F54900] bg-[#FFF7ED] border border-borderColor"
//           }`}
//         >
//           {item.status}
//         </span>
//       </div>

//       {/* Title */}
//       <div className=" border-b border-borderColor pb-5">
//         <h3 className="font-extrabold text-base md:text-lg text-titleColor leading-6 mt-2">
//           {item.title}
//         </h3>

//         <p className="text-[11px] text-subTitleColor font-extrabold tracking-wide mt-1">
//           {item.category}
//         </p>
//       </div>

//       {/* Footer */}
//       <div className="flex justify-between items-center mt-auto pt-2 border-t border-[#f5f3ff]">

//         <div className="flex items-center gap-3 text-xs text-[#b0a8cc]">

//           <div className="flex items-center gap-1">
//             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
//   <g clip-path="url(#clip0_211_11946)">
//     <path d="M12.8187 6.99213H11.3737C11.119 6.99159 10.8712 7.07447 10.6681 7.2281C10.465 7.38173 10.3178 7.59766 10.2491 7.84285L8.87978 12.7141C8.87096 12.7444 8.85256 12.7709 8.82734 12.7898C8.80213 12.8088 8.77146 12.819 8.73994 12.819C8.70842 12.819 8.67775 12.8088 8.65254 12.7898C8.62732 12.7709 8.60892 12.7444 8.6001 12.7141L5.38368 1.27017C5.37485 1.23991 5.35645 1.21333 5.33123 1.19442C5.30602 1.17551 5.27535 1.16528 5.24383 1.16528C5.21231 1.16528 5.18164 1.17551 5.15643 1.19442C5.13121 1.21333 5.11281 1.23991 5.10399 1.27017L3.73468 6.14141C3.66619 6.38565 3.51989 6.60087 3.31798 6.7544C3.11607 6.90794 2.86958 6.9914 2.61592 6.99213H1.16504" stroke="#4A3A37" stroke-opacity="0.4" stroke-width="1.16537" stroke-linecap="round" stroke-linejoin="round"/>
//   </g>
//   <defs>
//     <clipPath id="clip0_211_11946">
//       <rect width="13.9844" height="13.9844" fill="white"/>
//     </clipPath>
//   </defs>
// </svg>
//             <span className="text-[10px] text-[#4A3A3766] font-bold leading-4">{item.views}</span>
//           </div>

//           {item.date && (
//             <div className="flex items-center gap-1">
//               <Clock size={13} />
//               <span className="text-[10px] text-[#4A3A3766] font-bold leading-4">{item.date}</span>
//             </div>
//           )}

//           {item.inReview && (
            
//             <span className="text-[10px] text-[#4A3A3766] font-bold leading-4">In Review</span>
//           )}
//         </div>

//         <div className="flex items-center gap-2 text-[#c4b8e8]">
//           <button className="h-6 w-6 cursor-pointer">
//             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
//   <g clip-path="url(#clip0_211_12118)">
//     <path d="M1.37268 8.22289C1.31718 8.07338 1.31718 7.90891 1.37268 7.7594C1.91321 6.44877 2.83073 5.32814 4.00892 4.53959C5.18712 3.75104 6.57292 3.33008 7.99065 3.33008C9.40837 3.33008 10.7942 3.75104 11.9724 4.53959C13.1506 5.32814 14.0681 6.44877 14.6086 7.7594C14.6641 7.90891 14.6641 8.07338 14.6086 8.22289C14.0681 9.53353 13.1506 10.6542 11.9724 11.4427C10.7942 12.2313 9.40837 12.6522 7.99065 12.6522C6.57292 12.6522 5.18712 12.2313 4.00892 11.4427C2.83073 10.6542 1.91321 9.53353 1.37268 8.22289Z" stroke="#4A3A37" stroke-opacity="0.4" stroke-width="1.33185" stroke-linecap="round" stroke-linejoin="round"/>
//     <path d="M7.99094 9.98896C9.09428 9.98896 9.98872 9.09453 9.98872 7.99118C9.98872 6.88784 9.09428 5.99341 7.99094 5.99341C6.8876 5.99341 5.99316 6.88784 5.99316 7.99118C5.99316 9.09453 6.8876 9.98896 7.99094 9.98896Z" stroke="#4A3A37" stroke-opacity="0.4" stroke-width="1.33185" stroke-linecap="round" stroke-linejoin="round"/>
//   </g>
//   <defs>
//     <clipPath id="clip0_211_12118">
//       <rect width="15.9822" height="15.9822" fill="white"/>
//     </clipPath>
//   </defs>
// </svg>
//           </button>
//           <button  onClick={() => navigate(`/dashboard/edit-content/${item.id}`)} className="py-2 px-4 cursor-pointer">
//             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
//   <g clip-path="url(#clip0_211_12122)">
//     <path d="M7.99138 1.9978H3.3299C2.97667 1.9978 2.63791 2.13812 2.38814 2.38789C2.13837 2.63766 1.99805 2.97642 1.99805 3.32965V12.6526C1.99805 13.0058 2.13837 13.3446 2.38814 13.5944C2.63791 13.8441 2.97667 13.9845 3.3299 13.9845H12.6529C13.0061 13.9845 13.3448 13.8441 13.5946 13.5944C13.8444 13.3446 13.9847 13.0058 13.9847 12.6526V7.99113" stroke="#4A3A37" stroke-opacity="0.4" stroke-width="1.33185" stroke-linecap="round" stroke-linejoin="round"/>
//     <path d="M12.2368 1.74798C12.5018 1.48306 12.8611 1.33423 13.2357 1.33423C13.6104 1.33423 13.9697 1.48306 14.2346 1.74798C14.4995 2.0129 14.6484 2.37221 14.6484 2.74687C14.6484 3.12153 14.4995 3.48084 14.2346 3.74576L8.23263 9.74841C8.0745 9.9064 7.87916 10.022 7.66459 10.0847L5.75139 10.6441C5.69409 10.6608 5.63334 10.6618 5.57552 10.647C5.5177 10.6322 5.46492 10.6021 5.42272 10.5599C5.38051 10.5177 5.35043 10.4649 5.33561 10.4071C5.3208 10.3492 5.3218 10.2885 5.33851 10.2312L5.89789 8.318C5.96084 8.10361 6.07671 7.9085 6.23485 7.75063L12.2368 1.74798Z" stroke="#4A3A37" stroke-opacity="0.4" stroke-width="1.33185" stroke-linecap="round" stroke-linejoin="round"/>
//   </g>
//   <defs>
//     <clipPath id="clip0_211_12122">
//       <rect width="15.9822" height="15.9822" fill="white"/>
//     </clipPath>
//   </defs>
// </svg>
//           </button>
//           <button className="cursor-pointer"> <Trash2 size={14} className="text-red-400" /></button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function ContentCMS() {
//   const [activeTab, setActiveTab] = useState<TabKey>("all");
//   const [search, setSearch] = useState("");
//   const navigate = useNavigate()

//   const filtered = allContent.filter(
//     (item) =>
//       filterMap[activeTab].includes(item.type) &&
//       item.title.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen  p-4  md:p-8">

//       <div className="">

//         {/* Header */}
//         <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row  justify-between items-center mb-8 gap-4">

//           <div>
//             <h1 className="text-titleColor text-xl sm:text-2xl md:text-[30px] font-extrabold leading-6 md:leading-[36px]">
//               Content CMS
//             </h1>
//             <p className="text-subTitleColor text-sm font-medium leading-5 mt-0.5">
//               Manage articles, videos, and guides
//             </p>
//           </div>

//           <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row   items-center gap-4">

//             <div className="flex items-center gap-2 bg-white border border-borderColor  w-full sm:w-auto    justify-center   px-2 py-3 rounded-2xl cursor-pointer">
//               <Search size={15} className="text-gray-400" />
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search library..."
//                 className="outline-none text-sm bg-transparent w-full"
//               />
//             </div>

//             <button onClick={()=> navigate('/dashboard/create-content')} className="flex w-full sm:w-auto md:w-full lg;w-auto justify-center items-center gap-2 bg-buttonColor font-extrabold px- py-3 text-white rounded-2xl cursor-pointer">
//               <Plus size={14} />
//               ADD NEW CONTENT
//             </button>

//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="grid grid-cols-2 sm:grid-cols-2  xl:grid-cols-4 gap-2 mb-6   w-full ">
//           {tabs.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               className={`px-9 py-4 rounded-full  text-xs font-extrabold leading-4 tracking-[1px] transition-all cursor-pointer ${
//                 activeTab === tab.key
//                   ? "border border-[#9266904D]  text-buttonColor"
//                   : " border border-[#ECC3B44D] text-[#4A3A374D]"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Grid Container */}
//         <div className="bg-white rounded-2xl md:rounded-[40px] p-3 md:p-8 border border-borderColor">

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {filtered.length > 0 ? (
//               filtered.map((item) => (
//                 <ContentCard key={item.id} item={item} />
//               ))
//             ) : (
//               <div className="col-span-full text-center text-[#c4b8e8] py-12 text-sm">
//                 No content found.
//               </div>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }