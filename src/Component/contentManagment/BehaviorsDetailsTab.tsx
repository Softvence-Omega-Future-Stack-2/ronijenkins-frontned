/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import { X, Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Link, Code, ChevronDown, Plus, Paperclip } from "lucide-react";
import { type BehaviorDetails } from "./AddBehaviorsModal";

const InputField = ({ placeholder, onAdd }: { placeholder: string; onAdd: (val: string) => void }) => {
  const [val, setVal] = useState('');
  const handleAdd = () => { if (val.trim()) { onAdd(val.trim()); setVal(''); } };
  return (
    <input
      type="text"
      value={val}
      placeholder={placeholder}
      onChange={(e) => setVal(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
      onBlur={handleAdd}
      className="w-full bg-[#EBF2FF] border-none rounded-lg px-4 py-3 text-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-blue-300 outline-none"
    />
  );
};

const Tag = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-md text-sm text-gray-700">
    {label}
    <button onClick={onRemove} className="text-red-400 hover:text-red-600"><X size={14} /></button>
  </span>
);

const MarkdownEditor = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  const insert = (pre: string, suf: string = pre) => {
    const el = ref.current; if (!el) return;
    const s = el.selectionStart, e = el.selectionEnd;
    onChange(value.substring(0, s) + pre + value.substring(s, e) + suf + value.substring(e));
    setTimeout(() => { el.focus(); el.setSelectionRange(s + pre.length, e + pre.length); }, 0);
  };
  const insertBlock = (pre: string) => {
    const el = ref.current; if (!el) return;
    const s = el.selectionStart;
    const lineStart = value.lastIndexOf('\n', s - 1) + 1;
    onChange(value.substring(0, lineStart) + pre + value.substring(lineStart));
    setTimeout(() => { el.focus(); el.setSelectionRange(s + pre.length, s + pre.length); }, 0);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 bg-[#F9FAFB]">
        <button type="button" onClick={() => insert('**')} className="p-1.5 hover:bg-gray-100 rounded"><Bold size={16} className="text-gray-500" /></button>
        <button type="button" onClick={() => insert('*')} className="p-1.5 hover:bg-gray-100 rounded"><Italic size={16} className="text-gray-500" /></button>
        <button type="button" onClick={() => insert('__')} className="p-1.5 hover:bg-gray-100 rounded"><Underline size={16} className="text-gray-500" /></button>
        <div className="w-[1px] h-4 bg-gray-300 mx-1" />
        <button type="button" onClick={() => insertBlock('### ')} className="p-1.5 hover:bg-gray-100 rounded font-bold text-gray-500 text-xs">H1</button>
        <button type="button" onClick={() => insertBlock('#### ')} className="p-1.5 hover:bg-gray-100 rounded font-bold text-gray-500 text-xs">H2</button>
        <div className="w-[1px] h-4 bg-gray-300 mx-1" />
        <button type="button" onClick={() => insertBlock('- ')} className="p-1.5 hover:bg-gray-100 rounded"><List size={16} className="text-gray-500" /></button>
        <div className="w-[1px] h-4 bg-gray-300 mx-1" />
        <button type="button" className="p-1.5 hover:bg-gray-100 rounded"><AlignLeft size={16} className="text-gray-500" /></button>
        <button type="button" className="p-1.5 hover:bg-gray-100 rounded"><AlignCenter size={16} className="text-gray-500" /></button>
        <button type="button" className="p-1.5 hover:bg-gray-100 rounded"><AlignRight size={16} className="text-gray-500" /></button>
        <div className="w-[1px] h-4 bg-gray-300 mx-1" />
        <button type="button" onClick={() => insert('[', '](url)')} className="p-1.5 hover:bg-gray-100 rounded"><Link size={16} className="text-gray-500" /></button>
        <button type="button" className="p-1.5 hover:bg-gray-100 rounded"><Code size={16} className="text-gray-500" /></button>
        <div className="ml-auto flex items-center bg-gray-100 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className={`px-3 py-1 text-xs rounded-md transition-all ${!showPreview ? 'bg-white shadow text-gray-800 font-medium' : 'text-gray-500'}`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className={`px-3 py-1 text-xs rounded-md transition-all ${showPreview ? 'bg-white shadow text-gray-800 font-medium' : 'text-gray-500'}`}
          >
            Preview
          </button>
        </div>
      </div>
      {!showPreview ? (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 min-h-[120px] bg-[#EBF2FF]/30 outline-none text-sm placeholder-gray-400 resize-y"
        />
      ) : (
        <div className="w-full p-4 min-h-[120px] bg-[#EBF2FF]/30 text-sm prose prose-sm max-w-none">
          {value ? <ReactMarkdown>{value}</ReactMarkdown> : <p className="text-gray-400">Nothing to preview</p>}
        </div>
      )}
    </div>
  );
};

type Supplement = { name: string; file: File | null; previewUrl?: string };

interface Props {
  value: BehaviorDetails;
  onChange: (details: BehaviorDetails) => void;
}

const protocols = [
  { id: 1, name: "Biomedical Protocol" },
  { id: 2, name: "Gut Healing Protocol" },
  { id: 3, name: "Immune Support Protocol" },
  { id: 4, name: "Yeast Overgrowth Protocol" },
  { id: 5, name: "Detoxification Protocol" },
];

const BehaviorDetailsTab: React.FC<Props> = ({ value, onChange }) => {
  const [rootCauses, setRootCauses] = useState<string[]>([]);
  const [showProtocolList, setShowProtocolList] = useState(false);
  const [selectedProtocols, setSelectedProtocols] = useState<number[]>([]);
  const [dietAdd, setDietAdd] = useState<string[]>([]);
  const [dietRemove, setDietRemove] = useState<string[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([{ name: "", file: null }]);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    setRootCauses(
      value.possible_root_causes
        ? value.possible_root_causes.split(',').map(s => s.trim()).filter(Boolean)
        : []
    );
    setSelectedProtocols(value.suggested_protocol_ids || []);
    setDietAdd(
      value.recommended_foods
        ? value.recommended_foods.split(',').map(s => s.trim()).filter(Boolean)
        : []
    );
    setDietRemove(
      value.foods_to_avoid
        ? value.foods_to_avoid.split(',').map(s => s.trim()).filter(Boolean)
        : []
    );
    if (value.supplements_name && value.supplements_name.length > 0) {
      setSupplements(
        value.supplements_name.map((name, i) => ({
          name,
          file: value.supplements_images?.[i] || null,
          previewUrl: undefined,
        }))
      );
    } else {
      setSupplements([{ name: "", file: null }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const syncSupplements = (list: Supplement[]) => {
    onChange({
      ...value,
      supplements_name: list.map(s => s.name),
      supplements_images: list.map(s => s.file).filter((f): f is File => f instanceof File),
    });
  };

  const updateSupplementName = (idx: number, name: string) => {
    const updated = supplements.map((s, i) => i === idx ? { ...s, name } : s);
    setSupplements(updated);
    syncSupplements(updated);
  };

  const updateSupplementFile = (idx: number, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    const updated = supplements.map((s, i) => i === idx ? { ...s, file, previewUrl } : s);
    setSupplements(updated);
    syncSupplements(updated);
  };

  const addSupplement = () => {
    const updated = [...supplements, { name: "", file: null }];
    setSupplements(updated);
    syncSupplements(updated);
  };

  const removeSupplement = (idx: number) => {
    if (supplements.length === 1) return;
    const updated = supplements.filter((_, i) => i !== idx);
    setSupplements(updated);
    syncSupplements(updated);
  };

  const updateRootCauses = (causes: string[]) => {
    setRootCauses(causes);
    onChange({ ...value, possible_root_causes: causes.join(', ') });
  };

  const toggleProtocol = (id: number) => {
    const updated = selectedProtocols.includes(id)
      ? selectedProtocols.filter(p => p !== id)
      : [...selectedProtocols, id];
    setSelectedProtocols(updated);
    onChange({ ...value, suggested_protocol_ids: updated });
  };

  const updateDietAdd = (foods: string[]) => {
    setDietAdd(foods);
    onChange({ ...value, recommended_foods: foods.join(',') });
  };

  const updateDietRemove = (foods: string[]) => {
    setDietRemove(foods);
    onChange({ ...value, foods_to_avoid: foods.join(',') });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex-1 space-y-8">

        {/* Root Causes */}
        <section>
          <label className="block text-sm font-semibold mb-3">
            Possible Root Causes <span className="text-red-500">*</span>
          </label>
          <InputField
            placeholder="Enter possible root causes (Press Enter or click elsewhere to add)"
            onAdd={(val) => updateRootCauses([...rootCauses, val])}
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {rootCauses.map((c, idx) => (
              <Tag key={idx} label={c} onRemove={() => updateRootCauses(rootCauses.filter((_, i) => i !== idx))} />
            ))}
          </div>
        </section>

        {/* Suggested Protocols */}
        <section>
          <label className="block text-sm font-semibold mb-2">Suggested Protocols</label>
          <div
            onClick={() => setShowProtocolList(!showProtocolList)}
            className="w-full bg-[#EBF2FF] rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer"
          >
            <span className={`text-sm ${selectedProtocols.length ? "text-gray-800" : "text-gray-500"}`}>
              {selectedProtocols.length
                ? protocols.filter(p => selectedProtocols.includes(p.id)).map(p => p.name).join(", ")
                : "Select protocols"}
            </span>
            <ChevronDown size={20} className={`text-gray-400 transition-transform ${showProtocolList ? "rotate-180" : ""}`} />
          </div>
          {showProtocolList && (
            <div className="mt-2 bg-white p-4 rounded-xl shadow-lg border border-gray-100 max-h-48 overflow-y-auto">
              {protocols.map(item => (
                <div key={item.id} className="flex items-center gap-3 cursor-pointer mb-2" onClick={() => toggleProtocol(item.id)}>
                  <div className={`w-5 h-5 border-2 border-blue-400 rounded flex items-center justify-center ${selectedProtocols.includes(item.id) ? "bg-blue-400" : "bg-white"}`}>
                    {selectedProtocols.includes(item.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
              <button onClick={() => setShowProtocolList(false)} className="w-full mt-4 bg-[#A78BFA] text-white py-2 rounded-lg hover:bg-[#8B5CF6]">
                Done
              </button>
            </div>
          )}
        </section>

        {/* Recommended Labs */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-semibold">Recommended Labs</label>
            <span className="flex items-center gap-1 text-xs text-gray-400"><Code size={14} /> Markdown</span>
          </div>
          <MarkdownEditor
            value={value.recommended_labs}
            onChange={(v) => onChange({ ...value, recommended_labs: v })}
            placeholder="Describe recommended lab tests (**bold**, *italic*, - list)"
          />
        </section>

        {/* Supplements */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-semibold">Supplements to Consider</label>
            <button onClick={addSupplement} className="p-1 bg-[#8B5CF6] text-white rounded-md hover:bg-[#7C3AED]">
              <Plus size={20} />
            </button>
          </div>
          <div className="space-y-3">
            {supplements.map((sup, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Supplement name"
                    className="bg-[#EBF2FF] rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                    value={sup.name}
                    onChange={(e) => updateSupplementName(idx, e.target.value)}
                  />
                  <label className="bg-[#EBF2FF] rounded-lg px-4 py-3 flex items-center gap-2 text-gray-500 text-sm cursor-pointer hover:bg-blue-100 transition-colors">
                    <Paperclip size={16} />
                    <span className="flex-1 truncate">{sup.file ? sup.file.name : "Upload supplement photo"}</span>
                    {sup.previewUrl && (
                      <img src={sup.previewUrl} alt="preview" className="w-8 h-8 rounded object-cover shrink-0" />
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) updateSupplementFile(idx, file);
                      }}
                    />
                  </label>
                </div>
                {supplements.length > 1 && (
                  <button
                    onClick={() => removeSupplement(idx)}
                    className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 w-fit"
                  >
                    <X size={14} /> Remove supplement
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Dietary Recommendations */}
        <section>
          <label className="block text-sm font-semibold mb-3">Dietary Recommendations</label>
          <div className="border border-[#EBF2FF] rounded-xl p-4 md:p-6 space-y-6">
            <div>
              <label className="block text-xs font-medium mb-2 text-gray-600">Add Foods</label>
              <InputField placeholder="Add recommended foods" onAdd={(val) => updateDietAdd([...dietAdd, val])} />
              <div className="flex flex-wrap gap-2 mt-3">
                {dietAdd.map((f, idx) => (
                  <Tag key={idx} label={f} onRemove={() => updateDietAdd(dietAdd.filter((_, i) => i !== idx))} />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 text-gray-600">Foods to Avoid</label>
              <InputField placeholder="Add foods to avoid" onAdd={(val) => updateDietRemove([...dietRemove, val])} />
              <div className="flex flex-wrap gap-2 mt-3">
                {dietRemove.map((f, idx) => (
                  <Tag key={idx} label={f} onRemove={() => updateDietRemove(dietRemove.filter((_, i) => i !== idx))} />
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default BehaviorDetailsTab;





// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { X, Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Link, Code, ChevronDown, Plus, Paperclip, ExternalLink } from "lucide-react";

// // Tag component
// const Tag = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
//   <span className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-md text-sm text-gray-700">
//     {label}
//     <button onClick={onRemove} className="text-red-400 hover:text-red-600 transition-colors">
//       <X size={14} />
//     </button>
//   </span>
// );

// // Input field component
// const InputField = ({ placeholder, onAdd }: { placeholder: string; onAdd: (val: string) => void }) => (
//   <input
//     type="text"
//     placeholder={placeholder}
//     className="w-full bg-[#EBF2FF] border-none rounded-lg px-4 py-3 text-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
//     onKeyDown={(e) => {
//       if (e.key === "Enter" && e.currentTarget.value) {
//         e.preventDefault();
//         onAdd(e.currentTarget.value);
//         e.currentTarget.value = "";
//       }
//     }}
//   />
// );

// type Supplement = {
//   name: string;
//   file?: File;
// };

// // ✅ Props interface যোগ করা হলো
// export interface SupplementDetails {
//   image: string | null;
//   worksWith: string[];
//   avoidWith: string[];
//   primaryBenefits: string;
//   childrenDosage: string;
//   adultDosage: string;
//   sideEffects: string;
// }

// interface BehaviorDetailsTabProps {
//   value: SupplementDetails;
//   onChange: (details: SupplementDetails) => void;
// }

// // ✅ Props receive করা হচ্ছে
// const BehaviorDetailsTab: React.FC<BehaviorDetailsTabProps> = () => {
//   // States
//   const [rootCauses, setRootCauses] = useState(["Low muscle tone", "Sensory processing issues"]);
//   const [showProtocolList, setShowProtocolList] = useState(false);
//   const [selectedProtocols, setSelectedProtocols] = useState<string[]>([]);
//   const [dietAdd, setDietAdd] = useState(["Fermented foods", "Bone broth"]);
//   const [dietRemove, setDietRemove] = useState(["Gluten", "Sugar", "Dairy"]);
//   const [supplements, setSupplements] = useState<Supplement[]>([]);
//   const [fixedSupplement, setFixedSupplement] = useState<Supplement>({ name: "", file: undefined });

//   const protocols = [
//     "Biomedical Protocol",
//     "Gut Healing Protocol",
//     "Immune Support Protocol",
//     "Yeast Overgrowth Protocol",
//     "Detoxification Protocol",
//   ];

//   // Protocol toggle
//   const toggleProtocol = (protocol: string) => {
//     if (selectedProtocols.includes(protocol)) {
//       setSelectedProtocols(selectedProtocols.filter((p) => p !== protocol));
//     } else {
//       setSelectedProtocols([...selectedProtocols, protocol]);
//     }
//   };

//   // Supplement handlers
//   const handleAddSupplement = () => setSupplements([...supplements, { name: "", file: undefined }]);
//   const handleUpdateSupplement = (idx: number, val: string, type: "name" | "file") => {
//     if (idx === -1) {
//       if (type === "name") setFixedSupplement({ ...fixedSupplement, name: val });
//       return;
//     }
//     const copy = [...supplements];
//     if (type === "name") copy[idx].name = val;
//     if (type === "file") copy[idx].file = val as any;
//     setSupplements(copy);
//   };
//   const handleRemoveSupplement = (idx: number) => setSupplements(supplements.filter((_, i) => i !== idx));

//   return (
//     <div className="flex flex-col lg:flex-row gap-8">
//       <div className="flex-1 space-y-8">
//         {/* Possible Root Causes */}
//         <section>
//           <label className="block text-sm font-semibold mb-3">Possible Root Causes</label>
//           <InputField placeholder="Enter the behaviour title (e.g., Toe Walking)" onAdd={(val) => setRootCauses([...rootCauses, val])} />
//           <div className="flex flex-wrap gap-2 mt-3">
//             {rootCauses.map((c) => (
//               <Tag key={c} label={c} onRemove={() => setRootCauses(rootCauses.filter((i) => i !== c))} />
//             ))}
//           </div>
//         </section>

//         {/* Suggested Protocols */}
//         <section>
//           <label className="block text-sm font-semibold mb-2">Suggested Protocols</label>
//           <div
//             onClick={() => setShowProtocolList(!showProtocolList)}
//             className="w-full bg-[#EBF2FF] rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer border border-transparent hover:border-blue-200 transition-all"
//           >
//             <span className={`text-sm ${selectedProtocols.length ? "text-gray-800" : "text-gray-500"}`}>
//               {selectedProtocols.length ? selectedProtocols.join(", ") : "Select protocols healing or intervention approaches"}
//             </span>
//             <ChevronDown size={20} className={`text-gray-400 transition-transform ${showProtocolList ? "rotate-180" : ""}`} />
//           </div>

//           {showProtocolList && (
//             <div className="mt-2 bg-white p-4 rounded-xl shadow-lg border border-gray-100 max-h-48 overflow-y-auto">
//               {protocols.map((item, idx) => (
//                 <div key={idx} className="flex items-center gap-3 group cursor-pointer mb-2" onClick={() => toggleProtocol(item)}>
//                   <div
//                     className={`w-5 h-5 border-2 border-blue-400 rounded flex items-center justify-center transition-colors ${
//                       selectedProtocols.includes(item) ? "bg-blue-400" : "bg-white"
//                     }`}
//                   >
//                     {selectedProtocols.includes(item) && <div className="w-2 h-2 bg-white rounded-sm"></div>}
//                   </div>
//                   <span className="text-sm text-gray-600">{item}</span>
//                 </div>
//               ))}
//               <button
//                 onClick={() => setShowProtocolList(false)}
//                 className="w-full mt-4 bg-[#A78BFA] text-white py-2 rounded-lg font-medium shadow-md hover:bg-[#8B5CF6] transition-all"
//               >
//                 Done
//               </button>
//             </div>
//           )}
//         </section>

//         {/* Recommended Labs */}
//         <section>
//           <div className="flex justify-between items-center mb-3">
//             <label className="text-sm font-semibold">Recommended labs</label>
//             <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-black">
//               <Code size={14} /> Plain Text
//             </button>
//           </div>
//           <div className="border border-gray-200 rounded-lg overflow-hidden">
//             <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 bg-[#F9FAFB]">
//               <Bold size={16} className="mx-2 text-gray-500 cursor-pointer" />
//               <Italic size={16} className="mx-2 text-gray-500 cursor-pointer" />
//               <Underline size={16} className="mx-2 text-gray-500 cursor-pointer" />
//               <div className="w-[1px] h-4 bg-gray-300 mx-1" />
//               <span className="mx-2 font-bold text-gray-500 text-sm cursor-pointer">H1</span>
//               <span className="mx-2 font-bold text-gray-500 text-sm cursor-pointer">H2</span>
//               <div className="w-[1px] h-4 bg-gray-300 mx-1" />
//               <List size={16} className="mx-2 text-gray-500 cursor-pointer" />
//               <div className="w-[1px] h-4 bg-gray-300 mx-1" />
//               <AlignLeft size={16} className="mx-2 text-gray-500 cursor-pointer" />
//               <AlignCenter size={16} className="mx-2 text-gray-500 cursor-pointer" />
//               <AlignRight size={16} className="mx-2 text-gray-500 cursor-pointer" />
//               <div className="w-[1px] h-4 bg-gray-300 mx-1" />
//               <Link size={16} className="mx-2 text-gray-500 cursor-pointer" />
//             </div>
//             <textarea
//               className="w-full p-4 min-h-[120px] bg-[#EBF2FF]/30 outline-none text-sm placeholder-gray-400"
//               placeholder="Describe the factors that may influence this behaviour"
//             />
//           </div>
//         </section>

//         {/* Supplements to Consider */}
//         <section>
//           <div className="flex justify-between items-center mb-3">
//             <label className="text-sm font-semibold">Supplements to Consider</label>
//             <button onClick={handleAddSupplement} className="p-1 bg-[#8B5CF6] text-white rounded-md">
//               <Plus size={20} />
//             </button>
//           </div>

//           <div className="space-y-3">
//             {/* Fixed line */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               <input
//                 type="text"
//                 placeholder="Supplements name"
//                 className="bg-[#EBF2FF] rounded-lg px-4 py-3 text-sm outline-none"
//                 value={fixedSupplement.name}
//                 onChange={(e) => handleUpdateSupplement(-1, e.target.value, "name")}
//               />
//               <label className="bg-[#EBF2FF] rounded-lg px-4 py-3 flex items-center justify-between text-gray-400 text-sm cursor-pointer">
//                 <span className="flex items-center gap-2">
//                   <Paperclip size={16} /> {fixedSupplement.file ? fixedSupplement.file.name : "Upload photo"}
//                 </span>
//                 <ExternalLink size={16} />
//                 <input
//                   type="file"
//                   className="hidden"
//                   onChange={(e) => {
//                     if (e.target.files && e.target.files[0])
//                       handleUpdateSupplement(-1, e.target.files[0].name, "file");
//                   }}
//                 />
//               </label>
//             </div>

//             {/* Dynamic lines */}
//             {supplements.map((sup, idx) => (
//               <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
//                 <input
//                   type="text"
//                   placeholder="Supplements name"
//                   className="bg-[#EBF2FF] rounded-lg px-4 py-3 text-sm outline-none"
//                   value={sup.name}
//                   onChange={(e) => handleUpdateSupplement(idx, e.target.value, "name")}
//                 />
//                 <label className="bg-[#EBF2FF] rounded-lg px-4 py-3 flex items-center justify-between text-gray-400 text-sm cursor-pointer">
//                   <span className="flex items-center gap-2">
//                     <Paperclip size={16} /> {sup.file ? sup.file.name : "Upload photo"}
//                   </span>
//                   <ExternalLink size={16} />
//                   <input
//                     type="file"
//                     className="hidden"
//                     onChange={(e) => {
//                       if (e.target.files && e.target.files[0])
//                         handleUpdateSupplement(idx, e.target.files[0].name, "file");
//                     }}
//                   />
//                 </label>
//                 <button onClick={() => handleRemoveSupplement(idx)} className="text-red-500">
//                   <X size={18} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Dietary Recommendations */}
//         <section>
//           <label className="block text-sm font-semibold mb-3">Dietary Recommendations</label>
//           <div className="border border-[#EBF2FF] rounded-xl p-4 md:p-6 space-y-6">
//             <div>
//               <InputField placeholder="Add Food guidance for support" onAdd={(val) => setDietAdd([...dietAdd, val])} />
//               <div className="flex flex-wrap gap-2 mt-3">
//                 {dietAdd.map((f) => (
//                   <Tag key={f} label={f} onRemove={() => setDietAdd(dietAdd.filter((i) => i !== f))} />
//                 ))}
//               </div>
//             </div>
//             <div>
//               <InputField placeholder="Remove Food guidance for support" onAdd={(val) => setDietRemove([...dietRemove, val])} />
//               <div className="flex flex-wrap gap-2 mt-3">
//                 {dietRemove.map((f) => (
//                   <Tag key={f} label={f} onRemove={() => setDietRemove(dietRemove.filter((i) => i !== f))} />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default BehaviorDetailsTab;







// import { useState } from "react";
// import { X, Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Link, Code, ChevronDown, Plus, Paperclip, ExternalLink } from "lucide-react";

// // Tag component
// const Tag = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
//   <span className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-md text-sm text-gray-700">
//     {label}
//     <button onClick={onRemove} className="text-red-400 hover:text-red-600 transition-colors">
//       <X size={14} />
//     </button>
//   </span>
// );

// // Input field component
// const InputField = ({ placeholder, onAdd }: { placeholder: string; onAdd: (val: string) => void }) => (
//   <input
//     type="text"
//     placeholder={placeholder}
//     className="w-full bg-[#EBF2FF] border-none rounded-lg px-4 py-3 text-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
//     onKeyDown={(e) => {
//       if (e.key === "Enter" && e.currentTarget.value) {
//         e.preventDefault();
//         onAdd(e.currentTarget.value);
//         e.currentTarget.value = "";
//       }
//     }}
//   />
// );

// type Supplement = {
//   name: string;
//   file?: File;
// };

// const BehaviorDetailsTab = () => {
//   // States
//   const [rootCauses, setRootCauses] = useState(["Low muscle tone", "Sensory processing issues"]);
//   const [showProtocolList, setShowProtocolList] = useState(false);
//   const [selectedProtocols, setSelectedProtocols] = useState<string[]>([]);
//   const [dietAdd, setDietAdd] = useState(["Fermented foods", "Bone broth"]);
//   const [dietRemove, setDietRemove] = useState(["Gluten", "Sugar", "Dairy"]);
//   const [supplements, setSupplements] = useState<Supplement[]>([]);
//   const [fixedSupplement, setFixedSupplement] = useState<Supplement>({ name: "", file: undefined });

//   const protocols = [
//     "Biomedical Protocol",
//     "Gut Healing Protocol",
//     "Immune Support Protocol",
//     "Yeast Overgrowth Protocol",
//     "Detoxification Protocol",
//   ];

//   // Protocol toggle
//   const toggleProtocol = (protocol: string) => {
//     if (selectedProtocols.includes(protocol)) {
//       setSelectedProtocols(selectedProtocols.filter((p) => p !== protocol));
//     } else {
//       setSelectedProtocols([...selectedProtocols, protocol]);
//     }
//   };

//   // Supplement handlers
//   const handleAddSupplement = () => setSupplements([...supplements, { name: "", file: undefined }]);
//   const handleUpdateSupplement = (idx: number, val: string, type: "name" | "file") => {
//     if (idx === -1) {
//       if (type === "name") setFixedSupplement({ ...fixedSupplement, name: val });
//       return;
//     }
//     const copy = [...supplements];
//     if (type === "name") copy[idx].name = val;
//     if (type === "file") copy[idx].file = val as any;
//     setSupplements(copy);
//   };
//   const handleRemoveSupplement = (idx: number) => setSupplements(supplements.filter((_, i) => i !== idx));

//   return (
//     <div className="flex flex-col lg:flex-row gap-8">
//       <div className="flex-1 space-y-8">
//         {/* Possible Root Causes */}
//         <section>
//           <label className="block text-sm font-semibold mb-3">Possible Root Causes</label>
//           <InputField placeholder="Enter the behaviour title (e.g., Toe Walking)" onAdd={(val) => setRootCauses([...rootCauses, val])} />
//           <div className="flex flex-wrap gap-2 mt-3">
//             {rootCauses.map((c) => (
//               <Tag key={c} label={c} onRemove={() => setRootCauses(rootCauses.filter((i) => i !== c))} />
//             ))}
//           </div>
//         </section>

//         {/* Suggested Protocols */}
//         <section>
//           <label className="block text-sm font-semibold mb-2">Suggested Protocols</label>
//           <div
//             onClick={() => setShowProtocolList(!showProtocolList)}
//             className="w-full bg-[#EBF2FF] rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer border border-transparent hover:border-blue-200 transition-all"
//           >
//             <span className={`text-sm ${selectedProtocols.length ? "text-gray-800" : "text-gray-500"}`}>
//               {selectedProtocols.length ? selectedProtocols.join(", ") : "Select protocols healing or intervention approaches"}
//             </span>
//             <ChevronDown size={20} className={`text-gray-400 transition-transform ${showProtocolList ? "rotate-180" : ""}`} />
//           </div>

//           {showProtocolList && (
//             <div className="mt-2 bg-white p-4 rounded-xl shadow-lg border border-gray-100 max-h-48 overflow-y-auto">
//               {protocols.map((item, idx) => (
//                 <div key={idx} className="flex items-center gap-3 group cursor-pointer mb-2" onClick={() => toggleProtocol(item)}>
//                   <div
//                     className={`w-5 h-5 border-2 border-blue-400 rounded flex items-center justify-center transition-colors ${
//                       selectedProtocols.includes(item) ? "bg-blue-400" : "bg-white"
//                     }`}
//                   >
//                     {selectedProtocols.includes(item) && <div className="w-2 h-2 bg-white rounded-sm"></div>}
//                   </div>
//                   <span className="text-sm text-gray-600">{item}</span>
//                 </div>
//               ))}
//               <button
//                 onClick={() => setShowProtocolList(false)}
//                 className="w-full mt-4 bg-[#A78BFA] text-white py-2 rounded-lg font-medium shadow-md hover:bg-[#8B5CF6] transition-all"
//               >
//                 Done
//               </button>
//             </div>
//           )}
//         </section>

//         {/* Recommended Labs */}
//         <section>
//           <div className="flex justify-between items-center mb-3">
//             <label className="text-sm font-semibold">Recommended labs</label>
//             <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-black">
//               <Code size={14} /> Plain Text
//             </button>
//           </div>
//           <div className="border border-gray-200 rounded-lg overflow-hidden">
//             <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 bg-[#F9FAFB]">
//               <Bold size={16} className="mx-2 text-gray-500 cursor-pointer" />
//               <Italic size={16} className="mx-2 text-gray-500 cursor-pointer" />
//               <Underline size={16} className="mx-2 text-gray-500 cursor-pointer" />
//               <div className="w-[1px] h-4 bg-gray-300 mx-1" />
//               <span className="mx-2 font-bold text-gray-500 text-sm cursor-pointer">H1</span>
//               <span className="mx-2 font-bold text-gray-500 text-sm cursor-pointer">H2</span>
//               <div className="w-[1px] h-4 bg-gray-300 mx-1" />
//               <List size={16} className="mx-2 text-gray-500 cursor-pointer" />
//               <div className="w-[1px] h-4 bg-gray-300 mx-1" />
//               <AlignLeft size={16} className="mx-2 text-gray-500 cursor-pointer" />
//               <AlignCenter size={16} className="mx-2 text-gray-500 cursor-pointer" />
//               <AlignRight size={16} className="mx-2 text-gray-500 cursor-pointer" />
//               <div className="w-[1px] h-4 bg-gray-300 mx-1" />
//               <Link size={16} className="mx-2 text-gray-500 cursor-pointer" />
//             </div>
//             <textarea
//               className="w-full p-4 min-h-[120px] bg-[#EBF2FF]/30 outline-none text-sm placeholder-gray-400"
//               placeholder="Describe the factors that may influence this behaviour"
//             />
//           </div>
//         </section>

//         {/* Supplements to Consider */}
//         <section>
//           <div className="flex justify-between items-center mb-3">
//             <label className="text-sm font-semibold">Supplements to Consider</label>
//             <button onClick={handleAddSupplement} className="p-1 bg-[#8B5CF6] text-white rounded-md">
//               <Plus size={20} />
//             </button>
//           </div>

//           <div className="space-y-3">
//             {/* Fixed line */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               <input
//                 type="text"
//                 placeholder="Supplements name"
//                 className="bg-[#EBF2FF] rounded-lg px-4 py-3 text-sm outline-none"
//                 value={fixedSupplement.name}
//                 onChange={(e) => handleUpdateSupplement(-1, e.target.value, "name")}
//               />
//               <label className="bg-[#EBF2FF] rounded-lg px-4 py-3 flex items-center justify-between text-gray-400 text-sm cursor-pointer">
//                 <span className="flex items-center gap-2">
//                   <Paperclip size={16} /> {fixedSupplement.file ? fixedSupplement.file.name : "Upload photo"}
//                 </span>
//                 <ExternalLink size={16} />
//                 <input
//                   type="file"
//                   className="hidden"
//                   onChange={(e) => {
//                     if (e.target.files && e.target.files[0])
//                       handleUpdateSupplement(-1, e.target.files[0].name, "file");
//                   }}
//                 />
//               </label>
//             </div>

//             {/* Dynamic lines */}
//             {supplements.map((sup, idx) => (
//               <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
//                 <input
//                   type="text"
//                   placeholder="Supplements name"
//                   className="bg-[#EBF2FF] rounded-lg px-4 py-3 text-sm outline-none"
//                   value={sup.name}
//                   onChange={(e) => handleUpdateSupplement(idx, e.target.value, "name")}
//                 />
//                 <label className="bg-[#EBF2FF] rounded-lg px-4 py-3 flex items-center justify-between text-gray-400 text-sm cursor-pointer">
//                   <span className="flex items-center gap-2">
//                     <Paperclip size={16} /> {sup.file ? sup.file.name : "Upload photo"}
//                   </span>
//                   <ExternalLink size={16} />
//                   <input
//                     type="file"
//                     className="hidden"
//                     onChange={(e) => {
//                       if (e.target.files && e.target.files[0])
//                         handleUpdateSupplement(idx, e.target.files[0].name, "file");
//                     }}
//                   />
//                 </label>
//                 <button onClick={() => handleRemoveSupplement(idx)} className="text-red-500">
//                   <X size={18} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Dietary Recommendations */}
//         <section>
//           <label className="block text-sm font-semibold mb-3">Dietary Recommendations</label>
//           <div className="border border-[#EBF2FF] rounded-xl p-4 md:p-6 space-y-6">
//             <div>
//               <InputField placeholder="Add Food guidance for support" onAdd={(val) => setDietAdd([...dietAdd, val])} />
//               <div className="flex flex-wrap gap-2 mt-3">
//                 {dietAdd.map((f) => (
//                   <Tag key={f} label={f} onRemove={() => setDietAdd(dietAdd.filter((i) => i !== f))} />
//                 ))}
//               </div>
//             </div>
//             <div>
//               <InputField placeholder="Remove Food guidance for support" onAdd={(val) => setDietRemove([...dietRemove, val])} />
//               <div className="flex flex-wrap gap-2 mt-3">
//                 {dietRemove.map((f) => (
//                   <Tag key={f} label={f} onRemove={() => setDietRemove(dietRemove.filter((i) => i !== f))} />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default BehaviorDetailsTab; 







// // import  { useState } from 'react';
// // import { X, Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Link, Code, ChevronDown, Plus, Paperclip, ExternalLink } from 'lucide-react';

// // // সাব-কম্পোনেন্ট (মেইন ফাংশনের বাইরে)
// // const Tag = ({ label, onRemove }: { label: string, onRemove: () => void }) => (
// //   <span className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-md text-sm text-gray-700">
// //     {label}
// //     <button onClick={onRemove} className="text-red-400 hover:text-red-600 transition-colors">
// //       <X size={14} />
// //     </button>
// //   </span>
// // );

// // const InputField = ({ placeholder, onAdd }: { placeholder: string, onAdd: (val: string) => void }) => (
// //   <input
// //     type="text"
// //     placeholder={placeholder}
// //     className="w-full bg-[#EBF2FF] border-none rounded-lg px-4 py-3 text-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
// //     onKeyDown={(e) => {
// //       if (e.key === 'Enter' && e.currentTarget.value) {
// //         e.preventDefault();
// //         onAdd(e.currentTarget.value);
// //         e.currentTarget.value = '';
// //       }
// //     }}
// //   />
// // );

// // const BehaviorDetailsTab = () => {
// //   // States
// //   const [rootCauses, setRootCauses] = useState(['Low muscle tone', 'Sensory processing issues']);
// //   const [showProtocolList, setShowProtocolList] = useState(false);

// //   const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>([]);
// //   const [dietAdd, setDietAdd] = useState(['Fermented foods', 'Bone broth']);
// //   const [dietRemove, setDietRemove] = useState(['Gluten', 'Sugar', 'Dairy']);
// //    const [behaviors, setBehaviors] = useState<{ name: string; file?: File }[]>([]);
// //    const protocols = [
// //     'Biomedical Protocol',
// //     'Gut Healing Protocol',
// //     'Immune Support Protocol',
// //     'Yeast Overgrowth Protocol',
// //     'Detoxification Protocol'
// //   ];

// //     const toggleProtocol = (protocol: string) => {
// //     if (selectedBehaviors.includes(protocol)) {
// //      setSelectedBehaviors(selectedBehaviors.filter(p => p !== protocol));
// //     } else {
// //      setSelectedBehaviors([...selectedBehaviors, protocol]);
// //     }
// //   };

// //     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
// //     if (e.target.files && e.target.files[0]) {
// //       const file = e.target.files[0];
// //       setBehaviors(prev => {
// //         const copy = [...prev];
// //         copy[index].file = file;
// //         return copy;
// //       });
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col lg:flex-row gap-8 ">
      

// //       <div className="flex-1  space-y-8">
        
// //         {/* Possible Root Causes */}
// //         <section>
// //           <label className="block text-sm font-semibold mb-3">Possible Root Causes</label>
// //           <InputField 
// //             placeholder="Enter the behaviour title (e.g., Toe Walking)" 
// //             onAdd={(val) => setRootCauses([...rootCauses, val])} 
// //           />
// //           <div className="flex flex-wrap gap-2 mt-3">
// //             {rootCauses.map(c => <Tag key={c} label={c} onRemove={() => setRootCauses(rootCauses.filter(i => i !== c))} />)}
// //           </div>
// //         </section>

// //         {/* Suggested Protocols (Dropdown) */}
// //     <section>
// //           <label className="block text-sm font-semibold mb-2">Suggested Protocols</label>
// //           <div
// //             onClick={() => setShowProtocolList(!showProtocolList)}
// //             className="w-full bg-[#EBF2FF] rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer border border-transparent hover:border-blue-200 transition-all"
// //           >
// //             <span className={`text-sm ${selectedBehaviors.length ? "text-gray-800" : "text-gray-500"}`}>
// //               {selectedBehaviors.length ? selectedBehaviors.join(", ") : "Select protocols healing or intervention approaches"}
// //             </span>
// //             <ChevronDown size={20} className={`text-gray-400 transition-transform ${showProtocolList ? "rotate-180" : ""}`} />
// //           </div>

// //           {showProtocolList && (
// //             <div className="mt-2 bg-white p-4 rounded-xl shadow-lg border border-gray-100 max-h-48 overflow-y-auto">
// //               {protocols.map((item, idx) => (
// //                 <div key={idx} className="flex items-center gap-3 group cursor-pointer mb-2" onClick={() => toggleProtocol(item)}>
// //                   <div className={`w-5 h-5 border-2 border-blue-400 rounded flex items-center justify-center transition-colors ${selectedBehaviors.includes(item) ? "bg-blue-400" : "bg-white"}`}>
// //                     {selectedBehaviors.includes(item) && <div className="w-2 h-2 bg-white rounded-sm"></div>}
// //                   </div>
// //                   <span className="text-sm text-gray-600">{item}</span>
// //                 </div>
// //               ))}
// //               <button onClick={() => setShowProtocolList(false)} className="w-full mt-4 bg-[#A78BFA] text-white py-2 rounded-lg font-medium shadow-md hover:bg-[#8B5CF6] transition-all">
// //                 Done
// //               </button>
// //             </div>
// //           )}
// //         </section>

// //         {/* Recommended Labs (Rich Text) */}
// //         <section>
// //           <div className="flex justify-between items-center mb-3">
// //             <label className="text-sm font-semibold">Recommended labs</label>
// //             <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-black">
// //               <Code size={14} /> Plain Text
// //             </button>
// //           </div>
// //           <div className="border border-gray-200 rounded-lg overflow-hidden">
// //             <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 bg-[#F9FAFB]">
// //               <Bold size={16} className="mx-2 text-gray-500 cursor-pointer" />
// //               <Italic size={16} className="mx-2 text-gray-500 cursor-pointer" />
// //               <Underline size={16} className="mx-2 text-gray-500 cursor-pointer" />
// //               <div className="w-[1px] h-4 bg-gray-300 mx-1" />
// //               <span className="mx-2 font-bold text-gray-500 text-sm cursor-pointer">H1</span>
// //               <span className="mx-2 font-bold text-gray-500 text-sm cursor-pointer">H2</span>
// //               <div className="w-[1px] h-4 bg-gray-300 mx-1" />
// //               <List size={16} className="mx-2 text-gray-500 cursor-pointer" />
// //               <div className="w-[1px] h-4 bg-gray-300 mx-1" />
// //               <AlignLeft size={16} className="mx-2 text-gray-500 cursor-pointer" />
// //               <AlignCenter size={16} className="mx-2 text-gray-500 cursor-pointer" />
// //               <AlignRight size={16} className="mx-2 text-gray-500 cursor-pointer" />
// //               <div className="w-[1px] h-4 bg-gray-300 mx-1" />
// //               <Link size={16} className="mx-2 text-gray-500 cursor-pointer" />
// //             </div>
// //             <textarea
// //               className="w-full p-4 min-h-[120px] bg-[#EBF2FF]/30 outline-none text-sm placeholder-gray-400"
// //               placeholder="Describe the factors that may influence this behaviour"
// //             />
// //           </div>
// //         </section>

// //         {/* Supplements to Consider */}
// //         <section>
// //           <div className="flex justify-between items-center mb-3">
// //             <label className="text-sm font-semibold">Supplements to Consider</label>
// //             <Plus size={20} className="text-white bg-[#8B5CF6] rounded-md cursor-pointer" />
// //           </div>
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             <input 
// //               type="text" 
// //               placeholder="Supplements name" 
// //               className="bg-[#EBF2FF] border-none rounded-lg px-4 py-3 outline-none text-sm"
// //             />
// //             <label className="bg-[#EBF2FF] rounded-lg px-4 py-3 flex items-center justify-between text-gray-400 text-sm cursor-pointer">
// //           <span className="flex items-center gap-2">
// //             <Paperclip size={16} /> {beh.file ? beh.file.name : "Upload photo"}
// //           </span>
// //           <ExternalLink size={16} />
// //           <input
// //             type="file"
// //             className="hidden"
// //             onChange={(e) => handleFileChange(e, idx)}
// //           />
// //         </label>
// //           </div>
// //           <div className="mt-3">
// //              <span className="inline-flex items-center gap-2 bg-white border border-gray-200 px-2 py-1 rounded md text-xs">
// //                 <img src="https://via.placeholder.com/20" alt="icon" className="w-4 h-4 rounded-sm" />
// //                 Photo.jpg <X size={12} className="text-red-500 cursor-pointer" />
// //              </span>
// //           </div>
// //         </section>

// //         {/* Dietary Recommendations */}
// //         <section>
// //           <label className="block text-sm font-semibold mb-3">Dietary Recommendations</label>
// //           <div className="border border-[#EBF2FF] rounded-xl p-4 md:p-6 space-y-6">
// //             <div>
// //               <InputField placeholder="Add Food guidance for support" onAdd={(val) => setDietAdd([...dietAdd, val])} />
// //               <div className="flex flex-wrap gap-2 mt-3">
// //                 {dietAdd.map(f => <Tag key={f} label={f} onRemove={() => setDietAdd(dietAdd.filter(i => i !== f))} />)}
// //               </div>
// //             </div>
// //             <div>
// //               <InputField placeholder="Remove Food guidance for support" onAdd={(val) => setDietRemove([...dietRemove, val])} />
// //               <div className="flex flex-wrap gap-2 mt-3">
// //                 {dietRemove.map(f => <Tag key={f} label={f} onRemove={() => setDietRemove(dietRemove.filter(i => i !== f))} />)}
// //               </div>
// //             </div>
// //           </div>
// //         </section>


// //       </div>

 

// //     </div>
// //   );
// // };

// // export default BehaviorDetailsTab;