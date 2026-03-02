import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
 
    navigate('/otp-verification', { state: { email } });
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-[3rem] border border-stone-100 shadow-sm p-6 md:p-8 space-y-6">
        <h2 className="text-titleColor text-2xl md:text-[30px] font-extrabold">
          Forgot Password
        </h2>
        <p className="text-subTitleColor text-sm font-medium">
          Enter your registered email to receive a OTP.
        </p>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-6 py-4 rounded-2xl border border-borderColor bg-[#F9F7F5] text-stone-600 font-medium focus:outline-none focus:ring-2 focus:ring-[#845E84]/10 focus:border-[#845E84] transition-all"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-5 rounded-2xl bg-[#845E84] text-white font-black uppercase tracking-widest cursor-pointer text-sm shadow-lg shadow-[#845E84]/20 hover:bg-[#6d4d6d] transition-all"
        >
          Send OTP
        </button>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;