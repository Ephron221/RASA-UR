
import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Star, Shield, Plus, Edit, Trash2, Phone, Calendar } from 'lucide-react';
import { Leader } from '../../types';

interface LeadershipTabProps {
  leaders: Leader[];
  onNew: () => void;
  onEdit: (l: Leader) => void;
  onDelete: (id: string) => void;
}

const LeadershipTab: React.FC<LeadershipTabProps> = ({ leaders, onNew, onEdit, onDelete }) => {
  const committees = ['Executive', 'Arbitration'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1">
          <h3 className="text-3xl font-black font-serif italic text-gray-900 flex items-center gap-4">
            <UserCheck className="text-cyan-500" size={32} /> Steward Council
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Institutional Governance & Pastoral Care</p>
        </div>
        <button onClick={onNew} className="px-8 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-cyan-500/20 flex items-center gap-3 active:scale-95 transition-all">
          <Plus size={18} /> Appoint Steward
        </button>
      </div>

      {committees.map((comm, commIdx) => (
        <div key={`committee-${comm}-${commIdx}`} className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="h-px flex-grow bg-gray-100"></div>
             <div className="flex items-center gap-3 px-6 py-2 bg-white border border-gray-100 rounded-2xl shadow-sm">
                {comm === 'Executive' ? <Star className="text-cyan-500" size={16}/> : <Shield className="text-cyan-500" size={16}/>}
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">{comm} Board</span>
             </div>
             <div className="h-px flex-grow bg-gray-100"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
             {leaders.filter(l => l.type === comm).map((leader, i) => (
               <motion.div key={`leader-${leader.id || leader.name || i}`} whileHover={{ y: -5 }} className="bg-white p-7 rounded-[3rem] border border-gray-100 shadow-sm relative group">
                  <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
                    <button onClick={() => onEdit(leader)} className="p-2.5 bg-white border border-gray-100 text-gray-400 rounded-xl hover:text-cyan-600 shadow-xl"><Edit size={16}/></button>
                    <button onClick={() => onDelete(leader.id)} className="p-2.5 bg-white border border-gray-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white shadow-xl"><Trash2 size={16}/></button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="relative mx-auto w-32 h-32">
                       <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500 to-blue-400 rounded-[2.5rem] blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                       <div className="relative w-full h-full rounded-[2.2rem] overflow-hidden border-4 border-white shadow-xl">
                          <img src={leader.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                       </div>
                    </div>

                    <div className="text-center space-y-1">
                      <h4 className="text-lg font-black text-gray-900 leading-tight truncate">{leader.name}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-cyan-600">{leader.position}</p>
                    </div>

                    <div className="pt-5 border-t border-gray-50 flex flex-col gap-3">
                       <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                          <Phone size={14} className="text-cyan-400"/> {leader.phone}
                       </div>
                       <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                          <Calendar size={14} className="text-cyan-400"/> Tenure: {leader.academicYear}
                       </div>
                    </div>
                  </div>
               </motion.div>
             ))}
             {leaders.filter(l => l.type === comm).length === 0 && (
               <div className="col-span-full py-16 text-center text-gray-300 italic text-sm font-serif">Board vacancies currently unlisted.</div>
             )}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default LeadershipTab;
