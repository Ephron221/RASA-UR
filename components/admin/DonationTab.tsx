
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
  const [isSyncing, setIsSyncing] = useState(false);

  // Permission Logic
  const isIT = user.role === 'it';
  // Restricted: Only the Accountant role can now verify funds.
  // Removal of 'it' and 'admin' from this specific verification logic to ensure accountability.
  const canVerify = user.role === 'accountant';
  const canDelete = isIT;

  const fetchData = async () => {
    setLoading(true);
    const [d, p] = await Promise.all([
      API.donations.getAll(),
      API.donations.projects.getAll()
    ]);
    setDonations(d);
    setProjects(p);
    setLoading(false);
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
      globalGoal,
      globalRaised,
      fundingPercentage: globalGoal > 0 ? (globalRaised / globalGoal) * 100 : 0
    };
  }, [donations, projects]);

  const filteredDonations = donations.filter(d => {
    const matchesFilter = filter === 'All' || d.status === filter;
    const matchesSearch = d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleConfirmDonation = async (donation: Donation) => {
    if (!canVerify) return;
    if (!window.confirm(`Accept deposit of ${donation.amount.toLocaleString()} RWF?`)) return;
    
    setIsSyncing(true);
    await API.donations.updateStatus(donation.id, 'Completed');
    const project = projects.find(p => p.title === donation.project);
    if (project) {
      await API.donations.projects.update(project.id, { raised: project.raised + donation.amount });
    }
    await fetchData();
    setIsSyncing(false);
  };

  const handleDeleteDonation = async (id: string) => {
    if (!canDelete) {
      alert("Unauthorized: Financial records can only be purged by IT.");
      return;
    }
    if (!window.confirm('Purge this record from the ledger?')) return;
    setIsSyncing(true);
    await API.donations.delete(id);
    await fetchData();
    setIsSyncing(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Offering Logs', value: `${stats.total.toLocaleString()} RWF`, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Verified Bank Balance', value: `${stats.verified.toLocaleString()} RWF`, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending Verification', value: `${stats.pending.toLocaleString()} RWF`, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Contribution Target', value: `${stats.globalGoal.toLocaleString()} RWF`, icon: Target, color: 'text-cyan-600', bg: 'bg-cyan-50' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className={`p-4 w-fit rounded-2xl ${item.bg} ${item.color} mb-4`}><item.icon size={22} /></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
            <p className="text-2xl font-black text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <h3 className="text-2xl font-black font-serif italic text-gray-900">Financial Ledger</h3>
          <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl">
            {['All', 'Completed', 'Pending'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-100' : 'text-gray-400 hover:text-cyan-600'}`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-8 py-5">Donor</th>
                <th className="px-8 py-5">Value</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDonations.map(d => (
                <tr key={d.id} className="group hover:bg-gray-50 transition-all">
                  <td className="px-8 py-4">
                    <p className="text-sm font-black text-gray-900">{d.donorName}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{d.transactionId}</p>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-sm font-black text-cyan-600">{d.amount.toLocaleString()} RWF</p>
                    <p className="text-[9px] text-gray-400 uppercase font-bold">{d.project || 'General'}</p>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${d.status === 'Completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'}`}>{d.status}</span>
                  </td>
                  <td className="px-8 py-4 text-right space-x-2">
                    {d.status === 'Pending' && canVerify && (
                      <button onClick={() => handleConfirmDonation(d)} className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase shadow-lg shadow-emerald-100 active:scale-95 transition-all">Accept Funds</button>
                    )}
                    {canDelete && (
                      <button onClick={() => handleDeleteDonation(d.id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredDonations.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-gray-300 italic">No offering sequences recorded in this category.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default DonationTab;
