/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Shield, Camera, CircleUserRound, EyeOff, Eye } from 'lucide-react';
import { useChnagePasswordMutation, useGetAdminProfileQuery, useUpdateAdminProfileMutation } from '../../redux/features/admin/profileApi';
import { useAppSelector } from '../../redux/hook';
import { toast } from 'react-toastify';


const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  
  // 🟢 ADD: Check token
  const token = useAppSelector((state) => state.auth.token);
  
  // API hooks
  const { data: profile, isLoading, error } = useGetAdminProfileQuery(undefined, {
    skip: !token,  // Skip if no token
  });
  
  const [updateProfile, { isLoading: isUpdating }] = useUpdateAdminProfileMutation();
  const [changePassword, { isLoading: isChanging }] = useChnagePasswordMutation();

   // Security tab state
const [currentPassword, setCurrentPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');




  // Local state
  const [profileEdits, setProfileEdits] = useState<{
    full_name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }>({});

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize image preview
  // useEffect(() => {
  //   if (profile?.image_url) {
  //     setImagePreview(profile.image_url);
  //   }
  // }, [profile]);

  // Merge backend data with local edits
  const currentProfileData = useMemo(() => {
    if (!profile) return null;
    return {
      full_name: profileEdits.full_name ?? profile.full_name,
      email: profileEdits.email ?? profile.email,
      phone: profileEdits.phone ?? profile.phone,
      address: profileEdits.address ?? profile.address,
    };
  }, [profile, profileEdits]);

  const hasChanges = useMemo(() => {
    return Object.keys(profileEdits).length > 0 || imageFile !== null;
  }, [profileEdits, imageFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileEdits(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

const [showCurrent, setShowCurrent] = useState(false);
const [showNew, setShowNew] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);

  // Handle save changes
// ProfilePage.tsx - Update handleSaveChanges

const handleSaveChanges = async () => {
  try {
    const formData = new FormData();

    if (profileEdits.full_name !== undefined) formData.append('full_name', profileEdits.full_name);
    if (profileEdits.email !== undefined)     formData.append('email', profileEdits.email);
    if (profileEdits.phone !== undefined)     formData.append('phone', profileEdits.phone);
    if (profileEdits.address !== undefined)   formData.append('address', profileEdits.address);

    if (imageFile) {
      formData.append('image', imageFile); // ← actual File object
    }

    const response = await updateProfile(formData).unwrap();
    console.log('✅ Update successful:', response);

    setProfileEdits({});
    setImageFile(null);
    toast.success('Profile updated successfully!', {position: "top-right"});

  } catch (error: any) {
    const errorMessage =
      error?.data?.image?.[0] ||
      error?.data?.detail ||
      error?.data?.message ||
      error?.data?.email?.[0] ||
      error?.data?.phone?.[0] ||
      'Failed to update profile';

    toast.error(errorMessage , {position: "top-right"});
  }
};

// Keep convertToBase64 function as is
useEffect(() => {
  if (profile?.image_url) {
    setImagePreview(profile.image_url);
  }
}, [profile]);

  const handleCancel = () => {
    setProfileEdits({});
    setImageFile(null);
    if (profile?.image_url) {
      setImagePreview(profile.image_url);
    }
  };


  const handleChangePassword = async () => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    toast.error('All fields are required!', {position: "top-right"});
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error('New password and confirm password do not match!' , {position: "top-right"});
    return;
  }

  try {
    await changePassword({
      old_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }).unwrap();

    toast.success('Password updated successfully!' , {position: "top-right"});
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  } catch (error: any) {
    const msg =
      error?.data?.detail ||
      error?.data?.old_password?.[0] ||
      error?.data?.new_password?.[0] ||
      'Failed to update password';
    toast.error(msg , {position: "top-right"});
  }
};
 

  // 🟢 ADD: Show message if no token
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your profile</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="space-y-5">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-400 p-2 md:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              Failed to load profile. Please try again.
            </div>
          ) : profile ? (
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Profile Image */}
              <div className="relative shrink-0">
                <img
                  src={imagePreview || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop'}
                  alt="Profile"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div 
                  onClick={handleCameraClick} 
                  className="absolute bottom-0 right-0 w-6 h-6 bg-activeBtnColor rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors"
                >
                  <Camera size={14} className="text-white" /> 
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-[120%]">
                  {profile.full_name || 'System Administrator'}
                </h1>
                <p className="text-sm md:text-base text-[#2F80ED] font-normal leading-6 mt-1">super_admin</p>
                <p className="text-sm text-[#4A5565] font-normal leading-5 mt-1">{profile.email}</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Tabs and Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 md:p-6">
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-activeBtnColor text-white shadow-lg shadow-purple-200'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <CircleUserRound size={24} />
              <span className='text-sm md:text-base font-medium leading-6'>Profile Information</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-[#8B78F6] text-white shadow-lg shadow-purple-200'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Shield size={18} />
              <span className='text-sm md:text-base font-medium leading-6'>Security information</span>
            </button>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              Failed to load profile data.
            </div>
          ) : !profile || !currentProfileData ? (
            <div className="text-center py-12 text-gray-600">
              No profile data available.
            </div>
          ) : (
            <>
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl md:text-2xl font-medium leading-[130%] mb-6">Personal Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="space-y-2">
                      <label className="block text-sm md:text-base font-medium text-[#364153] leading-4">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={currentProfileData.full_name || ''}
                        onChange={handleInputChange}
                        placeholder="Enter name"
                        className="w-full px-4 py-3 text-[#717182] text-sm md:text-base font-normal bg-blue-50 border border-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B78F6] focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm md:text-base font-medium text-[#364153] leading-4">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={currentProfileData.email || ''}
                        onChange={handleInputChange}
                        placeholder="Enter email"
                        className="w-full px-4 py-3 text-[#717182] text-sm md:text-base font-normal bg-blue-50 border border-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B78F6] focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm md:text-base font-medium text-[#364153] leading-4">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={currentProfileData.phone || ''}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                        className="w-full px-4 py-3 text-[#717182] text-sm md:text-base font-normal bg-blue-50 border border-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B78F6] focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm md:text-base font-medium text-[#364153] leading-4">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={currentProfileData.address || ''}
                        onChange={handleInputChange}
                        placeholder="123 Medical Plaza"
                        className="w-full px-4 py-3 text-[#717182] text-sm md:text-base font-normal bg-blue-50 border border-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B78F6] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {hasChanges && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        ⚠️ You have unsaved changes. Click "Save changes" to update.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={handleSaveChanges}
                      disabled={!hasChanges || isUpdating}
                      className={`px-8 py-3 font-medium rounded-lg transition-all duration-200 ${
                        hasChanges && !isUpdating
                          ? 'bg-activeBtnColor text-white hover:bg-[#7C6AE5] shadow-lg shadow-purple-200 cursor-pointer'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isUpdating ? 'Saving...' : 'Save changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isUpdating}
                      className="px-8 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Security Tab - Keep as is */}
                {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-6 mb-6">Security Settings</h2>
              
              <div className=" gap-6">
                
      
<div className="relative mb-2">
  <input
    type={showCurrent ? "text" : "password"}
    placeholder="Enter current password"
    value={currentPassword}
    onChange={(e) => setCurrentPassword(e.target.value)}
    className="w-full px-4 py-3 text-[#717182] text-sm md:text-base font-normal border border-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B78F6] focus:border-transparent transition-all"
  />

  <button
    type="button"
    onClick={() => setShowCurrent(!showCurrent)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
  >
    {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>


<div className="relative mb-2">
  <input
    type={showNew ? "text" : "password"}
    placeholder="Enter new password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    className="w-full px-4 py-3 text-[#717182] text-sm md:text-base font-normal border border-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B78F6] focus:border-transparent transition-all"
  />

  <button
    type="button"
    onClick={() => setShowNew(!showNew)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
  >
    {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>


<div className="relative">
  <input
    type={showConfirm ? "text" : "password"}
    placeholder="Confirm new password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    className="w-full px-4 py-3 text-[#717182] text-sm md:text-base font-normal border border-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B78F6] focus:border-transparent transition-all"
  />

  <button
    type="button"
    onClick={() => setShowConfirm(!showConfirm)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
  >
    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
               <button
  onClick={handleChangePassword}
  disabled={isChanging}
  className={`px-8 py-3 font-medium rounded-lg transition-all duration-200 ${
    isChanging
      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
      : 'bg-activeBtnColor text-white hover:bg-[#7C6AE5] shadow-lg shadow-purple-200 cursor-pointer'
  }`}
>
  {isChanging ? 'Updating...' : 'Update Password'}
</button>
                <button
                  onClick={handleCancel}
                  className="px-8 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;