import React, { useState } from 'react';
import AddPlanModal from './AddPlanModal';
import { useGetSubscriptionPlansQuery, useCreateSubscriptionPlanMutation, useUpdateSubscriptionPlanMutation, useRemoveSubscriptionPlanMutation } from '../../redux/features/admin/subsciptionApi';
import { toast } from 'react-toastify';
import { Trash2 } from 'lucide-react';

export interface Plan {
  id?: string; // যদি id থাকে
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
}

const ManagePlan: React.FC = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">("MONTHLY");

  // API Calls
  const { data: rawResponse, isLoading, isError , refetch  } = useGetSubscriptionPlansQuery({ page: 1, limit: 100 });
  const [createPlan] = useCreateSubscriptionPlanMutation();
  const [updatePlan] = useUpdateSubscriptionPlanMutation();
  const [confirmDeletePlan, setConfirmDeletePlan] = useState<any | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [removePlan, { isLoading: isDeleting }] = useRemoveSubscriptionPlanMutation();


  const allPlans = rawResponse?.data || [];

  // ✅ প্ল্যানগুলোকে নাম অনুযায়ী গ্রুপ করার লজিক
  const groupedPlans = allPlans.reduce((acc: any, current: any) => {
    const name = current.name;
    if (!acc[name]) {
      acc[name] = {
        name: current.name,
        description: current.description,
        features: current.features,
        id: current.id,
        monthly: null,
        yearly: null,
        free: null
      };
    }
    if (current.plan === "MONTHLY") acc[name].monthly = current;
    else if (current.plan === "YEARLY") acc[name].yearly = current;
    else if (current.plan === "FREE") acc[name].free = current;
    return acc;
  }, {});

  const planList = Object.values(groupedPlans);

const handleSavePlan = async (data: Omit<Plan, "id">) => {
  try {
    if (editingPlan) {
      // Edit backend
      await updatePlan({ id: editingPlan.id, ...data }).unwrap();
      toast.success("Plan updated successfully!");
    } else {
      // Create backend
      await createPlan(data).unwrap();
      toast.success("Plan added successfully!");
    }
    setIsAddOpen(false);
  } catch (err) {
    console.error(err);
    toast.error("Failed to save plan");
  }
};

