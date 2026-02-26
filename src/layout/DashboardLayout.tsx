/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import LogoutModal from "./LogoutModal";
import { Outlet } from "react-router-dom";
import Sidebar from "../Component/Sidebar";
import Header from "../Component/Header";


const DashboardLayout = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const toggleSidebar = (state: boolean) => setIsSidebarCollapsed(state);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setMobileMenuOpen(false);
  };







  return (
    <div className="flex h-screen bg-[#F3F6F6] overflow-hidden">

      {/* DESKTOP SIDEBAR */}
      <div
        className={`hidden md:block h-full border-r border-[#D0D5DD]
        transition-all duration-300 w-72
`}
      >
        <Sidebar
          onLogoutClick={handleLogoutClick}
          collapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
        />
      </div>

      {/* MOBILE OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden
        ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#F3F6F6] z-50 md:hidden
        transition-transform duration-300
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: "280px" }}
      >
        <Sidebar
          onLogoutClick={handleLogoutClick}
          collapsed={false}
          onToggle={() => {}}
          closeMobileMenu={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto w-full ">
          <Outlet />
        </main>

        {showLogoutModal && (
          <LogoutModal
            onConfirm={() => {
            
              setShowLogoutModal(false);
              navigate("/login");
            }}
            onCancel={() => setShowLogoutModal(false)}
          />
        )}
      </div>



    </div>
  );
};

export default DashboardLayout;