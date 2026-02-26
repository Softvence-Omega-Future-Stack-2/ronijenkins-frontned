import  { useState } from 'react';
import { Edit2, Save, X, Eye, EyeOff } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  password: string;
}

export default function AccountSetting() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'John Doe',
    email: 'john@email.com',
    password: '******'
  });

  const [editData, setEditData] = useState<ProfileData>(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    setShowPassword(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
    setShowPassword(false);
  };

  return (
    <div className="">
      <div className="">
        <div className=" ">
          <div className="space-y-6">
            {/* Name Field */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-medium text-gray-700 w-full sm:w-24">
                Name:
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              ) : (
                <span className="flex-1 text-gray-900">{profileData.name}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-medium text-gray-700 w-full sm:w-24">
                Email:
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              ) : (
                <span className="flex-1 text-gray-900">{profileData.email}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-medium text-gray-700 w-full sm:w-24">
                Password:
              </label>
              <div className="flex-1 flex items-center gap-2">
                {isEditing ? (
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={editData.password}
                      onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                      className="w-full px-4 py-2 pr-10 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ) : (
                  <span className="flex-1 text-gray-900">{profileData.password}</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="">
              {isEditing ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 cursor-pointer focus:ring-purple-500 focus:ring-offset-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors cursor-pointer"
                >
                  <span>Edit</span>
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}