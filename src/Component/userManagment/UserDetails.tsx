import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useChangeUserStatusMutation, useGetAllUsersQuery } from "../../redux/features/admin/userManagmentApi";



export const UserStatus = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
  UNVERIFIED: 'UNVERIFIED',
} as const;


export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export default function UserProfileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  

  const { data: allUsersData, isLoading: isListLoading } = useGetAllUsersQuery({});
  const [, { isLoading: isStatusUpdating }] = useChangeUserStatusMutation();

  const [imgError, setImgError] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [reason, setReason] = useState("");

  const user = allUsersData?.data?.find((u: any) => u.id === id);

  if (isListLoading) return <div className="p-20 text-center font-bold">Loading...</div>;
  if (!user) return <div className="p-20 text-center font-bold">User Not Found!</div>;

  const isBlocked = user.status === UserStatus.BLOCKED;

const handleStatusToggle = async () => {
  const nextStatus = isBlocked ? UserStatus.ACTIVE : UserStatus.BLOCKED;
  
  // const statusInput = {
  //   userId: user.id,
  //   status: nextStatus,
  //   blockReason: !isBlocked ? reason : "Reactivated by admin",
  //   notifyUser: true,
  //   sendDataExport: false
  // };

  try {
   
    // const res = await changeStatus(statusInput).unwrap();
    
    // ২. সাকসেস মেসেজ
    toast.success(`User status updated to ${nextStatus}!`, {
      position: "top-right",
      autoClose: 3000,
    });

    setShowConfirm(false);
    setReason("");
  } catch (err: any) {
    // ৩. এরর মেসেজ (যদি ব্যাকএন্ড থেকে কোনো মেসেজ আসে)
    console.error("Mutation Error:", err);
    toast.error(err?.data?.message || "Failed to update user status");
  }
};

  return (
    <div className="min-h-screen bg-[#f5f0eb] p-4 sm:p-8">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="mb-6 font-bold text-[#7c4d8a] uppercase text-xs flex items-center gap-2 cursor-pointer">
        ← Back to User List
      </button>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-50">
        <div className="flex flex-col lg:flex-row gap-10">
          
          
          <div className="flex flex-col items-center lg:items-start gap-4 lg:w-52 flex-shrink-0 lg:border-r border-gray-100">
            {!user.avatar || imgError ? (
              <div className="w-32 h-32 rounded-[40px] bg-[#9266901A] flex items-center justify-center text-[#926690] text-5xl font-black border border-[#92669033]">
                {user.username ? user.username[0].toUpperCase() : user.email[0].toUpperCase()}
              </div>
            ) : (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-32 h-32 rounded-[40px] object-cover"
                onError={() => setImgError(true)}
              />
            )}
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-black text-[#4A3A37]">{user.username || 'User'}</h2>
              <p className="text-sm text-gray-400 font-medium">{user.email}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${
              isBlocked ? "bg-red-50 text-red-500 border-red-100" : "bg-green-50 text-green-600 border-green-100"
            }`}>
              {user.status}
            </span>
          </div>

          {/* Details Content */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-black tracking-widest text-gray-300 uppercase mb-4">User Information</p>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 font-bold">Role: <span className="text-[#926690]">{user.role}</span></p>
                  <p className="text-sm text-gray-600 font-bold">Contact: <span className="text-gray-400">{user.contactNo || 'N/A'}</span></p>
                  <p className="text-sm text-gray-600 font-bold">Joined: <span className="text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</span></p>
                </div>
              </div>

              <button
                onClick={() => isBlocked ? handleStatusToggle() : setShowConfirm(true)}
                disabled={isStatusUpdating}
                className={`w-full py-4 rounded-2xl font-black text-xs tracking-widest transition-all cursor-pointer border ${
                  isBlocked 
                    ? "bg-green-50 text-green-600 border-green-100 hover:bg-green-100" 
                    : "bg-red-50 text-red-500 border-red-100 hover:bg-red-100"
                }`}
              >
                {isStatusUpdating ? "Syncing..." : isBlocked ? "ACTIVATE USER" : "SUSPEND USER"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Suspend Confirmation Modal (আপনার আগের মডাল কোডটি এখানে থাকবে) */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-200">
             <h3 className="text-xl font-black mb-2">Suspend {user.username}?</h3>
             <p className="text-gray-500 text-sm mb-6">This will block the user's access to the platform.</p>
             
             <textarea 
               className="w-full h-32 p-4 border border-gray-100 rounded-2xl text-sm mb-6 outline-none focus:ring-2 focus:ring-red-100 resize-none"
               placeholder="Reason for suspension..."
               value={reason}
               onChange={(e) => setReason(e.target.value)}
             />

             <div className="flex gap-4">
               <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-50 cursor-pointer">Cancel</button>
               <button onClick={handleStatusToggle} className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 cursor-pointer">Confirm</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}






// import { useState } from "react";
// import { useNavigate } from "react-router-dom";


// interface TopicBadge {
//   label: string;
// }

// interface UserProfile {
//   name: string;
//   email: string;
//   avatar: string;
//   stage: string;
//   joined: string;
//   region: string;
//   contact: string;
//   logPreferences: string[];
//   topics: TopicBadge[];
// } 


// const profile: UserProfile = {
//   name: "Jasmine Lee",
//   email: "j.lee@health.co",
//   avatar: "https://i.pravatar.cc/120?img=47",
//   stage: "PERIMENOPAUSE",
//   joined: "Jan 12, 2026",
//   region: "Europe",
//   contact: "+44 20 7123 4567",
//   logPreferences: ["Hot Flashes", "Brain Fog"],
//   topics: [{ label: "Hormones & HRT" }, { label: "Nutrition & Weight" }],
// };

// export default function UserProfileDetail() {
//   const [suspended, setSuspended] = useState<boolean>(false);
//   const [imgError, setImgError] = useState<boolean>(false);
//   const [showConfirm, setShowConfirm] = useState<boolean>(false);

//   const handleSuspendClick = () => {
//     if (suspended) {
//       setSuspended(false);
//     } else {
//       setShowConfirm(true);
//     }
//   };

//   const handleConfirmSuspend = () => {
//     setSuspended(true);
//     setShowConfirm(false);
//   };

//   const [selectedOption, setSelectedOption] = useState("notify");
// const [reason, setReason] = useState("");
// const navigate = useNavigate();


//   return (
//     <div className="min-h-screen bg-[#f5f0eb] p-4 sm:p-6 lg:p-8 font-sans">

//       {/* Back Nav */}
//       <button   onClick={() => navigate(-1)}
//        className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#7c4d8a] uppercase mb-6 hover:opacity-70 transition-opacity cursor-pointer">
//         <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//           <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//         </svg>
//         Back to User List
//       </button>

//       {/* Card */}
//       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 md:p-10 relative">



//         {/* Main grid */}
//         <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">

//           {/* Left: Avatar + Name */}
//          <div className="flex flex-col items-start gap-3 w-full lg:w-44 flex-shrink-0 lg:border-r border-borderColor">
//             {imgError ? (
//               <div className="w-28 h-28 rounded-2xl bg-[#e9d5f5] flex items-center justify-center text-[#7c4d8a] text-3xl font-bold">
//                 {profile.name[0]}
//               </div>
//             ) : (
//               <img
//                 src={profile.avatar}
//                 alt={profile.name}
//                 className="w-28 h-28 rounded-[40px] object-cover mb-4"
//                 onError={(_e: React.SyntheticEvent<HTMLImageElement>) => setImgError(true)}
//               />
//             )}
//             <div>
//               <h2 className="text-xl md:text-2xl  font-extrabold text-titleColor leading-6 md:leading-9 ">{profile.name}</h2>
//               <p className="text-sm text-[#4A3A3766] font-normal leading-6 mb-4">{profile.email}</p>
//             </div>
//             <span className="text-[10px] font-bold tracking-widest text-[#9333ea] bg-[#9266900D] border border-[#9266901A] px-3 py-1.5 rounded-full uppercase">
//               {profile.stage}
//             </span>
//           </div>

//      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
//            {/* Middle: Registration Details + Log Preferences */}
//           <div className="flex-1 flex flex-col gap-6 lg:ml-10">
//             {/* Registration Details */}
//             <div>
//               <p className="text-[10px] font-extrabold tracking-[2px] leading-4 text-[#4A3A3733] uppercase mb-2">Registration Details</p>
//               <div className="flex flex-col gap-2.5">
//                 <div className="flex items-center gap-2.5 mb-3">
//                   <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-300 flex-shrink-0">
//                     <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
//                     <path d="M4 1v2M10 1v2M1 6h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
//                   </svg>
//                   <span className="text-sm text-[#4A3A37B2] font-normal leading-5 ">Joined: {profile.joined}</span>
//                 </div>
//                 <div className="flex items-center gap-2.5 mb-3">
                 
//                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
//   <g clip-path="url(#clip0_211_10348)">
//     <path d="M7.99129 14.6504C11.6691 14.6504 14.6505 11.669 14.6505 7.99116C14.6505 4.31336 11.6691 1.33191 7.99129 1.33191C4.31348 1.33191 1.33203 4.31336 1.33203 7.99116C1.33203 11.669 4.31348 14.6504 7.99129 14.6504Z" stroke="#4A3A37" stroke-opacity="0.2" stroke-width="1.33185" stroke-linecap="round" stroke-linejoin="round"/>
//     <path d="M7.99085 1.33191C6.28091 3.12735 5.32715 5.51175 5.32715 7.99116C5.32715 10.4706 6.28091 12.855 7.99085 14.6504C9.70079 12.855 10.6546 10.4706 10.6546 7.99116C10.6546 5.51175 9.70079 3.12735 7.99085 1.33191Z" stroke="#4A3A37" stroke-opacity="0.2" stroke-width="1.33185" stroke-linecap="round" stroke-linejoin="round"/>
//     <path d="M1.33203 7.99109H14.6505" stroke="#4A3A37" stroke-opacity="0.2" stroke-width="1.33185" stroke-linecap="round" stroke-linejoin="round"/>
//   </g>
//   <defs>
//     <clipPath id="clip0_211_10348">
//       <rect width="15.9822" height="15.9822" fill="white"/>
//     </clipPath>
//   </defs>
// </svg>
//                   <span className="text-sm text-[#4A3A37B2] font-normal leading-5 ">Region: {profile.region}</span>
//                 </div>
//                 <div className="flex items-center  gap-2.5">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
//   <g clip-path="url(#clip0_211_10355)">
//     <path d="M14.6505 4.6615L8.6632 8.47525C8.46003 8.59326 8.22925 8.65542 7.99428 8.65542C7.75932 8.65542 7.52854 8.59326 7.32536 8.47525L1.33203 4.6615" stroke="#4A3A37" stroke-opacity="0.2" stroke-width="1.33185" stroke-linecap="round" stroke-linejoin="round"/>
//     <path d="M13.3187 2.6637H2.66388C1.92832 2.6637 1.33203 3.25999 1.33203 3.99555V11.9867C1.33203 12.7222 1.92832 13.3185 2.66388 13.3185H13.3187C14.0542 13.3185 14.6505 12.7222 14.6505 11.9867V3.99555C14.6505 3.25999 14.0542 2.6637 13.3187 2.6637Z" stroke="#4A3A37" stroke-opacity="0.2" stroke-width="1.33185" stroke-linecap="round" stroke-linejoin="round"/>
//   </g>
//   <defs>
//     <clipPath id="clip0_211_10355">
//       <rect width="15.9822" height="15.9822" fill="white"/>
//     </clipPath>
//   </defs>
// </svg>
//                   <span className="text-sm text-[#4A3A37B2] font-normal leading-5 ">Contact: {profile.contact}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Log Preferences */}
//             <div>
//               <p className="text-[10px] font-extrabold tracking-[2px] leading-4 text-[#4A3A3733] uppercase mb-2">Log Preferences</p>
//               <div className="flex flex-wrap gap-2">
//                 {profile.logPreferences.map((pref: string) => (
//                   <span
//                     key={pref}
//                     className="text-[10px] font-semibold bg-[#FAF7F5] border border-borderColor text-titleColor  px-4 py-2 rounded-[10px]"
//                   >
//                     {pref}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Right: Topics of Interest + Suspend */}
//           <div className="flex flex-col gap-6  flex-shrink-0">
//             {/* Topics */}
//             <div>
//               <p className="text-[10px] font-extrabold tracking-[2px] leading-4 text-[#4A3A3733] uppercase mb-2">Topics of Interest</p>
//               <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row gap-2 mb-4">
//                 {profile.topics.map((t: TopicBadge) => (
//                   <span
//                     key={t.label}
//                     className="text-xs font-semibold border border-[#9266901A] text-buttonColor bg-[#9266900D] px-4 py-2 rounded-full"
//                   >
//                     {t.label}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* Suspend Account */}
//             <div>
//               <button
//                 onClick={handleSuspendClick}
//                 className={`w-full py-3 rounded-2xl border border-[#ECC3B44D] text-xs font-extrabold tracking-widest uppercase transition-all cursor-pointer ${
//                   suspended
//                     ? "border-green-200 text-green-500 hover:bg-green-50"
//                     : "border-gray-100 text-red-400 hover:bg-red-50 hover:border-red-100"
//                 }`}
//               >
//                 {suspended ? "REACTIVATE ACCOUNT" : "SUSPEND ACCOUNT"}
//               </button>
//               {suspended && (
//                 <p className="text-[10px] text-red-300 text-center mt-1.5">Account is currently suspended</p>
//               )}
//             </div>
//           </div>
//        </div>
//         </div>
//       </div>

//       {/* Confirm Modal */}
//       {showConfirm && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">

//     <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">

//       {/* Close Button */}
//       <button
//         onClick={() => setShowConfirm(false)}
//         className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
//       >
//         ×
//       </button>

//       {/* Title */}
//       <h3 className="text-base md:text-lg font-bold text-[#0A0A0A] mb-2">
//         Suspend Account
//       </h3>

//       <p className="text-sm text-[#6A7282] font-normal leading-5 mb-6">
//         Are you sure you want to suspend {profile.name}? This action will
//         prevent the user from logging in.
//       </p>

//       {/* Options */}
//       <div className="space-y-4 py-4 mb-6">

//         {/* Option 1 */}
//         <label className="flex items-start gap-3 cursor-pointer">
//           <input
//             type="radio"
//             name="suspendOption"
//             value="notify"
//             checked={selectedOption === "notify"}
//             onChange={(e) => setSelectedOption(e.target.value)}
//             className="mt-1 accent-red-500"
//           />
//           <span className="text-sm text-[#0A0A0A] font-normal leading-5">
//             Notify user of suspension
//           </span>
//         </label>

//         {/* Option 2 */}
//         <label className="flex items-start gap-3 cursor-pointer">
//           <input
//             type="radio"
//             name="suspendOption"
//             value="export"
//             checked={selectedOption === "export"}
//             onChange={(e) => setSelectedOption(e.target.value)}
//             className="mt-1 accent-red-500"
//           />
//           <div>
//             <p className="text-sm text-[#0A0A0A] font-normal leading-5 mb-1">
//               Send data export
//             </p>
//             <p className="text-xs text-[#6A7282] font-normal leading-4">
//               Ensures the user can access their information upon request.
//             </p>
//           </div>
//         </label>

//       </div>

//       {/* Reason Field */}
//       <div className="mb-6">
//         <label className="text-sm text-[#0A0A0A] font-normal leading-5 mb-2">
//           Reason for suspension (Optional)
//         </label>

//         <textarea
//           value={reason}
//           onChange={(e) => setReason(e.target.value)}
//           placeholder="Enter reason for suspension..."
//           className="w-full h-28 border border-gray-200 rounded-xl mt-2 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
//         />
//       </div>

//       {/* Footer Buttons */}
//       <div className="flex justify-end gap-3">
//         <button
//           onClick={() => setShowConfirm(false)}
//           className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={handleConfirmSuspend}
//           className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 cursor-pointer"
//         >
//           Suspend Account
//         </button>
//       </div>

//     </div>
//   </div>
// )}
//     </div>
//   );
// }