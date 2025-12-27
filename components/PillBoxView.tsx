
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
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-[#101922]/80 backdrop-blur-md px-5 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <h1 className="text-3xl font-black">나의 약통</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </header>

      <div className="px-5 pt-6 flex flex-col gap-6">
        {/* Interaction Check Banner */}
        <section className="bg-white dark:bg-gray-800/50 rounded-[32px] p-6 border-2 border-primary/10 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-lg font-black mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary filled">security</span>
              AI 상호작용 분석
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-4 leading-relaxed">복용 중인 모든 약과 영양제의 안전성을<br/>AI가 실시간으로 분석합니다.</p>
            <button 
              onClick={runInteractionCheck}
              disabled={analyzing}
              className="px-6 py-2.5 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              {analyzing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="material-symbols-outlined text-lg">analytics</span>
              )}
              분석 결과 확인하기
            </button>
          </div>
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-primary/5 text-[120px] select-none group-hover:scale-110 transition-transform">health_metrics</span>
        </section>

        {/* Analysis Modal Placeholder (Simple overlay for demo) */}
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
                className="w-full h-14 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white rounded-2xl font-black text-lg"
              >확인 완료</button>
            </div>
          </div>
        )}

        {/* Tabs */}
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

        {/* Med List */}
        <div className="flex flex-col gap-4">
          {filteredMeds.length > 0 ? filteredMeds.map(med => (
            <div key={med.id} className="bg-white dark:bg-[#1E2936] rounded-[28px] p-5 shadow-sm border border-gray-50 dark:border-gray-800 flex items-center gap-4 active:scale-[0.98] transition-all group">
              <div className="w-20 h-20 rounded-2xl bg-gray-50 dark:bg-gray-800 overflow-hidden relative shrink-0">
                <img src={med.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={med.name} />
                {med.riskLevel === 'medium' && (
                  <div className="absolute top-1 right-1 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-xs filled">priority_high</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xl font-black mb-1 truncate">{med.name}</h4>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-1">
                  <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                  {med.dosage}
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full mt-2">
                  <div className="bg-primary h-full rounded-full" style={{width: `${med.adherenceRate}%`}}></div>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-300">chevron_right</span>
            </div>
          )) : (
            <div className="py-20 text-center flex flex-col items-center gap-4 grayscale opacity-30">
               <span className="material-symbols-outlined text-8xl">inbox</span>
               <p className="font-black text-xl">등록된 항목이 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PillBoxView;
