/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronDown, FileCheck, User, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import BehaviorDetailsTab from "./BehaviorsDetailsTab";
import {
  useCreateBehaviorMutation,
  useUpdateBehaviorMutation,
  type Behavior,
  type BehaviorCategory,
} from '../../redux/features/admin/content/behaviorsApi';
import { toast } from "react-toastify";

type ModalTab = "basic" | "details";

type Props = {
  onClose: () => void;
  mode: "add" | "edit";
  initialData?: Behavior | null;
};

export interface BehaviorDetails {
  possible_root_causes: string;
  suggested_protocol_ids: number[];
  recommended_labs: string;
  recommended_foods: string;
  foods_to_avoid: string;
  supplements_name: string[];
  supplements_images: File[];
}

const AddBehaviorsModal: React.FC<Props> = ({ onClose, mode, initialData }) => {
  const [modalTab, setModalTab] = useState<ModalTab>("basic");
  const [behaviorName, setBehaviorName] = useState("");
  const [category, setCategory] = useState<BehaviorCategory>("physical");
  const [description, setDescription] = useState("");
  const [behaviorImage, setBehaviorImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [details, setDetails] = useState<BehaviorDetails>({
    possible_root_causes: "",
    suggested_protocol_ids: [],
    recommended_labs: "",
    recommended_foods: "",
    foods_to_avoid: "",
    supplements_name: [],
    supplements_images: [],
  });

  const [createBehavior, { isLoading: isCreating }] = useCreateBehaviorMutation();
  const [updateBehavior, { isLoading: isUpdating }] = useUpdateBehaviorMutation();

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setBehaviorName(initialData.behavior_name || "");
      setCategory((initialData.behavior_category as BehaviorCategory) || "physical");
      setDescription(initialData.behavior_description || "");
      setImagePreview(initialData.image || "");
      setBehaviorImage(null);
      setDetails({
        possible_root_causes: initialData.possible_root_causes || "",
        suggested_protocol_ids: initialData.suggested_protocol_ids || [],
        recommended_labs: initialData.recommended_labs || "",
        recommended_foods: initialData.recommended_foods || "",
        foods_to_avoid: initialData.foods_to_avoid || "",
        supplements_name: initialData.supplements_name || [],
        supplements_images: [],
      });
    } else {
      setBehaviorName("");
      setCategory("physical");
      setDescription("");
      setBehaviorImage(null);
      setImagePreview("");
      setDetails({
        possible_root_causes: "",
        suggested_protocol_ids: [],
        recommended_labs: "",
        recommended_foods: "",
        foods_to_avoid: "",
        supplements_name: [],
        supplements_images: [],
      });
    }
  }, [mode, initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { toast.error('Image size should be less than 5MB'); return; }
      if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
      setBehaviorImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleNext = async () => {
    if (modalTab === "basic") {
      if (!behaviorName.trim()) {
        toast.error('Please enter behavior name', { position: 'top-right' });
        return;
      }
      if (!behaviorImage && mode === "add") {
        toast.error('Please upload a behavior image', { position: 'top-right' });
        return;
      }
      setModalTab("details");
      return;
    }

    if (!details.possible_root_causes?.trim()) {
      toast.error('Please enter possible root causes', { position: 'top-right' });
      return;
    }

    try {
      const payload = {
        behavior_name: behaviorName.trim(),
        behavior_category: category,
        behavior_description: description.trim() || "N/A",
        possible_root_causes: details.possible_root_causes.trim(),
        suggested_protocol_ids: details.suggested_protocol_ids || [],
        recommended_labs: details.recommended_labs.trim() || "N/A",
        recommended_foods: details.recommended_foods.trim() || "N/A",
        foods_to_avoid: details.foods_to_avoid.trim() || "N/A",
        image: behaviorImage,                          // behavior এর image
        supplements_name: details.supplements_name,    // supplement names
        supplements_images: details.supplements_images, // supplement images
      };

      console.log('🚀 Submitting payload:', payload);

      if (mode === "edit" && initialData) {
        await updateBehavior({ id: initialData.id, data: payload }).unwrap();
        toast.success('Behavior updated successfully!', { position: 'top-right' });
      } else {
        await createBehavior(payload).unwrap();
        toast.success('Behavior created successfully!', { position: 'top-right' });
      }

      onClose();
    } catch (error: any) {
      console.error('❌ Failed to save behavior:', error);
      let errorMessage = 'Failed to save behavior';
      if (error?.data) {
        const fieldErrors: string[] = [];
        for (const [field, messages] of Object.entries(error.data)) {
          if (Array.isArray(messages)) fieldErrors.push(`${field}: ${messages[0]}`);
          else fieldErrors.push(`${field}: ${String(messages)}`);
        }
        if (fieldErrors.length) errorMessage = fieldErrors.join(', ');
      }
      toast.error(errorMessage, { position: 'top-right' });
    }
  };

  const isLoading = isCreating || isUpdating;


  const [isBehaviorOpen, setIsBehaviorOpen] = useState(false);
const behaviorRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (behaviorRef.current && !behaviorRef.current.contains(event.target as Node)) {
      setIsBehaviorOpen(false);
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
            <h2 className="text-xl font-medium">{mode === "add" ? "Add New Behavior" : "Edit Behavior"}</h2>
            <p className="text-sm text-gray-500 mt-1">Fill in behavior information</p>
          </div>
          <button onClick={onClose} className="cursor-pointer hover:bg-gray-100 p-1 rounded-full transition-colors" disabled={isLoading}>
            <X />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-blue-100 rounded-full p-2 flex gap-2">
          <button
            onClick={() => setModalTab("basic")}
            disabled={isLoading}
            className={`flex-1 py-2 rounded-full cursor-pointer transition-colors ${modalTab === "basic" ? "bg-violet-200" : "hover:bg-blue-200"} disabled:opacity-50`}
          >
            <User className="inline w-4 h-4 mr-1" /> Basic
          </button>
          <button
            onClick={() => setModalTab("details")}
            disabled={isLoading}
            className={`flex-1 py-2 rounded-full cursor-pointer transition-colors ${modalTab === "details" ? "bg-violet-200" : "hover:bg-blue-200"} disabled:opacity-50`}
          >
            <FileCheck className="inline w-4 h-4 mr-1" /> Details
          </button>
        </div>

        {/* Content */}
        <div className="mt-6">
          {modalTab === "basic" ? (
            <div className="space-y-4">

              {/* Behavior Name */}
              <div>
                <label className="block mb-1 font-medium">Behavior Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={behaviorName}
                  onChange={(e) => setBehaviorName(e.target.value)}
                  placeholder="Enter behavior name"
                  disabled={isLoading}
                  className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Behavior Category */}
      <div className="relative" ref={behaviorRef}>
  <label className="block mb-1 font-medium text-gray-700">
    Behavior Category <span className="text-red-500">*</span>
  </label>

  {/* Custom Trigger */}
  <div
    onClick={() => !isLoading && setIsBehaviorOpen(!isBehaviorOpen)}
    className={`w-full p-3 bg-blue-50 rounded-xl flex justify-between items-center cursor-pointer border transition-all ${
      isBehaviorOpen ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'
    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <span className="text-gray-900 capitalize">
      {category ? category : 'Select Category'}
    </span>
    <ChevronDown 
      className={`text-gray-500 transition-transform duration-200 ${isBehaviorOpen ? 'rotate-180' : ''}`} 
      size={20} 
    />
  </div>

  {/* Custom Dropdown Menu */}
  {isBehaviorOpen && (
    <div className="absolute left-0 top-[calc(100%+4px)] z-[999] w-full bg-white border border-gray-100 rounded-xl shadow-2xl py-2 overflow-hidden">
      {['physical', 'sensory', 'emotional', 'digestive'].map((item) => (
        <div
          key={item}
          className={`px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm font-medium capitalize transition-colors ${
            category === item ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
          }`}
          onClick={() => {
            setCategory(item as BehaviorCategory);
            setIsBehaviorOpen(false);
          }}
        >
          {item}
        </div>
      ))}
    </div>
  )}
</div>

              {/* Behavior Image */}
              <div>
                <label className="block mb-1 font-medium">Behavior Image <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex items-center gap-3 p-3 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors">
                    <span className="text-gray-500 text-sm truncate">
                      {behaviorImage ? behaviorImage.name : "Choose image file..."}
                    </span>
                    <input type="file" accept="image/*" className="hidden" disabled={isLoading} onChange={handleImageChange} />
                  </label>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0" />
                  )}
                </div>
                {behaviorImage && <p className="text-sm text-green-600 mt-1">✅ {behaviorImage.name}</p>}
                {!behaviorImage && mode === "edit" && imagePreview && (
                  <p className="text-sm text-gray-400 mt-1">Current image shown. Upload new to replace.</p>
                )}
              </div>

              {/* Behavior Description */}
              <div>
                <label className="block mb-1 font-medium">Behavior Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Enter short description"
                  disabled={isLoading}
                  className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>
          ) : (
            <BehaviorDetailsTab value={details} onChange={setDetails} />
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleNext}
            disabled={isLoading}
            className={`bg-violet-500 text-white px-6 py-3 rounded-xl transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-violet-600'}`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {modalTab === "basic" ? "Please wait..." : mode === "add" ? "Creating..." : "Updating..."}
              </span>
            ) : (
              modalTab === "basic" ? "Next" : mode === "add" ? "Publish Behavior" : "Update Behavior"
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="border px-6 py-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddBehaviorsModal;








// import { ChevronDown, FileCheck, User, X } from "lucide-react";
// import { useState } from "react";
// import BehaviorDetailsTab from "./BehaviorsDetailsTab";

// // Behavior Interface - Must match BehaviorList
// interface Behavior {
//   id: string;
//   name: string;
//   category?: string;
//   description: string;
//   protocolsCount: number;
//   rootCausesCount: number;
//   supplementsCount: number;
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
//   initialData?: Behavior | null;
//   onSave: (data: Omit<Behavior, 'id'> & { id?: string }) => void;
// };

// const AddBehaviorsModal: React.FC<Props> = ({
//   onClose,
//   mode,
//   initialData,
//   onSave,
// }) => {
//   const [modalTab, setModalTab] = useState<ModalTab>("basic");

//   const [title, setTitle] = useState(() =>
//     mode === "edit" && initialData ? initialData.name : ""
//   );
//   const [category, setCategory] = useState(() =>
//     mode === "edit" && initialData ? initialData.category || "Sensory" : "Sensory"
//   );
//   const [description, setDescription] = useState(() =>
//     mode === "edit" && initialData ? initialData.description || "" : ""
//   );
//   const [protocolsCount, setProtocolsCount] = useState(() =>
//     mode === "edit" && initialData ? initialData.protocolsCount : 2
//   );
//   const [rootCausesCount, setRootCausesCount] = useState(() =>
//     mode === "edit" && initialData ? initialData.rootCausesCount : 4
//   );
//   const [supplementsCount, setSupplementsCount] = useState(() =>
//     mode === "edit" && initialData ? initialData.supplementsCount : 2
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

//     const payload = {
//       ...(mode === "edit" && initialData?.id ? { id: initialData.id } : {}),
//       name: title,
//       category,
//       description,
//       protocolsCount,
//       rootCausesCount,
//       supplementsCount,
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
//               {mode === "add" ? "Add New Behavior" : "Edit Behavior"}
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
//               {/* Behavior Name */}
//               <div>
//                 <label className="block mb-1 font-medium">Behavior Name</label>
//                 <input
//                   type="text"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   placeholder="Enter behavior name"
//                   className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Category */}
//               <div className="relative">
//                 <label className="block mb-1 font-medium">Behavior Category</label>
//                 <select
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   className="w-full p-3 appearance-none bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="Sensory">Sensory</option>
//                   <option value="Emotional">Emotional</option>
//                   <option value="Physical">Physical</option>
//                   <option value="Digestive">Digestive</option>
//                 </select>
//                 <ChevronDown className="absolute right-3 top-1/2 mt-4 -translate-y-1/2 text-gray-500 pointer-events-none cursor-pointer" size={20} />
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block mb-1 font-medium">Behavior Description</label>
//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   rows={4}
//                   placeholder="Enter short description"
//                   className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Protocols Count */}
//               <div>
//                 <label className="block mb-1 font-medium">Suggested Protocols Count</label>
//                 <input
//                   type="number"
//                   value={protocolsCount}
//                   onChange={(e) => setProtocolsCount(parseInt(e.target.value) || 0)}
//                   placeholder="Enter count"
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
//             <BehaviorDetailsTab
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
//               ? "Publish Behavior"
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

// export default AddBehaviorsModal;




// import { useState } from "react";


// import BehaviorDetailsTab from "./BehaviorsDetailsTab";

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

// const AddBehaviorsModal: React.FC<Props> = ({
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
//               {mode === "add" ? "Add New Behavior" : "Edit Behavior"}
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
//                 <label className="block mb-1 font-medium">Behavior Name</label>
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
//                 <label className="block mb-1 font-medium">Behavior Category</label>
//                 <select
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   className="w-full p-3 appearance-none bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="Sensory">Sensory</option>
//                   <option value="Emotional">Emotional</option>
//                   <option value="Physical">Physical</option>
//                   <option value="Digestive">Digestive</option>
//                 </select>
//                 <ChevronDown className="absolute right-3 top-1/2 mt-4 -translate-y-1/2 text-gray-500 pointer-events-none cursor-pointer" size={20} />
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block mb-1 font-medium"> Behavior Description</label>
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
//             <BehaviorDetailsTab
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
//               ? "Publish Behavior"
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

// export default AddBehaviorsModal;