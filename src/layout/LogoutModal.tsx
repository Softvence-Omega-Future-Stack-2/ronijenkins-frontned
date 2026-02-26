import React from "react";
import DocICon from '../assets/react.svg'
import DocImgfrom from '../assets/react.svg'


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
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <div className="flex items-center ">
            <img src={DocImgfrom} alt="Docline Logo" className="h-8 w-8 sm:h-10 sm:w-10"/>
          <img src={DocICon} alt="" />
          </div>
        </div>

        {/* Logout Text */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#171C35] mb-2">
     yhjhyj
          </h2>
          <p className="text-sm sm:text-base text-[#667085]">
         ghjy
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
          <button
            className="flex-1 py-3 px-6 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer duration-200"
            onClick={onConfirm}
          >
           Yes
          </button>
          <button
            className="flex-1 py-3 px-6 bg-[#526FFF] text-white rounded-xl font-medium hover:bg-blue-700 transition-colors cursor-pointer duration-200"
            onClick={onCancel}
          >
           Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;