const processDelete = async () => {
  if (!confirmDeletePlan) return;
  console.log("Attempting to delete plan:", confirmDeletePlan); // 🔹 দেখাবে কোন প্ল্যান delete হচ্ছে
  try {
    const result = await removePlan(confirmDeletePlan.id).unwrap();
    console.log("Delete API result:", result); // 🔹 দেখাবে API থেকে কি response এসেছে
    setPlans(prev => prev.filter(p => p.id !== confirmDeletePlan.id));
    toast.success("Plan deleted successfully!");
    refetch(); 
  } catch (err) {
    console.error("Delete Error:", err); // 🔹 কোনো error থাকলে console এ দেখাবে
    toast.error("Failed to delete plan");
  } finally {
    setConfirmDeletePlan(null);
  }
};

  if (isLoading) return <div className="p-20 text-center font-bold">Loading Plans...</div>;

  return (
    <div className="min-h-screen bg-[#FBF9F6] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <section>
          <div className="relative flex flex-col md:flex-row items-center w-full mb-10 gap-4">
            <h2 className="text-2xl font-black text-titleColor md:absolute md:left-0 text-center">Subscription Plans</h2>

            {/* Toggle Switch */}
            <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 flex items-center gap-1 bg-white border border-borderColor rounded-full p-1 shadow-sm">
              <button
                onClick={() => setBillingCycle("MONTHLY")}
                className={`px-6 py-2 rounded-full text-sm font-black transition-all ${billingCycle === "MONTHLY" ? "bg-buttonColor text-white" : "text-[#4A3A3799]"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("YEARLY")}
                className={`px-6 py-2 rounded-full text-sm font-black transition-all ${billingCycle === "YEARLY" ? "bg-buttonColor text-white" : "text-[#4A3A3799]"}`}
              >
                Annually
              </button>
            </div>

            <div className="md:ml-auto">
              <button
                onClick={() => { setEditingPlan(null); setIsAddOpen(true); }}
                className="bg-buttonColor text-white px-6 py-2.5 rounded-[12px] font-black text-sm flex items-center gap-2"
              >
                + ADD NEW PLAN
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            {planList.map((group: any, idx: number) => {
              const activePlan = billingCycle === "MONTHLY" ? group.monthly : group.yearly;
              const displayPlan = activePlan || group.free || group.monthly || group.yearly;

              if (!displayPlan) return null;

              return (
                <div key={idx} className="bg-white border border-borderColor rounded-[32px] p-8 shadow-sm flex-1 min-w-[320px] max-w-[400px] relative transition-all hover:shadow-md">
      <div className='absolute top-6 right-6 flex gap-2'>
  <button
    onClick={() => { setEditingPlan(displayPlan); setIsAddOpen(true); }}
    className="p-2 rounded-full hover:bg-stone-50 cursor-pointer"
  >
    <EditIcon />
  </button>
  <button
   onClick={() => setConfirmDeletePlan(displayPlan)}
    className="p-2 rounded-full hover:bg-red-50 cursor-pointer"
  >
    <Trash2 size={18} />
  </button>
</div>
                  
                  <h3 className="text-xl font-black text-titleColor mb-1">{group.name}</h3>
                  <p className="text-[#4A3A3780] text-sm mb-6 min-h-[40px]">{group.description}</p>
                  
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-black text-buttonColor">${displayPlan.price}</span>
                    <span className="text-[#4A3A3780] font-medium text-sm">/{billingCycle === "MONTHLY" ? "mo" : "yr"}</span>
                  </div>

                  {billingCycle === "YEARLY" && displayPlan.plan !== "FREE" && (
                    <div className="mb-4 text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit uppercase">
                      ✦ Save with annual billing
                    </div>
                  )}

                  <div className="space-y-4 mt-8 border-t border-gray-50 pt-6">
                    {group.features?.map((f: string, i: number) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="mt-1 bg-buttonColor rounded-full p-1 flex-shrink-0"><CheckIcon /></div>
                        <span className="text-[#4A3A37B2] text-sm font-bold">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {confirmDeletePlan && (
  <div onClick={() => setConfirmDeletePlan(null)} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-3 md:p-9 rounded-lg w-80 text-center">
      <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this plan?</h3>
      <div className="flex justify-center gap-4">
        <button
          onClick={processDelete}
          disabled={isDeleting}
          className="bg-red-600 text-white px-4 py-2 rounded-md font-bold hover:bg-red-700 cursor-pointer"
        >
          {isDeleting ? "Deleting..." : "Yes, Delete"}
        </button>
        <button
        
          onClick={() => setConfirmDeletePlan(null)}
          className="bg-gray-200 px-8 py-2 rounded-md font-bold hover:bg-gray-300 cursor-pointer"
        >
          No
        </button>
      </div>
    </div>
  </div>
)}
          </div>
        </section>

        <AddPlanModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          editingPlan={editingPlan}
          onSave={handleSavePlan}
        />
      </div>
    </div>
  );
};

const CheckIcon = () => (
  <svg width="8" height="8" viewBox="0 0 10 8" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4.5L3.5 7L9 1" /></svg>
);
const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 19 19" fill="none"><path d="M13.0159 2.78906L15.805 5.5782L6.50788 14.8753H3.71875V12.0862L13.0159 2.78906Z" stroke="#926690" strokeWidth="1.5" strokeLinejoin="round"/></svg>
);

export default ManagePlan;





// import React, { useState } from 'react';
// import AddPlanModal from './AddPlanModal';


// export interface Plan {
//     id:string;
//   title: string;
//   subtitle: string;
//   price: string;
//   annualPrice: string;
//   features: string[];
// }

// const ManagePlan: React.FC = () => {
//   const [isAddOpen, setIsAddOpen] = useState(false);
//   const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
//   const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

//  const [plans, setPlans] = useState<Plan[]>([
//     {
//       id: "1",
//       title: "Core",
//       subtitle: "Essential tools for your wellness journey",
//       price: "$15",
//       annualPrice: "$144",
//       features: [
//         "Basic symptom tracking",
//         "5 Mennie™ AI chats per day",
//         "Limited education library",
//         "Community access (read-only)"
//       ]
//     },
//     {
//       id: "2",
//       title: "Complete",
//       subtitle: "Full access to everything Mennie™ offers",
//       price: "$30",
//       annualPrice: "$288",
//       features: [
//         "Unlimited Mennie™ AI companion",
//         "Full symptom tracking with visual trends & insights",
//         "Complete education library + early access to new content",
//         "Full community participation + Founding Member badge",
//         "Care advocacy tools & appointment prep guides",
//         "Price lock guarantee — keep this rate forever",
//         "Shape the future — input on our product roadmap"
//       ]
//     }
//   ]);

// const handleSave = (formData: Omit<Plan, "id">) => {
//   if (editingPlan) {
//     setPlans(prev =>
//       prev.map(plan =>
//         plan.id === editingPlan.id
//           ? { ...editingPlan, ...formData }
//           : plan
//       )
//     );
//   } else {
//     const newPlan: Plan = {
//       id: crypto.randomUUID(),
//       ...formData
//     };
//     setPlans(prev => [...prev, newPlan]);
//   }

//   setIsAddOpen(false);
//   setEditingPlan(null);
// };

//   return (
//     <div className="min-h-screen bg-[#FBF9F6] p-4 md:p-8 font-sans text-stone-800">
//       <div className="max-w-7xl mx-auto space-y-12">
        
//         {/* --- PLANS SECTION --- */}
//         <section>
// <div className="relative flex items-center w-full mb-6">

//   {/* Monthly / Annually Toggle (centered) */}
//   <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-white border border-borderColor rounded-full p-1">
//     <button
//       onClick={() => setBillingCycle("monthly")}
//       className={`px-4 py-2 rounded-full text-sm font-black transition-all duration-200 cursor-pointer ${
//         billingCycle === "monthly"
//           ? "bg-buttonColor text-white"
//           : "text-[#4A3A3799] hover:text-buttonColor"
//       }`}
//     >
//       Monthly
//     </button>
//     <button
//       onClick={() => setBillingCycle("annually")}
//       className={`px-4 py-2 rounded-full text-sm font-black transition-all duration-200 cursor-pointer ${
//         billingCycle === "annually"
//           ? "bg-buttonColor text-white"
//           : "text-[#4A3A3799] hover:text-buttonColor"
//       }`}
//     >
//       Annually
//     </button>
//   </div>

//   {/* Add Plan Button (right side) */}
//   <div className="ml-auto">
//     <button
//       onClick={() => {
//         setEditingPlan(null);   
//         setIsAddOpen(true);
//       }}
//       className="bg-buttonColor hover:bg-[#6d4d6d] text-white px-6 py-2 rounded-[12px] font-black text-sm flex items-center gap-2 transition-all"
//     >
//       <span className="text-xl">+</span> ADD NEW PLAN
//     </button>
//   </div>

// </div>

//           <div className="flex flex-wrap gap-6">
//             {plans.map((plan, idx) => (
//               <div key={idx} className="bg-white border border-stone-100 rounded-[22px] p-3 md:p-6 shadow-sm flex-1 min-w-[320px] max-w-[450px] relative">
//                 <button
//                   onClick={() => {
//                     setEditingPlan(plan);
//                     setIsAddOpen(true);
//                   }}
//                   className="absolute top-8 right-8 text-stone-300 text-buttonColor hover:text-[#845E84]"
//                 >
//                   <EditIcon />
//                 </button>
                
//                 <h3 className="text-lg font-black text-titleColor leading-6 mb-1">{plan.title}</h3>
//                 <p className="text-[#4A3A3780] font-medium leading-4 text-sm mb-6">{plan.subtitle}</p>
                
//                 <div className="flex items-baseline gap-1 mb-2">
//                   <span className="text-2xl md:text-[30px] leading-6 md:leading-10 font-black text-buttonColor">
//                     {billingCycle === "monthly" ? plan.price : plan.annualPrice}
//                   </span>
//                   <span className="text-[#4A3A3780] font-medium text-sm leading-4">
//                     /{billingCycle === "monthly" ? "month" : "year"}
//                   </span>
//                 </div>

//                 {/* Billing Badge */}
//                 <div className="mb-6">
//                   <span className={`inline-block text-xs font-black px-3 py-1 rounded-full ${
//                     billingCycle === "annually"
//                       ? "bg-[#845E8420] text-buttonColor"
//                       : "bg-stone-100 text-stone-400"
//                   }`}>
//                     {billingCycle === "annually" ? "✦ Billed Annually" : "Billed Monthly"}
//                   </span>
//                 </div>

//                 <ul className="space-y-4">
//                   {plan.features.map((feature, fIdx) => (
//                     <li key={fIdx} className="flex gap-3 items-start group">
//                       <div className="mt-1 bg-[#845E84] rounded-full p-1 flex-shrink-0">
//                         <CheckIcon />
//                       </div>
//                       <span className="text-[#4A3A37B2] text-sm font-medium leading-tight">
//                         {feature}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </section>
    
//         <AddPlanModal
//           isOpen={isAddOpen}
//           onClose={() => {
//             setIsAddOpen(false);
//             setEditingPlan(null);
//           }}
//           editingPlan={editingPlan}
//           onSave={handleSave}
//         />
    
//       </div>
//     </div>
//   );
// };

// const CheckIcon = () => (
//   <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M1 4.5L3.5 7L9 1" />
//   </svg>
// );

// const EditIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
//     <path d="M13.0159 2.78906L15.805 5.5782L6.50788 14.8753H3.71875V12.0862L13.0159 2.78906Z" stroke="#926690" strokeWidth="1.39457" strokeLinejoin="round"/>
//   </svg>
// );

// export default ManagePlan;






// import React, { useState } from 'react';
// import AddPlanModal from './AddPlanModal';


// export interface Plan {
//     id:string;
//   title: string;
//   subtitle: string;
//   price: string;
//   features: string[];
// }

// const ManagePlan: React.FC = () => {
//   const [isAddOpen, setIsAddOpen] = useState(false);
//   const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

//  const [plans, setPlans] = useState<Plan[]>([
//     {
//            id: "1",
//       title: "Founding Member",
//       subtitle: "Introductory rate — lock in your price",
//       price: "$30",
//       features: [
//         "Unlimited Mennie™ AI companion",
//         "Full symptom tracking with visual trends & insights",
//         "Complete education library + early access to new content",
//         "Full community participation + Founding Member badge",
//         "Care advocacy tools & appointment prep guides",
//         "Price lock guarantee — keep this rate forever",
//         "Shape the future — input on our product roadmap"
//       ]
//     },
//     {
//            id: "2",
//       title: "Free",
//       subtitle: "487 active users",
//       price: "$0",
//       features: [
//         "Basic symptom tracking",
//         "5 Mennie™ AI chats per day",
//         "Limited education library",
//         "Community access (read-only)"
//       ]
//     }
//   ]);

// const handleSave = (formData: Omit<Plan, "id">) => {
//   if (editingPlan) {
//     // UPDATE
//     setPlans(prev =>
//       prev.map(plan =>
//         plan.id === editingPlan.id
//           ? { ...editingPlan, ...formData }
//           : plan
//       )
//     );
//   } else {
//     // CREATE
//     const newPlan: Plan = {
//       id: crypto.randomUUID(), // 🔥 unique id
//       ...formData
//     };

//     setPlans(prev => [...prev, newPlan]);
//   }

//   setIsAddOpen(false);
//   setEditingPlan(null);
// };

//   return (
//     <div className="min-h-screen bg-[#FBF9F6] p-4 md:p-8 font-sans text-stone-800">
//       <div className="max-w-7xl mx-auto space-y-12">
        
//         {/* --- PLANS SECTION --- */}
//         <section>
//           <div className="flex justify-end mb-6">
//             <button    onClick={() => {
//               setEditingPlan(null);   
//               setIsAddOpen(true);
//             }} className="bg-buttonColor hover:bg-[#6d4d6d] text-white px-6 py-2 rounded-[12px] font-black text-sm flex items-center gap-2 transition-all">
//               <span className="text-xl">+</span> ADD NEW PLAN
//             </button>
//           </div>

//           <div className="flex flex-wrap gap-6">
//             {plans.map((plan, idx) => (
//               <div key={idx} className="bg-white border border-stone-100 rounded-[22px] p-3 md:p-6 shadow-sm flex-1 min-w-[320px] max-w-[450px] relative">
//                 <button    onClick={() => {
//                   setEditingPlan(plan);
//                   setIsAddOpen(true);
//                 }} className="absolute top-8 right-8 text-stone-300 text-buttonColor hover:text-[#845E84]">
//                   <EditIcon />
//                 </button>
                
//                 <h3 className="text-lg font-black text-titleColor leading-6 mb-1">{plan.title}</h3>
//                 <p className="text-[#4A3A3780] font-medium leading-4 text-sm mb-6">{plan.subtitle}</p>
                
//                 <div className="flex items-baseline gap-1 mb-8">
//                   <span className="text-2xl md:text-[30px] leading-6 md:leading-10 font-black text-buttonColor">{plan.price}</span>
//                   <span className="text-[#4A3A3780] font-medium text-sm leading-4 ">/month</span>
//                 </div>

//                 <ul className="space-y-4">
//                   {plan.features.map((feature, fIdx) => (
//                     <li key={fIdx} className="flex gap-3 items-start group">
//                       <div className="mt-1 bg-[#845E84] rounded-full p-1 flex-shrink-0">
//                         <CheckIcon />
//                       </div>
//                       <span className="text-[#4A3A37B2] text-sm font-medium leading-tight">
//                         {feature}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </section>
    
//      <AddPlanModal
//   isOpen={isAddOpen}
//   onClose={() => {
//     setIsAddOpen(false);
//     setEditingPlan(null);
//   }}
//   editingPlan={editingPlan}
//   onSave={handleSave}
// />
    
//       </div>
//     </div>
//   );
// };

// // Helper Components for Icons and Rows
// const CheckIcon = () => (
//   <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M1 4.5L3.5 7L9 1" />
//   </svg>
// );

// const EditIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
//   <path d="M13.0159 2.78906L15.805 5.5782L6.50788 14.8753H3.71875V12.0862L13.0159 2.78906Z" stroke="#926690" stroke-width="1.39457" stroke-linejoin="round"/>
// </svg>
// );




// export default ManagePlan;