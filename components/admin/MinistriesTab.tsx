
import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plus, Edit, Trash2, Sparkles, Layers, Users, Zap, Flame, Music, Globe, Heart, Shield, Activity, Handshake, Mic, Info } from 'lucide-react';
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
  
  if (icon.startsWith('data:') || icon.startsWith('http') || icon.startsWith('/')) {
    return <img src={icon} alt="Icon" className={`object-contain ${className}`} style={{ width: size, height: size }} />;
  }

  const LucideIcon = IconMap[icon] || Info;
  return <LucideIcon size={size} className={className} />;
};

const MinistriesTab: React.FC<MinistriesTabProps> = ({ departments, onNew, onEdit, onDelete }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-3xl font-black font-serif italic text-gray-900 flex items-center gap-4">
            <Sparkles className="text-cyan-500" size={32} /> Ministry Ecosystem
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Functional departments & spiritual units</p>
        </div>
        <button onClick={onNew} className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl flex items-center gap-3 active:scale-95 transition-all">
          <Plus size={20} /> Initialize Ministry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {departments.map((dept, i) => (
          <motion.div 
            key={dept.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-[3.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-700 group flex flex-col"
          >
            <div className="h-48 overflow-hidden relative">
              <img src={dept.image || 'https://images.unsplash.com/photo-1544427928-c49cdfebf193?q=80&w=2000'} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
              <div className="absolute top-6 left-6 w-14 h-14 bg-white/95 backdrop-blur-xl rounded-2xl flex items-center justify-center text-cyan-600 shadow-xl border border-white/20 overflow-hidden p-3">
                <SmartIcon icon={dept.icon} size={24} />
              </div>
              <div className="absolute bottom-6 right-6">
                <span className="px-4 py-1.5 bg-gray-900/80 backdrop-blur-md text-white rounded-xl text-[8px] font-black uppercase tracking-widest">{dept.category || 'Ministry'}</span>
              </div>
            </div>
            <div className="p-8 space-y-6 flex-grow flex flex-col">
              <div>
                <h4 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2">{dept.name}</h4>
                <p className="text-gray-400 text-xs font-medium leading-relaxed line-clamp-2">{dept.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                 <div className="bg-gray-50 p-3 rounded-2xl">
                   <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5">Projects</p>
                   <p className="text-sm font-black text-gray-900">{dept.activities?.length || 0}</p>
                 </div>
                 <div className="bg-gray-50 p-3 rounded-2xl">
                   <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5">Health</p>
                   <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div><span className="text-[10px] font-black text-gray-700">Active</span></div>
                 </div>
              </div>
              <div className="mt-auto pt-6 flex gap-3">
                <button onClick={() => onEdit(dept)} className="flex-grow py-3 bg-gray-50 text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all shadow-sm">View & Edit</button>
                <button onClick={() => onDelete(dept.id)} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16}/></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MinistriesTab;
