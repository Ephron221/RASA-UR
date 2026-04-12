import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Briefcase, ChevronRight, CheckCircle2, X, Loader2, Send, PlusCircle } from 'lucide-react';
import { Department, DepartmentInterest, User } from '../../types';
import { API } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';

interface MemberMinistriesTabProps {
  currentUser: User;
  departments: Department[];
  pendingRequests: DepartmentInterest[];
  onRefresh: () => void;
}

const MemberMinistriesTab: React.FC<MemberMinistriesTabProps> = ({ currentUser, departments, pendingRequests, onRefresh }) => {
  const { notify } = useNotification();
  
  // Placement Form State
  const [showModal, setShowModal] = useState(false);
  const [formDeptId, setFormDeptId] = useState('');
  const [motivation, setMotivation] = useState('');
  const [experience, setExperience] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track if user already requested this department or is already a member
  const isAlreadyMember = (deptName: string) => {
    if (!currentUser.department) return false;
    const depts = currentUser.department.split(',').map(d => d.trim());
    return depts.includes(deptName);
  };

  const hasRequested = (deptName: string) => {
    return pendingRequests.some(r => (r as any).userId === currentUser.id && r.departmentName === deptName && r.status === 'Pending');
  };

  const openPlacementForm = (deptId: string = '') => {
    setFormDeptId(deptId);
    setMotivation('');
    setExperience('');
    setShowModal(true);
  };

  const submitApplication = async () => {
    if (!formDeptId || !motivation.trim() || !experience.trim()) {
       notify("Incomplete Data", "Please properly articulate your motivation and experience.", "error");
       return;
    }
    const dept = departments.find(d => d.id === formDeptId);
    if (!dept) return;
    if (isAlreadyMember(dept.name)) {
      notify("Already Stationed", "You are already an active member of this ministry.", "info");
      return;
    }
    if (hasRequested(dept.name)) {
      notify("Duplicate Request", "You already have a pending request for this ministry.", "info");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await API.departments.submitInterest({
        id: Math.random().toString(36).substr(2, 9),
        departmentId: dept.id,
        departmentName: dept.name,
        userId: currentUser.id,
        fullName: currentUser.fullName,
        email: currentUser.email,
        phone: currentUser.phone || '',
        diocese: currentUser.diocese || 'Unknown',
        level: currentUser.level || 'Unknown',
        program: currentUser.program || 'Unknown',
        motivation,
        experience,
        status: 'Pending',
        date: new Date().toISOString()
      } as any);
      notify("Protocol Initiated", `Your placement application for ${dept.name} has been securely transmitted to the leadership.`, "success");
      onRefresh();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      notify("Transmission Error", "Failed to submit request.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black font-serif italic text-black tracking-tight mb-2">Ministry Manifest</h2>
          <p className="text-[9px] font-black uppercase text-black/30 tracking-[0.3em]">Discover, apply, and serve in a department</p>
        </div>
        <button onClick={() => openPlacementForm()} className="px-8 py-4 bg-black text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl hover:bg-secondary transition-all active:scale-95 flex items-center gap-3">
          <PlusCircle size={16}/> Initiate Placement
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Current Status Overview */}
        <div className="xl:col-span-4 space-y-6">
           <div className="bg-secondary p-10 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Briefcase size={120}/></div>
              <div className="relative z-10 space-y-6">
                <div>
                  <p className="text-[9px] font-black text-accent uppercase tracking-widest mb-1">Your Active Assignments</p>
                  <div className="flex flex-wrap gap-3 mt-3">
                     {currentUser.department ? currentUser.department.split(',').map((d, i) => (
                        <div key={i} className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-[1rem] shadow-sm border border-white/20">
                           <CheckCircle2 size={16} className="text-accent"/>
                           <span className="font-black font-serif italic text-xl leading-none">{d.trim()}</span>
                        </div>
                     )) : (
                        <h4 className="text-4xl font-black font-serif italic leading-tight">General Assembly</h4>
                     )}
                  </div>
                </div>
                {!currentUser.department && (
                  <p className="text-[11px] font-medium text-white/70 leading-relaxed italic border-t border-white/10 pt-4">
                    "Each one should use whatever gift he has received to serve others, faithfully administering God's grace in its various forms."
                  </p>
                )}
              </div>
           </div>

           {/* Pending Requests */}
           {pendingRequests.filter(r => (r as any).userId === currentUser.id && r.status === 'Pending').length > 0 && (
             <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                <h4 className="text-[10px] font-black text-black/40 uppercase tracking-widest mb-6">Pending Assignments</h4>
                <div className="space-y-4">
                   {pendingRequests.filter(r => (r as any).userId === currentUser.id && r.status === 'Pending').map(req => (
                     <div key={req.id} className="p-5 bg-gray-50 rounded-3xl flex items-center justify-between border border-gray-100 transition-all hover:bg-amber-50/50">
                        <div>
                          <p className="text-sm font-black text-black mb-1">{req.departmentName}</p>
                          <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest animate-pulse">Under Review</p>
                        </div>
                        <div className="w-10 h-10 rounded-[1rem] bg-white text-black/20 flex items-center justify-center shadow-sm"><Users size={16}/></div>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>

        {/* Directory Grid */}
        <div className="xl:col-span-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments.map((dept, idx) => (
                <motion.div 
                  key={dept.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-[3rem] border border-gray-100 p-8 shadow-sm flex flex-col justify-between group hover:border-secondary hover:shadow-xl transition-all"
                >
                   <div className="space-y-6 mb-10">
                      <div className="flex justify-between items-start">
                         <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all text-black/30 shadow-sm"><Users size={24}/></div>
                         <div className="flex flex-col gap-2 items-end">
                           {isAlreadyMember(dept.name) && (
                             <span className="px-3 py-1.5 bg-accent/20 border border-accent/20 text-accent rounded-xl text-[8px] font-black uppercase tracking-widest shadow-sm">Stationed</span>
                           )}
                           {(hasRequested(dept.name) && !isAlreadyMember(dept.name)) && (
                             <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-sm">Requested</span>
                           )}
                         </div>
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-black leading-tight group-hover:text-secondary transition-colors mb-4">{dept.name}</h4>
                        <p className="text-sm text-black/50 line-clamp-3 leading-relaxed">"{dept.description}"</p>
                      </div>
                   </div>

                   <button 
                    onClick={() => openPlacementForm(dept.id)}
                    disabled={hasRequested(dept.name) || currentUser.department === dept.name}
                    className="w-full flex items-center justify-between px-6 py-5 bg-gray-50 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-black/50 group-hover:bg-black group-hover:text-white transition-all disabled:opacity-40 disabled:group-hover:bg-gray-50 disabled:group-hover:text-black/50 shadow-sm"
                   >
                      {currentUser.department === dept.name ? 'Presently Enlisted' : hasRequested(dept.name) ? 'Review Pending' : 'Request Placement'}
                      <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
                   </button>
                </motion.div>
              ))}
           </div>
        </div>

      </div>

      {/* Interactive Modal Form */}
      <AnimatePresence>
         {showModal && (
            <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[3.5rem] shadow-2xl flex flex-col">
                 
                 <div className="p-10 md:p-12 border-b border-gray-50 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-xl z-20 rounded-t-[3.5rem]">
                     <div className="space-y-1">
                        <h2 className="text-4xl font-black font-serif italic text-black leading-none">Placement Protocol</h2>
                        <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.4em] mt-2">Ministry Application Form</p>
                     </div>
                     <button onClick={() => setShowModal(false)} className="p-4 bg-gray-50 rounded-[1.5rem] hover:bg-red-50 hover:text-red-500 transition-all text-black/40 shadow-sm"><X size={28}/></button>
                 </div>
                 
                 <div className="px-10 md:px-12 py-8 overflow-y-auto space-y-10 custom-scrollbar flex-1">
                     {/* Dynamic Identity Pull */}
                     <div className="bg-secondary/5 p-8 rounded-[2.5rem] border border-secondary/10 flex items-start gap-6 shadow-inner">
                        <div className="w-16 h-16 bg-secondary text-white rounded-[1.5rem] flex items-center justify-center font-black text-xl shadow-xl shrink-0">{currentUser.fullName.charAt(0)}</div>
                        <div className="space-y-3 flex-1">
                           <h4 className="text-2xl font-black text-black leading-tight shadow-sm">{currentUser.fullName}</h4>
                           <div className="flex flex-wrap gap-2">
                             <span className="px-3 py-1.5 bg-white rounded-xl text-[9px] font-black uppercase tracking-widest text-black/60 shadow-sm">{currentUser.diocese} Diocese</span>
                             <span className="px-3 py-1.5 bg-white rounded-xl text-[9px] font-black uppercase tracking-widest text-black/60 shadow-sm">{currentUser.program}</span>
                             <span className="px-3 py-1.5 bg-white rounded-xl text-[9px] font-black uppercase tracking-widest text-black/60 shadow-sm">Level {currentUser.level}</span>
                           </div>
                           <p className="text-xs font-bold text-black/40 italic">* Demographic identity is automatically bonded to this application.</p>
                        </div>
                     </div>
                     
                     <div className="space-y-4">
                       <label className="text-[10px] font-black text-black uppercase tracking-widest flex items-center gap-2"><Briefcase size={12}/> Select Target Ministry</label>
                       <select value={formDeptId} onChange={e => setFormDeptId(e.target.value)} className="w-full bg-gray-50 text-black border-2 border-gray-100 rounded-[2rem] p-6 outline-none focus:border-secondary focus:bg-white font-black text-sm transition-all appearance-none cursor-pointer shadow-inner">
                          <option value="">-- Choose an Assignment --</option>
                          {departments.map(d => {
                            const isRequested = hasRequested(d.name);
                            const isActive = currentUser.department === d.name;
                            return (
                              <option key={d.id} value={d.id} disabled={isRequested || isActive}>
                                {d.name} {isRequested ? '(Under Review)' : isActive ? '(Currently Active)' : ''}
                              </option>
                            );
                          })}
                       </select>
                     </div>

                     <div className="space-y-4">
                       <label className="text-[10px] font-black text-black uppercase tracking-widest">Ministry Motivation</label>
                       <textarea rows={4} placeholder="Why are you feeling called to join this specific ministry?" value={motivation} onChange={e => setMotivation(e.target.value)} className="w-full bg-gray-50 text-black placeholder-black/20 border-2 border-gray-100 rounded-[2rem] p-6 outline-none focus:border-secondary focus:bg-white font-medium text-sm transition-all resize-none shadow-inner" />
                     </div>
                     
                     <div className="space-y-4">
                       <label className="text-[10px] font-black text-black uppercase tracking-widest">Relevant Experience & Spiritual Gifts</label>
                       <textarea rows={4} placeholder="What skills, experiences, or spiritual gifts do you currently possess?" value={experience} onChange={e => setExperience(e.target.value)} className="w-full bg-gray-50 text-black placeholder-black/20 border-2 border-gray-100 rounded-[2rem] p-6 outline-none focus:border-secondary focus:bg-white font-medium text-sm transition-all resize-none shadow-inner" />
                     </div>
                 </div>

                 <div className="p-8 md:p-10 bg-gray-50 border-t border-gray-100 flex justify-end gap-6 shrink-0 rounded-b-[3.5rem]">
                     <button onClick={() => setShowModal(false)} className="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-black/40 hover:text-black hover:bg-gray-100 rounded-[2rem] transition-colors">Abort Sequence</button>
                     <button disabled={isSubmitting || !formDeptId || !motivation.trim() || !experience.trim()} onClick={submitApplication} className="px-12 py-5 bg-secondary text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-[2rem] shadow-xl hover:bg-black transition-colors disabled:opacity-30 disabled:hover:scale-100 flex items-center gap-4 hover:scale-105 active:scale-95">
                       {isSubmitting ? <Loader2 size={18} className="animate-spin"/> : <Send size={18}/>} Transmit Form
                     </button>
                 </div>

              </motion.div>
            </div>
         )}
       </AnimatePresence>

    </div>
  );
};

export default MemberMinistriesTab;
