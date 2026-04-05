import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, ShieldCheck, Loader2 } from 'lucide-react';

import { toast } from 'react-toastify';
import { useChangePasswordMutation } from '../../redux/features/auth/authAPi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Form States
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // API Hook
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  if (!isOpen) return null;

  const handleUpdate = async () => {
    // ১. ভ্যালিডেশন
    if (!oldPass || !newPass || !confirmPass) {
      return toast.error("All fields are required",{position:'top-right'});
    }
    if (newPass !== confirmPass) {
      return toast.error("New passwords do not match!",{position:'top-right'});
    }
    if (newPass.length < 6) {
      return toast.error("Password must be at least 6 characters",{position:'top-right'});
    }

    try {
    
      const res = await changePassword({ oldPass, newPass }).unwrap();

      
      if (res?.data === true || res === true) {
        toast.success("Password updated successfully!",{position:'top-right'});
        
        setOldPass("");
        setNewPass("");
        setConfirmPass("");
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password. Check your current password.",{position:'top-right'});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[560px] rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="relative p-6 md:p-8 flex items-start gap-4">
          <div className="p-3 bg-[#9266901A] text-buttonColor rounded-2xl border border-gray-100">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#332a2a]">Change Password</h2>
            <p className="text-sm text-gray-400 font-medium">Update your account password</p>
          </div>
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="px-6 md:px-8 pb-8 space-y-6">
          <div className="bg-[#f0f7ff] p-4 rounded-2xl flex gap-3 border border-[#e0efff]">
            <ShieldCheck className="w-5 h-5 text-[#3b82f6] shrink-0" />
            <div>
              <p className="text-[11px] font-black text-[#3b82f6] uppercase tracking-wider mb-1">Security Reminder</p>
              <p className="text-xs md:text-sm text-[#4b5563] leading-relaxed">
                Make sure your password is at least 6 characters long for better security.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-subTitleColor uppercase tracking-[1.5px] ml-1">Current Password *</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-[#fcfaf9] border border-gray-100 rounded-2xl py-4 pl-11 pr-12 text-sm focus:outline-none focus:border-buttonColor transition-all"
                />
                <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-subTitleColor uppercase tracking-[1.5px] ml-1">New Password *</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-[#fcfaf9] border border-gray-100 rounded-2xl py-4 pl-11 pr-12 text-sm focus:outline-none focus:border-buttonColor transition-all"
                />
                <button onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-subTitleColor uppercase tracking-[1.5px] ml-1">Confirm New Password *</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-[#fcfaf9] border border-gray-100 rounded-2xl py-4 pl-11 pr-12 text-sm focus:outline-none focus:border-buttonColor transition-all"
                />
                <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-50">
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-titleColor border border-borderColor rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <X size={16} /> CANCEL
            </button>
            <button 
              onClick={handleUpdate}
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3.5 bg-buttonColor hover:bg-opacity-90 text-white text-sm font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock size={16} />}
              {isLoading ? "UPDATING..." : "UPDATE PASSWORD"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;






// import React, { useState } from 'react';
// import { Lock, Eye, EyeOff, X, ShieldCheck } from 'lucide-react';

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
//   const [showCurrent, setShowCurrent] = useState(false);
//   const [showNew, setShowNew] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
//       <div className="bg-white w-full max-w-[560px] rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
//         {/* Header */}
//         <div className="relative p-6 md:p-8 flex items-start gap-4">
//           <div className="p-3 bg-[#9266901A] text-buttonColor rounded-2xl border border-gray-100">
//             <Lock className="w-6 h-6 text-gray-400" />
//           </div>
//           <div>
//             <h2 className="text-xl md:text-2xl font-extrabold text-[#332a2a]">Change Password</h2>
//             <p className="text-sm text-gray-400 font-medium">Update your account password</p>
//           </div>
//           <button 
//             onClick={onClose}
//             className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-400" />
//           </button>
//         </div>

//         <div className="px-6 md:px-8 pb-8 space-y-6">
//           {/* Security Reminder */}
//           <div className="bg-[#f0f7ff] p-4 rounded-2xl flex gap-3 border border-[#e0efff]">
//             <ShieldCheck className="w-5 h-5 text-[#3b82f6] shrink-0" />
//             <div>
//               <p className="text-[11px] font-black text-[#3b82f6] uppercase tracking-wider mb-1">Security Reminder</p>
//               <p className="text-xs md:text-sm text-[#4b5563] leading-relaxed">
//                 Make sure your password is at least 8 characters long and includes uppercase, lowercase, numbers, and special characters.
//               </p>
//             </div>
//           </div>

//           {/* Form Fields */}
//           <div className="space-y-4">
//             {/* Current Password */}
//             <div className="space-y-1.5">
//               <label className="text-xs font-black text-subTitleColor uppercase tracking-[1.5px] ml-1">
//                 Current Password *
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
//                 <input
//                   type={showCurrent ? "text" : "password"}
//                   placeholder="Enter current password"
//                   className="w-full bg-[#fcfaf9] border border-gray-100 rounded-2xl py-4 pl-11 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#6d4c7d]/10 focus:border-[#6d4c7d] transition-all"
//                 />
//                 <button 
//                   onClick={() => setShowCurrent(!showCurrent)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
//                 >
//                   {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             {/* New Password */}
//             <div className="space-y-1.5">
//               <label className="text-xs font-black text-subTitleColor uppercase tracking-[1.5px] ml-1">
//                 New Password *
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
//                 <input
//                   type={showNew ? "text" : "password"}
//                   placeholder="Enter new password"
//                   className="w-full bg-[#fcfaf9] border border-gray-100 rounded-2xl py-4 pl-11 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#6d4c7d]/10 focus:border-[#6d4c7d] transition-all"
//                 />
//                 <button 
//                   onClick={() => setShowNew(!showNew)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
//                 >
//                   {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             {/* Confirm New Password */}
//             <div className="space-y-1.5">
//               <label className="text-xs font-black text-subTitleColor uppercase tracking-[1.5px] ml-1">
//                 Confirm New Password *
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
//                 <input
//                   type={showConfirm ? "text" : "password"}
//                   placeholder="Confirm new password"
//                   className="w-full bg-[#fcfaf9] border border-gray-100 rounded-2xl py-4 pl-11 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#6d4c7d]/10 focus:border-[#6d4c7d] transition-all"
//                 />
//                 <button 
//                   onClick={() => setShowConfirm(!showConfirm)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
//                 >
//                   {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Footer Buttons */}
//           <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-50">
//             <button 
//               onClick={onClose}
//               className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-titleColor border boder-borderColor rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-2"
//             >
//               <X size={16} /> CANCEL
//             </button>
//             <button className="w-full sm:w-auto px-8 py-3.5 bg-buttonColor hover:bg-[#b8a3bf]  text-white text-sm font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2">
//               <Lock size={16} /> UPDATE PASSWORD
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChangePasswordModal;