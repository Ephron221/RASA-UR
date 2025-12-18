
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Calendar, User, ArrowRight, 
  Play, Image as ImageIcon, Mic, Hash,
  Clock, Bookmark, Share2, Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsItem } from '../types';

interface NewsProps {
  news: NewsItem[];
}

const News: React.FC<NewsProps> = ({ news }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'event' | 'news' | 'announcement'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Updates' },
    { id: 'news', label: 'Spirit News' },
    { id: 'event', label: 'Major Events' },
    { id: 'announcement', label: 'Official Notices' },
  ];

  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [news, activeFilter, searchQuery]);

  // Featured item logic (latest one)
  const featuredItem = filteredNews.length > 0 && activeFilter === 'all' && searchQuery === '' 
    ? filteredNews[0] 
    : null;
    
  const gridItems = featuredItem 
    ? filteredNews.slice(1) 
    : filteredNews;

  return (
    <div className="min-h-screen pt-32 pb-32 bg-[#F9FBFC]">
      <div className="max-container px-4">
        
        {/* Page Header */}
        <header className="mb-20 text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 bg-cyan-50 rounded-full text-cyan-600 font-black text-[10px] uppercase tracking-[0.4em]"
          >
            <Hash size={12} /> Media & Testimonies
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold font-serif italic text-gray-900 tracking-tight"
          >
            Spirit <span className="text-cyan-500">Archive</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-2xl mx-auto text-xl font-light leading-relaxed"
          >
            The digital pulse of RASA UR-Nyarugenge. Documenting divine encounters, 
            academic breakthroughs, and fellowship updates.
          </motion.p>
        </header>

        {/* Dynamic Navigation & Search Bar */}
        <div className="sticky top-28 z-40 mb-16">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white/80 backdrop-blur-2xl p-4 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white">
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id as any)}
                  className={`relative px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    activeFilter === cat.id 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-cyan-600 hover:bg-cyan-50'
                  }`}
                >
                  <span className="relative z-10">{cat.label}</span>
                  {activeFilter === cat.id && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute inset-0 bg-cyan-500 rounded-2xl shadow-lg shadow-cyan-100"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-96 group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500 transition-colors">
                <Search size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Search stories, events, keywords..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-4.5 bg-gray-50 border-2 border-transparent rounded-[1.8rem] outline-none font-bold text-sm focus:bg-white focus:border-cyan-100 transition-all placeholder:text-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Featured Story (conditional) */}
        {featuredItem && (
          <motion.section 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-16"
          >
            <Link to={`/news/${featuredItem.id}`} className="group relative block aspect-[21/9] w-full rounded-[4rem] overflow-hidden shadow-2xl bg-black">
              <img 
                src={featuredItem.mediaUrl} 
                alt={featuredItem.title} 
                className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-[2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-12 md:p-20 space-y-6 max-w-4xl">
                <div className="flex items-center gap-4">
                  <span className="px-5 py-2 bg-cyan-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Featured Story</span>
                  <span className="text-white/60 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} className="text-cyan-400" /> {new Date(featuredItem.date).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-4xl md:text-7xl font-bold text-white font-serif italic leading-tight group-hover:text-cyan-100 transition-colors">
                  {featuredItem.title}
                </h2>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-3 text-white/50 text-[10px] font-black uppercase tracking-widest">
                     <User size={16} className="text-cyan-500" /> {featuredItem.author}
                   </div>
                   <div className="h-px w-12 bg-white/20"></div>
                   <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                     Read More <ArrowRight size={14} />
                   </span>
                </div>
              </div>
            </Link>
          </motion.section>
        )}

        {/* News Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {gridItems.map((item, idx) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex flex-col bg-white rounded-[3.5rem] overflow-hidden shadow-sm hover:shadow-3xl hover:shadow-cyan-500/5 transition-all duration-700 border border-gray-100"
              >
                {/* Media Container */}
                <Link to={`/news/${item.id}`} className="relative h-72 overflow-hidden shrink-0">
                  <img 
                    src={item.mediaUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  
                  {/* Category Overlay */}
                  <div className="absolute top-8 left-8">
                    <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-2xl text-[9px] font-black uppercase tracking-widest text-cyan-600 shadow-sm border border-cyan-50">
                      {item.category}
                    </span>
                  </div>

                  {/* Format Overlay */}
                  <div className="absolute bottom-8 right-8">
                    <div className="w-12 h-12 bg-black/40 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20 transition-all group-hover:bg-cyan-500 group-hover:scale-110">
                      {item.mediaType === 'video' ? <Play size={20} fill="currentColor" /> : 
                       item.mediaType === 'audio' ? <Mic size={20} /> : <ImageIcon size={20} />}
                    </div>
                  </div>
                </Link>

                {/* Content Container */}
                <div className="p-10 flex flex-col flex-grow space-y-6">
                  <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Calendar size={14} className="text-cyan-500" /> {new Date(item.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-2"><Clock size={14} className="text-cyan-500" /> 5m Read</span>
                  </div>
                  
                  <div className="space-y-4">
                    <Link to={`/news/${item.id}`}>
                      <h3 className="text-3xl font-black text-gray-900 leading-tight group-hover:text-cyan-600 transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-gray-500 text-base leading-relaxed line-clamp-3 font-medium">
                      {item.content}
                    </p>
                  </div>

                  <div className="pt-8 mt-auto border-t border-gray-50 flex items-center justify-between">
                    <Link to={`/news/${item.id}`} className="text-cyan-600 font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 group/btn hover:gap-5 transition-all">
                      Explore Full Story <ArrowRight size={16} />
                    </Link>
                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-gray-300 hover:text-cyan-500 transition-colors"><Bookmark size={18} /></button>
                      <button className="text-gray-300 hover:text-cyan-500 transition-colors"><Share2 size={18} /></button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty Search State */}
        {filteredNews.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-40 text-center space-y-8 bg-white rounded-[4rem] border-2 border-dashed border-gray-100"
          >
            <div className="w-28 h-28 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
              <Search size={48} strokeWidth={1.5} />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-bold font-serif text-gray-400 italic">Archive inquiry yielded no results</h3>
              <p className="text-gray-400 max-w-sm mx-auto font-medium">
                Try adjusting your search terms or exploring a different category for more divine testimonies.
              </p>
            </div>
            <button 
              onClick={() => { setActiveFilter('all'); setSearchQuery(''); }} 
              className="px-10 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-cyan-100 hover:bg-cyan-600 active:scale-95 transition-all"
            >
              Reset All Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
      </div>
    </div>
  );
};

export default News;
