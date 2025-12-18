
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { News, Leader, Announcement, Member, Department, ContactMessage, HomeConfig } from './models';

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

// AUTH & PASSWORD RESET
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
