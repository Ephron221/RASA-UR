
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HomeConfig } from '../../types';

interface HeroProps {
  config: HomeConfig;
}

const Hero: React.FC<HeroProps> = ({ config }) => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Dynamic Background Image */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }} 
        animate={{ scale: 1, opacity: 0.6 }} 
        transition={{ duration: 2, ease: "easeOut" }} 
        className="absolute inset-0 z-0"
      >
        <img 
          src={config.heroImageUrl} 
          alt="RASA Community" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black"></div>
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl">
        <div className="flex flex-col items-center gap-8 mb-10">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="px-6 py-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full flex items-center gap-3"
           >
              <div className="relative w-2 h-2">
                 <div className="absolute inset-0 bg-green-500 rounded-full animate-ping"></div>
                 <div className="relative w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Sanctuary Live: 142 Members Online</span>
           </motion.div>

           <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-2 bg-cyan-500/20 backdrop-blur-xl border border-cyan-500/30 rounded-full text-cyan-400 font-black text-xs uppercase tracking-[0.4em]"
          >
            <Sparkles size={14} className="animate-pulse" /> {config.motto}
          </motion.div>
        </div>

        <motion.h1 
          initial={{ y: 40, opacity: 0, scale: 0.92 }} 
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl md:text-9xl font-bold text-white mb-8 font-serif italic leading-tight tracking-tight"
        >
          {config.heroTitle}
        </motion.h1>

        <motion.p 
          initial={{ y: 30, opacity: 0, scale: 0.98 }} 
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
          className="text-xl md:text-3xl text-gray-300 mb-16 tracking-wide font-light max-w-3xl mx-auto leading-relaxed"
        >
          {config.heroSubtitle}
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          whileInView={{ y: 0, opacity: 1 }} 
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-6"
        >
          <Link 
            to="/portal" 
            className="px-12 py-6 bg-cyan-500 text-white rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-cyan-600 transition-all flex items-center gap-4 group shadow-[0_20px_50px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95"
          >
            Register Membership <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link 
            to="/about" 
            className="px-12 py-6 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-white/20 transition-all"
          >
            Our History
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-px h-16 bg-gradient-to-b from-cyan-500 to-transparent"></div>
      </motion.div>
    </section>
  );
};

export default Hero;
