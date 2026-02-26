/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import loginImg from '../../public/images/loginImg.png'
import loginBotom from '../../public/images/loginBottom.svg'
import logo from '../../public/images/logo.png'
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../redux/features/auth/authAPi';
import { toast } from 'react-toastify';

import { setCredentials } from '../redux/features/auth/authSlice'; 
import { useAppDispatch } from '../redux/hook';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error("Please fill in all fields", {position:"top-right"});
    return;
  }

  try {
    const res = await login({ email, password }).unwrap();
    
    console.log('=== Login Response ===');
    console.log('Full response:', res);
    console.log('Type of res.access:', typeof res.access);
    console.log('res.access value:', res.access);
    
    // 🟢 VALIDATE before dispatching
    if (!res.access || res.access === 'undefined') {
      console.error('❌ Invalid token in response!');
      toast.error('Login failed - invalid token received', {position:"top-right"});
      return;
    }
    
    // Dispatch with validated data
    dispatch(setCredentials({ 
      user: {
        email: res.email,
        role: res.role
      },
      token: res.access,  // Backend returns 'access' token
      refreshToken: res.refresh
    }));
    
    // Verify
    console.log('✅ Token saved to localStorage:', localStorage.getItem('token')?.substring(0, 30) + '...');
    
    toast.success("Login successful!", {position:"top-right"});
    navigate("/dashboard");
    
  } catch (err: any) {
    console.error('❌ Login error:', err);
    toast.error(err?.data?.detail || "Login failed", {position:"top-right"});
  }
};

