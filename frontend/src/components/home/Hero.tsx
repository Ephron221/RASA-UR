
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
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gray-100">
      {/* Background Layer - Optimized for maximum visibility */}
      <motion.div 
        initial={{ scale: 1.05, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 2, ease: "easeOut" }} 
        className="absolute inset-0 z-0"
      >
        <img 
          src={config.heroImageUrl} 
          alt="RASA Community" 
          className="w-full h-full object-cover contrast-[1.05] brightness-[0.95]" 
        />
        {/* Subtle Darkening Overlay to help text readability without washing out the image */}
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Soft bottom fade to blend with next section */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/10"></div>
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <div className="flex flex-col items-center gap-6 mb-8">
           {/* Live Pulse */}
           <motion.div 
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2, duration: 0.8 }}
             className="px-4 py-1.5 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-full flex items-center gap-2.5 shadow-xl"
           >
              <div className="relative w-1.5 h-1.5">
                 <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-75"></div>
                 <div className="relative w-1.5 h-1.5 bg-secondary rounded-full"></div>
              </div>
              <span className="text-[9px] font-black text-black/70 uppercase tracking-[0.2em]">Sanctuary Active</span>
           </motion.div>

           {/* Motto Badge */}
           <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.4, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-secondary/90 backdrop-blur-md border border-white/20 rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl"
          >
            <Sparkles size={12} className="animate-pulse text-white" /> {config.motto}
          </motion.div>
        </div>

        {/* Title with shadow for readability on clear background */}
        <motion.h1 
          initial={{ y: 40, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-7xl lg:text-8xl font-bold text-white mb-6 font-serif italic leading-[1.05] tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
        >
          {config.heroTitle}
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ y: 25, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="text-base md:text-xl text-white mb-12 tracking-wide font-black max-w-2xl mx-auto leading-relaxed px-4 drop-shadow-md"
        >
          {config.heroSubtitle}
        </motion.p>

        {/* Call to Action */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            to="/portal" 
            className="w-full sm:w-auto px-10 py-4.5 bg-secondary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-secondary transition-all flex items-center justify-center gap-4 group shadow-2xl hover:-translate-y-1 active:scale-95"
          >
            Register Membership <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
          </Link>
          <Link 
            to="/about" 
            className="w-full sm:w-auto px-10 py-4.5 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all active:scale-95 shadow-xl"
          >
            Explore History
          </Link>
        </motion.div>
      </div>

      {/* Elegant Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }} 
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[8px] font-black text-white uppercase tracking-[0.5em]">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
      </motion.div>
    </section>
  );
};

export default Hero;
