import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
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

// --- DATABASE CONNECTION FOR SERVERLESS ENVIRONMENT ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rasa_portal';
mongoose.connect(MONGODB_URI).then(() => {
    console.log('✅ KERNEL ONLINE: MongoDB Connected Successfully');
    bootstrapAdmin(); // Initialize admin if needed
}).catch(err => {
    console.error('❌ KERNEL OFFLINE: MongoDB Connection Error', err);
});

const app = express();

// --- CORS CONFIGURATION (THE FINAL FIX) ---
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://rasaur-nyarugenge.vercel.app' // Your new live frontend
  ]
}));

app.use(express.json({ limit: '50mb' }));

// --- LOGGING MIDDLEWARE ---
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ... the rest of your server.ts code is correct and follows here ...

// --- AUTH ENDPOINTS ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Member.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!user.isVerified) {
        return res.status(401).json({ error: 'Account not verified. Please check your email for a verification link.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email } = req.body;
    let user = await Member.findOne({ email });
    if (user && user.isVerified) {
      return res.status(409).json({ error: 'A member with this email already exists.' });
    }

    const verificationToken = crypto.randomInt(100000, 999999).toString();

    if (user && !user.isVerified) {
        user.set(req.body);
        user.verificationToken = verificationToken;
        user.verificationExpires = Date.now() + 3600000; // 1 hour
        await user.save();
    } else {
        user = new Member({
            ...req.body,
            isVerified: false,
            verificationToken,
            verificationExpires: Date.now() + 3600000, // 1 hour
        });
        await user.save();
    }

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({ message: 'Registration successful. Please check your email for a verification code.' });
  } catch (err: any) {
    console.error("REGISTRATION FAILED:", err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

app.post('/api/auth/verify', async (req, res) => {
    try {
        const { email, token } = req.body;
        const user = await Member.findOne({
            email,
            verificationToken: token,
            verificationExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ error: 'Verification token is invalid or has expired.' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;
        await user.save();

        res.json(user);
    } catch (err: any) {
        res.status(500).json({ error: 'Verification failed', details: err.message });
    }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Member.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No user found with that email address.' });
    }
    const token = crypto.randomInt(100000, 999999).toString();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(user.email, token);

    res.json({ message: `A password reset token has been sent to ${email}. Check your inbox.` });

  } catch (err: any) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ error: 'Password reset request failed', details: err.message });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    const user = await Member.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been successfully reset.' });

  } catch (err: any) {
    res.status(500).json({ error: 'Password reset failed', details: err.message });
  }
});


// --- HELPERS ---
const getQueryById = (id: string) => {
  if (!id || id === 'undefined') return null;
  // If it's a 24-char hex string, it's a Mongoose ObjectId
  return mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id: id };
};

// --- BOOTSTRAP SYSTEM ADMIN ---
const bootstrapAdmin = async () => {
  const itEmail = 'ephrontuyishime21@gmail.com';
  const plainPassword = 'admin';

  let user = await Member.findOne({ email: itEmail });

  if (!user) {
    user = new Member({
      fullName: 'Esron Tuyishime (IT)',
      email: itEmail,
      password: plainPassword,
      phone: '+250 787 846 433',
      role: 'it',
      program: 'Software Engineering',
      level: 'Expert',
      diocese: 'Kigali',
      department: 'IT & Infrastructure'
    });
    await user.save();
    console.log('🛡️ SYSTEM BOOTSTRAP: IT Architect Account Created');
  } else {
    const isMatch = await user.comparePassword(plainPassword);
    if (!isMatch) {
      user.password = plainPassword;
      await user.save();
      console.log('🛡️ SYSTEM BOOTSTRAP: IT Architect Account Password Reset');
    }
  }
};

