import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
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
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  
  // Track if user already requested this department
  const hasRequested = (deptName: string) => {
    return pendingRequests.some(r => r.userId === currentUser.id && r.departmentName === deptName);
  };

  const handleJoinRequest = async (dept: Department) => {
    if (hasRequested(dept.name)) {
      notify("Duplicate Request", "You already have a pending request for this ministry.", "info");
      return;
    }

    try {
      await API.departments.submitInterest({
        id: Math.random().toString(36).substr(2, 9),
        departmentId: dept.id,
        departmentName: dept.name,
        userId: currentUser.id,
        fullName: currentUser.fullName,
        email: currentUser.email,
        phone: currentUser.phone || '',
        status: 'Pending',
        submittedAt: new Date().toISOString()
      });
      notify("Protocol Initiated", `Your request to join ${dept.name} has been sent to the leaders.`, "success");
      onRefresh();
    } catch (err) {
      console.error(err);
      notify("Transmission Error", "Failed to submit request.", "error");
    }
  };

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black font-serif italic text-black tracking-tight mb-2">Ministry Manifest</h2>
          <p className="text-[9px] font-black uppercase text-black/30 tracking-[0.3em]">Discover and serve in a department</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Current Status */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-secondary p-10 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Briefcase size={120}/></div>
              <div className="relative z-10 space-y-6">
                <div>
                  <p className="text-[9px] font-black text-accent uppercase tracking-widest mb-1">Your Active Assignment</p>
                  <h4 className="text-3xl font-black font-serif italic leading-tight">{currentUser.department || 'General Assembly'}</h4>
                </div>
                {currentUser.department && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                     <CheckCircle2 size={14} className="text-accent"/> Officially Stationed
                  </div>
                )}
                {!currentUser.department && (
                  <p className="text-[11px] font-medium text-white/70 leading-relaxed italic">
                    "Each one should use whatever gift he has received to serve others, faithfully administering God's grace in its various forms."
                  </p>
                )}
              </div>
           </div>

           {/* Pending Requests List */}
           {pendingRequests.filter(r => r.userId === currentUser.id && r.status === 'Pending').length > 0 && (
             <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                <h4 className="text-[10px] font-black text-black/40 uppercase tracking-widest mb-6">Pending Assignments</h4>
                <div className="space-y-4">
                   {pendingRequests.filter(r => r.userId === currentUser.id && r.status === 'Pending').map(req => (
                     <div key={req.id} className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100">
                        <div>
                          <p className="text-xs font-black text-black">{req.departmentName}</p>
                          <p className="text-[9px] font-bold text-secondary uppercase tracking-widest">Under Review</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center animate-pulse"><Users size={12}/></div>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>

        {/* Directory */}
        <div className="lg:col-span-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments.map((dept, idx) => (
                <motion.div 
                  key={dept.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm flex flex-col justify-between group hover:border-secondary hover:shadow-xl transition-all"
                >
                   <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-start">
                         <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all text-black/30"><Users size={20}/></div>
                         {hasRequested(dept.name) && (
                           <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Requested</span>
                         )}
                         {currentUser.department === dept.name && (
                           <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-lg text-[9px] font-black uppercase tracking-widest">Active</span>
                         )}
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-black leading-tight group-hover:text-secondary transition-colors mb-2">{dept.name}</h4>
                        <p className="text-sm text-black/50 line-clamp-2 leading-relaxed">"{dept.description}"</p>
                      </div>
                   </div>

                   <button 
                    onClick={() => handleJoinRequest(dept)}
                    disabled={hasRequested(dept.name) || currentUser.department === dept.name}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-black/50 group-hover:bg-black group-hover:text-white transition-all disabled:opacity-40 disabled:group-hover:bg-gray-50 disabled:group-hover:text-black/50"
                   >
                      {currentUser.department === dept.name ? 'Already Enlisted' : hasRequested(dept.name) ? 'Review Pending' : 'Request Placement'}
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </motion.div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default MemberMinistriesTab;
