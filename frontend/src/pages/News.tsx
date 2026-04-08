import React, { useState, useMemo } from 'react';
// Fix framer-motion prop errors by casting motion to any
import { motion as motionLib, AnimatePresence } from 'framer-motion';
const motion = motionLib as any;
import { 
  Search, Calendar, User, ArrowRight, 
  Play, Image as ImageIcon, Mic, Hash,
  Clock, Bookmark, Share2
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
    { id: 'news', label: 'News' },
    { id: 'event', label: 'Major Events' },
    { id: 'announcement', label: 'Official Notices' },
  ];

  const filteredNews = useMemo(() => {
    return (news || []).filter(item => {
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
    <div className="min-h-screen pt-32 pb-32 bg-primary">
      <div className="max-container px-4">
        
        {/* Page Header */}
        <header className="mb-20 text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 bg-secondary/5 rounded-full text-secondary font-black text-[10px] uppercase tracking-[0.4em]"
          >
            <Hash size={12} /> Media & Testimonies
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold font-serif italic text-black tracking-tight"
          >
            Spirit <span className="text-secondary">Archive</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-black/60 max-w-2xl mx-auto text-xl font-light leading-relaxed"
          >
            The digital pulse of RASA UR. Documenting divine encounters, 
            academic breakthroughs, and fellowship updates.
          </motion.p>
        </header>

        {/* Dynamic Navigation & Search Bar */}
        <div className="sticky top-28 z-40 mb-16">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white shadow-xl p-4 rounded-[2.5rem] border border-gray-100">
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id as any)}
                  className={`relative px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    activeFilter === cat.id 
                      ? 'text-white' 
                      : 'text-black/40 hover:text-secondary hover:bg-secondary/5'
                  }`}
                >
                  <span className="relative z-10">{cat.label}</span>
                  {activeFilter === cat.id && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute inset-0 bg-secondary rounded-2xl shadow-lg"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-96 group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-secondary transition-colors">
                <Search size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Search stories, events..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-4.5 bg-gray-50 border-2 border-transparent rounded-[1.8rem] outline-none font-bold text-sm focus:bg-white focus:border-secondary/20 transition-all placeholder:text-black/20 text-black"
              />
            </div>
          </div>
        </div>

        {/* Featured Story */}
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
                  <span className="px-5 py-2 bg-secondary text-white rounded-full text-[10px] font-black uppercase tracking-widest">Featured Story</span>
                  <span className="text-white/60 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} className="text-accent" /> {new Date(featuredItem.date).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-4xl md:text-7xl font-bold text-white font-serif italic leading-tight group-hover:text-accent transition-colors">
                  {featuredItem.title}
                </h2>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-3 text-white/50 text-[10px] font-black uppercase tracking-widest">
                     <User size={16} className="text-accent" /> {featuredItem.author}
                   </div>
                   <div className="h-px w-12 bg-white/20"></div>
                   <span className="text-accent text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
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
                className="group flex flex-col bg-white rounded-[3.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-gray-100 hover:border-accent/30"
              >
                <Link to={`/news/${item.id}`} className="relative h-72 overflow-hidden shrink-0">
                  <img 
                    src={item.mediaUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  
                  <div className="absolute top-8 left-8">
                    <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-2xl text-[9px] font-black uppercase tracking-widest text-secondary shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute bottom-8 right-8">
                    <div className="w-12 h-12 bg-black/40 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20 transition-all group-hover:bg-secondary group-hover:scale-110">
                      {item.mediaType === 'video' ? <Play size={20} fill="currentColor" /> : 
                       item.mediaType === 'audio' ? <Mic size={20} /> : <ImageIcon size={20} />}
                    </div>
                  </div>
                </Link>

                <div className="p-10 flex flex-col flex-grow space-y-6">
                  <div className="flex items-center justify-between text-[10px] font-black text-black/40 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Calendar size={14} className="text-secondary" /> {new Date(item.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-2"><Clock size={14} className="text-secondary" /> 5m Read</span>
                  </div>
                  
                  <div className="space-y-4">
                    <Link to={`/news/${item.id}`}>
                      <h3 className="text-3xl font-black text-black leading-tight group-hover:text-secondary transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-black/60 text-base leading-relaxed line-clamp-3 font-medium">
                      {item.content}
                    </p>
                  </div>

                  <div className="pt-8 mt-auto border-t border-gray-50 flex items-center justify-between">
                    <Link to={`/news/${item.id}`} className="text-secondary font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 group/btn hover:text-secondary transition-all">
                      Read Story <ArrowRight size={16} />
                    </Link>
                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-black/20 hover:text-secondary transition-colors"><Bookmark size={18} /></button>
                      <button className="text-black/20 hover:text-secondary transition-colors"><Share2 size={18} /></button>
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
            <div className="w-28 h-28 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-black/10">
              <Search size={48} strokeWidth={1.5} />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-bold font-serif text-black/40 italic">No results found</h3>
              <p className="text-black/30 max-w-sm mx-auto font-medium">
                Try adjusting your search terms or exploring a different category.
              </p>
            </div>
            <button 
              onClick={() => { setActiveFilter('all'); setSearchQuery(''); }} 
              className="px-10 py-4 bg-secondary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-secondary active:scale-95 transition-all"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default News;