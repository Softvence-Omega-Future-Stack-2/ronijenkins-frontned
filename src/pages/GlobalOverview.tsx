import { Download, Plus } from "lucide-react"
import OverviewCard from "../Component/globalOverview/OverviewCard"
import UserEngagement from "../Component/globalOverview/UserEngegment"
import SymptomDistribution from "../Component/globalOverview/SymptomDistribution"
import { useNavigate } from "react-router-dom"

const GlobalOverview = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full p-3 md:p-8 ">
      <div className="flex flex-col  md:flex-col lg:flex-row  gap-4 items-center justify-between mb-8">
        <div>
          <h1 className="text-titleColor text-xl sm:text-2xl md:text-[30px] font-extrabold leading-6 md:leading-[36px]">System Status Overview</h1>
          <p className="text-subTitleColor text-sm font-medium leading-5 ">Real-time health monitoring and population analytics</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-4">
          <button className="flex w-full sm:w-auto justify-center  gap-2 bg-white text-titleColor font-extrabold border border-borderColor px-5 py-3 rounded-2xl cursor-pointer">
            <Download/>
             Export Report
          </button>
          <button  onClick={()=> navigate('/dashboard/add-brodcast')} className="flex w-full sm:w-auto justify-center items-center gap-2 bg-buttonColor font-extrabold px-5 py-3 text-white rounded-2xl cursor-pointer">
            <Plus/>
             Broadcast Update
          </button>
        </div>
      </div>
       <div className="mb-8">
        <OverviewCard/>
       </div>
       <div className="flex flex-col xl:flex-row  items-stretch w-full gap-7  ">
        <div className="w-full xl:w-2/3">
          <UserEngagement/>
        </div>
        <div className="w-full xl:w-1/3">
          <SymptomDistribution/>
        </div>
       </div>
    </div>
  )
}
export default GlobalOverview



// import OverviewCard from '../Component/dashboard/OverviewCard'
// import { RecentActivity } from '../Component/dashboard/RecentActivity'


// const Dashboard = () => {
//   return (
//     <div className='w-full h-[790px]'>
//       <OverviewCard/>
//       <RecentActivity/>
//     </div>
//   )
// }

// export default Dashboard