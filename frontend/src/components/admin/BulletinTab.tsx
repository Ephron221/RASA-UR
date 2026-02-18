
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Megaphone, Plus, Edit, Trash2, CheckCircle, AlertTriangle, Info, Clock, Power, ShieldAlert, Zap } from 'lucide-react';
import { Announcement } from '../../types';

interface BulletinTabProps {
  announcements: Announcement[];
  onNew: () => void;
  onEdit: (a: Announcement) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, active: boolean) => void;
  canManage: boolean;
}

const BulletinTab: React.FC<BulletinTabProps> = ({ announcements, onNew, onEdit, onDelete, onToggleStatus, canManage }) => {
  const [filter, setFilter] = useState<'All' | 'Notice' | 'Urgent' | 'Info'>('All');
  const filtered = announcements.filter(a => filter === 'All' || a.status === filter);

  const IconMap: any = { 'Notice': CheckCircle, 'Urgent': AlertTriangle, 'Info': Info };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1">
          <h3 className="text-3xl font-black font-serif italic text-gray-900 flex items-center gap-4">
            <Megaphone className="text-cyan-500" size={32} /> Bulletin Broadcast
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Manage official campus mandates & info</p>
        </div>
        
        {canManage && (
          <button onClick={onNew} className="px-8 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-cyan-100 flex items-center gap-3 active:scale-95 transition-all">
            <Plus size={18} /> New Broadcast
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex gap-2">
          {['All', 'Urgent', 'Notice', 'Info'].map(f => (
            <button key={f} onClick={() => setFilter(f as any)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-cyan-600 hover:bg-gray-50'}`}>{f}</button>
          ))}
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-cyan-50/50 rounded-full border border-cyan-100">
           <Zap size={14} className="text-cyan-500" />
           <span className="text-[9px] font-black text-cyan-700 uppercase tracking-widest">{announcements.length} Total Sequences Stored</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map(a => {
            const Icon = IconMap[a.status] || Info;
            const isUrgent = a.status === 'Urgent';
            return (
              <motion.div 
                key={a.id} 
                layout
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-cyan-500/5 transition-all flex flex-col md:flex-row items-center gap-8 ${!a.isActive ? 'opacity-60 grayscale-[0.5]' : ''}`}
              >
                <div className={`w-20 h-20 ${a.color} rounded-[1.8rem] flex items-center justify-center text-white shadow-2xl shrink-0 group-hover:scale-105 transition-transform duration-500 relative`}>
                  {isUrgent && <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping opacity-20"></div>}
                  <Icon size={32} />
                </div>
                
                <div className="flex-grow space-y-3 min-w-0">
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 bg-gray-50 border ${a.color.replace('bg-', 'border-')} ${a.color.replace('bg-', 'text-')} rounded-lg text-[9px] font-black uppercase tracking-widest`}>{a.status}</span>
                    <span className="text-[10px] font-black text-gray-300 flex items-center gap-2"><Clock size={12}/> {a.date}</span>
                    <button 
                      onClick={() => onToggleStatus(a.id, !a.isActive)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase transition-all ${a.isActive ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'}`}
                    >
                      <Power size={10} /> {a.isActive ? 'Live' : 'Draft'}
                    </button>
                  </div>
                  <h4 className="text-xl font-black text-gray-900 leading-tight truncate">{a.title}</h4>
                  <p className="text-sm text-gray-400 font-medium line-clamp-1 leading-relaxed">{a.content}</p>
                </div>
                
                {canManage && (
                  <div className="flex gap-2 shrink-0 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(a)} className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-900 hover:text-white transition-all shadow-sm active:scale-95" title="Modify"><Edit size={18}/></button>
                    <button onClick={() => onDelete(a.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95" title="Purge"><Trash2 size={18}/></button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filtered.length === 0 && (
          <div className="py-40 text-center space-y-6 bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
              <Bell size={48} />
            </div>
            <p className="text-xl font-bold font-serif text-gray-300 italic">Global frequency silent. No bulletins found.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BulletinTab;
