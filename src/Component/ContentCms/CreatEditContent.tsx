import React, { useState } from 'react';
import { ChevronDown, Plus, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { contentStore, type ContentItem, } from './contentStore';

const CreateContentForm: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [isPublished, setIsPublished] = useState(true);
  const [notifyUsers, setNotifyUsers] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [typeOpen, setTypeOpen] = useState(false);
  const [typeSelected, setTypeSelected] = useState('Article');
  const typeOptions = ['Article', 'Video', 'Meditation'];

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySelected, setCategorySelected] = useState('Symptom Relief');
  const categoryOptions = ['Symptom Relief', 'Mental Health', 'Medical', 'Wellness', 'Fitness'];

  const handleSave = () => {
    if (!title.trim()) return alert('Title is required!');

    contentStore.add({
      title,
      status: isPublished ? 'PUBLISHED' : 'DRAFT',
    
      type: typeSelected.toLowerCase() as ContentItem['type'],
      category: categorySelected.toUpperCase(),
      seoDescription,
      readTime,
      notifyUsers,
      isLocked,
    });

    navigate(-1); // ✅ back to ContentCMS
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] p-4 md:p-8 font-sans text-[#4A4A4A]">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#8B6E91] uppercase mb-6 hover:opacity-70 transition-opacity"
      >
        <ChevronLeft size={14} strokeWidth={3} /> Back to Content Manager
      </button>

      {/* Main Card */}
      <div className="max-w-7xl mx-auto bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-titleColor text-xl sm:text-2xl md:text-[30px] font-extrabold leading-6 md:leading-[36px]">
              Create New Content
            </h1>
            <p className="text-subTitleColor text-sm font-medium leading-5 mt-0.5">
              Publishing to Global Library • v1.0.4
            </p>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full transition-all ${!isPublished ? 'bg-[#FAF7F5] border border-borderColor text-[#8B6E91]' : 'text-gray-400'}`}>
              DRAFT
            </span>
            <button
              onClick={() => setIsPublished(!isPublished)}
              className={`relative w-12 h-6 rounded-full transition-colors ${isPublished ? 'bg-[#8B6E91]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isPublished ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-[10px] font-extrabold px-4 py-1.5 rounded-full transition-all ${isPublished ? 'text-buttonColor' : 'text-gray-400'}`}>
              PUBLISHED
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 border-b border-borderColor pb-13">

          {/* Left Column */}
          <div className="space-y-6">

            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">
                Content Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Navigating Perimenopause Sleep"
                className="w-full bg-[#FAF7F5] border border-borderColor rounded-2xl p-4 focus:ring-2 focus:ring-[#8B6E91]/20 outline-none placeholder:text-gray-300"
              />
            </div>

            {/* Type & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Type Dropdown */}
              <div className="space-y-2 relative">
                <label className="text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">Type</label>
                <div
                  className="w-full bg-[#FAF7F5] border border-borderColor rounded-2xl p-4 flex justify-between items-center cursor-pointer"
                  onClick={() => setTypeOpen(!typeOpen)}
                >
                  <span>{typeSelected}</span>
                  <ChevronDown className={`transition-transform ${typeOpen ? 'rotate-180' : ''}`} size={18} />
                </div>
                {typeOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-borderColor rounded-xl shadow-md max-h-40 overflow-auto">
                    {typeOptions.map((option) => (
                      <div key={option} onClick={() => { setTypeSelected(option); setTypeOpen(false); }} className="p-3 hover:bg-[#F2F1EE] cursor-pointer">
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Dropdown */}
              <div className="space-y-2 relative">
                <label className="text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">Category</label>
                <div
                  className="w-full bg-[#FAF7F5] border border-borderColor rounded-2xl p-4 flex justify-between items-center cursor-pointer"
                  onClick={() => setCategoryOpen(!categoryOpen)}
                >
                  <span>{categorySelected}</span>
                  <ChevronDown className={`transition-transform ${categoryOpen ? 'rotate-180' : ''}`} size={18} />
                </div>
                {categoryOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-borderColor rounded-xl shadow-md max-h-40 overflow-auto">
                    {categoryOptions.map((option) => (
                      <div key={option} onClick={() => { setCategorySelected(option); setCategoryOpen(false); }} className="p-3 hover:bg-[#F2F1EE] cursor-pointer">
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">
                Cover Image / Thumbnail
              </label>
              <div className="w-full aspect-video bg-[#FAF7F5] border border-borderColor rounded-4xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-[#F2F1EE] transition-colors relative group overflow-hidden">
                {filePreview ? (
                  <img src={filePreview} alt="Preview" className="w-full h-full object-cover rounded-4xl" />
                ) : (
                  <>
                    <Plus className="text-gray-300 mb-2 group-hover:scale-110 transition-transform" size={32} />
                    <span className="text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">Upload Asset</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFilePreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* SEO Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">
                SEO Description
              </label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Short summary for search results..."
                className="w-full bg-[#FAF7F5] border border-borderColor rounded-2xl p-4 h-[140px] focus:ring-2 focus:ring-[#8B6E91]/20 outline-none resize-none placeholder:text-gray-300"
              />
            </div>

            {/* Read Time */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">
                Read/Watch Time (Mins)
              </label>
              <input
                type="number"
                value={readTime}
                onChange={(e) => setReadTime(Number(e.target.value))}
                className="w-full bg-[#FAF7F5] border border-borderColor rounded-2xl p-4 focus:ring-2 focus:ring-[#8B6E91]/20 outline-none"
              />
            </div>

            {/* Publishing Logic */}
            <div className="bg-[#FAF7F5] border border-borderColor rounded-4xl p-4 md:p-6 space-y-4">
              <label className="text-[10px] font-extrabold leading-4 tracking-[1px] text-buttonColor uppercase mb-4">Publishing Logic</label>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-[#4A3A3799] font-normal leading-4">Notify Users?</span>
                <button
                  onClick={() => setNotifyUsers(!notifyUsers)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${notifyUsers ? 'bg-[#8B6E91]' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${notifyUsers ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#4A3A3799] font-normal leading-4">Locked content?</span>
                <button
                  onClick={() => setIsLocked(!isLocked)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${isLocked ? 'bg-[#8B6E91]' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isLocked ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-13 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-[#FDFBF9] border border-borderColor text-[#D0021B] font-black uppercase tracking-widest py-5 rounded-[24px] hover:bg-red-50 transition-colors cursor-pointer"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            className="flex-[1.5] bg-buttonColor text-white font-black uppercase tracking-widest py-5 rounded-[24px] hover:opacity-90 transition-opacity shadow-lg shadow-[#8B6E91]/20 cursor-pointer"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateContentForm;






// import React, { useState } from 'react';
// import { ChevronDown, Plus, ChevronLeft } from 'lucide-react';

// const CreateContentForm: React.FC = () => {
//   const [isPublished, setIsPublished] = useState(true);
//   const [notifyUsers, setNotifyUsers] = useState(true);
//   const [isLocked, setIsLocked] = useState(false);
//   const [filePreview, setFilePreview] = useState<string | null>(null); // File preview

//   const [typeOpen, setTypeOpen] = useState(false);
//   const [typeSelected, setTypeSelected] = useState('Article');
//   const typeOptions = ['Article', 'Video'];

//   // Category dropdown
//   const [categoryOpen, setCategoryOpen] = useState(false);
//   const [categorySelected, setCategorySelected] = useState('Symptom Relief');
//   const categoryOptions = ['Symptom Relief', 'Mental Health', 'Medical', 'Wellness', 'Fitness'];


//   return (
//     <div className="min-h-screen bg-[#FDFBF9] p-4 md:p-8 font-sans text-[#4A4A4A]">
//       {/* Back Button */}
//       <button className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#8B6E91] uppercase mb-6 hover:opacity-70 transition-opacity">
//         <ChevronLeft size={14} strokeWidth={3} /> Back to Content Manager
//       </button>

//       {/* Main Card */}
//       <div className="max-w-7xl mx-auto bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12">
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
//           <div>
//             <h1 className="text-titleColor text-xl sm:text-2xl md:text-[30px] font-extrabold leading-6 md:leading-[36px]">
//               Create New Content
//             </h1>
//             <p className="text-subTitleColor text-sm font-medium leading-5 mt-0.5">
//               Publishing to Global Library • v1.0.4
//             </p>
//           </div>

//           {/* Status Toggle */}
//           <div className="flex items-center gap-3">
//             <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full transition-all ${!isPublished ? 'bg-[#FAF7F5] border border-borderColor text-[#8B6E91]' : 'text-gray-400'}`}>
//               DRAFT
//             </span>
//             <button
//               onClick={() => setIsPublished(!isPublished)}
//               className={`relative w-12 h-6 rounded-full transition-colors ${isPublished ? 'bg-[#8B6E91]' : 'bg-gray-300'}`}
//             >
//               <div
//                 className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isPublished ? 'translate-x-6' : 'translate-x-0'}`}
//               />
//             </button>
//             <span className={`text-[10px] font-extrabold px-4 py-1.5 rounded-full transition-all ${isPublished ? ' text-buttonColor' : 'text-gray-400'}`}>
//               PUBLISHED
//             </span>
//           </div>
//         </div>

//         {/* Form */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 border-b border-borderColor pb-13">
//           {/* Left Column */}
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <label className="text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase ">
//                 Content Title
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. Navigating Perimenopause Sleep"
//                 className="w-full bg-[#FAF7F5] border border-borderColor rounded-2xl p-4 focus:ring-2 focus:ring-[#8B6E91]/20 outline-none placeholder:text-gray-300"
//               />
//             </div>

//            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       {/* Type Dropdown */}
//       <div className="space-y-2 relative">
//         <label className="text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">
//           Type
//         </label>
//         <div
//           className="w-full bg-[#FAF7F5] border border-borderColor rounded-2xl p-4 flex justify-between items-center cursor-pointer"
//           onClick={() => setTypeOpen(!typeOpen)}
//         >
//           <span>{typeSelected}</span>
//           <ChevronDown className={`transition-transform ${typeOpen ? 'rotate-180' : ''}`} size={18} />
//         </div>
//         {typeOpen && (
//           <div className="absolute z-10 w-full mt-1 bg-white border border-borderColor rounded-xl shadow-md max-h-40 overflow-auto">
//             {typeOptions.map((option) => (
//               <div
//                 key={option}
//                 onClick={() => {
//                   setTypeSelected(option);
//                   setTypeOpen(false);
//                 }}
//                 className="p-3 hover:bg-[#F2F1EE] cursor-pointer"
//               >
//                 {option}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Category Dropdown */}
//       <div className="space-y-2 relative">
//         <label className="text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">
//           Category
//         </label>
//         <div
//           className="w-full bg-[#FAF7F5] border border-borderColor rounded-2xl p-4 flex justify-between items-center cursor-pointer"
//           onClick={() => setCategoryOpen(!categoryOpen)}
//         >
//           <span>{categorySelected}</span>
//           <ChevronDown className={`transition-transform ${categoryOpen ? 'rotate-180' : ''}`} size={18} />
//         </div>
//         {categoryOpen && (
//           <div className="absolute z-10 w-full mt-1 bg-white border border-borderColor rounded-xl shadow-md max-h-40 overflow-auto">
//             {categoryOptions.map((option) => (
//               <div
//                 key={option}
//                 onClick={() => {
//                   setCategorySelected(option);
//                   setCategoryOpen(false);
//                 }}
//                 className="p-3 hover:bg-[#F2F1EE] cursor-pointer"
//               >
//                 {option}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>

//             <div className="space-y-2">
//               <label className="text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">
//                 Cover Image / Thumbnail
//               </label>
//               <div className="w-full aspect-video bg-[#FAF7F5] border border-borderColor rounded-4xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-[#F2F1EE] transition-colors relative group overflow-hidden">
//                 {filePreview ? (
//                   <img src={filePreview} alt="Preview" className="w-full h-full object-cover rounded-4xl" />
//                 ) : (
//                   <>
//                     <Plus className="text-gray-300 mb-2 group-hover:scale-110 transition-transform" size={32} />
//                     <span className="text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">Upload Asset</span>
//                   </>
//                 )}
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => {
//                     if (e.target.files && e.target.files[0]) {
//                       const fileURL = URL.createObjectURL(e.target.files[0]);
//                       setFilePreview(fileURL);
//                     }
//                   }}
//                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <label className="text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">
//                 SEO Description
//               </label>
//               <textarea
//                 placeholder="Short summary for search results..."
//                 className="w-full bg-[#FAF7F5] border border-borderColor rounded-2xl p-4 h-[140px] focus:ring-2 focus:ring-[#8B6E91]/20 outline-none resize-none placeholder:text-gray-300"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">
//                 Read/Watch Time (Mins)
//               </label>
//               <input
//                 type="number"
//                 defaultValue={5}
//                 className="w-full bg-[#FAF7F5] border border-borderColor rounded-2xl p-4 focus:ring-2 focus:ring-[#8B6E91]/20 outline-none"
//               />
//             </div>

//             <div className="bg-[#FAF7F5] border border-borderColor rounded-4xl p-4 md:p-6 space-y-4">
//               <label className="text-[10px] font-extrabold leading-4 tracking-[1px] text-buttonColor uppercase mb-4">Publishing Logic</label>
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-sm text-[#4A3A3799] font-normal leading-4">Notify Users?</span>
//                 <button
//                   onClick={() => setNotifyUsers(!notifyUsers)}
//                   className={`relative w-10 h-5 rounded-full transition-colors ${notifyUsers ? 'bg-[#8B6E91]' : 'bg-gray-300'}`}
//                 >
//                   <div
//                     className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${notifyUsers ? 'translate-x-5' : 'translate-x-0'}`}
//                   />
//                 </button>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-[#4A3A3799] font-normal leading-4">Locked content?</span>
//                 <button
//                   onClick={() => setIsLocked(!isLocked)}
//                   className={`relative w-10 h-5 rounded-full transition-colors ${isLocked ? 'bg-[#8B6E91]' : 'bg-gray-300'}`}
//                 >
//                   <div
//                     className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isLocked ? 'translate-x-5' : 'translate-x-0'}`}
//                   />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer Buttons */}
//         <div className="mt-13 grid grid-cols-1 md:grid-cols-2 gap-4">
//           <button className="flex-1 bg-[#FDFBF9] border border-borderColor text-[#D0021B] font-black uppercase tracking-widest py-5 rounded-[24px] hover:bg-red-50 transition-colors cursor-pointer">
//             Discard
//           </button>
//           <button className="flex-[1.5] bg-buttonColor text-white font-black uppercase tracking-widest py-5 rounded-[24px] hover:opacity-90 transition-opacity shadow-lg shadow-[#8B6E91]/20 cursor-pointer">
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateContentForm;