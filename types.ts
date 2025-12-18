
export type Role = 'member' | 'admin' | 'guest';

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
  academicYear: string;
  image: string;
  type: 'Executive' | 'Arbitration';
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  details: string;
  activities: string[];
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface HomeConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  motto: string;
}
