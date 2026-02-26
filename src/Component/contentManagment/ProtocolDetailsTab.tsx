import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Link, Code } from 'lucide-react';

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

interface ProtocolDetails {
  symptoms_addressed: string;
  healing_approach: string;
  recommended_labs: string;
  key_supplements: string;
  recommended_foods: string;
  foods_to_avoid: string;
}

interface ProtocolDetailsTabProps {
  value: ProtocolDetails;
  onChange: (field: keyof ProtocolDetails, value: string) => void;
}

const cleanNA = (val: string) => (val === 'N/A' ? '' : val);

const ProtocolDetailsTab: React.FC<ProtocolDetailsTabProps> = ({ value, onChange }) => {
  return (
    <div className="text-[#333]">
      <div className="space-y-6">

        {/* Symptoms Addressed */}
        <div>
          <label className="block text-sm font-semibold mb-2">Symptoms Addressed</label>
          <input
            type="text"
            value={cleanNA(value.symptoms_addressed)}
            onChange={(e) => onChange('symptoms_addressed', e.target.value)}
            placeholder="Enter symptoms this protocol supports"
            className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Healing Approach */}
        <div>
          <label className="block text-sm font-semibold mb-2">Healing Approach / Overview</label>
          <input
            type="text"
            value={cleanNA(value.healing_approach)}
            onChange={(e) => onChange('healing_approach', e.target.value)}
            placeholder="Describe the healing approach for this protocol"
            className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Recommended Labs — শুধু এটাতেই MarkdownEditor */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold">Recommended Labs</label>
            <span className="flex items-center gap-1 text-xs text-gray-400"><Code size={14} /> Markdown</span>
          </div>
          <MarkdownEditor
            value={cleanNA(value.recommended_labs)}
            onChange={(v) => onChange('recommended_labs', v)}
            placeholder="Describe recommended lab tests (**bold**, *italic*, - list)"
          />
        </div>

        {/* Key Supplements */}
        <div>
          <label className="block text-sm font-semibold mb-2">Key Supplements</label>
          <input
            type="text"
            value={cleanNA(value.key_supplements)}
            onChange={(e) => onChange('key_supplements', e.target.value)}
            placeholder="Enter recommended supplements"
            className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Recommended Foods */}
        <div>
          <label className="block text-sm font-semibold mb-2">Recommended Foods</label>
          <input
            type="text"
            value={cleanNA(value.recommended_foods)}
            onChange={(e) => onChange('recommended_foods', e.target.value)}
            placeholder="Enter recommended foods"
            className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Foods to Avoid */}
        <div>
          <label className="block text-sm font-semibold mb-2">Foods to Avoid</label>
          <input
            type="text"
            value={cleanNA(value.foods_to_avoid)}
            onChange={(e) => onChange('foods_to_avoid', e.target.value)}
            placeholder="Enter foods to avoid"
            className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

      </div>
    </div>
  );
};

export default ProtocolDetailsTab;





// import React, { useState, useEffect, useRef } from 'react';
// import { Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Link, Code, X } from 'lucide-react';

// interface ProtocolDetails {
//   symptoms_addressed: string;
//   healing_approach: string;
//   recommended_labs: string;
//   key_supplements: string;
//   recommended_foods: string;
//   foods_to_avoid: string;
// }

// interface ProtocolDetailsTabProps {
//   value: ProtocolDetails;
//   onChange: (field: keyof ProtocolDetails, value: string) => void;
// }

// // Tag inside input box component
// const TagInput: React.FC<{
//   tags: string[];
//   onTagsChange: (tags: string[]) => void;
//   placeholder: string;
// }> = ({ tags, onTagsChange, placeholder }) => {
//   const [inputValue, setInputValue] = useState('');
//   const inputRef = useRef<HTMLInputElement>(null);

//   const addTag = (val: string) => {
//     const trimmed = val.trim();
//     if (trimmed && !tags.includes(trimmed)) {
//       onTagsChange([...tags, trimmed]);
//     }
//     setInputValue('');
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       addTag(inputValue);
//     } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
//       onTagsChange(tags.slice(0, -1));
//     }
//   };

//   const handleBlur = () => {
//     if (inputValue.trim()) {
//       addTag(inputValue);
//     }
//   };

//   const removeTag = (index: number) => {
//     onTagsChange(tags.filter((_, i) => i !== index));
//   };