// --- MEMBERS (now mostly for admin) ---
app.get('/api/members', async (req, res) => res.json(await Member.find().sort({ createdAt: -1 })));
app.put('/api/members/:id', async (req, res) => {
  try {
    const query = getQueryById(req.params.id);
    if (!query) return res.status(400).json({ error: 'Invalid ID' });
    const { _id, email, id: bodyId, ...updateData } = req.body;
    const m = await Member.findOneAndUpdate(query, updateData, { new: true, upsert: true });
    res.json(m);
  } catch (err: any) { res.status(500).json({ error: 'Update failed', details: err.message }); }
});
app.patch('/api/members/:id/role', async (req, res) => {
  const query = getQueryById(req.params.id);
  if (!query) return res.status(400).json({ error: 'Invalid ID' });
  res.json(await Member.findOneAndUpdate(query, { role: req.body.role }, { new: true }));
});
app.delete('/api/members/:id', async (req, res) => {
    const query = getQueryById(req.params.id);
    if (!query) return res.status(400).json({ error: 'Invalid ID' });
    await Member.findOneAndDelete(query);
    res.status(204).send();
});


// --- LEADERS ---
app.get('/api/leaders', async (req, res) => res.json(await Leader.find().sort({ name: 1 })));
app.post('/api/leaders', async (req, res) => res.status(201).json(await new Leader(req.body).save()));
app.put('/api/leaders/:id', async (req, res) => {
  const query = getQueryById(req.params.id);
  if (!query) return res.status(400).json({ error: 'Invalid ID' });
  res.json(await Leader.findOneAndUpdate(query, req.body, { new: true }));
});
app.delete('/api/leaders/:id', async (req, res) => {
  const query = getQueryById(req.params.id);
  if (!query) return res.status(400).json({ error: 'Invalid ID' });
  await Leader.findOneAndDelete(query);
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
  const query = getQueryById(req.params.id);
  if (!query) return res.status(400).json({ error: 'Invalid ID' });
  const d = await Donation.findOneAndUpdate(query, { status: req.body.status }, { new: true });
  if (req.body.status === 'Completed' && d?.project) {
    await DonationProject.findOneAndUpdate({ title: d.project }, { $inc: { raised: d.amount } });
  }
  res.json(d);
});
app.delete('/api/donations/:id', async (req, res) => {
  const query = getQueryById(req.params.id);
  if (!query) return res.status(400).json({ error: 'Invalid ID' });
  await Donation.findOneAndDelete(query);
  res.status(204).send();
});
app.get('/api/donation-projects', async (req, res) => res.json(await DonationProject.find()));
app.post('/api/donation-projects', async (req, res) => res.status(201).json(await new DonationProject(req.body).save()));
app.put('/api/donation-projects/:id', async (req, res) => {
    const query = getQueryById(req.params.id);
    if (!query) return res.status(400).json({ error: 'Invalid ID' });
    res.json(await DonationProject.findOneAndUpdate(query, req.body, { new: true }));
});
app.delete('/api/donation-projects/:id', async (req, res) => {
    const query = getQueryById(req.params.id);
    if (!query) return res.status(400).json({ error: 'Invalid ID' });
    await DonationProject.findOneAndDelete(query);
    res.status(204).send();
});


