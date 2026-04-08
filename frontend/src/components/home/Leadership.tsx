
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Shield, Calendar, Award, Star, Users, Phone, MessageCircle } from 'lucide-react';
import { Leader } from '../../types';

interface LeadershipProps {
  leaders: Leader[];
}

const Leadership: React.FC<LeadershipProps> = ({ leaders }) => {
  const [activeCommittee, setActiveCommittee] = useState<'Executive' | 'Arbitration'>('Executive');

  // Filter leaders by type
  const committeeLeaders = leaders.filter(l => l.type === activeCommittee);

  // For Executive, we identify the "Representative" (President) to show them as the focal point
  const representative = committeeLeaders.find(l => 
    l.position.toLowerCase().includes('representative') || 
    l.position.toLowerCase().includes('president')
  );
  
  const otherLeaders = committeeLeaders.filter(l => l.id !== representative?.id);

  return (
    <section className="py-32 bg-primary text-black overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-container px-4 relative z-10">
        <div className="text-center mb-24 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 bg-secondary/5 border border-secondary/10 rounded-full text-secondary font-black text-[10px] uppercase tracking-[0.4em]"
          >
            <UserCheck size={14} /> The Leadership Council
          </motion.div>
          
          <div className="space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-bold font-serif italic tracking-tight"
            >
              RASA <span className="text-secondary">Stewards</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-black/60 text-xl font-light max-w-2xl mx-auto"
            >
              Showing Christ to Academicians through dedicated service, academic excellence, and spiritual integrity.
            </motion.p>
          </div>
          
          {/* Professional Tab Switcher */}
          <div className="flex justify-center gap-4 mt-12 p-2 bg-secondary/5 rounded-[2rem] w-fit mx-auto border border-secondary/10">
            {[
              { id: 'Executive', label: 'Executive Committee', icon: Star },
              { id: 'Arbitration', label: 'Arbitration (CA)', icon: Shield }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCommittee(tab.id as any)}
                className={`flex items-center gap-3 px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCommittee === tab.id 
                    ? 'bg-secondary text-white shadow-xl' 
                    : 'text-black/40 hover:text-secondary hover:bg-white'
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCommittee}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="w-full"
          >
            {activeCommittee === 'Executive' ? (
              /* HIERARCHICAL LAYOUT FOR EXECUTIVE */
              <div className="space-y-16">
                {/* 1. Representative / Head (Central focal point) */}
                {representative && (
                  <div className="flex justify-center mb-24">
                    <LeaderCard leader={representative} size="large" />
                  </div>
                )}

                {/* 2. Officers & Advisors Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                  {otherLeaders.map((leader, idx) => (
                    <LeaderCard key={leader.id} leader={leader} delay={idx * 0.05} />
                  ))}
                </div>
              </div>
            ) : (
              /* GRID LAYOUT FOR ARBITRATION */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                {committeeLeaders.map((leader, idx) => (
                  <LeaderCard key={leader.id} leader={leader} delay={idx * 0.05} />
                ))}
                {committeeLeaders.length === 0 && <EmptyState />}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

/* Sub-component for individual leader cards */
const LeaderCard: React.FC<{ leader: Leader; delay?: number; size?: 'normal' | 'large' }> = ({ leader, delay = 0, size = 'normal' }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    viewport={{ once: true }}
    className={`group relative ${size === 'large' ? 'w-full max-w-sm mx-auto' : ''}`}
  >
    <div className={`relative aspect-[3/4] rounded-[3.5rem] overflow-hidden border border-gray-100 shadow-2xl transition-all duration-700 bg-white ${size === 'large' ? 'ring-8 ring-secondary/10' : ''}`}>
      <img 
        src={leader.image} 
        alt={leader.name} 
        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
      
      {/* Top Badge: Year */}
      <div className="absolute top-6 right-6">
        <div className="px-4 py-1.5 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center gap-2">
          <Calendar size={10} className="text-white" />
          <span className="text-[9px] font-black text-white uppercase tracking-widest">{leader.academicYear}</span>
        </div>
      </div>

      {/* Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-10 space-y-4">
        {size === 'large' && (
          <div className="flex gap-2 mb-2">
            <span className="px-4 py-1 bg-secondary text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">Official Representative</span>
          </div>
        )}
        <h4 className={`${size === 'large' ? 'text-4xl' : 'text-2xl'} font-black tracking-tight leading-tight mb-1 text-white`}>{leader.name}</h4>
        
        <div className="space-y-3">
          <p className="text-accent text-[10px] font-black uppercase tracking-[0.3em]">{leader.position}</p>
          
          {/* Contact Section */}
          <div className="pt-2 flex items-center gap-4 border-t border-white/20 mt-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-white/90">
              <Phone size={14} className="text-accent" />
              <span className="text-[11px] font-black tracking-tighter">{leader.phone}</span>
            </div>
            <a 
              href={`tel:${leader.phone}`}
              className="p-2.5 bg-secondary rounded-xl text-white shadow-xl hover:bg-accent transition-all"
            >
              <Phone size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
    
    {/* Connector Decorators (Hierarchical Feel) */}
    {size === 'large' && (
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-secondary to-transparent opacity-30"></div>
    )}
  </motion.div>
);

const EmptyState = () => (
  <div className="col-span-full py-40 text-center space-y-6">
    <div className="w-24 h-24 bg-secondary/5 rounded-full flex items-center justify-center mx-auto text-secondary/30">
      <Users size={48} />
    </div>
    <div className="space-y-2">
      <h3 className="text-2xl font-bold font-serif italic text-black/40">Committee Pending</h3>
      <p className="text-black/30 text-sm max-w-xs mx-auto">The leadership records for this committee are currently being updated by the RASA secretariat.</p>
    </div>
  </div>
);

export default Leadership;
