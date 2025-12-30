
import React, { useState, useEffect } from 'react';
import { ViewType, Medication, UserProfile, DailyRecord, DailyRecordItem } from './types';
import { MOCK_USER, MOCK_MEDICATIONS, MOCK_DAILY_RECORDS } from './constants';
import HomeView from './components/HomeView';
import ReportView from './components/ReportView';
import PillBoxView from './components/PillBoxView';
import MyPageView from './components/MyPageView';
import RegisterView from './components/RegisterView';
import OCRResultView from './components/OCRResultView';
import ReminderPopup from './components/ReminderPopup';
import PillVerificationView from './components/PillVerificationView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [meds, setMeds] = useState<Medication[]>(MOCK_MEDICATIONS);
  const [dailyRecords, setDailyRecords] = useState<DailyRecord>(MOCK_DAILY_RECORDS);
  const [activeTakingItem, setActiveTakingItem] = useState<DailyRecordItem | null>(null);
  const [showReminder, setShowReminder] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  useEffect(() => {
    // 15초 후 복약 알림 팝업 시뮬레이션
    const timer = setTimeout(() => {
      // 'home' 혹은 'report', 'pillbox', 'mypage' 등 메인 탭에 있을 때만 알림을 표시하도록 변경 (레이어 겹침 방지)
      setShowReminder(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  const navigateTo = (view: ViewType) => {
    window.scrollTo(0, 0);
    setCurrentView(view);
  };

  const handleStartTaking = (item: DailyRecordItem) => {
    setActiveTakingItem(item);
    // 복약 확인을 시작할 때는 기존의 다른 팝업을 닫음
    setShowReminder(false);
    navigateTo('pill-verify');
  };

  const handleVerificationComplete = (itemId: string) => {
    setDailyRecords(prev => {
      const newItems = prev.items.map(item => 
        item.id === itemId ? { ...item, isCompleted: true } : item
      );
      const completedCount = newItems.filter(i => i.isCompleted).length;
      return {
        ...prev,
        items: newItems,
        completed: completedCount
      };
    });
    
    setUser(prev => ({
      ...prev,
      points: prev.points + 50,
      progress: Math.min(100, prev.progress + 5)
    }));
    
    navigateTo('home');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomeView user={user} dailyRecords={dailyRecords} onNavigate={navigateTo} onStartTaking={handleStartTaking} />;
      case 'report': return <ReportView onBack={() => navigateTo('home')} />;
      case 'pillbox': return <PillBoxView meds={meds} onNavigate={navigateTo} />;
      case 'mypage': return <MyPageView user={user} onBack={() => navigateTo('home')} />;
      case 'register': return <RegisterView onClose={() => navigateTo('pillbox')} onComplete={(data) => { setOcrResult(data); navigateTo('ocr-result'); }} />;
      case 'ocr-result': return <OCRResultView data={ocrResult} onCancel={() => navigateTo('pillbox')} onConfirm={(newMed) => { setMeds(prev => [...prev, newMed]); navigateTo('pillbox'); }} />;
      case 'pill-verify': return <PillVerificationView item={activeTakingItem} onCancel={() => navigateTo('home')} onComplete={handleVerificationComplete} />;
      default: return <HomeView user={user} dailyRecords={dailyRecords} onNavigate={navigateTo} onStartTaking={handleStartTaking} />;
    }
  };

  // 모달성 뷰들이 활성화되어 있는지 체크
  const isHighPriorityViewActive = ['register', 'ocr-result', 'pill-verify'].includes(currentView);

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="relative w-full max-w-md bg-white dark:bg-[#101922] shadow-2xl overflow-hidden flex flex-col h-screen border-x border-gray-100 dark:border-gray-800">
        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          {renderView()}
        </div>

        {/* 
          이미 카메라를 사용 중이거나 분석 중인 고우선순위 뷰(register, ocr-result, pill-verify)가 떠있다면 
          복약 알림 팝업(ReminderPopup)이 렌더링되지 않도록 하여 레이어 겹침을 방지함.
        */}
        {showReminder && !isHighPriorityViewActive && (
          <ReminderPopup onClose={() => setShowReminder(false)} />
        )}

        {['home', 'report', 'pillbox', 'mypage'].includes(currentView) && (
          <nav className="shrink-0 bg-white/90 dark:bg-[#1A2633]/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 safe-pb pt-2 z-40">
            <div className="grid grid-cols-4 h-16">
              <TabItem icon="home" label="홈" active={currentView === 'home'} onClick={() => navigateTo('home')} />
              <TabItem icon="calendar_today" label="리포트" active={currentView === 'report'} onClick={() => navigateTo('report')} />
              <TabItem icon="medication" label="나의 약" active={currentView === 'pillbox'} onClick={() => navigateTo('pillbox')} />
              <TabItem icon="person" label="프로필" active={currentView === 'mypage'} onClick={() => navigateTo('mypage')} />
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};

const TabItem: React.FC<{icon: string, label: string, active: boolean, onClick: () => void}> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 transition-all ${active ? 'text-primary' : 'text-gray-400'}`}>
    <span className={`material-symbols-outlined ${active ? 'filled scale-110' : ''}`} style={{ fontSize: '26px' }}>{icon}</span>
    <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
  </button>
);

export default App;
