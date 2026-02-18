
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Plus, Edit, Trash2, Calendar, User, Search, Filter, Play, Image as ImageIcon, Mic } from 'lucide-react';
import { NewsItem } from '../../types';

interface NewsFeedTabProps {
  news: NewsItem[];
  onNew: () => void;
  onEdit: (item: NewsItem) => void;
  onDelete: (id: string) => void;
}

const NewsFeedTab: React.FC<NewsFeedTabProps> = ({ news, onNew, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'news' | 'event' | 'announcement'>('all');

  const filtered = news.filter(item => {
    const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.content || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1">
          <h3 className="text-3xl font-black font-serif italic text-gray-900 flex items-center gap-4">
            <Newspaper className="text-cyan-500" size={32} /> Spirit Feed Hub
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Archival media & divine testimonies</p>
        </div>
        <button onClick={onNew} className="px-8 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-cyan-500/20 flex items-center gap-3 active:scale-95 transition-all">
          <Plus size={18} /> Publish New Story
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex gap-2">
          {['all', 'news', 'event', 'announcement'].map(f => (
            <button 
              key={`filter-${f}`} 
              onClick={() => setFilter(f as any)} 
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-cyan-600 hover:bg-cyan-50'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text" 
            placeholder="Search archive..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border-0 rounded-2xl font-bold text-xs outline-none focus:ring-4 focus:ring-cyan-50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.div 
              key={`news-item-${item.id || i}`} 
              layout
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-white p-6 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-cyan-500/5 transition-all flex flex-col md:flex-row items-center gap-8"
            >
              <div className="w-full md:w-56 h-40 rounded-[2.2rem] overflow-hidden shrink-0 relative">
                <img src={item.mediaUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur rounded-xl shadow-sm text-cyan-600">
                  {item.mediaType === 'video' ? <Play size={14} fill="currentColor" /> : item.mediaType === 'audio' ? <Mic size={14} /> : <ImageIcon size={14} />}
                </div>
              </div>

              <div className="flex-grow space-y-3 min-w-0">
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-cyan-50 text-cyan-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{item.category}</span>
                  <span className="text-[10px] font-black text-gray-300 flex items-center gap-2"><Calendar size={12}/> {item.date}</span>
                  <span className="text-[10px] font-black text-gray-300 flex items-center gap-2"><User size={12}/> {item.author}</span>
                </div>
                <h4 className="text-xl font-black text-gray-900 leading-tight truncate">{item.title}</h4>
                <p className="text-sm text-gray-400 font-medium line-clamp-2 leading-relaxed">{item.content}</p>
              </div>

              <div className="flex gap-2 shrink-0 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(item)} className="p-4 bg-gray-50 text-gray-400 rounded-[1.5rem] hover:bg-gray-900 hover:text-white transition-all shadow-sm active:scale-95"><Edit size={20}/></button>
                <button onClick={() => onDelete(item.id)} className="p-4 bg-red-50 text-red-500 rounded-[1.5rem] hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"><Trash2 size={20}/></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-40 text-center space-y-6 bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
              <Newspaper size={48} />
            </div>
            <p className="text-xl font-bold font-serif text-gray-300 italic">No news found in this spiritual layer.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NewsFeedTab;
