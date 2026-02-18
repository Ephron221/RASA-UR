
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HomeConfig } from '../../types';

interface HeroProps {
  config: HomeConfig;
}

const Hero: React.FC<HeroProps> = ({ config }) => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#020617]">
      {/* Background Layer with Multi-stage Gradient */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }} 
        animate={{ scale: 1, opacity: 0.55 }} 
        transition={{ duration: 2.5, ease: "easeOut" }} 
        className="absolute inset-0 z-0"
      >
        <img 
          src={config.heroImageUrl} 
          alt="RASA Community" 
          className="w-full h-full object-cover" 
        />
        {/* Layered vignette for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#020617]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
        {/* Grain overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <div className="flex flex-col items-center gap-6 mb-8">
           {/* Compact Live Pulse */}
           <motion.div 
             initial={{ opacity: 0, y: 15 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2, duration: 0.8 }}
             className="px-4 py-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2.5 shadow-2xl"
           >
              <div className="relative w-1.5 h-1.5">
                 <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
                 <div className="relative w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
              </div>
              <span className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em]">Sanctuary Active • 142 Members Online</span>
           </motion.div>

           {/* Motto Badge */}
           <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-cyan-500/10 backdrop-blur-md border border-cyan-500/20 rounded-full text-cyan-400 font-black text-[10px] uppercase tracking-[0.4em]"
          >
            <Sparkles size={12} className="animate-pulse" /> {config.motto}
          </motion.div>
        </div>

        {/* Scaled-down Title with Scroll Triggered subtle upward lift */}
        <motion.h1 
          initial={{ y: 40, opacity: 0 }} 
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-7xl lg:text-8xl font-bold text-white mb-6 font-serif italic leading-[1.05] tracking-tight"
        >
          {config.heroTitle}
        </motion.h1>

        {/* Refined Subtitle visibility trigger */}
        <motion.p 
          initial={{ y: 25, opacity: 0 }} 
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="text-base md:text-lg text-gray-300/90 mb-12 tracking-wide font-light max-w-2xl mx-auto leading-relaxed px-4"
        >
          {config.heroSubtitle}
        </motion.p>

        {/* Interactive Call to Action entrance */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            to="/portal" 
            className="w-full sm:w-auto px-10 py-4.5 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-cyan-600 transition-all flex items-center justify-center gap-4 group shadow-[0_20px_40px_rgba(6,182,212,0.2)] hover:-translate-y-1 active:scale-95"
          >
            Register Membership <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
          </Link>
          <Link 
            to="/about" 
            className="w-full sm:w-auto px-10 py-4.5 bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all active:scale-95"
          >
            Explore History
          </Link>
        </motion.div>
      </div>

      {/* Decorative Progress Dots */}
      <div className="absolute bottom-12 flex gap-1.5 opacity-20">
        {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-white rounded-full" />)}
      </div>

      {/* Elegant Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 8, 0], opacity: [0.3, 0.6, 0.3] }} 
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.5em]">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-cyan-500/50 to-transparent"></div>
      </motion.div>
    </section>
  );
};

export default Hero;
