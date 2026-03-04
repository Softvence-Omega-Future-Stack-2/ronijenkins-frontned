import { useState } from "react";
import profile from '../../public/img/adminProfile.png'
import { useNavigate } from "react-router-dom";
import AddressInformation from "../Component/profile/AddressInfo";






const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.59 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.81-.81a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const LocationIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);




const ProfileHeader = () => {
  const [, setEditHovered] = useState(false);
const navigate = useNavigate()
  return (
    <div className="bg-white rounded-2xl md:rounded-4xl border border-borderColor shadow-sm p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Avatar + Name + Badge */}
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-24 sm:w-[119px] sm:h-[119px] rounded-2xl overflow-hidden bg-gray-200 border-2 border-white shadow-md">
              {/* Placeholder avatar – replace src with real image */}
              <img
                src={profile}
                alt="Nolan"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
             
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl mdLtext-4xl font-black text-titleColor leading-6 md:leading-10 tracking-tight">
              Nolan
            </h1>
            <div className="flex items-center gap-1 mt-1 text-buttonColor  text-xs font-medium uppercase leading-4 tracking-[1.5px[">
              <LocationIcon />
              <span>Super Admin</span>
            </div>
             <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4 ">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#9266901A] text-buttonColor">
            <MailIcon />
          </div>
          <div>
            <p className="text-xs text-subTitleColor uppercase tracking-wider font-black">Email</p>
            <p className="text-sm text-titleColor leading-5 font-medium">nolan@navellehealth.com</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#00C9501A] text-green-500">
            <PhoneIcon />
          </div>
          <div>
            <p className="text-xs text-subTitleColor uppercase tracking-wider font-black">Phone</p>
            <p className="ttext-sm text-titleColor leading-5 font-medium">+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button
        onClick={()=> navigate('/dashboard/edit_profile')}
          onMouseEnter={() => setEditHovered(true)}
          onMouseLeave={() => setEditHovered(false)}
          className="flex items-center gap-2 px-4 py-2 bg-buttonColor text-white cursor-pointer rounded-xl text-sm font-semibold transition-all duration-200 self-start sm:self-auto">
      
          <EditIcon />
          Edit Profile
        </button>
      </div>

      {/* Contact Info */}
     
    </div>
  );
};



export default function AdminProfile() {
  return (
    <div
      className="min-h-screen p-4 md:p-6"
    
    >


      <div className=" space-y-4">
        {/* Section 1 */}
        <ProfileHeader />
       <AddressInformation/>
    

      </div>
    </div>
  );
}