//   return (
//     <div
//       className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-xl min-h-[50px] cursor-text focus-within:ring-2 focus-within:ring-blue-500"
//       onClick={() => inputRef.current?.focus()}
//     >
//       {tags.map((tag, idx) => (
//         <span
//           key={idx}
//           className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium"
//         >
//           {tag}
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               removeTag(idx);
//             }}
//             className="hover:bg-blue-600 rounded-full p-0.5 transition-colors"
//           >
//             <X size={12} />
//           </button>
//         </span>
//       ))}
//       <input
//         ref={inputRef}
//         type="text"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         onKeyDown={handleKeyDown}
//         onBlur={handleBlur}
//         placeholder={tags.length === 0 ? placeholder : ''}
//         className="flex-1 min-w-[150px] bg-transparent outline-none text-sm placeholder-gray-400"
//       />
//     </div>
//   );
// };

// const ProtocolDetailsTab: React.FC<ProtocolDetailsTabProps> = ({ value, onChange }) => {
//   const [symptoms, setSymptoms] = useState<string[]>([]);
//   const [labs, setLabs] = useState<string[]>([]);
//   const [supplements, setSupplements] = useState<string[]>([]);
//   const [addFoods, setAddFoods] = useState<string[]>([]);
//   const [removeFoods, setRemoveFoods] = useState<string[]>([]);

//   const parseVal = (val: string): string[] => {
//     if (!val || val === 'N/A') return [];
//     return val.split(',').map(s => s.trim()).filter(Boolean);
//   };

//   useEffect(() => {
//     setSymptoms(parseVal(value.symptoms_addressed));
//     setLabs(parseVal(value.recommended_labs));
//     setSupplements(parseVal(value.key_supplements));
//     setAddFoods(parseVal(value.recommended_foods));
//     setRemoveFoods(parseVal(value.foods_to_avoid));
//   }, [value.symptoms_addressed, value.recommended_labs, value.key_supplements, value.recommended_foods, value.foods_to_avoid]);

//   const updateSymptoms = (tags: string[]) => { setSymptoms(tags); onChange('symptoms_addressed', tags.join(', ')); };
//   const updateLabs = (tags: string[]) => { setLabs(tags); onChange('recommended_labs', tags.join(', ')); };
//   const updateSupplements = (tags: string[]) => { setSupplements(tags); onChange('key_supplements', tags.join(', ')); };
//   const updateAddFoods = (tags: string[]) => { setAddFoods(tags); onChange('recommended_foods', tags.join(', ')); };
//   const updateRemoveFoods = (tags: string[]) => { setRemoveFoods(tags); onChange('foods_to_avoid', tags.join(', ')); };

//   return (
//     <div className="text-[#333]">
//       <div className="space-y-8">

//         {/* Symptoms Addressed */}
//         <section>
//           <label className="block text-sm font-semibold mb-3">Symptoms Addressed</label>
//           <TagInput tags={symptoms} onTagsChange={updateSymptoms} placeholder="Type and press Enter to add symptoms..." />
//         </section>

//         {/* Healing Approach */}
//         <section>
//           <div className="flex justify-between items-center mb-3">
//             <label className="text-sm font-semibold">Healing Approach / Overview</label>
//             <button type="button" className="flex items-center gap-1 text-xs text-gray-500 hover:text-black">
//               <Code size={14} /> Plain Text
//             </button>
//           </div>
//           <div className="border border-gray-200 rounded-lg overflow-hidden">
//             <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 bg-white">
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><Bold size={18} className="text-gray-600" /></button>
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><Italic size={18} className="text-gray-600" /></button>
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><Underline size={18} className="text-gray-600" /></button>
//               <div className="w-[1px] h-6 bg-gray-200 mx-1" />
//               <button type="button" className="p-2 hover:bg-gray-100 rounded font-bold text-gray-600">H1</button>
//               <button type="button" className="p-2 hover:bg-gray-100 rounded font-bold text-gray-600">H2</button>
//               <div className="w-[1px] h-6 bg-gray-200 mx-1" />
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><List size={18} className="text-gray-600" /></button>
//               <div className="w-[1px] h-6 bg-gray-200 mx-1" />
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><AlignLeft size={18} className="text-gray-600" /></button>
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><AlignCenter size={18} className="text-gray-600" /></button>
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><AlignRight size={18} className="text-gray-600" /></button>
//               <div className="w-[1px] h-6 bg-gray-200 mx-1" />
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><Link size={18} className="text-gray-600" /></button>
//             </div>
//             <textarea
//               className="w-full p-4 min-h-[150px] bg-[#EBF2FF]/30 outline-none text-sm placeholder-gray-400"
//               placeholder="Describe the healing approach for this protocol"
//               value={value.healing_approach === 'N/A' ? '' : value.healing_approach}
//               onChange={(e) => onChange('healing_approach', e.target.value)}
//             />
//           </div>
//         </section>

