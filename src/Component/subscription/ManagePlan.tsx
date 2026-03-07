import React, { useState } from 'react';
import AddPlanModal from './AddPlanModal';


export interface Plan {
    id:string;
  title: string;
  subtitle: string;
  price: string;
  annualPrice: string;
  features: string[];
}

const ManagePlan: React.FC = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

 const [plans, setPlans] = useState<Plan[]>([
    {
      id: "1",
      title: "Core",
      subtitle: "Essential tools for your wellness journey",
      price: "$15",
      annualPrice: "$144",
      features: [
        "Basic symptom tracking",
        "5 Mennie™ AI chats per day",
        "Limited education library",
        "Community access (read-only)"
      ]
    },
    {
      id: "2",
      title: "Complete",
      subtitle: "Full access to everything Mennie™ offers",
      price: "$30",
      annualPrice: "$288",
      features: [
        "Unlimited Mennie™ AI companion",
        "Full symptom tracking with visual trends & insights",
        "Complete education library + early access to new content",
        "Full community participation + Founding Member badge",
        "Care advocacy tools & appointment prep guides",
        "Price lock guarantee — keep this rate forever",
        "Shape the future — input on our product roadmap"
      ]
    }
  ]);

const handleSave = (formData: Omit<Plan, "id">) => {
  if (editingPlan) {
    setPlans(prev =>
      prev.map(plan =>
        plan.id === editingPlan.id
          ? { ...editingPlan, ...formData }
          : plan
      )
    );
  } else {
    const newPlan: Plan = {
      id: crypto.randomUUID(),
      ...formData
    };
    setPlans(prev => [...prev, newPlan]);
  }

  setIsAddOpen(false);
  setEditingPlan(null);
};

  return (
    <div className="min-h-screen bg-[#FBF9F6] p-4 md:p-8 font-sans text-stone-800">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* --- PLANS SECTION --- */}
        <section>
<div className="relative flex items-center w-full mb-6">

  {/* Monthly / Annually Toggle (centered) */}
  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-white border border-borderColor rounded-full p-1">
    <button
      onClick={() => setBillingCycle("monthly")}
      className={`px-4 py-2 rounded-full text-sm font-black transition-all duration-200 cursor-pointer ${
        billingCycle === "monthly"
          ? "bg-buttonColor text-white"
          : "text-[#4A3A3799] hover:text-buttonColor"
      }`}
    >
      Monthly
    </button>
    <button
      onClick={() => setBillingCycle("annually")}
      className={`px-4 py-2 rounded-full text-sm font-black transition-all duration-200 cursor-pointer ${
        billingCycle === "annually"
          ? "bg-buttonColor text-white"
          : "text-[#4A3A3799] hover:text-buttonColor"
      }`}
    >
      Annually
    </button>
  </div>

  {/* Add Plan Button (right side) */}
  <div className="ml-auto">
    <button
      onClick={() => {
        setEditingPlan(null);   
        setIsAddOpen(true);
      }}
      className="bg-buttonColor hover:bg-[#6d4d6d] text-white px-6 py-2 rounded-[12px] font-black text-sm flex items-center gap-2 transition-all"
    >
      <span className="text-xl">+</span> ADD NEW PLAN
    </button>
  </div>

</div>

          <div className="flex flex-wrap gap-6">
            {plans.map((plan, idx) => (
              <div key={idx} className="bg-white border border-stone-100 rounded-[22px] p-3 md:p-6 shadow-sm flex-1 min-w-[320px] max-w-[450px] relative">
                <button
                  onClick={() => {
                    setEditingPlan(plan);
                    setIsAddOpen(true);
                  }}
                  className="absolute top-8 right-8 text-stone-300 text-buttonColor hover:text-[#845E84]"
                >
                  <EditIcon />
                </button>
                
                <h3 className="text-lg font-black text-titleColor leading-6 mb-1">{plan.title}</h3>
                <p className="text-[#4A3A3780] font-medium leading-4 text-sm mb-6">{plan.subtitle}</p>
                
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl md:text-[30px] leading-6 md:leading-10 font-black text-buttonColor">
                    {billingCycle === "monthly" ? plan.price : plan.annualPrice}
                  </span>
                  <span className="text-[#4A3A3780] font-medium text-sm leading-4">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>

                {/* Billing Badge */}
                <div className="mb-6">
                  <span className={`inline-block text-xs font-black px-3 py-1 rounded-full ${
                    billingCycle === "annually"
                      ? "bg-[#845E8420] text-buttonColor"
                      : "bg-stone-100 text-stone-400"
                  }`}>
                    {billingCycle === "annually" ? "✦ Billed Annually" : "Billed Monthly"}
                  </span>
                </div>

                <ul className="space-y-4">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex gap-3 items-start group">
                      <div className="mt-1 bg-[#845E84] rounded-full p-1 flex-shrink-0">
                        <CheckIcon />
                      </div>
                      <span className="text-[#4A3A37B2] text-sm font-medium leading-tight">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
    
        <AddPlanModal
          isOpen={isAddOpen}
          onClose={() => {
            setIsAddOpen(false);
            setEditingPlan(null);
          }}
          editingPlan={editingPlan}
          onSave={handleSave}
        />
    
      </div>
    </div>
  );
};

const CheckIcon = () => (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 4.5L3.5 7L9 1" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
    <path d="M13.0159 2.78906L15.805 5.5782L6.50788 14.8753H3.71875V12.0862L13.0159 2.78906Z" stroke="#926690" strokeWidth="1.39457" strokeLinejoin="round"/>
  </svg>
);

export default ManagePlan;






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