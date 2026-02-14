
export type UserTier = 'FREE' | 'PAID' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  dealershipName: string;
  country: string;
  tier: UserTier;
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  content: string;
  videoUrl?: string;
  isFree: boolean;
  actionSteps: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Template {
  id: string;
  title: string;
  category: 'Facebook' | 'Ad Copy' | 'WhatsApp' | 'AI Prompts' | 'Reviews';
  content: string;
  isPaidOnly: boolean;
}

export interface UserProgress {
  completedLessonIds: string[];
  lastAccessedLessonId?: string;
}
