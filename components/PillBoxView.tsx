
import React, { useState } from 'react';
import { Medication, ViewType } from '../types';
import { geminiService } from '../services/geminiService';

interface PillBoxViewProps {
  meds: Medication[];
  onNavigate: (view: ViewType) => void;
}

const PillBoxView: React.FC<PillBoxViewProps> = ({ meds, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'medicine' | 'supplement'>('medicine');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const filteredMeds = meds.filter(m => m.category === activeTab);

  const runInteractionCheck = async () => {
    setAnalyzing(true);
    const result = await geminiService.checkInteractions(meds.map(m => m.name));
    setAnalysisResult(result);
    setAnalyzing(false);
  };

  return (
    <div className="flex flex-col animate-[fadeIn_0.3s_ease-out] pb-28">
      {/* Header - 리포트 뷰와 동일한 스타일 적용 */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-[#101922]/80 backdrop-blur-md px-6 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <h1 className="text-xl font-black">나의 약통</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
          <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">filter_list</span>
        </button>
      </header>

      <div className="px-6 pt-8 flex flex-col gap-8">
        {/* Interaction Check Banner - 리포트의 'AI 종합 분석' 스타일 적용 */}
        <section className="bg-blue-50/50 dark:bg-blue-900/10 rounded-[32px] p-6 border border-blue-100 dark:border-blue-900/30 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-primary shadow-sm">
                <span className="material-symbols-outlined filled">security</span>
              </div>
              <h3 className="text-lg font-black">AI 상호작용 분석</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-4">
              복용 중인 모든 약과 영양제의 안전성을<br/>AI가 실시간으로 정밀 분석합니다.
            </p>
            <button 
              onClick={runInteractionCheck}
              disabled={analyzing}
              className="w-full h-12 bg-white dark:bg-gray-800 text-primary border border-primary/20 rounded-xl font-black text-sm shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="material-symbols-outlined text-lg">analytics</span>
              )}
              {analyzing ? '분석 중...' : '분석 결과 확인하기'}
            </button>
          </div>
        </section>

        {/* Tabs - 리포트의 달력 버튼 느낌과 유사한 모던한 탭 */}
        <div className="flex bg-gray-100 dark:bg-gray-800/50 p-1.5 rounded-[22px]">
          <button 
            onClick={() => setActiveTab('medicine')}
            className={`flex-1 py-3 text-sm font-black rounded-[18px] transition-all ${activeTab === 'medicine' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-400'}`}
          >복용약</button>
          <button 
            onClick={() => setActiveTab('supplement')}
            className={`flex-1 py-3 text-sm font-black rounded-[18px] transition-all ${activeTab === 'supplement' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-400'}`}
          >건강기능식품</button>
        </div>

        {/* Med List - 리포트의 '가장 성실하게 복용한 약' 아이템 스타일 적용 */}
        <div className="flex flex-col gap-4 mb-8">
          <h3 className="text-lg font-black mb-1 px-1">{activeTab === 'medicine' ? '복용 중인 약물' : '섭취 중인 영양제'}</h3>
          {filteredMeds.length > 0 ? filteredMeds.map(med => (
            <div key={med.id} className="p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-700 overflow-hidden relative shrink-0">
                <img src={med.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={med.name} />
                {med.riskLevel === 'medium' && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[10px] filled">priority_high</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-black truncate">{med.name}</h4>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-1">
                  <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                  {med.dosage}
                </div>
                {/* 진행 상태 바 */}
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-700" style={{width: `${med.adherenceRate}%`}}></div>
                  </div>
                  <span className="text-[10px] font-black text-primary">{med.adherenceRate}%</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
            </div>
          )) : (
            <div className="py-20 text-center flex flex-col items-center gap-4 grayscale opacity-30">
               <span className="material-symbols-outlined text-8xl">inbox</span>
               <p className="font-black text-xl">등록된 항목이 없습니다</p>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Modal Overlay */}
      {analysisResult && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-[fadeIn_0.2s]">
          <div className="bg-white dark:bg-[#1A2633] w-full max-w-sm rounded-[40px] p-8 max-h-[80vh] flex flex-col shadow-2xl">
            <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">medical_information</span>
              AI 분석 보고서
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 mb-6 text-gray-700 dark:text-gray-300 leading-relaxed font-medium whitespace-pre-wrap text-sm">
              {analysisResult}
            </div>
            <button 
              onClick={() => setAnalysisResult(null)}
              className="w-full h-14 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white rounded-2xl font-black text-lg active:scale-95 transition-all"
            >확인 완료</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PillBoxView;
