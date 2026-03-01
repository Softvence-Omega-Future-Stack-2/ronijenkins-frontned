import React from 'react';
import { MessageSquare } from 'lucide-react';

const questions = [
  { text: "What are the early signs of menopause?", count: "1,240", trend: "+12%", positive: true },
  { text: "How to manage night sweats naturally?", count: "980", trend: "+8%", positive: true },
  { text: "Is HRT right for everyone?", count: "850", trend: "-3%", positive: false },
  { text: "Benefits of magnesium for sleep", count: "720", trend: "+15%", positive: true },
];

const MostUsedQuestions: React.FC = () => {
  return (
    <div className="w-full h-full bg-white rounded-[40px] p-3 xl:p-8 shadow-sm border border-orange-50/50">
      <div className="mb-8">
        <h2 className="text-base md:text-lg font-extrabold text-titleColor leading-6 mb-2 mt-3">Most Used Questions</h2>
        <p className="text-subTitleColor text-sm font-medium leading-5">Top performing user inquiries across all segments</p>
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={i} className="group flex items-center justify-between p-5 bg-[#fdfaf8] rounded-[24px] hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-orange-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-gray-50 text-[#846584]">
                <MessageSquare size={20} />
              </div>
              <div>
                <h4 className="font-bold text-titleColor text-sm  leading-5">{q.text}</h4>
                <p className="text-[10px] font-bold text-[#4A3A3766] uppercase tracking-4 mt-1">
                  {q.count} TIMES ASKED
                </p>
              </div>
            </div>
            <span className={`font-black text-xs leading-4 ${q.positive ? 'text-[#00A63E]' : 'text-[#FB2C36]'}`}>
              {q.trend}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MostUsedQuestions