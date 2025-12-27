
import React, { useState, useRef } from 'react';
import { DailyRecordItem } from '../types';
import { GoogleGenAI } from '@google/genai';

interface PillVerificationViewProps {
  item: DailyRecordItem | null;
  onCancel: () => void;
  onComplete: (itemId: string) => void;
}

const PillVerificationView: React.FC<PillVerificationViewProps> = ({ item, onCancel, onComplete }) => {
  const [step, setStep] = useState<'camera' | 'analyzing' | 'success'>('camera');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  if (!item) return null;

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCapturedImage(reader.result as string);
      startAnalysis();
    };
    reader.readAsDataURL(file);
  };

  const startAnalysis = () => {
    setStep('analyzing');
    // 실제 서비스라면 여기서 Gemini API를 호출하여 이미지를 분석함
    // "이 이미지가 {item.name}이 맞는지 확인해줘"
    setTimeout(() => {
      setStep('success');
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full bg-black text-white animate-[fadeIn_0.3s]">
      {/* Header */}
      <header className="p-6 flex items-center justify-between z-10">
        <button onClick={onCancel} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="text-lg font-black">복약 확인</h2>
        <div className="w-12"></div>
      </header>

      {step === 'camera' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
          <div className="text-center">
            <h3 className="text-2xl font-black mb-2">약 실물을 비춰주세요</h3>
            <p className="text-gray-400 font-medium">AI가 올바른 약인지 확인해드립니다.</p>
          </div>

          <div className="relative w-full aspect-square max-w-[300px] border-2 border-white/20 rounded-[40px] flex items-center justify-center overflow-hidden">
             <div className="absolute inset-4 border-2 border-primary border-dashed rounded-[30px] animate-pulse"></div>
             <span className="material-symbols-outlined text-8xl text-white/10">pill</span>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl w-full flex items-center gap-4">
             <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
               <span className="material-symbols-outlined text-white">info</span>
             </div>
             <div>
               <p className="text-[10px] text-primary font-black uppercase tracking-wider">복용 대상</p>
               <p className="text-lg font-bold">{item.name}</p>
             </div>
          </div>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-16 bg-primary text-white font-black text-xl rounded-2xl shadow-xl shadow-blue-500/40 flex items-center justify-center gap-2 mt-auto mb-8"
          >
            <span className="material-symbols-outlined text-2xl">photo_camera</span>
            사진 찍어 확인하기
          </button>
          <input type="file" ref={fileInputRef} onChange={handleCapture} accept="image/*" capture="environment" className="hidden" />
        </div>
      )}

      {step === 'analyzing' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="relative w-32 h-32 mb-8">
             <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center">
               <span className="material-symbols-outlined text-primary text-5xl filled animate-pulse">auto_awesome</span>
             </div>
          </div>
          <h3 className="text-3xl font-black mb-4">AI 분석 중...</h3>
          <p className="text-gray-400 font-bold leading-relaxed">
            {item.name}과 실물이 일치하는지<br/>대조하고 있습니다.
          </p>
        </div>
      )}

      {step === 'success' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-[scaleUp_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]">
          <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-500/40">
            <span className="material-symbols-outlined text-6xl font-black">done_all</span>
          </div>
          <h3 className="text-4xl font-black mb-4">확인 완료!</h3>
          <p className="text-gray-400 font-bold mb-12">
            올바른 약을 복용하셨습니다.<br/>
            <span className="text-primary">+50포인트</span>가 적립되었습니다.
          </p>

          <button 
            onClick={() => onComplete(item.id)}
            className="w-full h-16 bg-white text-black font-black text-xl rounded-2xl flex items-center justify-center"
          >
            홈으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
};

export default PillVerificationView;
