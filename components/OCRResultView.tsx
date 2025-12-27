
import React, { useState } from 'react';
import { Medication } from '../types';

interface OCRResultViewProps {
  data: any;
  onCancel: () => void;
  onConfirm: (newMed: Medication) => void;
}

const OCRResultView: React.FC<OCRResultViewProps> = ({ data, onCancel, onConfirm }) => {
  const medicine = data?.medicines?.[0] || { name: '', frequency: '', instruction: '' };
  const [name, setName] = useState(medicine.name);
  const [freq, setFreq] = useState(medicine.frequency || medicine.instruction);

  const handleSave = () => {
    const newMed: Medication = {
      id: Date.now().toString(),
      name: name || "새로운 약",
      category: 'medicine',
      dosage: freq || '정보 없음',
      instruction: freq || '정보 없음',
      remainingDays: 30,
      status: 'active',
      adherenceRate: 100,
      riskLevel: 'safe',
      imageUrl: 'https://picsum.photos/id/111/200/200'
    };
    onConfirm(newMed);
  };

  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-[#101922] animate-[fadeIn_0.3s]">
      <header className="p-6 flex items-center justify-between">
        <button onClick={onCancel} className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="text-xl font-black">정보 확인</h2>
        <div className="w-12 h-12"></div>
      </header>

      <div className="px-6 pb-20 flex flex-col gap-8">
        <div className="w-full aspect-video rounded-3xl overflow-hidden bg-gray-100 shadow-inner relative">
          <img src="https://picsum.photos/id/113/600/400" className="w-full h-full object-cover opacity-80" alt="Captured" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-sm">camera_alt</span>
            <span className="text-[10px] font-bold">방금 촬영된 이미지</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-3xl font-black leading-tight">AI가 분석한<br/>정보가 맞나요?</h3>
          
          <div className="flex flex-col gap-4">
            <InputField 
              label="약 이름" 
              icon="pill" 
              value={name} 
              onChange={setName} 
              placeholder="약 이름을 입력하세요"
            />
            <InputField 
              label="복용 방법" 
              icon="schedule" 
              value={freq} 
              onChange={setFreq} 
              placeholder="예: 1일 3회 식후 30분"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <button 
            onClick={handleSave}
            className="w-full h-16 bg-primary text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">check_circle</span>
            이 정보로 등록하기
          </button>
          <button 
            onClick={onCancel}
            className="w-full h-16 bg-gray-100 dark:bg-gray-800 text-gray-500 font-black text-lg rounded-2xl"
          >
            다시 촬영하기
          </button>
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<{label: string, icon: string, value: string, onChange: (v: string) => void, placeholder: string}> = ({label, icon, value, onChange, placeholder}) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-black text-primary flex items-center gap-1">
      <span className="material-symbols-outlined text-sm">{icon}</span>
      {label}
    </label>
    <div className="relative group">
      <input 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-14 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-gray-800 rounded-2xl px-5 font-bold transition-all outline-none"
      />
      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary">edit</span>
    </div>
  </div>
);

export default OCRResultView;
