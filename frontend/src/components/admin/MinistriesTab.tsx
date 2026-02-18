
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Sparkles, Flame, Music, Globe, Heart, Shield, Activity, Handshake, Mic, Info, Zap } from 'lucide-react';
import { Department } from '../../types';

interface MinistriesTabProps {
  departments: Department[];
  onNew: () => void;
  onEdit: (d: Department) => void;
  onDelete: (id: string) => void;
}

const IconMap: Record<string, any> = { Flame, Music, Globe, Activity, Shield, Heart, Mic, Handshake, Zap };

const SmartIcon: React.FC<{ icon: string; size?: number; className?: string }> = ({ icon, size = 24, className = "" }) => {
  if (!icon) return <Info size={size} className={className} />;
  if (icon.startsWith('data:') || icon.startsWith('http')) {
    return <img src={icon} alt="Icon" className={`object-contain ${className}`} style={{ width: size, height: size }} />;
  }
  const LucideIcon = IconMap[icon] || Info;
  return <LucideIcon size={size} className={className} />;
};

const MinistriesTab: React.FC<MinistriesTabProps> = ({ departments, onNew, onEdit, onDelete }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-4xl font-black font-serif italic text-gray-900 flex items-center gap-4">
            <Sparkles className="text-cyan-500" size={36} /> Ministry Ecosystem
          </h3>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Functional departments & spiritual units</p>
        </div>
        <button onClick={onNew} className="px-10 py-5 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(6,182,212,0.2)] flex items-center gap-3 active:scale-95 transition-all">
          <Plus size={20} /> Initialize Ministry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {(departments || []).map((dept, i) => (
          <motion.div 
            key={`dept-card-${dept.id || i}`} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-[3.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-3xl hover:shadow-cyan-500/5 transition-all duration-700 flex flex-col group h-full"
          >
            <div className="p-4 flex-grow flex flex-col">
              <div className="relative aspect-[4/3] rounded-[2.8rem] overflow-hidden mb-8 shadow-inner border border-gray-50">
                <img src={dept.image || 'https://images.unsplash.com/photo-1544427928-c49cdfebf193?q=80&w=2000'} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt="" />
                <div className="absolute top-6 left-6 w-16 h-16 bg-white/95 backdrop-blur-xl rounded-3xl flex items-center justify-center text-cyan-500 shadow-2xl border border-white/20 p-4">
                  <SmartIcon icon={dept.icon} size={32} />
                </div>
                <div className="absolute bottom-6 right-6">
                  <span className="px-5 py-2 bg-gray-900/90 backdrop-blur-md text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em]">{dept.category || 'Ministry'}</span>
                </div>
              </div>
              
              <div className="px-6 space-y-6">
                <div>
                  <h4 className="text-3xl font-black text-gray-900 tracking-tight mb-2 group-hover:text-cyan-600 transition-colors">{dept.name}</h4>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed line-clamp-2">{dept.description}</p>
                </div>
                
                <div className="h-px bg-gray-50"></div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-5 rounded-3xl space-y-1">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Projects</p>
                    <p className="text-lg font-black text-gray-900">{dept.activities?.length || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-3xl space-y-1">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Health</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[11px] font-black text-gray-700 uppercase">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 mt-auto flex items-center gap-4 bg-gray-50/30">
              <button 
                onClick={() => onEdit(dept)} 
                className="flex-grow py-5 bg-white text-gray-900 border border-gray-100 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-all shadow-sm group/btn"
              >
                View & Edit
              </button>
              <button 
                onClick={() => onDelete(dept.id)} 
                className="p-5 bg-red-50 text-red-500 rounded-3xl hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-50"
              >
                <Trash2 size={20}/>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {(!departments || departments.length === 0) && (
        <div className="py-40 text-center space-y-8 bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
           <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
             <Plus size={48} />
           </div>
           <div className="space-y-2">
             <h3 className="text-2xl font-bold font-serif italic text-gray-400">Divine Layer Unpopulated</h3>
             <p className="text-gray-400 max-w-xs mx-auto">Initialize your first ministry sequence to begin campus synchronization.</p>
           </div>
        </div>
      )}
    </motion.div>
  );
};

export default MinistriesTab;
