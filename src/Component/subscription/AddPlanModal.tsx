import React, { useEffect, useState, useRef } from "react";
import type { Plan } from "./ManagePlan";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPlan?: Plan | null;
  onSave: (data: Omit<Plan, "id">) => void;
}

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const AddPlanModal: React.FC<ModalProps> = ({ isOpen, onClose, editingPlan, onSave }) => {
  // ✅ সব hooks আগে — if (!isOpen) return null এর আগে
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [plan, setPlan] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [stripePriceId, setStripePriceId] = useState("");
  const [trialPeriod, setTrialPeriod] = useState(false);
  const [features, setFeatures] = useState("");
  const [planOpen, setPlanOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (planRef.current && !planRef.current.contains(e.target as Node)) setPlanOpen(false);
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (editingPlan) {
      setName(editingPlan.name || "");
      setDescription(editingPlan.description || "");
      setPlan(editingPlan.plan?.toUpperCase() === "YEARLY" ? "YEARLY" : "MONTHLY");
      setPrice(editingPlan.price?.toString() || "");
      setStatus(editingPlan.status || "ACTIVE");
      setStripePriceId(editingPlan.stripePriceId || "");
      setTrialPeriod(editingPlan.trialPeriod || false);
      setFeatures(editingPlan.features?.join("\n") || "");
    } else {
      setName(""); setDescription(""); setPlan("MONTHLY");
      setPrice(""); setStatus("ACTIVE");
      setStripePriceId(""); setTrialPeriod(false); setFeatures("");
    }
  }, [editingPlan]);

  // ✅ early return hooks এর পরে
  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim() || !price) return;
    onSave({
      name,
      description,
      plan,
      price: Number(price),
      status,
      stripePriceId,
      trialPeriod,
      features: features.split("\n").filter((f) => f.trim() !== ""),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-black text-titleColor leading-5 md:leading-8 tracking-tight">
            {editingPlan ? "Edit Plan" : "Add New Plan"}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <div className="px-8 py-2 space-y-5 max-h-[65vh] overflow-y-auto">

          {/* Plan Name */}
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-[1.5px] text-[#4A3A3799] block">Plan Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Monthly Wellness"
              className="w-full px-5 py-4 rounded-[12px] border border-borderColor bg-white text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#845E84]/20 focus:border-[#845E84] transition-all placeholder:text-stone-300" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-[1.5px] text-[#4A3A3799] block">Description</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Full monthly access to wellness content and tracking tools."
              className="w-full px-5 py-4 rounded-2xl border border-stone-100 bg-white text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#845E84]/20 focus:border-[#845E84] transition-all resize-none placeholder:text-stone-300" />
          </div>

          {/* Plan Type & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Plan Type Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-[1.5px] text-[#4A3A3799] block">Plan Type</label>
              <div ref={planRef} className="relative">
                <button onClick={() => { setPlanOpen(!planOpen); setStatusOpen(false); }}
                  className="w-full px-5 py-4 rounded-[12px] border border-borderColor bg-white text-stone-800 font-medium focus:outline-none flex justify-between items-center cursor-pointer">
                  <span>{plan}</span>
                  <span className={`transition-transform ${planOpen ? "rotate-180" : ""}`}><ChevronDown /></span>
                </button>
                {planOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-borderColor rounded-xl shadow-md overflow-hidden">
                    {(["MONTHLY", "YEARLY"] as const).map((p) => (
                      <div key={p} onClick={() => { setPlan(p); setPlanOpen(false); }}
                        className={`px-5 py-3 cursor-pointer text-sm font-medium hover:bg-[#FAF7F5] transition-colors ${plan === p ? "text-[#845E84] font-bold" : "text-stone-700"}`}>
                        {p}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-[1.5px] text-[#4A3A3799] block">Status</label>
              <div ref={statusRef} className="relative">
                <button onClick={() => { setStatusOpen(!statusOpen); setPlanOpen(false); }}
                  className="w-full px-5 py-4 rounded-[12px] border border-borderColor bg-white font-medium focus:outline-none flex justify-between items-center cursor-pointer">
                  <span className={status === "ACTIVE" ? "text-green-500 font-bold" : "text-red-400 font-bold"}>{status}</span>
                  <span className={`transition-transform ${statusOpen ? "rotate-180" : ""}`}><ChevronDown /></span>
                </button>
                {statusOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-borderColor rounded-xl shadow-md overflow-hidden">
                    {(["ACTIVE", "INACTIVE"] as const).map((s) => (
                      <div key={s} onClick={() => { setStatus(s); setStatusOpen(false); }}
                        className={`px-5 py-3 cursor-pointer text-sm font-bold hover:bg-[#FAF7F5] transition-colors ${s === "ACTIVE" ? "text-green-500" : "text-red-400"}`}>
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-[1.5px] text-[#4A3A3799] block">Price</label>
            <div className="flex items-center w-full rounded-2xl border border-stone-100 bg-white focus-within:ring-2 focus-within:ring-[#845E84]/20 focus-within:border-[#845E84] transition-all overflow-hidden">
              <span className="pl-5 pr-2 text-stone-400 font-bold text-base select-none">$</span>
              <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="flex-1 py-4 pr-5 bg-transparent text-stone-800 font-bold focus:outline-none placeholder:text-stone-300" />
            </div>
          </div>

          {/* Stripe Price ID */}
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-[1.5px] text-[#4A3A3799] block">Stripe Price ID</label>
            <input type="text" value={stripePriceId} onChange={(e) => setStripePriceId(e.target.value)}
              placeholder="price_1T9HVLDhyWl1vHdfaq56rJ7F"
              className="w-full px-5 py-4 rounded-[12px] border border-borderColor bg-white text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#845E84]/20 focus:border-[#845E84] transition-all placeholder:text-stone-300" />
          </div>

          {/* Trial Period */}
          <div className="flex items-center justify-between px-5 py-4 rounded-2xl border border-borderColor bg-white">
            <span className="text-sm font-black uppercase tracking-[1.5px] text-[#4A3A3799]">Trial Period</span>
            <button onClick={() => setTrialPeriod(!trialPeriod)}
              className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${trialPeriod ? "bg-[#845E84]" : "bg-gray-300"}`}>
              <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${trialPeriod ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-[1.5px] text-[#4A3A3799] block">Features (one per line)</label>
            <textarea rows={5} value={features} onChange={(e) => setFeatures(e.target.value)}
              placeholder={"Unlimited articles\nVideo content access\nSymptom tracker"}
              className="w-full px-5 py-4 rounded-2xl border border-stone-100 bg-white text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#845E84]/20 focus:border-[#845E84] transition-all resize-none placeholder:text-stone-300" />
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 flex flex-col sm:flex-row gap-4">
          <button onClick={onClose} className="flex-1 px-8 py-4 rounded-2xl border border-borderColor text-sm font-black tracking-[0.5px] uppercase hover:bg-stone-50 transition-colors order-2 sm:order-1 cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 px-8 py-4 rounded-2xl bg-[#845E84] text-white text-sm font-black tracking-[0.5px] hover:bg-[#6d4d6d] shadow-lg shadow-[#845E84]/20 transition-all order-1 sm:order-2 cursor-pointer">
            {editingPlan ? "Update Plan" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPlanModal;


// import React, { useEffect, useState } from 'react';
// import type { Plan } from './ManagePlan';

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   editingPlan?: Plan | null;
//   onSave: (data: Omit<Plan, "id">) => void;
// }

// const AddPlanModal: React.FC<ModalProps> = ({ isOpen, onClose, editingPlan, onSave }) => {
//   if (!isOpen) return null;

//   const [title, setTitle] = useState("");
//   const [price, setPrice] = useState("");
//   const [annualPrice, setAnnualPrice] = useState("");
//   const [features, setFeatures] = useState("");

//   useEffect(() => {
//     if (editingPlan) {
//       setTitle(editingPlan.title);
//       setPrice(editingPlan.price.replace("$", ""));
//       setAnnualPrice(editingPlan.annualPrice.replace("$", ""));
//       setFeatures(editingPlan.features.join("\n"));
//     } else {
//       setTitle("");
//       setPrice("");
//       setAnnualPrice("");
//       setFeatures("");
//     }
//   }, [editingPlan]);

//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 sm:p-6">
//       {/* Backdrop */}
//       <div className="absolute inset-0" onClick={onClose} />

//       {/* Modal Container */}
//       <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
//         {/* Header */}
//         <div className="px-8 pt-8 pb-4 flex justify-between items-center">
//           <h2 className="text-xl md:text-2xl font-black text-titleColor leading-5 md:leading-8 tracking-tight">
//             {editingPlan ? "Edit Plan" : "Add New Plan"}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-stone-400 hover:text-stone-600 transition-colors p-2"
//           >
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//               <line x1="18" y1="6" x2="6" y2="18"></line>
//               <line x1="6" y1="6" x2="18" y2="18"></line>
//             </svg>
//           </button>
//         </div>

//         {/* Form Body */}
//         <div className="px-8 py-2 space-y-6">
          
//           {/* Plan Name */}
//           <div className="space-y-2">
//             <label className="text-sm font-black uppercase tracking-[1.5px] text-[#4A3A3799] block">
//               Plan Name
//             </label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="e.g. Core or Complete"
//               className="w-full px-5 py-4 rounded-[12px] border border-borderColor bg-white text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#845E84]/20 focus:border-[#845E84] transition-all placeholder:text-stone-300"
//             />
//           </div>

//           {/* Pricing Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="text-sm font-black uppercase tracking-[1.5px] text-[#4A3A3799] block">
//                 Monthly Price
//               </label>
//               <div className="flex items-center w-full rounded-2xl border border-stone-100 bg-white focus-within:ring-2 focus-within:ring-[#845E84]/20 focus-within:border-[#845E84] transition-all overflow-hidden">
//                 <span className="pl-5 pr-2 text-stone-400 font-bold text-base select-none">$</span>
//                 <input
//                   type="number"
//                   min="0"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value)}
//                   placeholder="0"
//                   className="flex-1 py-4 pr-5 bg-transparent text-stone-800 font-bold focus:outline-none placeholder:text-stone-300"
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-black uppercase tracking-[1.5px] text-[#4A3A3799] block">
//                 Annual Price
//               </label>
//               <div className="flex items-center w-full rounded-2xl border border-stone-100 bg-white focus-within:ring-2 focus-within:ring-[#845E84]/20 focus-within:border-[#845E84] transition-all overflow-hidden">
//                 <span className="pl-5 pr-2 text-stone-400 font-bold text-base select-none">$</span>
//                 <input
//                   type="number"
//                   min="0"
//                   value={annualPrice}
//                   onChange={(e) => setAnnualPrice(e.target.value)}
//                   placeholder="0"
//                   className="flex-1 py-4 pr-5 bg-transparent text-stone-800 font-bold focus:outline-none placeholder:text-stone-300"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Features Area */}
//           <div className="space-y-2">
//             <label className="text-sm font-black uppercase tracking-[1.5px] text-[#4A3A3799] block">
//               Features (one per line)
//             </label>
//             <textarea
//               rows={6}
//               value={features}
//               onChange={(e) => setFeatures(e.target.value)}
//               className="w-full px-5 py-4 rounded-2xl border border-stone-100 bg-white text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#845E84]/20 focus:border-[#845E84] transition-all resize-none"
//             />
//           </div>
//         </div>

//         {/* Footer Actions */}
//         <div className="p-8 flex flex-col sm:flex-row gap-4">
//           <button
//             onClick={onClose}
//             className="flex-1 px-8 py-4 rounded-2xl border border-borderColor text-sm font-black tracking-[0.5px] uppercase hover:bg-stone-50 transition-colors order-2 sm:order-1 cursor-pointer"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => {
//               const newPlan = {
//                 title,
//                 subtitle: "",
//                 price: `$${price}`,
//                 annualPrice: `$${annualPrice}`,
//                 features: features.split("\n").filter(f => f.trim() !== "")
//               };
//               onSave(newPlan);
//             }}
//             className="flex-1 px-8 py-4 rounded-2xl bg-[#845E84] text-white text-sm font-black tracking-[0.5px] hover:bg-[#6d4d6d] shadow-lg shadow-[#845E84]/20 transition-all order-1 sm:order-2 cursor-pointer"
//           >
//             {editingPlan ? "Update Plan" : "Save Changes"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddPlanModal;