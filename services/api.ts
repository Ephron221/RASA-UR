
import { 
  User, NewsItem, Leader, Announcement, Department, DepartmentInterest, ContactMessage, 
  HomeConfig, Donation, DonationProject, AboutConfig,
  DailyVerse, VerseReflection, BibleQuiz, QuizResult
} from '../types';
import { db } from './db';

const API_BASE_URL = 'http://localhost:5000/api';

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
      if (fallbackAction) {
        console.warn(`[API] Server returned ${res.status} for ${endpoint}. Falling back to Local Storage.`);
        return await fallbackAction();
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Server Error: ${res.status}`);
    }
    
    return await res.json();
  } catch (err: any) {
    if (fallbackAction) {
      console.warn(`[API] Connection to ${API_BASE_URL} failed for ${endpoint}. Falling back to Local Storage.`);
      return await fallbackAction();
    }
    throw err;
  }
};

export const API = {
  members: {
    getAll: () => hybridFetch('members', 'GET', null, () => db.getCollection('members')),
    create: (item: User) => hybridFetch('members', 'POST', item, () => db.insert('members', item)),
    update: (id: string, updates: Partial<User>) => hybridFetch(`members/${id}`, 'PUT', updates, () => db.update('members', id, updates)),
    delete: (id: string) => hybridFetch(`members/${id}`, 'DELETE', null, () => db.delete('members', id)),
    updateRole: (id: string, role: string) => hybridFetch(`members/${id}/role`, 'PATCH', { role }, () => db.update('members', id, { role }))
  },
  auth: {
    requestOTP: (email: string) => hybridFetch('auth/otp', 'POST', { email }, () => db.generateOTP(email)),
    verifyOTP: (email: string, otp: string) => hybridFetch('auth/verify', 'POST', { email, otp }, () => db.verifyOTP(email, otp)),
    resetPassword: (email: string, pass: string) => hybridFetch('auth/reset', 'POST', { email, newPassword: pass }, () => db.update('members', null, { email, password: pass }))
  },
  spiritual: {
    verses: {
      getDaily: () => hybridFetch('spiritual/verses/daily', 'GET', null, async () => {
        const vs = await db.getCollection('verses');
        return vs.find(v => v.isActive) || null;
      }),
      getAll: () => hybridFetch('spiritual/verses', 'GET', null, () => db.getCollection('verses')),
      create: (v: DailyVerse) => hybridFetch('spiritual/verses', 'POST', v, () => db.insert('verses', v)),
      update: (id: string, updates: any) => hybridFetch(`spiritual/verses/${id}`, 'PUT', updates, () => db.update('verses', id, updates)),
      delete: (id: string) => hybridFetch(`spiritual/verses/${id}`, 'DELETE', null, () => db.delete('verses', id)),
      addReflection: (r: VerseReflection) => hybridFetch('spiritual/reflections', 'POST', r, () => db.insert('reflections', r)),
      getReflections: () => hybridFetch('spiritual/reflections', 'GET', null, () => db.getCollection('reflections'))
    },
    quizzes: {
      getAll: () => hybridFetch('spiritual/quizzes', 'GET', null, () => db.getCollection('quizzes')),
      getActive: () => hybridFetch('spiritual/quizzes/active', 'GET', null, async () => {
        const qz = await db.getCollection('quizzes');
        return qz.filter(q => q.isActive);
      }),
      create: (q: BibleQuiz) => hybridFetch('spiritual/quizzes', 'POST', q, () => db.insert('quizzes', q)),
      update: (id: string, updates: any) => hybridFetch(`spiritual/quizzes/${id}`, 'PUT', updates, () => db.update('quizzes', id, updates)),
      delete: (id: string) => hybridFetch(`spiritual/quizzes/${id}`, 'DELETE', null, () => db.delete('quizzes', id)),
      submitResult: (r: QuizResult) => hybridFetch('spiritual/quiz-results', 'POST', r, async () => {
        const res = await db.insert('quizResults', r);
        // Add Spirit Points to user
        const points = Math.floor((r.score / r.total) * 100);
        await db.update('members', r.userId, { spiritPoints: (points || 0) });
        return res;
      }),
      getResults: () => hybridFetch('spiritual/quiz-results', 'GET', null, () => db.getCollection('quizResults'))
    }
  },
  news: {
    getAll: () => hybridFetch('news', 'GET', null, () => db.getCollection('news')),
    create: (item: NewsItem) => hybridFetch('news', 'POST', item, () => db.insert('news', item)),
    update: (id: string, updates: Partial<NewsItem>) => hybridFetch(`news/${id}`, 'PUT', updates, () => db.update('news', id, updates)),
    delete: (id: string) => hybridFetch(`news/${id}`, 'DELETE', null, () => db.delete('news', id))
  },
  leaders: {
    getAll: () => hybridFetch('leaders', 'GET', null, () => db.getCollection('leaders')),
    create: (item: Leader) => hybridFetch('leaders', 'POST', item, () => db.insert('leaders', item)),
    update: (id: string, updates: Partial<Leader>) => hybridFetch(`leaders/${id}`, 'PUT', updates, () => db.update('leaders', id, updates)),
    delete: (id: string) => hybridFetch(`leaders/${id}`, 'DELETE', null, () => db.delete('leaders', id))
  },
  announcements: {
    getAll: () => hybridFetch('announcements', 'GET', null, () => db.getCollection('announcements')),
    create: (item: Announcement) => hybridFetch('announcements', 'POST', item, () => db.insert('announcements', item)),
    update: (id: string, updates: Partial<Announcement>) => hybridFetch(`announcements/${id}`, 'PUT', updates, () => db.update('announcements', id, updates)),
    delete: (id: string) => hybridFetch(`announcements/${id}`, 'DELETE', null, () => db.delete('announcements', id))
  },
  departments: {
    getAll: () => hybridFetch('departments', 'GET', null, () => db.getCollection('departments')),
    create: (item: Department) => hybridFetch('departments', 'POST', item, () => db.insert('departments', item)),
    update: (id: string, updates: Partial<Department>) => hybridFetch(`departments/${id}`, 'PUT', updates, () => db.update('departments', id, updates)),
    delete: (id: string) => hybridFetch(`departments/${id}`, 'DELETE', null, () => db.delete('departments', id)),
    // RECRUITMENT METHODS
    submitInterest: (item: DepartmentInterest) => hybridFetch('departments/interest', 'POST', item, () => db.insert('interests', item)),
    getInterests: () => hybridFetch('departments/interests', 'GET', null, () => db.getCollection('interests')),
    updateInterestStatus: (id: string, status: string) => hybridFetch(`departments/interests/${id}/status`, 'PATCH', { status }, () => db.update('interests', id, { status })),
    deleteInterest: (id: string) => hybridFetch(`departments/interests/${id}`, 'DELETE', null, () => db.delete('interests', id))
  },
  donations: {
    getAll: () => hybridFetch('donations', 'GET', null, () => db.getCollection('donations')),
    create: (item: Donation) => hybridFetch('donations', 'POST', item, () => db.insert('donations', item)),
    updateStatus: (id: string, status: string) => hybridFetch(`donations/${id}/status`, 'PATCH', { status }, () => db.update('donations', id, { status })),
    delete: (id: string) => hybridFetch(`donations/${id}`, 'DELETE', null, () => db.delete('donations', id)),
    projects: {
      getAll: () => hybridFetch('donation-projects', 'GET', null, () => db.getCollection('donationProjects')),
      create: (item: DonationProject) => hybridFetch('donation-projects', 'POST', item, () => db.insert('donationProjects', item)),
      update: (id: string, updates: Partial<DonationProject>) => hybridFetch(`donation-projects/${id}`, 'PUT', updates, () => db.update('donationProjects', id, updates)),
      delete: (id: string) => hybridFetch(`donation-projects/${id}`, 'DELETE', null, () => db.delete('donationProjects', id))
    }
  },
  contacts: {
    getAll: () => hybridFetch('contacts', 'GET', null, () => db.getCollection('contacts')),
    create: (msg: any) => hybridFetch('contacts', 'POST', msg, () => db.insert('contacts', { ...msg, id: Date.now().toString(), date: new Date().toISOString(), isRead: false })),
    markRead: (id: string) => hybridFetch(`contacts/${id}/read`, 'PATCH', null, () => db.update('contacts', id, { isRead: true })),
    markAllRead: () => hybridFetch(`contacts/read-all`, 'PATCH', null, () => db.markAllRead()),
    delete: (id: string) => hybridFetch(`contacts/${id}`, 'DELETE', null, () => db.delete('contacts', id))
  },
  home: {
    getConfig: () => hybridFetch('config/home', 'GET', null, () => db.getCollection('homeConfig')),
    updateConfig: (updates: Partial<HomeConfig>) => hybridFetch('config/home', 'PUT', updates, () => db.update('homeConfig', null, updates))
  },
  about: {
    getConfig: () => hybridFetch('config/about', 'GET', null, () => db.getCollection('aboutConfig')),
    updateConfig: (updates: Partial<AboutConfig>) => hybridFetch('config/about', 'PUT', updates, () => db.update('aboutConfig', null, updates))
  },
  system: {
    getHealth: () => hybridFetch('system/health', 'GET', null, async () => db.getHealth()),
    getLogs: () => hybridFetch('system/logs', 'GET', null, () => db.getCollection('logs')),
    getBackups: () => hybridFetch('system/backups', 'GET', null, () => db.getBackups()),
    createBackup: (desc: string) => hybridFetch('system/backups', 'POST', { description: desc }, () => db.createBackup(desc)),
    restoreBackup: (id: string) => hybridFetch(`system/backups/${id}/restore`, 'POST', null, () => db.restoreFromBackup(id)),
    resetDB: () => hybridFetch('system/reset', 'POST', null, async () => { db.reset(); return true; })
  }
};
