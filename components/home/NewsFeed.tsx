
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsItem } from '../../types';

interface NewsFeedProps {
  news: NewsItem[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({ news }) => {
  const latestNews = news.slice(0, 3);

  return (
    <section className="py-32 bg-[#F9FBFC]">
      <div className="max-container px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 text-cyan-600 font-black text-xs uppercase tracking-[0.4em]">
              <Newspaper size={16} /> Spiritual Currents
            </span>
            <h2 className="text-5xl md:text-7xl font-bold font-serif italic text-gray-900 leading-tight">
              Latest <span className="text-cyan-500">Ministry</span> Updates
            </h2>
          </div>
          <Link 
            to="/news" 
            className="group flex items-center gap-6 px-10 py-5 bg-white rounded-3xl text-gray-900 font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all shadow-sm hover:shadow-xl"
          >
            Explore Full Archive <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {latestNews.map((item, idx) => (
            <motion.div 
              key={item.id} 
              initial={{ y: 30, opacity: 0 }} 
              whileInView={{ y: 0, opacity: 1 }} 
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[3.5rem] overflow-hidden shadow-sm hover:shadow-3xl transition-all duration-700 group border border-gray-100 flex flex-col h-full"
            >
              <div className="h-72 overflow-hidden relative">
                <img 
                  src={item.mediaUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-cyan-600 shadow-sm">
                  {item.category}
                </div>
              </div>
              
              <div className="p-10 space-y-6 flex flex-grow flex-col">
                <div className="flex items-center gap-3 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <Calendar size={14} className="text-cyan-500" /> {new Date(item.date).toLocaleDateString()}
                </div>
                
                <h4 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-cyan-600 transition-colors">
                  {item.title}
                </h4>
                
                <p className="text-gray-500 text-base leading-relaxed line-clamp-2 flex-grow">
                  {item.content}
                </p>
                
                <div className="pt-8 border-t border-gray-50">
                  <Link 
                    to={`/news/${item.id}`} 
                    className="inline-flex items-center gap-3 text-cyan-600 font-black text-[10px] uppercase tracking-[0.2em] group/link"
                  >
                    View Details <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
          
          {latestNews.length === 0 && (
            <div className="col-span-3 py-20 text-center space-y-4">
              <Newspaper size={64} className="mx-auto text-gray-100" />
              <p className="text-gray-400 font-bold italic">No stories published yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsFeed;
