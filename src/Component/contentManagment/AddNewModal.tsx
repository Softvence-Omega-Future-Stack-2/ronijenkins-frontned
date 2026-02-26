/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileCheck, User, X } from "lucide-react";
import { useState, useEffect } from "react";
import SuplimentsDetailsTab, { type SupplementDetails } from "./SuplimentsDetailsTab";
import {
  useAddSupplementMutation,
  useUpdateSupplementMutation,
  type Supplement,
} from "../../redux/features/admin/content/suplimentsApi";
import { toast } from "react-toastify";

type ModalTab = "basic" | "details";

type Props = {
  onClose: () => void;
  mode: "add" | "edit";
  initialData?: Supplement | null;
  onSuccess?: () => void;
  onSave: (data: { name: string; description: string }) => Promise<void>;
};

const parseList = (val: any): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
};

const cleanNA = (val: any): string => {
  if (!val || val === 'N/A') return '';
  return String(val);
};

const AddNewModal: React.FC<Props> = ({ onClose, mode, initialData, onSuccess }) => {
  const [modalTab, setModalTab] = useState<ModalTab>("basic");
  const [supplementName, setSupplementName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [details, setDetails] = useState<SupplementDetails>({
    image: null,
    worksWith: [],
    avoidWith: [],
    primaryBenefits: "",
    childrenDosage: "",
    adultDosage: "",
    sideEffects: "",
    signsOfDeficiency: "",
  });

  const [addSupplement] = useAddSupplementMutation();
  const [updateSupplement] = useUpdateSupplementMutation();
  const [loading, setLoading] = useState(false);

  // Load initialData when editing
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setSupplementName(initialData.supplement_name || "");
      setShortDescription(initialData.description || "");
      setDetails({
        image: initialData.image || null,
        worksWith: parseList(initialData.work_with),
        avoidWith: parseList(initialData.avoid_with),
        primaryBenefits: cleanNA(initialData.primary_benefits),
        childrenDosage: cleanNA(initialData.children_dosage),
        adultDosage: cleanNA(initialData.adult_dosage),
        sideEffects: cleanNA(initialData.side_effects),
        signsOfDeficiency: cleanNA(initialData.signs_of_deficiency),
      });
    } else {
      setSupplementName("");
      setShortDescription("");
      setDetails({
        image: null,
        worksWith: [],
        avoidWith: [],
        primaryBenefits: "",
        childrenDosage: "",
        adultDosage: "",
        sideEffects: "",
        signsOfDeficiency: "",
      });
    }
  }, [mode, initialData]);

  const handleNext = async () => {
    if (modalTab === "basic") {
      if (!supplementName.trim()) {
        toast.error("Please enter supplement name", { position: 'top-right' });
        return;
      }
      setModalTab("details");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("supplement_name", supplementName);
      formData.append("description", shortDescription);
      formData.append("work_with", JSON.stringify(details.worksWith));
      formData.append("avoid_with", JSON.stringify(details.avoidWith));
      formData.append("primary_benefits", details.primaryBenefits || "N/A");
      formData.append("children_dosage", details.childrenDosage || "N/A");
      formData.append("adult_dosage", details.adultDosage || "N/A");
      formData.append("side_effects", details.sideEffects || "N/A");
      formData.append("signs_of_deficiency", details.signsOfDeficiency || "N/A");

      // Image: নতুন file হলে upload, না হলে skip
      if (details.image && !details.image.startsWith("http")) {
        const res = await fetch(details.image);
        const blob = await res.blob();
        formData.append("image", blob, "supplement_image.png");
      }

      if (mode === "add") {
        await addSupplement(formData).unwrap();
        toast.success("Supplement added successfully", { position: 'top-right' });
      } else if (mode === "edit" && initialData?.id) {
        await updateSupplement({ id: initialData.id, data: formData }).unwrap();
        toast.success("Supplement updated successfully", { position: 'top-right' });
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error saving supplement:", err);
      if (err?.data) {
        const messages = Object.values(err.data).flat().join(", ");
        toast.error(messages, { position: 'top-right' });
      } else {
        toast.error("Supplement save failed", { position: 'top-right' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-xl font-medium">{mode === "add" ? "Add New Supplement" : "Edit Supplement"}</h2>
            <p className="text-gray-500">{mode === "add" ? "Create supplement" : "Update supplement"}</p>
          </div>
          <button onClick={onClose} className="cursor-pointer"><X /></button>
        </div>

        {/* Tabs */}
        <div className="bg-blue-100 rounded-full p-2 flex gap-2">
          <button
            onClick={() => setModalTab("basic")}
            className={`flex-1 py-2 rounded-full cursor-pointer ${modalTab === "basic" ? "bg-violet-200" : ""}`}
          >
            <User className="inline w-4 h-4 mr-1" /> Basic
          </button>
          <button
            onClick={() => setModalTab("details")}
            className={`flex-1 py-2 rounded-full cursor-pointer ${modalTab === "details" ? "bg-violet-200" : ""}`}
          >
            <FileCheck className="inline w-4 h-4 mr-1" /> Details
          </button>
        </div>

        {/* Content */}
        <div className="mt-6">
          {modalTab === "basic" ? (
            <div className="space-y-4">
              <input
                value={supplementName}
                onChange={(e) => setSupplementName(e.target.value)}
                placeholder="Supplement name"
                className="w-full p-3 bg-blue-50 rounded-xl"
              />
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Short description"
                rows={4}
                className="w-full p-3 bg-blue-50 rounded-xl"
              />
            </div>
          ) : (
            <SuplimentsDetailsTab value={details} onChange={setDetails} />
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleNext}
            disabled={loading}
            className={`bg-violet-500 text-white px-6 py-3 rounded-xl cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Please wait..." : modalTab === "basic" ? "Next" : mode === "add" ? "Publish" : "Update"}
          </button>
          <button onClick={onClose} className="border px-6 py-3 rounded-xl cursor-pointer">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddNewModal;







// import { FileCheck, User, X } from "lucide-react";
// import { useState } from "react";
// import SuplimentsDetailsTab from "./SuplimentsDetailsTab";

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

// const AddNewModal: React.FC<Props> = ({
//   onClose,
//   mode,
//   initialData,
// }) => {
//   const [modalTab, setModalTab] = useState<ModalTab>("basic");

//   // ✅ BASIC INFO
//   const [supplementName, setSupplementName] = useState(
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
//       name: supplementName,
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
//               {mode === "add" ? "Add New Supplement" : "Edit Supplement"}
//             </h2>
//             <p className="text-gray-500">
//               {mode === "add"
//                 ? "Create supplement"
//                 : "Update supplement"}
//             </p>
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
//               <input
//                 value={supplementName}
//                 onChange={(e) => setSupplementName(e.target.value)}
//                 placeholder="Supplement name"
//                 className="w-full p-3 bg-blue-50 rounded-xl"
//               />

//               <textarea
//                 value={shortDescription}
//                 onChange={(e) => setShortDescription(e.target.value)}
//                 placeholder="Short description"
//                 rows={4}
//                 className="w-full p-3 bg-blue-50 rounded-xl"
//               />
//             </div>
//           ) : (
//             <SuplimentsDetailsTab
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
//               ? "Publish"
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

// export default AddNewModal;







// import { FileCheck, User, X } from "lucide-react";
// import {  useState } from "react";
// import SuplimentsDetailsTab from "./SuplimentsDetailsTab";

// type ModalTab = "basic" | "details";

// type Props = {
//   onClose: () => void;
//   mode: "add" | "edit";
//   initialData?: {
//     id: number;
//     name: string;
//     description: string;
//   } | null;
// };

// export interface SupplementDetails {
//   image: string | null;
//   worksWith: string[];
//   avoidWith: string[];
//   primaryBenefits: string;
//   childrenDosage: string;
//   adultDosage: string;
//   sideEffects: string;
// }


// const AddNewModal: React.FC<Props> = ({
//   onClose,
//   mode,
//   initialData,
// }) => {
//   const [modalTab, setModalTab] = useState<ModalTab>("basic");


//   const [supplementName, setSupplementName] = useState(
//     () => (mode === "edit" && initialData ? initialData.name : "")
//   );

//   const [shortDescription, setShortDescription] = useState(
//     () => (mode === "edit" && initialData ? initialData.description : "")
//   );



//   const [details, setDetails] = useState<SupplementDetails>(() => {
//   if (mode === "edit" && initialData) {
//     return {
//       image: initialData.image ?? null,
//       worksWith: initialData.worksWith ?? [],
//       avoidWith: initialData.avoidWith ?? [],
//       primaryBenefits: initialData.primaryBenefits ?? "",
//       childrenDosage: initialData.childrenDosage ?? "",
//       adultDosage: initialData.adultDosage ?? "",
//       sideEffects: initialData.sideEffects ?? "",
//     };
//   }

//   return {
//     image: null,
//     worksWith: [],
//     avoidWith: [],
//     primaryBenefits: "",
//     childrenDosage: "",
//     adultDosage: "",
//     sideEffects: "",
//   };
// });


//   const handleNext = () => {
//     if (modalTab === "basic") {
//       setModalTab("details");
//     } else {
//       if (mode === "add") {
//         console.log("ADD", {
//           supplementName,
//           shortDescription,
//         });
//       } else {
//         console.log("EDIT", {
//           id: initialData?.id,
//           supplementName,
//           shortDescription,
//         });
//       }
//       onClose();
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white p-2.5 md:p-6 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

//         {/* Header */}
//         <div className="mb-4">
//           <div className="flex items-start justify-between">
//             <div>
//               <h2 className="text-xl md:text-2xl font-medium text-textColor mb-2.5">
//                 {mode === "add" ? "Add New Supplement" : "Edit Supplement"}
//               </h2>
//               <p className="text-[#717182] text-base">
//                 {mode === "add"
//                   ? "Create and manage supplement entries"
//                   : "Update supplement information"}
//               </p>
//             </div>

//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-gray-100 rounded-lg"
//             >
//               <X className="w-5 h-5 text-gray-500" />
//             </button>
//           </div>
//         </div>

//         {/* Tabs (UNCHANGED ✅) */}
//         <div className="bg-[#E8EFFC] py-3 px-5 rounded-full">
//           <div className="flex gap-3">
//             <button
//               onClick={() => setModalTab("basic")}
//               className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium ${
//                 modalTab === "basic"
//                   ? "bg-violet-200"
//                   : "hover:bg-violet-100"
//               }`}
//             >
//               <User className="w-4 h-4" />
//               Basic Information
//             </button>

//             <button
//               onClick={() => setModalTab("details")}
//               className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium ${
//                 modalTab === "details"
//                   ? "bg-violet-200"
//                   : "hover:bg-violet-100"
//               }`}
//             >
//               <FileCheck className="w-4 h-4" />
//               Details
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="mt-4 mb-11">
//           {modalTab === "basic" ? (
//             <div className="space-y-6">
//               <div>
//                 <label className="block mb-3">Supplement Name</label>
//                 <input
//                   value={supplementName}
//                   onChange={(e) => setSupplementName(e.target.value)}
//                   className="w-full px-4 py-3 bg-blue-50 rounded-xl"
//                 />
//               </div>

//               <div>
//                 <label className="block mb-3">Short Description</label>
//                 <textarea
//                   rows={5}
//                   value={shortDescription}
//                   onChange={(e) => setShortDescription(e.target.value)}
//                   className="w-full px-4 py-3 bg-blue-50 rounded-xl resize-none"
//                 />
//               </div>
//             </div>
//           ) : (
//             <SuplimentsDetailsTab />
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex gap-3">
//           <button
//             onClick={handleNext}
//             className="bg-violet-400 hover:bg-violet-500 text-white px-6 py-3 rounded-xl"
//           >
//             {modalTab === "basic"
//               ? "Next"
//               : mode === "add"
//               ? "Publish Supplement"
//               : "Update Supplement"}
//           </button>

//           <button
//             onClick={onClose}
//             className="border px-6 py-3 rounded-xl"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddNewModal;
