import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BroadcastMethod, BroadcastType, useCreateBroadcastMutation } from "../../redux/features/admin/brodcastApi";

// Format date like "February 17th, 2026"
function formatDateDisplay(dateStr: any) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const suffix = (n: any) => {
    if (n >= 11 && n <= 13) return "th";
    return ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][n % 10];
  };
  return `${months[d.getMonth()]} ${day}${suffix(day)}, ${year}`;
}

export default function GlobalBroadcast() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API Mutation
  const [createBroadcast, { isLoading }] = useCreateBroadcastMutation();

  // Form States
  const [deliveryMethod, setDeliveryMethod] = useState("push"); // push maps to FCM
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Schedule modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("2026-04-04"); // বর্তমান তারিখ অনুযায়ী
  const [scheduleTime, setScheduleTime] = useState("12:00");

  const handleFileChange = (file: any) => {
    if (!file) return;
    setMediaFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        setMediaPreview(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };


  const handleLaunch = async () => {
    if (!title.trim()) return toast.warn("Please add a broadcast title.");
    if (!body.trim()) return toast.warn("Please add a message body.");


    const broadcastInput = {
      name: title,
      body: body,
      buttonText: buttonText || "Log Now",
      linkUrl: linkUrl || null,
  
      type: isScheduled ? BroadcastType.SCHEDULED : BroadcastType.NOW,
      
      method: deliveryMethod === "push" ? BroadcastMethod.FCM : BroadcastMethod.EMAIL,

      scheduledAt: isScheduled ? new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString() : null,
    };

    try {
      await createBroadcast({
        file: mediaFile,
        input: broadcastInput,
      }).unwrap();

      toast.success(isScheduled ? "Broadcast scheduled!" : "Broadcast launched successfully!", {position:'top-right'});
      
   
      setTitle("");
      setBody("");
      setMediaFile(null);
      setMediaPreview(null);
      setIsScheduled(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to launch broadcast");
    }
  };

  const handleScheduleButtonClick = () => {
    if (isScheduled) {
      setIsScheduled(false);
      setShowScheduleModal(false);
    } else {
      setShowScheduleModal(true);
    }
  };

  const handleConfirmSchedule = () => {
    setIsScheduled(true);
    setShowScheduleModal(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb] font-sans flex flex-col relative">
      {/* Schedule Modal Overlay */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/10" onClick={() => setShowScheduleModal(false)} />
          <div className="relative z-10 bg-white rounded-3xl shadow-xl p-6 w-full max-w-sm mx-4 mb-4 sm:mb-0">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-[#2a1f1f]">Select Date & Time</h3>
              <button onClick={() => setShowScheduleModal(false)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 px-4 py-3 bg-[#f7f3f0] rounded-2xl border border-transparent focus-within:border-[#c8b8d8] transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-400 flex-shrink-0"><rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M4 1v2M10 1v2M1 6h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="bg-transparent text-sm text-[#2a1f1f] font-medium focus:outline-none w-full" style={{ colorScheme: "light" }} />
                </div>
                <p className="text-xs text-gray-400 mt-1 pl-1">{formatDateDisplay(scheduleDate)}</p>
              </div>
              <div className="w-32">
                <div className="flex items-center gap-2 px-4 py-3 bg-[#f7f3f0] rounded-2xl border border-transparent focus-within:border-[#c8b8d8] transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-400 flex-shrink-0"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" /><path d="M7 4v3.5l2 1.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="bg-transparent text-sm text-[#2a1f1f] font-medium focus:outline-none w-full" style={{ colorScheme: "light" }} />
                </div>
              </div>
            </div>
            <button onClick={handleConfirmSchedule} className="mt-5 w-full py-3 rounded-full bg-buttonColor hover:bg-[#7a5077] text-white text-sm font-bold cursor-pointer transition-all">
              CONFIRM SCHEDULE
            </button>
          </div>
        </div>
      )}

      {/* Top Nav */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-6 py-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-[#5a4a4a] hover:text-[#3a2a2a] transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          BACK
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#c8b8d8] text-sm font-semibold text-[#7c4d8a] bg-white hover:bg-[#f5f0fa] transition-colors">
          GLOBAL BROADCAST CHANNEL
        </button>
      </div>

      {/* Main Card */}
      <div className="flex-1 flex items-start justify-center px-4 pb-8">
        <div className="w-full bg-white p-3 md:p-10 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 pt-8 pb-6 ">
            <h1 className="text-titleColor text-xl sm:text-2xl md:text-[30px] font-extrabold">Create Global Broadcast</h1>
            <p className="text-subTitleColor text-sm font-medium mt-1">Send real-time updates, alerts, or notifications to your population.</p>
          </div>

          <div className="flex flex-col xl:flex-row gap-8">
            {/* Left: Delivery Method */}
     
<div className="w-full xl:w-1/3 flex-shrink-0">
  <p className="text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase mb-3">
    Delivery Method
  </p>
  <div className="flex flex-col w-full lg:w-[346px] gap-3">
    
    {/* Push Notification */}
    <button
      type="button"
      onClick={() => setDeliveryMethod("push")}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all text-left cursor-pointer ${
        deliveryMethod === "push"
          ? "border-borderColor bg-[#FAF7F5]"
          : "border-gray-100 bg-white hover:border-gray-200"
      }`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
        deliveryMethod === "push" ? "bg-buttonColor" : "bg-[#FAF7F5]"
      }`}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="1" width="10" height="14" rx="2" stroke={deliveryMethod === "push" ? "white" : "#888"} strokeWidth="1.5"/>
          <circle cx="8" cy="12" r="1" fill={deliveryMethod === "push" ? "white" : "#888"}/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${deliveryMethod === "push" ? "text-[#2a1f1f]" : "text-gray-500"}`}>
          Push Notification
        </p>
        <p className="text-xs text-gray-400 truncate">Direct mobile alert (FCM)</p>
      </div>
      {deliveryMethod === "push" && (
        <div className="w-5 h-5 rounded-full border-2 border-[#7c4d8a] flex items-center justify-center flex-shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#7c4d8a]"/>
        </div>
      )}
    </button>

    {/* In-App Message */}
    <button
      type="button"
      onClick={() => setDeliveryMethod("inapp")}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all text-left cursor-pointer ${
        deliveryMethod === "inapp"
          ? "border-borderColor bg-[#FAF7F5]"
          : "border-gray-100 bg-white hover:border-gray-200"
      }`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
        deliveryMethod === "inapp" ? "bg-buttonColor" : "bg-[#FAF7F5]"
      }`}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 3h12v8H9l-3 2v-2H2V3z" stroke={deliveryMethod === "inapp" ? "white" : "#888"} strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${deliveryMethod === "inapp" ? "text-[#2a1f1f]" : "text-gray-500"}`}>
          In-App Message
        </p>
        <p className="text-xs text-gray-400 truncate">Visible on next login</p>
      </div>
      {deliveryMethod === "inapp" && (
        <div className="w-5 h-5 rounded-full border-2 border-[#7c4d8a] flex items-center justify-center flex-shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#7c4d8a]"/>
        </div>
      )}
    </button>

  </div>
</div>

            {/* Right: Content Details */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="w-full xl:w-[486px] mx-auto">
                <p className="text-[10px] font-extrabold tracking-[2px] text-subTitleColor uppercase">Content Details</p>

                <div className="mt-2 mb-5">
                  <p className="text-[9px] font-extrabold tracking-widest text-subTitleColor uppercase mb-2">Broadcast Title</p>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. New Symptom Guide Available!"
                    className="w-full p-4 rounded-2xl bg-[#FAF7F5] border border-borderColor text-sm focus:outline-none"
                  />
                </div>

                <div className="mt-2 mb-5">
                  <p className="text-[9px] font-extrabold tracking-widest text-subTitleColor uppercase mb-2">Message Body</p>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Type your announcement here..."
                    rows={4}
                    className="w-full p-4 rounded-2xl bg-[#FAF7F5] border border-borderColor text-sm resize-none focus:outline-none"
                  />
                </div>

                <div className="mt-2 mb-5">
                  <p className="text-[9px] font-extrabold tracking-widest text-subTitleColor uppercase mb-2">Call to Action (Optional)</p>
                  <div className="flex flex-col md:flex-row gap-3">
                    <input type="text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} placeholder="Button Text" className="flex-1 p-4 rounded-2xl bg-[#FAF7F5] border border-borderColor text-sm focus:outline-none" />
                    <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="Link URL" className="flex-1 p-4 rounded-2xl bg-[#FAF7F5] border border-borderColor text-sm focus:outline-none" />
                  </div>
                </div>

                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current!.click()}
                  className={`relative w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center py-8 gap-2 ${dragOver ? "border-[#7c4d8a] bg-[#f9f4fb]" : "border-gray-200 bg-[#f7f3f0]"}`}
                >
                  {mediaPreview ? (
                    <img src={mediaPreview} alt="preview" className="max-h-32 rounded-xl object-contain" />
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v10M5 6l4-4 4 4" stroke="#aaa" strokeWidth="1.5" /><path d="M3 14h12" stroke="#aaa" strokeWidth="1.5" /></svg>
                      </div>
                      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Add Media Attachment</p>
                    </>
                  )}
                  <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => handleFileChange(e.target.files?.[0])} />
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-5 border-t border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#edfaf3] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21.9921 11.9958H19.5129C19.076 11.9949 18.6509 12.1371 18.3025 12.4006L15.2344 21.8124C15.0486 21.9923 14.9945 21.9923 14.9945 21.9923L9.2365 2.17924C9.14653 2.04928 9.05066 1.9993 8.99659 1.9993L6.40749 10.5363C5.6926 11.588 4.92332 11.9946 4.48816 11.9958H1.99902" stroke="#00A63E" strokeWidth="2" /></svg>
              </div>
              <div>
                <p className="text-xl font-extrabold text-[#2a1f1f]">14,240</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Est. Reachable Users</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <button
                onClick={handleScheduleButtonClick}
                className={`flex w-full md:w-auto items-center gap-2 px-5 py-3 rounded-full border-2 text-sm font-bold transition-all cursor-pointer ${isScheduled ? "border-red-200 text-red-400" : "border-buttonColor text-buttonColor"}`}
              >
                {isScheduled ? "CANCEL SCHEDULE" : "SCHEDULE LATER"}
              </button>

              <button
                onClick={handleLaunch}
                disabled={isLoading}
                className="flex w-full md:w-auto items-center gap-2 px-6 py-3 rounded-full bg-buttonColor text-white text-sm font-bold transition-all shadow-md hover:bg-[#7a5077] disabled:bg-gray-300"
              >
                {isLoading ? "LAUNCHING..." : isScheduled ? "SCHEDULE BROADCAST" : "LAUNCH BROADCAST NOW"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}







// import { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";



// // Format date like "February 17th, 2026"
// function formatDateDisplay(dateStr:any) {
//   if (!dateStr) return "";
//   const [year, month, day] = dateStr.split("-").map(Number);
//   const d = new Date(year, month - 1, day);
//   const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
//   const suffix = (n:any) => {
//     if (n >= 11 && n <= 13) return "th";
//     return ["th","st","nd","rd","th","th","th","th","th","th"][n % 10];
//   };
//   return `${months[d.getMonth()]} ${day}${suffix(day)}, ${year}`;
// }

// export default function GlobalBroadcast() {
//   const [deliveryMethod, setDeliveryMethod] = useState("push");
//   const [title, setTitle] = useState("");
//   const [body, setBody] = useState("");
//   const [buttonText, setButtonText] = useState("");
//   const [linkUrl, setLinkUrl] = useState("");
//   const [, setMediaFile] = useState(null);
//   const [mediaPreview, setMediaPreview] = useState<string | null>(null);
//   const [launched, setLaunched] = useState(false);
//   const [dragOver, setDragOver] = useState(false);

//   // Schedule modal state
//   const [showScheduleModal, setShowScheduleModal] = useState(false);
//   const [isScheduled, setIsScheduled] = useState(false);
//   const [scheduleDate, setScheduleDate] = useState("2026-02-17");
//   const [scheduleTime, setScheduleTime] = useState("10:00");

//  const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleFileChange = (file:any) => {
//     if (!file) return;
//     setMediaFile(file);
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       if (e.target?.result && typeof e.target.result === "string") {
//         setMediaPreview(e.target.result);
//       }
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleDrop = (e:any) => {
//     e.preventDefault();
//     setDragOver(false);
//     const file = e.dataTransfer.files[0];
//     if (file) handleFileChange(file);
//   };

//   const handleLaunch = () => {
//     if (!title.trim()) return alert("Please add a broadcast title.");
//     if (!body.trim()) return alert("Please add a message body.");
//     setLaunched(true);
//     setTimeout(() => setLaunched(false), 3000);
//   };

//   const handleScheduleButtonClick = () => {
//     if (isScheduled) {
//       // Cancel schedule
//       setIsScheduled(false);
//       setShowScheduleModal(false);
//     } else {
//       // Open modal
//       setShowScheduleModal(true);
//     }
//   };

//   const handleConfirmSchedule = () => {
//     setIsScheduled(true);
//     setShowScheduleModal(false);
//   };
//   const navigate = useNavigate();
//   return (
//     <div className="min-h-screen bg-[#f5f0eb] font-sans flex flex-col relative">

//       {/* Schedule Modal Overlay */}
//       {showScheduleModal && (
//         <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
//           <div className="absolute inset-0 bg-black/10" onClick={() => setShowScheduleModal(false)} />
//           <div className="relative z-10 bg-white rounded-3xl shadow-xl p-6 w-full max-w-sm mx-4 mb-4 sm:mb-0">
//             <div className="flex items-center justify-between mb-5">
//               <h3 className="text-base font-bold text-[#2a1f1f]">Select Date & Time</h3>
//               <button onClick={() => setShowScheduleModal(false)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
//                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
//               </button>
//             </div>
//             <div className="flex gap-3">
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 px-4 py-3 bg-[#f7f3f0] rounded-2xl border border-transparent focus-within:border-[#c8b8d8] transition-colors">
//                   <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-400 flex-shrink-0"><rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M4 1v2M10 1v2M1 6h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
//                   <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="bg-transparent text-sm text-[#2a1f1f] font-medium focus:outline-none w-full" style={{ colorScheme: "light" }} />
//                 </div>
//                 <p className="text-xs text-gray-400 mt-1 pl-1">{formatDateDisplay(scheduleDate)}</p>
//               </div>
//               <div className="w-32">
//                 <div className="flex items-center gap-2 px-4 py-3 bg-[#f7f3f0] rounded-2xl border border-transparent focus-within:border-[#c8b8d8] transition-colors">
//                   <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-400 flex-shrink-0"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 4v3.5l2 1.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
//                   <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="bg-transparent text-sm text-[#2a1f1f] font-medium focus:outline-none w-full" style={{ colorScheme: "light" }} />
//                 </div>
//               </div>
//             </div>
//             <button onClick={handleConfirmSchedule} className="mt-5 w-full py-3 rounded-full bg-buttonColor hover:bg-[#7a5077] text-white text-sm font-bold cursor-pointer transition-all">
//               CONFIRM SCHEDULE
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Top Nav */}
//       <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-6 py-4">
//         <button     onClick={() => navigate(-1)}  className="flex items-center gap-2 text-sm font-semibold text-[#5a4a4a] hover:text-[#3a2a2a] transition-colors">
//           <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//             <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//           BACK
//         </button>
//         <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#c8b8d8] text-sm font-semibold text-[#7c4d8a] bg-white hover:bg-[#f5f0fa] transition-colors">
//          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
//   <g clip-path="url(#clip0_210_5474)">
//     <path d="M6.99189 12.8191C10.21 12.8191 12.8187 10.2103 12.8187 6.99222C12.8187 3.77414 10.21 1.16537 6.99189 1.16537C3.77381 1.16537 1.16504 3.77414 1.16504 6.99222C1.16504 10.2103 3.77381 12.8191 6.99189 12.8191Z" stroke="#926690" stroke-width="1.16537" stroke-linecap="round" stroke-linejoin="round"/>
//     <path d="M6.99187 1.16537C5.49567 2.73638 4.66113 4.82274 4.66113 6.99222C4.66113 9.16171 5.49567 11.2481 6.99187 12.8191C8.48807 11.2481 9.32261 9.16171 9.32261 6.99222C9.32261 4.82274 8.48807 2.73638 6.99187 1.16537Z" stroke="#926690" stroke-width="1.16537" stroke-linecap="round" stroke-linejoin="round"/>
//     <path d="M1.16504 6.99222H12.8187" stroke="#926690" stroke-width="1.16537" stroke-linecap="round" stroke-linejoin="round"/>
//   </g>
//   <defs>
//     <clipPath id="clip0_210_5474">
//       <rect width="13.9844" height="13.9844" fill="white"/>
//     </clipPath>
//   </defs>
// </svg>
//           GLOBAL BROADCAST CHANNEL
//         </button>
//       </div>

//       {/* Main Card */}
//       <div className="flex-1 flex items-start justify-center px-4 pb-8">
//         <div className="w-full  bg-white p-3 md:p-10 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
//           {/* Card Header */}
//           <div className="px-8 pt-8 pb-6 ">
//             <h1 className="text-titleColor text-xl sm:text-2xl md:text-[30px] font-extrabold leading-6 md:leading-[36px]">Create Global Broadcast</h1>
//             <p className="text-subTitleColor text-sm font-medium leading-5 mt-1">Send real-time updates, alerts, or new content notifications to your population.</p>
//           </div>

//           {/* Card Body */}
//           <div className=" flex flex-col xl:flex-row gap-8">
//             {/* Left: Delivery Method */}
//             <div className="w-full xl:w-1/3 flex-shrink-0">
//               <p className="text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase mb-3">Delivery Method</p>
//               <div className="flex flex-col w-full lg:w-[346px] gap-3">
//                 {/* Push Notification */}
//                 <button
//                   onClick={() => setDeliveryMethod("push")}
//                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all text-left ${
//                     deliveryMethod === "push"
//                       ? "border-borderColor bg-[#FAF7F5]"
//                       : "border-gray-100 bg-white hover:border-gray-200"
//                   }`}
//                 >
//                   <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
//                     deliveryMethod === "push" ? "bg-buttonColor" : "bg-[#FAF7F5]"
//                   }`}>
//                     <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//                       <rect x="3" y="1" width="10" height="14" rx="2" stroke={deliveryMethod === "push" ? "white" : "#888"} strokeWidth="1.5"/>
//                       <circle cx="8" cy="12" r="1" fill={deliveryMethod === "push" ? "white" : "#888"}/>
//                     </svg>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className={`text-sm font-bold ${deliveryMethod === "push" ? "text-[#2a1f1f]" : "text-gray-500"}`}>Push Notification</p>
//                     <p className="text-xs text-gray-400 truncate">Direct mobile alert</p>
//                   </div>
//                   {deliveryMethod === "push" && (
//                     <div className="w-5 h-5 rounded-full border-2 border-[#7c4d8a] flex items-center justify-center flex-shrink-0">
//                       <div className="w-2.5 h-2.5 rounded-full bg-[#7c4d8a]"/>
//                     </div>
//                   )}
//                 </button>

//                 {/* In-App Message */}
//                 <button
//                   onClick={() => setDeliveryMethod("inapp")}
//                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all text-left ${
//                     deliveryMethod === "inapp"
//                       ? "border-borderColor bg-[#FAF7F5]"
//                       : "border-borderColor bg-white hover:border-gray-200"
//                   }`}
//                 >
//                   <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
//                     deliveryMethod === "inapp" ? "bg-buttonColor" : "bg-[#FAF7F5]"
//                   }`}>
//                     <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//                       <path d="M2 3h12v8H9l-3 2v-2H2V3z" stroke={deliveryMethod === "inapp" ? "white" : "#888"} strokeWidth="1.5" strokeLinejoin="round"/>
//                     </svg>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className={`text-sm font-bold ${deliveryMethod === "inapp" ? "text-[#2a1f1f]" : "text-gray-500"}`}>In-App Message</p>
//                     <p className="text-xs text-gray-400 truncate">Visible on next login</p>
//                   </div>
//                   {deliveryMethod === "inapp" && (
//                     <div className="w-5 h-5 rounded-full border-2 border-[#7c4d8a] flex items-center justify-center flex-shrink-0">
//                       <div className="w-2.5 h-2.5 rounded-full bg-[#7c4d8a]"/>
//                     </div>
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Right: Content Details */}
//             <div className="flex-1 flex flex-col  gap-4">
              
//               <div className="w-full xl:w-[486px] mx-auto">

//             <p className="text-[10px] font-extrabold leading-4 tracking-[2px] text-subTitleColor uppercase">Content Details</p>

//               {/* Broadcast Title */}
//               <div className="mt-2 mb-5">
//                 <p className="text-[9px] font-extrabold tracking-widest text-subTitleColor uppercase mb-2">Broadcast Title</p>
//                 <input
//                   type="text"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   placeholder="e.g. New Symptom Guide Available!"
//                   className="w-full p-4 rounded-2xl bg-[#FAF7F5] border  border-borderColor focus:outline-none focus:border-[#c8b8d8] text-sm text-[#2a1f1f] placeholder-gray-300 transition-colors"
//                 />
//               </div>

//               {/* Message Body */}
//               <div className="mt-2 mb-5">
//                 <p className="text-[9px] font-extrabold tracking-widest text-subTitleColor uppercase mb-2">Message Body</p>
//                 <textarea
//                   value={body}
//                   onChange={(e) => setBody(e.target.value)}
//                   placeholder="Type your announcement here..."
//                   rows={4}
//                   className="w-full p-4 rounded-2xl bg-[#FAF7F5] border  border-borderColor focus:outline-none focus:border-[#c8b8d8] text-sm text-[#2a1f1f] placeholder-gray-300 resize-none transition-colors"
//                 />
//               </div>

//               {/* Call to Action */}
//               <div className="mt-2 mb-5">
//                 <p className="text-[9px] font-extrabold tracking-widest text-subTitleColor uppercase mb-2">Call to Action (Optional)</p>
//                 <div className="flex flex-col md:flex-row gap-3">
//                   <input
//                     type="text"
//                     value={buttonText}
//                     onChange={(e) => setButtonText(e.target.value)}
//                     placeholder="Button Text"
//                     className="flex-1 p-4 rounded-2xl bg-[#FAF7F5] border  border-borderColor focus:outline-none focus:border-[#c8b8d8] text-sm text-[#2a1f1f] placeholder-gray-300 transition-colors"
//                   />
//                   <input
//                     type="text"
//                     value={linkUrl}
//                     onChange={(e) => setLinkUrl(e.target.value)}
//                     placeholder="Link URL"
//                     className="flex-1 p-4 rounded-2xl bg-[#FAF7F5] border  border-borderColor focus:outline-none focus:border-[#c8b8d8] text-sm text-[#2a1f1f] placeholder-gray-300 transition-colors"
//                   />
//                 </div>
//               </div>

//               {/* Media Attachment */}
//               <div
//                 onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//                 onDragLeave={() => setDragOver(false)}
//                 onDrop={handleDrop}
//               onClick={() => fileInputRef.current!.click()}
//                 className={`relative w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center py-8 gap-2 ${
//                   dragOver ? "border-[#7c4d8a] bg-[#f9f4fb]" : "border-gray-200 bg-[#f7f3f0] hover:border-[#c8b8d8]"
//                 }`}
//               >
               

//                 {mediaPreview ? (
//                   <img src={mediaPreview} alt="preview" className="max-h-32 rounded-xl object-contain" />
//                 ) : (
//                   <>
//                     <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
//                       <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
//                         <path d="M9 2v10M5 6l4-4 4 4" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                         <path d="M3 14h12" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round"/>
//                       </svg>
//                     </div>
//                     <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Add Media Attachment</p>
//                     <p className="text-[10px] text-gray-300">PNG, JPG or MP4. Max 25MB</p>
//                   </>
//                 )}
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/png,image/jpeg,video/mp4"
//                   className="hidden"
//                   onChange={(e) => handleFileChange(e.target.files?.[0])}
//                 />
//               </div>
//             </div>
//               </div>
//           </div>

//           {/* Card Footer */}
//           <div className="px-8 py-5 border-t border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-4">
//             {/* Reach counter */}
//             <div className="flex items-center gap-3">
//               <div className="w-9 h-9 rounded-xl bg-[#edfaf3] flex items-center justify-center">
//                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//   <path d="M21.9921 11.9958H19.5129C19.076 11.9949 18.6509 12.1371 18.3025 12.4006C17.954 12.6642 17.7016 13.0347 17.5836 13.4553L15.2344 21.8124C15.2193 21.8643 15.1877 21.9099 15.1444 21.9424C15.1012 21.9748 15.0486 21.9923 14.9945 21.9923C14.9404 21.9923 14.8878 21.9748 14.8445 21.9424C14.8013 21.9099 14.7697 21.8643 14.7546 21.8124L9.2365 2.17924C9.22136 2.12732 9.18979 2.08172 9.14653 2.04928C9.10327 2.01684 9.05066 1.9993 8.99659 1.9993C8.94251 1.9993 8.8899 2.01684 8.84664 2.04928C8.80338 2.08172 8.77181 2.12732 8.75667 2.17924L6.40749 10.5363C6.28999 10.9553 6.039 11.3246 5.6926 11.588C5.3462 11.8514 4.92332 11.9946 4.48816 11.9958H1.99902" stroke="#00A63E" stroke-width="1.9993" stroke-linecap="round" stroke-linejoin="round"/>
// </svg>
//               </div>
//               <div>
//                 <p className="text-xl font-extrabold text-[#2a1f1f] leading-none">14,240</p>
//                 <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Est. Reachable Users</p>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col md:flex-row items-center gap-3"> 
//               <button
//                 onClick={handleScheduleButtonClick}
//                 className={`flex w-full md:w-auto items-center gap-2 px-5 py-3 rounded-full border-2 text-sm font-bold transition-all cursor-pointer ${
//                   isScheduled
//                     ? "border-red-200 text-red-400 hover:bg-red-50"
//                     : "border-buttonColor text-buttoncolor hover:border-[#c8b8d8] hover:bg-[#f9f4fb]"
//                 }`}
//               >
//                 {isScheduled ? (
//                   <>
//                     <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//                       <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                     </svg>
//                     CANCEL SCHEDULE
//                   </>
//                 ) : (
//                   <>
//                     <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//                       <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
//                       <path d="M4 1v2M10 1v2M1 6h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//                     </svg>
//                     SCHEDULE LATER
//                   </>
//                 )}
//               </button>

//               <div className="flex items-center">
//                 <button
//                   onClick={handleLaunch}
//                   className="flex w-full md:w-auto items-center gap-2 px-5 py-3 rounded-full bg-buttonColor hover:bg-[#7a5077] text-white text-sm font-bold  transition-all shadow-md hover:shadow-lg cursor-pointer"
//                 >
//                   {launched ? (
//                     <span className="flex items-center gap-2">
//                       <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//                         <path d="M2 7l4 4 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                       LAUNCHED!
//                     </span>
//                   ) : (
//                     <>
//                       <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//                         <path d="M7 1l1.5 4h4l-3.2 2.3 1.2 4L7 9l-3.5 2.3 1.2-4L1.5 5h4L7 1z" fill="white"/>
//                       </svg>
//                       LAUNCH BROADCAST NOW
//                     </>
//                   )}
//                 </button>
                
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }