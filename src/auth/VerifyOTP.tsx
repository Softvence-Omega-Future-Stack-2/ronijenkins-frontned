
import React, { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from './AuthLayout';

import { toast } from 'react-toastify';
import { useVerifyEmailMutation } from '../redux/features/auth/authAPi';

const OTPVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as any)?.email || '';
  
  // API Hook
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  const [otp, setOtp] = useState(Array(6).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); `11`
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length !== 6) {
      toast.error('Enter all 6 digits of OTP');
      return;
    }

    try {
     
      const res = await verifyEmail({ 
        code: enteredOtp, 
        email: email 
      }).unwrap();

      if (res.data === true || res) {
        toast.success("OTP Verified Successfully!");
        // Reset password page-e OTP code-tao pathiye din jate next step-e lagle pawa jay
        navigate('/reset-password', { state: { email, code: enteredOtp } });
      }
    } catch (err: any) {
      toast.error(err?.data?.errors?.[0]?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-[12px] md:rounded-[3rem] border border-stone-100 shadow-sm p-2 md:p-8 space-y-6">
        <h2 className="text-titleColor text-2xl md:text-[30px] font-extrabold">
          OTP Verification
        </h2>
        <p className="text-subTitleColor text-sm font-medium">
          Enter the 6-digit OTP sent to <span className="font-bold">{email}</span>.
        </p>

        <div className="flex justify-between gap-2 md:gap-3 mt-4">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { if(el) inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-10 h-10 md:w-12 md:h-12 text-center text-lg font-bold border border-borderColor rounded-xl focus:outline-none focus:ring-2 focus:ring-[#845E84]/20 focus:border-[#845E84] transition-all"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={isLoading}
          className="w-full py-5 rounded-2xl bg-[#845E84] text-white font-black uppercase tracking-widest cursor-pointer text-sm shadow-lg shadow-[#845E84]/20 hover:bg-[#6d4d6d] transition-all disabled:opacity-50"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </AuthLayout>
  );
};

export default OTPVerificationPage;





// import React, { useRef, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import AuthLayout from './AuthLayout';

// const OTPVerificationPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const email = (location.state as any)?.email || '';

//   // 6 digit OTP
//   const [otp, setOtp] = useState(Array(6).fill(''));

//   // Refs for inputs
//   const inputRefs = useRef<HTMLInputElement[]>([]);

//   const handleChange = (index: number, value: string) => {
//     if (!/^\d*$/.test(value)) return; // Only numbers allowed

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Auto focus next input
//     if (value && index < 5) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const handleVerify = () => {
//     const enteredOtp = otp.join('');
//     if (enteredOtp.length === 6) {
//       alert(`OTP Verified: ${enteredOtp}`);
//       navigate('/reset-password', { state: { email } });
//     } else {
//       alert('Enter all 6 digits of OTP');
//     }
//   };

//   return (
//     <AuthLayout>
//       <div className="bg-white rounded-[12px] md:rounded-[3rem] border border-stone-100 shadow-sm p-2 md:p-8 space-y-6">
//         <h2 className="text-titleColor text-2xl md:text-[30px] font-extrabold">
//           OTP Verification
//         </h2>
//         <p className="text-subTitleColor text-sm font-medium">
//           Enter the 6-digit OTP sent to <span className="font-bold">{email}</span>.
//         </p>

//         <div className="flex justify-between gap-3 mt-4">
//           {otp.map((digit, idx) => (
//             <input
//               key={idx}
//              ref={(el) => { inputRefs.current[idx] = el!; }}
//               type="text"
//               maxLength={1}
//               value={digit}
//               onChange={(e) => handleChange(idx, e.target.value)}
//               onKeyDown={(e) => handleKeyDown(idx, e)}
//               className="w-12 h-12 text-center text-lg font-bold border border-borderColor rounded-xl focus:outline-none focus:ring-2 focus:ring-[#845E84]/20 focus:border-[#845E84] transition-all"
//             />
//           ))}
//         </div>

//         <button
//           onClick={handleVerify}
//           className="w-full py-5 rounded-2xl bg-[#845E84] text-white font-black uppercase tracking-widest cursor-pointer text-sm shadow-lg shadow-[#845E84]/20 hover:bg-[#6d4d6d] transition-all"
//         >
//           Verify OTP
//         </button>
//       </div>
//     </AuthLayout>
//   );
// };

// export default OTPVerificationPage;