import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import {
  News, Leader, Announcement, Member,
  Department, ContactMessage, DepartmentInterest,
  HomeConfig, SystemLog, DailyVerse, BibleQuiz, QuizResult, AboutConfig, FooterConfig,
  VerseReflection, Donation, DonationProject
} from './models';
import { sendPasswordResetEmail, sendVerificationEmail } from './email';

dotenv.config();

const app = express();

// --- CORS CONFIGURATION ---
const whitelist = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://rasaur-nyarugenge.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-Api-Version']
}));

app.use(express.json({ limit: '50mb' }));

// --- LOGGING ---
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- DATABASE CONNECTION ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rasa_portal';
if (mongoose.connection.readyState === 0) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('✅ KERNEL ONLINE: MongoDB Connected');
      bootstrapAdmin();
    })
    .catch(err => console.error('❌ KERNEL OFFLINE:', err));
}

// --- AUTH ENDPOINTS ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Member.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.isVerified) return res.status(401).json({ error: 'Account not verified. Check your email.' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    res.json(user);
  } catch (err: any) { res.status(500).json({ error: 'Login failed' }); }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email } = req.body;
    let user = await Member.findOne({ email });
    if (user && user.isVerified) return res.status(409).json({ error: 'Email already exists.' });
    const token = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 3600000);
    if (user) {
      user.set({ ...req.body, verificationToken: token, verificationExpires: expiry });
    } else {
      user = new Member({ ...req.body, isVerified: false, verificationToken: token, verificationExpires: expiry });
    }
    await user.save();
    await sendVerificationEmail(user.email, token);
    res.status(201).json({ message: 'Verification code sent to email.' });
  } catch (err: any) { res.status(500).json({ error: 'Registration failed', details: err.message }); }
});

