
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Shield, ChevronRight } from 'lucide-react';
import { Leader } from '../../types';

interface LeadershipProps {
  leaders: Leader[];
}

const Leadership: React.FC<LeadershipProps> = ({ leaders }) => {
  const [filter, setFilter] = useState<'Executive' | 'Arbitration'>('Executive');

  const filteredLeaders = leaders.filter(l => l.type === filter);

  return (
    <section className="py-32 bg-black text-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-container px-4">
        <div className="text-center mb-24 space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-cyan-400 font-black text-[10px] uppercase tracking-[0.4em]">
            <UserCheck size={14} /> The 2024 Council
          </div>
          <h2 className="text-6xl md:text-8xl font-bold font-serif italic tracking-tight">
            Our <span className="text-cyan-500">Stewards</span>
          </h2>
          
          {/* Custom Filter Controls */}
          <div className="flex justify-center gap-4 mt-12">
            {(['Executive', 'Arbitration'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === type 
                    ? 'bg-cyan-500 text-white shadow-2xl shadow-cyan-500/20' 
                    : 'bg-white/5 text-gray-500 hover:bg-white/10'
                }`}
              >
                {type} Committee
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <AnimatePresence mode="popLayout">
            {filteredLeaders.map((leader, idx) => (
              <motion.div 
                key={leader.id} 
                layout
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative"
              >
                <div className="relative aspect-[3/4] rounded-[3.5rem] overflow-hidden mb-8 border border-white/5 grayscale group-hover:grayscale-0 transition-all duration-1000 shadow-2xl bg-gray-900">
                  <img 
                    src={leader.image} 
                    alt={leader.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-40 transition-opacity"></div>
                  
                  <div className="absolute bottom-10 left-10 right-10 text-left space-y-2 transform group-hover:-translate-y-2 transition-transform">
                    <h4 className="text-3xl font-black tracking-tight leading-none">{leader.name}</h4>
                    <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em]">{leader.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredLeaders.length === 0 && (
          <div className="py-20 text-center opacity-30">
            <Shield size={64} className="mx-auto mb-4" />
            <p className="text-xl font-serif italic">Committee records pending update...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Leadership;
