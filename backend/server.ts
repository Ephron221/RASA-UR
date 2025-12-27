
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { 
  News, Leader, Announcement, Member, 
  Department, DepartmentInterest, ContactMessage, 
  HomeConfig, Donation, DonationProject, AboutConfig,
  DailyVerse, VerseReflection, BibleQuiz, QuizResult,
  SystemLog, OTPRecord
} from './models';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// SWAGGER CONFIGURATION
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RASA UR-Nyarugenge API',
      version: '2.5.0',
      description: 'Divine Kernel API. Use this to verify that data is correctly hitting your Local MongoDB Collections.',
      contact: {
        name: 'RASA IT Infrastructure',
        email: 'it@rasa-nyg.org'
      },
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    components: {
      schemas: {
        Member: {
          type: 'object',
          properties: {
            fullName: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['member', 'admin', 'executive', 'accountant', 'secretary', 'it'] },
            program: { type: 'string' },
            level: { type: 'string' }
          }
        },
        News: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            category: { type: 'string', enum: ['event', 'news', 'announcement'] },
            mediaUrl: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./backend/server.ts'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Log helper
const logAction = async (action: string) => {
  try {
    const log = new SystemLog({ action });
    await log.save();
  } catch (e) { console.error("Logger fail", e); }
};

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rasa_portal';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to LOCAL MONGODB at 27017'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

/**
 * @swagger
 * /api/system/health:
 *   get:
 *     summary: Verify Local MongoDB and Backend synchronization
 *     tags: [System]
 */
app.get('/api/system/health', async (req, res) => {
  try {
    const stats = await mongoose.connection.db?.stats();
    const memberCount = await Member.countDocuments();
    const verseCount = await DailyVerse.countDocuments();
    const newsCount = await News.countDocuments();

    res.json({
      status: 'Online',
      database: 'Local MongoDB (Connected)',
      collections: {
        members: memberCount,
        verses: verseCount,
        news: newsCount
      },
      storage: `${((stats?.dataSize || 0) / 1024).toFixed(2)} KB`,
      version: '2.5.0-Verified',
      timestamp: new Date()
    });
  } catch (e) {
    res.json({ status: 'Online', database: 'Disconnected', timestamp: new Date() });
  }
});

// SPIRITUAL HUB ROUTES
app.get('/api/spiritual/verses/daily', async (req, res) => {
  try {
    const verse = await DailyVerse.findOne({ isActive: true }).sort({ date: -1 });
    res.json(verse);
  } catch (err) { res.status(500).json({ error: 'DB Fetch Fail' }); }
});

app.get('/api/spiritual/verses', async (req, res) => {
  try {
    const verses = await DailyVerse.find().sort({ date: -1 });
    res.json(verses);
  } catch (err) { res.status(500).json({ error: 'DB Fetch Fail' }); }
});

app.post('/api/spiritual/verses', async (req, res) => {
  try {
    const verse = new DailyVerse(req.body);
    await verse.save();
    await logAction(`CMS: New Verse Created in MongoDB - ${verse.theme}`);
    res.status(201).json(verse);
  } catch (err) { res.status(400).json({ error: 'Creation failed' }); }
});

app.delete('/api/spiritual/verses/:id', async (req, res) => {
  try {
    await DailyVerse.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: 'Deletion failed' }); }
});

app.get('/api/spiritual/quizzes/active', async (req, res) => {
  try {
    const quizzes = await BibleQuiz.find({ isActive: true });
    res.json(quizzes);
  } catch (err) { res.status(500).json({ error: 'DB Fetch Fail' }); }
});

app.post('/api/spiritual/quiz-results', async (req, res) => {
  try {
    const result = new QuizResult(req.body);
    await result.save();
    const pointsToAdd = Math.floor((result.score / result.total) * 100);
    await Member.findByIdAndUpdate(result.userId, { $inc: { spiritPoints: pointsToAdd } });
    await logAction(`SPIRIT: Quiz Logged in MongoDB for ${result.userId}`);
    res.status(201).json(result);
  } catch (err) { res.status(400).json({ error: 'Submission failed' }); }
});

// CORE CMS ROUTES
app.get('/api/members', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) { res.status(500).json({ error: 'DB Fetch Fail' }); }
});

app.post('/api/members', async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err) { res.status(400).json({ error: 'Creation failed' }); }
});

app.get('/api/news', async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (err) { res.status(500).json({ error: 'DB Fetch Fail' }); }
});

app.get('/api/system/logs', async (req, res) => {
  try {
    const logs = await SystemLog.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (err) { res.status(500).json({ error: 'Fetch failed' }); }
});

app.listen(PORT, () => {
  console.log(`🚀 RASA Backend initialized on port ${PORT}`);
  console.log(`📂 Swagger Docs (Local MongoDB Tester): http://localhost:${PORT}/api-docs`);
});
