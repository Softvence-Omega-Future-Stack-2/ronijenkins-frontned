import React, { useEffect, useState } from 'react';
import type { Plan } from './ManagePlan';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPlan?: Plan | null;
  onSave: (data: Omit<Plan, "id">) => void;
}

const AddPlanModal: React.FC<ModalProps> = ({ isOpen, onClose, editingPlan, onSave }) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [annualPrice, setAnnualPrice] = useState("");
  const [features, setFeatures] = useState("");

  useEffect(() => {
    if (editingPlan) {
      setTitle(editingPlan.title);
      setPrice(editingPlan.price.replace("$", ""));
      setAnnualPrice(editingPlan.annualPrice.replace("$", ""));
      setFeatures(editingPlan.features.join("\n"));
    } else {
      setTitle("");
      setPrice("");
      setAnnualPrice("");
      setFeatures("");
    }
  }, [editingPlan]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-black text-titleColor leading-5 md:leading-8 tracking-tight">
            {editingPlan ? "Edit Plan" : "Add New Plan"}
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors p-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <div className="px-8 py-2 space-y-6">
          
          {/* Plan Name */}
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-[1.5px] text-[#4A3A3799] block">
              Plan Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Core or Complete"
              className="w-full px-5 py-4 rounded-[12px] border border-borderColor bg-white text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#845E84]/20 focus:border-[#845E84] transition-all placeholder:text-stone-300"
            />
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-[1.5px] text-[#4A3A3799] block">
                Monthly Price
              </label>
              <div className="flex items-center w-full rounded-2xl border border-stone-100 bg-white focus-within:ring-2 focus-within:ring-[#845E84]/20 focus-within:border-[#845E84] transition-all overflow-hidden">
                <span className="pl-5 pr-2 text-stone-400 font-bold text-base select-none">$</span>
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  className="flex-1 py-4 pr-5 bg-transparent text-stone-800 font-bold focus:outline-none placeholder:text-stone-300"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-[1.5px] text-[#4A3A3799] block">
                Annual Price
              </label>
              <div className="flex items-center w-full rounded-2xl border border-stone-100 bg-white focus-within:ring-2 focus-within:ring-[#845E84]/20 focus-within:border-[#845E84] transition-all overflow-hidden">
                <span className="pl-5 pr-2 text-stone-400 font-bold text-base select-none">$</span>
                <input
                  type="number"
                  min="0"
                  value={annualPrice}
                  onChange={(e) => setAnnualPrice(e.target.value)}
                  placeholder="0"
                  className="flex-1 py-4 pr-5 bg-transparent text-stone-800 font-bold focus:outline-none placeholder:text-stone-300"
                />
              </div>
            </div>
          </div>

          {/* Features Area */}
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-[1.5px] text-[#4A3A3799] block">
              Features (one per line)
            </label>
            <textarea
              rows={6}
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-stone-100 bg-white text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#845E84]/20 focus:border-[#845E84] transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-8 py-4 rounded-2xl border border-borderColor text-sm font-black tracking-[0.5px] uppercase hover:bg-stone-50 transition-colors order-2 sm:order-1 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const newPlan = {
                title,
                subtitle: "",
                price: `$${price}`,
                annualPrice: `$${annualPrice}`,
                features: features.split("\n").filter(f => f.trim() !== "")
              };
              onSave(newPlan);
            }}
            className="flex-1 px-8 py-4 rounded-2xl bg-[#845E84] text-white text-sm font-black tracking-[0.5px] hover:bg-[#6d4d6d] shadow-lg shadow-[#845E84]/20 transition-all order-1 sm:order-2 cursor-pointer"
          >
            {editingPlan ? "Update Plan" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPlanModal;