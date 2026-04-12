import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Trash2, CheckCircle2, AlertCircle, X,
  Loader2, Wallet, Target, Eye, FileText, Download, ShieldCheck, Lock,
  Calendar as CalendarIcon, User as UserIcon, CheckCircle, XCircle, ZoomIn, Maximize2,
  RefreshCw, ShieldAlert
} from 'lucide-react';
import { API } from '../../services/api';
import { Donation, DonationProject, User } from '../../types';
import { useNotification } from '../../contexts/NotificationContext';

interface DonationTabProps {
  user: User;
  canVerify?: boolean;
  isIT?: boolean;
  isEXCOM?: boolean;
}

const DonationTab: React.FC<DonationTabProps> = ({ user, canVerify = false, isIT = false, isEXCOM = false }) => {
  const { notify } = useNotification();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  // --- STRICT PERMISSION PROTOCOL ---
  // The permissions and roles are safely computed by AdminDashboard using Clearance logic
  const canSeeProof = canVerify || isIT || isEXCOM;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [d, p] = await Promise.all([
        API.donations.getAll(),
        API.donations.projects.getAll()
      ]);
      setDonations(d || []);
      setProjects(p || []);
    } catch (err) {
      console.error("Ledger retrieval error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const verified = donations.filter(d => d.status === 'Completed').reduce((acc, curr) => acc + curr.amount, 0);
    const pending = donations.filter(d => d.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
    const activeProjects = projects.filter(p => p.isActive);
    const globalGoal = activeProjects.reduce((acc, curr) => acc + curr.goal, 0);
    const globalRaised = activeProjects.reduce((acc, curr) => acc + curr.raised, 0);

    return { verified, pending, total: verified + pending, globalGoal, globalRaised };
  }, [donations, projects]);

  const filteredDonations = donations.filter(d => {
    const matchesFilter = filter === 'All' || d.status === filter;
    const matchesSearch = (d.donorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.transactionId || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleUpdateStatus = async (donationId: string, newStatus: string, actionLabel: string) => {
    setIsSyncing(donationId);
    try {
      await API.donations.updateStatus(donationId, newStatus);
      await fetchData();
      if (selectedDonation?.id === donationId) setSelectedDonation(null);
      notify(`${actionLabel} Sequence`, `Contribution protocol has been updated.`, "success");
    } catch (err) {
      notify("Protocol Error", "Failed to update stewardship record.", "error");
    } finally {
      setIsSyncing(null);
    }
  };

  const handleITDeleteRequest = async (donation: Donation) => {
    if (!isIT) return;
    if (!window.confirm(`ARCHIVAL PURGE: Request Accountant to confirm permanent removal of ${donation.donorName}'s sequence?`)) return;
    
    handleUpdateStatus(donation.id, 'DeletionPending', 'Purge Request');
  };

  const handleConfirmPurge = async (donation: Donation) => {
    if (!canVerify || isIT) return; // IT cannot confirm deletion, only accountants can
    if (!window.confirm(`FINAL PURGE: Permanently delete this contribution from the Divine Registry? This action is irreversible.`)) return;

    setIsSyncing(donation.id);
    try {
      console.log('[PURGE] Attempting delete for donation ID:', donation.id);
      await API.donations.delete(donation.id);
      console.log('[PURGE] Delete successful, refreshing data...');
      await fetchData();
      setSelectedDonation(null);
      notify("Archive Cleansed", "Contribution record has been permanently removed.", "divine");
    } catch (err: any) {
      const msg = err?.error || err?.message || JSON.stringify(err);
      console.error('[PURGE] Delete failed:', msg, err);
      notify("Purge Error", `Failed: ${msg}`, "error");
    } finally {
      setIsSyncing(null);
    }
  };

  const handleRejectPurge = async (donation: Donation) => {
    if (!canVerify) return;
    if (!window.confirm(`REJECT PURGE: Restore ${donation.donorName}'s record back to Completed status? The deletion request will be cancelled.`)) return;

    handleUpdateStatus(donation.id, 'Completed', 'Purge Rejected — Restored');
    if (selectedDonation?.id === donation.id) setSelectedDonation(null);
  };

  const isPDF = (url: string) => url?.startsWith('data:application/pdf') || url?.toLowerCase().endsWith('.pdf');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-20">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { id: 'total', label: 'Total Recorded Flow', value: `${stats.total.toLocaleString()} RWF`, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
          { id: 'verified', label: 'Verified Treasury', value: `${stats.verified.toLocaleString()} RWF`, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { id: 'pending', label: 'Unconfirmed Pulse', value: `${stats.pending.toLocaleString()} RWF`, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
          { id: 'target', label: 'Ministry Target', value: `${stats.globalGoal.toLocaleString()} RWF`, icon: Target, color: 'text-cyan-600', bg: 'bg-cyan-50' },
        ].map((item) => (
          <div key={item.id} className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
            <div className={`p-4 w-fit rounded-2xl ${item.bg} ${item.color} mb-4`}><item.icon size={22} /></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
            <p className="text-2xl font-black text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-6 md:p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gray-50/30">
          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-black font-serif italic text-gray-900 leading-none">
              Mission Ledger
            </h3>
            <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em]">Global Financial Synchronization</p>
          </div>
          <div className="flex flex-wrap gap-2 bg-white p-2 rounded-[1.5rem] border border-gray-100 shadow-inner w-full md:w-auto">
            {['All', 'Completed', 'Pending', 'Rejected', 'DeletionPending'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`flex-1 md:flex-none px-2 md:px-6 py-2 md:py-2.5 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-secondary text-white shadow-xl' : 'text-gray-400 hover:text-secondary'}`}>{f === 'DeletionPending' ? 'Purge' : f}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black text-black/40 uppercase tracking-[0.2em] border-b border-gray-100">
                <th className="px-6 md:px-10 py-5 md:py-6">Steward/Identity</th>
                <th className="px-6 md:px-10 py-5 md:py-6">Magnitude</th>
                <th className="px-6 md:px-10 py-5 md:py-6">Status</th>
                <th className="px-6 md:px-10 py-5 md:py-6">Evidence</th>
                {!isEXCOM && <th className="px-6 md:px-10 py-5 md:py-6 text-right whitespace-nowrap">Confirmation Sequences</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDonations.map((d) => (
                <tr key={d.id} className="group hover:bg-secondary/5 transition-all">
                  <td className="px-6 md:px-10 py-4 md:py-5">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-secondary shadow-inner shrink-0"><UserIcon size={18} /></div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-gray-900 uppercase tracking-tight truncate">{d.donorName}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest truncate">{d.transactionId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 md:px-10 py-4 md:py-5">
                    <p className="text-sm font-black text-secondary">{d.amount.toLocaleString()} {d.currency}</p>
                    <p className="text-[9px] text-black/30 uppercase font-black tracking-tighter">{d.project || 'Global Stewardship'}</p>
                  </td>
                  <td className="px-6 md:px-10 py-4 md:py-5">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${
                      d.status === 'Completed' ? 'bg-emerald-500 text-white' :
                      d.status === 'Rejected' ? 'bg-red-500 text-white' :
                      d.status === 'DeletionPending' ? 'bg-black text-white' :
                      'bg-amber-500 text-white animate-pulse'
                    }`}>{d.status === 'DeletionPending' ? 'Pending Purge' : d.status}</span>
                  </td>
                  <td className="px-6 md:px-10 py-4 md:py-5">
                    {d.paymentProof ? (
                      canSeeProof ? (
                        <button
                          onClick={() => setSelectedDonation(d)}
                          className="flex items-center gap-3 px-5 py-2.5 bg-secondary/10 text-secondary rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-secondary hover:text-white transition-all shadow-sm active:scale-95 group/btn"
                        >
                          <Eye size={12} className="group-hover/btn:scale-125 transition-transform" /> Witness Proof
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Lock size={12} /> <span className="text-[9px] font-black uppercase italic tracking-widest">Secured</span>
                        </div>
                      )
                    ) : (
                      <span className="text-[9px] font-bold text-gray-300 italic uppercase tracking-tighter">No Evidence</span>
                    )}
                  </td>
                  {!isEXCOM && <td className="px-6 md:px-10 py-4 md:py-5 text-right space-x-2 whitespace-nowrap">
                    {/* --- Pending Purge actions: ALWAYS VISIBLE for authorized roles --- */}
                    {d.status === 'DeletionPending' && canVerify && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleRejectPurge(d)}
                          disabled={!!isSyncing}
                          className="px-4 py-2 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl text-[9px] font-black uppercase flex items-center gap-2 hover:bg-amber-500 hover:text-white hover:border-transparent transition-all shadow-sm"
                          title="Reject deletion — restore to Completed"
                        >
                          {isSyncing === d.id ? <RefreshCw className="animate-spin" size={12} /> : <ShieldAlert size={12} />} Reject
                        </button>
                        {!isIT && (
                          <button
                            onClick={() => handleConfirmPurge(d)}
                            disabled={!!isSyncing}
                            className="px-4 py-2 bg-black text-white rounded-xl text-[9px] font-black uppercase flex items-center gap-2 hover:bg-red-600 transition-all shadow-xl"
                            title="Confirm permanent deletion"
                          >
                            {isSyncing === d.id ? <RefreshCw className="animate-spin" size={12} /> : <Trash2 size={12} />} Confirm Purge
                          </button>
                        )}
                      </div>
                    )}

                    {/* --- Hover-revealed actions for Pending/IT --- */}
                    <div className="opacity-0 group-hover:opacity-100 transition-all flex justify-end gap-2 translate-x-4 group-hover:translate-x-0">
                      {d.status === 'Pending' && canVerify && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(d.id, 'Completed', 'Verify')}
                            disabled={!!isSyncing}
                            className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg hover:bg-emerald-600 transition-all"
                            title="Verify Sequence"
                          >
                            {isSyncing === d.id ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(d.id, 'Rejected', 'Reject')}
                            disabled={!!isSyncing}
                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 transition-all"
                            title="Reject Entry"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}

                      {d.status !== 'DeletionPending' && isIT && (
                        <button 
                          onClick={() => handleITDeleteRequest(d)}
                          disabled={!!isSyncing}
                          className="p-3 bg-black text-white rounded-xl hover:bg-red-600 transition-all shadow-lg active:scale-95" 
                          title="Initiate Purge Sequence"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Interactive Proof Preview Modal */}
      <AnimatePresence>
        {selectedDonation && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 30 }} 
              className="relative max-w-6xl w-full bg-white rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row h-[90vh] md:h-[80vh] max-h-[90vh]"
            >
              {/* Sidebar Info - Modal */}
              <div className="w-full md:w-80 bg-gray-50/80 p-6 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100 overflow-y-auto shrink-0">
                <div className="space-y-6 md:space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-secondary/20"><FileText size={28} /></div>
                    <div>
                      <h4 className="text-xl font-black font-serif italic text-black leading-tight">Contribution Witness</h4>
                      <p className="text-[8px] font-black text-black/30 uppercase tracking-[0.3em]">Protocol v3.0</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-black/20 uppercase tracking-widest ml-1">Identity</p>
                      <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-sm font-black text-black uppercase tracking-tight">{selectedDonation.donorName}</p>
                        <p className="text-[10px] text-secondary font-bold truncate mt-1">{selectedDonation.email}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-black/20 uppercase tracking-widest ml-1">Contribution</p>
                      <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-2xl font-black text-secondary leading-none mb-1">{selectedDonation.amount.toLocaleString()} <span className="text-[10px] uppercase font-black opacity-40">{selectedDonation.currency}</span></p>
                        <p className="text-[10px] font-bold text-black/40 uppercase tracking-tighter">{selectedDonation.project || 'Global Stewardship'}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-black/20 uppercase tracking-widest ml-1">Temporal Data</p>
                      <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <CalendarIcon size={14} className="text-secondary" />
                        <span className="text-[11px] font-black text-black/60 uppercase">{new Date(selectedDonation.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-10 space-y-3">
                  {selectedDonation.status === 'Pending' && canVerify && (
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => handleUpdateStatus(selectedDonation.id, 'Completed', 'Verify')}
                        className="py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-600 transition-all active:scale-95"
                      >
                        Verify
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(selectedDonation.id, 'Rejected', 'Reject')}
                        className="py-4 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {selectedDonation.status === 'DeletionPending' && canVerify && (
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-black/30 uppercase tracking-widest text-center">Purge Request Awaiting Decision</p>
                      <div className={`grid ${!isIT ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                        <button
                          onClick={() => handleRejectPurge(selectedDonation)}
                          disabled={!!isSyncing}
                          className="py-4 bg-amber-50 text-amber-600 border border-amber-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 hover:text-white hover:border-transparent transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <ShieldAlert size={13} /> Reject
                        </button>
                        {!isIT && (
                          <button
                            onClick={() => handleConfirmPurge(selectedDonation)}
                            disabled={!!isSyncing}
                            className="py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl"
                          >
                            {isSyncing === selectedDonation.id ? <RefreshCw className="animate-spin" size={13} /> : <Trash2 size={13} />} Purge
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <a 
                    href={selectedDonation.paymentProof} 
                    download={`Proof_${selectedDonation.donorName.replace(/\s+/g, '_')}.png`}
                    className="w-full py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-secondary transition-all active:scale-95"
                  >
                    <Download size={14} /> Download Proof
                  </a>
                </div>
              </div>

              {/* Main Content Viewport */}
              <div className="flex-grow bg-[#111] p-2 md:p-8 flex flex-col relative group/viewport">
                <button 
                  onClick={() => setSelectedDonation(null)} 
                  className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-red-500 text-white rounded-2xl z-20 transition-all backdrop-blur-xl border border-white/10"
                >
                  <X size={24} />
                </button>

                <div className="flex-grow flex items-center justify-center rounded-[3rem] overflow-hidden bg-white/5 relative">
                  {isPDF(selectedDonation.paymentProof!) ? (
                    <iframe
                      src={selectedDonation.paymentProof}
                      className="w-full h-full rounded-[2.5rem] border-none"
                      title="Witness Document"
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                      <img 
                        src={selectedDonation.paymentProof} 
                        alt="Stewardship Proof" 
                        className="max-w-full max-h-full object-contain shadow-2xl rounded-xl transition-transform duration-500 hover:scale-110 cursor-zoom-in" 
                      />
                      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-3 text-white/60 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/viewport:opacity-100 transition-opacity">
                        <Maximize2 size={12} /> Interactive Projection Active
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DonationTab;
