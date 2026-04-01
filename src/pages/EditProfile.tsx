import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import profile from '../../public/img/adminProfile.png';
import ChangePasswordDemo from "../Component/profile/ChangePasswordModal";
import { useGetAdminProfileQuery, useUpdateAdminProfileMutation } from "../redux/features/admin/profileApi";
import { toast } from "react-toastify";

// ─── Icons ────────────────────────────────────────────────────────────────────
const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
const SaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
  </svg>
);
const XIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);
const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const MapPinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

// ─── Form State Type ──────────────────────────────────────────────────────────
interface FormState {
  username: string;
  contactNo: string;
  lang: string;
  avatarFile: File | null;
  avatarPreview: string;
  fullName: string;
  address: string;
  intro: string;
  city: string;
  state: string;
  zip: string;
  location: string;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-10 w-48 bg-gray-200 rounded-lg" />
    <div className="bg-white rounded-4xl border border-borderColor p-6 h-32" />
    <div className="bg-white rounded-4xl border border-borderColor p-6 h-52" />
    <div className="bg-white rounded-4xl border border-borderColor p-6 h-64" />
  </div>
);

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function EditProfile() {
  const navigate = useNavigate();
  const { data: admin, isLoading } = useGetAdminProfileQuery();
  const [updateAdmin, { isLoading: isSaving }] = useUpdateAdminProfileMutation();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Initialize form from API data
  const [form, setForm] = useState<FormState>({
    username: "",
    contactNo: "",
    lang: "",
    avatarFile: null,
    avatarPreview: "",
    fullName: "",
    address: "",
    intro: "",
    city: "",
    state: "",
    zip: "",
    location: "",
  });

  // Sync once when data loads
  const initialized = useRef(false);
  if (admin && !initialized.current) {
    initialized.current = true;
    form.username = admin.username || "";
    form.contactNo = admin.contactNo || "";
    form.lang = admin.lang || "";
    form.avatarPreview = admin.avatar || "";
    form.fullName = admin.admin?.fullName || "";
    form.address = admin.admin?.address || "";
    form.intro = admin.admin?.intro || "";
    form.city = admin.admin?.city || "";
    form.state = admin.admin?.state || "";
    form.zip = admin.admin?.zip || "";
    form.location = admin.admin?.location || "";
  }

  const set = (field: keyof FormState, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      set("avatarFile", file);
      set("avatarPreview", URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      await updateAdmin({
        input: {
          userId: admin?.id,
          username: form.username,
          contactNo: form.contactNo,
          lang: form.lang,
          admin: {
            fullName: form.fullName,
            address: form.address,
            intro: form.intro,
            city: form.city,
            state: form.state,
            zip: form.zip,
            location: form.location,
          },
        },
        avatarFile: form.avatarFile ?? undefined,
      }).unwrap();

      toast.success("Profile updated successfully!", { position: "top-right" });
      navigate('/dashboard/profile');
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error("Failed to update profile.", { position: "top-right" });
    }
  };

  if (isLoading) return <div className="min-h-screen p-4 md:p-8"><Skeleton /></div>;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="space-y-4">

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-titleColor tracking-tight leading-10">Edit Profile</h1>
          <p className="text-sm text-subTitleColor font-medium mt-1">Update your personal information and account settings.</p>
        </div>

        {/* Profile Picture */}
        <div className="bg-white rounded-2xl md:rounded-4xl border border-borderColor shadow-sm p-5 sm:p-6">
          <h2 className="text-base md:text-xl font-black text-titleColor tracking-tight mb-6">Profile Picture</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-100 border-2 border-white shadow-md flex-shrink-0">
              <img
                src={form.avatarPreview || profile}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = profile; }}
              />
            </div> 
            <div>
              <p className="text-xs text-subTitleColor uppercase tracking-widest font-black mb-3">Change Profile Picture</p>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <button onClick={() => fileRef.current?.click()} className="flex items-center bg-buttonColor cursor-pointer gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-white hover:opacity-90">
                  <UploadIcon /> Upload New
                </button>
                <button onClick={() => { set("avatarFile", null); set("avatarPreview", ""); }} className="px-3.5 py-2 rounded-2xl text-xs font-semibold text-red-500 border border-borderColor cursor-pointer hover:bg-red-50">
                  Remove
                </button>
              </div>
              <p className="text-xs text-subTitleColor">Recommended: Square image, at least 400×400px. Max 5MB.</p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-2xl md:rounded-4xl border border-borderColor shadow-sm p-5 sm:p-6">
          <h2 className="text-base md:text-xl font-black text-titleColor tracking-tight mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-subTitleColor uppercase tracking-widest font-black mb-3">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"><UserIcon /></span>
                <input type="text" value={form.username} onChange={(e) => set("username", e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-borderColor text-sm bg-[#FAF7F5] focus:outline-none focus:border-buttonColor transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-subTitleColor uppercase tracking-widest font-black mb-3">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"><MailIcon /></span>
                <input type="email" value={admin?.email || ""} disabled
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-borderColor text-sm bg-[#FAF7F5] text-gray-400 cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-subTitleColor uppercase tracking-widest font-black mb-3">Contact No</label>
              <input type="text" value={form.contactNo} onChange={(e) => set("contactNo", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-borderColor text-sm bg-[#FAF7F5] focus:outline-none focus:border-buttonColor transition-all" />
            </div>
            <div>
              <label className="block text-xs text-subTitleColor uppercase tracking-widest font-black mb-3">Full Name</label>
              <input type="text" value={form.fullName} onChange={(e) => set("fullName", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-borderColor text-sm bg-[#FAF7F5] focus:outline-none focus:border-buttonColor transition-all" />
            </div>
          </div><q></q>
          <div>
            <label className="block text-xs text-subTitleColor uppercase tracking-widest font-black mb-3">Bio / Intro</label>
            <textarea value={form.intro} onChange={(e) => set("intro", e.target.value)} rows={4}
              className="w-full px-4 py-3 rounded-xl border border-borderColor text-sm bg-[#FAF7F5] focus:outline-none focus:border-buttonColor transition-all" />
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-2xl md:rounded-4xl border border-borderColor shadow-sm p-5 sm:p-6">
          <h2 className="text-base md:text-xl font-black text-titleColor tracking-tight mb-6">Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div className="md:col-span-2">
              <label className="block text-xs text-subTitleColor uppercase tracking-widest font-black mb-3">Street Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"><MapPinIcon /></span>
                <input type="text" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="123 Health Street"
                  className="w-full bg-[#fcfaf9] border border-gray-100 rounded-2xl py-4 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-buttonColor/10 focus:border-buttonColor transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-subTitleColor uppercase tracking-widest font-black mb-3">City</label>
              <input type="text" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="San Francisco"
                className="w-full bg-[#fcfaf9] border border-gray-100 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-buttonColor/10 focus:border-buttonColor transition-all" />
            </div>
            <div>
              <label className="block text-xs text-subTitleColor uppercase tracking-widest font-black mb-3">State</label>
              <input type="text" value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="CA"
                className="w-full bg-[#fcfaf9] border border-gray-100 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-buttonColor/10 focus:border-buttonColor transition-all" />
            </div>
            <div>
              <label className="block text-xs text-subTitleColor uppercase tracking-widest font-black mb-3">ZIP Code</label>
              <input type="text" value={form.zip} onChange={(e) => set("zip", e.target.value)} placeholder="94102"
                className="w-full bg-[#fcfaf9] border border-gray-100 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-buttonColor/10 focus:border-buttonColor transition-all" />
            </div>
            <div>
              <label className="block text-xs text-subTitleColor uppercase tracking-widest font-black mb-3">Location Display</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"><MapPinIcon /></span>
                <input type="text" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="San Francisco, CA"
                  className="w-full bg-[#fcfaf9] border border-gray-100 rounded-2xl py-4 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-buttonColor/10 focus:border-buttonColor transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl md:rounded-4xl border border-borderColor shadow-sm p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 rounded-lg bg-[#9266901A] text-buttonColor"><LockIcon /></div>
            <h2 className="text-base md:text-xl font-black text-titleColor tracking-tight">Security &amp; Password</h2>
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-xs text-subTitleColor uppercase tracking-[1.5px] font-black mb-0.5">Last Password Change</p>
              <p className="text-sm text-titleColor font-medium">February 15, 2026</p>
            </div>
            <button onClick={() => setIsPasswordModalOpen(true)}
              className="text-xs font-bold text-buttonColor border border-borderColor py-2 px-4 cursor-pointer uppercase tracking-widest rounded-full transition-colors">
              Change Password
            </button>
          </div>
          {isPasswordModalOpen && (
            <ChangePasswordDemo isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 pb-4">
          <button onClick={() => navigate('/dashboard/profile')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-borderColor text-sm font-semibold text-gray-500 cursor-pointer bg-white hover:bg-gray-50 transition-all">
            <XIcon /> Cancel Changes
          </button>
          <button onClick={handleSave} disabled={isSaving}
            className="flex items-center bg-buttonColor cursor-pointer gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-70">
            <SaveIcon /> {isSaving ? "Saving…" : "Save All Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}









// import { useState, useRef } from "react";
// import profile from '../../public/img/adminProfile.png'
// import ChangePasswordDemo from "../Component/profile/ChangePasswordModal";
// import AddressInformation from "../Component/profile/AddressInfo";

// // ─── Icons ────────────────────────────────────────────────────────────────────
// const UploadIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
//     <polyline points="17 8 12 3 7 8" />
//     <line x1="12" y1="3" x2="12" y2="15" />
//   </svg>
// );

// const SaveIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
//     <polyline points="17 21 17 13 7 13 7 21" />
//     <polyline points="7 3 7 8 15 8" />
//   </svg>
// );

// const XIcon = () => (
//   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//     <line x1="18" y1="6" x2="6" y2="18" />
//     <line x1="6" y1="6" x2="18" y2="18" />
//   </svg>
// );

// const MailIcon = () => (
//   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
//     <polyline points="22,6 12,13 2,6" />
//   </svg>
// );

// const UserIcon = () => (
//   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//     <circle cx="12" cy="7" r="4" />
//   </svg>
// );

// const LockIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
//     <path d="M7 11V7a5 5 0 0 1 10 0v4" />
//   </svg>
// );



// // ─── Section 1: Page Title ────────────────────────────────────────────────────
// const PageTitle = () => (
//   <div className="mb-6">
//     <h1 className="text-2xl sm:text-3xl md:text-4xl leading-6 md:leading-11 font-black text-titleColor tracking-tight">Edit Profile</h1>
//     <p className="text-sm text-subTitleColor font-medium leading-5 mt-1">Update your personal information and account settings.</p>
//   </div>
// );

// // ─── Section 2: Profile Picture ───────────────────────────────────────────────
// const ProfilePictureSection = () => {
//   const [preview, setPreview] = useState<string | null>(null);
//   const fileRef = useRef<HTMLInputElement>(null);

//   const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setPreview(url);
//     }
//   };

//   const handleRemove = () => {
//     setPreview(null);
//     if (fileRef.current) fileRef.current.value = "";
//   };

//   return (
//     <div className="bg-white rounded-2xl md:rounded-4xl border border-borderColor shadow-sm p-5 sm:p-6">
//       <h2 className="text-base md:text-xl font-black text-titleColor mb-4 tracking-tight mb-6">Profile Picture</h2>

//       <div className="flex flex-col sm:flex-row sm:items-center gap-4">
//         {/* Avatar preview */}
//         <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-100 border-2 border-white shadow-md flex-shrink-0">
//           {preview ? (
//             <img src={preview} alt="Preview" className="w-full h-full object-cover" />
//           ) : (
//             <>
//               <img
//                 src={profile}
//                 alt="Nolan"
//                 className="w-full h-full object-cover"
//                 onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
//               />
             
//             </>
//           )}
//         </div>

//         {/* Upload controls */}
//         <div>
//           <p className="text-xs text-subTitleColor  uppercase tracking-widest font-black mb-3">Change Profile Picture</p>
//           <div className="flex items-center gap-2 flex-wrap mb-3">
//             <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
//             <button
//               onClick={() => fileRef.current?.click()}
//               className="flex items-center bg-buttonColor cursor-pointer gap-1.5 px-3.5 py-2 rounded-2xl text-xs tracking-[1px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
           
//             >
//               <UploadIcon />
//               Upload New
//             </button>
//             <button
//               onClick={handleRemove}
//               className="px-3.5 py-2 rounded-2xl text-xs font-semibold text-red-500 border border-borderColor cursor-pointer tracking-[1px] hover:bg-red-100 transition-all duration-200"
//             >
//               Remove
//             </button>
//           </div>
//           <p className="text-xs text-subTitleColor  mt-2">
//             Recommended: Square image, at least 400×400px. Max file size 5MB.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Section 3: Basic Information ─────────────────────────────────────────────
// const BasicInfoSection = () => {
//   const [firstName, setFirstName] = useState("Nolan");
//   const [email, setEmail] = useState("nolan@navellehealth.com");
//   const [bio, setBio] = useState("");

//   return (
//     <div className="bg-white rounded-2xl md:rounded-4xl border border-borderColor shadow-sm p-5 sm:p-6">
//       <h2 className="text-base md:text-xl font-black text-titleColor mb-4 tracking-tight mb-6">Basic Information</h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//         {/* First Name */}
//         <div>
//           <label className="block text-xs text-subTitleColor  uppercase tracking-widest font-black leading-5 tracking-[1px] mb-3">
//             First Name *
//           </label>
//           <div className="relative">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
//               <UserIcon />
//             </span>
//             <input
//               type="text"
//               value={firstName}
//               onChange={(e) => setFirstName(e.target.value)}
//               placeholder="Nolan"
//               className="w-full pl-9 pr-4 py-3 rounded-xl border border-borderColor text-sm text-subTitleColor bg-[#FAF7F5] placeholder-subTileColor focus:outline-none focus:border-buttonColor  focus:ring-buttonColor transition-all"
//             />
//           </div>
//         </div>

//         {/* Email */}
//         <div>
//            <label className="block text-xs text-subTitleColor  uppercase tracking-widest font-black leading-5 tracking-[1px] mb-3">
//             Email Address *
//           </label>
//           <div className="relative">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
//               <MailIcon />
//             </span>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="nolan@navellehealth.com"
//               className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-borderColor text-sm text-subTitleColor bg-[#FAF7F5] placeholder-subTileColor focus:outline-none focus:border-buttonColor  transition-all"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Bio */}
//       <div>
//          <label className="block text-xs text-subTitleColor  uppercase tracking-widest font-black leading-5 tracking-[1px] mb-3">
//           Bio / Description
//         </label>
//         <textarea
//           value={bio}
//           onChange={(e) => setBio(e.target.value)}
//           placeholder="Enter a brief description about yourself"
//           rows={4}
//           className="w-full px-4 py-3 rounded-xl border border-borderColor text-sm text-subTitleColor bg-[#FAF7F5] placeholder-subTileColor focus:outline-none focus:border-buttonColor  transition-all"
//         />
//       </div>
//     </div>
//   );
// };

// // ─── Section 4: Security & Password ──────────────────────────────────────────
// const SecuritySection = () => {
 

//   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

//   return (
//     <div className="bg-white rounded-2xl md:rounded-4xl border border-borderColor shadow-sm p-5 sm:p-6">
//       {/* Header */}
//       <div className="flex items-center gap-2 mb-5">
//         <div className="p-2 rounded-lg bg-[#9266901A] text-buttonColor">
//           <LockIcon />
//         </div>
//         <h2 className="text-base md:text-xl font-black text-titleColor  tracking-tight ">Security &amp; Password</h2>
//       </div>

//       <div className="divide-y divide-gray-50">
 

//         {/* Last Password Change */}
//         <div className="flex items-start sm:items-center justify-between py-4 gap-3">
//           <div>
//             <p className="text-xs text-subTitleColor uppercase tracking-[1.5px] font-black leading-5 mb-0.5">
//               Last Password Change
//             </p>
//             <p className="text-sm text-titleColor font-medium leading-5">February 15, 2026</p>
//           </div>
//           <button  onClick={() => setIsPasswordModalOpen(true)} className="text-xs font-bold text-buttonColor border border-borderColor py-2 px-4 cursor-pointer uppercase tracking-widest rounded-full  transition-colors flex-shrink-0">
//             Change Password
//           </button>
//         </div>

    
//       </div>
//       {isPasswordModalOpen && (
//   <ChangePasswordDemo
//     isOpen={isPasswordModalOpen}
//     onClose={() => setIsPasswordModalOpen(false)}
//   />
// )}
//     </div>
//   );
// };

// // ─── Section 5: Action Buttons ────────────────────────────────────────────────
// const ActionButtons = ({ onCancel }: { onCancel: () => void }) => {
//   const [saving, setSaving] = useState(false);

//   const handleSave = () => {
//     setSaving(true);
//     setTimeout(() => setSaving(false), 1800);
//   };

//   return (
//     <div className="flex items-center justify-end gap-3 pt-2 pb-4">
//       <button
//         onClick={onCancel}
//         className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-borderColor text-sm font-semibold text-gray-500 cursor-pointer  bg-white hover:bg-gray-50 hover:text-gray-700 transition-all duration-200"
//       >
//         <XIcon />
//         Cancel Changes
//       </button>

//       <button
//         onClick={handleSave}
//         disabled={saving}
//         className="flex items-center bg-buttonColor cursor-pointer  gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-70"
       
//       >
//         <SaveIcon />
//         {saving ? "Saving…" : "Save All Changes"}
//       </button>
//     </div>
//   );
// };

// // ─── Root Component ───────────────────────────────────────────────────────────
// export default function EditProfile() {
//   return (
//     <div
//       className="min-h-screen p-4 md:p-8"
   
//     >
//       <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

//       <div className=" space-y-4">
//         {/* Section 1: Title */}
//         <PageTitle />

//         {/* Section 2: Profile Picture */}
//         <ProfilePictureSection />

//         {/* Section 3: Basic Info */}
//         <BasicInfoSection />
//         <AddressInformation/>

//         {/* Section 4: Security */}
//         <SecuritySection />

//         {/* Section 5: Action Buttons */}
//         <ActionButtons onCancel={() => alert("Changes cancelled")} />
//       </div>
//     </div>
//   );
// }