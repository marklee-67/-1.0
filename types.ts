
export type ViewType = 'home' | 'report' | 'pillbox' | 'mypage' | 'register' | 'ocr-result' | 'pill-verify';

export interface Medication {
  id: string;
  name: string;
  category: 'medicine' | 'supplement';
  dosage: string;
  instruction: string;
  remainingDays: number;
  imageUrl?: string;
  status: 'active' | 'inactive';
  adherenceRate: number;
  riskLevel?: 'high' | 'medium' | 'safe';
  riskDetail?: string;
}

export interface DailyRecordItem {
  id: string;
  time: string;
  label: string;
  name: string;
  instruction: string;
  isCompleted: boolean;
  imageUrl?: string;
}

export interface DailyRecord {
  date: string;
  total: number;
  completed: number;
  items: DailyRecordItem[];
}

export interface UserProfile {
  name: string;
  points: number;
  level: number;
  missionsRemaining: number;
  progress: number;
}