console.log('Token:', localStorage.getItem('token'));
console.log('Persist:', localStorage.getItem('persist:auth'));

  return (
    <div className="h-screen flex items-center justify-center p-4 md:p-6 font-sans">
      
      {/* Main Container */}
      <div className="relative w-full h-full bg-[#311E69] rounded-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT SIDE: Illustration & Logo */}
        <div className="relative flex-1 hidden md:flex flex-col p-8 lg:p-12">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="">
              <img src={logo} alt="Logo" className='h-12 w-12' />
            </div>
          </div>

          {/* Character Illustration */}
          <div className="flex justify-center items-center flex-1 overflow-hidden">
            <div className="relative w-full max-w-md flex items-center justify-center" style={{ maxHeight: 'calc(100vh - 280px)' }}>
              <img 
                src={loginImg}
                alt="Illustration" 
                className="w-auto h-auto max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          {/* THE BOTTOM LEFT TAB */}
          <div className="absolute bottom-0 left-0 bg-white rounded-tr-[50px] pt-5 pr-12 pl-8 pb-5 flex items-center gap-4">
            
            {/* TOP-LEFT INVERTED CURVE */}
            <div className="absolute -top-[40px] left-0 w-[40px] h-[40px] pointer-events-none">
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M40 40H0V0C0 22.0914 17.9086 40 40 40Z" fill="white" />
              </svg>
            </div>

            {/* BOTTOM-RIGHT INVERTED CURVE */}
            <div className="absolute bottom-0 -right-[40px] w-[40px] h-[40px] pointer-events-none">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0V0C0 22.0914 17.9086 40 40 40H0V0Z" fill="white"/>
              </svg>
            </div>

            {/* Profile Image */}
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-gray-100">
              <img src={loginBotom} alt="avatar" className="w-full h-full object-cover" />
            </div>

            {/* Vertical Line */}
            <div className="w-[3px] h-10 bg-[#311E69] rounded-full opacity-80"></div>

            {/* Text Content */}
            <div className="flex flex-col">
              <h4 className="text-[#311E69] font-bold text-sm leading-tight">Get Everything You Need</h4>
              <p className="text-gray-500 text-[10px] md:text-xs mt-0.5">
                Log in to continue your journey and access all features.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Login Card */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12">
          <div className="bg-white w-full max-w-md h-[600px] rounded-[30px] p-8 lg:p-10 flex flex-col justify-center shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-[130%]">Welcome back!</h2>
              <p className="text-gray-700 text-base font-normal leading-6 mt-2">Login to your account and get started</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm md:text-base font-normal leading-6 text-gray-800 mb-2">E-mail:</label>
                <input 
                  type="email" 
                  placeholder="e.g. example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl text-gray-500 leading-5 bg-slate-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7c6ff6] focus:border-transparent text-sm transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm md:text-base font-normal leading-6 text-gray-800 mb-2">Password:</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Type your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 text-gray-500 leading-5 rounded-xl bg-slate-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7c6ff6] focus:border-transparent text-sm transition-all disabled:opacity-50"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7c6ff6] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#7c6ff6] focus:ring-[#7c6ff6]" />
                  <span className="text-sm text-gray-700 leading-5 font-normal">Remember</span>
                </label>
                <button 
                  type="button"
                  onClick={() => navigate('/forget_password')}
                  className="text-sm text-rose-400 hover:text-rose-500 font-normal cursor-pointer leading-5.5 transition-colors"
                >
                  Forgot Password
                </button>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full text-base sm:text-lg font-semibold bg-[#7c6ff6] hover:bg-[#6b5ee5] text-white leading-[150%] cursor-pointer py-3.5 rounded-xl shadow-lg shadow-indigo-300/50 transition-all mt-6 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>

        {/* FOOTER TEXT */}
        <div className="absolute bottom-3 right-6 lg:bottom-6 2xl:right-65 hidden md:block">
          <p className="text-sm sm:text-base font-medium leading-5 text-white tracking-wide">
            ©2026 All Rights Reserved MALI. Privacy Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;









// import React, { useState } from 'react';
// import loginImg from '../../public/images/loginImg.png'
// import loginBotom  from '../../public/images/loginBottom.svg'
// import logo from '../../public/images/logo.png'
// import { useNavigate } from 'react-router-dom';
// import { useLoginMutation } from '../redux/features/auth/authAPi';
// import { toast } from 'react-toastify';
// import { useDispatch } from 'react-redux';

// const LoginPage: React.FC = () => {
//     const dispatch = useDispatch();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//     const [login, { isLoading }] = useLoginMutation();

//   const navigate = useNavigate()


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const res = await login({ email, password }).unwrap();
//       // Save user + token in Redux
//       dispatch(loginRedux({ user: res.user, token: res.token }));
      
//       // ✅ Success toast
//       toast.success("Login successful!");
      
//       navigate("/dashboard"); // Redirect after login
//     } catch (err: any) {
//       // ✅ Error toast
//       toast.error(err.data?.message || "Login failed");
//     }
//   };
//   return (
//     <div className="h-screen flex items-center justify-center p-4 md:p-6  font-sans">
      
//       {/* Main Container */}
//       <div className="relative w-full h-full  bg-[#311E69]  rounded-2xl overflow-hidden flex flex-col md:flex-row">
        
//         {/* LEFT SIDE: Illustration & Logo */}
//         <div className="relative flex-1 hidden md:flex flex-col p-8 lg:p-12">
//           {/* Logo - Positioned with proper padding */}
//           <div className="flex items-center gap-2 mb-8">
//             <div className="">
//                <img src={logo} alt="" className='h-12 w-12' />
//             </div>
//           </div>

//           {/* Character Illustration - Centered vertically */}
//           <div className="flex justify-center items-center flex-1 overflow-hidden">
//             <div className="relative w-full max-w-md flex items-center justify-center" style={{ maxHeight: 'calc(100vh - 280px)' }}>
//                <img 
//                 src={loginImg}
//                 alt="Illustration" 
//                 className="w-auto h-auto max-h-full max-w-full object-contain"
//                />
//             </div>
//           </div>

     


// {/* THE BOTTOM LEFT TAB */}
// <div className="absolute bottom-0 left-0 bg-white rounded-tr-[50px] pt-5 pr-12 pl-8 pb-5 flex items-center gap-4">
  

// {/* --- TOP-LEFT INVERTED CURVE --- */}
// <div className="absolute -top-[40px] left-0 w-[40px] h-[40px] pointer-events-none">
//   <svg
//     width="40"
//     height="40"
//     viewBox="0 0 40 40"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     {/* Ei path-ti dark background-ke round curve korbe */}
//     <path
//       d="M40 40H0V0C0 22.0914 17.9086 40 40 40Z"
//       fill="white"
//     />
//   </svg>
// </div>



//   {/* --- BOTTOM-RIGHT INVERTED CURVE (OUTWARD) --- */}
//   <div className="absolute bottom-0 -right-[40px] w-[40px] h-[40px] pointer-events-none">
//     <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M0 0V0C0 22.0914 17.9086 40 40 40H0V0Z" fill="white"/>
//     </svg>
//   </div>

//   {/* Left Profile Image */}
//   <div className="w-12 h-12 rounded-full  overflow-hidden shrink-0 border-2 border-gray-100">
//     <img src={loginBotom} alt="avatar" className="w-full h-full object-cover" />
//   </div>

//   {/* Vertical Line */}
//   <div className="w-[3px] h-10 bg-[#311E69] rounded-full opacity-80"></div>

//   {/* Text Content */}
//   <div className="flex flex-col">
//     <h4 className="text-[#311E69] font-bold text-sm leading-tight">Get Everything You Need</h4>
//     <p className="text-gray-500 text-[10px] md:text-xs mt-0.5">
//        Log in to continue your journey and access all features.
//     </p>
//   </div>
// </div>
//         </div>

//         {/* RIGHT SIDE: Login Card */}
//         <div className="flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12">
//           <div className="bg-white w-full max-w-md h-[600px] rounded-[30px] p-8 lg:p-10 flex flex-col justify-center shadow-2xl">
//             <div className="text-center mb-8">
//               <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-[130%]">Welcome back!</h2>
//               <p className="text-gray-700 text-base font-normal leading-6 mt-2">Login to your account and get started</p>
//             </div>

//             <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
//               <div>
//                 <label className="block text-sm md:text-base font-normal leading-6 text-gray-800 mb-2">E-mail:</label>
//                 <input 
//                   type="email" 
//                   placeholder="e.g. example@email.com" 
//                   className="w-full px-4 py-3 rounded-xl text-gray-500 leading-5 bg-slate-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7c6ff6] focus:border-transparent text-sm transition-all"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm md:text-base font-normal leading-6 text-gray-800 mb-2">Password:</label>
//                 <div className="relative">
//                   <input 
//                     type="password" 
//                     placeholder="Type your password" 
//                     className="w-full px-4 py-3 text-gray-500 leading-5 rounded-xl bg-slate-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7c6ff6] focus:border-transparent text-sm transition-all"
//                   />
//                   <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7c6ff6] transition-colors">
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between pt-1">
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#7c6ff6] focus:ring-[#7c6ff6]" />
//                   <span className="text-sm text-gray-700 leading-5 font-normal">Remember</span>
//                 </label>
//                 <button onClick={()=> navigate('/forget_password')} className="text-sm text-rose-400 hover:text-rose-500 font-normal cursor-pointer leading-5.5 transition-colors">Forgot Password</button>
//               </div>

//               <button onClick={()=> navigate('/dashboard')} className="w-full text-base sm:text-lg font-semibold bg-[#7c6ff6] hover:bg-[#6b5ee5] text-white leading-[150%] cursor-pointer py-3.5 rounded-xl shadow-lg shadow-indigo-300/50 transition-all mt-6 transform active:scale-[0.98]">
//                    {isLoading ? "Logging in..." : "Login"}
//               </button>
//             </form>

        
//           </div>
//         </div>

//         {/* FOOTER TEXT */}
//         <div className="absolute bottom-3 right-6 lg:bottom-6 2xl:right-65 hidden md:block">
//           <p className="text-sm sm:text-base font-medium leading-5 text-white tracking-wide">
//             ©2026 All Rights Reserved MALI. Privacy Terms of Service.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;








// import React from 'react';
// import loginImg from '../../public/images/loginImg.png'

// const LoginPage: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-2 md:p-8 font-sans">
      
//       {/* Main Container */}
//       <div className="relative w-full max-w-[1800px] h-[800px] aspect-[16/9] bg-[#311E69] rounded-[20px] overflow-hidden ">
//             {/* Logo - Positioned with proper padding */}
//           <div className="flex items-center gap-2 pt-2">
//             <div className="border-2 border-white/90 p-2 rounded-lg">
//                <span className="text-white font-bold text-xl tracking-tight">MALI</span>
//             </div>
//           </div>
        
//      <div className='flex flex-col md:flex-row items-center gap-8 '>
//          {/* LEFT SIDE: Illustration & Logo */}
//         <div className="relative flex-1 hidden md:flex flex-col justify-between p-8 lg:p-12">
    

//           {/* Character Illustration - Centered vertically */}
//           <div className="flex justify-center items-center flex-1">
//             <div className="relative w-full  h-[400px]">
//                <img 
//                 src={loginImg}
//                 alt="Illustration" 
//                 className="w-full h-full object-contain"
//                />
//             </div>
//           </div>

//           {/* THE BOTTOM LEFT TAB */}
//           <div className="absolute bottom-0 left-0 bg-white rounded-tr-[50px]  pt-5 pr-12 pl-8 pb-5 flex items-center gap-4">
//             <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100 shrink-0">
//                <img src="https://i.pravatar.cc/150?u=mali" alt="avatar" className="w-full h-full object-cover" />
//             </div>
//             <div>
//               <h4 className="text-gray-900 font-bold text-sm leading-tight">Get Everything You Need</h4>
//               <p className="text-gray-400 text-xs mt-0.5">Log in to continue your journey.</p>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT SIDE: Login Card */}
//         <div className="flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12">
//           <div className="bg-white w-full  rounded-[30px] p-8 lg:p-10 flex flex-col justify-center shadow-2xl ">
//             <div className="text-center mb-8">
//               <h2 className="text-2xl md:text-3xl  font-bold text-gray-900 leading-[130%]">Welcome back!</h2>
//               <p className="text-gray-700 text-base font-normal leading-6 mt-2">Login to your account and get started</p>
//             </div>

//             <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
//               <div>
//                 <label className="block text-sm md:text-base  font-normal leading-6 text-gray-800 mb-2">E-mail:</label>
//                 <input 
//                   type="email" 
//                   placeholder="e.g. example@email.com" 
//                   className="w-full px-4 py-3 rounded-xl text-gray-500 leading-5 bg-slate-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7c6ff6] focus:border-transparent text-sm transition-all"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm md:text-base  font-normal leading-6 text-gray-800 mb-2">Password:</label>
//                 <div className="relative">
//                   <input 
//                     type="password" 
//                     placeholder="Type your password" 
//                     className="w-full px-4 py-3 text-gray-500 leading-5 rounded-xl bg-slate-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7c6ff6] focus:border-transparent text-sm transition-all"
//                   />
//                   <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7c6ff6] transition-colors">
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between pt-1">
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#7c6ff6] focus:ring-[#7c6ff6]" />
//                   <span className="text-sm text-gray-700 leading-5 font-normal ">Remember</span>
//                 </label>
//                 <a href="#" className="text-sm text-rose-400 hover:text-rose-500 font-normal leading-5.5 transition-colors">Forgot Password</a>
//               </div>

//               <button className="w-full text-base sm:text-lg font-semibold bg-[#7c6ff6] hover:bg-[#6b5ee5] text-white leading-[150%] cursor-pointer py-3.5 rounded-xl shadow-lg shadow-indigo-300/50 transition-all mt-6 transform active:scale-[0.98]">
//                 Login
//               </button>
//             </form>

//             <div className="mt-6 text-center">
//               <p className="text-sm font-normal leading-5 text-gray-500">
//                 Don't have an account? <a href="#" className="text-gray-900 font-bold hover:underline">Register</a>
//               </p>
//             </div>

//             <div className="relative my-8">
//               <div className="absolute inset-0 flex items-center">
//                 {/* <div className="w-full border-t border-gray-200"></div> */}
//               </div>
//               <div className="relative flex justify-center text-sm font-normal tracking-wider text-gray-500">
//                 <span className="bg-white px-4">Or login with</span>
//               </div>
//             </div>

//             <button className="w-full border border-purple-100 py-3 px-4 cursor-pointer rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all group">
//               {/* <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google" /> */}
//               <svg width="49" height="16" viewBox="0 0 49 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//   <g clip-path="url(#clip0_24220_6267)">
//     <path d="M47.4736 9.77815L48.833 10.68C48.3918 11.3266 47.3366 12.4361 45.5122 12.4361C43.2467 12.4361 41.5596 10.6919 41.5596 8.47291C41.5596 6.11167 43.2646 4.50977 45.3215 4.50977C47.3902 4.50977 48.4037 6.14719 48.7317 7.03119L48.9105 7.48215L43.5806 9.67729C43.986 10.4723 44.6181 10.8758 45.5122 10.8758C46.4066 10.8758 47.0265 10.4367 47.4736 9.77815ZM43.2945 8.34843L46.8537 6.877C46.6569 6.38462 46.0727 6.03462 45.3751 6.03462C44.4868 6.03462 43.2527 6.81777 43.2945 8.34843Z" fill="#FF302F"/>
//     <path d="M38.9902 0.469727H40.7071V12.0745H38.9902V0.469727Z" fill="#20B15A"/>
//     <path d="M36.2835 4.81829H37.9408V11.8666C37.9408 14.7914 36.2059 15.9958 34.155 15.9958C32.2234 15.9958 31.0609 14.7025 30.6257 13.6524L32.1459 13.0234C32.4201 13.6701 33.0819 14.4355 34.155 14.4355C35.4726 14.4355 36.2835 13.6227 36.2835 12.1039V11.5344H36.2238C35.8303 12.009 35.0791 12.4361 34.1253 12.4361C32.134 12.4361 30.3096 10.7096 30.3096 8.48486C30.3096 6.2481 32.134 4.50391 34.1253 4.50391C35.0732 4.50391 35.8303 4.92514 36.2238 5.38791H36.2835V4.81829ZM36.4026 8.48486C36.4026 7.08467 35.4666 6.06419 34.2743 6.06419C33.0699 6.06419 32.0564 7.08467 32.0564 8.48486C32.0564 9.86714 33.0699 10.8698 34.2743 10.8698C35.4667 10.8758 36.4027 9.86714 36.4027 8.48486" fill="#3686F7"/>
//     <path d="M20.8839 8.45538C20.8839 10.7396 19.0954 12.4185 16.9014 12.4185C14.7075 12.4185 12.9189 10.7337 12.9189 8.45538C12.9189 6.15938 14.7075 4.48633 16.9014 4.48633C19.0954 4.48633 20.8839 6.15938 20.8839 8.45538ZM19.1431 8.45538C19.1431 7.03157 18.1057 6.05252 16.9014 6.05252C15.6972 6.05252 14.6598 7.03157 14.6598 8.45538C14.6598 9.86738 15.6972 10.8582 16.9014 10.8582C18.1058 10.8582 19.1431 9.86738 19.1431 8.45538Z" fill="#FF302F"/>
//     <path d="M29.5824 8.47291C29.5824 10.7571 27.7938 12.4361 25.5999 12.4361C23.4059 12.4361 21.6174 10.757 21.6174 8.47291C21.6174 6.17691 23.4059 4.50977 25.5999 4.50977C27.7938 4.50977 29.5824 6.171 29.5824 8.47291ZM27.8355 8.47291C27.8355 7.0491 26.7982 6.07005 25.5939 6.07005C24.3896 6.07005 23.3522 7.0491 23.3522 8.47291C23.3522 9.88491 24.3897 10.8758 25.5939 10.8758C26.8042 10.8758 27.8355 9.879 27.8355 8.47291Z" fill="#FFBA40"/>
//     <path d="M6.37296 10.6977C3.87491 10.6977 1.91951 8.69241 1.91951 6.20651C1.91951 3.7207 3.87491 1.71537 6.37296 1.71537C7.72036 1.71537 8.704 2.24337 9.43134 2.91975L10.6297 1.72727C9.61624 0.760224 8.2629 0.0244141 6.37296 0.0244141C2.9509 0.0245093 0.0712891 2.80118 0.0712891 6.20651C0.0712891 9.61184 2.9509 12.3886 6.37296 12.3886C8.22117 12.3886 9.61624 11.7835 10.7073 10.6562C11.828 9.54079 12.1738 7.97451 12.1738 6.70489C12.1738 6.30737 12.1261 5.89803 12.0725 5.59546H6.37296V7.24479H10.433C10.3137 8.27717 9.98584 8.98317 9.50293 9.46365C8.91866 10.0511 7.99465 10.6977 6.37296 10.6977Z" fill="#3686F7"/>
//   </g>
//   <defs>
//     <clipPath id="clip0_24220_6267">
//       <rect width="49" height="16" fill="white"/>
//     </clipPath>
//   </defs>
// </svg>
//               {/* <span className="text-sm font-semibold text-gray-700">Google</span> */}
//             </button>
//           </div>
//         </div>
//      </div>

//         {/* FOOTER TEXT */}
//         <div className="absolute bottom-3 right-6 lg:bottom-6 lg:right-1/8 hidden md:block">
//           <p className="text-sm sm:text-base font-medium leading-5 text-white tracking-wide">
//             ©2026 All Rights Reserved MALI. Privacy Terms of Service.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;








// import React from 'react';
// import loginImg from '../../public/images/loginImg.png'

// const LoginPage: React.FC = () => {
//   return (
//     <div className="h-[706px] bg-white flex items-center justify-center p-4 font-sans">
//       {/* Main Container */}
//       <div className="relative w-full aspect-[16/10] bg-[#311E69] -6 rounded-[10px] overflow-hidden flex flex-col md:flex-row ">
        
//         {/* LEFT SIDE: Illustration & Logo */}
//         <div className="relative flex-1 hidden md:flex flex-col justify-between p-12">
//           {/* Logo */}
//           <div className="flex items-center gap-2">
//             <div className="border-2 border-white/80 p-1 rounded-lg">
//                <span className="text-white font-bold text-xl tracking-tighter">MALI</span>
//             </div>
//           </div>

//           {/* Character Illustration Placeholder */}
//           <div className="flex justify-center mb-16">
//             <div className="relative w-80 h-80">
//                {/* Note: Replace src with your local puzzle/character image */}
//                <img 
//                 src={loginImg}
//                 alt="Illustration" 
//                 className="w-full h-full object-contain"
//                />
//             </div>
//           </div>

//           {/* THE BOTTOM LEFT TAB (Responsive cut-out) */}
//           <div className="absolute bottom-0 left-0 bg-white rounded-tr-[50px] pt-6 pr-10 pl-10 pb-6 flex items-center gap-4 ">
//             <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100">
//                <img src="https://i.pravatar.cc/150?u=mali" alt="avatar" />
//             </div>
//             <div>
//               <h4 className="text-gray-900 font-bold text-sm leading-tight">Get Everything You Need</h4>
//               <p className="text-gray-400 text-[11px]">Log in to continue your journey.</p>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT SIDE: Login Card */}
//         <div className="flex-1 flex items-center justify-center p-6 md:p-10">
//           <div className="bg-white w-full max-w-md  rounded-[40px] p-8 md:p-12 flex flex-col justify-center shadow-xl">
//             <div className="text-center mb-8">
//               <h2 className="text-3xl font-bold text-gray-800">Welcome back!</h2>
//               <p className="text-gray-400 text-sm mt-2">Login to your account and get started</p>
//             </div>

//             <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">E-mail:</label>
//                 <input 
//                   type="email" 
//                   placeholder="e.g. example@email.com" 
//                   className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm transition-all"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
//                 <div className="relative">
//                   <input 
//                     type="password" 
//                     placeholder="Type your password" 
//                     className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm transition-all"
//                   />
//                   <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500">
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
//                   <span className="text-xs text-gray-500 font-medium">Remember</span>
//                 </label>
//                 <a href="#" className="text-xs text-rose-400 hover:text-rose-500 font-semibold">Forgot Password</a>
//               </div>

//               <button className="w-full bg-[#7c6ff6] hover:bg-[#6b5ee5] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all mt-4 transform active:scale-[0.98]">
//                 Login
//               </button>
//             </form>

//             <div className="mt-6 text-center">
//               <p className="text-xs text-gray-500">
//                 Don't have an account? <a href="#" className="text-gray-900 font-bold hover:underline">Register</a>
//               </p>
//             </div>

//             <div className="relative my-8">
//               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
//               <div className="relative flex justify-center text-[10px] uppercase tracking-wider text-gray-400"><span className="bg-white px-3">Or login with</span></div>
//             </div>

//             <button className="w-full border border-gray-100 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all">
//               <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google" />
//               <span className="text-sm font-semibold text-gray-700">Google</span>
//             </button>
//           </div>
//         </div>

//         {/* FOOTER TEXT */}
//         <div className="absolute bottom-6 right-10 hidden md:block">
//           <p className="text-[10px] text-white/40">
//             ©2026 All Rights Reserved MALI. Privacy Terms of Service.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;