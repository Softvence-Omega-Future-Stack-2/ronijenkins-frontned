import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../redux/features/auth/authAPi';
import { setCredentials } from '../redux/features/auth/authSlice';
import { toast } from 'react-toastify';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields", { position: "top-right" });
      return;
    }

    const toastId = toast.loading("Signing in...", { position: 'top-right' });

    try {
      const res: any = await login({ email, password }).unwrap();
      console.log("Login Response:", res);

      // ✅ Token extract — your API returns { data: { accessToken, refreshToken } }
   const rawToken = res?.data?.accessToken;
const rawRefresh = res?.data?.refreshToken;

// Strip extra quotes
const accessToken = typeof rawToken === 'string' ? rawToken.replace(/^"|"$/g, '') : rawToken;
const refreshToken = typeof rawRefresh === 'string' ? rawRefresh.replace(/^"|"$/g, '') : rawRefresh;

dispatch(setCredentials({ user: null, token: accessToken, refreshToken }));

      if (!accessToken) {
        toast.update(toastId, {
          render: "Invalid token received",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }

      // ✅ Save to Redux (redux-persist will save to localStorage automatically)
      dispatch(
        setCredentials({
          user: null,
          token: accessToken,
          refreshToken: refreshToken ?? null,
        })
      );

      toast.update(toastId, {
        render: "Login successful",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        position: "top-right",
      });

      navigate('/dashboard');

    } catch (error: any) {
      console.log("Login Error:", error);
      toast.update(toastId, {
        render: error?.data?.detail || "Login failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        position: "top-right",
      });
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-[3rem] border border-stone-100 shadow-sm p-6 md:p-8">
        <h2 className="text-titleColor text-2xl md:text-[30px] font-extrabold mb-2">
          Welcome Back
        </h2>
        <p className="text-subTitleColor text-sm font-medium mb-6">
          Sign in to your admin account
        </p>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-6 py-4 rounded-2xl border border-borderColor bg-[#F9F7F5]"
            />
          </div>

          <div className="space-y-2 relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-6 py-4 rounded-2xl border border-borderColor bg-[#F9F7F5]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2"
            >
              <EyeIcon />
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-xs font-black text-[#845E84]"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 rounded-2xl bg-[#845E84] text-white font-black"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default LoginPage;







// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AuthLayout from './AuthLayout';

// const LoginPage: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   return (
//     <AuthLayout>
//       <div className="bg-white rounded-[3rem] border border-stone-100 shadow-sm p-6 md:p-8">
//         <h2 className="text-titleColor text-2xl md:text-[30px] font-extrabold mb-2">
//           Welcome Back
//         </h2>
//         <p className="text-subTitleColor text-sm font-medium mb-6">
//           Sign in to your admin account
//         </p>

//         <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
//           {/* Email */}
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">
//               Email Address
//             </label>
//             <input 
//               type="email"
//               defaultValue="admin@navelle.health"
//               className="w-full px-6 py-4 rounded-2xl border border-borderColor bg-[#F9F7F5] text-stone-600 font-medium focus:outline-none focus:ring-2 focus:ring-[#845E84]/10 focus:border-[#845E84] transition-all"
//             />
//           </div>

//           {/* Password */}
//           <div className="space-y-2 relative">
//             <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block ml-1">
//               Password
//             </label>
//             <input 
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter your password"
//               className="w-full px-6 py-4 rounded-2xl border border-borderColor bg-[#F9F7F5] text-stone-600 font-medium focus:outline-none focus:ring-2 focus:ring-[#845E84]/10 focus:border-[#845E84] transition-all"
//             />
//             <button 
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors cursor-pointer"
//             >
//               <EyeIcon />
//             </button>
//           </div>

//           {/* Forgot Password */}
//           <div className="flex justify-end">
//             <button
//               type="button"
//               onClick={() => navigate('/forgot-password')}
//               className="text-xs font-black text-[#845E84] hover:opacity-70 transition-opacity cursor-pointer"
//             >
//               Forgot Password?
//             </button>
//           </div>

//           {/* Sign In */}
//           <button
//             type="button"
//             onClick={() => navigate('/dashboard')}
//             className="w-full py-5 rounded-2xl bg-[#845E84] text-white font-black uppercase tracking-widest cursor-pointer text-sm shadow-lg shadow-[#845E84]/20 hover:bg-[#6d4d6d] hover:scale-[1.01] transition-all active:scale-[0.98]"
//           >
//             Sign In
//           </button>

//           {/* Admin Access */}
//           <div className="pt-4 text-center">
//             <div className="flex items-center gap-4">
//               <div className="h-px bg-stone-100 flex-1"></div>
//               <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">
//                 Admin Access Only
//               </span>
//               <div className="h-px bg-stone-100 flex-1"></div>
//             </div>
//             <p className="text-[11px] font-medium text-stone-300 mt-2">
//               Protected by enterprise-grade security
//             </p>
//           </div>
//         </form>
//       </div>
//     </AuthLayout>
//   );
// };

// const EyeIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//     <circle cx="12" cy="12" r="3" />
//   </svg>
// );

// export default LoginPage;