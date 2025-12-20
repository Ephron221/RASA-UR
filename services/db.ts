
import { User, NewsItem, Leader, Announcement, Department, ContactMessage, HomeConfig, Donation, DonationProject } from '../types';

const DB_NAME = 'rasa_db';

interface DatabaseSchema {
  members: User[];
  news: NewsItem[];
  leaders: Leader[];
  announcements: Announcement[];
  departments: Department[];
  contacts: ContactMessage[];
  donations: Donation[];
  donationProjects: DonationProject[];
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
    { id: '1', title: 'Grand Fellowship Service 2024', content: 'Join us for a spirit-filled mass fellowship this Sunday at the Student Center. We will have guest ministers from across Kigali.', category: 'event', mediaUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop', mediaType: 'image', author: 'Admin', date: '2024-03-20' },
  ],
  leaders: [
    { id: 'l1', name: 'Yves Mbaraga Igiraneza', position: 'Representative', phone: '+250 787 191 437', academicYear: '2024-2025', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop', type: 'Executive' },
    { id: 'l2', name: 'Xavier Ahishakiye', position: 'First Vice-President', phone: '+250 784 933 503', academicYear: '2024-2025', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop', type: 'Executive' },
    { id: 'l3', name: 'Delice Umuhoza Twahirwa', position: 'Second Vice-President', phone: '+250 780 473 147', academicYear: '2024-2025', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop', type: 'Executive' },
    { id: 'l4', name: 'Latifa Uwaberat', position: 'Secretary', phone: '+250 781 663 746', academicYear: '2024-2025', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop', type: 'Executive' },
    { id: 'l5', name: 'Esron Tuyishimire', position: 'Board Chair', phone: '+250 787 846 433', academicYear: '2024-2025', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop', type: 'Arbitration' }
  ],
  announcements: [
    { id: 'a1', title: 'Mid-week Prayer Resumption', content: 'Weekly Wednesday prayers resume at the main chapel starting 6 PM.', date: '2024-03-24', status: 'Notice', color: 'bg-cyan-500', isActive: true }
  ],
  departments: [
    { 
      id: '1', 
      name: 'Call on Jesus', 
      description: 'The heartbeat of revival and corporate prayer.', 
      icon: 'Flame', 
      category: 'Spiritual Pillar',
      image: 'https://images.unsplash.com/photo-1544427928-c49cdfebf193?q=80&w=2000',
      details: 'Call on Jesus is dedicated to igniting spiritual revival through intense, focused prayer and scripture-based meditation.', 
      activities: ['Weekly Revival Nights', 'Prayer Retreats', 'Fasting Fellowships'] 
    }
  ],
  contacts: [
    { id: 'c1', fullName: 'Test User', email: 'test@student.ac.rw', phone: '+250 787 846 433', subject: 'Inquiry', message: 'Hello RASA, I would like to join the worship team.', date: new Date().toISOString(), isRead: false }
  ],
  donations: [
    { id: 'd1', donorName: 'Post RASA Alumni', email: 'alumni@test.com', phone: '+250 788 000 001', amount: 50000, currency: 'RWF', category: 'Project-based', project: 'New Sound System', date: '2024-03-10', status: 'Completed', transactionId: 'TX12345678' }
  ],
  donationProjects: [
    { id: 'p1', title: 'New Sound System', description: 'Upgrading our chapel speakers and microphones for better worship quality.', goal: 2000000, raised: 750000, image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070', isActive: true },
    { id: 'p2', title: 'Mission to Eastern Province', description: 'Supporting our Evangelization department for a weekend-long campus outreach.', goal: 500000, raised: 120000, image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2070', isActive: true }
  ],
  homeConfig: {
    heroTitle: 'Showing Christ to Academicians',
    heroSubtitle: '"Agakiza, Urukundo, Umurimo" — A journey of faith, service, and excellence at UR Nyarugenge.',
    heroImageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop',
    motto: 'Est. 1997 • RASA UR-Nyarugenge',
    aboutTitle: 'Our Sacred Vision',
    aboutText: 'RASA UR-Nyarugenge is more than an association; it is a family of students united by the Great Commission. Founded in the fires of revival in 1997, we exist to empower students to live out their faith in the university ecosystem.',
    aboutImageUrl: 'https://images.unsplash.com/photo-1544427928-c49cdfebf193?q=80&w=2000',
    aboutScripture: 'Until we all reach unity in the faith...',
    aboutScriptureRef: 'EPHESIANS 4:13',
    stat1Value: '1.2k+',
    stat1Label: 'ACTIVE MEMBERS',
    stat2Value: '10+',
    stat2Label: 'MINISTRIES'
  },
  logs: [],
  otps: []
};

class SimulatedDB {
  private data: DatabaseSchema;

  constructor() {
    const saved = localStorage.getItem(DB_NAME);
    this.data = saved ? JSON.parse(saved) : INITIAL_DATA;
    // Migration for donations if they don't exist in existing data
    if (saved) {
      let migrated = false;
      if (!this.data.donations) { this.data.donations = INITIAL_DATA.donations; migrated = true; }
      if (!this.data.donationProjects) { this.data.donationProjects = INITIAL_DATA.donationProjects; migrated = true; }
      if (migrated) this.save();
    } else {
      this.save();
    }
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
