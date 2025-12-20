
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

// ... NEWS, ANNOUNCEMENTS, DEPARTMENTS, MEMBERS, HOME CONFIG, LEADERS routes follow existing implementation

app.listen(PORT, () => {
  console.log(`RASA Backend running on port ${PORT}`);
});
