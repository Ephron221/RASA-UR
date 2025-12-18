
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, CheckCircle2, Trash2, Mail, User, Clock, X, Eye } from 'lucide-react';
import { ContactMessage } from '../../types';

interface InboxTabProps {
  contactMsgs: ContactMessage[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
}

const InboxTab: React.FC<InboxTabProps> = ({ contactMsgs, onMarkRead, onMarkAllRead, onDelete }) => {
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const unreadCount = contactMsgs.filter(m => !m.isRead).length;

  const handleOpenMessage = (msg: ContactMessage) => {
    setSelectedMsg(msg);
    if (!msg.isRead) onMarkRead(msg.id);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-cyan-600">
            <MessageSquare size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black font-serif italic text-gray-900 leading-tight">Admin Inbox</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{unreadCount} unread inquiries</p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={onMarkAllRead}
            className="w-full sm:w-auto px-6 py-3 bg-white border border-cyan-100 text-cyan-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-50 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <CheckCircle2 size={16} /> Mark All as Read
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm divide-y divide-gray-50">
        {contactMsgs.map(m => (
          <div 
            key={m.id} 
            onClick={() => handleOpenMessage(m)}
            className={`p-8 flex items-start gap-6 group transition-all cursor-pointer hover:bg-gray-50/50 ${!m.isRead ? 'bg-cyan-50/15 border-l-4 border-cyan-500' : 'border-l-4 border-transparent'}`}
          >
             <div className={`w-14 h-14 ${!m.isRead ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-100' : 'bg-gray-100 text-gray-400'} rounded-2xl flex items-center justify-center font-black text-2xl shrink-0 transition-all group-hover:scale-105`}>
               {m.fullName.charAt(0)}
             </div>
             <div className="flex-grow space-y-2 min-w-0">
               <div className="flex justify-between items-start gap-4">
                 <div>
                   <p className="font-black text-gray-900 text-lg tracking-tight group-hover:text-cyan-600 transition-colors">{m.fullName}</p>
                   <p className="text-[10px] font-black uppercase tracking-widest text-cyan-500/60">{m.email}</p>
                 </div>
                 <span className="text-[10px] font-bold text-gray-400 shrink-0 whitespace-nowrap bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                   {new Date(m.date).toLocaleDateString()}
                 </span>
               </div>
               <p className="text-sm font-black text-gray-800 tracking-tight">{m.subject}</p>
               <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{m.message}</p>
             </div>
             <div className="flex flex-col gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleOpenMessage(m); }}
                  className="p-3 bg-white text-gray-400 border border-gray-100 rounded-xl hover:text-cyan-600 hover:border-cyan-100 transition-all shadow-sm" 
                  title="View Detail"
                >
                  <Eye size={18}/>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(m.id); }} 
                  className="p-3 bg-red-50 text-red-500 border border-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm" 
                  title="Delete"
                >
                  <Trash2 size={18}/>
                </button>
             </div>
          </div>
        ))}
        {contactMsgs.length === 0 && (
          <div className="p-32 text-center space-y-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
              <Mail size={40} />
            </div>
            <p className="text-xl font-bold font-serif text-gray-300 italic">No messages found. Your inbox is serene.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedMsg && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-3xl overflow-hidden border border-white"
            >
               <div className="p-10 border-b border-gray-50 flex justify-between items-start bg-gray-50/30">
                 <div className="flex gap-6 items-center">
                    <div className="w-16 h-16 bg-cyan-500 text-white rounded-3xl flex items-center justify-center font-black text-3xl shadow-xl shadow-cyan-100">
                      {selectedMsg.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-gray-900 tracking-tight">{selectedMsg.fullName}</h4>
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                        <span className="flex items-center gap-1.5"><Mail size={12} className="text-cyan-500" /> {selectedMsg.email}</span>
                        <span className="flex items-center gap-1.5"><Clock size={12} className="text-cyan-500" /> {new Date(selectedMsg.date).toLocaleString()}</span>
                      </div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedMsg(null)} className="p-3 bg-white border border-gray-100 text-gray-400 rounded-2xl hover:text-red-500 hover:bg-red-50 transition-all"><X size={20}/></button>
               </div>
               
               <div className="p-12 space-y-6">
                 <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase text-cyan-500 tracking-[0.3em]">Subject Reference</p>
                   <h5 className="text-xl font-bold text-gray-900">{selectedMsg.subject}</h5>
                 </div>
                 <div className="p-8 bg-[#F9FBFC] rounded-[2.5rem] border border-gray-100 relative">
                   <div className="absolute top-6 right-8 opacity-5"><MessageSquare size={64}/></div>
                   <p className="text-gray-700 leading-relaxed text-lg font-medium whitespace-pre-wrap relative z-10">{selectedMsg.message}</p>
                 </div>
               </div>

               <div className="p-10 border-t border-gray-50 bg-gray-50/30 flex justify-end gap-4">
                 <button onClick={() => setSelectedMsg(null)} className="px-10 py-4 bg-white border border-gray-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all">Close Viewer</button>
                 <a 
                   href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject}`}
                   className="px-10 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-cyan-100 hover:bg-cyan-600 transition-all flex items-center gap-2"
                 >
                   <Mail size={16} /> Compose Reply
                 </a>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InboxTab;
