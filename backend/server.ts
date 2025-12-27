
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { 
  News, Leader, Announcement, Member, 
  Department, DepartmentInterest, ContactMessage, 
  HomeConfig, Donation, DonationProject, AboutConfig
} from './models';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rasa_portal';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// RECRUITMENT (DEPARTMENT INTERESTS)
app.get('/api/departments/interests', async (req, res) => {
  try {
    const interests = await DepartmentInterest.find().sort({ date: -1 });
    res.json(interests);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch recruitment data' }); }
});

app.post('/api/departments/interest', async (req, res) => {
  try {
    const interest = new DepartmentInterest(req.body);
    await interest.save();
    res.status(201).json(interest);
  } catch (err) { res.status(400).json({ error: 'Recruitment submission failed' }); }
});

app.patch('/api/departments/interests/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await DepartmentInterest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: 'Status transition failed' }); }
});

app.delete('/api/departments/interests/:id', async (req, res) => {
  try {
    await DepartmentInterest.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: 'Deletion failed' }); }
});

// MEMBERS
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
  } catch (err) { res.status(400).json({ error: 'Failed to create member' }); }
});

app.put('/api/members/:id', async (req, res) => {
  try {
    const updated = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: 'Update failed' }); }
});

app.delete('/api/members/:id', async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: 'Deletion failed' }); }
});

// NEWS
app.get('/api/news', async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch news' }); }
});

app.post('/api/news', async (req, res) => {
  try {
    const item = new News(req.body);
    await item.save();
    res.status(201).json(item);
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

// DONATIONS
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

app.patch('/api/donations/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Donation.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: 'Status update failed' }); }
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

app.delete('/api/donation-projects/:id', async (req, res) => {
  try {
    await DonationProject.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: 'Deletion failed' }); }
});

// DEPARTMENTS
app.get('/api/departments', async (req, res) => {
  try {
    const depts = await Department.find();
    res.json(depts);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch departments' }); }
});

app.post('/api/departments', async (req, res) => {
  try {
    const dept = new Department(req.body);
    await dept.save();
    res.status(201).json(dept);
  } catch (err) { res.status(400).json({ error: 'Creation failed' }); }
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

// ANNOUNCEMENTS
app.get('/api/announcements', async (req, res) => {
  try {
    const anns = await Announcement.find().sort({ date: -1 });
    res.json(anns);
  } catch (err) { res.status(500).json({ error: 'Fetch failed' }); }
});

app.post('/api/announcements', async (req, res) => {
  try {
    const ann = new Announcement(req.body);
    await ann.save();
    res.status(201).json(ann);
  } catch (err) { res.status(400).json({ error: 'Creation failed' }); }
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

// LEADERS
app.get('/api/leaders', async (req, res) => {
  try {
    const leaders = await Leader.find();
    res.json(leaders);
  } catch (err) { res.status(500).json({ error: 'Fetch failed' }); }
});

app.post('/api/leaders', async (req, res) => {
  try {
    const leader = new Leader(req.body);
    await leader.save();
    res.status(201).json(leader);
  } catch (err) { res.status(400).json({ error: 'Creation failed' }); }
});

app.put('/api/leaders/:id', async (req, res) => {
  try {
    const updated = await Leader.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: 'Update failed' }); }
});

app.delete('/api/leaders/:id', async (req, res) => {
  try {
    await Leader.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: 'Deletion failed' }); }
});

// CONFIG ROUTES
app.get('/api/config/home', async (req, res) => {
  try {
    const config = await HomeConfig.findOne();
    res.json(config);
  } catch (err) { res.status(500).json({ error: 'Fetch failed' }); }
});

app.put('/api/config/home', async (req, res) => {
  try {
    const updated = await HomeConfig.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: 'Update failed' }); }
});

app.get('/api/config/about', async (req, res) => {
  try {
    const config = await AboutConfig.findOne();
    res.json(config);
  } catch (err) { res.status(500).json({ error: 'Fetch failed' }); }
});

app.put('/api/config/about', async (req, res) => {
  try {
    const updated = await AboutConfig.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: 'Update failed' }); }
});

// CONTACTS
app.get('/api/contacts', async (req, res) => {
  try {
    const msgs = await ContactMessage.find().sort({ date: -1 });
    res.json(msgs);
  } catch (err) { res.status(500).json({ error: 'Fetch failed' }); }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const msg = new ContactMessage(req.body);
    await msg.save();
    res.status(201).json(msg);
  } catch (err) { res.status(400).json({ error: 'Creation failed' }); }
});

app.patch('/api/contacts/:id/read', async (req, res) => {
  try {
    const updated = await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: 'Update failed' }); }
});

app.patch('/api/contacts/read-all', async (req, res) => {
  try {
    await ContactMessage.updateMany({}, { isRead: true });
    res.json({ success: true });
  } catch (err) { res.status(400).json({ error: 'Update failed' }); }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: 'Deletion failed' }); }
});

// SYSTEM HEALTH
app.get('/api/system/health', async (req, res) => {
  res.json({
    status: 'Online',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`RASA Backend running on port ${PORT}`);
});
