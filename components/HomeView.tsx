
import React, { useState, useEffect, useMemo } from 'react';
import { ViewType, Medication, UserProfile, DailyRecord, DailyRecordItem } from '../types';
import { geminiService } from '../services/geminiService';

interface HomeViewProps {
  user: UserProfile;
  dailyRecords: DailyRecord;
  onNavigate: (view: ViewType) => void;
  onStartTaking: (item: DailyRecordItem) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ user, dailyRecords, onNavigate, onStartTaking }) => {
  const [aiTip, setAiTip] = useState<string>("오늘도 잊지 말고 꼭 약을 챙겨 드세요!");
  const percentage = (dailyRecords.completed / dailyRecords.total) * 100;

  // 현재 시간에 따라 활성화될 복약 라벨(아침, 점심, 저녁)을 결정합니다.
  const activeTimeLabel = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 11) return '아침';
    if (hour < 16) return '점심';
    return '저녁';
  }, []);

  useEffect(() => {
    const fetchTip = async () => {
      const tip = await geminiService.getDailyHealthTip(user.name, dailyRecords.total);
      if (tip) setAiTip(tip);
    };
    fetchTip();
  }, [user.name, dailyRecords.total]);

  return (
    <div className="flex flex-col px-5 pt-8 gap-6 pb-28 animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-text-main dark:text-white mb-1">
            안녕하세요, <span className="text-primary">{user.name}님!</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary filled">verified</span>
            <p className="text-sm font-bold text-text-sub dark:text-gray-400">레벨 {user.level} 건강 파트너</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
        </div>
      </header>

      {/* AI Health Tip */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-5 border border-blue-100 dark:border-blue-800/50 flex gap-4 items-start shadow-sm">
        <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
          <span className="material-symbols-outlined text-primary filled text-2xl">auto_awesome</span>
        </div>
        <div>
          <h4 className="text-sm font-black text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-1">
            AI 맞춤 건강 가이드
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug font-medium">{aiTip}</p>
        </div>
      </section>

      {/* Progress Card */}
      <section className="bg-white dark:bg-[#1A2633] rounded-[32px] p-6 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-50 dark:border-gray-800 flex flex-col items-center gap-4">
        <div className="relative h-44 w-44">
          <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
            <circle className="text-gray-100 dark:text-gray-800" cx="50" cy="50" fill="transparent" r="42" stroke="currentColor" strokeWidth="10"></circle>
            <circle 
              className="text-primary transition-all duration-1000 ease-in-out" 
              cx="50" cy="50" fill="transparent" r="42" 
              stroke="currentColor" 
              strokeWidth="10"
              strokeDasharray="263.8" 
              strokeDashoffset={263.8 - (263.8 * percentage) / 100} 
              strokeLinecap="round"
            ></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-text-main dark:text-white tracking-tighter">{Math.round(percentage)}%</span>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">오늘의 달성</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">총 {dailyRecords.total}정 중 <span className="text-primary">{dailyRecords.completed}정</span> 복용 완료</p>
        </div>
      </section>

      {/* Daily Timeline */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-black px-1">오늘의 복약 일정</h3>
          <p className="text-xs font-bold text-primary">현재: {activeTimeLabel}</p>
        </div>
        
        {dailyRecords.items.map((item) => {
          const isCurrentTime = item.label === activeTimeLabel;
          const isTakeable = !item.isCompleted && isCurrentTime;
          const isPastOrFuture = !item.isCompleted && !isCurrentTime;

          return (
            <div key={item.id} className="flex gap-4">
              <div className="flex flex-col items-center gap-1 w-8">
                <span className={`material-symbols-outlined text-xl ${isCurrentTime && !item.isCompleted ? 'text-primary animate-bounce' : 'text-gray-300'}`}>
                  {item.label === '아침' ? 'wb_twilight' : item.label === '점심' ? 'wb_sunny' : 'dark_mode'}
                </span>
                <div className="w-0.5 flex-1 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
              </div>
              <div className={`flex-1 mb-4 p-5 rounded-3xl border transition-all ${
                item.isCompleted 
                  ? 'bg-gray-50/50 dark:bg-gray-900/30 border-gray-100 dark:border-gray-800 opacity-60' 
                  : isCurrentTime 
                    ? 'bg-white dark:bg-[#1A2633] border-primary/30 ring-2 ring-primary/5 shadow-md shadow-primary/5' 
                    : 'bg-gray-50/30 dark:bg-gray-900/10 border-gray-100 dark:border-gray-800 opacity-40 grayscale'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-gray-400">{item.time}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        item.isCompleted ? 'bg-green-100 text-green-700' : isCurrentTime ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                    <h4 className={`text-lg font-bold ${item.isCompleted ? 'text-gray-400' : 'text-text-main dark:text-white'}`}>{item.name}</h4>
                  </div>
                  {item.isCompleted && (
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-lg font-black">done</span>
                    </div>
                  )}
                  {isCurrentTime && !item.isCompleted && (
                    <div className="flex items-center gap-1 bg-red-50 text-red-500 px-2 py-1 rounded-lg">
                      <span className="material-symbols-outlined text-xs filled">alarm</span>
                      <span className="text-[10px] font-black">복용 시간</span>
                    </div>
                  )}
                </div>

                {!item.isCompleted && (
                  <button 
                    onClick={() => isTakeable && onStartTaking(item)}
                    disabled={!isTakeable}
                    className={`w-full h-11 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all mt-2 ${
                      isTakeable 
                        ? 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-blue-500/20 active:scale-95' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">pill</span>
                    {isCurrentTime ? '복용 체크하기' : '시간이 아닙니다'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Fixed FAB */}
      <button 
        onClick={() => onNavigate('register')}
        className="fixed bottom-24 right-6 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-40 group"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
};

export default HomeView;
