
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles, Heart, X, ShieldCheck, Zap } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

const SacredToast: React.FC = () => {
  const { notifications, remove } = useNotification();

  return (
    <div className="fixed bottom-10 right-10 z-[1000] flex flex-col gap-4 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className="pointer-events-auto relative group"
          >
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative w-80 bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem] p-6 flex items-start gap-5 overflow-hidden">
               {/* Progress Timer Line */}
               <motion.div 
                 initial={{ width: '100%' }}
                 animate={{ width: 0 }}
                 transition={{ duration: 6, ease: "linear" }}
                 className="absolute bottom-0 left-0 h-1 bg-cyan-500/30"
               />

               <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                 n.type === 'divine' ? 'bg-gray-900 text-cyan-400' : 'bg-cyan-500 text-white'
               }`}>
                 {n.type === 'divine' ? <Sparkles size={24} /> : <CheckCircle2 size={24} />}
               </div>

               <div className="flex-grow space-y-1 pr-4">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-600">{n.title}</h4>
                 <p className="text-sm font-black text-gray-900 leading-tight">{n.message}</p>
                 <div className="flex items-center gap-2 pt-2">
                    <Heart size={10} fill="currentColor" className="text-red-400" />
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Divine Handshake Confirmed</span>
                 </div>
               </div>

               <button 
                onClick={() => remove(n.id)}
                className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-300 hover:text-red-500 transition-all"
               >
                 <X size={14}/>
               </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SacredToast;
