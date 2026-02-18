
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
    <section className="py-32 bg-white overflow-hidden relative group">
      {/* Dynamic Aura Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-cyan-200 rounded-full blur-[160px]"
        />
      </div>

      <div className="max-container px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-900 rounded-[4.5rem] p-12 md:p-24 text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(2,6,23,0.3)]"
            >
              {/* Sacred Text Deco */}
              <div className="absolute top-10 right-10 opacity-5 pointer-events-none">
                <Book size={200} strokeWidth={1} />
              </div>

              <div className="space-y-10 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                      <Sparkles size={20} className="text-white animate-pulse" />
                    </div>
                    <div>
                      <p className="text-cyan-400 font-black text-[10px] uppercase tracking-[0.4em]">Daily Sanctuary Broadcast</p>
                      <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">
                        <Calendar size={12} /> {formattedDate}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={handleCopy}
                      className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group/btn"
                      title="Copy Scripture"
                    >
                      {copied ? <Check size={18} className="text-green-400" /> : <Share2 size={18} className="text-gray-400 group-hover/btn:text-white" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-4xl md:text-6xl font-bold font-serif italic text-white leading-tight">
                    {verse.theme}
                  </h2>
                  <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                </div>

                <div className="relative">
                  <Quote className="absolute -top-6 -left-6 text-white/5" size={80} />
                  <p className="text-2xl md:text-4xl font-serif italic font-light leading-relaxed text-gray-100/90 relative z-10">
                    "{verse.verse}"
                  </p>
                  <p className="text-cyan-400 font-black text-sm uppercase tracking-[0.4em] mt-8 text-right">
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
              className="p-10 bg-gray-50 rounded-[3.5rem] border border-white space-y-6 shadow-sm group/card transition-all hover:shadow-xl hover:bg-white"
            >
              <div className="w-14 h-14 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center group-hover/card:bg-cyan-500 group-hover/card:text-white transition-all duration-500">
                <MessageSquare size={24} />
              </div>
              <div className="space-y-3">
                <h4 className="text-2xl font-black text-gray-900 italic font-serif">Community Wisdom</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Join 120+ members reflecting on today's word. Share how the Spirit is moving in your academics.
                </p>
              </div>
              <Link 
                to="/portal"
                className="flex items-center justify-between group/link pt-4"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-600">Submit Reflection</span>
                <div className="w-10 h-10 rounded-full bg-white border border-cyan-100 flex items-center justify-center text-cyan-600 group-hover/link:bg-cyan-500 group-hover/link:text-white transition-all shadow-sm">
                  <ArrowRight size={16} />
                </div>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-10 bg-cyan-900 text-white rounded-[3.5rem] relative overflow-hidden shadow-2xl group/pledge"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 group-hover/pledge:scale-110 transition-transform">
                <Sparkles size={120} />
              </div>
              <div className="relative z-10 space-y-4">
                <h5 className="text-xl font-bold font-serif italic">Divine Context</h5>
                <p className="text-sm text-cyan-100/70 leading-relaxed italic">
                  "{verse.description}"
                </p>
                <div className="pt-4 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                     <Check size={14} className="text-cyan-400" />
                   </div>
                   <span className="text-[9px] font-black uppercase tracking-widest text-cyan-100/50">Verified Archival Text</span>
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
