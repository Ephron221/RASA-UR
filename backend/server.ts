import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import {
  News, Leader, Announcement, Member,
  Department, ContactMessage, DepartmentInterest,
  HomeConfig, SystemLog, DailyVerse, BibleQuiz, QuizResult, AboutConfig, FooterConfig,
  VerseReflection, Donation, DonationProject, Role
} from './models';
import { sendPasswordResetEmail, sendVerificationEmail } from './email';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// --- DATABASE CONNECTION & SERVER START ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rasa_portal';

console.log('⏳ INITIALIZING DIVINE KERNEL...');

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 60000,
  connectTimeoutMS: 30000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  retryReads: true,
})
  .then(() => {
    console.log('✅ KERNEL ONLINE: MongoDB Connected Successfully');
    bootstrapAdmin();
    app.listen(PORT, () => {
      console.log(`🚀 DIVINE KERNEL IS BROADCASTING ON PORT ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ KERNEL CRITICAL FAILURE: Could not connect to MongoDB.');
    console.error('Reason:', err.message);
    console.log('⏳ Retrying connection in 5 seconds...');
    setTimeout(() => {
      mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 60000,
        connectTimeoutMS: 30000,
        heartbeatFrequencyMS: 10000,
        retryWrites: true,
        retryReads: true,
      }).then(() => {
        console.log('✅ KERNEL ONLINE (RETRY): MongoDB Connected');
        bootstrapAdmin();
        app.listen(PORT, () => {
          console.log(`🚀 DIVINE KERNEL IS BROADCASTING ON PORT ${PORT}`);
        });
      }).catch(err2 => {
        console.error('❌ RETRY FAILED:', err2.message);
        process.exit(1);
      });
    }, 5000);
  });

// --- AUTH ENDPOINTS ---

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await Member.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(403).json({
        error: 'Account not verified. Please check your email for the verification code.',
        notVerified: true,
        email: user.email
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, fullName, password, phone, program, level, diocese, department, profileImage, academicYear, gender } = req.body;

    if (!email || !fullName || !password) {
      return res.status(400).json({ error: 'Full Name, Email, and Password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await Member.findOne({ email: cleanEmail });

    if (user && user.isVerified) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 3600000);

    const userData = {
      fullName,
      email: cleanEmail,
      password,
      phone,
      program,
      level,
      diocese,
      department,
      profileImage,
      academicYear,
      gender,
      isVerified: false,
      verificationToken: otp,
      verificationExpires: expiry
    };

    if (user) {
      user.set(userData);
    } else {
      user = new Member(userData);
    }

    await user.save();

    try {
      await sendVerificationEmail(cleanEmail, otp);
    } catch (mailErr: any) {
      console.error('Email Sending Failed:', mailErr);
      return res.status(201).json({
        message: 'Account created, but verification email failed to send. Please contact support.',
        emailError: true
      });
    }

    res.status(201).json({ message: 'Verification code sent to your email.' });
  } catch (err: any) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

app.post('/api/auth/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const cleanEmail = email.toLowerCase().trim();
    const user = await Member.findOne({ email: cleanEmail });

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isVerified) return res.status(400).json({ error: 'Account already verified' });

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 3600000);

    user.verificationToken = otp;
    user.verificationExpires = expiry;
    await user.save();

    await sendVerificationEmail(cleanEmail, otp);
    res.json({ message: 'New verification code sent to your email.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to resend OTP', details: err.message });
  }
});

app.post('/api/auth/verify', async (req, res) => {
  try {
    const { email, token } = req.body;
    if (!email || !token) return res.status(400).json({ error: 'Email and code are required' });

    const user = await Member.findOne({
      email: email.toLowerCase().trim(),
      verificationToken: token,
      verificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification code.' });
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
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await Member.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ error: 'No account found with this email.' });

    const otp = crypto.randomInt(100000, 999999).toString();
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);

    await user.save();

    try {
      await sendPasswordResetEmail(user.email, otp);
      res.json({ message: 'A password reset code has been sent to your email.' });
    } catch (mailErr: any) {
      console.error('Reset Email Failed:', mailErr);
      res.status(500).json({ error: 'Failed to send reset email. Please try again later.' });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) return res.status(400).json({ error: 'Missing required fields' });

    const user = await Member.findOne({
      email: email.toLowerCase().trim(),
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) return res.status(400).json({ error: 'Invalid or expired reset code.' });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to reset password', details: err.message });
  }
});

// --- MEMBERS ---
app.get('/api/members', async (req, res) => res.json(await Member.find().sort({ createdAt: -1 })));

app.post('/api/members', async (req, res) => {
  try {
    const { email, fullName, ...rest } = req.body;
    if (!email || !fullName) return res.status(400).json({ error: 'Full Name and Email are required.' });
    const cleanEmail = email.toLowerCase().trim();
    const existing = await Member.findOne({ email: cleanEmail });
    if (existing) return res.status(409).json({ error: 'A member with this email already exists.' });
    const member = new Member({
      fullName,
      email: cleanEmail,
      password: rest.password || 'RASA2025!',
      phone: rest.phone || '',
      program: rest.program || '',
      level: rest.level || '',
      diocese: rest.diocese || '',
      department: rest.department || '',
      profileImage: rest.profileImage || '',
      academicYear: rest.academicYear || '',
      gender: rest.gender || '',
      role: rest.role || 'member',
      isVerified: true,
    });
    await member.save();
    res.status(201).json(member);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create member' });
  }
});

app.get('/api/members/report', async (req, res) => {
  try {
    const { year, name, gender, level, program, diocese } = req.query;
    const filter: any = {};
    if (year) filter.academicYear = year;
    if (name) filter.fullName = { $regex: name, $options: 'i' };
    
    // Case-insensitive matching for filters
    if (gender) filter.gender = { $regex: `^${gender}$`, $options: 'i' };
    if (level) filter.level = { $regex: `^${level}$`, $options: 'i' };
    if (program) filter.program = { $regex: program, $options: 'i' };
    if (diocese) filter.diocese = { $regex: `^${diocese}$`, $options: 'i' };
    
    res.json(await Member.find(filter).sort({ fullName: 1 }));
  } catch (err: any) { 
    console.error('Report Error:', err);
    res.status(500).json({ error: 'Report failed' }); 
  }
});

app.put('/api/members/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid Identity Format' });
  const m = await Member.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
  res.json(m);
});

app.patch('/api/members/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) return res.status(400).json({ error: 'Role sequence is required.' });

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid Identity Format' });

    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member identity not found.' });

    if (role === 'accountant') {
      const year = member.academicYear;
      if (!year) {
        return res.status(400).json({
          error: 'Clearance Blocked: Academic Year must be defined in the profile before granting Accountant status.'
        });
      }

      const existingAccountant = await Member.findOne({
        role: 'accountant',
        academicYear: year,
        _id: { $ne: member._id }
      });

      if (existingAccountant) {
        return res.status(400).json({
          error: `Clearance Conflict: ${existingAccountant.fullName} is already assigned as Accountant for ${year}.`
        });
      }
    }

    member.role = role;
    await member.save();
    res.json(member);
  } catch (err: any) {
    console.error('Role Update Error:', err);
    res.status(500).json({ error: 'System Kernel Failure during role transition', details: err.message });
  }
});

app.delete('/api/members/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid Identity Format' });
  await Member.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// --- DEPARTMENTS & INTERESTS ---
app.get('/api/departments', async (req, res) => res.json(await Department.find()));
app.post('/api/departments', async (req, res) => res.status(201).json(await new Department(req.body).save()));
app.put('/api/departments/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
  res.json(await Department.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' }));
});
app.delete('/api/departments/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
  await Department.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.get('/api/departments/interests', async (req, res) => res.json(await DepartmentInterest.find().sort({ createdAt: -1 })));
app.post('/api/departments/interest', async (req, res) => res.status(201).json(await new DepartmentInterest(req.body).save()));
app.patch('/api/departments/interests/:id/status', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
  res.json(await DepartmentInterest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { returnDocument: 'after' }));
});

// --- LEADERS ---
app.get('/api/leaders', async (req, res) => res.json(await Leader.find().sort({ name: 1 })));
app.post('/api/leaders', async (req, res) => res.status(201).json(await new Leader(req.body).save()));
app.put('/api/leaders/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
  res.json(await Leader.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' }));
});
app.delete('/api/leaders/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
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
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
  const d = await Donation.findByIdAndUpdate(req.params.id, { status: req.body.status }, { returnDocument: 'after' });
  if (req.body.status === 'Completed' && d?.project) {
    await DonationProject.findOneAndUpdate({ title: d.project }, { $inc: { raised: d.amount } });
  }
  res.json(d);
});
app.delete('/api/donations/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
  await Donation.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
app.get('/api/donation-projects', async (req, res) => res.json(await DonationProject.find()));
app.post('/api/donation-projects', async (req, res) => res.status(201).json(await new DonationProject(req.body).save()));
app.put('/api/donation-projects/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
  res.json(await DonationProject.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' }));
});
app.delete('/api/donation-projects/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
  await DonationProject.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// --- SPIRITUAL HUB ---
app.get('/api/spiritual/verses', async (req, res) => res.json(await DailyVerse.find().sort({ date: -1 })));
app.post('/api/spiritual/verses', async (req, res) => res.status(201).json(await new DailyVerse(req.body).save()));
app.get('/api/spiritual/verses/daily', async (req, res) => res.json(await DailyVerse.findOne({ isActive: true }).sort({ date: -1 }) || {}));
app.get('/api/spiritual/quizzes', async (req, res) => res.json(await BibleQuiz.find()));
app.get('/api/spiritual/quizzes/active', async (req, res) => res.json(await BibleQuiz.find({ isActive: true })));
app.post('/api/spiritual/quizzes', async (req, res) => res.status(201).json(await new BibleQuiz(req.body).save()));
app.put('/api/spiritual/quizzes/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
  res.json(await BibleQuiz.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' }));
});
app.delete('/api/spiritual/quizzes/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
  await BibleQuiz.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
app.get('/api/spiritual/reflections', async (req, res) => res.json(await VerseReflection.find().sort({ createdAt: -1 })));
app.post('/api/spiritual/reflections', async (req, res) => res.status(201).json(await new VerseReflection(req.body).save()));
app.get('/api/spiritual/quiz-results', async (req, res) => res.json(await QuizResult.find().sort({ createdAt: -1 })));
app.post('/api/spiritual/quiz-results', async (req, res) => res.status(201).json(await new QuizResult(req.body).save()));

// --- CMS & CONFIG ---
app.get('/api/news', async (req, res) => res.json(await News.find().sort({ date: -1 })));
app.post('/api/news', async (req, res) => res.status(201).json(await new News(req.body).save()));
app.put('/api/news/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
  res.json(await News.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' }));
});
app.delete('/api/news/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
  await News.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
app.get('/api/announcements', async (req, res) => res.json(await Announcement.find().sort({ date: -1 })));
app.post('/api/announcements', async (req, res) => res.status(201).json(await new Announcement(req.body).save()));
app.put('/api/announcements/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
  res.json(await Announcement.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' }));
});
app.delete('/api/announcements/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
  await Announcement.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
app.get('/api/contacts', async (req, res) => res.json(await ContactMessage.find().sort({ date: -1 })));
app.post('/api/contacts', async (req, res) => res.status(201).json(await new ContactMessage(req.body).save()));
app.patch('/api/contacts/:id/read', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
  res.json(await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true }, { returnDocument: 'after' }));
});
app.patch('/api/contacts/read-all', async (req, res) => {
  await ContactMessage.updateMany({}, { isRead: true });
  res.json({ success: true });
});
app.delete('/api/contacts/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
  await ContactMessage.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.get('/api/config/home', async (req, res) => res.json(await HomeConfig.findOne() || {}));
app.put('/api/config/home', async (req, res) => res.json(await HomeConfig.findOneAndUpdate({}, req.body, { upsert: true, returnDocument: 'after' })));
app.get('/api/config/about', async (req, res) => res.json(await AboutConfig.findOne() || {}));
app.put('/api/config/about', async (req, res) => res.json(await AboutConfig.findOneAndUpdate({}, req.body, { upsert: true, returnDocument: 'after' })));
app.get('/api/config/footer', async (req, res) => res.json(await FooterConfig.findOne() || {}));
app.put('/api/config/footer', async (req, res) => res.json(await FooterConfig.findOneAndUpdate({}, req.body, { upsert: true, returnDocument: 'after' })));

// --- ROLES & CLEARANCE ---
app.get('/api/roles', async (req, res) => {
  const roles = await Role.find();
  res.json(roles);
});

app.post('/api/roles', async (req, res) => {
  const role = new Role(req.body);
  await role.save();
  res.status(201).json(role);
});

app.put('/api/roles/:id', async (req, res) => {
  res.json(await Role.findOneAndUpdate({ id: req.params.id }, req.body, { returnDocument: 'after' }));
});

app.delete('/api/roles/:id', async (req, res) => {
  await Role.findOneAndDelete({ id: req.params.id });
  res.status(204).send();
});

// --- SYSTEM ---
app.get('/api/system/logs', async (req, res) => res.json(await SystemLog.find().sort({ createdAt: -1 }).limit(100)));

app.get('/api/system/health', async (req, res) => {
  try {
    const stats = await mongoose.connection.db?.stats();
    res.json({ status: 'Online', dbSize: stats ? (stats.storageSize / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown' });
  } catch (e: any) { res.status(500).json({ status: 'Offline', error: e.message }); }
});

const bootstrapAdmin = async () => {
  const email = 'ephrontuyishime21@gmail.com';
  let user = await Member.findOne({ email });
  if (!user) {
    await new Member({ fullName: 'Esron Tuyishime (IT)', email, password: 'admin', role: 'it', diocese: 'Kigali Diocese', isVerified: true }).save();
    console.log('🛡️ ADMIN BOOTSTRAPPED');
  }

  const all = ['tab.overview', 'tab.profile', 'tab.reports', 'tab.home', 'tab.about', 'tab.footer', 'tab.spiritual', 'tab.members', 'tab.content', 'tab.bulletin', 'tab.depts', 'tab.leaders', 'tab.donations', 'tab.contacts', 'tab.system', 'tab.clearance'];
  const excomPerms = ['tab.overview', 'tab.profile', 'tab.reports', 'tab.content', 'tab.bulletin', 'tab.depts', 'tab.leaders', 'tab.contacts'];

  const defaults = [
    { id: 'it', label: 'IT Architect', icon: 'Shield', permissions: [...all, 'action.manage_roles', 'action.edit_members', 'action.reset_db'], description: 'Full system oversight and security architecture.', isSystem: true },
    { id: 'accountant', label: 'Accountant', icon: 'Wallet', permissions: [...excomPerms, 'tab.donations', 'action.verify_donations'], description: 'Financial steward responsible for offerings, donations, and ledger verification.', isSystem: true },
    { id: 'executive', label: 'EXCOM', icon: 'Briefcase', permissions: [...excomPerms, 'tab.donations', 'tab.spiritual', 'tab.members'], description: 'Executive committee member with management access to ministries and content.', isSystem: true },
    { id: 'ministry-leader', label: 'Ministry Leader', icon: 'Landmark', permissions: ['tab.overview', 'tab.profile', 'tab.members', 'tab.depts'], description: 'Ministry Leader (e.g. choir secretary) — can view ministry members and approve join requests.', isSystem: true },
    { id: 'evangelist', label: 'Evangelist', icon: 'MessageSquare', permissions: ['tab.overview', 'tab.profile', 'tab.spiritual'], description: 'Has access to the spiritual hub to publish daily verses and prepare Bible quizzes.', isSystem: true },
    { id: 'member', label: 'Member', icon: 'User', permissions: ['tab.overview', 'tab.profile', 'tab.spiritual'], description: 'Standard member access to profile and spiritual resources.', isSystem: true },
  ];

  for (const defaultRole of defaults) {
    await Role.findOneAndUpdate(
      { id: defaultRole.id },
      { $set: defaultRole },
      { upsert: true }
    );
  }
  console.log(`🔑 DEFAULT ROLES SYNCED (${defaults.length} definitions)`);
};

export default app;
