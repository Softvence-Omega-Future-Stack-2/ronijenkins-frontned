/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useCreateProviderMutation, useUpdateProviderMutation } from '../../redux/features/admin/providerApi';
import { toast } from 'react-toastify';

interface Provider {
  id: number;
  name: string;
  image: string;
  provider_category: string;
  designation: string;
  specializations: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  city?: string;
  status?: boolean;
  office_hours?: any;
}

interface AddProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  providerData: Provider | null;
}

const AddProviderModal: React.FC<AddProviderModalProps> = ({
  isOpen,
  onClose,
  isEdit,
  providerData,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    provider_category: 'MAPS Doctor',
    designation: '',
    specializations: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    office_hours: JSON.stringify({
      mon: '9:00 AM - 5:00 PM',
      tue: '9:00 AM - 5:00 PM',
      wed: '9:00 AM - 5:00 PM',
      thu: '9:00 AM - 5:00 PM',
      fri: '9:00 AM - 5:00 PM',
      sat: 'Closed',
      sun: 'Closed',
    }),
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  //  API Hooks
  const [createProvider, { isLoading: isCreating }] = useCreateProviderMutation();
  const [updateProvider, { isLoading: isUpdating }] = useUpdateProviderMutation();

  // Form data populate করা Edit mode এ
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isEdit && providerData) {
        setFormData({
          name: providerData.name || '',
          provider_category: providerData.provider_category || 'MAPS Doctor',
          designation: providerData.designation || '',
          specializations: providerData.specializations || '',
          email: providerData.email || '',
          phone: providerData.phone || '',
          website: providerData.website || '',
          address: providerData.address || '',
          city: providerData.city || '',
          office_hours: providerData.office_hours 
            ? JSON.stringify(providerData.office_hours)
            : JSON.stringify({
                mon: '9:00 AM - 5:00 PM',
                tue: '9:00 AM - 5:00 PM',
                wed: '9:00 AM - 5:00 PM',
                thu: '9:00 AM - 5:00 PM',
                fri: '9:00 AM - 5:00 PM',
                sat: 'Closed',
                sun: 'Closed',
              }),
        });
        
        // Existing image preview set করা
        if (providerData.image) {
          setImagePreview(providerData.image);
        }
      } else {
        // Reset form for Add mode
        setFormData({
          name: '',
          provider_category: 'MAPS Doctor',
          designation: '',
          specializations: '',
          email: '',
          phone: '',
          website: '',
          address: '',
          city: '',
          office_hours: JSON.stringify({
            mon: '9:00 AM - 5:00 PM',
            tue: '9:00 AM - 5:00 PM',
            wed: '9:00 AM - 5:00 PM',
            thu: '9:00 AM - 5:00 PM',
            fri: '9:00 AM - 5:00 PM',
            sat: 'Closed',
            sun: 'Closed',
          }),
        });
        setImageFile(null);
        setImagePreview('');
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isEdit, providerData]);

  // Image upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Preview তৈরি করা
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields!');
      return;
    }

    try {
      if (isEdit && providerData) {
        // 🔥 UPDATE API Call
        const updateData: any = {
          ...formData,
          imageFile: imageFile, 
        };

        await updateProvider({
          id: providerData.id,
          data: updateData,
        }).unwrap();

        // alert('Provider updated successfully!');
        toast.success('Provider updated successfully', {position: "top-right"})
      } else {
        // 🔥 CREATE API Call
        const createData: any = {
          ...formData,
          imageFile: imageFile, // image file
        };

        await createProvider(createData).unwrap();

        toast.success('Provider added successfully!', {position: "top-right"});
      }

      onClose(); // Modal close
    } catch (error: any) {
      console.error('Failed to save provider:', error);
       toast.error(" Failed to save Provider. Please try again.", {position: "top-right"});
      
      // Error message show 
      const errorMessage = error?.data?.message || error?.message || 'Failed to save provider';
      alert(errorMessage);
    }
  };

  

  

  return (
    <div   className="fixed inset-0 z-50 flex items-center mt-20 justify-around bg-black/40 p-4">
      <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl md:p-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-medium text-[#0A0A0A] leading-[120%] mb-2.5">
              {isEdit ? "Edit Provider" : "Add New Provider"}
            </h2>
            <p className="text-base font-normal text-[#717182] leading-6">
              Set up Provider parameters
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-full p-1 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Image Upload */}
          <section>
            <h3 className="mb-4 text-base font-medium text-[#0A0A0A] leading-[150%]">
              Profile Image
            </h3>
            
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
              />
            </div>
          </section>

          {/* Basic Information */}
          <section>
            <h3 className="mb-4 text-base font-medium text-[#0A0A0A] leading-[150%]">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3.5">
                <label className="text-base font-medium text-[#364153] leading-6">
                  Provider Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border-none bg-indigo-50/50 p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter provider name"
                />
              </div>

              <div className="space-y-3.5">
                <label className="text-base font-medium text-[#364153] leading-6">
                  Provider Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.provider_category}
                    onChange={(e) => setFormData({ ...formData, provider_category: e.target.value })}
                    className="w-full appearance-none rounded-lg border-none bg-indigo-50/50 p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>MAPS Doctor</option>
                    <option>Functional Medicine</option>
                    <option>DANI Practitioner</option>
                    <option>Nutritionist</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="space-y-3.5">
                <label className="text-base font-medium text-[#364153] leading-6">
                  Designation
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full rounded-lg border-none bg-indigo-50/50 p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., MD, MAPS"
                />
              </div>

              <div className="space-y-3.5">
                <label className="text-base font-medium text-[#364153] leading-6">
                  Specializations
                </label>
                <input
                  type="text"
                  value={formData.specializations}
                  onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                  className="w-full rounded-lg border-none bg-indigo-50/50 p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Cardiology, Neurology"
                />
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h3 className="mb-4 text-base font-medium text-[#0A0A0A] leading-6">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3.5">
                <label className="text-base font-medium text-[#364153] leading-6">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="provider@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border-none bg-indigo-50/50 p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-3.5">
                <label className="text-base font-medium text-[#364153] leading-6">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter Phone number with Country code"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-lg border-none bg-indigo-50/50 p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-3.5">
                <label className="text-base font-medium text-[#364153] leading-6">
                  Website
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full rounded-lg border-none bg-indigo-50/50 p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </section>

          {/* Location */}
          <section>
            <h3 className="mb-4 text-base font-medium text-[#0A0A0A] leading-6">
              Location
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3.5">
                <label className="text-base font-medium text-[#364153] leading-6">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="123 Main Street"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-lg border-none bg-indigo-50/50 p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-3.5">
                <label className="text-base font-medium text-[#364153] leading-6">
                  City, State ZIP
                </label>
                <input
                  type="text"
                  placeholder="San Francisco, CA 94102"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-lg border-none bg-indigo-50/50 p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className={`rounded-lg bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet-600 active:scale-95 shadow-lg shadow-indigo-200 ${
                (isCreating || isUpdating) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {isCreating || isUpdating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                      fill="none"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {isEdit ? 'Updating...' : 'Adding...'}
                </span>
              ) : (
                isEdit ? 'Update Provider' : 'Add Provider'
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isCreating || isUpdating}
              className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProviderModal;







// import React, { useState, useEffect } from 'react';
// import { X, ChevronDown } from 'lucide-react';

// interface Provider {
//   id: number;
//   name: string;
//   specialist: string;
//   email: string;
//   contact: string;
//   location: string;
// }

// interface AddProviderModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   isEdit: boolean;
//   providerData: Provider | null;
// }

// const AddProviderModal: React.FC<AddProviderModalProps> = ({
//   isOpen,
//   onClose,
//   isEdit,
//   providerData,
// }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     specialist: 'MAPS Doctor',
//     email: '',
//     contact: '',
//     website: '',
//     officeHour: '',
//     address: '',
//     location: '',
//   });



// useEffect(() => {
//   //  Wrap in setTimeout to defer state update
//   const timer = setTimeout(() => {
//     if (isEdit && providerData) {
//       setFormData({
//         name: providerData.name,
//         specialist: providerData.specialist,
//         email: providerData.email,
//         contact: providerData.contact,
//         website: '',
//         officeHour: '',
//         address: '',
//         location: providerData.location,
//       });
//     } else {
//       setFormData({
//         name: '',
//         specialist: 'MAPS Doctor',
//         email: '',
//         contact: '',
//         website: '',
//         officeHour: '',
//         address: '',
//         location: '',
//       });
//     }
//   }, 0);

//   return () => clearTimeout(timer);
// }, [isEdit, providerData]);

//   if (!isOpen) return null;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (isEdit) {
//       console.log("Update Provider:", formData);
//     } else {
//       console.log("Add Provider:", formData);
//     }

//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center mt-20 justify-around bg-black/40 p-4">
//       <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl md:p-8">
//         {/* Header */}
//         <div className="mb-6 flex items-start justify-between">
//           <div>
//             <h2 className="text-xl md:text-2xl font-medium text-[#0A0A0A] leading-[120%] mb-2.5">
//               {isEdit ? "Edit Provider" : "Add New Provider"}
//             </h2>
//             <p className="text-base font-normal text-[#717182] leading-6">
//               Set up Provider parameters
//             </p>
//           </div>
//           <button onClick={onClose} className="rounded-full p-1 hover:bg-slate-100 transition-colors cursor-pointer">
//             <X className="h-5 w-5 text-slate-400" />
//           </button>
//         </div>

//         <form className="space-y-8" onSubmit={handleSubmit}>
//           {/* Basic Information */}
//           <section>
//             <h3 className="mb-4 text-base font-medium text-[#0A0A0A] leading-[150%]">
//               Basic Information <span className="text-slate-900 normal-case font-normal ml-1">Notes</span>
//             </h3>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <div className="space-y-3.5">
//                 <label className="text-base font-medium text-[#364153] leading-6">Provider Name</label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   className="w-full rounded-lg border-none bg-indigo-50/50 p-3 text-sm focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>

//               <div className="space-y-3.5">
//                 <label className="text-base font-medium text-[#364153] leading-6">Provider Category</label>
//                 <div className="relative">
//                   <select
//                     value={formData.specialist}
//                     onChange={(e) => setFormData({ ...formData, specialist: e.target.value })}
//                     className="w-full appearance-none rounded-lg border-none bg-indigo-50/50 p-3 text-sm focus:ring-2 focus:ring-indigo-500"
//                   >
//                     <option>MAPS Doctor</option>
//                     <option>Functional Medicine</option>
//                     <option>DANI Practitioner</option>
//                     <option>Nutritionist</option>
//                   </select>
//                   <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Contact */}
//           <section>
//             <h3 className="mb-4 text-base font-medium text-[#0A0A0A] leading-6">Contact Information</h3>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 className="w-full rounded-lg border-none bg-indigo-50/50 p-3 text-sm"
//               />

//               <input
//                 type="text"
//                 placeholder="Phone"
//                 value={formData.contact}
//                 onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
//                 className="w-full rounded-lg border-none bg-indigo-50/50 p-3 text-sm"
//               />

//               <input
//                 type="text"
//                 placeholder="Website"
//                 value={formData.website}
//                 onChange={(e) => setFormData({ ...formData, website: e.target.value })}
//                 className="w-full rounded-lg border-none bg-indigo-50/50 p-3 text-sm"
//               />

//               <input
//                 type="text"
//                 placeholder="Office Hour"
//                 value={formData.officeHour}
//                 onChange={(e) => setFormData({ ...formData, officeHour: e.target.value })}
//                 className="w-full rounded-lg border-none bg-indigo-50/50 p-3 text-sm"
//               />
//             </div>
//           </section>

//           {/* Location */}
//           <section>
//             <h3 className="mb-4 text-base font-medium text-[#0A0A0A] leading-6">Location</h3>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <input
//                 type="text"
//                 placeholder="Address"
//                 value={formData.address}
//                 onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                 className="w-full rounded-lg border-none bg-indigo-50/50 p-3 text-sm"
//               />

//               <input
//                 type="text"
//                 placeholder="City, State ZIP"
//                 value={formData.location}
//                 onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//                 className="w-full rounded-lg border-none bg-indigo-50/50 p-3 text-sm"
//               />
//             </div>
//           </section>

//           {/* Actions */}
//           <div className="flex gap-3 pt-4">
//             <button
//               type="submit"
//               className="rounded-lg bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet-500 active:scale-95 shadow-lg cursor-pointer shadow-indigo-200"
//             >
//               {isEdit ? "Update Provider" : "Add Provider"}
//             </button>

//             <button
//               type="button"
//               onClick={onClose}
//               className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 cursor-pointer"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProviderModal;