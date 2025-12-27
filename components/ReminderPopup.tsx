
import React from 'react';

interface ReminderPopupProps {
  onClose: () => void;
}

const ReminderPopup: React.FC<ReminderPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full max-w-[360px] bg-white dark:bg-[#1a232e] rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative animate-[pop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-300 hover:text-gray-500">
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>

        <div className="pt-12 pb-6 px-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6 animate-pulse">
            <span className="material-symbols-outlined text-primary text-6xl filled">alarm</span>
          </div>
          <h2 className="text-3xl font-black leading-tight mb-2">지금 약 드실<br/>시간입니다!</h2>
          <div className="flex items-center gap-1.5 text-gray-400 font-bold">
            <span className="material-symbols-outlined text-lg">schedule</span>
            오후 12:30
          </div>
        </div>

        <div className="px-6 py-2">
          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">복용 내용</p>
              <h4 className="text-xl font-black">점심 식후 약</h4>
              <p className="text-sm text-gray-500 font-medium">혈압약 외 2종</p>
            </div>
            <img src="https://picsum.photos/id/112/100/100" className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt="pill" />
          </div>
        </div>

        <div className="p-6 pb-10 flex flex-col gap-3">
          <button 
            onClick={onClose}
            className="w-full h-16 bg-primary text-white font-black text-xl rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-2xl">check_circle</span>
            지금 복용했어요!
          </button>
          <button 
            onClick={onClose}
            className="w-full py-4 text-gray-400 font-black text-lg hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-all"
          >나중에 먹을게요</button>
        </div>
      </div>
    </div>
  );
};

export default ReminderPopup;
