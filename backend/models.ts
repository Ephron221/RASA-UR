
import mongoose, { Schema } from 'mongoose';

// NEWS MODEL
const NewsSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['event', 'news', 'announcement'], default: 'news' },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ['image', 'video', 'audio'], default: 'image' },
  author: { type: String, default: 'Admin' },
  date: { type: Date, default: Date.now }
});

// LEADER MODEL
const LeaderSchema = new Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  academicYear: { type: String, required: true },
  image: { type: String, required: true },
  type: { type: String, enum: ['Executive', 'Arbitration'], default: 'Executive' }
});

// ANNOUNCEMENT MODEL
const AnnouncementSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Notice', 'Urgent', 'Info'], default: 'Info' },
  color: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

// DEPARTMENT MODEL
const DepartmentSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  details: { type: String, required: true },
  activities: [{ type: String }]
});

// CONTACT MESSAGE MODEL
const ContactMessageSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});

// HOME CONFIG MODEL
const HomeConfigSchema = new Schema({
  heroTitle: { type: String, required: true },
  heroSubtitle: { type: String, required: true },
  heroImageUrl: { type: String, required: true },
  motto: { type: String, required: true }
});

// MEMBER MODEL
const MemberSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  program: { type: String, required: true },
  level: { type: String, required: true },
  diocese: { type: String, required: true },
  department: { type: String, required: true },
  profileImage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const News = mongoose.model('News', NewsSchema);
export const Leader = mongoose.model('Leader', LeaderSchema);
export const Announcement = mongoose.model('Announcement', AnnouncementSchema);
export const Department = mongoose.model('Department', DepartmentSchema);
export const ContactMessage = mongoose.model('ContactMessage', ContactMessageSchema);
export const HomeConfig = mongoose.model('HomeConfig', HomeConfigSchema);
export const Member = mongoose.model('Member', MemberSchema);
