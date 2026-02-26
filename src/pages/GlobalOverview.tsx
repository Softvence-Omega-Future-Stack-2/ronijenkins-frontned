import { Download, Plus } from "lucide-react"
import OverviewCard from "../Component/globalOverview/OverviewCard"

const GlobalOverview = () => {
  return (
    <div className="w-full p-3 md:p-8 ">
      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row  gap-4 items-center justify-between mb-4">
        <div>
          <h1>System Status Overview</h1>
          <p>Real-time health monitoring and population analytics</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-4">
          <button className="flex gap-2 bg-white text-black px-4 py-2 rounded-2xl cursor-pointer">
            <Download/>
             Export Report
          </button>
          <button className="flex items-center gap-2 bg-[#926690] px-4 py-2 text-white rounded-2xl cursor-pointer">
            <Plus/>
             Broadcast Update
          </button>
        </div>
      </div>
       <div>
        <OverviewCard/>
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