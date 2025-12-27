
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Phone, Mail, GraduationCap, MapPin, 
  Briefcase, Calendar, Bell, ShieldCheck, 
  ArrowRight, BookOpen, Heart, Award, 
  Zap, Star, MessageCircle, FileText, ChevronRight,
  Edit3, X, Save, Camera, Upload, Loader2, Database,
  Sparkles, Send, Clock, Book, CheckCircle2
} from 'lucide-react';
import { User as UserType, Announcement, DailyVerse, BibleQuiz, QuizResult } from '../types';
import { API } from '../services/api';
import { DIOCESES, DEPARTMENTS, LEVELS } from '../constants';

interface MemberDashboardProps {
  user: UserType;
  announcements: Announcement[];
}

const MemberDashboard: React.FC<MemberDashboardProps> = ({ user, announcements }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUser, setCurrentUser] = useState(user);

  // Spiritual Hub States
  const [dailyVerse, setDailyVerse] = useState<DailyVerse | null>(null);
  const [reflection, setReflection] = useState('');
  const [isReflecting, setIsReflecting] = useState(false);
  const [quizzes, setQuizzes] = useState<BibleQuiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<BibleQuiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizTimeLeft, setQuizTimeLeft] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<QuizResult | null>(null);

  const activeAnnouncements = announcements.filter(a => a.isActive).slice(0, 4);

  useEffect(() => {
    API.spiritual.verses.getDaily().then(setDailyVerse);
    API.spiritual.quizzes.getActive().then(setQuizzes);
  }, []);

  // Timer Effect
  useEffect(() => {
    if (activeQuiz && quizTimeLeft > 0 && !quizSubmitted) {
      const timer = setInterval(() => setQuizTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (activeQuiz && quizTimeLeft === 0 && !quizSubmitted) {
      handleQuizSubmit();
    }
  }, [activeQuiz, quizTimeLeft, quizSubmitted]);

  const handleStartQuiz = (q: BibleQuiz) => {
    setActiveQuiz(q);
    setQuizAnswers({});
    setQuizTimeLeft(q.timeLimit * 60);
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleQuizSubmit = async () => {
    if (quizSubmitted) return;
    setQuizSubmitted(true);
    
    let score = 0;
    activeQuiz?.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) score++;
    });

    const result: QuizResult = {
      id: Math.random().toString(36).substr(2, 9),
      quizId: activeQuiz!.id,
      userId: currentUser.id,
      score,
      total: activeQuiz!.questions.length,
      timestamp: new Date().toISOString()
    };

    await API.spiritual.quizzes.submitResult(result);
    setQuizScore(result);
    
    // Auto Refresh points
    const updated = await API.members.getAll();
    const self = updated.find(u => u.id === currentUser.id);
    if (self) setCurrentUser(self);
  };

  // handleFileChange added to fix missing reference error
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const updates = {
      fullName: formData.get('fullName') as string,
      phone: formData.get('phone') as string,
      diocese: formData.get('diocese') as string,
      department: formData.get('department') as string,
      level: formData.get('level') as string,
      profileImage: filePreview || currentUser.profileImage
    };
    try {
      await API.members.update(currentUser.id, updates);
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      localStorage.setItem('rasa_user', JSON.stringify(updatedUser));
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed', err);
    } finally {
      setIsSaving(false);
    }
  };

  const submitReflection = async () => {
    if (!reflection.trim()) return;
    setIsReflecting(true);
    await API.spiritual.verses.addReflection({
      id: Math.random().toString(36).substr(2, 9),
      verseId: dailyVerse!.id,
      userId: currentUser.id,
      userName: currentUser.fullName,
      content: reflection,
      timestamp: new Date().toISOString()
    });
    setReflection('');
    setIsReflecting(false);
    alert("Reflection transmitted to the Council.");
  };

  const infoCards = [
    { label: 'Email Address', value: currentUser.email, icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Phone Number', value: currentUser.phone, icon: Phone, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Academic Program', value: currentUser.program, icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Home Diocese', value: currentUser.diocese, icon: MapPin, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50/50">
      <div className="max-container px-4">
        
        {/* Profile Header Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-white mb-10 relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-end gap-10">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500 to-blue-400 rounded-[2.5rem] blur-lg opacity-20 transition-opacity"></div>
              <div className="relative w-36 h-36 rounded-[2.5rem] bg-white p-1 shadow-2xl overflow-hidden">
                {currentUser.profileImage ? (
                  <img src={currentUser.profileImage} alt={currentUser.fullName} className="w-full h-full object-cover rounded-[2.2rem]" />
                ) : (
                  <div className="w-full h-full rounded-[2.2rem] bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white text-5xl font-bold font-serif shadow-inner">
                    {currentUser.fullName.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-grow text-center lg:text-left space-y-4">
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight font-serif italic">{currentUser.fullName}</h1>
                  <span className="px-4 py-1.5 bg-cyan-50 text-cyan-600 text-xs font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-2 border border-cyan-100/50">
                    <ShieldCheck size={14} /> Verified Member
                  </span>
                </div>
                <p className="text-gray-500 font-medium text-lg">Member Since {new Date(currentUser.createdAt).getFullYear()}</p>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-2 px-5 py-2 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                  <Briefcase size={16} className="text-cyan-500" />
                  <span className="font-bold text-gray-700">{currentUser.department}</span>
                </div>
                <div className="flex items-center gap-2 px-5 py-2 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                  <GraduationCap size={16} className="text-cyan-500" />
                  <span className="font-bold text-gray-700">{currentUser.level}</span>
                </div>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-2xl shadow-lg hover:bg-cyan-600 transition-colors"
                >
                  <Edit3 size={16} />
                  <span className="font-bold">Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            
            {/* Daily Verse Hub */}
            {dailyVerse && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Book size={120}/></div>
                <div className="space-y-4">
                   <div className="inline-flex items-center gap-2 px-4 py-1 bg-cyan-50 text-cyan-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-cyan-100">
                     <Sparkles size={12}/> Morning Dew
                   </div>
                   <h3 className="text-3xl font-black font-serif italic text-gray-900">{dailyVerse.theme}</h3>
                   <div className="p-6 bg-gray-50 rounded-3xl border-l-4 border-cyan-500">
                      <p className="text-xl font-serif italic text-gray-700">"{dailyVerse.verse}"</p>
                      <p className="text-xs font-black text-cyan-600 uppercase mt-4">— {dailyVerse.reference}</p>
                   </div>
                </div>
                
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">How do you understand this word?</label>
                   <div className="flex gap-4">
                      <textarea 
                        value={reflection}
                        onChange={e => setReflection(e.target.value)}
                        placeholder="Share your reflection or suggestion..."
                        className="flex-grow px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-cyan-100 outline-none font-medium text-sm transition-all resize-none"
                        rows={2}
                      />
                      <button 
                        onClick={submitReflection}
                        disabled={isReflecting || !reflection.trim()}
                        className="px-6 bg-cyan-500 text-white rounded-2xl hover:bg-cyan-600 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <Send size={20}/>
                      </button>
                   </div>
                </div>
              </motion.div>
            )}

            {/* Quizzes Section */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-4">
                  <h3 className="text-xl font-black font-serif italic text-gray-900">Bible Sanctuary Quizzes</h3>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Challenges</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {quizzes.map(q => (
                   <div key={q.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col gap-6 group hover:shadow-xl transition-all">
                      <div className="flex justify-between items-start">
                         <div className="p-4 bg-cyan-50 text-cyan-500 rounded-2xl group-hover:bg-cyan-500 group-hover:text-white transition-all"><BookOpen size={24}/></div>
                         <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-[9px] font-black text-gray-400 uppercase">
                            <Clock size={12}/> {q.timeLimit} Min
                         </div>
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-gray-900 mb-2">{q.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2">{q.description}</p>
                      </div>
                      <button 
                        onClick={() => handleStartQuiz(q)}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500 transition-all flex items-center justify-center gap-2"
                      >
                         Enter Challenge <ArrowRight size={14}/>
                      </button>
                   </div>
                 ))}
                 {quizzes.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                       <p className="text-gray-300 italic font-serif">No active sanctuary quizzes today.</p>
                    </div>
                 )}
               </div>
            </div>

            {/* Spiritual Roadmap Card */}
            <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="relative z-10 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold font-serif italic flex items-center gap-3"><Zap size={28} className="text-cyan-500" /> Spiritual Roadmap</h3>
                    <p className="text-gray-500">Track your participation and growth in RASA activities.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-cyan-50 px-5 py-2 rounded-2xl border border-cyan-100">
                    <Star className="text-cyan-600 fill-cyan-600" size={18} />
                    <span className="font-black text-cyan-600">Bronze Disciple</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end"><span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Attendance</span><span className="text-lg font-black text-gray-900">85%</span></div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 rounded-full w-[85%]" /></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-end"><span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Spirit Points</span><span className="text-lg font-black text-gray-900">{(currentUser.spiritPoints || 0).toLocaleString()}</span></div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-yellow-500 rounded-full w-[60%]" /></div>
                  </div>
                  <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                    <div className="p-3 bg-white rounded-xl shadow-sm"><Award size={20} className="text-cyan-500" /></div>
                    <div><p className="text-xs text-gray-400 font-bold">Latest Badge</p><p className="font-bold text-sm">Sanctuary Scholar</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <div className="bg-gray-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold font-serif italic">Live Feed</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">Updates</span>
                  </div>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto scroll-hide pr-2">
                  {activeAnnouncements.map((ann, i) => (
                    <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-3xl space-y-2 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-0.5 ${ann.color} text-[8px] font-black uppercase rounded-md`}>{ann.status}</span>
                        <span className="text-[10px] text-gray-500 font-bold">{ann.date}</span>
                      </div>
                      <p className="font-bold text-gray-100">{ann.title}</p>
                    </div>
                  ))}
                  {activeAnnouncements.length === 0 && <p className="text-gray-500 italic text-sm text-center py-4">No recent updates.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {activeQuiz && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-4xl rounded-[4rem] overflow-hidden flex flex-col max-h-[95vh] shadow-3xl">
                 <div className="bg-gray-900 p-10 text-white flex justify-between items-center shrink-0">
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">Sanctuary Challenge</p>
                       <h3 className="text-3xl font-black font-serif italic">{activeQuiz.title}</h3>
                    </div>
                    {!quizSubmitted && (
                       <div className="bg-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 border border-white/10">
                          <Clock size={20} className="text-cyan-400"/>
                          <span className={`text-2xl font-black font-mono ${quizTimeLeft < 30 ? 'text-red-500 animate-pulse' : ''}`}>
                             {Math.floor(quizTimeLeft / 60)}:{(quizTimeLeft % 60).toString().padStart(2, '0')}
                          </span>
                       </div>
                    )}
                    {quizSubmitted && <button onClick={() => setActiveQuiz(null)} className="p-3 bg-white/10 rounded-2xl hover:bg-red-500 transition-all"><X size={24}/></button>}
                 </div>

                 <div className="flex-grow overflow-y-auto p-12 scroll-hide">
                    {quizScore ? (
                       <div className="py-20 text-center space-y-8">
                          <div className="relative w-40 h-40 mx-auto">
                             <svg className="w-full h-full transform -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * quizScore.score) / quizScore.total} className="text-cyan-500 transition-all duration-1000" />
                             </svg>
                             <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black text-gray-900">{Math.floor((quizScore.score / quizScore.total) * 100)}%</span>
                             </div>
                          </div>
                          <div className="space-y-2">
                             <h4 className="text-4xl font-black font-serif italic text-gray-900">Well Done, Disciple!</h4>
                             <p className="text-xl text-gray-500 font-medium">You scored <span className="text-cyan-600 font-black">{quizScore.score}</span> out of <span className="font-black">{quizScore.total}</span> points.</p>
                             <p className="text-xs text-gray-400 uppercase tracking-widest font-black">+{Math.floor((quizScore.score / quizScore.total) * 100)} Spirit Points Acquired</p>
                          </div>
                          <button onClick={() => setActiveQuiz(null)} className="px-12 py-5 bg-cyan-500 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cyan-100">Close Sanctuary</button>
                       </div>
                    ) : (
                       <div className="space-y-12">
                          {activeQuiz.questions.map((q, idx) => (
                             <div key={q.id} className="space-y-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-cyan-500 text-white rounded-xl flex items-center justify-center font-black">{idx + 1}</div>
                                   <h5 className="text-2xl font-black text-gray-900 tracking-tight">{q.text}</h5>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-14">
                                   {q.options?.map(opt => (
                                      <button 
                                        key={opt}
                                        onClick={() => setQuizAnswers(prev => ({...prev, [q.id]: opt}))}
                                        className={`px-8 py-5 rounded-2xl border-2 text-left font-bold text-sm transition-all ${quizAnswers[q.id] === opt ? 'bg-cyan-50 border-cyan-500 text-cyan-600 shadow-lg shadow-cyan-50' : 'bg-white border-gray-100 text-gray-500 hover:border-cyan-100'}`}
                                      >
                                         {opt}
                                      </button>
                                   ))}
                                </div>
                             </div>
                          ))}
                       </div>
                    )}
                 </div>

                 {!quizScore && (
                    <div className="p-10 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
                       <button 
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(quizAnswers).length < activeQuiz.questions.length}
                        className="px-16 py-6 bg-cyan-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-cyan-600 transition-all active:scale-95 disabled:opacity-50"
                       >
                          Submit Responses
                       </button>
                    </div>
                 )}
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Editor Modal (existing logic) */}
      <AnimatePresence>
        {isEditing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              <div className="px-10 pt-10 pb-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-3xl font-black font-serif italic text-gray-900">Update Profile</h2>
                <button onClick={() => setIsEditing(false)} className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-red-500"><X size={20}/></button>
              </div>
              <div className="flex-grow overflow-y-auto p-10 scroll-hide">
                <form id="profile-edit-form" onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Profile Image</label>
                    <div onClick={() => fileInputRef.current?.click()} className="relative w-40 h-40 mx-auto rounded-[2rem] border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden group">
                      {(filePreview || currentUser.profileImage) ? (
                        <img src={filePreview || currentUser.profileImage} className="w-full h-full object-cover group-hover:opacity-70 transition-opacity" alt="" />
                      ) : (
                        <Camera className="text-cyan-500" size={32} />
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Upload className="text-white" size={24}/></div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label><input name="fullName" defaultValue={currentUser.fullName} required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Phone Number</label><input name="phone" defaultValue={currentUser.phone} required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Home Diocese</label><select name="diocese" defaultValue={currentUser.diocese} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm">{DIOCESES.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">RASA Department</label><select name="department" defaultValue={currentUser.department} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm">{DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}</select></div>
                    <div className="space-y-2 md:col-span-2"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Academic Level</label><select name="level" defaultValue={currentUser.level} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm">{LEVELS.map(l => <option key={l} value={l}>{l}</option>)}</select></div>
                  </div>
                </form>
              </div>
              <div className="p-10 border-t border-gray-50 flex gap-4 bg-gray-50/30">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-grow py-5 bg-white border border-gray-200 text-gray-400 rounded-2xl font-black text-[11px] uppercase tracking-widest">Discard</button>
                <button disabled={isSaving} form="profile-edit-form" type="submit" className="flex-[2] py-5 bg-cyan-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-cyan-500/20 hover:bg-cyan-600 flex items-center justify-center gap-3">
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Database size={18} />} 
                  Save Profile
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemberDashboard;
