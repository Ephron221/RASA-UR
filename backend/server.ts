
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { News, Leader, Announcement, Member, Department, ContactMessage, HomeConfig, Donation, DonationProject } from './models';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rasa_portal';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB via Mongoose'))
  .catch(err => console.error('MongoDB connection error:', err));

/**
 * PRODUCTION API ROUTES
 */

// DONATIONS MANAGEMENT
app.get('/api/donations', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ date: -1 });
    res.json(donations);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch donations' }); }
});

app.post('/api/donations', async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    res.status(201).json(donation);
  } catch (err) { res.status(400).json({ error: 'Invalid data' }); }
});

// DONATION PROJECTS
app.get('/api/donation-projects', async (req, res) => {
  try {
    const projects = await DonationProject.find();
    res.json(projects);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch projects' }); }
});

app.post('/api/donation-projects', async (req, res) => {
  try {
    const project = new DonationProject(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) { res.status(400).json({ error: 'Invalid data' }); }
});

app.put('/api/donation-projects/:id', async (req, res) => {
  try {
    const updated = await DonationProject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: 'Update failed' }); }
});

// NEWS MANAGEMENT
app.get('/api/news', async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch news' }); }
});

app.post('/api/news', async (req, res) => {
  try {
    const newsItem = new News(req.body);
    await newsItem.save();
    res.status(201).json(newsItem);
  } catch (err) { res.status(400).json({ error: 'Invalid data' }); }
});

app.put('/api/news/:id', async (req, res) => {
  try {
    const updated = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: 'Update failed' }); }
});

app.delete('/api/news/:id', async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: 'Deletion failed' }); }
});

// ANNOUNCEMENTS MANAGEMENT
app.get('/api/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.json(announcements);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch announcements' }); }
});

app.post('/api/announcements', async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.status(201).json(announcement);
  } catch (err) { res.status(400).json({ error: 'Invalid data' }); }
});

app.put('/api/announcements/:id', async (req, res) => {
  try {
    const updated = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: 'Update failed' }); }
});

app.delete('/api/announcements/:id', async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: 'Deletion failed' }); }
});

// DEPARTMENTS MANAGEMENT
app.get('/api/departments', async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch departments' }); }
});

app.post('/api/departments', async (req, res) => {
  try {
    const dept = new Department(req.body);
    await dept.save();
    res.status(201).json(dept);
  } catch (err) { res.status(400).json({ error: 'Invalid data' }); }
});

app.put('/api/departments/:id', async (req, res) => {
  try {
    const updated = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: 'Update failed' }); }
});

app.delete('/api/departments/:id', async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: 'Deletion failed' }); }
});

// MEMBERS MANAGEMENT & ROLES
app.get('/api/members', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch members' }); }
});

app.post('/api/members', async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err: any) { res.status(400).json({ error: 'Data invalid or email exists' }); }
});

app.put('/api/members/:id', async (req, res) => {
  try {
    const updated = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: 'Update failed' }); }
});

app.put('/api/members/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const updated = await Member.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: 'Role update failed' }); }
});

app.delete('/api/members/:id', async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: 'Deletion failed' }); }
});

// HOME CONFIG
app.get('/api/home-config', async (req, res) => {
  try {
    let config = await HomeConfig.findOne();
    if (!config) {
      config = new HomeConfig({
        heroTitle: 'Showing Christ to Academicians',
        heroSubtitle: 'A journey of faith, service, and excellence.',
        heroImageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94',
        motto: 'Agakiza, Urukundo, Umurimo'
      });
      await config.save();
    }
    res.json(config);
  } catch (err) { res.status(500).json({ error: 'Config fetch failed' }); }
});

app.put('/api/home-config', async (req, res) => {
  try {
    const updated = await HomeConfig.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: 'Config update failed' }); }
});

// LEADERS
app.get('/api/leaders', async (req, res) => {
  try {
    const leaders = await Leader.find().sort({ academicYear: -1 });
    res.json(leaders);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch leaders' }); }
});

app.post('/api/leaders', async (req, res) => {
  try {
    const leader = new Leader(req.body);
    await leader.save();
    res.status(201).json(leader);
  } catch (err) { res.status(400).json({ error: 'Invalid data' }); }
});

// AUTH & PASSWORD RESET (SIMULATED FOR NOW)
app.post('/api/auth/forgot', async (req, res) => {
  const { email } = req.body;
  res.json({ success: true, message: 'OTP sent' });
});

app.post('/api/auth/reset', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  res.json({ success: true, message: 'Password reset successful' });
});

app.listen(PORT, () => {
  console.log(`RASA Backend running on port ${PORT}`);
});
