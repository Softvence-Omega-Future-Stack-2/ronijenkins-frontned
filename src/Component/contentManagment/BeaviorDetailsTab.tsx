import React, { useState, Fragment } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { X, ChevronDown, Plus, User, FileText, Bold, Italic, Underline, Heading1, Heading2, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link2, ImageIcon } from 'lucide-react';


interface AddBehaviourModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const AddBehaviourModal: React.FC<AddBehaviourModalProps> = ({ isOpen, closeModal }) => {
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>([]);

  const protocols = [
    "Gut Healing Protocol",
    "Methylation Support",
    "Immune Support Protocol",
    "Heavy Metal Detox",
    "Parasite Cleanse",
    "Neurological Support"
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-8 shadow-2xl">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Dialog.Title className="text-2xl font-bold text-slate-800">Add New Behaviour</Dialog.Title>
                  <p className="text-slate-400 text-sm mt-1">Set up behaviour parameters</p>
                </div>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex bg-indigo-50/50 p-1.5 rounded-2xl my-6">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-slate-600">
                  <User size={18} /> Basic Information
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-xl shadow-sm">
                  <FileText size={18} /> Details
                </button>
              </div>

              <div className="space-y-6">
                {/* Root Causes */}
                <section>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Possible Root Causes</label>
                  <input 
                    type="text" 
                    placeholder="Enter the behaviour title (e.g., Toe Walking)" 
                    className="w-full bg-indigo-50/50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-200"
                  />
                  <div className="flex gap-2 mt-3">
                    {['Low muscle tone', 'Sensory processing issues'].map(tag => (
                      <span key={tag} className="flex items-center gap-2 px-3 py-1 border border-slate-200 rounded-lg text-xs text-slate-500">
                        {tag} <X size={14} className="cursor-pointer" />
                      </span>
                    ))}
                  </div>
                </section>

                {/* Suggested Protocols Dropdown */}
                <section>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Suggested Protocols</label>
                  <Listbox value={selectedProtocols} onChange={setSelectedProtocols} multiple>
                    <div className="relative">
                      <Listbox.Button className="relative w-full text-left bg-indigo-50/50 rounded-xl p-3 text-sm flex justify-between items-center">
                        <span className="text-slate-400">
                          {selectedProtocols.length > 0 ? selectedProtocols.join(', ') : "Select Protocols"}
                        </span>
                        <ChevronDown size={20} className="text-slate-400" />
                      </Listbox.Button>
                      <Listbox.Options className="absolute mt-1 w-full bg-white border border-slate-100 rounded-xl shadow-lg z-10 py-1 max-h-48 overflow-auto">
                        {protocols.map((protocol) => (
                          <Listbox.Option
                            key={protocol}
                            value={protocol}
                            className={({ active, selected }) =>
                              `px-4 py-2 text-sm cursor-pointer ${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'} ${selected ? 'font-bold' : ''}`
                            }
                          >
                            {protocol}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </section>

                {/* Recommended Labs */}
                <section>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-700">Recommended labs</label>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 cursor-pointer">
                      {"<>"} Plain Text
                    </span>
                  </div>
                  <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-4 p-2 border-b border-slate-50 text-slate-400 bg-white">
                      <Bold size={16} /><Italic size={16} /><Underline size={16} />
                      <div className="w-px h-4 bg-slate-200" />
                      <Heading1 size={16} /><Heading2 size={16} />
                      <div className="w-px h-4 bg-slate-200" />
                      <List size={16} /><ListOrdered size={16} />
                      <div className="w-px h-4 bg-slate-200" />
                      <AlignLeft size={16} /><AlignCenter size={16} /><AlignRight size={16} />
                      <div className="w-px h-4 bg-slate-200" />
                      <Link2 size={16} />
                    </div>
                    <textarea 
                      placeholder="Describe the factors that may influence this behaviour"
                      className="w-full bg-indigo-50/30 border-none p-4 text-sm h-32 resize-none focus:ring-0"
                    />
                  </div>
                </section>

                {/* Supplements Section */}
                <section>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-700">Supplements to Consider</label>
                    <button className="text-indigo-500 bg-indigo-50 rounded-lg p-1"><Plus size={16} /></button>
                  </div>
                  <div className="flex gap-4">
                    <input type="text" placeholder="Supplements name" className="flex-1 bg-indigo-50/50 border-none rounded-xl p-3 text-sm" />
                    <button className="flex-1 bg-indigo-50/50 rounded-xl p-3 text-sm text-slate-400 flex items-center justify-between">
                      <span className="flex items-center gap-2"><ImageIcon  size={18} /> Upload photo</span>
                      <Plus size={18} />
                    </button>
                  </div>
                </section>

                {/* Dietary Recommendations */}
                <section>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Dietary Recommendations</label>
                  <div className="p-4 border border-indigo-50 rounded-2xl space-y-4">
                    <div className="space-y-2">
                      <input type="text" placeholder="Add Food guidance for support" className="w-full bg-indigo-50/50 border-none rounded-xl p-3 text-sm" />
                      <div className="flex gap-2">
                        {['Fermented foods', 'Bone broth'].map(tag => (
                          <span key={tag} className="flex items-center gap-2 px-3 py-1 border border-slate-200 rounded-lg text-xs text-slate-500">
                            {tag} <X size={14} />
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <input type="text" placeholder="Remove Food guidance for support" className="w-full bg-indigo-50/50 border-none rounded-xl p-3 text-sm" />
                      <div className="flex gap-2">
                        {['Gluten', 'Sugar', 'Dairy'].map(tag => (
                          <span key={tag} className="flex items-center gap-2 px-3 py-1 border border-slate-200 rounded-lg text-xs text-slate-500">
                            {tag} <X size={14} />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-4 mt-8">
                <button className="flex-1 bg-indigo-500 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors">
                  Publish Behaviour
                </button>
                <button onClick={closeModal} className="px-8 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
              </div>

            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddBehaviourModal;
