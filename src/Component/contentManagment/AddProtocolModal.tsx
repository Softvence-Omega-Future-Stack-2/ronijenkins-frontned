/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronDown, FileCheck, User, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ProtocolDetailsTab from "./ProtocolDetailsTab";
import {
  useCreateProtocolMutation,
  useUpdateProtocolMutation,
  type Protocol,
  type ProtocolCategory,
} from '../../redux/features/admin/content/protocolApi';
import { toast } from "react-toastify";

type ModalTab = "basic" | "details";

type Props = {
  onClose: () => void;
  mode: "add" | "edit";
  initialData?: Protocol | null;
};

interface ProtocolDetails {
  symptoms_addressed: string;
  healing_approach: string;
  recommended_labs: string;
  key_supplements: string;
  recommended_foods: string;
  foods_to_avoid: string;
}

const AddProtocolModal: React.FC<Props> = ({ onClose, mode, initialData }) => {
  const [modalTab, setModalTab] = useState<ModalTab>("basic");

  // Basic Info State
  const [protocolName, setProtocolName] = useState("");
  const [category, setCategory] = useState<ProtocolCategory>("gut_health");
  const [description, setDescription] = useState("");
  const [rootCausesCount, setRootCausesCount] = useState(0);
  const [supplementsCount, setSupplementsCount] = useState(0);

  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Details State
  const [details, setDetails] = useState<ProtocolDetails>({
    symptoms_addressed: "",
    healing_approach: "",
    recommended_labs: "",
    key_supplements: "",
    recommended_foods: "",
    foods_to_avoid: "",
  });

  const [createProtocol, { isLoading: isCreating }] = useCreateProtocolMutation();
  const [updateProtocol, { isLoading: isUpdating }] = useUpdateProtocolMutation();

  // N/A কে empty string এ convert করুন
  const cleanValue = (val: any): string => {
    if (!val || val === 'N/A') return '';
    if (Array.isArray(val)) return val.filter(v => v !== 'N/A').join(', ');
    return String(val).trim();
  };

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setProtocolName(initialData.protocol_name || "");
      setCategory(initialData.category || "gut_health");
      setDescription(initialData.description || "");
      setRootCausesCount(initialData.root_causes_count || 0);
      setSupplementsCount(initialData.supplements_count || 0);

      if (initialData.image) {
        setImagePreview(initialData.image);
      }

      setDetails({
        symptoms_addressed: cleanValue(initialData.symptoms_addressed),
        healing_approach: cleanValue(initialData.healing_approach),
        recommended_labs: cleanValue(initialData.recommended_labs),
        key_supplements: cleanValue(initialData.key_supplements),
        recommended_foods: cleanValue(initialData.recommended_foods),
        foods_to_avoid: cleanValue(initialData.foods_to_avoid),
      });
    } else {
      // Reset for Add mode
      setProtocolName("");
      setCategory("gut_health");
      setDescription("");
      setRootCausesCount(0);
      setSupplementsCount(0);
      setImageFile(null);
      setImagePreview("");
      setDetails({
        symptoms_addressed: "",
        healing_approach: "",
        recommended_labs: "",
        key_supplements: "",
        recommended_foods: "",
        foods_to_avoid: "",
      });
    }
  }, [mode, initialData]);

  const handleNext = async () => {
    if (modalTab === "basic") {
      if (!protocolName.trim()) {
        toast.error('Please enter protocol name', { position: 'top-right' });
        return;
      }
      setModalTab("details");
      return;
    }

    try {
      const ensureString = (value: any): string => {
        if (typeof value === 'string') return value.trim();
        if (Array.isArray(value)) return value.join(', ').trim();
        return String(value || '').trim();
      };

      const symptomsValue = ensureString(details.symptoms_addressed);
      const healingValue = ensureString(details.healing_approach);
      const labsValue = ensureString(details.recommended_labs);
      const supplementsValue = ensureString(details.key_supplements);
      const foodsValue = ensureString(details.recommended_foods);
      const avoidValue = ensureString(details.foods_to_avoid);

      const payload: any = {
        protocol_name: protocolName.trim(),
        category: category,
        description: description.trim(),
        root_causes_count: rootCausesCount,
        supplements_count: supplementsCount,
        symptoms_addressed: symptomsValue || "N/A",
        healing_approach: healingValue || "N/A",
        recommended_labs: labsValue || "N/A",
        key_supplements: supplementsValue || "N/A",
        recommended_foods: foodsValue || "N/A",
        foods_to_avoid: avoidValue || "N/A",
      };

      if (imageFile) {
        payload.imageFile = imageFile;
      }

      console.log('🚀 Submitting payload:', payload);

      if (mode === "edit" && initialData) {
        await updateProtocol({ id: initialData.id, data: payload }).unwrap();
        toast.success('Protocol updated successfully!', { position: 'top-right' });
      } else {
        await createProtocol(payload).unwrap();
        toast.success('Protocol created successfully!', { position: 'top-right' });
      }

      onClose();
    } catch (error: any) {
      console.error('❌ Failed to save protocol:', error);

      let errorMessage = 'Failed to save protocol';

      if (error?.data) {
        const errorData = error.data;
        if (typeof errorData === 'object' && !errorData.message && !errorData.detail) {
          const fieldErrors: string[] = [];
          for (const [field, messages] of Object.entries(errorData)) {
            if (Array.isArray(messages)) {
              fieldErrors.push(`${field}: ${messages[0]}`);
            } else if (typeof messages === 'string') {
              fieldErrors.push(`${field}: ${messages}`);
            }
          }
          if (fieldErrors.length > 0) errorMessage = fieldErrors.join(', ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      }

      toast.error(errorMessage, { position: 'top-right' });
    }
  };

  const handleDetailsChange = (field: keyof ProtocolDetails, value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const dropdownRef = useRef<HTMLDivElement>(null);

// বাইরের ক্লিকে ড্রপডাউন বন্ধ করার লজিক
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-xl font-medium">
              {mode === "add" ? "Add New Protocol" : "Edit Protocol"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Fill in protocol information</p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer hover:bg-gray-100 p-1 rounded-full transition-colors"
            disabled={isCreating || isUpdating}
          >
            <X />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-blue-100 rounded-full p-2 flex gap-2">
          <button
            onClick={() => setModalTab("basic")}
            disabled={isCreating || isUpdating}
            className={`flex-1 py-2 rounded-full cursor-pointer transition-colors ${
              modalTab === "basic" ? "bg-violet-200" : "hover:bg-blue-200"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <User className="inline w-4 h-4 mr-1" />
            Basic
          </button>
          <button
            onClick={() => setModalTab("details")}
            disabled={isCreating || isUpdating}
            className={`flex-1 py-2 rounded-full cursor-pointer transition-colors ${
              modalTab === "details" ? "bg-violet-200" : "hover:bg-blue-200"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <FileCheck className="inline w-4 h-4 mr-1" />
            Details
          </button>
        </div>

        {/* Content */}
        <div className="mt-6">
          {modalTab === "basic" ? (
            <div className="space-y-4">

              {/* Image Upload */}
              <div>
                <label className="block mb-2 font-medium">Protocol Image</label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isCreating || isUpdating}
                    className="flex-1 rounded-lg border border-gray-300 p-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Protocol Name */}
              <div>
                <label className="block mb-1 font-medium">
                  Protocol Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={protocolName}
                  onChange={(e) => setProtocolName(e.target.value)}
                  placeholder="Enter protocol name"
                  className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isCreating || isUpdating}
                />
              </div>

              {/* Category */}
          
<div className="relative" ref={dropdownRef}>
  <label className="block mb-1 font-medium text-gray-700">
    Category <span className="text-red-500">*</span>
  </label>


  <div
    onClick={() => !isCreating && !isUpdating && setIsDropdownOpen(!isDropdownOpen)}
    className={`w-full p-3 bg-blue-50 rounded-xl flex justify-between items-center cursor-pointer border transition-all ${
      isDropdownOpen ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'
    } ${(isCreating || isUpdating) ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <span className="text-gray-900 capitalize">
      {category ? category.replace('_', ' ') : 'Select Category'}
    </span>
    <ChevronDown 
      className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
      size={20} 
    />
  </div>

  {/* Dropdown Options List */}
  {isDropdownOpen && (
    <div className="absolute left-0 top-[calc(100%+4px)] z-[999] w-full bg-white border border-gray-100 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2">
      {[
        { label: 'Gut Health', value: 'gut_health' },
        { label: 'Detoxification', value: 'detoxification' },
        { label: 'Immune Support', value: 'immune_support' },
        { label: 'Behavioral', value: 'behavioral' }
      ].map((item) => (
        <div
          key={item.value}
          className={`px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm font-medium transition-colors ${
            category === item.value ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
          }`}
          onClick={() => {
            setCategory(item.value as ProtocolCategory);
            setIsDropdownOpen(false);
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  )}
</div>

              {/* Description */}
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Enter short description"
                  className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isCreating || isUpdating}
                />
              </div>

              {/* Root Causes Count */}
              <div>
                <label className="block mb-1 font-medium">Root Causes Count</label>
                <input
                  type="number"
                  value={rootCausesCount}
                  onChange={(e) => setRootCausesCount(parseInt(e.target.value) || 0)}
                  placeholder="Enter count"
                  className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isCreating || isUpdating}
                />
              </div>

              {/* Supplements Count */}
              <div>
                <label className="block mb-1 font-medium">Supplements Count</label>
                <input
                  type="number"
                  value={supplementsCount}
                  onChange={(e) => setSupplementsCount(parseInt(e.target.value) || 0)}
                  placeholder="Enter count"
                  className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isCreating || isUpdating}
                />
              </div>

            </div>
          ) : (
            <ProtocolDetailsTab
              value={details}
              onChange={handleDetailsChange}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleNext}
            disabled={isCreating || isUpdating}
            className={`bg-violet-500 text-white px-6 py-3 rounded-xl transition-colors ${
              (isCreating || isUpdating)
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:bg-violet-600'
            }`}
          >
            {isCreating || isUpdating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {modalTab === "basic" ? "Please wait..." : mode === "add" ? "Creating..." : "Updating..."}
              </span>
            ) : (
              modalTab === "basic" ? "Next" : mode === "add" ? "Publish Protocol" : "Update Protocol"
            )}
          </button>

          <button
            onClick={onClose}
            disabled={isCreating || isUpdating}
            className="border px-6 py-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddProtocolModal;





// import { ChevronDown, FileCheck, User, X } from "lucide-react";
// import { useState } from "react";
// import ProtocolDetailsTab from "./ProtocolDetailsTab";

// // Protocol Interface - Must match ProtocolList
// interface Protocol {
//   id: number;
//   title: string;
//   description: string;
//   category: string;
//   rootCausesCount: number;
//   supplementsCount: number;
//   categoryColor: string;
// }


// export interface SupplementDetails {
//   image: string | null;
//   worksWith: string[];
//   avoidWith: string[];
//   primaryBenefits: string;
//   childrenDosage: string;
//   adultDosage: string;
//   sideEffects: string;
// }

// type ModalTab = "basic" | "details";

// type Props = {
//   onClose: () => void;
//   mode: "add" | "edit";
//   initialData?: Protocol | null;
//   onSave: (data: Omit<Protocol, 'id'> & { id?: number }) => void;
// };

// const AddProtocolModal: React.FC<Props> = ({
//   onClose,
//   mode,
//   initialData,
//   onSave,
// }) => {
//   const [modalTab, setModalTab] = useState<ModalTab>("basic");

//   const [title, setTitle] = useState(() =>
//     mode === "edit" && initialData ? initialData.title : ""
//   );
//   const [category, setCategory] = useState(() =>
//     mode === "edit" && initialData ? initialData.category || "Gut Health" : "Gut Health"
//   );
//   const [description, setDescription] = useState(() =>
//     mode === "edit" && initialData ? initialData.description || "" : ""
//   );
//   const [rootCausesCount, setRootCausesCount] = useState(() =>
//     mode === "edit" && initialData ? initialData.rootCausesCount : 0
//   );
//   const [supplementsCount, setSupplementsCount] = useState(() =>
//     mode === "edit" && initialData ? initialData.supplementsCount : 0
//   );

//   const [details, setDetails] = useState<SupplementDetails>({
//     image: null,
//     worksWith: [],
//     avoidWith: [],
//     primaryBenefits: "",
//     childrenDosage: "",
//     adultDosage: "",
//     sideEffects: "",
//   });

//   const handleNext = () => {
//     if (modalTab === "basic") {
//       setModalTab("details");
//       return;
//     }

//     const categoryColor =
//       category === "Gut Health" ? "bg-indigo-50 text-indigo-500" :
//       category === "Detoxification" ? "bg-purple-50 text-purple-500" :
//       category === "Immune Support" ? "bg-fuchsia-50 text-fuchsia-500" :
//       "bg-emerald-50 text-emerald-500";

//     const payload = {
//       ...(mode === "edit" && initialData?.id ? { id: initialData.id } : {}),
//       title,
//       category,
//       description,
//       rootCausesCount,
//       supplementsCount,
//       categoryColor,
//     };

//     onSave(payload);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">

//         {/* Header */}
//         <div className="flex justify-between mb-4">
//           <div>
//             <h2 className="text-xl font-medium">
//               {mode === "add" ? "Add New Protocol" : "Edit Protocol"}
//             </h2>
//           </div>
//           <button onClick={onClose} className="cursor-pointer">
//             <X />
//           </button>
//         </div>

//         {/* Tabs */}
//         <div className="bg-blue-100 rounded-full p-2 flex gap-2">
//           <button
//             onClick={() => setModalTab("basic")}
//             className={`flex-1 py-2 rounded-full cursor-pointer ${
//               modalTab === "basic" && "bg-violet-200"
//             }`}
//           >
//             <User className="inline w-4 h-4 mr-1" />
//             Basic
//           </button>

//           <button
//             onClick={() => setModalTab("details")}
//             className={`flex-1 py-2 rounded-full cursor-pointer ${
//               modalTab === "details" && "bg-violet-200"
//             }`}
//           >
//             <FileCheck className="inline w-4 h-4 mr-1" />
//             Details
//           </button>
//         </div>

//         {/* Content */}
//         <div className="mt-6">
//           {modalTab === "basic" ? (
//             <div className="space-y-4">
//               {/* Protocol Name */}
//               <div>
//                 <label className="block mb-1 font-medium">Protocol Name</label>
//                 <input
//                   type="text"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   placeholder="Enter protocol name"
//                   className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Category */}
//               <div className="relative">
//                 <label className="block mb-1 font-medium">Category</label>
//                 <select
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   className="w-full p-3 appearance-none bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="Gut Health">Gut Health</option>
//                   <option value="Detoxification">Detoxification</option>
//                   <option value="Immune Support">Immune Support</option>
//                   <option value="Behavioral">Behavioral</option>
//                 </select>
//                 <ChevronDown className="absolute right-3 top-1/2 mt-4 -translate-y-1/2 text-gray-500 pointer-events-none cursor-pointer" size={20} />
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block mb-1 font-medium">Description</label>
//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   rows={4}
//                   placeholder="Enter short description"
//                   className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Root Causes Count */}
//               <div>
//                 <label className="block mb-1 font-medium">Root Causes Count</label>
//                 <input
//                   type="number"
//                   value={rootCausesCount}
//                   onChange={(e) => setRootCausesCount(parseInt(e.target.value) || 0)}
//                   placeholder="Enter count"
//                   className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Supplements Count */}
//               <div>
//                 <label className="block mb-1 font-medium">Supplements Count</label>
//                 <input
//                   type="number"
//                   value={supplementsCount}
//                   onChange={(e) => setSupplementsCount(parseInt(e.target.value) || 0)}
//                   placeholder="Enter count"
//                   className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//           ) : (
//             <ProtocolDetailsTab
//               value={details}
//               onChange={setDetails}
//             />
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex gap-3 mt-6">
//           <button
//             onClick={handleNext}
//             className="bg-violet-500 text-white px-6 py-3 rounded-xl cursor-pointer"
//           >
//             {modalTab === "basic"
//               ? "Next"
//               : mode === "add"
//               ? "Publish Protocol"
//               : "Update"}
//           </button>

//           <button
//             onClick={onClose}
//             className="border px-6 py-3 rounded-xl cursor-pointer"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProtocolModal;





// import { ChevronDown, FileCheck, User, X } from "lucide-react";
// import { useState } from "react";

// import ProtocolDetailsTab from "./ProtocolDetailsTab";

// type ModalTab = "basic" | "details";

// export interface SupplementDetails {
//   image: string | null;
//   worksWith: string[];
//   avoidWith: string[];
//   primaryBenefits: string;
//   childrenDosage: string;
//   adultDosage: string;
//   sideEffects: string;
// }

// type Props = {
//   onClose: () => void;
//   mode: "add" | "edit";
//   initialData?: {
//     id: number;
//     name: string;
//     category?: string;
//     description: string;
//   } & Partial<SupplementDetails> | null;
// };

// const AddProtocolModal: React.FC<Props> = ({
//   onClose,
//   mode,
//   initialData,
// }) => {
//   const [modalTab, setModalTab] = useState<ModalTab>("basic");

//   // ✅ Updated: Prefill for edit mode
//   const [title, setTitle] = useState(() =>
//     mode === "edit" && initialData ? initialData.name : ""
//   );
//   const [category, setCategory] = useState(() =>
//     mode === "edit" && initialData ? initialData.category || "Behavioral" : "Behavioral"
//   );
//   const [description, setDescription] = useState(() =>
//     mode === "edit" && initialData ? initialData.description || "" : ""
//   );

//   // ✅ DETAILS STATE
//   const [details, setDetails] = useState<SupplementDetails>(() => ({
//     image: initialData?.image ?? null,
//     worksWith: initialData?.worksWith ?? [],
//     avoidWith: initialData?.avoidWith ?? [],
//     primaryBenefits: initialData?.primaryBenefits ?? "",
//     childrenDosage: initialData?.childrenDosage ?? "",
//     adultDosage: initialData?.adultDosage ?? "",
//     sideEffects: initialData?.sideEffects ?? "",
//   }));

//   const handleNext = () => {
//     if (modalTab === "basic") {
//       setModalTab("details");
//       return;
//     }

//     const payload = {
//       name: title,
//       category,
//       description,
//       ...details,
//     };

//     if (mode === "add") {
//       console.log("ADD PROTOCOL", payload);
//     } else {
//       console.log("EDIT PROTOCOL", {
//         id: initialData?.id,
//         ...payload,
//       });
//     }

//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">

//         {/* Header */}
//         <div className="flex justify-between mb-4">
//           <div>
//             <h2 className="text-xl font-medium">
//               {mode === "add" ? "Add New Protocol" : "Edit Protocol"}
//             </h2>
//           </div>
//           <button onClick={onClose}>
//             <X />
//           </button>
//         </div>

//         {/* Tabs */}
//         <div className="bg-blue-100 rounded-full p-2 flex gap-2">
//           <button
//             onClick={() => setModalTab("basic")}
//             className={`flex-1 py-2 rounded-full cursor-pointer ${
//               modalTab === "basic" && "bg-violet-200"
//             }`}
//           >
//             <User className="inline w-4 h-4 mr-1" />
//             Basic
//           </button>

//           <button
//             onClick={() => setModalTab("details")}
//             className={`flex-1 py-2 rounded-full cursor-pointer ${
//               modalTab === "details" && "bg-violet-200"
//             }`}
//           >
//             <FileCheck className="inline w-4 h-4 mr-1" />
//             Details
//           </button>
//         </div>

//         {/* Content */}
//         <div className="mt-6">
//           {modalTab === "basic" ? (
//             <div className="space-y-4">
//               {/* Protocol Name */}
//               <div>
//                 <label className="block mb-1 font-medium">Protocol Name</label>
//                 <input
//                   type="text"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   placeholder="Enter protocol name"
//                   className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Category */}
//               <div className="relative">
//                 <label className="block mb-1 font-medium">Category</label>
//                 <select
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   className="w-full p-3 appearance-none bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="Gut Health">Gut Health</option>
//                   <option value="Detoxification">Detoxification</option>
//                   <option value="Immune Support">Immune Support</option>
//                   <option value="Behavioral">Behavioral</option>
//                 </select>
//                 <ChevronDown className="absolute right-3 top-1/2 mt-4 -translate-y-1/2 text-gray-500 pointer-events-none cursor-pointer" size={20} />
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block mb-1 font-medium">Description</label>
//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   rows={4}
//                   placeholder="Enter short description"
//                   className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//           ) : (
//             <ProtocolDetailsTab
//               value={details}
//               onChange={setDetails}
//             />
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex gap-3 mt-6">
//           <button
//             onClick={handleNext}
//             className="bg-violet-500 text-white px-6 py-3 rounded-xl cursor-pointer"
//           >
//             {modalTab === "basic"
//               ? "Next"
//               : mode === "add"
//               ? "Publish Protocol"
//               : "Update"}
//           </button>

//           <button
//             onClick={onClose}
//             className="border px-6 py-3 rounded-xl cursor-pointer"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProtocolModal;








// import { ChevronDown, FileCheck, User, X } from "lucide-react";
// import { useState } from "react";

// import ProtocolDetailsTab from "./ProtocolDetailsTab";

// type ModalTab = "basic" | "details";

// export interface SupplementDetails {
//   image: string | null;
//   worksWith: string[];
//   avoidWith: string[];
//   primaryBenefits: string;
//   childrenDosage: string;
//   adultDosage: string;
//   sideEffects: string;
// }

// type Props = {
//   onClose: () => void;
//   mode: "add" | "edit";
//   initialData?: {
//     id: number;
//     name: string;
//     description: string;
//   } & Partial<SupplementDetails> | null;
// };

// const AddProtocolModal: React.FC<Props> = ({
//   onClose,
//   mode,
//   initialData,
// }) => {
//   const [modalTab, setModalTab] = useState<ModalTab>("basic");
//  const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("Behavioral");
//   const [description, setDescription] = useState("");

//   const [protocolName, setProtocolName] = useState(
//     () => (mode === "edit" && initialData ? initialData.name : "")
//   );

//   const [shortDescription, setShortDescription] = useState(
//     () => (mode === "edit" && initialData ? initialData.description : "")
//   );

//   // ✅ DETAILS STATE (IMPORTANT)
//   const [details, setDetails] = useState<SupplementDetails>(() => ({
//     image: initialData?.image ?? null,
//     worksWith: initialData?.worksWith ?? [],
//     avoidWith: initialData?.avoidWith ?? [],
//     primaryBenefits: initialData?.primaryBenefits ?? "",
//     childrenDosage: initialData?.childrenDosage ?? "",
//     adultDosage: initialData?.adultDosage ?? "",
//     sideEffects: initialData?.sideEffects ?? "",
//   }));

//   const handleNext = () => {
//     if (modalTab === "basic") {
//       setModalTab("details");
//       return;
//     }

//     const payload = {
//       name: protocolName,
//       description: shortDescription,
//       ...details,
//     };

//     if (mode === "add") {
//       console.log("ADD SUPPLEMENT", payload);
//     } else {
//       console.log("EDIT SUPPLEMENT", {
//         id: initialData?.id,
//         ...payload,
//       });
//     }

//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">

//         {/* Header */}
//         <div className="flex justify-between mb-4">
//           <div>
//             <h2 className="text-xl font-medium">
//               {mode === "add" ? "Add New Protocol" : "Edit Protocol"}
//             </h2>
//             {/* <p className="text-gray-500">
//               {mode === "add"
//                 ? "Create Protocol"
//                 : "Update Protocol"}
//             </p> */}
//           </div>
//           <button onClick={onClose}>
//             <X />
//           </button>
//         </div>

//         {/* Tabs */}
//         <div className="bg-blue-100 rounded-full p-2 flex gap-2">
//           <button
//             onClick={() => setModalTab("basic")}
//             className={`flex-1 py-2 rounded-full cursor-pointer ${
//               modalTab === "basic" && "bg-violet-200"
//             }`}
//           >
//             <User className="inline w-4 h-4 mr-1" />
//             Basic
//           </button>

//           <button
//             onClick={() => setModalTab("details")}
//             className={`flex-1 py-2 rounded-full cursor-pointer ${
//               modalTab === "details" && "bg-violet-200"
//             }`}
//           >
//             <FileCheck className="inline w-4 h-4 mr-1" />
//             Details
//           </button>
//         </div>

//         {/* Content */}
//         <div className="mt-6">
//           {modalTab === "basic" ? (
//       <div className="space-y-4">
//           {/* Protocol Name */}
//           <div>
//             <label className="block mb-1 font-medium">Protocol Name</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Enter protocol name"
//               className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Category */}
//           <div className="relative">
//             <label className="block mb-1 font-medium">Category</label>
//             <select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="w-full p-3 appearance-none bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
         
              
//               <option value="Gut Health">Gut Health</option>
//               <option value="detocification">Detoxification</option>
//               <option value="Immune Support">Immune Support</option>
//                    <option value="Behavioral">Behavioral</option>
//             </select>
//               <ChevronDown className="absolute right-3 top-1/2 mt-4 -translate-y-1/2 text-gray-500 pointer-events-none cursor-pointer" size={20} />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block mb-1 font-medium">Description</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               rows={4}
//               placeholder="Enter short description"
//               className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//           ) : (
//             <ProtocolDetailsTab
//               value={details}
//               onChange={setDetails}
//             />
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex gap-3 mt-6">
//           <button
//             onClick={handleNext}
//             className="bg-violet-500 text-white px-6 py-3 rounded-xl cursor-pointer"
//           >
//             {modalTab === "basic"
//               ? "Next"
//               : mode === "add"
//               ? "Publish Protocol"
//               : "Update"}
//           </button>

//           <button
//             onClick={onClose}
//             className="border px-6 py-3 rounded-xl cursor-pointer"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProtocolModal;