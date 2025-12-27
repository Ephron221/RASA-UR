
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, CheckCircle2, Trash2, Mail, 
  User, Clock, X, Eye, Phone, MessageCircle, 
  Send, ArrowLeft, Sparkles, Loader2, Users,
  GraduationCap, MapPin, Tag
} from 'lucide-react';
import { ContactMessage, DepartmentInterest } from '../../types';
import { API } from '../../services/api';

interface InboxTabProps {
  contactMsgs: ContactMessage[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
}

const InboxTab: React.FC<InboxTabProps> = ({ contactMsgs, onMarkRead, onMarkAllRead, onDelete }) => {
  const [activeInbox, setActiveInbox] = useState<'Inquiry' | 'Recruitment'>('Inquiry');
  const [interests, setInterests] = useState<DepartmentInterest[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<any | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    API.departments.getInterests().then(setInterests);
  }, []);

  const unreadInquiries = contactMsgs.filter(m => !m.isRead).length;
  const pendingRecruitments = interests.filter(i => i.status === 'Pending').length;

  const handleOpenMessage = (msg: any) => {
    setSelectedMsg(msg);
    setIsReplying(false);
    setShowSuccess(false);
    setReplyText('');
    if (activeInbox === 'Inquiry' && !msg.isRead) onMarkRead(msg.id);
  };

