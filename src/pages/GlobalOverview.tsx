import { Download, Plus } from "lucide-react"
import OverviewCard from "../Component/globalOverview/OverviewCard"
import UserEngagement from "../Component/globalOverview/UserEngegment"
import SymptomDistribution from "../Component/globalOverview/SymptomDistribution"
import { useNavigate } from "react-router-dom"
import { json2csv } from "json-2-csv"

const GlobalOverview = () => {
  const navigate = useNavigate();

const engagementData = [
    { name: 'Mon', users: 450, logs: 320 },
    { name: 'Tue', users: 520, logs: 410 },
    { name: 'Wed', users: 480, logs: 380 },
    { name: 'Thu', users: 610, logs: 520 },
    { name: 'Fri', users: 590, logs: 490 },
    { name: 'Sat', users: 420, logs: 300 },
    { name: 'Sun', users: 390, logs: 280 },
  ];

  const symptomData = [
    { name: 'Hot Flashes', value: '35%' },
    { name: 'Mood Swings', value: '25%' },
    { name: 'Insomnia', value: '20%' },
    { name: 'Brain Fog', value: '20%' },
  ];

  const handleExport = () => {

    const combinedData = [
      { SECTION: "--- USER ENGAGEMENT ---", name: "", users: "", logs: "" },
      ...engagementData.map(d => ({ ...d, SECTION: "Engagement" })),
      { SECTION: "", name: "", users: "", logs: "" }, 
      { SECTION: "--- SYMPTOM DISTRIBUTION ---", name: "", users: "Value", logs: "" },
      ...symptomData.map(s => ({ SECTION: "Symptoms", name: s.name, users: s.value }))
    ];

    try {
      const csv = json2csv(combinedData);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `System_Overview_Report_${new Date().toLocaleDateString()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };
  return (
    <div className="w-full p-3 md:p-8 ">
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
  
  <div className="flex-1 text-center">
    <h1 className="text-titleColor text-xl sm:text-2xl md:text-[30px] font-extrabold leading-6 md:leading-[36px]">
      System Status Overview
    </h1>
    <p className="text-subTitleColor text-sm font-medium leading-5">
      Real-time health monitoring and population analytics
    </p>
  </div>

  <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-4">
    <button
      onClick={handleExport}
      className="flex w-full sm:w-auto justify-center gap-2 bg-white text-titleColor font-extrabold border border-borderColor px-5 py-3 rounded-2xl cursor-pointer"
    >
      <Download />
      Export Report
    </button>

    <button
      onClick={() => navigate('/dashboard/add-brodcast')}
      className="flex w-full sm:w-auto justify-center items-center gap-2 bg-buttonColor font-extrabold px-5 py-3 text-white rounded-2xl cursor-pointer"
    >
      <Plus />
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