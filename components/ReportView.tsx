
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';

const chartData = [
  { name: '월', value: 90 }, { name: '화', value: 85 }, { name: '수', value: 45 },
  { name: '목', value: 100 }, { name: '금', value: 80 }, { name: '토', value: 70 }, { name: '일', value: 95 },
];

const ReportView: React.FC<{onBack: () => void}> = ({onBack}) => {
  const [selectedDay, setSelectedDay] = useState(25);
  const days = Array.from({length: 31}, (_, i) => i + 1);

  return (
    <div className="flex flex-col animate-[fadeIn_0.3s_ease-out] pb-20">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-[#101922]/80 backdrop-blur-md px-6 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-xl font-black">복약 리포트</h2>
        <div className="w-10 h-10"></div>
      </header>

      <div className="px-6 pt-8 flex flex-col gap-8">
        {/* Weekly Chart */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-gray-400 font-bold text-sm mb-1">이번 주 평균 달성률</p>
              <h3 className="text-4xl font-black text-primary">85.4%</h3>
            </div>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 mb-1">
              <span className="material-symbols-outlined text-sm filled">trending_up</span>
              저번 주 대비 +12%
            </div>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 'bold'}} dy={10} />
                <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > 80 ? '#137fec' : '#e5e7eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Calendar Horizontal Scroll */}
        <section>
          <h3 className="text-lg font-black mb-4">10월 복약 달력</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 -mx-6 px-6">
            {days.map(day => (
              <button 
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`shrink-0 w-14 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 ${selectedDay === day ? 'bg-primary border-primary text-white shadow-lg shadow-blue-500/30' : 'bg-gray-50 dark:bg-gray-800 border-transparent'}`}
              >
                <span className={`text-[10px] font-bold ${selectedDay === day ? 'text-white/60' : 'text-gray-400'}`}>
                  {['일','월','화','수','목','금','토'][day % 7]}
                </span>
                <span className="text-lg font-black">{day}</span>
                {day < 25 && <div className={`w-1.5 h-1.5 rounded-full ${day % 5 === 0 ? 'bg-red-400' : 'bg-green-400'}`}></div>}
              </button>
            ))}
          </div>
        </section>

        {/* Detail Analysis */}
        <section className="bg-blue-50/50 dark:bg-blue-900/10 rounded-[32px] p-6 border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-primary shadow-sm">
              <span className="material-symbols-outlined filled">insights</span>
            </div>
            <h4 className="text-lg font-black">AI 종합 분석</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
            김철수님은 주로 <span className="text-primary font-black">수요일 오후</span>에 복약을 잊으시는 경향이 있습니다. 해당 시간대에 더 강력한 알림을 설정해드릴까요?
          </p>
          <button className="w-full h-12 bg-white dark:bg-gray-800 text-primary border border-primary/20 rounded-xl mt-4 font-black text-sm shadow-sm active:scale-95 transition-all">
            맞춤 알림 설정 최적화하기
          </button>
        </section>

        <section className="mb-8">
           <h3 className="text-lg font-black mb-4">가장 성실하게 복용한 약</h3>
           <div className="p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
             <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
               <span className="material-symbols-outlined text-4xl filled">verified</span>
             </div>
             <div>
               <h4 className="text-xl font-black">혈압약 (노바스크)</h4>
               <p className="text-xs text-gray-400 font-bold">최근 30일 중 29일 복용 (97%)</p>
             </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default ReportView;
