import React from 'react';
import { Upload } from 'lucide-react';

export interface SupplementDetails {
  image: string | null;
  worksWith: string[];
  avoidWith: string[];
  primaryBenefits: string;
  childrenDosage: string;
  adultDosage: string;
  sideEffects: string;
  signsOfDeficiency: string;
}

type Props = {
  value: SupplementDetails;
  onChange: (val: SupplementDetails) => void;
};

const SuplimentsDetailsTab: React.FC<Props> = ({ value, onChange }) => {

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ ...value, image: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">

      {/* Image Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg px-6 py-10 text-center">
        <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
        <label htmlFor="image-upload" className="cursor-pointer">
          {value.image ? (
            <div className="space-y-2">
              <img src={value.image} alt="Uploaded" className="mx-auto max-h-32 rounded" />
              <p className="text-sm text-gray-600">Click to change image</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="mx-auto text-black bg-[#DBEAFE] p-3 rounded-md" size={48} />
              <p className="font-medium text-sm">Upload Supplement Image</p>
              <p className="text-sm text-gray-500">Supported formats: png, jpeg (Max 10MB)</p>
            </div>
          )}
        </label>
      </div>

      {/* Synergy Notes */}
      <div>
        <label className="block text-sm font-medium mb-2">Synergy Notes</label>
        <div className="border border-blue-100 p-5 rounded-[10px] space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Works Well With</label>
            <input
              type="text"
              value={value.worksWith.join(', ')}
              onChange={(e) => onChange({ ...value, worksWith: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              placeholder="e.g., Methylcobalamin (B12), P5P (B6)"
              className="w-full bg-blue-50 py-3 px-5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Avoid Combining With</label>
            <input
              type="text"
              value={value.avoidWith.join(', ')}
              onChange={(e) => onChange({ ...value, avoidWith: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              placeholder="e.g., Folic Acid supplements"
              className="w-full bg-blue-50 py-3 px-5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Primary Benefits */}
      <div>
        <label className="block text-sm font-medium mb-2">Primary Benefits</label>
        <textarea
          value={value.primaryBenefits}
          onChange={(e) => onChange({ ...value, primaryBenefits: e.target.value })}
          placeholder="Describe the primary benefits"
          className="w-full p-3 bg-blue-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] text-sm"
        />
      </div>

      {/* Signs of Deficiency */}
      <div>
        <label className="block text-sm font-medium mb-2">Signs of Deficiency</label>
        <input
          type="text"
          value={value.signsOfDeficiency}
          onChange={(e) => onChange({ ...value, signsOfDeficiency: e.target.value })}
          placeholder="e.g., Speech delays, Poor focus"
          className="w-full bg-blue-50 py-3 px-5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Dosage Guidelines */}
      <div>
        <label className="block text-sm font-medium mb-2">Dosage Guidelines</label>
        <div className="border border-blue-100 p-5 rounded-[10px] space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Children Dosage</label>
            <input
              type="text"
              value={value.childrenDosage}
              onChange={(e) => onChange({ ...value, childrenDosage: e.target.value })}
              placeholder="e.g., 400-800 mcg daily"
              className="w-full py-2.5 px-5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Adult Dosage</label>
            <input
              type="text"
              value={value.adultDosage}
              onChange={(e) => onChange({ ...value, adultDosage: e.target.value })}
              placeholder="e.g., 800-1500 mcg daily"
              className="w-full py-2.5 px-5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Side Effects */}
      <div>
        <label className="block text-sm font-medium mb-2">Precautions & Side Effects</label>
        <input
          type="text"
          value={value.sideEffects}
          onChange={(e) => onChange({ ...value, sideEffects: e.target.value })}
          placeholder="Enter side effects"
          className="w-full py-2.5 px-5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-sm"
        />
      </div>

    </div>
  );
};

export default SuplimentsDetailsTab;




// import React, { useState } from 'react';
// import { X, Upload, Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Link } from 'lucide-react';

// interface Tag {
//   id: string;
//   label: string;
// }

// export interface SupplementDetails {
//   image: string | null;
//   worksWith: string[];
//   avoidWith: string[];
//   primaryBenefits: string;
//   childrenDosage: string;
//   adultDosage: string;
//   sideEffects: string;
//   signsOfDeficiency : string
// }

// type Props = {
//   value: SupplementDetails;
//   onChange: (val: SupplementDetails) => void;
// };

// // Move components outside to prevent recreation on every render
// const TagBadge: React.FC<{ tag: Tag; onRemove: () => void }> = ({ tag, onRemove }) => (
//   <span className="inline-flex items-center gap-1 border border-[#8E96A4] px-3 py-1.5 rounded-md text-sm">
//     {tag.label}
//     <button onClick={onRemove} className="hover:bg-blue-200 text-red-500 rounded-full p-0.5">
//       <X size={14} />
//     </button>
//   </span>
// );

// const TextEditor: React.FC<{ value: string; onChange: (val: string) => void; placeholder: string }> = ({ value, onChange, placeholder }) => (
//   <div>
//     <div className="flex gap-1 mb-2 pb-2 bg-[#F9FAFB] rounded-md border border-[#F9FAFB] p-2.5">
//       <button className="p-1.5 hover:bg-gray-100 rounded"><Bold size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><Italic size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><Underline size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><List size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><AlignLeft size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><AlignCenter size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><AlignRight size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><Link size={16} /></button>
//     </div>
//     <textarea
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
//     />
//   </div>
// );

// const SuplimentsDetailsTab: React.FC<Props> = ({ value, onChange }) => {
//   const [fileName, setFileName] = useState<string>('');
//   const [worksWith, setWorksWith] = useState<Tag[]>(() => 
//     value.worksWith.map((label, index) => ({ id: index.toString(), label }))
//   );
//   const [avoidWith, setAvoidWith] = useState<Tag[]>(() => 
//     value.avoidWith.map((label, index) => ({ id: index.toString(), label }))
//   );

//   const [worksWithInput, setWorksWithInput] = useState<string>('');
//   const [avoidWithInput, setAvoidWithInput] = useState<string>('');

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFileName(file.name);
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         onChange({
//           ...value,
//           image: event.target?.result as string
//         });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const addTag = (tagValue: string, setter: React.Dispatch<React.SetStateAction<Tag[]>>, inputSetter: React.Dispatch<React.SetStateAction<string>>, field: 'worksWith' | 'avoidWith') => {
//     if (tagValue.trim()) {
//       const newTag: Tag = {
//         id: Date.now().toString(),
//         label: tagValue.trim()
//       };
//       setter(prev => {
//         const updated = [...prev, newTag];
//         onChange({
//           ...value,
//           [field]: updated.map(t => t.label)
//         });
//         return updated;
//       });
//       inputSetter('');
//     }
//   };

//   const removeTag = (id: string, setter: React.Dispatch<React.SetStateAction<Tag[]>>, field: 'worksWith' | 'avoidWith') => {
//     setter(prev => {
//       const updated = prev.filter(tag => tag.id !== id);
//       onChange({
//         ...value,
//         [field]: updated.map(t => t.label)
//       });
//       return updated;
//     });
//   };

//   return (
//     <div className="e">
//       <div className="space-y-6">
//         {/* Image Upload */}
//         <div className="border-2 border-dashed border-gray-300 rounded-lg px-19 py-12 text-center">
//           <input
//             type="file"
//             id="image-upload"
//             className="hidden"
//             accept="image/*"
//             onChange={handleImageUpload}
//           />
//           <label htmlFor="image-upload" className="cursor-pointer">
//             {value.image ? (
//               <div className="space-y-2">
//                 <img src={value.image} alt="Uploaded" className="mx-auto max-h-32 rounded" />
//                 <p className="text-sm text-gray-600">{fileName}</p>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 <Upload className="mx-auto  text-black bg-[#DBEAFE] p-3 rounded-md" size={48} />
//                 <p className="font-medium text-sm md:text-base leading-6 text-textColor">Upload Supplement Image</p>
//                 <p className="text-sm font-normal text-gray-500 font-inter">Supported formats: png,Jpge  (Max 10MB)</p>
//               </div>
//             )}
//           </label>
//         </div>

//         {/* Synergy Notes */}
//         <div>
//           <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Synergy Notes</label>
//           <div className='border border-blue-100 p-5 rounded-[10px]'>
//             {/* Works Well With */}
//             <div className='mb-5.5'>
//               <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Works Well With</label>
//               <div className=" space-y-2">
//                 <input
//                   type="text"
//                   value={worksWithInput}
//                   onChange={(e) => setWorksWithInput(e.target.value)}
//                   onKeyPress={(e) => {
//                     if (e.key === 'Enter') {
//                       e.preventDefault();
//                       addTag(worksWithInput, setWorksWith, setWorksWithInput, 'worksWith');
//                     }
//                   }}
//                   placeholder="Add compatible supplements"
//                   className="w-full bg-blue-50 py-3  px-5  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
//                 />
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   <TagBadge tag={{ id: '1', label: 'Methylcobalamin (B12)' }} onRemove={() => {}} />
//                   <TagBadge tag={{ id: '2', label: 'P5P (B6)' }} onRemove={() => {}} />
//                   {worksWith.map(tag => (
//                     <TagBadge key={tag.id} tag={tag} onRemove={() => removeTag(tag.id, setWorksWith, 'worksWith')} />
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Avoid Combining With */}
//             <div>
//               <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Avoid Combining With</label>
//               <div className=" space-y-2">
//                 <input
//                   type="text"
//                   value={avoidWithInput}
//                   onChange={(e) => setAvoidWithInput(e.target.value)}
//                   onKeyPress={(e) => {
//                     if (e.key === 'Enter') {
//                       e.preventDefault();
//                       addTag(avoidWithInput, setAvoidWith, setAvoidWithInput, 'avoidWith');
//                     }
//                   }}
//                   placeholder="Add supplements to avoid"
//                   className="w-full  bg-blue-50 py-3  px-5  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <div className="flex flex-wrap gap-2">
//                   <TagBadge tag={{ id: '1', label: 'Folic Acid supplements' }} onRemove={() => {}} />
//                   {avoidWith.map(tag => (
//                     <TagBadge key={tag.id} tag={tag} onRemove={() => removeTag(tag.id, setAvoidWith, 'avoidWith')} />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Primary Benefits */}
//         <div>
//           <div className="flex justify-between items-center mb-2">
//             <label className="block text-sm font-medium">Primary Benefits</label>
//             <button className="text-sm font-inter text-[#0A0A0A] flex items-center gap-2 hover:text-gray-700">
//               <span className=""> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//   <path d="M10.6665 12L14.6665 8L10.6665 4" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
//   <path d="M5.3335 4L1.3335 8L5.3335 12" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
// </svg></span> Plain Text
//             </button>
//           </div>
//           <TextEditor
//             value={value.primaryBenefits}
//             onChange={(newVal) => onChange({ ...value, primaryBenefits: newVal })}
//             placeholder="Describe the tools that may mitigate this deficiency"
//           />
//         </div>

//         {/* Signs of Deficiency */}
//         <div>
//           <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Signs of Deficiency</label>
//           <div className=" space-y-2">
//             <input
//               type="text"
//               placeholder="Enter the behaviors (like e.g., 'Toe Walking')"
//               className="w-full  bg-blue-50 py-3  px-5  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <div className="flex flex-wrap gap-2">
//               <TagBadge tag={{ id: '1', label: 'Speech delays' }} onRemove={() => {}} />
//               <TagBadge tag={{ id: '2', label: 'Poor focus' }} onRemove={() => {}} />
//             </div>
//           </div>
//         </div>

//         {/* Dosage Guidelines */}
//         <div className='mb-11'>
//           <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Dosage Guidelines</label>
//           <div className=" border border-blue-100 p-5 rounded-[10px] space-y-3">
//             <div>
//               <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left"> Children Dosage</label>
//               <input
//                 type="text"
//                 value={value.childrenDosage}
//                 onChange={(e) => onChange({ ...value, childrenDosage: e.target.value })}
//                 placeholder="e.g., 400-800 mcg daily"
//                 className="w-full py-2.5 px-5  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//               />
//             </div>
//             <div>
//               <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Adult Dosage</label>
//               <input
//                 type="text"
//                 value={value.adultDosage}
//                 onChange={(e) => onChange({ ...value, adultDosage: e.target.value })}
//                 placeholder="e.g., 800-1500 mcg daily"
//                 className="w-full py-2.5 px-5  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Precautions & Side Effects */}
//         <div className=''>
//           <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Precautions & Side Effects</label>
//           <input
//             type="text"
//             value={value.sideEffects}
//             onChange={(e) => onChange({ ...value, sideEffects: e.target.value })}
//             placeholder="Enter side effect"
//             className="w-full py-2.5 px-5  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SuplimentsDetailsTab; 




// import React, { useState } from 'react';
// import { X, Upload, Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Link } from 'lucide-react';

// interface Tag {
//   id: string;
//   label: string;
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

// // type Props = {
// //   value: SupplementDetails;
// //   onChange: (val: SupplementDetails) => void;
// // };

// const TagBadge: React.FC<{ tag: Tag; onRemove: () => void }> = ({ tag, onRemove }) => (
//   <span className="inline-flex items-center gap-1 border border-[#8E96A4] px-3 py-1.5 rounded-md text-sm">
//     {tag.label}
//     <button onClick={onRemove} className="hover:bg-blue-200 text-red-500 rounded-full p-0.5">
//       <X size={14} />
//     </button>
//   </span>
// );

// const TextEditor: React.FC<{ value: string; onChange: (val: string) => void; placeholder: string }> = ({ value, onChange, placeholder }) => (
//   <div>
//     <div className="flex gap-1 mb-2 pb-2 bg-[#F9FAFB] rounded-md border border-[#F9FAFB] p-2.5">
//       <button className="p-1.5 hover:bg-gray-100 rounded"><Bold size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><Italic size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><Underline size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><List size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><AlignLeft size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><AlignCenter size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><AlignRight size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><Link size={16} /></button>
//     </div>
//     <textarea
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
//     />
//   </div>
// );

// const SuplimentsDetailsTab: React.FC = () => {
//   const [uploadedImage, setUploadedImage] = useState<string | null>(null);
//   const [fileName, setFileName] = useState<string>('');
//   const [worksWith, setWorksWith] = useState<Tag[]>([]);
//   const [avoidWith, setAvoidWith] = useState<Tag[]>([]);
//   const [primaryBenefits, setPrimaryBenefits] = useState<string>('');
//   const [childrenDosage, setChildrenDosage] = useState<string>('');
//   const [adultDosage, setAdultDosage] = useState<string>('');
//   const [sideEffects, setSideEffects] = useState<string>('');
//   const [worksWithInput, setWorksWithInput] = useState<string>('');
//   const [avoidWithInput, setAvoidWithInput] = useState<string>('');

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFileName(file.name);
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setUploadedImage(event.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const addTag = (value: string, setter: React.Dispatch<React.SetStateAction<Tag[]>>, inputSetter: React.Dispatch<React.SetStateAction<string>>) => {
//     if (value.trim()) {
//       const newTag: Tag = {
//         id: Date.now().toString(),
//         label: value.trim()
//       };
//       setter(prev => [...prev, newTag]);
//       inputSetter('');
//     }
//   };

//   const removeTag = (id: string, setter: React.Dispatch<React.SetStateAction<Tag[]>>) => {
//     setter(prev => prev.filter(tag => tag.id !== id));
//   };

//   return (
//     <div className="e">
//       <div className="space-y-6">
//         <div className="border-2 border-dashed border-gray-300 rounded-lg px-19 py-12 text-center">
//           <input
//             type="file"
//             id="image-upload"
//             className="hidden"
//             accept="image/*"
//             onChange={handleImageUpload}
//           />
//           <label htmlFor="image-upload" className="cursor-pointer">
//             {uploadedImage ? (
//               <div className="space-y-2">
//                 <img src={uploadedImage} alt="Uploaded" className="mx-auto max-h-32 rounded" />
//                 <p className="text-sm text-gray-600">{fileName}</p>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 <Upload className="mx-auto  text-black bg-[#DBEAFE] p-3 rounded-md" size={48} />
//                 <p className="font-medium text-sm md:text-base leading-6 text-textColor">Upload Supplement Image</p>
//                 <p className="text-sm font-normal text-gray-500 font-inter">Supported formats: png,Jpge  (Max 10MB)</p>
//               </div>
//             )}
//           </label>
//         </div>

//         <div>
//           <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Synergy Notes</label>
//           <div className='border border-blue-100 p-5 rounded-[10px]'>
//             <div className='mb-5.5'>
//               <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Works Well With</label>
//               <div className=" space-y-2">
//                 <input
//                   type="text"
//                   value={worksWithInput}
//                   onChange={(e) => setWorksWithInput(e.target.value)}
//                   onKeyPress={(e) => {
//                     if (e.key === 'Enter') {
//                       e.preventDefault();
//                       addTag(worksWithInput, setWorksWith, setWorksWithInput);
//                     }
//                   }}
//                   placeholder="Add compatible supplements"
//                   className="w-full bg-blue-50 py-3  px-5  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
//                 />
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   <TagBadge tag={{ id: '1', label: 'Methylcobalamin (B12)' }} onRemove={() => {}} />
//                   <TagBadge tag={{ id: '2', label: 'P5P (B6)' }} onRemove={() => {}} />
//                   {worksWith.map(tag => (
//                     <TagBadge key={tag.id} tag={tag} onRemove={() => removeTag(tag.id, setWorksWith)} />
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Avoid Combining With</label>
//               <div className=" space-y-2">
//                 <input
//                   type="text"
//                   value={avoidWithInput}
//                   onChange={(e) => setAvoidWithInput(e.target.value)}
//                   onKeyPress={(e) => {
//                     if (e.key === 'Enter') {
//                       e.preventDefault();
//                       addTag(avoidWithInput, setAvoidWith, setAvoidWithInput);
//                     }
//                   }}
//                   placeholder="Add supplements to avoid"
//                   className="w-full  bg-blue-50 py-3  px-5  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <div className="flex flex-wrap gap-2">
//                   <TagBadge tag={{ id: '1', label: 'Folic Acid supplements' }} onRemove={() => {}} />
//                   {avoidWith.map(tag => (
//                     <TagBadge key={tag.id} tag={tag} onRemove={() => removeTag(tag.id, setAvoidWith)} />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div>
//           <div className="flex justify-between items-center mb-2">
//             <label className="block text-sm font-medium">Primary Benefits</label>
//             <button className="text-sm font-inter text-[#0A0A0A] flex items-center gap-2 hover:text-gray-700">
//               <span className=""> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//   <path d="M10.6665 12L14.6665 8L10.6665 4" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
//   <path d="M5.3335 4L1.3335 8L5.3335 12" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
// </svg></span> Plain Text
//             </button>
//           </div>
//           <TextEditor
//             value={primaryBenefits}
//             onChange={setPrimaryBenefits}
//             placeholder="Describe the tools that may mitigate this deficiency"
//           />
//         </div>

//         <div>
//           <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Signs of Deficiency</label>
//           <div className=" space-y-2">
//             <input
//               type="text"
//               placeholder="Enter the behaviors (like e.g., 'Toe Walking')"
//               className="w-full  bg-blue-50 py-3  px-5  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <div className="flex flex-wrap gap-2">
//               <TagBadge tag={{ id: '1', label: 'Speech delays' }} onRemove={() => {}} />
//               <TagBadge tag={{ id: '2', label: 'Poor focus' }} onRemove={() => {}} />
//             </div>
//           </div>
//         </div>

//         <div className='mb-11'>
//           <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Dosage Guidelines</label>
//           <div className=" border border-blue-100 p-5 rounded-[10px] space-y-3">
//             <div>
//               <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left"> Children Dosage</label>
//               <input
//                 type="text"
//                 value={childrenDosage}
//                 onChange={(e) => setChildrenDosage(e.target.value)}
//                 placeholder="e.g., 400-800 mcg daily"
//                 className="w-full py-2.5 px-5  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//               />
//             </div>
//             <div>
//               <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Adult Dosage</label>
//               <input
//                 type="text"
//                 value={adultDosage}
//                 onChange={(e) => setAdultDosage(e.target.value)}
//                 placeholder="e.g., 800-1500 mcg daily"
//                 className="w-full py-2.5 px-5  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//               />
//             </div>
//           </div>
//         </div>

//         <div className=''>
//           <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Precautions & Side Effects</label>
//           <input
//             type="text"
//             value={sideEffects}
//             onChange={(e) => setSideEffects(e.target.value)}
//             placeholder="Enter side effect"
//             className="w-full py-2.5 px-5  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SuplimentsDetailsTab;







// import React, { useState } from 'react';
// import { X, Upload, Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Link } from 'lucide-react';

// interface Tag {
//   id: string;
//   label: string;
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

// type Props = {
//   value: SupplementDetails;
//   onChange: (val: SupplementDetails) => void;
// };



// // Move components outside to prevent recreation on every render
// const TagBadge: React.FC<{ tag: Tag; onRemove: () => void }> = ({ tag, onRemove }) => (
//   <span className="inline-flex items-center gap-1 border border-[#8E96A4] px-3 py-1.5 rounded-md text-sm">
//     {tag.label}
//     <button onClick={onRemove} className="hover:bg-blue-200 text-red-500 rounded-full p-0.5">
//       <X size={14} />
//     </button>
//   </span>
// );

// const TextEditor: React.FC<{ value: string; onChange: (val: string) => void; placeholder: string }> = ({ value, onChange, placeholder }) => (
//   <div>
//     <div className="flex gap-1 mb-2 pb-2 bg-[#F9FAFB] rounded-md border border-[#F9FAFB] p-2.5">
//       <button className="p-1.5 hover:bg-gray-100 rounded"><Bold size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><Italic size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><Underline size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><List size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><AlignLeft size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><AlignCenter size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><AlignRight size={16} /></button>
//       <button className="p-1.5 hover:bg-gray-100 rounded"><Link size={16} /></button>
//     </div>
//     <textarea
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
//     />
//   </div>
// );

// const SuplimentsDetailsTab: React.FC = () => {
//   const [uploadedImage, setUploadedImage] = useState<string | null>(null);
//   const [fileName, setFileName] = useState<string>('');
//   const [worksWith, setWorksWith] = useState<Tag[]>([]);
//   const [avoidWith, setAvoidWith] = useState<Tag[]>([]);
//   // const [synergyNotes, setSynergyNotes] = useState<string>('');
//   const [primaryBenefits, setPrimaryBenefits] = useState<string>('');
//   // const [deficiencySigns, setDeficiencySigns] = useState<string>('');
//   // const [dosageGuidelines, setDosageGuidelines] = useState<Tag[]>([]);
//   const [childrenDosage, setChildrenDosage] = useState<string>('');
//   const [adultDosage, setAdultDosage] = useState<string>('');
//   const [sideEffects, setSideEffects] = useState<string>('');

//   const [worksWithInput, setWorksWithInput] = useState<string>('');
//   const [avoidWithInput, setAvoidWithInput] = useState<string>('');
//   // const [dosageInput, setDosageInput] = useState<string>('');

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFileName(file.name);
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setUploadedImage(event.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const addTag = (value: string, setter: React.Dispatch<React.SetStateAction<Tag[]>>, inputSetter: React.Dispatch<React.SetStateAction<string>>) => {
//     if (value.trim()) {
//       const newTag: Tag = {
//         id: Date.now().toString(),
//         label: value.trim()
//       };
//       setter(prev => [...prev, newTag]);
//       inputSetter('');
//     }
//   };

//   const removeTag = (id: string, setter: React.Dispatch<React.SetStateAction<Tag[]>>) => {
//     setter(prev => prev.filter(tag => tag.id !== id));
//   };

//   // const handleSubmit = () => {
//   //   const formData = {
//   //     image: uploadedImage,
//   //     fileName,
//   //     synergyNotes,
//   //     worksWith: worksWith.map(t => t.label),
//   //     avoidWith: avoidWith.map(t => t.label),
//   //     primaryBenefits,
//   //     deficiencySigns,
//   //     dosageGuidelines: dosageGuidelines.map(t => t.label),
//   //     childrenDosage,
//   //     adultDosage,
//   //     sideEffects
//   //   };
//   //   console.log('Form submitted:', formData);
//   //   alert('Supplement published successfully!');
//   // };

//   return (
//     <div className="e">
//       <div className="space-y-6">
//         {/* Image Upload */}
//         <div className="border-2 border-dashed border-gray-300 rounded-lg px-19 py-12 text-center">
//           <input
//             type="file"
//             id="image-upload"
//             className="hidden"
//             accept="image/*"
//             onChange={handleImageUpload}
//           />
//           <label htmlFor="image-upload" className="cursor-pointer">
//             {uploadedImage ? (
//               <div className="space-y-2">
//                 <img src={uploadedImage} alt="Uploaded" className="mx-auto max-h-32 rounded" />
//                 <p className="text-sm text-gray-600">{fileName}</p>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 <Upload className="mx-auto  text-black bg-[#DBEAFE] p-3 rounded-md" size={48} />
//                 <p className="font-medium text-sm md:text-base leading-6 text-textColor">Upload Supplement Image</p>
//                 <p className="text-sm font-normal text-gray-500 font-inter">Supported formats: png,Jpge  (Max 10MB)</p>
//               </div>
//             )}
//           </label>
//         </div>

//         {/* Synergy Notes */}
//         <div>
//           <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Synergy Notes</label>
//           <div className='border border-blue-100 p-5 rounded-[10px]'>
//   {/* Works Well With */}
//         <div className='mb-5.5'>
//           <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Works Well With</label>
//           <div className=" space-y-2">
//             <input
//               type="text"
//               value={worksWithInput}
//               onChange={(e) => setWorksWithInput(e.target.value)}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter') {
//                   e.preventDefault();
//                   addTag(worksWithInput, setWorksWith, setWorksWithInput);
//                 }
//               }}
//               placeholder="Add compatible supplements"
//               className="w-full bg-blue-50 py-3  px-5  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
//             />
//             <div className="flex flex-wrap gap-2 mt-2">
//               <TagBadge tag={{ id: '1', label: 'Methylcobalamin (B12)' }} onRemove={() => {}} />
//               <TagBadge tag={{ id: '2', label: 'P5P (B6)' }} onRemove={() => {}} />
//               {worksWith.map(tag => (
//                 <TagBadge key={tag.id} tag={tag} onRemove={() => removeTag(tag.id, setWorksWith)} />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Avoid Combining With */}
//         <div>
//           <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Avoid Combining With</label>
//           <div className=" space-y-2">
//             <input
//               type="text"
//               value={avoidWithInput}
//               onChange={(e) => setAvoidWithInput(e.target.value)}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter') {
//                   e.preventDefault();
//                   addTag(avoidWithInput, setAvoidWith, setAvoidWithInput);
//                 }
//               }}
//               placeholder="Add supplements to avoid"
//               className="w-full  bg-blue-50 py-3  px-5  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <div className="flex flex-wrap gap-2">
//               <TagBadge tag={{ id: '1', label: 'Folic Acid supplements' }} onRemove={() => {}} />
//               {avoidWith.map(tag => (
//                 <TagBadge key={tag.id} tag={tag} onRemove={() => removeTag(tag.id, setAvoidWith)} />
//               ))}
//             </div>
//           </div>
//         </div>
//           </div>
       
//         </div>

      

//         {/* Primary Benefits */}
//         <div>
//           <div className="flex justify-between items-center mb-2">
//             <label className="block text-sm font-medium">Primary Benefits</label>
//             <button className="text-sm font-inter text-[#0A0A0A] flex items-center gap-2 hover:text-gray-700">
//               <span className=""> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//   <path d="M10.6665 12L14.6665 8L10.6665 4" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
//   <path d="M5.3335 4L1.3335 8L5.3335 12" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
// </svg></span> Plain Text
//             </button>
//           </div>
//           <TextEditor
//             value={primaryBenefits}
//             onChange={setPrimaryBenefits}
//             placeholder="Describe the tools that may mitigate this deficiency"
//           />
//         </div>

//         {/* Signs of Deficiency */}
//         <div>
//           <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Signs of Deficiency</label>
//           <div className=" space-y-2">
//             <input
//               type="text"
//               placeholder="Enter the behaviors (like e.g., 'Toe Walking')"
//               className="w-full  bg-blue-50 py-3  px-5  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <div className="flex flex-wrap gap-2">
//               <TagBadge tag={{ id: '1', label: 'Speech delays' }} onRemove={() => {}} />
//               <TagBadge tag={{ id: '2', label: 'Poor focus' }} onRemove={() => {}} />
//             </div>
//           </div>
//         </div>

//         {/* Dosage Guidelines */}
//         <div className='mb-11'>
//           <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Dosage Guidelines</label>
//           <div className=" border border-blue-100 p-5 rounded-[10px] space-y-3">
//             <div>
//               <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left"> Children Dosage</label>
//               <input
//                 type="text"
//                 value={childrenDosage}
//                 onChange={(e) => setChildrenDosage(e.target.value)}
//                 placeholder="e.g., 400-800 mcg daily"
//                 className="w-full py-2.5 px-5  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//               />
//             </div>
//             <div>
//               <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Adult Dosage</label>
//               <input
//                 type="text"
//                 value={adultDosage}
//                 onChange={(e) => setAdultDosage(e.target.value)}
//                 placeholder="e.g., 800-1500 mcg daily"
//                 className="w-full py-2.5 px-5  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Precautions & Side Effects */}
//         <div className=''>
//           <label className="block text-sm md:text-base leading-6 font-inter  font-medium mb-2 text-left">Precautions & Side Effects</label>
//           <input
//             type="text"
//             value={sideEffects}
//             onChange={(e) => setSideEffects(e.target.value)}
//             placeholder="Enter side effect"
//             className="w-full py-2.5 px-5  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//           />
//         </div>

       
//       </div>
//     </div>
//   );
// };

// export default SuplimentsDetailsTab;