  const handleStatusUpdate = async (id: string, status: 'Approved' | 'Rejected') => {
    await API.departments.updateInterestStatus(id, status);
    setInterests(await API.departments.getInterests());
    setSelectedMsg(null);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSending(false);
    setShowSuccess(true);
    setReplyText('');
    setTimeout(() => { setShowSuccess(false); setIsReplying(false); }, 2500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex p-1.5 bg-gray-100 rounded-2xl w-fit">
           <button 
            onClick={() => setActiveInbox('Inquiry')}
            className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeInbox === 'Inquiry' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-cyan-600'}`}
           >
             <MessageSquare size={14}/> General Inquiries {unreadInquiries > 0 && <span className="bg-cyan-500 text-white px-1.5 rounded-full text-[8px]">{unreadInquiries}</span>}
           </button>
           <button 
            onClick={() => setActiveInbox('Recruitment')}
            className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeInbox === 'Recruitment' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-cyan-600'}`}
           >
             <Users size={14}/> Recruitments {pendingRecruitments > 0 && <span className="bg-orange-500 text-white px-1.5 rounded-full text-[8px]">{pendingRecruitments}</span>}
           </button>
        </div>
        
        {activeInbox === 'Inquiry' && unreadInquiries > 0 && (
          <button 
            onClick={onMarkAllRead}
            className="px-6 py-3 bg-white border border-cyan-100 text-cyan-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-50 transition-all flex items-center gap-2 active:scale-95"
          >
            <CheckCircle2 size={16} /> Mark All as Read
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm divide-y divide-gray-50">
        {activeInbox === 'Inquiry' ? (
          contactMsgs.map(m => (
            <div key={m.id} onClick={() => handleOpenMessage(m)} className={`p-8 flex items-start gap-6 group transition-all cursor-pointer hover:bg-gray-50/50 ${!m.isRead ? 'bg-cyan-50/15 border-l-4 border-cyan-500' : 'border-l-4 border-transparent'}`}>
               <div className={`w-14 h-14 ${!m.isRead ? 'bg-cyan-500 text-white shadow-lg' : 'bg-gray-100 text-gray-400'} rounded-2xl flex items-center justify-center font-black text-2xl shrink-0 transition-all group-hover:scale-105`}>
                 {m.fullName.charAt(0)}
               </div>
               <div className="flex-grow space-y-2 min-w-0">
                 <div className="flex justify-between items-start gap-4">
                   <div>
                     <p className="font-black text-gray-900 text-lg tracking-tight group-hover:text-cyan-600">{m.fullName}</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-cyan-500/60">{m.email}</p>
                   </div>
                   <span className="text-[10px] font-bold text-gray-400">{new Date(m.date).toLocaleDateString()}</span>
                 </div>
                 <p className="text-sm font-black text-gray-800 tracking-tight">{m.subject}</p>
                 <p className="text-sm text-gray-500 leading-relaxed line-clamp-1">{m.message}</p>
               </div>
               <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                  <button className="p-3 bg-white text-gray-400 border border-gray-100 rounded-xl hover:text-cyan-600 transition-all shadow-sm"><Eye size={18}/></button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(m.id); }} className="p-3 bg-red-50 text-red-500 border border-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18}/></button>
               </div>
            </div>
          ))
        ) : (
          interests.map(i => (
            <div key={i.id} onClick={() => handleOpenMessage(i)} className={`p-8 flex items-start gap-6 group transition-all cursor-pointer hover:bg-gray-50/50 border-l-4 ${i.status === 'Pending' ? 'border-orange-400 bg-orange-50/10' : i.status === 'Approved' ? 'border-green-400' : 'border-red-400'}`}>
               <div className={`w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black text-2xl shrink-0`}>
                 {i.fullName.charAt(0)}
               </div>
               <div className="flex-grow space-y-2 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-black text-gray-900 text-lg tracking-tight group-hover:text-cyan-600">{i.fullName}</p>
                      <div className="flex gap-3 text-[9px] font-black uppercase tracking-widest text-gray-400">
                        <span className="text-cyan-600">{i.departmentName}</span>
                        <span>•</span>
                        <span>{i.level}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase ${i.status === 'Pending' ? 'bg-orange-100 text-orange-600' : i.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {i.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1 font-medium italic">"{i.motivation}"</p>
               </div>
               <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                  <button className="p-3 bg-white text-gray-400 border border-gray-100 rounded-xl hover:text-cyan-600 transition-all shadow-sm"><Eye size={18}/></button>
               </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {selectedMsg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-2xl rounded-[3rem] shadow-3xl overflow-hidden border border-white flex flex-col max-h-[90vh]">
               <div className="p-10 border-b border-gray-50 flex justify-between items-start bg-gray-50/30">
                 <div className="flex gap-6 items-center">
                    <div className="w-16 h-16 bg-gray-900 text-white rounded-3xl flex items-center justify-center font-black text-3xl shadow-xl">
                      {selectedMsg.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-gray-900 tracking-tight">{selectedMsg.fullName}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedMsg.email}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedMsg(null)} className="p-3 bg-white border border-gray-100 text-gray-400 rounded-2xl hover:text-red-500 transition-all"><X size={20}/></button>
               </div>
               
               <div className="flex-grow overflow-y-auto scroll-hide p-12">
                  {activeInbox === 'Recruitment' ? (
                    <div className="space-y-10">
                       <div className="grid grid-cols-2 gap-6">
                          <div className="p-6 bg-gray-50 rounded-3xl space-y-1">
                             <p className="text-[9px] font-black text-gray-400 uppercase">Target Ministry</p>
                             <p className="font-black text-cyan-600 flex items-center gap-2"><Tag size={12}/> {selectedMsg.departmentName}</p>
                          </div>
                          <div className="p-6 bg-gray-50 rounded-3xl space-y-1">
                             <p className="text-[9px] font-black text-gray-400 uppercase">Academic Level</p>
                             <p className="font-black text-gray-700 flex items-center gap-2"><GraduationCap size={14}/> {selectedMsg.level}</p>
                          </div>
                          <div className="p-6 bg-gray-50 rounded-3xl space-y-1">
                             <p className="text-[9px] font-black text-gray-400 uppercase">Home Diocese</p>
                             <p className="font-black text-gray-700 flex items-center gap-2"><MapPin size={12}/> {selectedMsg.diocese}</p>
                          </div>
                          <div className="p-6 bg-gray-50 rounded-3xl space-y-1">
                             <p className="text-[9px] font-black text-gray-400 uppercase">Contact</p>
                             <p className="font-black text-gray-700 flex items-center gap-2"><Phone size={12}/> {selectedMsg.phone}</p>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">Spiritual Motivation</p>
                          <p className="text-lg text-gray-700 leading-relaxed font-serif italic border-l-4 border-cyan-500 pl-8">"{selectedMsg.motivation}"</p>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                       <div className="space-y-2">
                         <p className="text-[10px] font-black uppercase text-cyan-500 tracking-[0.3em]">Subject: {selectedMsg.subject}</p>
                         <p className="text-lg font-medium text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedMsg.message}</p>
                       </div>
                    </div>
                  )}
               </div>

               <div className="p-10 border-t border-gray-50 bg-gray-50/30 flex justify-between gap-4">
                  <button onClick={() => setSelectedMsg(null)} className="px-8 py-4 bg-white border border-gray-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400">Discard</button>
                  {activeInbox === 'Recruitment' && selectedMsg.status === 'Pending' ? (
                    <div className="flex gap-3">
                       <button onClick={() => handleStatusUpdate(selectedMsg.id, 'Rejected')} className="px-8 py-4 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest">Decline</button>
                       <button onClick={() => handleStatusUpdate(selectedMsg.id, 'Approved')} className="px-10 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-cyan-100">Approve Steward</button>
                    </div>
                  ) : (
                    <button onClick={() => setIsReplying(true)} className="px-10 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Compose Reply</button>
                  )}
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InboxTab;
