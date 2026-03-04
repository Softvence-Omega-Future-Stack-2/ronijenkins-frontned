import { useState, useRef } from "react";
import profile from '../../public/img/adminProfile.png'
import ChangePasswordDemo from "../Component/profile/ChangePasswordModal";

// ─── Icons ────────────────────────────────────────────────────────────────────
const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const SaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const XIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const DotIcon = ({ color }: { color: string }) => (
  <span
    className="inline-block w-2 h-2 rounded-full flex-shrink-0"
    style={{
      background: color,
      boxShadow: `0 0 0 3px ${color}26`,
    }}
  />
);

// ─── Section 1: Page Title ────────────────────────────────────────────────────
const PageTitle = () => (
  <div className="mb-6">
    <h1 className="text-2xl sm:text-3xl md:text-4xl leading-6 md:leading-11 font-black text-titleColor tracking-tight">Edit Profile</h1>
    <p className="text-sm text-subTitleColor font-medium leading-5 mt-1">Update your personal information and account settings.</p>
  </div>
);

// ─── Section 2: Profile Picture ───────────────────────────────────────────────
const ProfilePictureSection = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-2xl md:rounded-4xl border border-borderColor shadow-sm p-5 sm:p-6">
      <h2 className="text-base md:text-xl font-black text-titleColor mb-4 tracking-tight mb-6">Profile Picture</h2>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Avatar preview */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-100 border-2 border-white shadow-md flex-shrink-0">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <img
                src={profile}
                alt="Nolan"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
             
            </>
          )}
        </div>

        {/* Upload controls */}
        <div>
          <p className="text-xs text-subTitleColor  uppercase tracking-widest font-black mb-3">Change Profile Picture</p>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center bg-buttonColor cursor-pointer gap-1.5 px-3.5 py-2 rounded-2xl text-xs tracking-[1px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
           
            >
              <UploadIcon />
              Upload New
            </button>
            <button
              onClick={handleRemove}
              className="px-3.5 py-2 rounded-2xl text-xs font-semibold text-red-500 border border-borderColor cursor-pointer tracking-[1px] hover:bg-red-100 transition-all duration-200"
            >
              Remove
            </button>
          </div>
          <p className="text-xs text-subTitleColor  mt-2">
            Recommended: Square image, at least 400×400px. Max file size 5MB.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Section 3: Basic Information ─────────────────────────────────────────────
const BasicInfoSection = () => {
  const [firstName, setFirstName] = useState("Nolan");
  const [email, setEmail] = useState("nolan@navellehealth.com");
  const [bio, setBio] = useState("");

  return (
    <div className="bg-white rounded-2xl md:rounded-4xl border border-borderColor shadow-sm p-5 sm:p-6">
      <h2 className="text-base md:text-xl font-black text-titleColor mb-4 tracking-tight mb-6">Basic Information</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* First Name */}
        <div>
          <label className="block text-xs text-subTitleColor  uppercase tracking-widest font-black leading-5 tracking-[1px] mb-3">
            First Name *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
              <UserIcon />
            </span>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Nolan"
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-borderColor text-sm text-subTitleColor bg-[#FAF7F5] placeholder-subTileColor focus:outline-none focus:border-buttonColor  focus:ring-buttonColor transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
           <label className="block text-xs text-subTitleColor  uppercase tracking-widest font-black leading-5 tracking-[1px] mb-3">
            Email Address *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
              <MailIcon />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nolan@navellehealth.com"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-borderColor text-sm text-subTitleColor bg-[#FAF7F5] placeholder-subTileColor focus:outline-none focus:border-buttonColor  transition-all"
            />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
         <label className="block text-xs text-subTitleColor  uppercase tracking-widest font-black leading-5 tracking-[1px] mb-3">
          Bio / Description
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Enter a brief description about yourself"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-borderColor text-sm text-subTitleColor bg-[#FAF7F5] placeholder-subTileColor focus:outline-none focus:border-buttonColor  transition-all"
        />
      </div>
    </div>
  );
};

// ─── Section 4: Security & Password ──────────────────────────────────────────
const SecuritySection = () => {
  const [twoFA, setTwoFA] = useState(true);
  const [loginNotif, setLoginNotif] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl md:rounded-4xl border border-borderColor shadow-sm p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-lg bg-[#9266901A] text-buttonColor">
          <LockIcon />
        </div>
        <h2 className="text-base md:text-xl font-black text-titleColor  tracking-tight ">Security &amp; Password</h2>
      </div>

      <div className="divide-y divide-gray-50">
        {/* Two-Factor Auth */}
        <div className="flex items-start sm:items-center justify-between py-4 gap-3">
          <div>
            <p className="text-xs text-subTitleColor uppercase tracking-[1.5px] font-black leading-5 mb-0.5">
              Two-Factor Authentication
            </p>
            <p className="text-titleColor font-medium leading-5">Add an extra layer of security to your account</p>
          </div>
          <button
            onClick={() => setTwoFA(!twoFA)}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest flex-shrink-0 transition-all"
            style={{ color: twoFA ? "#22c55e" : "#9ca3af" }}
          >
            <DotIcon color={twoFA ? "#22c55e" : "#9ca3af"} />
            {twoFA ? "Enabled" : "Disabled"}
          </button>
        </div>

        {/* Last Password Change */}
        <div className="flex items-start sm:items-center justify-between py-4 gap-3">
          <div>
            <p className="text-xs text-subTitleColor uppercase tracking-[1.5px] font-black leading-5 mb-0.5">
              Last Password Change
            </p>
            <p className="text-sm text-titleColor font-medium leading-5">February 15, 2026</p>
          </div>
          <button  onClick={() => setIsPasswordModalOpen(true)} className="text-xs font-bold text-buttonColor border border-borderColor py-2 px-4 cursor-pointer uppercase tracking-widest rounded-full  transition-colors flex-shrink-0">
            Change Password
          </button>
        </div>

        {/* Login Notifications */}
        <div className="flex items-start sm:items-center justify-between py-4 gap-3">
          <div>
            <p className="text-xs text-subTitleColor uppercase tracking-[1.5px] font-black leading-5 mb-0.5">
              Login Notifications
            </p>
            <p className="text-sm text-titleColor font-medium leading-5 ">Get notified when someone logs into your account</p>
          </div>
          <button
            onClick={() => setLoginNotif(!loginNotif)}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest flex-shrink-0 transition-all"
            style={{ color: loginNotif ? "#22c55e" : "#9ca3af" }}
          >
            <DotIcon color={loginNotif ? "#22c55e" : "#9ca3af"} />
            {loginNotif ? "Enabled" : "Disabled"}
          </button>
        </div>
      </div>
      {isPasswordModalOpen && (
  <ChangePasswordDemo
    isOpen={isPasswordModalOpen}
    onClose={() => setIsPasswordModalOpen(false)}
  />
)}
    </div>
  );
};

// ─── Section 5: Action Buttons ────────────────────────────────────────────────
const ActionButtons = ({ onCancel }: { onCancel: () => void }) => {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1800);
  };

  return (
    <div className="flex items-center justify-end gap-3 pt-2 pb-4">
      <button
        onClick={onCancel}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-borderColor text-sm font-semibold text-gray-500 cursor-pointer  bg-white hover:bg-gray-50 hover:text-gray-700 transition-all duration-200"
      >
        <XIcon />
        Cancel Changes
      </button>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center bg-buttonColor cursor-pointer  gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-70"
       
      >
        <SaveIcon />
        {saving ? "Saving…" : "Save All Changes"}
      </button>
    </div>
  );
};

// ─── Root Component ───────────────────────────────────────────────────────────
export default function EditProfile() {
  return (
    <div
      className="min-h-screen p-4 md:p-8"
   
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <div className=" space-y-4">
        {/* Section 1: Title */}
        <PageTitle />

        {/* Section 2: Profile Picture */}
        <ProfilePictureSection />

        {/* Section 3: Basic Info */}
        <BasicInfoSection />

        {/* Section 4: Security */}
        <SecuritySection />

        {/* Section 5: Action Buttons */}
        <ActionButtons onCancel={() => alert("Changes cancelled")} />
      </div>
    </div>
  );
}