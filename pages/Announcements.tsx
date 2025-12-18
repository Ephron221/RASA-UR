
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Info, AlertTriangle, CheckCircle, 
  ArrowRight, Star, Clock, Filter, 
  Calendar, Megaphone, Sparkles, Search,
  ChevronRight
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

          {/* Decorative floating element */}
          <div className="absolute top-0 right-0 hidden xl:block pointer-events-none opacity-5">
            <Bell size={300} strokeWidth={1} />
          </div>
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
              <div className="bg-gray-900 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden shadow-3xl">
                {/* Background accents */}
                <div className={`absolute top-0 right-0 w-1/2 h-full ${latestAnnouncement.color} opacity-20 blur-[120px] pointer-events-none`}></div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-16 items-center">
                  <div className="shrink-0 space-y-6 text-center md:text-left">
                    <div className={`w-24 h-24 ${latestAnnouncement.color} rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl ring-8 ring-white/5`}>
                      {React.createElement(IconMap[latestAnnouncement.status] || Info, { size: 40 })}
                    </div>
                    <div>
                      <p className="text-cyan-400 font-black text-[10px] uppercase tracking-[0.4em] mb-1">Priority Broadcast</p>
                      <span className={`px-4 py-1.5 ${latestAnnouncement.color} rounded-full text-[10px] font-black uppercase tracking-widest`}>
                        {latestAnnouncement.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex-grow space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-white/40 text-xs font-black uppercase tracking-widest">
                        <Calendar size={16} className="text-cyan-400" /> {new Date(latestAnnouncement.date).toLocaleDateString(undefined, { dateStyle: 'full' })}
                        <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                        <Clock size={16} /> JUST POSTED
                      </div>
                      <h2 className="text-4xl md:text-7xl font-bold font-serif italic leading-tight">
                        {latestAnnouncement.title}
                      </h2>
                    </div>
                    
                    <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
                      {latestAnnouncement.content}
                    </p>

                    <div className="pt-6">
                      <button className="px-12 py-5 bg-white text-gray-900 rounded-full font-black text-xs uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all shadow-2xl flex items-center gap-4 group">
                        Acknowledge Receipt <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Standard Announcements Timeline */}
        <div className="space-y-12 relative">
          {/* Vertical Timeline Rail */}
          <div className="absolute left-8 md:left-[11.5rem] top-0 bottom-0 w-px bg-gray-200/60"></div>

          <AnimatePresence mode="popLayout">
            {standardAnnouncements.map((alert, idx) => {
              const Icon = IconMap[alert.status] || Info;
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
                    {/* Date Sidecar */}
                    <div className="absolute left-0 top-12 hidden md:block w-32 text-right">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Archived</p>
                      <p className="font-black text-gray-900 text-lg">{new Date(alert.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">{new Date(alert.date).getFullYear()}</p>
                    </div>

                    {/* Content Card */}
                    <div className="flex-grow bg-white p-10 md:p-14 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-700 relative group-hover:-translate-y-2">
                      {/* Timeline Dot & Icon */}
                      <div className={`absolute -left-[3.25rem] md:-left-[7.75rem] top-12 w-10 h-10 ${alert.color} rounded-2xl flex items-center justify-center text-white shadow-xl ring-8 ring-[#FAFBFC] z-10 transition-transform group-hover:scale-110 group-hover:rotate-12`}>
                        <Icon size={18} />
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`px-4 py-1 bg-white border ${alert.color.replace('bg-', 'border-')} ${alert.color.replace('bg-', 'text-')} rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm`}>
                              {alert.status}
                            </span>
                          </div>
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                            <Calendar size={14} className="text-cyan-500" /> {alert.date}
                          </span>
                        </div>
                        
                        <h3 className="text-3xl font-black text-gray-900 font-serif italic tracking-tight leading-tight group-hover:text-cyan-600 transition-colors">
                          {alert.title}
                        </h3>
                        <p className="text-gray-500 text-lg leading-relaxed max-w-3xl font-medium">
                          {alert.content}
                        </p>

                        <div className="pt-8 flex items-center gap-4">
                           <button className="text-cyan-600 font-black text-[11px] uppercase tracking-[0.3em] flex items-center gap-3 group/link">
                             Protocol details <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
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
                <h3 className="text-3xl font-bold font-serif text-gray-400 italic">No broadcasts matched your inquiry</h3>
                <p className="text-gray-400 max-w-sm mx-auto font-medium">
                  Try adjusting your search criteria or selecting a different priority filter.
                </p>
              </div>
              <button 
                onClick={() => { setActiveFilter('All'); setSearchQuery(''); }} 
                className="px-10 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-cyan-100 hover:bg-cyan-600 active:scale-95 transition-all"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mt-32 p-16 md:p-24 bg-cyan-900 rounded-[5rem] text-center text-white relative overflow-hidden shadow-3xl"
        >
          <div className="relative z-10 space-y-10">
            <div className="relative inline-block">
              <div className="absolute -inset-6 bg-cyan-400/20 rounded-full blur-2xl animate-pulse"></div>
              <Megaphone className="mx-auto text-cyan-400 relative z-10" size={64} fill="currentColor" />
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl md:text-6xl font-bold font-serif italic">Divine <span className="text-cyan-400">Notifications</span></h3>
              <p className="opacity-70 max-w-xl mx-auto text-xl font-light">Enable push notifications to receive real-time mandates from the leadership council directly to your device.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="px-12 py-6 bg-cyan-500 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-white hover:text-cyan-900 transition-all shadow-2xl flex items-center gap-4">
                Enable Alert System <Sparkles size={18} />
              </button>
              <button className="px-12 py-6 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all">
                Learn Protocol
              </button>
            </div>
          </div>
          
          {/* Background Decorative patterns */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
             <div className="grid grid-cols-12 gap-10 rotate-12 -translate-y-20 -translate-x-20 scale-150">
               {Array.from({ length: 48 }).map((_, i) => (
                 <Bell key={i} size={40} className="text-white" />
               ))}
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Announcements;
