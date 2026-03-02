import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as any)?.email || '';

  const handleReset = () => {
    // এখানে API call করে password reset হবে
    alert(`Password reset for ${email} successful!`);
    navigate('/');
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-[3rem] border border-stone-100 shadow-sm p-6 md:p-8 space-y-6">
        <h2 className="text-titleColor text-2xl md:text-[30px] font-extrabold">
          Reset Password
        </h2>
        <p className="text-subTitleColor text-sm font-medium">
          Enter a new password for <span className="font-bold">{email}</span>.
        </p>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className="w-full px-6 py-4 rounded-2xl border border-borderColor bg-[#F9F7F5] text-stone-600 font-medium focus:outline-none focus:ring-2 focus:ring-[#845E84]/10 focus:border-[#845E84] transition-all"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm Password"
            className="w-full px-6 py-4 rounded-2xl border border-borderColor bg-[#F9F7F5] text-stone-600 font-medium focus:outline-none focus:ring-2 focus:ring-[#845E84]/10 focus:border-[#845E84] transition-all"
          />
        </div>

        <button
          onClick={handleReset}
          className="w-full py-5 rounded-2xl bg-[#845E84] text-white font-black uppercase tracking-widest cursor-pointer text-sm shadow-lg shadow-[#845E84]/20 hover:bg-[#6d4d6d] transition-all"
        >
          Reset Password
        </button>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;