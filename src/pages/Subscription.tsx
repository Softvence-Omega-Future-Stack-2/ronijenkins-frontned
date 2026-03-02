import { useState } from "react";
import SubscriptionCard from "../Component/subscription/SubscriptionCard"
import SubscriberTable from "../Component/subscription/UserSubscriptionTable";
import ManagePlan from "../Component/subscription/ManagePlan";




const Subscription = () => {
    const [activeTab, setActiveTab] = useState("user");
  return (
      <div className="w-full p-3 md:p-8 ">
      
      <h1 className="text-titleColor text-xl sm:text-2xl md:text-[30px] font-extrabold leading-6 md:leading-[36px]">Subscription Management</h1>
          <p className="text-subTitleColor text-sm font-medium leading-5 mt-0.5">Manage user subscriptions and subscription plans</p>
          <div>
            <SubscriptionCard/>
          </div>
       
   
          <div>
      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200 w-full">
        <div className="flex gap-8">

          {/* User Subscription Tab */}
          <button
            onClick={() => setActiveTab("user")}
            className={`pb-3 text-sm font-black leading-5 transition-all duration-300 cursor-pointer
              ${activeTab === "user"
                ? "text-buttonColor border-b-2 border-buttonColor"
                : "text-[#4A3A3799] hover:text-buttonColor"
              }`}
          >
            User Subscription
          </button>

          {/* Manage Plan Tab */}
          <button
            onClick={() => setActiveTab("plan")}
            className={`pb-3 text-sm font-black leading-5 transition-all duration-300 cursor-pointer
              ${activeTab === "plan"
                ? "text-buttonColor border-b-2 border-buttonColor"
                : "text-[#4A3A3799] hover:text-buttonColor"
              }`}
          >
            Manage Plan
          </button>

        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "user" && <SubscriberTable />}
        {activeTab === "plan" && <ManagePlan/>}
      </div>
          </div>
   
    </div>
  )
}

export default Subscription