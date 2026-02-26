import { useEffect, useState } from "react";

interface InspirationItem {
  id: number;
  inspiration: string;
}

interface AddEditInspirationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (description: string) => Promise<void>;
  editItem?: InspirationItem | null;
  isSaving?: boolean;
}

export default function AddEditInspirationModal({
  isOpen,
  onClose,
  onSave,
  editItem,
  isSaving = false,
}: AddEditInspirationModalProps) {
  const [description, setDescription] = useState("");

  const isEdit = !!editItem;

  useEffect(() => {
    if (isOpen) {
      // ✅ Always reset safely, guard against undefined
      setDescription(editItem?.inspiration ?? "");
    }
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const trimmed = description?.trim();
    if (!trimmed) return;
    await onSave(trimmed);
    onClose();
  };

  const isDisabled = !description?.trim() || isSaving;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSaving}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          {isEdit ? "Edit Inspiration" : "Add New Inspiration"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {isEdit
            ? "Update the inspiration details below."
            : "You are ready to add a new inspiration for your users."}
        </p>

        {/* Inspiration Field */}
        <div className="mb-7">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Inspiration
          </label>
          <textarea
            placeholder="Short explanation shown to users"
            value={description ?? ""} // ✅ fallback to empty string
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            disabled={isSaving}
            className="w-full bg-slate-100 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition resize-none disabled:opacity-60"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isDisabled}
            className="flex items-center gap-2 bg-indigo-400 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}