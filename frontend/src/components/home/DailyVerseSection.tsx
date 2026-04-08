
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Quote, Sparkles, Calendar, Share2, Check, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DailyVerse } from '../../types';
import { API } from '../../services/api';

const DailyVerseSection: React.FC = () => {
  const [verse, setVerse] = useState<DailyVerse | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    API.spiritual.verses.getDaily().then(setVerse);
  }, []);

  const handleCopy = () => {
    if (!verse) return;
    navigator.clipboard.writeText(`${verse.verse} - ${verse.reference}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!verse) return null;

  const formattedDate = new Date(verse.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section className="py-32 bg-primary overflow-hidden relative group border-y border-gray-50">
      {/* Dynamic Aura Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-accent/20 rounded-full blur-[160px]"
        />
      </div>

      <div className="max-container px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-primary border border-gray-100 rounded-[4.5rem] p-12 md:p-24 text-black relative overflow-hidden shadow-2xl"
            >
              {/* Sacred Text Deco */}
              <div className="absolute top-10 right-10 opacity-5 pointer-events-none">
                <Book size={200} strokeWidth={1} className="text-secondary" />
              </div>

              <div className="space-y-10 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center shadow-lg">
                      <Sparkles size={20} className="text-white animate-pulse" />
                    </div>
                    <div>
                      <p className="text-secondary font-black text-[10px] uppercase tracking-[0.4em]">Daily Sanctuary Broadcast</p>
                      <div className="flex items-center gap-2 text-black/40 text-[10px] font-bold uppercase tracking-widest mt-1">
                        <Calendar size={12} /> {formattedDate}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={handleCopy}
                      className="p-4 bg-secondary/5 hover:bg-accent hover:text-white border border-secondary/10 rounded-2xl transition-all group/btn"
                      title="Copy Scripture"
                    >
                      {copied ? <Check size={18} className="text-green-600" /> : <Share2 size={18} className="text-secondary group-hover/btn:text-white" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-4xl md:text-6xl font-bold font-serif italic text-black leading-tight">
                    {verse.theme}
                  </h2>
                  <div className="h-1 w-24 bg-secondary rounded-full"></div>
                </div>

                <div className="relative">
                  <Quote className="absolute -top-6 -left-6 text-secondary/10" size={80} />
                  <p className="text-2xl md:text-4xl font-serif italic font-light leading-relaxed text-black relative z-10">
                    "{verse.verse}"
                  </p>
                  <p className="text-secondary font-black text-sm uppercase tracking-[0.4em] mt-8 text-right">
                    — {verse.reference}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 bg-gray-50/50 rounded-[3.5rem] border border-gray-100 space-y-6 shadow-sm group/card transition-all hover:shadow-xl hover:bg-white hover:border-accent/30"
            >
              <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center group-hover/card:bg-accent group-hover/card:text-white transition-all duration-500">
                <MessageSquare size={24} />
              </div>
              <div className="space-y-3">
                <h4 className="text-2xl font-black text-black italic font-serif">Community Wisdom</h4>
                <p className="text-black/60 text-sm leading-relaxed">
                  Join 120+ members reflecting on today's word. Share how the Spirit is moving in your academics.
                </p>
              </div>
              <Link 
                to="/portal"
                className="flex items-center justify-between group/link pt-4"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary group-hover/link:text-accent transition-colors">Submit Reflection</span>
                <div className="w-10 h-10 rounded-full bg-white border border-secondary/10 flex items-center justify-center text-secondary group-hover/link:bg-accent group-hover/link:text-white transition-all shadow-sm">
                  <ArrowRight size={16} />
                </div>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-10 bg-secondary text-white rounded-[3.5rem] relative overflow-hidden shadow-2xl group/pledge"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 group-hover/pledge:scale-110 transition-transform">
                <Sparkles size={120} />
              </div>
              <div className="relative z-10 space-y-4">
                <h5 className="text-xl font-bold font-serif italic">Divine Context</h5>
                <p className="text-sm text-white/80 leading-relaxed italic">
                  "{verse.description}"
                </p>
                <div className="pt-4 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                     <Check size={14} className="text-accent" />
                   </div>
                   <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Verified Archival Text</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DailyVerseSection;
