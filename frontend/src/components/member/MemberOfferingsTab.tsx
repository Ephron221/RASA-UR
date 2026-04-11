import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Heart, FileText, Upload, X, Loader2, CheckCircle2, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { Donation, DonationProject, User } from '../../types';
import { API } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';

interface MemberOfferingsTabProps {
  currentUser: User;
  userDonations: Donation[];
  projects: DonationProject[];
  onRefresh: () => void;
}

const MemberOfferingsTab: React.FC<MemberOfferingsTabProps> = ({ currentUser, userDonations, projects, onRefresh }) => {
  const { notify } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [amount, setAmount] = useState('1000');
  const [selectedProject, setSelectedProject] = useState<DonationProject | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProofPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(amount) < 500) {
      notify("Minimum Threshold", "The minimum sacrificial offering is 500 RWF.", "info");
      return;
    }

    setIsSubmitting(true);
    const donation: Donation = {
      id: Math.random().toString(36).substr(2, 9),
      donorName: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.phone || '',
      amount: Number(amount),
      currency: 'RWF',
      category: selectedProject ? 'Project-based' : 'One-time',
      project: selectedProject?.title,
      date: new Date().toISOString(),
      status: 'Pending',
      transactionId: `MEM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      paymentProof: proofPreview || undefined
    };

    try {
      await API.donations.create(donation);
      notify("Stewardship Appreciated", "Your offering has been recorded. The treasury will verify it soon.", "divine");
      setAmount('1000');
      setProofPreview(null);
      setSelectedProject(null);
      onRefresh();
    } catch (err) {
      console.error(err);
      notify("Protocol Error", "Failed to sync offering. Please try again later.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
      
      {/* Ledger History */}
      <div className="lg:col-span-7 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
          <div>
            <h2 className="text-3xl font-black font-serif italic text-black tracking-tight mb-2">Personal Ledger</h2>
            <p className="text-[9px] font-black uppercase text-black/30 tracking-[0.3em]">Your Financial Stewardship History</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
               <Wallet size={14}/> {userDonations.filter(d => d.status === 'Completed').reduce((a,b) => a + b.amount, 0).toLocaleString()} RWF Verified
            </span>
          </div>
        </div>

        <div className="bg-white rounded-[3.5rem] border border-gray-100 overflow-hidden shadow-sm">
          {userDonations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-gray-50/50 text-[10px] font-black text-black/40 uppercase tracking-[0.2em] border-b border-gray-100">
                     <th className="px-8 py-6">Date / Identity</th>
                     <th className="px-8 py-6">Magnitude</th>
                     <th className="px-8 py-6">Clearance</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {userDonations.map(d => (
                    <tr key={d.id} className="hover:bg-secondary/5 transition-all">
                       <td className="px-8 py-5">
                          <p className="text-sm font-black text-gray-900 line-clamp-1">{new Date(d.date).toLocaleDateString()}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{d.transactionId}</p>
                       </td>
                       <td className="px-8 py-5">
                          <p className="text-sm font-black text-secondary">{d.amount.toLocaleString()} RWF</p>
                          <p className="text-[9px] font-bold text-black/30 uppercase tracking-widest">{d.project || 'Global Stewardship'}</p>
                       </td>
                       <td className="px-8 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${
                            d.status === 'Completed' ? 'bg-emerald-500 text-white' :
                            d.status === 'Rejected' ? 'bg-red-500 text-white' :
                            d.status === 'DeletionPending' ? 'bg-black text-white' :
                            'bg-amber-500 text-white animate-pulse'
                          }`}>
                            {d.status === 'Completed' && <CheckCircle2 size={12}/>}
                            {d.status === 'Rejected' && <ShieldAlert size={12}/>}
                            {d.status === 'Pending' && <RefreshCw size={12} className="animate-spin"/>}
                            {d.status === 'DeletionPending' ? 'Purge Request' : d.status}
                          </span>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center">
               <Wallet size={48} className="mx-auto text-gray-200 mb-4" />
               <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No Offerings Recorded Yet</p>
               <p className="text-[10px] font-medium text-black/30 mt-2">Submit your first proof of payment to the right.</p>
            </div>
          )}
        </div>
      </div>

      {/* Submit New Offering */}
      <div className="lg:col-span-5">
         <div className="bg-white p-10 md:p-12 rounded-[4.5rem] shadow-3xl border border-gray-100 relative overflow-hidden lg:sticky lg:top-36">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Heart size={100}/></div>
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
               <div className="space-y-2">
                 <h3 className="text-3xl font-black font-serif italic text-black">Submit Offering</h3>
                 <p className="text-[9px] font-black uppercase text-black/40 tracking-widest">Digital Proof System</p>
               </div>

               <div className="space-y-6">
                 {projects.length > 0 && (
                   <div className="space-y-2">
                     <label className="text-[9px] font-black text-black/40 uppercase ml-4">Select Mandate</label>
                     <select 
                       className="w-full px-6 py-4 bg-gray-50 rounded-[1.8rem] outline-none font-bold text-sm text-black border-none focus:ring-2 focus:ring-secondary/20"
                       onChange={(e) => setSelectedProject(projects.find(p => p.id === e.target.value) || null)}
                       value={selectedProject?.id || ''}
                     >
                        <option value="">General Sanctuary Support</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                     </select>
                   </div>
                 )}

                 <div className="space-y-2">
                   <label className="text-[9px] font-black text-black/40 uppercase ml-4">Magnitude (RWF)</label>
                   <input required type="number" min="500" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-6 py-4 bg-gray-50 rounded-[1.8rem] outline-none font-black text-lg text-secondary border-none focus:ring-2 focus:ring-secondary/20" />
                 </div>

                 {/* Minimal Document Upload */}
                 <div className="space-y-3 pt-2">
                    <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-4 flex items-center gap-2"><FileText size={14}/> Support Document</label>
                    <div 
                     onClick={() => fileInputRef.current?.click()}
                     className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-[2.5rem] p-6 cursor-pointer transition-all duration-300 ${proofPreview ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 bg-gray-50/50 hover:bg-white hover:border-secondary/20'}`}
                    >
                       <input type="file" ref={fileInputRef} onChange={handleProofUpload} accept="image/*,.pdf" className="hidden" />
                       {proofPreview ? (
                         <div className="relative group w-full">
                           <img src={proofPreview} className="w-full h-32 object-cover rounded-[1.5rem] shadow-sm" alt="Proof"/>
                           <button type="button" onClick={(e) => {e.stopPropagation(); setProofPreview(null);}} className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full"><X size={12}/></button>
                         </div>
                       ) : (
                         <div className="text-center space-y-2 flex flex-col items-center">
                           <div className="w-10 h-10 bg-white rounded-[1rem] flex items-center justify-center text-secondary shadow-sm"><Upload size={16}/></div>
                           <p className="text-[9px] font-black text-black/40 uppercase tracking-tighter">Attach Bank Slip</p>
                         </div>
                       )}
                    </div>
                 </div>
               </div>

               <button disabled={isSubmitting || Number(amount) < 500} className="w-full py-5 bg-black text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-secondary transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-30">
                 {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <><Sparkles size={16}/> Sync Ledger</>}
               </button>
            </form>
         </div>
      </div>
    </div>
  );
};

export default MemberOfferingsTab;