// --- SPIRITUAL HUB ---
app.get('/api/spiritual/verses', async (req, res) => res.json(await DailyVerse.find().sort({ date: -1 })));
app.post('/api/spiritual/verses', async (req, res) => res.status(201).json(await new DailyVerse(req.body).save()));
app.put('/api/spiritual/verses/:id', async (req, res) => {
    const query = getQueryById(req.params.id);
    if (!query) return res.status(400).json({ error: 'Invalid ID' });
    res.json(await DailyVerse.findOneAndUpdate(query, req.body, { new: true }));
});
app.delete('/api/spiritual/verses/:id', async (req, res) => {
    const query = getQueryById(req.params.id);
    if (!query) return res.status(400).json({ error: 'Invalid ID' });
    await DailyVerse.findOneAndDelete(query);
    res.status(204).send();
});
app.get('/api/spiritual/verses/daily', async (req, res) => res.json(await DailyVerse.findOne({ isActive: true }).sort({ date: -1 }) || {}));
app.get('/api/spiritual/quizzes', async (req, res) => res.json(await BibleQuiz.find()));
app.get('/api/spiritual/quizzes/active', async (req, res) => res.json(await BibleQuiz.find({ isActive: true })));
app.post('/api/spiritual/quizzes', async (req, res) => res.status(201).json(await new BibleQuiz(req.body).save()));
app.put('/api/spiritual/quizzes/:id', async (req, res) => {
    const query = getQueryById(req.params.id);
    if (!query) return res.status(400).json({ error: 'Invalid ID' });
    res.json(await BibleQuiz.findOneAndUpdate(query, req.body, { new: true }));
});
app.delete('/api/spiritual/quizzes/:id', async (req, res) => {
    const query = getQueryById(req.params.id);
    if (!query) return res.status(400).json({ error: 'Invalid ID' });
    await BibleQuiz.findOneAndDelete(query);
    res.status(204).send();
});
app.get('/api/spiritual/reflections', async (req, res) => res.json(await VerseReflection.find().sort({ createdAt: -1 })));
app.post('/api/spiritual/reflections', async (req, res) => res.status(201).json(await new VerseReflection(req.body).save()));
app.get('/api/spiritual/quiz-results', async (req, res) => res.json(await QuizResult.find().sort({ createdAt: -1 })));
app.post('/api/spiritual/quiz-results', async (req, res) => res.status(201).json(await new QuizResult(req.body).save()));


// --- CMS & OTHERS ---
app.get('/api/news', async (req, res) => res.json(await News.find().sort({ date: -1 })));
app.post('/api/news', async (req, res) => res.status(201).json(await new News(req.body).save()));
app.put('/api/news/:id', async (req, res) => {
    const query = getQueryById(req.params.id);
    if (!query) return res.status(400).json({ error: 'Invalid ID' });
    res.json(await News.findOneAndUpdate(query, req.body, { new: true }));
});
app.delete('/api/news/:id', async (req, res) => {
    const query = getQueryById(req.params.id);
    if (!query) return res.status(400).json({ error: 'Invalid ID' });
    await News.findOneAndDelete(query);
    res.status(204).send();
});
app.get('/api/announcements', async (req, res) => res.json(await Announcement.find().sort({ date: -1 })));
app.post('/api/announcements', async (req, res) => res.status(201).json(await new Announcement(req.body).save()));
app.put('/api/announcements/:id', async (req, res) => {
    const query = getQueryById(req.params.id);
    if (!query) return res.status(400).json({ error: 'Invalid ID' });
    res.json(await Announcement.findOneAndUpdate(query, req.body, { new: true }));
});
app.delete('/api/announcements/:id', async (req, res) => {
    const query = getQueryById(req.params.id);
    if (!query) return res.status(400).json({ error: 'Invalid ID' });
    await Announcement.findOneAndDelete(query);
    res.status(204).send();
});
app.get('/api/departments', async (req, res) => res.json(await Department.find()));
app.post('/api/departments', async (req, res) => res.status(201).json(await new Department(req.body).save()));
app.put('/api/departments/:id', async (req, res) => {
    const query = getQueryById(req.params.id);
    if (!query) return res.status(400).json({ error: 'Invalid ID' });
    res.json(await Department.findOneAndUpdate(query, req.body, { new: true }));
});
app.delete('/api/departments/:id', async (req, res) => {
    const query = getQueryById(req.params.id);
    if (!query) return res.status(400).json({ error: 'Invalid ID' });
    await Department.findOneAndDelete(query);
    res.status(204).send();
});
app.post('/api/departments/interest', async (req, res) => res.status(201).json(await new DepartmentInterest(req.body).save()));
app.get('/api/departments/interests', async (req, res) => res.json(await DepartmentInterest.find().sort({ date: -1 })));
app.patch('/api/departments/interests/:id/status', async (req, res) => {
    const query = getQueryById(req.params.id);
    if (!query) return res.status(400).json({ error: 'Invalid ID' });
    res.json(await DepartmentInterest.findOneAndUpdate(query, { status: req.body.status }, { new: true }));
});
app.get('/api/contacts', async (req, res) => res.json(await ContactMessage.find().sort({ date: -1 })));
app.post('/api/contacts', async (req, res) => res.status(201).json(await new ContactMessage(req.body).save()));
app.patch('/api/contacts/:id/read', async (req, res) => {
    const query = getQueryById(req.params.id);
    if (!query) return res.status(400).json({ error: 'Invalid ID' });
    res.json(await ContactMessage.findOneAndUpdate(query, { isRead: true }, { new: true }));
});
app.patch('/api/contacts/read-all', async (req, res) => {
    await ContactMessage.updateMany({ isRead: false }, { isRead: true });
    res.json({ message: "All messages marked as read" });
});
app.delete('/api/contacts/:id', async (req, res) => {
    const query = getQueryById(req.params.id);
    if (!query) return res.status(400).json({ error: 'Invalid ID' });
    await ContactMessage.findOneAndDelete(query);
    res.status(204).send();
});


