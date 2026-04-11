
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HomeConfig } from '../../types';

interface HeroProps {
  config: HomeConfig;
}

const Hero: React.FC<HeroProps> = ({ config }) => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Layer - Enhanced for visibility and clarity */}
      <motion.div 
        initial={{ scale: 1.05, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 2, ease: "easeOut" }} 
        className="absolute inset-0 z-0"
      >
        <img 
          src={config.heroImageUrl} 
          alt="RASA Community" 
          className="w-full h-full object-cover contrast-[1.1] brightness-[0.7] grayscale-[0.2]" 
        />
        {/* Gray/Slate Overlay for better clarity and depth */}
        <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply"></div>
        {/* Multi-stage gradient for text readability and section transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60"></div>
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <div className="flex flex-col items-center gap-6 mb-8">
           {/* Live Pulse */}
           <motion.div 
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2, duration: 0.8 }}
             className="px-4 py-1.5 bg-white/95 backdrop-blur-2xl border border-white/20 rounded-full flex items-center gap-2.5 shadow-2xl"
           >
              <div className="relative w-1.5 h-1.5">
                 <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-75"></div>
                 <div className="relative w-1.5 h-1.5 bg-secondary rounded-full"></div>
              </div>
              <span className="text-[9px] font-black text-black uppercase tracking-[0.2em]">Sanctuary Active</span>
           </motion.div>

           {/* Motto Badge */}
           <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.4, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-secondary border border-white/30 rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(59,107,31,0.3)]"
          >
            <Sparkles size={12} className="animate-pulse text-white" /> {config.motto}
          </motion.div>
        </div>

        {/* Title - Optimized for clarity */}
        <motion.h1 
          initial={{ y: 40, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-8xl lg:text-9xl font-bold text-white mb-8 font-serif italic leading-[0.95] tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
        >
          {config.heroTitle}
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ y: 25, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="text-lg md:text-2xl text-white/95 mb-14 tracking-wide font-bold max-w-2xl mx-auto leading-relaxed px-4 drop-shadow-lg"
        >
          {config.heroSubtitle}
        </motion.p>

        {/* Call to Action */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link 
            to="/portal" 
            className="w-full sm:w-auto px-12 py-5 bg-secondary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-secondary transition-all flex items-center justify-center gap-4 group shadow-[0_20px_40px_rgba(59,107,31,0.4)] hover:-translate-y-1 active:scale-95"
          >
            Register Membership <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link 
            to="/about" 
            className="w-full sm:w-auto px-12 py-5 bg-white/15 backdrop-blur-xl border border-white/40 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all active:scale-95 shadow-2xl"
          >
            Explore History
          </Link>
        </motion.div>
      </div>

      {/* Elegant Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }} 
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.6em]">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-white via-white/50 to-transparent"></div>
      </motion.div>
    </section>
  );
};

export default Hero;
