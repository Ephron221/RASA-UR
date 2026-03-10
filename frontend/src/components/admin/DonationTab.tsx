import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Trash2, CheckCircle2, AlertCircle, X,
  Loader2, Wallet, Target, Eye, FileText, Download, ShieldCheck, Lock
} from 'lucide-react';
import { API } from '../../services/api';
import { Donation, DonationProject, User } from '../../types';

interface DonationTabProps {
  user: User;
  canVerify?: boolean;
}

const DonationTab: React.FC<DonationTabProps> = ({ user, canVerify = false }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  // --- STRICT PERMISSION PROTOCOL ---
  const isIT = user.role === 'it';

  // They can see the proof if they are IT, or if their role gives them verify_donations permission
  const canSeeProof = canVerify || isIT;
  const canDelete = isIT;

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

  const handleConfirmDonation = async (donation: Donation) => {
    if (!canVerify) return;
    if (!window.confirm(`STRICT ACCOUNTING: Finalize verification for contribution of ${donation.amount.toLocaleString()} RWF?`)) return;

    setIsSyncing(donation.id);
    try {
      await API.donations.updateStatus(donation.id, 'Completed');
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(null);
    }
  };

  const handleRejectDonation = async (donation: Donation) => {
    if (!canVerify) return;
    if (!window.confirm(`STRICT ACCOUNTING: REJECT contribution of ${donation.amount.toLocaleString()} RWF?`)) return;

    setIsSyncing(donation.id);
    try {
      await API.donations.updateStatus(donation.id, 'Rejected');
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(null);
    }
  };

  const isPDF = (url: string) => url.startsWith('data:application/pdf') || url.toLowerCase().endsWith('.pdf');

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
          <div key={item.id} className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className={`p-4 w-fit rounded-2xl ${item.bg} ${item.color} mb-4`}><item.icon size={22} /></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
            <p className="text-2xl font-black text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-black font-serif italic text-gray-900">Mission Ledger</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Financial Synchronization</p>
          </div>
          <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            {['All', 'Completed', 'Pending', 'Rejected'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-100' : 'text-gray-400 hover:text-cyan-600'}`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-8 py-5">Steward/Identity</th>
                <th className="px-8 py-5">Magnitude</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Evidence</th>
                <th className="px-8 py-5 text-right whitespace-nowrap">Sequences / Confirmation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDonations.map((d) => (
                <tr key={d.id} className="group hover:bg-cyan-50/10 transition-all">
                  <td className="px-8 py-4">
                    <p className="text-sm font-black text-gray-900">{d.donorName}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{d.transactionId}</p>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-sm font-black text-cyan-600">{d.amount.toLocaleString()} RWF</p>
                    <p className="text-[9px] text-gray-400 uppercase font-bold">{d.project || 'Global Fund'}</p>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${d.status === 'Completed' ? 'bg-emerald-50 text-emerald-500' :
                        d.status === 'Rejected' ? 'bg-red-50 text-red-500' :
                          'bg-orange-50 text-orange-500'
                        }`}>{d.status}</span>
                      {d.status === 'Completed' && <ShieldCheck size={14} className="text-emerald-500" />}
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    {d.paymentProof ? (
                      canSeeProof ? (
                        <button
                          onClick={() => setSelectedProof(d.paymentProof!)}
                          className="flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-cyan-600 hover:text-white transition-all shadow-sm active:scale-95"
                        >
                          <Eye size={12} /> View Proof
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Lock size={12} /> <span className="text-[9px] font-black uppercase italic">Secured</span>
                        </div>
                      )
                    ) : (
                      <span className="text-[9px] font-bold text-gray-300 italic uppercase tracking-tighter">None Attached</span>
                    )}
                  </td>
                  <td className="px-8 py-4 text-right space-x-2 whitespace-nowrap">
                    {d.status === 'Pending' && (
                      canVerify ? (
                        <>
                          <button
                            onClick={() => handleConfirmDonation(d)}
                            disabled={isSyncing === d.id}
                            className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all active:scale-95 inline-flex items-center gap-2 mr-2"
                          >
                            {isSyncing === d.id ? <Loader2 className="animate-spin" size={10} /> : null}
                            Finalize Pulse
                          </button>
                          <button
                            onClick={() => handleRejectDonation(d)}
                            disabled={isSyncing === d.id}
                            className="px-4 py-2.5 bg-red-50 text-red-500 border border-red-100 rounded-xl text-[9px] font-black uppercase hover:bg-red-500 hover:text-white transition-all active:scale-95 inline-flex items-center gap-2 inline-flex"
                          >
                            <X size={14} /> Reject
                          </button>
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 rounded-xl text-[9px] font-black uppercase tracking-widest italic border border-gray-100">
                          <AlertCircle size={10} /> Pending Accountant
                        </span>
                      )
                    )}
                    {canDelete && (
                      <button onClick={() => fetchData()} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm group-hover:scale-110"><Trash2 size={16} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Preview Modal */}
      <AnimatePresence>
        {selectedProof && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative max-w-5xl w-full bg-white rounded-[3rem] overflow-hidden shadow-4xl p-2">
              <button onClick={() => setSelectedProof(null)} className="absolute top-8 right-8 p-4 bg-black/20 hover:bg-red-500 text-white rounded-full z-10 transition-all shadow-xl"><X size={24} /></button>
              <div className="p-10 text-center">
                <div className="flex items-center justify-center gap-4 mb-8 border-b border-gray-100 pb-6">
                  <FileText size={32} className="text-cyan-500" />
                  <div className="text-left">
                    <h4 className="text-2xl font-black font-serif italic text-gray-900 uppercase">Contribution Witness</h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Stewardship Verification Protocol</p>
                  </div>
                </div>
                <div className="rounded-[2.5rem] overflow-hidden border-8 border-gray-50 bg-gray-50 flex items-center justify-center min-h-[500px]">
                  {isPDF(selectedProof) ? (
                    <iframe
                      src={selectedProof}
                      className="w-full h-[70vh] rounded-2xl"
                      title="Contribution Document"
                    />
                  ) : (
                    <img src={selectedProof} alt="Bank Slip Proof" className="max-w-full max-h-[70vh] object-contain shadow-sm" />
                  )}
                </div>
                <div className="mt-8 flex justify-center gap-4">
                  <a href={selectedProof} download={isPDF(selectedProof) ? "payment-proof.pdf" : "payment-proof.png"} className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-cyan-500 transition-all shadow-lg"><Download size={14} /> Save Witness</a>
                  <button onClick={() => setSelectedProof(null)} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">Close Projection</button>
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
