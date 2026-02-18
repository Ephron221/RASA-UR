
import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Cross } from 'lucide-react';
import { HomeConfig } from '../../types';

interface OverviewProps {
  config: HomeConfig;
}

const Overview: React.FC<OverviewProps> = ({ config }) => {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="max-container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Visual Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-cyan-100 rounded-[5rem] blur-3xl opacity-50 -z-10 animate-pulse"></div>
            <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src={config.aboutImageUrl || "https://images.unsplash.com/photo-1544427928-c49cdfebf193?q=80&w=2000"} 
                alt="Community Vision" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-cyan-500 text-white p-10 rounded-[3rem] shadow-2xl max-w-xs space-y-4">
              <Quote size={40} className="opacity-30" />
              <p className="font-serif italic text-xl">"{config.aboutScripture}"</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-cyan-200">{config.aboutScriptureRef}</p>
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 text-cyan-600 font-black text-xs uppercase tracking-[0.4em]">
                <Cross size={16} /> Since 1997
              </span>
              <h2 className="text-5xl md:text-7xl font-bold font-serif italic text-gray-900 leading-tight">
                {config.aboutTitle}
              </h2>
            </div>
            
            <p className="text-xl text-gray-500 leading-relaxed font-light">
              {config.aboutText}
            </p>

            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="space-y-2">
                <p className="text-3xl font-black text-gray-900">{config.stat1Value}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{config.stat1Label}</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-black text-gray-900">{config.stat2Value}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{config.stat2Label}</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Overview;
