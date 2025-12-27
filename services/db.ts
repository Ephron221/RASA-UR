
import { 
  User, NewsItem, Leader, Announcement, Department, DepartmentInterest, ContactMessage, 
  HomeConfig, Donation, DonationProject, AboutConfig,
  DailyVerse, VerseReflection, BibleQuiz, QuizResult
} from '../types';

const DB_NAME = 'rasa_db';
const BACKUP_KEY = 'rasa_db_backups';

interface DatabaseSchema {
  members: (User & { password?: string })[];
  news: NewsItem[];
  leaders: Leader[];
  announcements: Announcement[];
  departments: Department[];
  interests: DepartmentInterest[];
  contacts: ContactMessage[];
  donations: Donation[];
  donationProjects: DonationProject[];
  homeConfig: HomeConfig;
  aboutConfig: AboutConfig;
  logs: { id: string; action: string; timestamp: string }[];
  otps: { email: string; otp: string; expires: number }[];
  verses: DailyVerse[];
  reflections: VerseReflection[];
  quizzes: BibleQuiz[];
  quizResults: QuizResult[];
}

export interface BackupEntry {
  id: string;
  timestamp: string;
  size: string;
  description: string;
  data: DatabaseSchema;
}

const INITIAL_DATA: DatabaseSchema = {
  members: [
    { 
      id: 'it-super-master', 
      fullName: 'Esron Tuyishime (IT)', 
      email: 'ephrontuyishime21@gmail.com', 
      password: 'Diano21%',
      phone: '+250 787 846 433', 
      role: 'it', 
      program: 'Software Engineering & IT', 
      level: 'Expert', 
      diocese: 'Kigali', 
      department: 'IT & Infrastructure', 
      createdAt: '1997-01-01',
      spiritPoints: 2500
    }
  ],
  verses: [
    {
      id: 'v1',
      theme: 'The Strength of Unity',
      verse: 'Behold, how good and how pleasant it is for brethren to dwell together in unity!',
      reference: 'Psalm 133:1',
      description: 'As RASA members, our unity is the fragrance that draws others to Christ.',
      date: new Date().toISOString().split('T')[0],
      isActive: true
    }
  ],
  quizzes: [
    {
      id: 'q1',
      title: 'Weekly Spiritual Checkup',
      description: 'A test on the Book of Acts and RASA History.',
      timeLimit: 5,
      isActive: true,
      date: new Date().toISOString().split('T')[0],
      questions: [
        { id: 'ques1', text: 'Where was RASA founded in 1997?', type: 'mcq', options: ['Kigali', 'Butare', 'Musanze', 'Gisenyi'], correctAnswer: 'Butare' },
        { id: 'ques2', text: 'Who was the first Christian martyr in Acts?', type: 'mcq', options: ['Peter', 'Paul', 'Stephen', 'James'], correctAnswer: 'Stephen' }
      ]
    }
  ],
  reflections: [],
  quizResults: [],
  news: [
    { id: '1', title: 'Grand Fellowship Service 2024', content: 'Join us for a spirit-filled mass fellowship this Sunday at the Student Center.', category: 'event', mediaUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070', mediaType: 'image', author: 'Admin', date: '2024-03-20' },
  ],
  leaders: [
    { id: 'l1', name: 'Yves Mbaraga Igiraneza', position: 'Representative', phone: '+250 787 191 437', academicYear: '2024-2025', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800', type: 'Executive' },
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
  interests: [],
  contacts: [],
  donations: [],
  donationProjects: [
    { id: 'p1', title: 'New Sound System', description: 'Upgrading our chapel speakers and microphones.', goal: 2000000, raised: 750000, image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0', isActive: true },
  ],
  homeConfig: {
    heroTitle: 'Showing Christ to Academicians',
    heroSubtitle: '"Agakiza, Urukundo, Umurimo" — A journey of faith, service, and excellence at UR Nyarugenge.',
    heroImageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070',
    motto: 'Est. 1997 • RASA UR-Nyarugenge',
    aboutTitle: 'Our Sacred Vision',
    aboutText: 'RASA UR-Nyarugenge is more than an association; it is a family of students united by the Great Commission.',
    aboutImageUrl: 'https://images.unsplash.com/photo-1544427928-c49cdfebf193?q=80&w=2000',
    aboutScripture: 'Until we all reach unity in the faith...',
    aboutScriptureRef: 'EPHESIANS 4:13',
    stat1Value: '1.2k+',
    stat1Label: 'ACTIVE MEMBERS',
    stat2Value: '10+',
    stat2Label: 'MINISTRIES'
  },
  aboutConfig: {
    heroTitle: 'Our Eternal Genesis',
    heroSubtitle: 'A legacy of faith, resilience, and spiritual awakening.',
    heroImage: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070',
    historyTitle: 'A Journey Through Fire & Grace',
    historyContent: 'The Rwanda Anglican Students Association (RASA) was born in 1997 at the former UNR Butare.',
    historyImage: 'https://images.unsplash.com/photo-1544427928-c49cdfebf193?q=80&w=2000',
    visionTitle: 'Our Vision',
    visionContent: 'To become a vibrant spiritual hub...',
    missionTitle: 'Our Mission',
    missionContent: 'To proclaim the Gospel of Jesus Christ among academicians...',
    values: [
      { id: 'v1', title: 'Salvation', description: 'Total reliance on grace.', icon: 'Cross' },
    ],
    timeline: [
      { id: 't1', year: '1997', title: 'The Genesis', description: 'RASA founded at UNR Butare campus.' },
    ]
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
    this.log(`CRUD: Insert into ${collection}`);
    this.save();
    return item;
  }

  async update<T extends keyof DatabaseSchema>(collection: T, id: string | null, updates: any) {
    if (collection === 'homeConfig' || collection === 'aboutConfig') {
      (this.data as any)[collection] = { ...(this.data as any)[collection], ...updates };
    } else {
      const arr = this.data[collection] as any[];
      const idx = arr.findIndex(i => i.id === id);
      if (idx !== -1) {
        arr[idx] = { ...arr[idx], ...updates };
        this.log(`CRUD: Update ${collection} ID ${id}`);
      }
    }
    this.save();
    return true;
  }

  async delete<T extends keyof DatabaseSchema>(collection: T, id: string) {
    await this.createBackup(`Auto-Snapshot: Pre-deletion in ${collection}`);
    const arr = this.data[collection] as any[];
    const idx = arr.findIndex(i => i.id === id);
    if (idx !== -1) {
      arr.splice(idx, 1);
      this.log(`SECURITY: Deleted record from ${collection}`);
      this.save();
      return true;
    }
    return false;
  }

  async createBackup(description: string = 'Manual Snapshot') {
    const backupsRaw = localStorage.getItem(BACKUP_KEY);
    const backups: BackupEntry[] = backupsRaw ? JSON.parse(backupsRaw) : [];
    const rawData = JSON.stringify(this.data);
    const newBackup: BackupEntry = {
      id: `SN-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      size: `${(new Blob([rawData]).size / 1024).toFixed(2)} KB`,
      description,
      data: JSON.parse(rawData)
    };
    backups.unshift(newBackup);
    localStorage.setItem(BACKUP_KEY, JSON.stringify(backups.slice(0, 15)));
    this.log(`SYSTEM: Generated state snapshot ${newBackup.id}`);
    return newBackup;
  }

  async getBackups(): Promise<BackupEntry[]> {
    const backupsRaw = localStorage.getItem(BACKUP_KEY);
    return backupsRaw ? JSON.parse(backupsRaw) : [];
  }

  async restoreFromBackup(backupId: string) {
    const backupsRaw = localStorage.getItem(BACKUP_KEY);
    if (!backupsRaw) return false;
    const backups: BackupEntry[] = JSON.parse(backupsRaw);
    const backup = backups.find(b => b.id === backupId);
    if (backup) {
      this.data = backup.data;
      this.save();
      this.log(`SYSTEM: Restored from snapshot ${backup.id}`);
      return true;
    }
    return false;
  }

  async markAllRead() {
    this.data.contacts.forEach(c => c.isRead = true);
    this.log(`CRUD: All contacts marked as read`);
    this.save();
    return true;
  }

  async generateOTP(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;
    this.data.otps = this.data.otps.filter(o => o.email !== email);
    this.data.otps.push({ email, otp, expires });
    this.save();
    this.log(`AUTH: Generated OTP for ${email}`);
    return { success: true, otp }; 
  }

  async verifyOTP(email: string, otp: string) {
    const record = this.data.otps.find(o => o.email === email && o.otp === otp && o.expires > Date.now());
    if (record) {
      this.data.otps = this.data.otps.filter(o => o.email !== email);
      this.save();
      this.log(`AUTH: OTP verified for ${email}`);
      return true;
    }
    return false;
  }

  async verifyMember(email: string, pass: string): Promise<User | null> {
    const user = this.data.members.find(m => m.email.toLowerCase() === email.toLowerCase() && m.password === pass);
    if (user) {
      const { password, ...userWithoutPass } = user;
      return userWithoutPass as User;
    }
    return null;
  }

  getHealth() {
    const raw = localStorage.getItem(DB_NAME) || '';
    return {
      status: 'Online',
      size: `${(new Blob([raw]).size / 1024).toFixed(2)} KB`,
      collections: Object.keys(this.data).length,
      lastSync: new Date().toLocaleTimeString(),
      uptime: '100%',
      version: '2.5.0-RecoveryEnabled'
    };
  }

  reset() {
    this.createBackup('Pre-reset archival snapshot');
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.save();
    window.location.reload();
  }
}

export const db = new SimulatedDB();
