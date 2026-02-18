import React, { useState, useMemo } from 'react';
// Fix framer-motion prop errors by casting motion to any
import { motion as motionLib, AnimatePresence } from 'framer-motion';
const motion = motionLib as any;
import { 
  Bell, Info, AlertTriangle, CheckCircle, 
  ArrowRight, Star, Clock, Filter, 
  Calendar, Megaphone, Sparkles, Search,
  ChevronRight, AlertCircle
} from 'lucide-react';
import { Announcement } from '../types';

interface AnnouncementsProps {
  announcements: Announcement[];
}

const Announcements: React.FC<AnnouncementsProps> = ({ announcements }) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Urgent' | 'Notice' | 'Info'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const IconMap = {
    'Notice': CheckCircle,
    'Urgent': AlertTriangle,
    'Info': Info
  };

  // Requirement: Only active announcements are visible to the public
  const filteredAnnouncements = useMemo(() => {
    return announcements
      .filter(a => a.isActive)
      .filter(a => activeFilter === 'All' || a.status === activeFilter)
      .filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [announcements, activeFilter, searchQuery]);

  const latestAnnouncement = filteredAnnouncements.length > 0 ? filteredAnnouncements[0] : null;
  const standardAnnouncements = filteredAnnouncements.slice(1);

  return (
    <div className="min-h-screen pt-32 pb-32 bg-[#FAFBFC]">
      <div className="max-container px-4">
        
        {/* Header Section */}
        <header className="mb-20 space-y-6 relative">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 bg-cyan-50 rounded-full text-cyan-600 font-black text-[10px] uppercase tracking-[0.4em]"
          >
            <Megaphone size={14} /> Divine Broadcasting
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold font-serif italic text-gray-900 leading-tight tracking-tight"
          >
            Bulletin <span className="text-cyan-500">Board</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-xl font-light leading-relaxed max-w-2xl"
          >
            Stay synchronized with the latest spiritual mandates, campus updates, 
            and official RASA UR-Nyarugenge communications.
          </motion.p>
        </header>

        {/* Filter Bar */}
        <div className="sticky top-28 z-40 mb-20">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white/70 backdrop-blur-3xl p-5 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white">
            <div className="flex flex-wrap gap-2 justify-center">
              {['All', 'Urgent', 'Notice', 'Info'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter as any)}
                  className={`px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all relative ${
                    activeFilter === filter ? 'text-white' : 'text-gray-400 hover:bg-cyan-50 hover:text-cyan-600'
                  }`}
                >
                  <span className="relative z-10">{filter}</span>
                  {activeFilter === filter && (
                    <motion.div 
                      layoutId="active-bulletin-filter"
                      className="absolute inset-0 bg-cyan-500 rounded-2xl shadow-lg shadow-cyan-100"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-96 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search bulletins..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-4.5 bg-gray-50 border-2 border-transparent rounded-[2rem] outline-none font-bold text-sm focus:bg-white focus:border-cyan-100 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Latest Announcement (Hero Card) */}
        <AnimatePresence mode="wait">
          {latestAnnouncement && (
            <motion.div 
              key={latestAnnouncement.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-24"
            >
              <div className={`bg-gray-900 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden shadow-3xl transition-all duration-500 ${latestAnnouncement.status === 'Urgent' ? 'ring-[12px] ring-orange-500/20' : 'ring-1 ring-white/10'}`}>
                {/* Visual Indicator for Urgent Status */}
                {latestAnnouncement.status === 'Urgent' && (
                  <>
                    <div className="absolute top-10 right-10 flex items-center gap-3 z-20">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] animate-pulse">Critical Mandate</span>
                        <span className="text-[8px] font-bold text-gray-500 uppercase">Attention Required</span>
                      </div>
                      <div className="relative w-4 h-4">
                        <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-75"></div>
                        <div className="relative w-4 h-4 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.8)]"></div>
                      </div>
                    </div>
                    {/* Glowing Accent */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500/5 blur-[120px] pointer-events-none"></div>
                  </>
                )}

                <div className="relative z-10 flex flex-col md:flex-row gap-16 items-center">
                  <div className="shrink-0 space-y-6 text-center md:text-left">
                    <div className={`w-24 h-24 ${latestAnnouncement.status === 'Urgent' ? 'bg-orange-500' : latestAnnouncement.color} rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl ring-8 ring-white/5 transition-transform hover:scale-105 duration-500`}>
                      {React.createElement(IconMap[latestAnnouncement.status] || Info, { size: 40 })}
                    </div>
                    <div className="space-y-1">
                      <p className="text-cyan-400 font-black text-[10px] uppercase tracking-[0.4em]">Broadcast Stream</p>
                      <span className={`px-4 py-1.5 ${latestAnnouncement.status === 'Urgent' ? 'bg-orange-600' : latestAnnouncement.color} rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg`}>
                        {latestAnnouncement.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex-grow space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-white/40 text-xs font-black uppercase tracking-widest">
                        <Calendar size={16} className="text-cyan-400" /> {new Date(latestAnnouncement.date).toLocaleDateString(undefined, { dateStyle: 'full' })}
                        <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                        <Clock size={16} /> RECENTLY BROADCAST
                      </div>
                      <h2 className={`text-4xl md:text-7xl font-bold font-serif italic leading-tight tracking-tight ${latestAnnouncement.status === 'Urgent' ? 'text-orange-50' : 'text-white'}`}>
                        {latestAnnouncement.title}
                      </h2>
                    </div>
                    
                    <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
                      {latestAnnouncement.content}
                    </p>

                    <div className="pt-6">
                      <button className={`px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-2xl flex items-center gap-4 group active:scale-95 ${latestAnnouncement.status === 'Urgent' ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-white text-gray-900 hover:bg-cyan-500 hover:text-white'}`}>
                        Confirm Understanding <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline View */}
        <div className="space-y-12 relative">
          <div className="absolute left-8 md:left-[11.5rem] top-0 bottom-0 w-px bg-gray-200/60"></div>

          <AnimatePresence mode="popLayout">
            {standardAnnouncements.map((alert, idx) => {
              const Icon = IconMap[alert.status] || Info;
              const isUrgent = alert.status === 'Urgent';
              
              return (
                <motion.div 
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative pl-20 md:pl-[18rem]"
                >
                  <div className="flex flex-col md:flex-row gap-12 items-start">
                    <div className="absolute left-0 top-12 hidden md:block w-32 text-right">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Session</p>
                      <p className="font-black text-gray-900 text-lg">{new Date(alert.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">{new Date(alert.date).getFullYear()}</p>
                    </div>

                    <div className={`flex-grow bg-white p-10 md:p-14 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 relative group-hover:-translate-y-2 ${isUrgent ? 'border-orange-100 bg-orange-50/10 ring-4 ring-orange-500/5' : ''}`}>
                      <div className={`absolute -left-[3.25rem] md:-left-[7.75rem] top-12 w-10 h-10 ${isUrgent ? 'bg-orange-500' : alert.color} rounded-2xl flex items-center justify-center text-white shadow-xl ring-8 ring-[#FAFBFC] z-10 transition-transform group-hover:scale-110 group-hover:rotate-12 ${isUrgent ? 'animate-pulse' : ''}`}>
                        <Icon size={18} />
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`px-4 py-1 bg-white border ${isUrgent ? 'border-orange-200 text-orange-600' : `${alert.color.replace('bg-', 'border-')} ${alert.color.replace('bg-', 'text-')}`} rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-2`}>
                              {isUrgent && <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping"></div>}
                              {alert.status}
                            </span>
                          </div>
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                            <Calendar size={14} className="text-cyan-500" /> {alert.date}
                          </span>
                        </div>
                        
                        <h3 className={`text-3xl font-black text-gray-900 font-serif italic tracking-tight leading-tight group-hover:text-cyan-600 transition-colors ${isUrgent ? 'text-orange-950' : ''}`}>
                          {alert.title}
                        </h3>
                        <p className="text-gray-500 text-lg leading-relaxed max-w-3xl font-medium">
                          {alert.content}
                        </p>

                        <div className="pt-8 flex items-center gap-4">
                           <button className={`font-black text-[11px] uppercase tracking-[0.3em] flex items-center gap-3 group/link ${isUrgent ? 'text-orange-600' : 'text-cyan-600'}`}>
                             Broadcast Insight <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredAnnouncements.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-40 text-center space-y-8 bg-white rounded-[4rem] border-2 border-dashed border-gray-100"
            >
              <div className="w-28 h-28 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                <Megaphone size={48} strokeWidth={1.5} />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-bold font-serif text-gray-400 italic">Global silence in current filters</h3>
                <p className="text-gray-400 max-w-sm mx-auto font-medium">
                  The leadership council has no active bulletins for this criteria. Synchronize again later.
                </p>
              </div>
              <button 
                onClick={() => { setActiveFilter('All'); setSearchQuery(''); }} 
                className="px-10 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-cyan-100 hover:bg-cyan-600 active:scale-95 transition-all"
              >
                Reset Global Frequency
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;