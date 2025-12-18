
import { User, NewsItem, Leader, Announcement, Department, ContactMessage, HomeConfig } from '../types';

const DB_NAME = 'rasa_db';

interface DatabaseSchema {
  members: User[];
  news: NewsItem[];
  leaders: Leader[];
  announcements: Announcement[];
  departments: Department[];
  contacts: ContactMessage[];
  homeConfig: HomeConfig;
  logs: { id: string; action: string; timestamp: string }[];
  otps: { email: string; otp: string; expires: number }[];
}

const INITIAL_DATA: DatabaseSchema = {
  members: [
    { id: 'admin-1', fullName: 'RASA Senior Admin', email: 'esront21@gmail.com', phone: '+250 788 999 999', role: 'admin', program: 'Administration', level: 'N/A', diocese: 'Kigali', department: 'Executive', createdAt: '2021-01-01' },
    { id: 'u1', fullName: 'Kevin Bizimana', email: 'kevin@test.com', phone: '+250 788 000 001', role: 'member', program: 'Architecture', level: 'Level 2', diocese: 'Kigali', department: 'Evangelisation', createdAt: '2023-01-10' },
  ],
  news: [
    { id: '1', title: 'Grand Fellowship Service 2024', content: 'Join us for a spirit-filled mass fellowship this Sunday at the Student Center.', category: 'event', mediaUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop', mediaType: 'image', author: 'Admin', date: '2024-03-20' },
  ],
  leaders: [
    { id: 'l1', name: 'Alain Christian', position: 'President', academicYear: '2024-2025', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop', type: 'Executive' }
  ],
  announcements: [
    { id: 'a1', title: 'Mid-week Prayer Resumption', content: 'Weekly Wednesday prayers resume at the main chapel starting 6 PM.', date: '2024-03-24', status: 'Notice', color: 'bg-cyan-500', isActive: true }
  ],
  departments: [
    { id: '1', name: 'Call on Jesus', description: 'The heartbeat of revival and corporate prayer.', icon: 'Flame', details: 'Dedicated to igniting spiritual revival.', activities: ['Weekly Revival Nights', 'Prayer Retreats'] }
  ],
  contacts: [
    { id: 'c1', fullName: 'Test User', email: 'test@student.ac.rw', subject: 'Inquiry', message: 'Hello RASA, I would like to join the worship team.', date: new Date().toISOString(), isRead: false }
  ],
  homeConfig: {
    heroTitle: 'Showing Christ to Academicians',
    heroSubtitle: '"Agakiza, Urukundo, Umurimo" — A journey of faith, service, and excellence.',
    heroImageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop',
    motto: 'Est. 1997 • Rwanda Anglican Students'
  },
  logs: [],
  otps: []
};

class SimulatedDB {
  private data: DatabaseSchema;

  constructor() {
    const saved = localStorage.getItem(DB_NAME);
    this.data = saved ? JSON.parse(saved) : INITIAL_DATA;
    if (!saved) this.save();
  }

  private save() {
    localStorage.setItem(DB_NAME, JSON.stringify(this.data));
  }

  private log(action: string) {
    this.data.logs.unshift({ id: Math.random().toString(36).substr(2, 9), action, timestamp: new Date().toISOString() });
    this.data.logs = this.data.logs.slice(0, 50);
    this.save();
  }

  async getCollection<T extends keyof DatabaseSchema>(collection: T): Promise<DatabaseSchema[T]> {
    return this.data[collection];
  }

  async insert<T extends keyof DatabaseSchema>(collection: T, item: any) {
    (this.data[collection] as any[]).unshift(item);
    this.log(`Inserted into ${collection}`);
    this.save();
    return item;
  }

  async update<T extends keyof DatabaseSchema>(collection: T, id: string | null, updates: any) {
    if (collection === 'homeConfig') {
      this.data.homeConfig = { ...this.data.homeConfig, ...updates };
      this.log(`Updated Site Configuration`);
    } else {
      const arr = this.data[collection] as any[];
      const idx = arr.findIndex(i => i.id === id);
      if (idx !== -1) {
        arr[idx] = { ...arr[idx], ...updates };
        this.log(`Updated ${collection} ID ${id}`);
      }
    }
    this.save();
    return true;
  }

  async delete<T extends keyof DatabaseSchema>(collection: T, id: string) {
    const arr = this.data[collection] as any[];
    const idx = arr.findIndex(i => i.id === id);
    if (idx !== -1) {
      arr.splice(idx, 1);
      this.log(`Deleted from ${collection} ID ${id}`);
      this.save();
      return true;
    }
    return false;
  }

  async markAllRead() {
    this.data.contacts.forEach(c => c.isRead = true);
    this.log(`Marked all messages as read`);
    this.save();
    return true;
  }

  async generateOTP(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.data.otps.push({ email, otp, expires: Date.now() + 600000 });
    this.log(`Generated OTP for ${email}`);
    this.save();
    console.log(`[SIMULATED EMAIL] OTP for ${email}: ${otp}`);
    return true;
  }

  async verifyOTP(email: string, otp: string) {
    const idx = this.data.otps.findIndex(o => o.email === email && o.otp === otp && o.expires > Date.now());
    if (idx !== -1) {
      this.data.otps.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  getHealth() {
    const raw = localStorage.getItem(DB_NAME) || '';
    return {
      status: 'Online',
      size: `${(new Blob([raw]).size / 1024).toFixed(2)} KB`,
      collections: Object.keys(this.data).length,
      lastSync: new Date().toLocaleTimeString()
    };
  }

  reset() {
    localStorage.removeItem(DB_NAME);
    window.location.reload();
  }
}

export const db = new SimulatedDB();
