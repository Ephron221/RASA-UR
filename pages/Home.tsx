
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, Star, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsItem, Leader, HomeConfig } from '../types';
import { API } from '../services/api';

interface HomeProps {
  news: NewsItem[];
  leaders: Leader[];
}

const Home: React.FC<HomeProps> = ({ news, leaders }) => {
  const [showAllCommittees, setShowAllCommittees] = useState(false);
  const [config, setConfig] = useState<HomeConfig | null>(null);
  
  useEffect(() => {
    API.home.getConfig().then(setConfig);
  }, []);

  const latestNews = news.slice(0, 3);
  const execCommittee = leaders.filter(l => l.type === 'Executive');
  const displayedLeaders = showAllCommittees ? leaders : execCommittee;

  if (!config) return null;

  return (
    <div className="w-full">
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        <motion.div initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 0.6 }} transition={{ duration: 1.5 }} className="absolute inset-0 z-0">
          <img src={config.heroImageUrl} alt="RASA Community" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
        </motion.div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-block px-6 py-2 bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 rounded-full text-cyan-400 font-black text-xs uppercase tracking-[0.4em] mb-8">
            {config.motto}
          </motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-5xl md:text-8xl font-bold text-white mb-6 font-serif italic leading-tight">
            {config.heroTitle}
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="text-xl md:text-2xl text-gray-300 mb-12 tracking-wide font-light max-w-2xl mx-auto">
            {config.heroSubtitle}
          </motion.p>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }} className="flex flex-wrap justify-center gap-6">
            <Link to="/portal" className="px-10 py-5 bg-cyan-500 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-cyan-600 transition-all flex items-center gap-3 group shadow-2xl shadow-cyan-500/20">
              Join Our Family <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-black text-white overflow-hidden">
        <div className="max-container px-4">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-5xl md:text-7xl font-bold font-serif italic">Our <span className="text-cyan-500">Leadership</span></h2>
            <div className="w-24 h-1 bg-cyan-500 mx-auto rounded-full mt-6"></div>
          </div>
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {displayedLeaders.map((leader, idx) => (
              <motion.div key={leader.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="group relative">
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 border border-white/5 grayscale group-hover:grayscale-0 transition-all duration-700 shadow-2xl">
                  <img src={leader.image} alt={leader.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
                  <div className="absolute bottom-8 left-8 right-8 text-left space-y-1">
                    <h4 className="text-2xl font-black tracking-tight">{leader.name}</h4>
                    <p className="text-cyan-400 text-sm font-black uppercase tracking-widest">{leader.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-20 flex justify-center"><button onClick={() => setShowAllCommittees(!showAllCommittees)} className="px-12 py-5 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-white transition-all shadow-2xl">{showAllCommittees ? 'Show Executive Only' : 'View All Leaders'}</button></div>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-container px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16"><div className="space-y-2"><h2 className="text-cyan-600 font-black text-xs uppercase tracking-[0.4em]">Spirit News</h2><h3 className="text-5xl font-bold font-serif italic text-gray-900 leading-tight">Ministry Updates</h3></div><Link to="/news" className="group flex items-center gap-4 px-8 py-4 bg-gray-50 rounded-2xl text-gray-900 font-black text-xs uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all">Full Archive <ArrowRight size={18} /></Link></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {latestNews.map((item, idx) => (
              <motion.div key={item.id} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all group border border-gray-100">
                <div className="h-64 overflow-hidden relative"><img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" /></div>
                <div className="p-8 space-y-4"><div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest"><Calendar size={14} className="text-cyan-500" /> {new Date(item.date).toLocaleDateString()}</div><h4 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-cyan-600 transition-colors">{item.title}</h4><p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{item.content}</p><div className="pt-4 border-t border-gray-50"><Link to={`/news/${item.id}`} className="inline-flex items-center gap-2 text-cyan-600 font-black text-[10px] uppercase tracking-widest group/link">Read Story <ArrowRight size={14} /></Link></div></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
