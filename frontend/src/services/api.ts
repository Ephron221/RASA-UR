import {
  User, NewsItem, Leader, Announcement, Department, DepartmentInterest, ContactMessage,
  HomeConfig, Donation, DonationProject, AboutConfig, FooterConfig,
  DailyVerse, VerseReflection, BibleQuiz, QuizResult, RoleDefinition
} from '../types';
import { db } from './db';

const IS_PROD = process.env.NODE_ENV === 'production';
const API_BASE_URL = IS_PROD
  ? 'https://rasa-ur-nyarugenge-ruby.vercel.app/api'
  : 'http://localhost:5000/api';

const hybridFetch = async (
  endpoint: string,
  method: string = 'GET',
  body?: any,
  fallbackAction?: () => Promise<any>
) => {
  try {
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE_URL}/${endpoint}`, options);

    if (!res.ok) {
      if (method === 'GET' && fallbackAction) {
        return await fallbackAction();
      }
      const errorData = await res.json().catch(() => ({}));
      throw errorData; // Throw the full error object
    }

    if (res.status === 204) return null;
    return await res.json();
  } catch (err: any) {
    if (method === 'GET' && fallbackAction) {
      return await fallbackAction();
    }
    throw err;
  }
};

export const API = {
  auth: {
    login: (email: string, password: string): Promise<User> => hybridFetch('auth/login', 'POST', { email, password }),
    register: (userData: Partial<User>): Promise<{ message: string }> => hybridFetch('auth/register', 'POST', userData),
    verify: (email: string, token: string): Promise<User> => hybridFetch('auth/verify', 'POST', { email, token }),
    resendOtp: (email: string): Promise<{ message: string }> => hybridFetch('auth/resend-otp', 'POST', { email }),
    forgotPassword: (email: string): Promise<{ message: string }> => hybridFetch('auth/forgot-password', 'POST', { email }),
    resetPassword: (email: string, token: string, newPassword: string): Promise<{ message: string }> => hybridFetch('auth/reset-password', 'POST', { email, token, newPassword }),
  },
  members: {
    getAll: (): Promise<User[]> => hybridFetch('members', 'GET', null, () => db.getCollection('members')),
    getReport: (params: any): Promise<User[]> => {
      const query = new URLSearchParams(params).toString();
      return hybridFetch(`members/report?${query}`, 'GET');
    },
    create: (item: Partial<User>) => hybridFetch('members', 'POST', item),
    update: (id: string, updates: Partial<User>) => hybridFetch(`members/${id}`, 'PUT', updates),
    delete: (id: string) => hybridFetch(`members/${id}`, 'DELETE'),
    updateRole: (id: string, role: string) => hybridFetch(`members/${id}/role`, 'PATCH', { role })
  },
  roles: {
    getAll: () => hybridFetch('roles', 'GET', null, () => db.getCollection('roles')),
    create: (item: RoleDefinition) => hybridFetch('roles', 'POST', item),
    update: (id: string, updates: Partial<RoleDefinition>) => hybridFetch(`roles/${id}`, 'PUT', updates),
    delete: (id: string) => hybridFetch(`roles/${id}`, 'DELETE')
  },
  spiritual: {
    verses: {
      getDaily: () => hybridFetch('spiritual/verses/daily', 'GET', null, async () => {
        const vs = await db.getCollection('verses');
        return vs.find(v => v.isActive) || null;
      }),
      getAll: () => hybridFetch('spiritual/verses', 'GET', null, () => db.getCollection('verses')),
      create: (v: DailyVerse) => hybridFetch('spiritual/verses', 'POST', v),
      update: (id: string, updates: any) => hybridFetch(`spiritual/verses/${id}`, 'PUT', updates),
      delete: (id: string) => hybridFetch(`spiritual/verses/${id}`, 'DELETE'),
      addReflection: (r: VerseReflection) => hybridFetch('spiritual/reflections', 'POST', r),
      getReflections: () => hybridFetch('spiritual/reflections', 'GET', null, () => db.getCollection('reflections')),
    },
    quizzes: {
      getAll: () => hybridFetch('spiritual/quizzes', 'GET', null, () => db.getCollection('quizzes')),
      getActive: () => hybridFetch('spiritual/quizzes/active', 'GET', null, async () => {
        const qz = await db.getCollection('quizzes');
        return qz.filter(q => q.isActive);
      }),
      create: (q: BibleQuiz) => hybridFetch('spiritual/quizzes', 'POST', q),
      update: (id: string, updates: any) => hybridFetch(`spiritual/quizzes/${id}`, 'PUT', updates),
      delete: (id: string) => hybridFetch(`spiritual/quizzes/${id}`, 'DELETE'),
      submitResult: (r: QuizResult) => hybridFetch('spiritual/quiz-results', 'POST', r),
      getResults: () => hybridFetch('spiritual/quiz-results', 'GET', null, () => db.getCollection('quizResults')),
    }
  },
  news: {
    getAll: () => hybridFetch('news', 'GET', null, () => db.getCollection('news')),
    create: (item: NewsItem) => hybridFetch('news', 'POST', item),
    update: (id: string, updates: Partial<NewsItem>) => hybridFetch(`news/${id}`, 'PUT', updates),
    delete: (id: string) => hybridFetch(`news/${id}`, 'DELETE')
  },
  leaders: {
    getAll: () => hybridFetch('leaders', 'GET', null, () => db.getCollection('leaders')),
    create: (item: Leader) => hybridFetch('leaders', 'POST', item),
    update: (id: string, updates: Partial<Leader>) => hybridFetch(`leaders/${id}`, 'PUT', updates),
    delete: (id: string) => hybridFetch(`leaders/${id}`, 'DELETE')
  },
  announcements: {
    getAll: () => hybridFetch('announcements', 'GET', null, () => db.getCollection('announcements')),
    create: (item: Announcement) => hybridFetch('announcements', 'POST', item),
    update: (id: string, updates: Partial<Announcement>) => hybridFetch(`announcements/${id}`, 'PUT', updates),
    delete: (id: string) => hybridFetch(`announcements/${id}`, 'DELETE')
  },
  departments: {
    getAll: () => hybridFetch('departments', 'GET', null, () => db.getCollection('departments')),
    create: (item: Department) => hybridFetch('departments', 'POST', item),
    update: (id: string, updates: Partial<Department>) => hybridFetch(`departments/${id}`, 'PUT', updates),
    delete: (id: string) => hybridFetch(`departments/${id}`, 'DELETE'),
    submitInterest: (item: DepartmentInterest) => hybridFetch('departments/interest', 'POST', item),
    getInterests: () => hybridFetch('departments/interests', 'GET', null, () => db.getCollection('interests')),
    updateInterestStatus: (id: string, status: string) => hybridFetch(`departments/interests/${id}/status`, 'PATCH', { status })
  },
  donations: {
    getAll: () => hybridFetch('donations', 'GET', null, () => db.getCollection('donations')),
    create: (item: Donation) => hybridFetch('donations', 'POST', item),
    updateStatus: (id: string, status: string) => hybridFetch(`donations/${id}/status`, 'PATCH', { status }),
    delete: (id: string) => hybridFetch(`donations/${id}`, 'DELETE'),
    projects: {
      getAll: () => hybridFetch('donation-projects', 'GET', null, () => db.getCollection('donationProjects')),
      create: (item: DonationProject) => hybridFetch('donation-projects', 'POST', item),
      update: (id: string, updates: Partial<DonationProject>) => hybridFetch(`donation-projects/${id}`, 'PUT', updates),
      delete: (id: string) => hybridFetch(`donation-projects/${id}`, 'DELETE')
    }
  },
  contacts: {
    getAll: () => hybridFetch('contacts', 'GET', null, () => db.getCollection('contacts')),
    create: (msg: any) => hybridFetch('contacts', 'POST', msg),
    markRead: (id: string) => hybridFetch(`contacts/${id}/read`, 'PATCH'),
    markAllRead: () => hybridFetch(`contacts/read-all`, 'PATCH'),
    delete: (id: string) => hybridFetch(`contacts/${id}`, 'DELETE')
  },
  home: {
    getConfig: () => hybridFetch('config/home', 'GET', null, () => db.getCollection('homeConfig')),
    updateConfig: (updates: Partial<HomeConfig>) => hybridFetch('config/home', 'PUT', updates)
  },
  about: {
    getConfig: () => hybridFetch('config/about', 'GET', null, () => db.getCollection('aboutConfig')),
    updateConfig: (updates: Partial<AboutConfig>) => hybridFetch('config/about', 'PUT', updates)
  },
  footer: {
    getConfig: () => hybridFetch('config/footer', 'GET', null, () => db.getCollection('footerConfig')),
    updateConfig: (updates: Partial<FooterConfig>) => hybridFetch('config/footer', 'PUT', updates)
  },
  system: {
    getHealth: () => hybridFetch('system/health', 'GET', null, async () => db.getHealth()),
    getLogs: () => hybridFetch('system/logs', 'GET', null, () => db.getCollection('logs')),
    getBackups: () => hybridFetch('system/backups', 'GET', null, () => db.getBackups()),
    createBackup: (desc: string) => hybridFetch('system/backups', 'POST', { description: desc }),
    restoreBackup: (id: string) => hybridFetch(`system/backups/${id}/restore`, 'POST'),
    resetDB: () => hybridFetch('system/reset', 'POST')
  }
};