app.post('/api/auth/verify', async (req, res) => {
  try {
    const { email, token } = req.body;
    const user = await Member.findOne({ email, verificationToken: token, verificationExpires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token.' });
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();
    res.json(user);
  } catch (err: any) { res.status(500).json({ error: 'Verification failed' }); }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Member.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const token = crypto.randomInt(100000, 999999).toString();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();
    await sendPasswordResetEmail(user.email, token);
    res.json({ message: 'Reset code sent to email.' });
  } catch (err: any) { res.status(500).json({ error: 'Request failed' }); }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    const user = await Member.findOne({ email, resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token.' });
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Success' });
  } catch (err: any) { res.status(500).json({ error: 'Failed' }); }
});

// --- MEMBERS & REPORTS ---
app.get('/api/members', async (req, res) => res.json(await Member.find().sort({ createdAt: -1 })));
app.get('/api/members/report', async (req, res) => {
  try {
    const { year, name, gender, level, program, diocese } = req.query;
    const filter: any = {};
    if (year) filter.academicYear = year;
    if (name) filter.fullName = { $regex: name, $options: 'i' };
    if (gender) filter.gender = gender;
    if (level) filter.level = level;
    if (program) filter.program = program;
    if (diocese) filter.diocese = diocese;
    res.json(await Member.find(filter).sort({ fullName: 1 }));
  } catch (err: any) { res.status(500).json({ error: 'Report failed' }); }
});

app.put('/api/members/:id', async (req, res) => {
  const m = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(m);
});
app.patch('/api/members/:id/role', async (req, res) => {
  res.json(await Member.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }));
});
app.delete('/api/members/:id', async (req, res) => {
  await Member.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// --- LEADERS ---
app.get('/api/leaders', async (req, res) => res.json(await Leader.find().sort({ name: 1 })));
app.post('/api/leaders', async (req, res) => res.status(201).json(await new Leader(req.body).save()));
app.put('/api/leaders/:id', async (req, res) => res.json(await Leader.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete('/api/leaders/:id', async (req, res) => {
  await Leader.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// --- DONATIONS ---
app.get('/api/donations', async (req, res) => res.json(await Donation.find().sort({ date: -1 })));
app.post('/api/donations', async (req, res) => {
  const d = new Donation(req.body);
  if (!d.transactionId) d.transactionId = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  await d.save();
  res.status(201).json(d);
});
app.patch('/api/donations/:id/status', async (req, res) => {
  const d = await Donation.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (req.body.status === 'Completed' && d?.project) {
    await DonationProject.findOneAndUpdate({ title: d.project }, { $inc: { raised: d.amount } });
  }
  res.json(d);
});
app.get('/api/donation-projects', async (req, res) => res.json(await DonationProject.find()));
app.post('/api/donation-projects', async (req, res) => res.status(201).json(await new DonationProject(req.body).save()));
app.put('/api/donation-projects/:id', async (req, res) => res.json(await DonationProject.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete('/api/donation-projects/:id', async (req, res) => {
  await DonationProject.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// --- SPIRITUAL ---
app.get('/api/spiritual/verses', async (req, res) => res.json(await DailyVerse.find().sort({ date: -1 })));
app.post('/api/spiritual/verses', async (req, res) => res.status(201).json(await new DailyVerse(req.body).save()));
app.put('/api/spiritual/verses/:id', async (req, res) => res.json(await DailyVerse.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete('/api/spiritual/verses/:id', async (req, res) => {
  await DailyVerse.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
app.get('/api/spiritual/verses/daily', async (req, res) => res.json(await DailyVerse.findOne({ isActive: true }).sort({ date: -1 }) || {}));
app.get('/api/spiritual/quizzes', async (req, res) => res.json(await BibleQuiz.find()));
app.get('/api/spiritual/quizzes/active', async (req, res) => res.json(await BibleQuiz.find({ isActive: true })));
app.post('/api/spiritual/quizzes', async (req, res) => res.status(201).json(await new BibleQuiz(req.body).save()));
app.put('/api/spiritual/quizzes/:id', async (req, res) => res.json(await BibleQuiz.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete('/api/spiritual/quizzes/:id', async (req, res) => {
  await BibleQuiz.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
app.get('/api/spiritual/reflections', async (req, res) => res.json(await VerseReflection.find().sort({ createdAt: -1 })));
app.post('/api/spiritual/reflections', async (req, res) => res.status(201).json(await new VerseReflection(req.body).save()));
app.get('/api/spiritual/quiz-results', async (req, res) => res.json(await QuizResult.find().sort({ createdAt: -1 })));
app.post('/api/spiritual/quiz-results', async (req, res) => res.status(201).json(await new QuizResult(req.body).save()));

// --- CMS ---
app.get('/api/news', async (req, res) => res.json(await News.find().sort({ date: -1 })));
app.post('/api/news', async (req, res) => res.status(201).json(await new News(req.body).save()));
app.put('/api/news/:id', async (req, res) => res.json(await News.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete('/api/news/:id', async (req, res) => {
  await News.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
app.get('/api/announcements', async (req, res) => res.json(await Announcement.find().sort({ date: -1 })));
app.post('/api/announcements', async (req, res) => res.status(201).json(await new Announcement(req.body).save()));
app.put('/api/announcements/:id', async (req, res) => res.json(await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete('/api/announcements/:id', async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
app.get('/api/departments', async (req, res) => res.json(await Department.find()));
app.post('/api/departments', async (req, res) => res.status(201).json(await new Department(req.body).save()));
app.put('/api/departments/:id', async (req, res) => res.json(await Department.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete('/api/departments/:id', async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
app.get('/api/contacts', async (req, res) => res.json(await ContactMessage.find().sort({ date: -1 })));
app.post('/api/contacts', async (req, res) => res.status(201).json(await new ContactMessage(req.body).save()));
app.patch('/api/contacts/:id/read', async (req, res) => res.json(await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true })));
app.delete('/api/contacts/:id', async (req, res) => {
  await ContactMessage.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// --- CONFIGS ---
app.get('/api/config/home', async (req, res) => res.json(await HomeConfig.findOne() || {}));
app.put('/api/config/home', async (req, res) => res.json(await HomeConfig.findOneAndUpdate({}, req.body, { upsert: true, new: true })));
app.get('/api/config/about', async (req, res) => res.json(await AboutConfig.findOne() || {}));
app.put('/api/config/about', async (req, res) => res.json(await AboutConfig.findOneAndUpdate({}, req.body, { upsert: true, new: true })));
app.get('/api/config/footer', async (req, res) => res.json(await FooterConfig.findOne() || {}));
app.put('/api/config/footer', async (req, res) => res.json(await FooterConfig.findOneAndUpdate({}, req.body, { upsert: true, new: true })));

// --- ROLES ---
app.get('/api/roles', (req, res) => {
  const all = ['tab.overview', 'tab.profile', 'tab.reports', 'tab.home', 'tab.about', 'tab.footer', 'tab.spiritual', 'tab.members', 'tab.content', 'tab.bulletin', 'tab.depts', 'tab.leaders', 'tab.donations', 'tab.contacts', 'tab.system'];
  res.json([
    { id: 'it', label: 'IT Architect', icon: 'Shield', permissions: [...all, 'action.manage_roles'] },
    { id: 'executive', label: 'EXCOM', icon: 'Briefcase', permissions: ['tab.overview', 'tab.profile', 'tab.reports', 'tab.content', 'tab.bulletin', 'tab.depts', 'tab.leaders', 'tab.contacts'] },
    { id: 'member', label: 'Member', icon: 'User', permissions: ['tab.overview', 'tab.profile', 'tab.spiritual'] }
  ]);
});

// --- SYSTEM ---
app.get('/api/health-check', (req, res) => res.json({ status: 'API IS LIVE', timestamp: new Date() }));
app.get('/api/system/health', async (req, res) => {
  try {
    const stats = await mongoose.connection.db.stats();
    res.json({ status: 'Online', dbSize: (stats.storageSize / 1024 / 1024).toFixed(2) + ' MB' });
  } catch (e: any) { res.status(500).json({ status: 'Offline', error: e.message }); }
});

// --- BOOTSTRAP ---
const bootstrapAdmin = async () => {
  const email = 'ephrontuyishime21@gmail.com';
  let user = await Member.findOne({ email });
  if (!user) {
    await new Member({ fullName: 'Esron Tuyishime (IT)', email, password: 'admin', role: 'it', diocese: 'Kigali', isVerified: true }).save();
    console.log('🛡️ ADMIN BOOTSTRAPPED');
  }
};

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 DIVINE KERNEL IS ONLINE ON PORT ${PORT}`));
}

export default app;
