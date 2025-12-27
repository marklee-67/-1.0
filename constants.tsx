
import { Medication, DailyRecord, UserProfile } from './types';

export const MOCK_USER: UserProfile = {
  name: '김철수',
  points: 3500,
  level: 5,
  missionsRemaining: 2,
  progress: 70
};

export const MOCK_MEDICATIONS: Medication[] = [
  {
    id: '1',
    name: '노바스크 정 (혈압약)',
    category: 'medicine',
    dosage: '매일 아침 식전 1알',
    instruction: '매일 아침 식전',
    remainingDays: 14,
    status: 'active',
    adherenceRate: 98,
    riskLevel: 'safe',
    imageUrl: 'https://picsum.photos/id/100/200/200'
  },
  {
    id: '2',
    name: '아스피린 프로텍트정',
    category: 'medicine',
    dosage: '1일 1회, 식후 30분',
    instruction: '매일 점심 식후',
    remainingDays: 28,
    status: 'active',
    adherenceRate: 82,
    riskLevel: 'medium',
    imageUrl: 'https://picsum.photos/id/101/200/200'
  },
  {
    id: '3',
    name: '홍삼 농축액 골드',
    category: 'supplement',
    dosage: '1일 1포 섭취',
    instruction: '식전/식후 무관',
    remainingDays: 15,
    status: 'active',
    adherenceRate: 65,
    riskLevel: 'medium',
    riskDetail: '현재 복용 중인 혈압약과 함께 드시면 혈압 조절에 영향을 줄 수 있습니다.',
    imageUrl: 'https://picsum.photos/id/102/200/200'
  }
];

export const MOCK_DAILY_RECORDS: DailyRecord = {
  date: '2023-10-25',
  total: 3,
  completed: 1,
  items: [
    {
      id: 'dr1',
      time: '08:00',
      label: '아침',
      name: '혈압약 (노바스크)',
      instruction: '식후 30분',
      isCompleted: true,
      imageUrl: 'https://picsum.photos/id/103/100/100'
    },
    {
      id: 'dr2',
      time: '12:30',
      label: '점심',
      name: '비타민 C, 오메가 3',
      instruction: '식후 즉시 복용',
      isCompleted: false,
      imageUrl: 'https://picsum.photos/id/104/100/100'
    },
    {
      id: 'dr3',
      time: '18:00',
      label: '저녁',
      name: '당뇨약',
      instruction: '식전 30분',
      isCompleted: false,
      imageUrl: 'https://picsum.photos/id/105/100/100'
    }
  ]
};
