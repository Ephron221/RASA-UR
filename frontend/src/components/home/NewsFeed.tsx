
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsItem } from '../../types';

interface NewsFeedProps {
  news: NewsItem[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({ news }) => {
  const latestNews = (news || []).slice(0, 3);

  const formatDateRange = (item: NewsItem) => {
    try {
      if (item.category === 'event' && (item.startDate || item.endDate)) {
        const start = item.startDate ? new Date(item.startDate).toLocaleDateString() : '';
        const end = item.endDate ? new Date(item.endDate).toLocaleDateString() : '';
        
        if (start && end) {
          return start === end ? start : `${start} — ${end}`;
        }
        return start || end;
      }
      return item.date ? new Date(item.date).toLocaleDateString() : 'Recent';
    } catch (e) {
      return 'Recent';
    }
  };

  return (
    <section className="py-32 bg-primary border-t border-gray-50">
      <div className="max-container px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-[0.4em]">
              <Newspaper size={16} /> Spiritual Currents
            </span>
            <h2 className="text-5xl md:text-7xl font-bold font-serif italic text-black leading-tight">
              Latest <span className="text-secondary">Ministry</span> Updates
            </h2>
          </div>
          <Link 
            to="/news" 
            className="group flex items-center gap-6 px-10 py-5 bg-white border border-gray-100 rounded-3xl text-black font-black text-[10px] uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-sm hover:shadow-xl"
          >
            Explore Full Archive <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {latestNews.map((item, idx) => (
            <motion.div 
              key={`news-home-${item.id || idx}`} 
              initial={{ y: 30, opacity: 0 }} 
              whileInView={{ y: 0, opacity: 1 }} 
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[3.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 group border border-gray-100 flex flex-col h-full"
            >
              <div className="h-72 overflow-hidden relative">
                <img 
                  src={item.mediaUrl || 'https://images.unsplash.com/photo-1544427928-c49cdfebf193?q=80&w=2000'} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-secondary shadow-sm">
                  {item.category}
                </div>
              </div>
              
              <div className="p-10 space-y-6 flex flex-grow flex-col">
                <div className="flex items-center gap-3 text-black/40 text-[10px] font-black uppercase tracking-widest">
                  <Calendar size={14} className="text-secondary" /> {formatDateRange(item)}
                </div>
                
                <h4 className="text-2xl font-black text-black leading-tight group-hover:text-accent transition-colors">
                  {item.title}
                </h4>
                
                <p className="text-black/60 text-base leading-relaxed line-clamp-2 flex-grow">
                  {item.content}
                </p>
                
                <div className="pt-8 border-t border-gray-50">
                  <Link 
                    to={`/news/${item.id}`} 
                    className="inline-flex items-center gap-3 text-secondary font-black text-[10px] uppercase tracking-[0.2em] group/link hover:text-accent transition-colors"
                  >
                    View Details <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
          
          {latestNews.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 py-40 text-center space-y-8 bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                <Newspaper size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-serif italic text-black/40">Archival Silence</h3>
                <p className="text-black/30 max-w-xs mx-auto text-sm">No testimonies or updates have been documented in the digital archive yet.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsFeed;