//         {/* Recommended Labs */}
//         <section>
//           <label className="block text-sm font-semibold mb-3">Recommended Labs</label>
//           <TagInput tags={labs} onTagsChange={updateLabs} placeholder="Type and press Enter to add lab tests..." />
//         </section>

//         {/* Key Supplements */}
//         <section>
//           <label className="block text-sm font-semibold mb-3">Key Supplements</label>
//           <TagInput tags={supplements} onTagsChange={updateSupplements} placeholder="Type and press Enter to add supplements..." />
//         </section>

//         {/* Dietary Changes */}
//         <section>
//           <label className="block text-sm font-semibold mb-3">Dietary Changes</label>
//           <div className="border border-[#EBF2FF] rounded-xl p-4 md:p-6 space-y-6">
//             <div>
//               <label className="block text-xs font-medium mb-2 text-gray-600">Add Foods</label>
//               <TagInput tags={addFoods} onTagsChange={updateAddFoods} placeholder="Type and press Enter to add recommended foods..." />
//             </div>
//             <div>
//               <label className="block text-xs font-medium mb-2 text-gray-600">Remove Foods</label>
//               <TagInput tags={removeFoods} onTagsChange={updateRemoveFoods} placeholder="Type and press Enter to add foods to avoid..." />
//             </div>
//           </div>
//         </section>

//       </div>
//     </div>
//   );
// };

// export default ProtocolDetailsTab;






// import { useState } from 'react';
// import { X, Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Link, Code } from 'lucide-react';

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

// interface ProtocolDetailsTabProps {
//   value: SupplementDetails;
//   onChange: (details: SupplementDetails) => void;
// }

// const Tag = ({ label, onRemove }: { label: string, onRemove: () => void }) => (
//   <span className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-md text-sm text-gray-700">
//     {label}
//     <button onClick={onRemove} className="text-red-400 hover:text-red-600 transition-colors">
//       <X size={14} />
//     </button>
//   </span>
// );

// const InputField = ({ placeholder, onAdd }: { placeholder: string, onAdd: (val: string) => void }) => (
//   <input
//     type="text"
//     placeholder={placeholder}
//     className="w-full bg-[#EBF2FF] border-none rounded-lg px-4 py-3 text-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
//     onKeyDown={(e) => {
//       if (e.key === 'Enter' && e.currentTarget.value) {
//         e.preventDefault(); 
//         onAdd(e.currentTarget.value);
//         e.currentTarget.value = '';
//       }
//     }}
//   />
// );

// // ✅ Props receive করা হচ্ছে
// const ProtocolDetailsTab: React.FC<ProtocolDetailsTabProps> = () => {
//   const [symptoms, setSymptoms] = useState(['Low muscle tone', 'Sensory processing issues']);
//   const [labs, setLabs] = useState(['Comprehensive Stool Analysis', 'Organic Acids Test']);
//   const [supplements, setSupplements] = useState(['Probiotics', 'Digestive Enzymes']);
//   const [addFoods, setAddFoods] = useState(['Bone', 'Fermented foods']);
//   const [removeFoods, setRemoveFoods] = useState(['Gluten', 'Sugar', 'Dairy']);
//   const [healingText, setHealingText] = useState("");

//   return (
//     <div className="text-[#333]">
//       <div className="space-y-8">
        
//         {/* Symptoms Addressed */}
//         <section>
//           <label className="block text-sm font-semibold mb-3">Symptoms Addressed</label>
//           <InputField 
//             placeholder="Add symptoms this protocol supports" 
//             onAdd={(val) => setSymptoms([...symptoms, val])} 
//           />
//           <div className="flex flex-wrap gap-2 mt-3">
//             {symptoms.map(s => (
//               <Tag key={s} label={s} onRemove={() => setSymptoms(symptoms.filter(i => i !== s))} />
//             ))}
//           </div>
//         </section>

