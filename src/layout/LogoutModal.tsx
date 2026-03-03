import React from "react";

import DocImgfrom from '../../public/img/logo.png'



interface LogoutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ onConfirm, onCancel }) => {

 
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]"
      onClick={onCancel} // Click on overlay to close
    >
      <div
        className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-10 transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Logo Section */}
       
          <div className="flex items-cente justify-center ">
            <img src={DocImgfrom} alt="Docline Logo" className=""/>
         
          </div>
       

        {/* Logout Text */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#171C35] mb-2">
                Logout
          </h2>
          <p className="text-sm sm:text-base text-[#667085]">
          Are you sure you want to logout from Navelle?
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
          <button
            className="flex-1 py-3 px-6 bg-white border-2 border-borderColor text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer duration-200"
              onClick={onCancel}
          >
           Cancel
          </button>
          <button
          
            className="flex-1 py-3 px-6 bg-buttonColor text-white rounded-xl font-medium  transition-colors cursor-pointer duration-200"
            onClick={onConfirm}
          >
           Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;