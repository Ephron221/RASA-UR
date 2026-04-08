
import React, { useState, useRef, useEffect } from 'react';
// Fix framer-motion prop errors by casting motion to any
import { motion as motionLib, AnimatePresence } from 'framer-motion';
const motion = motionLib as any;
import { 
  User, Briefcase, GraduationCap, Bell, ShieldCheck, 
  ArrowRight, BookOpen, Heart, Zap, Edit3, X, Save, 
  Camera, Loader2, Sparkles, Clock, CheckCircle2, Award, Quote
} from 'lucide-react';
import { Announcement, DailyVerse, BibleQuiz, QuizResult } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { API } from '../services/api';

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

  useEffect(() => {
    API.spiritual.verses.getDaily().then(setDailyVerse);
    API.spiritual.quizzes.getActive().then(setQuizzes);
  }, []);

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
      notify("Identity Synchronized", "Your membership pulse has been successfully updated. Thank you.", "success");
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
      notify("Quest Complete", `Congratulations! You earned ${earnedPoints} Spirit Points. May the word dwell in you richly.`, "success");
    } finally { setIsSubmittingQuiz(false); }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-primary">
      <div className="max-container px-4">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl border border-gray-100 mb-10 flex flex-col lg:flex-row items-center gap-10">
          <div className="w-40 h-40 rounded-[2.5rem] bg-secondary overflow-hidden border-4 border-white shadow-2xl shrink-0 group relative">
            {currentUser.profileImage ? <img src={currentUser.profileImage} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-white text-5xl font-black">{currentUser.fullName.charAt(0)}</div>}
            <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Zap className="text-white" size={32}/></div>
          </div>
          <div className="flex-grow text-center lg:text-left space-y-4">
             <div className="flex flex-col lg:flex-row items-center gap-3">
                <h1 className="text-4xl font-black font-serif italic text-black">{currentUser.fullName}</h1>
                <span className="px-3 py-1 bg-secondary/5 text-secondary text-[10px] font-black uppercase rounded-full border border-secondary/10">Verified Member</span>
             </div>
             <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="px-5 py-2 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-sm text-black/60"><Briefcase size={16} className="inline mr-2 text-secondary" />{currentUser.department}</div>
                <div className="px-5 py-2 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-sm text-black/60"><Award size={16} className="inline mr-2 text-amber-500" />{currentUser.spiritPoints || 0} Spirit Points</div>
                <button onClick={() => setIsEditing(true)} className="px-5 py-2 bg-secondary text-white rounded-2xl hover:bg-secondary/90 transition-colors font-black text-xs uppercase tracking-widest shadow-lg">Edit Profile</button>
             </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Daily Bread & Quizzes */}
           <div className="lg:col-span-8 space-y-8">
              {dailyVerse && (
                <div className="bg-secondary text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles size={120}/></div>
                   <div className="relative z-10 space-y-6">
                      <p className="text-accent font-black text-[10px] uppercase tracking-[0.4em]">Daily Bread</p>
                      <h3 className="text-3xl font-black font-serif italic">{dailyVerse.theme}</h3>
                      <p className="text-2xl font-serif italic text-white/90 leading-relaxed">"{dailyVerse.verse}"</p>
                      <p className="text-accent font-black text-xs uppercase text-right">— {dailyVerse.reference}</p>
                   </div>
                </div>
              )}

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

           {/* Sidebar: Announcements */}
           <div className="lg:col-span-4">
              <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm h-fit">
                 <h4 className="text-sm font-black text-black uppercase tracking-widest mb-8 flex items-center gap-2"><Bell size={16} className="text-secondary"/> Latest Bulletins</h4>
                 <div className="space-y-6">
                    {announcements.filter(a => a.isActive).slice(0, 4).map(ann => (
                      <div key={ann.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                         <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${ann.status === 'Urgent' ? 'bg-orange-100 text-orange-600' : 'bg-secondary/10 text-secondary'}`}>{ann.status}</span>
                         <h6 className="font-black text-black text-sm leading-tight">{ann.title}</h6>
                         <p className="text-xs text-black/50 line-clamp-2">{ann.content}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-3xl flex flex-col">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                   <h3 className="text-2xl font-black font-serif italic text-black">Update Profile</h3>
                   <button onClick={() => setIsEditing(false)} className="p-2 bg-white rounded-xl text-black/40 hover:text-red-500 transition-all"><X size={24}/></button>
                </div>
                <form onSubmit={handleUpdateProfile} className="p-10 space-y-6">
                   <div className="flex flex-col items-center gap-4 mb-4">
                      <div onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-[2rem] bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-secondary transition-colors">
                         {filePreview ? <img src={filePreview} className="w-full h-full object-cover" alt=""/> : <Camera className="text-black/40 group-hover:text-secondary transition-colors"/>}
                      </div>
                      <input type="file" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if(f){ const r = new FileReader(); r.onloadend = () => setFilePreview(r.result as string); r.readAsDataURL(f); } }} className="hidden" />
                      <p className="text-[10px] font-black uppercase text-black/40">Change Portrait</p>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-black/40 uppercase ml-2">Full Name</label>
                      <input name="fullName" defaultValue={currentUser.fullName} required className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold border border-gray-100 focus:ring-2 focus:ring-secondary/20 outline-none text-black" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-black/40 uppercase ml-2">Phone</label>
                      <input name="phone" defaultValue={currentUser.phone} required className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold border border-gray-100 focus:ring-2 focus:ring-secondary/20 outline-none text-black" />
                   </div>
                   <button type="submit" disabled={isSaving} className="w-full py-5 bg-secondary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-secondary/90 transition-all">
                      {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18}/>} Save Changes
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quiz Modal */}
      <AnimatePresence>
        {activeQuiz && (
           <div className="fixed inset-0 z-[600] bg-white flex flex-col p-8 md:p-16 text-black overflow-y-auto">
              <div className="max-w-4xl mx-auto w-full space-y-12">
                 <div className="flex justify-between items-center border-b border-gray-100 pb-8">
                    <div className="space-y-1">
                       <h2 className="text-4xl font-black font-serif italic text-secondary">{activeQuiz.title}</h2>
                       <p className="text-xs font-bold text-black/40 uppercase tracking-widest">Sanctuary Quest Protocol</p>
                    </div>
                    <button onClick={() => setActiveQuiz(null)} className="p-4 bg-gray-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all text-black/40"><X size={32}/></button>
                 </div>

                 {quizResult ? (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-20 space-y-8">
                       <div className="w-40 h-40 bg-secondary/10 rounded-[3rem] border border-secondary/20 flex items-center justify-center mx-auto shadow-xl">
                          <CheckCircle2 size={80} className="text-secondary" />
                       </div>
                       <div className="space-y-3">
                          <h3 className="text-5xl font-black italic font-serif text-black">Quest Complete</h3>
                          <p className="text-2xl text-black/60">Final Score: <span className="text-secondary font-black">{quizResult.score} / {quizResult.total}</span></p>
                          <p className="text-accent font-black uppercase text-sm">+{Math.floor((quizResult.score/quizResult.total)*100)} Spirit Points Earned</p>
                       </div>
                       <button onClick={() => { setActiveQuiz(null); setQuizResult(null); setQuizAnswers({}); }} className="px-16 py-6 bg-secondary text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-secondary/90 transition-all">Return to Dashboard</button>
                    </motion.div>
                 ) : (
                    <div className="space-y-12 pb-20">
                       {activeQuiz.questions.map((q, i) => (
                          <div key={q.id} className="space-y-6">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-secondary text-white rounded-xl flex items-center justify-center font-black">{i + 1}</div>
                                <h4 className="text-2xl font-bold text-black">{q.text}</h4>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options.map(opt => (
                                   <button 
                                    key={opt}
                                    onClick={() => setQuizAnswers({...quizAnswers, [q.id]: opt})}
                                    className={`p-6 rounded-3xl border-2 text-left transition-all font-bold text-lg ${quizAnswers[q.id] === opt ? 'bg-secondary border-secondary text-white shadow-xl' : 'bg-gray-50 border-gray-100 hover:border-secondary/20 text-black/60'}`}
                                   >
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
                            className="px-20 py-6 bg-secondary text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-secondary/90 active:scale-95 disabled:opacity-30 flex items-center gap-4 transition-all"
                          >
                             {isSubmittingQuiz ? <Loader2 className="animate-spin" /> : <Save size={24}/>} Submit Quest
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
