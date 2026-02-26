
import {  Users,  } from 'lucide-react';
import { useGetOverviewCardQuery } from '../../redux/features/admin/analyticsApi';


const AnalyticsCard = () => {

  const {data, isLoading, error} = useGetOverviewCardQuery()

    if (isLoading) {
    return (
      <div className="w-full bg-white rounded-[20px] border border-gray-200 p-6 text-center">
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-[20px] border border-gray-200 p-6 text-center text-red-500">
        Failed to load analytics
      </div>
    );
  }

  const statsCards = [
    {
      id: 1,
      icon: <Users size={24} />,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      borderColor: 'border-l-[#8571EC]',
      value: data?.user?.total_user ?? 0,
      title: 'Total Users',
      subtitle: `${data?.user?.premium_user ?? 0} Premium • ${
        data?.user?.free_user ?? 0
      } Free`,
    },
    {
      id: 2,
      icon: <svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10.75 16.75C9.41746 17.3724 7.66707 17.75 5.75 17.75C4.68408 17.75 3.66969 17.6333 2.75 17.4226C1.16828 17.0603 0.75 16.1296 0.75 14.636V3.86397C0.75 2.87914 1.79003 2.20273 2.75 2.4226C3.66969 2.63325 4.68408 2.75 5.75 2.75C7.66707 2.75 9.41746 2.37236 10.75 1.75C12.0825 1.12764 13.8329 0.75 15.75 0.75C16.8159 0.75 17.8303 0.866748 18.75 1.0774C20.3317 1.43968 20.75 2.37036 20.75 3.86397V14.636C20.75 15.6209 19.71 16.2973 18.75 16.0774C17.8303 15.8667 16.8159 15.75 15.75 15.75C13.8329 15.75 12.0825 16.1276 10.75 16.75Z" stroke="#166534" stroke-width="1.5"/>
  <path d="M13.25 9.25C13.25 10.6307 12.1307 11.75 10.75 11.75C9.36929 11.75 8.25 10.6307 8.25 9.25C8.25 7.86929 9.36929 6.75 10.75 6.75C12.1307 6.75 13.25 7.86929 13.25 9.25Z" stroke="#166534" stroke-width="1.5"/>
  <path d="M4.25 10.25L4.25 10.259" stroke="#166534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M17.25 8.24219L17.25 8.25117" stroke="#166534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-l-[#1C7D49]',
      value: `$${data?.last_month_revenue ?? 0}`,
      title: 'Monthly Revenue',
      subtitle: 'This Month',
      subtitleColor: 'text-green-600'
    },
    {
      id: 3,
      icon: <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15.748 4.87652C16.0682 4.79393 16.404 4.75 16.75 4.75C18.9591 4.75 20.75 6.54086 20.75 8.75C20.75 10.9591 18.9591 12.75 16.75 12.75C16.3951 12.75 16.0509 12.7038 15.7233 12.617M15.748 4.87652C15.7493 4.83451 15.75 4.79233 15.75 4.75C15.75 2.54086 13.9591 0.75 11.75 0.75C9.83239 0.75 8.22994 2.09939 7.84041 3.90043M15.748 4.87652C15.7269 5.55763 15.5354 6.19584 15.2149 6.75M15.7233 12.617C15.7409 12.4972 15.75 12.3747 15.75 12.25C15.75 11.0405 14.8911 10.0316 13.75 9.80001M15.7233 12.617C15.5457 13.8237 14.506 14.75 13.25 14.75H12.75C10.5409 14.75 8.75 16.5409 8.75 18.75M7.84041 3.90043C7.49377 3.80243 7.12801 3.75 6.75 3.75C4.54086 3.75 2.75 5.54086 2.75 7.75C2.75 8.13862 2.80542 8.51429 2.90878 8.86954M7.84041 3.90043C8.85146 4.18625 9.69983 4.85965 10.2149 5.75M2.90878 8.86954C1.6614 9.23322 0.75 10.3852 0.75 11.75C0.75 13.4069 2.09315 14.75 3.75 14.75C5.05622 14.75 6.16746 13.9152 6.57929 12.75M2.90878 8.86954C2.99921 9.18032 3.12632 9.47547 3.28513 9.75" stroke="#024C99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10.5861 9.49345C10.0757 9.98534 9.20305 10.0702 8.45713 9.65082C7.7112 9.23142 7.33031 8.44173 7.48535 7.75" stroke="#024C99" stroke-width="1.5" stroke-linecap="round"/>
</svg>,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-700',
      borderColor: 'border-l-[#2B7FFF]',
      value: data?.total_behaviour_search ?? 0,
      title: 'Behaviour Searches',
      subtitle: 'This month'
    },
    {
      id: 4,
      icon: <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15.3627 13.9137C12.7296 15.3968 11.2273 18.47 10.75 19.3291V5.8291C11.1645 5.08306 12.352 2.94557 14.3817 1.49279C15.2368 0.880768 15.6643 0.574758 16.2072 0.853786C16.75 1.13281 16.75 1.74873 16.75 2.98056V11.8205C16.75 12.4859 16.75 12.8187 16.6134 13.0524C16.4767 13.2862 16.1054 13.4954 15.3627 13.9137L15.3627 13.9137Z" stroke="#FF6900" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10.75 5.63466C10.0631 4.91313 8.07175 3.1995 4.73056 2.59868C3.0379 2.2943 2.19157 2.14211 1.47078 2.72543C0.75 3.30875 0.75 4.25598 0.75 6.15043V12.9588C0.75 14.691 0.75 15.5571 1.2126 16.0978C1.6752 16.6386 2.69365 16.8217 4.73056 17.188C6.54633 17.5145 7.96344 18.0348 8.98918 18.5576C9.99838 19.0719 10.503 19.3291 10.75 19.3291C10.997 19.3291 11.5016 19.0719 12.5108 18.5576C13.5366 18.0348 14.9537 17.5145 16.7694 17.188C18.8064 16.8217 19.8248 16.6386 20.2874 16.0978C20.75 15.5571 20.75 14.691 20.75 12.9588V6.15043C20.75 4.25598 20.75 3.30875 20.0292 2.72543C19.3084 2.14211 17.75 2.59868 16.75 3.3291" stroke="#FF6900" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    borderColor: 'border-l-[#FF6900]',
      value: data?.total_journal ?? 0,
      title: 'Journal Entries',
      subtitle: 'Total entries'
    }
  ];

  return (
    <div className="w-full bg-white rounded-[20px] border border-gray-400 p-2.5 md:p-6">
      
   <div className='flex flex-col md:flex-row items-center justify-between'>
       <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-textColor leading-[120%] ">Analytics & Insights</h1>
        <p className='text-gray-600 font-normal text-base leading-6'>Last 30 days</p>
      </div>
      {/* <div>
          <button
            //   onClick={() => setIsModalOpen(true)}
            className="bg-violet-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Add New
          </button>
      </div> */}
   </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsCards.map((card) => (
          <div
            key={card.id}
            className={` rounded-2xl p-4 border-l-4 ${card.borderColor} border border-[#EDE9FE] shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
           <div className='flex items-center justify-between'>
             {/* Icon */}
            <div className={`${card.iconBg} ${card.iconColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
              {card.icon}
            </div>

            {/* Value */}
            <div className="text-3xl font-bold text-gray-900 leading-[130%] mb-2">
              {card.value}
            </div>
           </div>

            {/* Title */}
            <div className="text-sm font-medium leading-[130%] text-gray-900 mb-1">
              {card.title}
            </div>

            {/* Subtitle */}
            <div className={`text-xs font-normal leading-4.5 ${card.subtitleColor || 'text-gray-500'}`}>
              {card.subtitle}
            </div>
          </div>
        ))}
      </div>
    

    </div>
  );
};

export default AnalyticsCard;