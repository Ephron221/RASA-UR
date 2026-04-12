import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.password; // Security: Never return password hash
      return ret;
    },
  },
  toObject: { virtuals: true },
};

// --- Schema Definitions ---

const MemberSchema = new Schema({
  fullName: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { type: String, required: true },
  phone: String,
  role: { type: String, default: 'member' },
  program: String,
  level: String,
  diocese: String,
  department: String,
  profileImage: String,
  spiritPoints: { type: Number, default: 0 },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationExpires: Date,
  academicYear: String,
  gender: String,
}, schemaOptions);

// Hash password before saving
MemberSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err: any) {
    throw err;
  }
});

// Method to compare passwords
MemberSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!candidatePassword || !this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const RoleSchema = new Schema({
  id: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  icon: { type: String, default: 'User' },
  description: String,
  permissions: [{ type: String }],
  isSystem: { type: Boolean, default: false }
}, schemaOptions);

const DailyVerseSchema = new Schema({
  theme: String,
  verse: String,
  reference: String,
  description: String,
  date: String,
  isActive: { type: Boolean, default: true }
}, schemaOptions);

const VerseReflectionSchema = new Schema({
  verseId: { type: Schema.Types.ObjectId, ref: 'DailyVerse' },
  userId: { type: Schema.Types.ObjectId, ref: 'Member' },
  userName: String,
  content: String
}, schemaOptions);

const BibleQuizSchema = new Schema({
  title: String,
  description: String,
  timeLimit: Number,
  isActive: { type: Boolean, default: true },
  date: String,
  questions: [{
    text: String,
    type: { type: String, enum: ['mcq', 'open'], default: 'mcq' },
    options: [String],
    correctAnswer: String
  }]
}, schemaOptions);

const QuizResultSchema = new Schema({
  quizId: { type: Schema.Types.ObjectId, ref: 'BibleQuiz' },
  userId: { type: Schema.Types.ObjectId, ref: 'Member' },
  score: Number,
  total: Number
}, schemaOptions);

const LogSchema = new Schema({
  level: { type: String, enum: ['info', 'warn', 'error'], default: 'info' },
  message: String,
  meta: Object
}, schemaOptions);

const NewsSchema = new Schema({
  title: String,
  content: String,
  category: { type: String, enum: ['event', 'news', 'announcement'], default: 'news' },
  mediaUrl: String,
  mediaType: { type: String, enum: ['image', 'video', 'audio'], default: 'image' },
  author: { type: String, default: 'Admin' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, schemaOptions);

const LeaderSchema = new Schema({
  name: String,
  position: String,
  phone: String,
  academicYear: String,
  image: String,
  type: { type: String, enum: ['Executive', 'Arbitration'], default: 'Executive' }
}, schemaOptions);

const AnnouncementSchema = new Schema({
  title: String,
  content: String,
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  status: { type: String, enum: ['Notice', 'Urgent', 'Info'], default: 'Info' },
  color: String,
  isActive: { type: Boolean, default: true }
}, schemaOptions);

const DepartmentSchema = new Schema({
  name: String,
  description: String,
  icon: String,
  image: String,
  category: String,
  details: String,
  activities: [String]
}, schemaOptions);

const DepartmentInterestSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Member' },
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
  fullName: String,
  email: String,
  phone: String,
  diocese: String,
  level: String,
  program: String,
  academicYear: String,
  motivation: String,
  experience: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  departmentName: String,
  date: { type: String, default: () => new Date().toISOString() }
}, schemaOptions);

const DonationSchema = new Schema({
  donorName: String,
  email: String,
  phone: String,
  amount: Number,
  currency: { type: String, default: 'RWF' },
  category: String,
  project: String,
  status: { 
    type: String, 
    enum: ['Completed', 'Pending', 'Failed', 'Rejected', 'DeletionPending'], 
    default: 'Pending' 
  },
  transactionId: { type: String, unique: true },
  paymentProof: String, // Base64 or URL of the bank slip/receipt
  date: { type: String, default: () => new Date().toISOString() }
}, schemaOptions);

const DonationProjectSchema = new Schema({
  title: String,
  description: String,
  goal: Number,
  raised: { type: Number, default: 0 },
  image: String,
  isActive: { type: Boolean, default: true }
}, schemaOptions);

const ContactMessageSchema = new Schema({
  fullName: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  isRead: { type: Boolean, default: false }
}, schemaOptions);

const HomeConfigSchema = new Schema({ 
  heroTitle: String, 
  heroSubtitle: String, 
  heroImageUrl: String, 
  motto: String, 
  aboutTitle: String, 
  aboutText: String, 
  aboutImageUrl: String, 
  aboutScripture: String, 
  aboutScriptureRef: String,
  stat1Value: String,
  stat1Label: String,
  stat2Value: String,
  stat2Label: String,
  youtubeVideos: [String]
}, { ...schemaOptions, collection: 'config_home' });

const AboutConfigSchema = new Schema({ heroTitle: String, heroSubtitle: String, heroImage: String, historyTitle: String, historyContent: String, historyImage: String, visionTitle: String, visionContent: String, missionTitle: String, missionContent: String, values: Array, timeline: Array }, { ...schemaOptions, collection: 'config_about' });
const FooterConfigSchema = new Schema({ description: String, facebookUrl: String, twitterUrl: String, instagramUrl: String, linkedinUrl: String, youtubeUrl: String, whatsappUrl: String, tiktokUrl: String, address: String, phone: String, email: String }, { ...schemaOptions, collection: 'config_footer' });

// --- Model Exports ---

export const DailyVerse = mongoose.models.DailyVerse || mongoose.model('DailyVerse', DailyVerseSchema);
export const VerseReflection = mongoose.models.VerseReflection || mongoose.model('VerseReflection', VerseReflectionSchema);
export const BibleQuiz = mongoose.models.BibleQuiz || mongoose.model('BibleQuiz', BibleQuizSchema);
export const QuizResult = mongoose.models.QuizResult || mongoose.model('QuizResult', QuizResultSchema);
export const SystemLog = mongoose.models.SystemLog || mongoose.model('SystemLog', LogSchema);
export const News = mongoose.models.News || mongoose.model('News', NewsSchema);
export const Leader = mongoose.models.Leader || mongoose.model('Leader', LeaderSchema);
export const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
export const Department = mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
export const DepartmentInterest = mongoose.models.DepartmentInterest || mongoose.model('DepartmentInterest', DepartmentInterestSchema);
export const Donation = mongoose.models.Donation || mongoose.model('Donation', DonationSchema);
export const DonationProject = mongoose.models.DonationProject || mongoose.model('DonationProject', DonationProjectSchema);
export const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);
export const HomeConfig = mongoose.models.HomeConfig || mongoose.model('HomeConfig', HomeConfigSchema);
export const AboutConfig = mongoose.models.AboutConfig || mongoose.model('AboutConfig', AboutConfigSchema);
export const FooterConfig = mongoose.models.FooterConfig || mongoose.model('FooterConfig', FooterConfigSchema);
export const Member = mongoose.models.Member || mongoose.model('Member', MemberSchema);
export const Role = mongoose.models.Role || mongoose.model('Role', RoleSchema);
