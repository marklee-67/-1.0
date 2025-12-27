
import React from 'react';
import { UserProfile } from '../types';

interface MyPageViewProps {
  user: UserProfile;
  onBack: () => void;
}

const MyPageView: React.FC<MyPageViewProps> = ({ user, onBack }) => {
  return (
    <div className="flex flex-col animate-[fadeIn_0.3s_ease-out] bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#101922] p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <span className="material-symbols-outlined text-[28px]">arrow_back</span>
        </button>
        <h2 className="text-xl font-black flex-1 text-center pr-10">마이페이지</h2>
      </header>

      <div className="p-4 flex flex-col gap-6 pb-24">
        {/* Points Card */}
        <section className="relative overflow-hidden rounded-3xl bg-primary shadow-xl p-8 text-white">
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-2 opacity-80">
              <span className="material-symbols-outlined">loyalty</span>
              <span className="text-lg font-bold">나의 포인트</span>
            </div>
            <h3 className="text-5xl font-black tracking-tight">{user.points.toLocaleString()} P</h3>
            <button className="w-full bg-white text-primary text-lg font-black py-4 rounded-2xl mt-4 shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              포인트 사용하러 가기
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
            </button>
          </div>
          <div className="absolute right-[-30px] bottom-[-30px] w-48 h-48 bg-white/10 rounded-full"></div>
        </section>

        {/* Progress Section */}
        <section>
          <h3 className="text-2xl font-black mb-4">이번 달 현황</h3>
          <div className="bg-white dark:bg-[#1e2936] rounded-3xl p-6 shadow-sm border border-gray-50 dark:border-gray-800">
            <div className="flex justify-between items-end mb-4">
              <p className="text-lg font-bold leading-tight">다음 레벨까지<br/>남은 미션: <span className="text-primary font-black text-2xl">{user.missionsRemaining}개</span></p>
              <span className="text-primary font-black text-2xl">{user.progress}%</span>
            </div>
            <div className="w-full h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{width: `${user.progress}%`}}></div>
            </div>
            <p className="text-gray-500 font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-xl filled">sentiment_satisfied</span>
              조금만 더 힘내세요!
            </p>
          </div>
        </section>

        {/* Settings List */}
        <section>
          <h3 className="text-2xl font-black mb-4">앱 설정</h3>
          <div className="flex flex-col gap-3">
            <SettingsItem icon="notifications" label="알림 설정" subLabel="소리 및 진동 알림" toggle checked />
            <SettingsItem icon="group" label="가족 공유 설정" arrow />
            
            <div className="bg-white dark:bg-[#1e2936] p-6 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">format_size</span>
                </div>
                <span className="text-lg font-black">글자 크기</span>
              </div>
              <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl h-14">
                <button className="flex-1 rounded-xl text-gray-500 font-bold">보통</button>
                <button className="flex-1 bg-white dark:bg-gray-700 shadow-sm rounded-xl text-primary font-black">크게</button>
                <button className="flex-1 rounded-xl text-gray-500 font-bold">더 크게</button>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center py-8">
          <button className="text-gray-400 font-bold underline underline-offset-4">로그아웃</button>
          <p className="text-[10px] text-gray-300 mt-2">버전 1.2.0</p>
        </div>
      </div>
    </div>
  );
};

const SettingsItem: React.FC<{icon: string, label: string, subLabel?: string, toggle?: boolean, arrow?: boolean, checked?: boolean}> = ({icon, label, subLabel, toggle, arrow, checked}) => (
  <div className="bg-white dark:bg-[#1e2936] p-5 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-800 flex items-center justify-between cursor-pointer active:bg-gray-50 transition-all">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-lg font-black">{label}</p>
        {subLabel && <p className="text-xs text-gray-500">{subLabel}</p>}
      </div>
    </div>
    {toggle && (
      <div className={`w-14 h-8 rounded-full transition-all relative ${checked ? 'bg-primary' : 'bg-gray-200'}`}>
        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${checked ? 'right-1' : 'left-1'}`}></div>
      </div>
    )}
    {arrow && <span className="material-symbols-outlined text-gray-300">chevron_right</span>}
  </div>
);

export default MyPageView;
