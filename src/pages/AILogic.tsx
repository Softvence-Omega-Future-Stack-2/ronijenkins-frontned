// import InferenceLoad from "../Component/aiLogic/InferenceLoad"
// import IntelligenceScore from "../Component/aiLogic/IntelligenceScore"
import MostUsedQuestions from "../Component/aiLogic/MostUsedQuestion"
import RecentQueries from "./RecentQuries"



const AiLogic= () => {
  return (
    <div className="w-full p-3 md:p-8 ">
      
      <h1 className="text-titleColor text-xl sm:text-2xl md:text-[30px] font-extrabold leading-6 md:leading-[36px]">Mennie™ AI Logic</h1>
          <p className="text-subTitleColor text-sm font-medium leading-5 mt-0.5">Model intelligence and interaction monitoring</p>
            {/* <div className="flex flex-col xl:flex-row  items-stretch w-full gap-7 mt-6 ">
        <div className="w-full xl:w-2/3">
              <IntelligenceScore/>
            </div>
              <div className="w-full xl:w-1/3">
              <InferenceLoad/>
            </div>
          </div> */}

            <div className="flex flex-col xl:flex-row  items-stretch w-full gap-7 mt-6 ">
        <div className="w-full xl:w-1/2">
              <MostUsedQuestions/>
            </div>
              <div className="w-full xl:w-1/2">
              <RecentQueries/>
            </div>
          </div>
    </div>
  )
}

export default AiLogic