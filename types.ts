
export type Role = 'member' | 'admin' | 'executive' | 'accountant' | 'secretary' | 'it' | 'guest';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  program: string;
  level: string;
  diocese: string;
  department: string;
  profileImage?: string;
  createdAt: string;
  spiritPoints?: number;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: 'event' | 'news' | 'announcement';
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio';
  author: string;
  date: string;
  startDate?: string;
  endDate?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  status: 'Notice' | 'Urgent' | 'Info';
  color: string;
  isActive: boolean;
}

export interface Leader {
  id: string;
  name: string;
  position: string;
  phone: string;
  academicYear: string;
  image: string;
  type: 'Executive' | 'Arbitration';
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  image?: string;
  category?: string;
  details: string;
  activities: string[];
}

export interface DepartmentInterest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  diocese: string;
  level: string;
  program: string;
  motivation: string;
  experience: string;
  departmentId: string;
  departmentName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface DailyVerse {
  id: string;
  theme: string;
  verse: string;
  reference: string;
  description: string;
  date: string;
  isActive: boolean;
}

export interface VerseReflection {
  id: string;
  verseId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'mcq' | 'open';
  options?: string[]; // For MCQ
  correctAnswer: string;
}

export interface BibleQuiz {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  questions: QuizQuestion[];
  isActive: boolean;
  date: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  total: number;
  timestamp: string;
}

export interface Donation {
  id: string;
  donorName: string;
  email: string;
  phone: string;
  amount: number;
  currency: string;
  category: 'One-time' | 'Monthly' | 'Project-based';
  project?: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  transactionId: string;
}

export interface DonationProject {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  image: string;
  isActive: boolean;
}

export interface HomeConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  motto: string;
  aboutTitle: string;
  aboutText: string;
  aboutImageUrl: string;
  aboutScripture: string;
  aboutScriptureRef: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
}

export interface AboutValue {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface AboutConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  historyTitle: string;
  historyContent: string;
  historyImage: string;
  visionTitle: string;
  visionContent: string;
  missionTitle: string;
  missionContent: string;
  values: AboutValue[];
  timeline: TimelineEvent[];
}
