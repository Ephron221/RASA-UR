
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// Added Star to the lucide-react imports
import { Heart, Briefcase, Cross, Quote, Sparkles, Book, Target, ShieldCheck, Zap, History, Loader2, Star } from 'lucide-react';
import { AboutConfig } from '../types';
import { API } from '../services/api';

const IconMap: any = {
  Cross: Cross,
  Heart: Heart,
  Briefcase: Briefcase,
  Zap: Zap,
  Target: Target
};

const About: React.FC = () => {
  const [config, setConfig] = useState<AboutConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.about.getConfig().then(data => {
      setConfig(data);
      setLoading(false);
    });
  }, []);

  if (loading || !config) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-primary">
        <Loader2 className="text-secondary animate-spin" size={48} />
      </div>
    );
  }

  const heroTitle = config.heroTitle || 'Our Genesis';
  const heroFirstWord = heroTitle.split(' ')[0];
  const heroRest = heroTitle.split(' ').slice(1).join(' ');

  return (
    <div className="min-h-screen pb-32 bg-primary">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-primary border-b border-gray-100">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }} 
          animate={{ scale: 1, opacity: 0.15 }} 
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <img src={config.heroImage || 'https://images.unsplash.com/photo-1544427928-c49cdfebf193?q=80&w=2000'} className="w-full h-full object-cover" alt="Genesis" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary"></div>
        </motion.div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-3 px-6 py-2 bg-secondary/10 backdrop-blur-md border border-secondary/20 rounded-full text-secondary font-black text-xs uppercase tracking-[0.4em]">
            <Sparkles size={14} /> Our History
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-6xl md:text-9xl font-bold font-serif italic text-black leading-tight tracking-tight">
            {heroFirstWord} <span className="text-secondary">{heroRest}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-xl text-black/50 font-light max-w-2xl mx-auto">
            {config.heroSubtitle}
          </motion.p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-32 overflow-hidden bg-primary">
        <div className="max-container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
              <div className="space-y-4">
                <span className="text-secondary font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-2"><History size={16}/> Established 1997</span>
                <h2 className="text-5xl md:text-7xl font-bold font-serif italic text-black leading-tight">{config.historyTitle}</h2>
              </div>
              <p className="text-xl text-black/60 leading-relaxed font-light">{config.historyContent}</p>
              <div className="p-8 bg-secondary/5 rounded-[3rem] border-l-[10px] border-secondary relative">
                <Quote className="absolute top-6 right-8 text-secondary/10" size={60} />
                <p className="text-2xl font-serif italic font-bold text-black leading-snug relative z-10">"Until we all reach unity in the faith and in the knowledge of the Son of God..."</p>
                <p className="mt-4 text-[10px] font-black uppercase text-secondary">EPHESIANS 4:13</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="absolute -inset-10 bg-secondary/5 rounded-[5rem] blur-3xl opacity-50 -z-10 animate-pulse"></div>
              <div className="rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white aspect-[4/5]">
                <img src={config.historyImage || 'https://images.unsplash.com/photo-1544427928-c49cdfebf193?q=80&w=2000'} className="w-full h-full object-cover" alt="History" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-32 bg-gray-50/50 border-y border-gray-100">
        <div className="max-container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { title: config.visionTitle, content: config.visionContent, icon: Target, color: 'bg-secondary' },
              { title: config.missionTitle, content: config.missionContent, icon: Sparkles, color: 'bg-black' }
            ].map((box, i) => (
              <motion.div key={`vm-${i}`} whileHover={{ y: -10 }} className="bg-white p-12 md:p-20 rounded-[4rem] shadow-xl border border-gray-100 flex flex-col items-center text-center space-y-8">
                <div className={`w-20 h-20 ${box.color} text-white rounded-3xl flex items-center justify-center shadow-2xl transition-all`}><box.icon size={32}/></div>
                <h3 className="text-4xl font-black font-serif italic text-black">{box.title}</h3>
                <p className="text-xl text-black/60 leading-relaxed font-light">{box.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-32 bg-primary">
        <div className="max-container px-4">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-5xl md:text-7xl font-bold font-serif italic text-black">Our Core <span className="text-secondary">Pillars</span></h2>
            <p className="text-black/40 font-bold uppercase tracking-widest text-xs">Values that anchor our fellowship</p>
          </div>
          <div className="grid grid-cols-1 md:text-3xl lg:grid-cols-3 gap-10">
            {(config.values || []).map((v, i) => {
              const Icon = IconMap[v.icon] || ShieldCheck;
              return (
                <motion.div key={v.id || `val-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group p-12 bg-white rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all text-center space-y-6 hover:border-secondary/20">
                  <div className="w-16 h-16 bg-secondary/5 text-secondary rounded-2xl flex items-center justify-center mx-auto group-hover:bg-secondary group-hover:text-white transition-all"><Icon size={28}/></div>
                  <h4 className="text-2xl font-black text-black tracking-tight">{v.title}</h4>
                  <p className="text-black/60 leading-relaxed font-medium">{v.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-32 bg-primary border-t border-gray-100 text-black overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none text-secondary"><History size={400} /></div>
        <div className="max-container px-4 relative z-10">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-5xl md:text-7xl font-bold font-serif italic">Our <span className="text-secondary">Footprints</span></h2>
            <p className="text-black/40 font-black uppercase tracking-widest text-xs">A legacy in the making</p>
          </div>
          
          <div className="relative space-y-20">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-100 -translate-x-1/2 hidden md:block"></div>
            {(config.timeline || []).map((item, i) => (
              <motion.div key={item.id || `time-${i}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1 text-center md:text-right space-y-4">
                  <div className={`space-y-2 ${i % 2 !== 0 ? 'md:text-left' : 'md:text-right'}`}>
                    <span className="text-4xl font-black text-secondary">{item.year}</span>
                    <h5 className="text-2xl font-bold font-serif italic">{item.title}</h5>
                    <p className="text-black/60 max-w-md mx-auto md:mx-0 inline-block">{item.description}</p>
                  </div>
                </div>
                <div className="relative z-10 w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center shadow-lg rotate-45 border-4 border-white">
                  <div className="-rotate-45"><Star size={16} fill="white" /></div>
                </div>
                <div className="flex-1 hidden md:block"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
