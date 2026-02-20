"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = exports.FooterConfig = exports.AboutConfig = exports.HomeConfig = exports.ContactMessage = exports.DonationProject = exports.Donation = exports.DepartmentInterest = exports.Department = exports.Announcement = exports.Leader = exports.News = exports.SystemLog = exports.QuizResult = exports.BibleQuiz = exports.VerseReflection = exports.DailyVerse = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcryptjs"));
const schemaOptions = {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            delete ret.password; // Do not return password hash
            return ret;
        },
    },
    toObject: { virtuals: true },
};
// --- Schema Definitions ---
const MemberSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
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
}, schemaOptions);
// Hash password before saving using modern async middleware
MemberSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt_1.default.genSalt(10);
    this.password = await bcrypt_1.default.hash(this.password, salt);
});
// Method to compare passwords for login
MemberSchema.methods.comparePassword = async function (candidatePassword) {
    if (!candidatePassword || !this.password) {
        return false;
    }
    return bcrypt_1.default.compare(candidatePassword, this.password);
};
const DailyVerseSchema = new mongoose_1.Schema({
    theme: String,
    verse: String,
    reference: String,
    description: String,
    date: String,
    isActive: { type: Boolean, default: true }
}, schemaOptions);
const VerseReflectionSchema = new mongoose_1.Schema({
    verseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'DailyVerse' },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Member' },
    userName: String,
    content: String
}, schemaOptions);
const BibleQuizSchema = new mongoose_1.Schema({
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
const QuizResultSchema = new mongoose_1.Schema({
    quizId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BibleQuiz' },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Member' },
    score: Number,
    total: Number
}, schemaOptions);
const LogSchema = new mongoose_1.Schema({
    level: { type: String, enum: ['info', 'warn', 'error'], default: 'info' },
    message: String,
    meta: Object
}, schemaOptions);
const NewsSchema = new mongoose_1.Schema({
    title: String,
    content: String,
    category: { type: String, enum: ['event', 'news', 'announcement'], default: 'news' },
    mediaUrl: String,
    mediaType: { type: String, enum: ['image', 'video', 'audio'], default: 'image' },
    author: { type: String, default: 'Admin' },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, schemaOptions);
const LeaderSchema = new mongoose_1.Schema({
    name: String,
    position: String,
    phone: String,
    academicYear: String,
    image: String,
    type: { type: String, enum: ['Executive', 'Arbitration'], default: 'Executive' }
}, schemaOptions);
const AnnouncementSchema = new mongoose_1.Schema({
    title: String,
    content: String,
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    status: { type: String, enum: ['Notice', 'Urgent', 'Info'], default: 'Info' },
    color: String,
    isActive: { type: Boolean, default: true }
}, schemaOptions);
const DepartmentSchema = new mongoose_1.Schema({
    name: String,
    description: String,
    icon: String,
    image: String,
    category: String,
    details: String,
    activities: [String]
}, schemaOptions);
const DepartmentInterestSchema = new mongoose_1.Schema({
    fullName: String,
    email: String,
    phone: String,
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    departmentName: String
}, schemaOptions);
const DonationSchema = new mongoose_1.Schema({
    donorName: String,
    email: String,
    phone: String,
    amount: Number,
    currency: { type: String, default: 'RWF' },
    category: String,
    project: String,
    status: { type: String, enum: ['Completed', 'Pending', 'Failed'], default: 'Pending' },
    transactionId: { type: String, unique: true }
}, schemaOptions);
const DonationProjectSchema = new mongoose_1.Schema({
    title: String,
    description: String,
    goal: Number,
    raised: { type: Number, default: 0 },
    image: String,
    isActive: { type: Boolean, default: true }
}, schemaOptions);
const ContactMessageSchema = new mongoose_1.Schema({
    fullName: String,
    email: String,
    phone: String,
    subject: String,
    message: String,
    isRead: { type: Boolean, default: false }
}, schemaOptions);
const HomeConfigSchema = new mongoose_1.Schema({ heroTitle: String, heroSubtitle: String, heroImageUrl: String, motto: String, aboutTitle: String, aboutText: String, aboutImageUrl: String, aboutScripture: String, aboutScriptureRef: String }, { ...schemaOptions, collection: 'config_home' });
const AboutConfigSchema = new mongoose_1.Schema({ heroTitle: String, heroSubtitle: String, heroImage: String, historyTitle: String, historyContent: String, historyImage: String, visionTitle: String, visionContent: String, missionTitle: String, missionContent: String, values: Array, timeline: Array }, { ...schemaOptions, collection: 'config_about' });
const FooterConfigSchema = new mongoose_1.Schema({ description: String, facebookUrl: String, twitterUrl: String, instagramUrl: String, linkedinUrl: String, youtubeUrl: String, whatsappUrl: String, tiktokUrl: String, address: String, phone: String, email: String }, { ...schemaOptions, collection: 'config_footer' });
// --- Model Exports ---
exports.DailyVerse = mongoose_1.default.models.DailyVerse || mongoose_1.default.model('DailyVerse', DailyVerseSchema);
exports.VerseReflection = mongoose_1.default.models.VerseReflection || mongoose_1.default.model('VerseReflection', VerseReflectionSchema);
exports.BibleQuiz = mongoose_1.default.models.BibleQuiz || mongoose_1.default.model('BibleQuiz', BibleQuizSchema);
exports.QuizResult = mongoose_1.default.models.QuizResult || mongoose_1.default.model('QuizResult', QuizResultSchema);
exports.SystemLog = mongoose_1.default.models.SystemLog || mongoose_1.default.model('SystemLog', LogSchema);
exports.News = mongoose_1.default.models.News || mongoose_1.default.model('News', NewsSchema);
exports.Leader = mongoose_1.default.models.Leader || mongoose_1.default.model('Leader', LeaderSchema);
exports.Announcement = mongoose_1.default.models.Announcement || mongoose_1.default.model('Announcement', AnnouncementSchema);
exports.Department = mongoose_1.default.models.Department || mongoose_1.default.model('Department', DepartmentSchema);
exports.DepartmentInterest = mongoose_1.default.models.DepartmentInterest || mongoose_1.default.model('DepartmentInterest', DepartmentInterestSchema);
exports.Donation = mongoose_1.default.models.Donation || mongoose_1.default.model('Donation', DonationSchema);
exports.DonationProject = mongoose_1.default.models.DonationProject || mongoose_1.default.model('DonationProject', DonationProjectSchema);
exports.ContactMessage = mongoose_1.default.models.ContactMessage || mongoose_1.default.model('ContactMessage', ContactMessageSchema);
exports.HomeConfig = mongoose_1.default.models.HomeConfig || mongoose_1.default.model('HomeConfig', HomeConfigSchema);
exports.AboutConfig = mongoose_1.default.models.AboutConfig || mongoose_1.default.model('AboutConfig', AboutConfigSchema);
exports.FooterConfig = mongoose_1.default.models.FooterConfig || mongoose_1.default.model('FooterConfig', FooterConfigSchema);
exports.Member = mongoose_1.default.models.Member || mongoose_1.default.model('Member', MemberSchema);