//         {/* Healing Approach / Overview */}
//         <section>
//           <div className="flex justify-between items-center mb-3">
//             <label className="text-sm font-semibold">Healing Approach / Overview</label>
//             <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-black">
//               <Code size={14} /> Plain Text
//             </button>
//           </div>
//           <div className="border border-gray-200 rounded-lg overflow-hidden">
//             <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 bg-white">
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><Bold size={18} className="text-gray-600" /></button>
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><Italic size={18} className="text-gray-600" /></button>
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><Underline size={18} className="text-gray-600" /></button>
//               <div className="w-[1px] h-6 bg-gray-200 mx-1" />
//               <button type="button" className="p-2 hover:bg-gray-100 rounded font-bold text-gray-600">H1</button>
//               <button type="button" className="p-2 hover:bg-gray-100 rounded font-bold text-gray-600">H2</button>
//               <div className="w-[1px] h-6 bg-gray-200 mx-1" />
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><List size={18} className="text-gray-600" /></button>
//               <div className="w-[1px] h-6 bg-gray-200 mx-1" />
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><AlignLeft size={18} className="text-gray-600" /></button>
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><AlignCenter size={18} className="text-gray-600" /></button>
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><AlignRight size={18} className="text-gray-600" /></button>
//               <div className="w-[1px] h-6 bg-gray-200 mx-1" />
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><Link size={18} className="text-gray-600" /></button>
//             </div>
//             <textarea
//               className="w-full p-4 min-h-[150px] bg-[#EBF2FF]/30 outline-none text-sm placeholder-gray-400"
//               placeholder="Describe the factors that may influence this behaviour"
//               value={healingText}
//               onChange={(e) => setHealingText(e.target.value)}
//             />
//           </div>
//         </section>

//         {/* Recommended Labs */}
//         <section>
//           <label className="block text-sm font-semibold mb-3">Recommended Labs</label>
//           <InputField 
//             placeholder="Add symptoms this protocol supports" 
//             onAdd={(val) => setLabs([...labs, val])} 
//           />
//           <div className="flex flex-wrap gap-2 mt-3">
//             {labs.map(l => (
//               <Tag key={l} label={l} onRemove={() => setLabs(labs.filter(i => i !== l))} />
//             ))}
//           </div>
//         </section>

//         {/* Key Supplements */}
//         <section>
//           <label className="block text-sm font-semibold mb-3">Key Supplements</label>
//           <InputField 
//             placeholder="List recommended supplements" 
//             onAdd={(val) => setSupplements([...supplements, val])} 
//           />
//           <div className="flex flex-wrap gap-2 mt-3">
//             {supplements.map(s => (
//               <Tag key={s} label={s} onRemove={() => setSupplements(supplements.filter(i => i !== s))} />
//             ))}
//           </div>
//         </section>

//         {/* Dietary Changes */}
//         <section>
//           <label className="block text-sm font-semibold mb-3">Dietary Changes</label>
//           <div className="border border-[#EBF2FF] rounded-xl p-4 md:p-6 space-y-6">
//             <div>
//               <InputField placeholder="Add Foods" onAdd={(val) => setAddFoods([...addFoods, val])} />
//               <div className="flex flex-wrap gap-2 mt-3">
//                 {addFoods.map(f => (
//                   <Tag key={f} label={f} onRemove={() => setAddFoods(addFoods.filter(i => i !== f))} />
//                 ))}
//               </div>
//             </div>
//             <div>
//               <InputField placeholder="Remove Foods" onAdd={(val) => setRemoveFoods([...removeFoods, val])} />
//               <div className="flex flex-wrap gap-2 mt-3">
//                 {removeFoods.map(f => (
//                   <Tag key={f} label={f} onRemove={() => setRemoveFoods(removeFoods.filter(i => i !== f))} />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//       </div>
//     </div>
//   );
// };

// export default ProtocolDetailsTab;







// import { useState } from 'react';
// import { X, Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Link, Code } from 'lucide-react';


// const Tag = ({ label, onRemove }: { label: string, onRemove: () => void }) => (
//   <span className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-md text-sm text-gray-700">
//     {label}
//     <button onClick={onRemove} className="text-red-400 hover:text-red-600 transition-colors">
//       <X size={14} />
//     </button>
//   </span>
// );

// const InputField = ({ placeholder, onAdd }: { placeholder: string, onAdd: (val: string) => void }) => (
//   <input
//     type="text"
//     placeholder={placeholder}
//     className="w-full bg-[#EBF2FF] border-none rounded-lg px-4 py-3 text-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
//     onKeyDown={(e) => {
//       if (e.key === 'Enter' && e.currentTarget.value) {
//         e.preventDefault(); 
//         onAdd(e.currentTarget.value);
//         e.currentTarget.value = '';
//       }
//     }}
//   />
// );

// const ProtocolDetailsTab = () => {
//   // States
//   const [symptoms, setSymptoms] = useState(['Low muscle tone', 'Sensory processing issues']);
//   const [labs, setLabs] = useState(['Comprehensive Stool Analysis', 'Organic Acids Test']);
//   const [supplements, setSupplements] = useState(['Probiotics', 'Digestive Enzymes']);
//   const [addFoods, setAddFoods] = useState(['Bone', 'Fermented foods']);
//   const [removeFoods, setRemoveFoods] = useState(['Gluten', 'Sugar', 'Dairy']);
//   const [healingText, setHealingText] = useState("");