// --- ROLES & PERMISSIONS ---
app.get('/api/roles', (req, res) => {
  const all = ['tab.overview', 'tab.profile', 'tab.home', 'tab.about', 'tab.footer', 'tab.spiritual', 'tab.members', 'tab.clearance', 'tab.content', 'tab.bulletin', 'tab.depts', 'tab.leaders', 'tab.donations', 'tab.contacts', 'tab.system'];
  res.json([
    { id: 'it', label: 'IT Architect', icon: 'Shield', permissions: [...all, 'action.manage_roles', 'action.reset_db'] },
    { id: 'accountant', label: 'Accountant', icon: 'Landmark', permissions: ['tab.overview', 'tab.profile', 'tab.donations', 'action.verify_donations'] },
    { id: 'executive', label: 'EXCOM', icon: 'Briefcase', permissions: ['tab.overview', 'tab.profile', 'tab.content', 'tab.bulletin', 'tab.depts', 'tab.leaders', 'tab.contacts'] },
    { id: 'member', label: 'Member', icon: 'User', permissions: ['tab.overview', 'tab.profile', 'tab.spiritual'] }
  ]);
});

// --- CONFIGS ---
app.get('/api/config/home', async (req, res) => res.json(await HomeConfig.findOne() || {}));
app.put('/api/config/home', async (req, res) => res.json(await HomeConfig.findOneAndUpdate({}, req.body, { upsert: true, new: true })));
app.get('/api/config/about', async (req, res) => res.json(await AboutConfig.findOne() || { values: [], timeline: [] }));
app.put('/api/config/about', async (req, res) => res.json(await AboutConfig.findOneAndUpdate({}, req.body, { upsert: true, new: true })));
app.get('/api/config/footer', async (req, res) => res.json(await FooterConfig.findOne() || {}));
app.put('/api/config/footer', async (req, res) => res.json(await HomeConfig.findOneAndUpdate({}, req.body, { upsert: true, new: true })));

// --- SYSTEM ---
app.get('/api/system/health', async (req, res) => {
    try {
        const collections = await mongoose.connection.db.collections();
        const stats = await mongoose.connection.db.stats();
        res.json({
            status: 'Online',
            collections: collections.map(c => c.collectionName),
            size: (stats.storageSize / 1024 / 1024).toFixed(2) + ' MB'
        });
    } catch (e: any) {
        res.status(500).json({ status: 'Offline', error: e.message });
    }
});
app.get('/api/system/logs', async (req, res) => res.json(await SystemLog.find().sort({ timestamp: -1 }).limit(50)));
// Placeholder endpoints for backup and reset
app.get('/api/system/backups', async (req, res) => {
    // This is a placeholder. A real implementation would be more complex.
    res.json([]);
});
app.post('/api/system/backups', async (req, res) => {
    res.status(501).json({ error: "Backup creation not implemented" });
});
app.post('/api/system/backups/:id/restore', async (req, res) => {
    res.status(501).json({ error: "Backup restore not implemented" });
});
app.post('/api/system/reset', async (req, res) => {
    res.status(501).json({ error: "DB Reset not implemented" });
});

// Vercel needs this to be exported
export default app;