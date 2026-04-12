import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Sparkles, MessageSquare, Heart, Calendar as CalendarIcon, Bell, ExternalLink, ArrowRight, BookOpen, Clock, Target, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DailyVerse, NewsItem, Announcement, BibleQuiz, User } from '../../types';
import { useNotification } from '../../contexts/NotificationContext';
import { API } from '../../services/api';

interface MemberOverviewTabProps {
  currentUser: User;
  dailyVerse: DailyVerse | null;
  upcomingEvents: NewsItem[];
  announcements: Announcement[];
  quizzes: BibleQuiz[];
  setActiveQuiz: (q: BibleQuiz) => void;
  currentLevelProgress: number;
}

const MemberOverviewTab: React.FC<MemberOverviewTabProps> = ({ 
  currentUser, dailyVerse, upcomingEvents, announcements, quizzes, setActiveQuiz, currentLevelProgress 
}) => {
  const { notify } = useNotification();
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReflection = async () => {
    if (!reflectionText.trim() || !dailyVerse) return;
    setIsSubmitting(true);
    try {
      await API.spiritual.verses.addReflection({
        id: Math.random().toString(36).substr(2, 9),
        verseId: dailyVerse.id || (dailyVerse as any)._id,
        userId: currentUser.id || (currentUser as any)._id,
        userName: currentUser.fullName,
        content: reflectionText,
        timestamp: new Date().toISOString()
      });
      notify("Insight Transmitted", "Your reflection has been securely submitted.", "success");
      setReflectionText('');
      setShowReflection(false);
    } catch (e) {
      notify("Transmission Error", "Could not send reflection. Try again later.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
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
                    <button onClick={() => setShowReflection(!showReflection)} className={`p-3 rounded-xl backdrop-blur-md transition-all ${showReflection ? 'bg-white text-secondary' : 'bg-white/10 hover:bg-white/20'}`}><MessageSquare size={18}/></button>
                    <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-all"><Heart size={18}/></button>
                  </div>
                </div>

                <AnimatePresence>
                  {showReflection && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-2 overflow-visible">
                      <div className="relative">
                         <textarea 
                           value={reflectionText}
                           onChange={(e) => setReflectionText(e.target.value)}
                           placeholder="Share your spiritual insight on this scripture..." 
                           rows={3}
                           className="w-full bg-black/20 text-white placeholder-white/40 border-2 border-white/10 rounded-2xl p-6 outline-none focus:border-accent font-medium leading-relaxed resize-none shadow-inner"
                         />
                      </div>
                      <div className="flex justify-end mt-4">
                        <button 
                          disabled={isSubmitting || !reflectionText.trim()}
                          onClick={handleSubmitReflection}
                          className="px-8 py-4 bg-accent text-secondary font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white transition-all disabled:opacity-50 flex items-center gap-3 shadow-xl active:scale-95"
                        >
                          {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <MessageSquare size={16}/>} 
                          {isSubmitting ? 'Transmitting...' : 'Transmit Reflection'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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

        {/* Quest Hub Overview */}
        <div className="space-y-6">
            <h4 className="text-xl font-black font-serif italic text-black">Active Quests</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.slice(0, 2).map(q => (
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

        {/* Stewardship Stats Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }}
          className="bg-black text-white p-8 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between"
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

      </div>
    </div>
  );
};

export default MemberOverviewTab;
