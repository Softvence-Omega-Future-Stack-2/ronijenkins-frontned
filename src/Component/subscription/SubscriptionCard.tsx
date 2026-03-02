import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, change, isPositive }) => {
  return (
    <div className="bg-white p-3 md:p-6 rounded-[22px] border border-borderColor  flex flex-col gap-4">
      <h3 className="text-[#4A3A3799] text-xs font-medium leaidng-4 tracking-[1.5px] uppercase">
        {label}
      </h3>
      <div className="flex flex-col gap-2">
        <span className="text-2xl sm:text-3xl md:text-4xl font-black text-titleColor leading-6 md:leading-10 tracking-tight">
          {value}
        </span>
        <div className="flex items-center gap-1">
          <span className={`text-sm font-black leading-4 ${isPositive ? 'text-[#00D084] ' : 'text-rose-500'}`}>
            {isPositive ? '+' : ''}{change}
          </span>
          <span className="text-[#4A3A3780] text-xs leading-4 font-medium">
            vs last month
          </span>
        </div>
      </div>
    </div>
  );
};

const SubscriptionCard: React.FC = () => {
  const metrics = [
    { label: 'Total Subscribers', value: '2,044', change: '15.3%', isPositive: true },
    { label: 'Monthly Revenue', value: '$98.7k', change: '22.5%', isPositive: true },
    { label: 'Conversion Rate', value: '12.4%', change: '3.2%', isPositive: true },
    { label: 'Churn Rate', value: '3.8%', change: '-1.2%', isPositive: true }, 
  ];

  return (
    <div className="mt-8">
      <div className="">
        {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;