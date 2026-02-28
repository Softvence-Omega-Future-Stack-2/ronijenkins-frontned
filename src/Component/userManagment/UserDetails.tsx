import { useState } from "react";

interface TopicBadge {
  label: string;
}

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  stage: string;
  joined: string;
  region: string;
  contact: string;
  logPreferences: string[];
  topics: TopicBadge[];
}


const profile: UserProfile = {
  name: "Jasmine Lee",
  email: "j.lee@health.co",
  avatar: "https://i.pravatar.cc/120?img=47",
  stage: "PERIMENOPAUSE",
  joined: "Jan 12, 2026",
  region: "Europe",
  contact: "+44 20 7123 4567",
  logPreferences: ["Hot Flashes", "Brain Fog"],
  topics: [{ label: "Hormones & HRT" }, { label: "Nutrition & Weight" }],
};

export default function UserProfileDetail() {
  const [suspended, setSuspended] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleSuspendClick = () => {
    if (suspended) {
      setSuspended(false);
    } else {
      setShowConfirm(true);
    }
  };

  const handleConfirmSuspend = () => {
    setSuspended(true);
    setShowConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb] p-4 sm:p-6 lg:p-8 font-sans">

      {/* Back Nav */}
      <button className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#7c4d8a] uppercase mb-6 hover:opacity-70 transition-opacity">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to User List
      </button>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 relative">



        {/* Main grid */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">

          {/* Left: Avatar + Name */}
          <div className="flex flex-col items-start gap-3 sm:w-44 flex-shrink-0">
            {imgError ? (
              <div className="w-28 h-28 rounded-2xl bg-[#e9d5f5] flex items-center justify-center text-[#7c4d8a] text-3xl font-bold">
                {profile.name[0]}
              </div>
            ) : (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-28 h-28 rounded-2xl object-cover"
                onError={(_e: React.SyntheticEvent<HTMLImageElement>) => setImgError(true)}
              />
            )}
            <div>
              <h2 className="text-xl font-bold text-[#2a1f1f]">{profile.name}</h2>
              <p className="text-sm text-gray-400">{profile.email}</p>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-[#9333ea] border border-[#e9d5f5] px-3 py-1.5 rounded-full uppercase">
              {profile.stage}
            </span>
          </div>

          {/* Middle: Registration Details + Log Preferences */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Registration Details */}
            <div>
              <p className="text-[10px] font-extrabold tracking-[2px] leading-4 text-[#4A3A3733] uppercase mb-3">Registration Details</p>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-300 flex-shrink-0">
                    <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M4 1v2M10 1v2M1 6h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  <span className="text-sm text-[#2a1f1f]">Joined: {profile.joined}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-300 flex-shrink-0">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M7 4v3l2 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  <span className="text-sm text-[#2a1f1f]">Region: {profile.region}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-300 flex-shrink-0">
                    <rect x="1.5" y="1.5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M4 5h6M4 7.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  <span className="text-sm text-[#2a1f1f]">Contact: {profile.contact}</span>
                </div>
              </div>
            </div>

            {/* Log Preferences */}
            <div>
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Log Preferences</p>
              <div className="flex flex-wrap gap-2">
                {profile.logPreferences.map((pref: string) => (
                  <span
                    key={pref}
                    className="text-xs font-semibold bg-[#f7f3f0] text-[#6b5b5b] px-3 py-1.5 rounded-full"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Topics of Interest + Suspend */}
          <div className="flex flex-col gap-6 sm:w-56 flex-shrink-0">
            {/* Topics */}
            <div>
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Topics of Interest</p>
              <div className="flex flex-wrap gap-2">
                {profile.topics.map((t: TopicBadge) => (
                  <span
                    key={t.label}
                    className="text-xs font-semibold border border-gray-200 text-[#6b5b5b] px-3 py-1.5 rounded-full"
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Suspend Account */}
            <div>
              <button
                onClick={handleSuspendClick}
                className={`w-full py-3 rounded-2xl border text-xs font-bold tracking-widest uppercase transition-all ${
                  suspended
                    ? "border-green-200 text-green-500 hover:bg-green-50"
                    : "border-gray-100 text-red-400 hover:bg-red-50 hover:border-red-100"
                }`}
              >
                {suspended ? "REACTIVATE ACCOUNT" : "SUSPEND ACCOUNT"}
              </button>
              {suspended && (
                <p className="text-[10px] text-red-300 text-center mt-1.5">Account is currently suspended</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/10"
            onClick={() => setShowConfirm(false)}
          />
          <div className="relative z-10 bg-white rounded-3xl shadow-xl p-6 w-full max-w-xs mx-4">
            <h3 className="text-base font-bold text-[#2a1f1f] mb-2">Suspend Account?</h3>
            <p className="text-sm text-gray-400 mb-5">
              {profile.name} will lose access to the platform immediately.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-full border-2 border-gray-200 text-sm font-bold text-gray-400 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSuspend}
                className="flex-1 py-2.5 rounded-full bg-red-400 text-white text-sm font-bold hover:bg-red-500 transition-colors"
              >
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}