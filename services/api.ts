
import { db } from './db';
import { User, NewsItem, Leader, Announcement, Department, ContactMessage, HomeConfig, Donation, DonationProject } from '../types';

const LATENCY = 400;
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const API = {
  members: {
    getAll: async () => { await delay(LATENCY); return db.getCollection('members'); },
    create: async (item: User) => { await delay(LATENCY); return db.insert('members', item); },
    update: async (id: string, updates: Partial<User>) => { await delay(LATENCY); return db.update('members', id, updates); },
    delete: async (id: string) => { await delay(LATENCY); return db.delete('members', id); },
    updateRole: async (id: string, role: 'member' | 'admin') => { await delay(LATENCY); return db.update('members', id, { role }); }
  },
  auth: {
    requestOTP: async (email: string) => { await delay(LATENCY); return db.generateOTP(email); },
    verifyOTP: async (email: string, otp: string) => { await delay(LATENCY); return db.verifyOTP(email, otp); },
    resetPassword: async (email: string, newPassword: string) => { await delay(LATENCY); return true; }
  },
  news: {
    getAll: async () => { await delay(LATENCY); return db.getCollection('news'); },
    create: async (item: NewsItem) => { await delay(LATENCY); return db.insert('news', item); },
    update: async (id: string, updates: Partial<NewsItem>) => { await delay(LATENCY); return db.update('news', id, updates); },
    delete: async (id: string) => { await delay(LATENCY); return db.delete('news', id); }
  },
  leaders: {
    getAll: async () => { await delay(LATENCY); return db.getCollection('leaders'); },
    create: async (item: Leader) => { await delay(LATENCY); return db.insert('leaders', item); },
    update: async (id: string, updates: Partial<Leader>) => { await delay(LATENCY); return db.update('leaders', id, updates); },
    delete: async (id: string) => { await delay(LATENCY); return db.delete('leaders', id); }
  },
  announcements: {
    getAll: async () => { await delay(LATENCY); return db.getCollection('announcements'); },
    create: async (item: Announcement) => { await delay(LATENCY); return db.insert('announcements', item); },
    update: async (id: string, updates: Partial<Announcement>) => { await delay(LATENCY); return db.update('announcements', id, updates); },
    delete: async (id: string) => { await delay(LATENCY); return db.delete('announcements', id); }
  },
  departments: {
    getAll: async () => { await delay(LATENCY); return db.getCollection('departments'); },
    create: async (item: Department) => { await delay(LATENCY); return db.insert('departments', item); },
    update: async (id: string, updates: Partial<Department>) => { await delay(LATENCY); return db.update('departments', id, updates); },
    delete: async (id: string) => { await delay(LATENCY); return db.delete('departments', id); }
  },
  donations: {
    getAll: async () => { await delay(LATENCY); return db.getCollection('donations'); },
    create: async (item: Donation) => { await delay(LATENCY); return db.insert('donations', item); },
    updateStatus: async (id: string, status: 'Completed' | 'Pending' | 'Failed') => { await delay(LATENCY); return db.update('donations', id, { status }); },
    delete: async (id: string) => { await delay(LATENCY); return db.delete('donations', id); },
    projects: {
      getAll: async () => { await delay(LATENCY); return db.getCollection('donationProjects'); },
      create: async (item: DonationProject) => { await delay(LATENCY); return db.insert('donationProjects', item); },
      update: async (id: string, updates: Partial<DonationProject>) => { await delay(LATENCY); return db.update('donationProjects', id, updates); },
      delete: async (id: string) => { await delay(LATENCY); return db.delete('donationProjects', id); }
    }
  },
  contacts: {
    getAll: async () => { await delay(LATENCY); return db.getCollection('contacts'); },
    create: async (msg: Omit<ContactMessage, 'id' | 'date' | 'isRead'>) => {
      const fullMsg: ContactMessage = {
        ...msg,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        isRead: false
      };
      return db.insert('contacts', fullMsg);
    },
    markRead: async (id: string) => db.update('contacts', id, { isRead: true }),
    markAllRead: async () => { await delay(LATENCY); return db.markAllRead(); },
    delete: async (id: string) => db.delete('contacts', id)
  },
  home: {
    getConfig: async () => { await delay(LATENCY); return db.getCollection('homeConfig'); },
    updateConfig: async (updates: Partial<HomeConfig>) => { await delay(LATENCY); return db.update('homeConfig', null, updates); }
  },
  system: {
    getHealth: () => db.getHealth(),
    getLogs: async () => { return db.getCollection('logs'); },
    resetDB: () => db.reset()
  }
};