//   return (
//     <div className=" text-[#333]">
//       <div className="space-y-8">
        
//         {/* Symptoms Addressed */}
//         <section>
//           <label className="block text-sm font-semibold mb-3">Symptoms Addressed</label>
//           <InputField 
//             placeholder="Add symptoms this protocol supports" 
//             onAdd={(val) => setSymptoms([...symptoms, val])} 
//           />
//           <div className="flex flex-wrap gap-2 mt-3">
//             {symptoms.map(s => (
//               <Tag key={s} label={s} onRemove={() => setSymptoms(symptoms.filter(i => i !== s))} />
//             ))}
//           </div>
//         </section>

//         {/* Healing Approach / Overview */}
//         <section>
//           <div className="flex justify-between items-center mb-3">
//             <label className="text-sm font-semibold">Healing Approach / Overview</label>
//             <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-black">
//               <Code size={14} /> Plain Text
//             </button>
//           </div>
//           <div className="border border-gray-200 rounded-lg overflow-hidden">
//             <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 bg-white">
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><Bold size={18} className="text-gray-600" /></button>
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><Italic size={18} className="text-gray-600" /></button>
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><Underline size={18} className="text-gray-600" /></button>
//               <div className="w-[1px] h-6 bg-gray-200 mx-1" />
//               <button type="button" className="p-2 hover:bg-gray-100 rounded font-bold text-gray-600">H1</button>
//               <button type="button" className="p-2 hover:bg-gray-100 rounded font-bold text-gray-600">H2</button>
//               <div className="w-[1px] h-6 bg-gray-200 mx-1" />
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><List size={18} className="text-gray-600" /></button>
//               <div className="w-[1px] h-6 bg-gray-200 mx-1" />
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><AlignLeft size={18} className="text-gray-600" /></button>
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><AlignCenter size={18} className="text-gray-600" /></button>
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><AlignRight size={18} className="text-gray-600" /></button>
//               <div className="w-[1px] h-6 bg-gray-200 mx-1" />
//               <button type="button" className="p-2 hover:bg-gray-100 rounded"><Link size={18} className="text-gray-600" /></button>
//             </div>
//             <textarea
//               className="w-full p-4 min-h-[150px] bg-[#EBF2FF]/30 outline-none text-sm placeholder-gray-400"
//               placeholder="Describe the factors that may influence this behaviour"
//               value={healingText}
//               onChange={(e) => setHealingText(e.target.value)}
//             />
//           </div>
//         </section>

//         {/* Recommended Labs */}
//         <section>
//           <label className="block text-sm font-semibold mb-3">Recommended Labs</label>
//           <InputField 
//             placeholder="Add symptoms this protocol supports" 
//             onAdd={(val) => setLabs([...labs, val])} 
//           />
//           <div className="flex flex-wrap gap-2 mt-3">
//             {labs.map(l => (
//               <Tag key={l} label={l} onRemove={() => setLabs(labs.filter(i => i !== l))} />
//             ))}
//           </div>
//         </section>

//         {/* Key Supplements */}
//         <section>
//           <label className="block text-sm font-semibold mb-3">Key Supplements</label>
//           <InputField 
//             placeholder="List recommended supplements" 
//             onAdd={(val) => setSupplements([...supplements, val])} 
//           />
//           <div className="flex flex-wrap gap-2 mt-3">
//             {supplements.map(s => (
//               <Tag key={s} label={s} onRemove={() => setSupplements(supplements.filter(i => i !== s))} />
//             ))}
//           </div>
//         </section>

//         {/* Dietary Changes */}
//         <section>
//           <label className="block text-sm font-semibold mb-3">Dietary Changes</label>
//           <div className="border border-[#EBF2FF] rounded-xl p-4 md:p-6 space-y-6">
//             <div>
//               <InputField placeholder="Add Foods" onAdd={(val) => setAddFoods([...addFoods, val])} />
//               <div className="flex flex-wrap gap-2 mt-3">
//                 {addFoods.map(f => (
//                   <Tag key={f} label={f} onRemove={() => setAddFoods(addFoods.filter(i => i !== f))} />
//                 ))}
//               </div>
//             </div>
//             <div>
//               <InputField placeholder="Remove Foods" onAdd={(val) => setRemoveFoods([...removeFoods, val])} />
//               <div className="flex flex-wrap gap-2 mt-3">
//                 {removeFoods.map(f => (
//                   <Tag key={f} label={f} onRemove={() => setRemoveFoods(removeFoods.filter(i => i !== f))} />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>


//       </div>
//     </div>
//   );
// };

// export default ProtocolDetailsTab;