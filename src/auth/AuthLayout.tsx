import React, { type ReactNode } from 'react';
import logo from '../../public/img/logo.png';

interface LayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FBF9F6] flex flex-col items-center justify-center p-2 md:p-6 font-sans">
      
      {/* Logo */}
      <div className="mb-6">
        <img src={logo} alt="Logo" className="w-28 sm:w-32 md:w-36" />
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[480px]">{children}</div>

      {/* Footer */}
      <p className="mt-12 text-xs font-medium text-stone-400 text-center">
        All Rights Reserved by @2026
      </p>
    </div>
  );
};

export default AuthLayout;