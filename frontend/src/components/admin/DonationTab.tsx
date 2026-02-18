
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Handshake, Plus, Trash2, DollarSign, Calendar, 
  Filter, Search, BarChart3, TrendingUp, Layers, 
  CheckCircle2, AlertCircle, Edit, X, Camera, 
  Upload, Loader2, Save, ShieldAlert, Wallet, 
  ArrowUpRight, PiggyBank, Target
} from 'lucide-react';
import { API } from '../../services/api';
import { Donation, DonationProject, User } from '../../types';

interface DonationTabProps {
  user: User;
}

const DonationTab: React.FC<DonationTabProps> = ({ user }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  // Permission Logic
  const isIT = user.role === 'it';
  const isAccountant = user.role === 'accountant';
  
  // Accountants are the only ones allowed to verify pending transactions.
  const canVerify = isAccountant;
  
  // Only IT can purge financial records for security/compliance.
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
    
    return {
      verified,
      pending,
      total: verified + pending,
      globalGoal, globalRaised,
      fundingPercentage: globalGoal > 0 ? (globalRaised / globalGoal) * 100 : 0
    };
  }, [donations, projects]);

  const filteredDonations = donations.filter(d => {
    const matchesFilter = filter === 'All' || d.status === filter;
    const matchesSearch = (d.donorName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (d.transactionId || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleConfirmDonation = async (donation: Donation) => {
    if (!canVerify) {
      alert("Unauthorized: Only the official Financial Steward (Accountant) can verify transactions.");
      return;
    }
    if (!window.confirm(`Finalize verification for deposit of ${donation.amount.toLocaleString()} RWF?`)) return;
    
    setIsSyncing(donation.id);
    try {
      await API.donations.updateStatus(donation.id, 'Completed');
      await fetchData();
    } catch (err) {
      console.error("Verification failed:", err);
      alert("Stewardship synchronization error. Please check Kernel health.");
    } finally {
      setIsSyncing(null);
    }
  };

  const handleDeleteDonation = async (id: string) => {
    if (!canDelete) {
      alert("Unauthorized: Financial record deletion is restricted to IT security protocols.");
      return;
    }
    if (!window.confirm('CRITICAL: Purge this record from the ledger permanently?')) return;
    try {
      await API.donations.delete(id);
      await fetchData();
    } catch (err) {
      console.error("Purge failed:", err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { id: 'total', label: 'Total Recorded Flow', value: `${stats.total.toLocaleString()} RWF`, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
          { id: 'verified', label: 'Verified Treasury', value: `${stats.verified.toLocaleString()} RWF`, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { id: 'pending', label: 'Unconfirmed Pulse', value: `${stats.pending.toLocaleString()} RWF`, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
          { id: 'target', label: 'Ministry Target', value: `${stats.globalGoal.toLocaleString()} RWF`, icon: Target, color: 'text-cyan-600', bg: 'bg-cyan-50' },
        ].map((item) => (
          <div key={`stat-card-${item.id}`} className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className={`p-4 w-fit rounded-2xl ${item.bg} ${item.color} mb-4`}><item.icon size={22} /></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
            <p className="text-2xl font-black text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1">
             <h3 className="text-2xl font-black font-serif italic text-gray-900">Mission Ledger</h3>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Financial Synchronization</p>
          </div>
          <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            {['All', 'Completed', 'Pending'].map(f => (
              <button key={`filter-${f}`} onClick={() => setFilter(f)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-100' : 'text-gray-400 hover:text-cyan-600'}`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-8 py-5">Steward/Identity</th>
                <th className="px-8 py-5">Magnitude</th>
                <th className="px-8 py-5">Verification</th>
                <th className="px-8 py-5 text-right">Sequences</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDonations.map((d, i) => (
                <tr key={`donation-row-${d.id || i}`} className="group hover:bg-cyan-50/10 transition-all">
                  <td className="px-8 py-4">
                    <p className="text-sm font-black text-gray-900">{d.donorName}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{d.transactionId}</p>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-sm font-black text-cyan-600">{d.amount.toLocaleString()} RWF</p>
                    <p className="text-[9px] text-gray-400 uppercase font-bold">{d.project || 'Global Fund'}</p>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${d.status === 'Completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'}`}>{d.status}</span>
                  </td>
                  <td className="px-8 py-4 text-right space-x-2">
                    {d.status === 'Pending' && (
                      canVerify ? (
                        <button 
                          onClick={() => handleConfirmDonation(d)} 
                          disabled={isSyncing === d.id}
                          className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase shadow-lg shadow-emerald-100 active:scale-95 transition-all hover:bg-emerald-600 flex items-center gap-2"
                        >
                          {isSyncing === d.id ? <Loader2 className="animate-spin" size={10}/> : null}
                          Finalize Pulse
                        </button>
                      ) : (
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">Awaiting Accountant</span>
                      )
                    )}
                    {canDelete && (
                      <button onClick={() => handleDeleteDonation(d.id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16}/></button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredDonations.length === 0 && !loading && (
                <tr key="no-data">
                  <td colSpan={4} className="py-32 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200 mb-4"><Heart size={32} /></div>
                    <p className="text-gray-300 italic font-serif">No contribution sequences logged in this layer.</p>
                  </td>
                </tr>
              )}
              {loading && (
                <tr key="loading">
                  <td colSpan={4} className="py-20 text-center">
                    <Loader2 className="animate-spin text-cyan-500 mx-auto" size={32} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {!canVerify && !isIT && (
        <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
           <ShieldAlert className="text-amber-500 shrink-0" size={20} />
           <div className="space-y-1">
             <p className="text-xs font-black text-amber-900 uppercase">Read-Only Financial Mode</p>
             <p className="text-[10px] text-amber-700 font-medium leading-relaxed">Your security clearance allows visibility of the ledger, but verification and purging sequences are restricted to Accountant and IT personnel respectively.</p>
           </div>
        </div>
      )}
    </motion.div>
  );
};

export default DonationTab;
