
import React, { useState, useRef, useEffect, useMemo } from 'react';
// Fix framer-motion prop errors by casting motion to any
import { motion as motionLib, AnimatePresence } from 'framer-motion';
const motion = motionLib as any;
import { 
  User as UserIcon, Briefcase, GraduationCap, Bell, ShieldCheck, 
  ArrowRight, BookOpen, Heart, Zap, Edit3, X, Save, 
  Camera, Loader2, Sparkles, Clock, CheckCircle2, Award, Quote,
  ChevronRight, Target, Activity, Users, Wallet, Shield, MessageSquare,
  Layout, Calendar as CalendarIcon, MapPin, Star
} from 'lucide-react';
import { Announcement, DailyVerse, BibleQuiz, QuizResult, NewsItem, DepartmentInterest, Donation } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { API } from '../services/api';
import { Link } from 'react-router-dom';

interface MemberDashboardProps {
  announcements: Announcement[];
}

const MemberDashboard: React.FC<MemberDashboardProps> = ({ announcements }) => {
  const { user: currentUser, updateUser } = useAuth();
  const { notify } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dailyVerse, setDailyVerse] = useState<DailyVerse | null>(null);
  const [quizzes, setQuizzes] = useState<BibleQuiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<BibleQuiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  
  // Dynamic Role-Based Data
  const [upcomingEvents, setUpcomingEvents] = useState<NewsItem[]>([]);
  const [pendingRequests, setPendingRequests] = useState<DepartmentInterest[]>([]);
  const [recentOfferings, setRecentOfferings] = useState<Donation[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoadingData(true);
      try {
        const [verse, qz, newsData] = await Promise.all([
          API.spiritual.verses.getDaily(),
          API.spiritual.quizzes.getActive(),
          API.news.getAll()
        ]);
        
        setDailyVerse(verse);
        setQuizzes(qz || []);
        setUpcomingEvents(newsData?.filter((n: NewsItem) => n.category === 'event').slice(0, 3) || []);

        // Role-specific data fetching
        if (currentUser?.role === 'it' || currentUser?.role === 'executive' || currentUser?.role === 'ministry-leader') {
          const interests = await API.departments.getInterests();
          setPendingRequests(interests?.filter((i: DepartmentInterest) => i.status === 'Pending') || []);
        }

        if (currentUser?.role === 'accountant' || currentUser?.role === 'it') {
          const donations = await API.donations.getAll();
          setRecentOfferings(donations?.slice(0, 5) || []);
        }
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (currentUser) loadDashboardData();
  }, [currentUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSaving(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const updates = {
      fullName: formData.get('fullName') as string,
      phone: formData.get('phone') as string,
      profileImage: filePreview || currentUser.profileImage
    };
    try {
      await API.members.update(currentUser.id, updates);
      updateUser({ ...currentUser, ...updates });
      setIsEditing(false);
      notify("Identity Synchronized", "Your profile has been updated.", "success");
    } finally { setIsSaving(false); }
  };

  const handleQuizSubmit = async () => {
    if (!activeQuiz || !currentUser) return;
    setIsSubmittingQuiz(true);
    let score = 0;
    activeQuiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) score++;
    });

    const result: QuizResult = {
      id: Math.random().toString(36).substr(2, 9),
      quizId: activeQuiz.id,
      userId: currentUser.id,
      score,
      total: activeQuiz.questions.length,
      timestamp: new Date().toISOString()
    };

    try {
      await API.spiritual.quizzes.submitResult(result);
      setQuizResult(result);
      const earnedPoints = Math.floor((score/result.total)*100);
      updateUser({ ...currentUser, spiritPoints: (currentUser.spiritPoints || 0) + earnedPoints });
      notify("Quest Complete", `Congratulations! You earned ${earnedPoints} Spirit Points.`, "success");
    } finally { setIsSubmittingQuiz(false); }
  };

  const currentLevelProgress = useMemo(() => {
    if (!currentUser) return 0;
    const points = currentUser.spiritPoints || 0;
    // Simple level logic: every 500 points is a milestone
    return (points % 500) / 5; 
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#F8FAFC]">
      <div className="max-container px-4">
        
        {/* Modern Interactive Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 bg-white p-8 md:p-12 rounded-[3.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-secondary/10 transition-colors" />
            
            <div className="relative shrink-0">
              <div className="w-40 h-40 rounded-[3rem] bg-secondary overflow-hidden border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-500">
                {currentUser.profileImage ? (
                  <img src={currentUser.profileImage} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-6xl font-black">{currentUser.fullName.charAt(0)}</div>
                )}
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(true)}
                className="absolute bottom-2 right-2 p-3 bg-black text-white rounded-2xl shadow-xl hover:bg-secondary transition-colors"
              >
                <Edit3 size={18} />
              </motion.button>
            </div>

            <div className="flex-grow text-center md:text-left space-y-6 relative z-10">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                  <span className="px-3 py-1 bg-secondary text-white text-[8px] font-black uppercase rounded-full tracking-widest">
                    {currentUser.role} Clearance
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[8px] font-black uppercase rounded-full tracking-widest flex items-center gap-1">
                    <MapPin size={8}/> {currentUser.diocese}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-black leading-tight tracking-tight uppercase">
                  Peace, <span className="text-secondary font-serif italic lowercase">{currentUser.fullName.split(' ')[0]}</span>
                </h1>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-secondary"><Briefcase size={16} /></div>
                  <div>
                    <p className="text-[8px] font-black text-black/30 uppercase tracking-widest">Ministry</p>
                    <p className="text-xs font-bold text-black">{currentUser.department || 'General Assembly'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-amber-500"><Star size={16} /></div>
                  <div>
                    <p className="text-[8px] font-black text-black/30 uppercase tracking-widest">Academic</p>
                    <p className="text-xs font-bold text-black">{currentUser.level}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stewardship Stats Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 bg-black text-white p-8 md:p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl"><Target size={24} className="text-secondary"/></div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Global Rank</p>
                  <p className="text-xl font-black">STRIKER</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <h3 className="text-5xl font-black">{currentUser.spiritPoints || 0}</h3>
                  <p className="text-secondary font-black text-xs uppercase tracking-widest mb-1">Spirit Points</p>
                </div>
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${currentLevelProgress}%` }}
                    className="h-full bg-secondary shadow-[0_0_20px_rgba(59,107,31,0.5)]" 
                  />
                </div>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                  {500 - ((currentUser.spiritPoints || 0) % 500)} points until next Archival Tier
                </p>
              </div>
            </div>

            <Link to="/portal" className="mt-8 group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest">Reflection Hub</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Dynamic Role-Based Widgets Section */}
        <AnimatePresence>
          {(pendingRequests.length > 0 || recentOfferings.length > 0) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10"
            >
              {/* Leader: Pending Requests */}
              {(currentUser.role === 'ministry-leader' || currentUser.role === 'executive' || currentUser.role === 'it') && pendingRequests.length > 0 && (
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={18}/></div>
                    <h4 className="text-xs font-black text-black uppercase tracking-widest">Join Requests</h4>
                    <span className="ml-auto px-2 py-1 bg-blue-600 text-white text-[9px] font-black rounded-lg">{pendingRequests.length}</span>
                  </div>
                  <div className="space-y-3">
                    {pendingRequests.slice(0, 3).map(req => (
                      <div key={req.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-black text-black uppercase">{req.fullName}</p>
                          <p className="text-[9px] font-bold text-black/40">{req.departmentName}</p>
                        </div>
                        <Link to="/admin" className="p-2 bg-white rounded-lg shadow-sm hover:text-secondary transition-colors"><ArrowRight size={14}/></Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accountant: Recent Offerings */}
              {(currentUser.role === 'accountant' || currentUser.role === 'it') && recentOfferings.length > 0 && (
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Wallet size={18}/></div>
                    <h4 className="text-xs font-black text-black uppercase tracking-widest">Verify Offerings</h4>
                  </div>
                  <div className="space-y-3">
                    {recentOfferings.filter(d => d.status === 'Pending').slice(0, 3).map(d => (
                      <div key={d.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-black text-black uppercase">{d.donorName}</p>
                          <p className="text-[9px] font-bold text-secondary">{d.amount} {d.currency}</p>
                        </div>
                        <Link to="/admin" className="p-2 bg-white rounded-lg shadow-sm hover:text-secondary transition-colors"><ArrowRight size={14}/></Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* IT Architect: System Quick-View */}
              {currentUser.role === 'it' && (
                <div className="bg-[#111] text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 text-white/5"><Shield size={80}/></div>
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="p-2 bg-secondary/20 text-secondary rounded-lg"><Activity size={18}/></div>
                    <h4 className="text-xs font-black uppercase tracking-widest">Kernel Pulse</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                      <p className="text-[8px] font-black text-white/40 uppercase mb-1">Status</p>
                      <p className="text-xs font-black text-secondary">STABLE</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                      <p className="text-[8px] font-black text-white/40 uppercase mb-1">Sync</p>
                      <p className="text-xs font-black text-blue-400">ACTIVE</p>
                    </div>
                  </div>
                  <Link to="/admin" className="mt-6 w-full py-3 bg-white text-black font-black text-[9px] uppercase tracking-widest rounded-xl text-center flex items-center justify-center gap-2 hover:bg-secondary hover:text-white transition-all">
                    Access Core <Shield size={12}/>
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Primary Content: Daily Bread & Events */}
           <div className="lg:col-span-8 space-y-8">
              
              {/* Modern Daily Bread */}
              {dailyVerse && (
                <div className="bg-secondary text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700"><Quote size={160}/></div>
                   <div className="relative z-10 space-y-8">
                      <div className="flex items-center gap-3">
                        <Sparkles className="text-accent animate-pulse" size={20}/>
                        <p className="text-accent font-black text-[10px] uppercase tracking-[0.5em]">The Eternal Sequence</p>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-4xl font-black font-serif italic leading-tight">{dailyVerse.theme}</h3>
                        <p className="text-2xl md:text-3xl font-serif italic text-white/90 leading-relaxed max-w-2xl">
                          "{dailyVerse.verse}"
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <p className="text-accent font-black text-xs uppercase tracking-widest">{dailyVerse.reference}</p>
                        <div className="flex gap-2">
                          <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-all"><MessageSquare size={18}/></button>
                          <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-all"><Heart size={18}/></button>
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {/* Upcoming Events Horizontal Scroll */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-black font-serif italic text-black">Upcoming Assemblies</h4>
                  <Link to="/news" className="text-[10px] font-black text-secondary uppercase tracking-widest hover:underline flex items-center gap-2">View Archive <ArrowRight size={14}/></Link>
                </div>
                <div className="flex gap-6 overflow-x-auto pb-6 scroll-hide">
                  {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                    <div key={event.id} className="min-w-[300px] bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group shrink-0">
                      <div className="relative h-40 rounded-2xl overflow-hidden mb-6">
                        <img src={event.mediaUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black uppercase text-secondary">Assembly Event</div>
                      </div>
                      <h5 className="text-lg font-black text-black mb-2 line-clamp-1">{event.title}</h5>
                      <div className="flex items-center gap-4 text-black/40 mb-6">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold"><CalendarIcon size={12}/> {event.date}</div>
                      </div>
                      <button className="w-full py-4 bg-gray-50 text-black font-black text-[9px] uppercase tracking-widest group-hover:bg-black group-hover:text-white transition-all rounded-xl">Sequence Details</button>
                    </div>
                  )) : (
                    <div className="w-full py-12 bg-white rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                      <CalendarIcon size={32} className="mb-2 opacity-20"/>
                      <p className="text-[10px] font-black uppercase tracking-widest">No pending assemblies found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quest Hub Refined */}
              <div className="space-y-6">
                 <h4 className="text-xl font-black font-serif italic text-black">Sanctuary Quest Center</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quizzes.map(q => (
                      <div key={q.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                         <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-secondary/5 text-secondary rounded-2xl flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all"><BookOpen size={24}/></div>
                            <span className="text-[10px] font-black text-black/40 uppercase tracking-widest flex items-center gap-2"><Clock size={12}/> {q.timeLimit}m</span>
                         </div>
                         <h5 className="text-xl font-black text-black mb-2">{q.title}</h5>
                         <p className="text-sm text-black/50 mb-6 italic line-clamp-2">"{q.description}"</p>
                         <button onClick={() => setActiveQuiz(q)} className="w-full py-4 bg-gray-50 text-black font-black text-[10px] uppercase tracking-widest group-hover:bg-secondary group-hover:text-white transition-all rounded-2xl">Begin Quest</button>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Sidebar Layout */}
           <div className="lg:col-span-4 space-y-8">
              {/* Bulletins Widget */}
              <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                 <div className="flex items-center justify-between mb-8">
                    <h4 className="text-sm font-black text-black uppercase tracking-widest flex items-center gap-2"><Bell size={16} className="text-secondary"/> Bulletins</h4>
                    <Link to="/announcements" className="p-2 bg-gray-50 rounded-xl hover:text-secondary transition-colors"><ExternalLink size={14}/></Link>
                 </div>
                 <div className="space-y-6">
                    {announcements.filter(a => a.isActive).slice(0, 4).map(ann => (
                      <div key={ann.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 hover:border-secondary/20 transition-all cursor-default group">
                         <div className="flex justify-between items-start">
                            <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase ${ann.status === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-secondary/10 text-secondary'}`}>{ann.status}</span>
                            <p className="text-[8px] font-bold text-black/20">{ann.date}</p>
                         </div>
                         <h6 className="font-black text-black text-sm leading-tight group-hover:text-secondary transition-colors">{ann.title}</h6>
                         <p className="text-[11px] text-black/50 line-clamp-2 leading-relaxed">{ann.content}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* My Ministry Card */}
              <div className="bg-secondary p-8 rounded-[3rem] text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 p-6 opacity-10"><Briefcase size={80}/></div>
                <div className="relative z-10 space-y-6">
                  <div>
                    <p className="text-[9px] font-black text-accent uppercase tracking-widest mb-1">Your Ministry Hub</p>
                    <h4 className="text-2xl font-black font-serif italic">{currentUser.department || 'General Assembly'}</h4>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[11px] font-medium text-white/70 leading-relaxed italic">
                      "Each one should use whatever gift he has received to serve others..."
                    </p>
                    <Link to="/departments" className="w-full py-3 bg-white text-secondary rounded-xl font-black text-[9px] uppercase tracking-widest text-center block shadow-lg hover:scale-105 transition-all">Connect with Stewards</Link>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Profile Edit Modal Refined */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-lg rounded-[3.5rem] overflow-hidden shadow-3xl flex flex-col border border-white">
                <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                   <div className="space-y-1">
                      <h3 className="text-2xl font-black font-serif italic text-black leading-none">Identity Sync</h3>
                      <p className="text-[9px] font-black text-black/30 uppercase tracking-widest">Update your Archival Parameters</p>
                   </div>
                   <button onClick={() => setIsEditing(false)} className="p-3 bg-white rounded-2xl shadow-sm text-black/40 hover:text-red-500 transition-all"><X size={20}/></button>
                </div>
                <form onSubmit={handleUpdateProfile} className="p-12 space-y-8">
                   <div className="flex flex-col items-center gap-4">
                      <div 
                        onClick={() => fileInputRef.current?.click()} 
                        className="w-32 h-32 rounded-[3rem] bg-gray-100 border-4 border-dashed border-gray-200 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-secondary hover:bg-white transition-all relative shadow-inner"
                      >
                         {filePreview || currentUser.profileImage ? (
                           <img src={filePreview || currentUser.profileImage} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" alt=""/>
                         ) : (
                           <Camera className="text-black/40 group-hover:text-secondary transition-colors" size={32}/>
                         )}
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="text-secondary" size={24}/></div>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if(f){ const r = new FileReader(); r.onloadend = () => setFilePreview(r.result as string); r.readAsDataURL(f); } }} className="hidden" accept="image/*" />
                      <p className="text-[10px] font-black uppercase text-black/30 tracking-widest">Member Portrait</p>
                   </div>
                   
                   <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-black/40 uppercase ml-4 tracking-widest">Full Legal Name</label>
                        <div className="relative">
                          <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" size={18}/>
                          <input name="fullName" defaultValue={currentUser.fullName} required className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-[1.8rem] font-bold border-none focus:ring-4 focus:ring-secondary/5 outline-none text-black" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-black/40 uppercase ml-4 tracking-widest">Phone Pulse</label>
                        <div className="relative">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" size={18}/>
                          <input name="phone" defaultValue={currentUser.phone} required className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-[1.8rem] font-bold border-none focus:ring-4 focus:ring-secondary/5 outline-none text-black" />
                        </div>
                     </div>
                   </div>

                   <button type="submit" disabled={isSaving} className="w-full py-6 bg-secondary text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 hover:bg-black transition-all active:scale-95 disabled:opacity-50">
                      {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20}/>} Commit Changes
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quiz Modal Layout remains consistent but polished */}
      <AnimatePresence>
        {activeQuiz && (
           <div className="fixed inset-0 z-[600] bg-white flex flex-col p-8 md:p-16 text-black overflow-y-auto">
              <div className="max-w-4xl mx-auto w-full space-y-12">
                 <div className="flex justify-between items-center border-b border-gray-100 pb-8">
                    <div className="space-y-1">
                       <h2 className="text-4xl font-black font-serif italic text-secondary leading-none">{activeQuiz.title}</h2>
                       <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.4em] mt-2">Sanctuary Quest Protocol</p>
                    </div>
                    <button onClick={() => setActiveQuiz(null)} className="p-4 bg-gray-50 rounded-[1.5rem] hover:bg-red-50 hover:text-red-500 transition-all text-black/40 shadow-sm"><X size={32}/></button>
                 </div>

                 {quizResult ? (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-20 space-y-10 bg-gray-50 rounded-[4rem] border border-gray-100 shadow-inner">
                       <div className="w-48 h-48 bg-secondary/10 rounded-[4rem] border-4 border-white flex items-center justify-center mx-auto shadow-2xl relative">
                          <div className="absolute inset-0 bg-secondary rounded-[4rem] opacity-5 animate-ping" />
                          <CheckCircle2 size={96} className="text-secondary relative z-10" />
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-6xl font-black italic font-serif text-black leading-none">Quest Complete</h3>
                          <p className="text-3xl text-black/60 font-medium">Final Score: <span className="text-secondary font-black">{quizResult.score} / {quizResult.total}</span></p>
                          <div className="inline-flex items-center gap-2 px-6 py-2 bg-amber-500 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">
                            <Sparkles size={14}/> +{Math.floor((quizResult.score/quizResult.total)*100)} Spirit Points Earned
                          </div>
                       </div>
                       <button onClick={() => { setActiveQuiz(null); setQuizResult(null); setQuizAnswers({}); }} className="px-20 py-6 bg-black text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-secondary transition-all active:scale-95">Return to Sanctuary</button>
                    </motion.div>
                 ) : (
                    <div className="space-y-12 pb-20">
                       {activeQuiz.questions.map((q, i) => (
                          <div key={q.id} className="space-y-8 bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                             <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl">{i + 1}</div>
                                <h4 className="text-3xl font-black text-black leading-tight tracking-tight">{q.text}</h4>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {q.options.map(opt => (
                                   <button 
                                    key={opt}
                                    onClick={() => setQuizAnswers({...quizAnswers, [q.id]: opt})}
                                    className={`p-8 rounded-[2rem] border-4 text-left transition-all font-black text-xl relative overflow-hidden group ${quizAnswers[q.id] === opt ? 'bg-secondary border-secondary text-white shadow-2xl scale-105' : 'bg-white border-white hover:border-secondary/20 text-black/40 hover:text-black shadow-sm'}`}
                                   >
                                      {quizAnswers[q.id] === opt && <div className="absolute top-0 right-0 p-4"><CheckCircle2 size={24}/></div>}
                                      {opt}
                                   </button>
                                ))}
                             </div>
                          </div>
                       ))}
                       <div className="pt-10 flex justify-center">
                          <button 
                            disabled={Object.keys(quizAnswers).length < activeQuiz.questions.length || isSubmittingQuiz}
                            onClick={handleQuizSubmit}
                            className="px-24 py-8 bg-secondary text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.5em] shadow-[0_20px_50px_rgba(59,107,31,0.4)] hover:bg-black active:scale-95 disabled:opacity-30 flex items-center gap-6 transition-all"
                          >
                             {isSubmittingQuiz ? <Loader2 className="animate-spin" size={28}/> : <Save size={28}/>} Submit Sequence
                          </button>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemberDashboard;
