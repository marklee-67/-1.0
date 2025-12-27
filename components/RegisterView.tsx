
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';

interface RegisterViewProps {
  onClose: () => void;
  onComplete: (data: any) => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onClose, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const result = await geminiService.analyzePrescription(base64);
      setLoading(false);
      onComplete(result);
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => fileInputRef.current?.click();

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-sm animate-[fadeIn_0.3s]">
      <div className="w-full max-w-md bg-white dark:bg-[#1A2633] rounded-t-[40px] shadow-2xl overflow-hidden animate-[slideUp_0.4s_cubic-bezier(0,0,0.2,1)]">
        <div className="h-1.5 w-12 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mt-4 mb-6"></div>
        
        <div className="px-8 pb-10">
          <header className="text-center mb-8">
            <h2 className="text-2xl font-black mb-2">약 등록하기</h2>
            <p className="text-gray-500 font-bold">사진을 찍으면 AI가 정보를 입력해드려요</p>
          </header>

          <div className="grid grid-cols-1 gap-4">
            <OptionCard 
              icon="photo_camera" 
              title="약봉투/처방전 촬영" 
              desc="글자가 잘 보이게 찍어주세요" 
              onClick={triggerUpload} 
              primary
            />
            <OptionCard 
              icon="medication" 
              title="약통 촬영" 
              desc="건강기능식품 등을 등록할 때" 
              onClick={triggerUpload} 
            />
            <OptionCard 
              icon="edit_note" 
              title="직접 입력하기" 
              desc="이름을 직접 입력해서 등록" 
              onClick={() => onComplete({medicines: [{name: '', frequency: ''}]})} 
            />
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
          />

          <button onClick={onClose} className="w-full py-4 text-gray-400 font-black mt-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-all">
            나중에 하기
          </button>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 z-[110] bg-white/90 dark:bg-black/90 flex flex-col items-center justify-center p-8 text-center animate-[fadeIn_0.2s]">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-4xl filled animate-pulse">auto_awesome</span>
            </div>
          </div>
          <h3 className="text-2xl font-black mb-3">AI 분석 중...</h3>
          <p className="text-gray-500 font-bold leading-relaxed">
            이미지에서 약 정보를 추출하고 있습니다.<br/>잠시만 기다려주세요!
          </p>
        </div>
      )}
    </div>
  );
};

const OptionCard: React.FC<{icon: string, title: string, desc: string, onClick: () => void, primary?: boolean}> = ({icon, title, desc, onClick, primary}) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-5 p-5 rounded-[28px] border-2 transition-all active:scale-[0.98] ${primary ? 'bg-primary border-primary text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${primary ? 'bg-white text-primary' : 'bg-blue-50 dark:bg-gray-700 text-primary'}`}>
      <span className="material-symbols-outlined text-3xl">{icon}</span>
    </div>
    <div className="flex-1 text-left">
      <h4 className="text-lg font-black">{title}</h4>
      <p className={`text-xs font-bold ${primary ? 'text-white/70' : 'text-gray-400'}`}>{desc}</p>
    </div>
    <span className={`material-symbols-outlined ${primary ? 'text-white/50' : 'text-gray-300'}`}>chevron_right</span>
  </button>
);

export default RegisterView;
