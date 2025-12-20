
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Handshake, Plus, Trash2, DollarSign, Calendar, Filter, Search, BarChart3, TrendingUp, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { API } from '../../services/api';
import { Donation, DonationProject } from '../../types';

const DonationTab: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      const [d, p] = await Promise.all([
        API.donations.getAll(),
        API.donations.projects.getAll()
      ]);
      setDonations(d);
      setProjects(p);
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalRaised = donations.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      
      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Funds Raised', value: `${totalRaised.toLocaleString()} RWF`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Active Projects', value: projects.filter(p => p.isActive).length, icon: Layers, color: 'text-cyan-600', bg: 'bg-cyan-50' },
          { label: 'Total Donors', value: new Set(donations.map(d => d.email)).size, icon: Handshake, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col gap-4">
            <div className={`p-4 w-fit rounded-2xl ${stat.bg} ${stat.color}`}><stat.icon size={24} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Donation Feed */}
        <div className="xl:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black font-serif italic text-gray-900">Offering Ledger</h3>
            <div className="flex gap-2">
              {['All', 'Completed', 'Pending'].map(f => (
                <button 
                  key={f} 
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-gray-900 text-white' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5">Donor</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {donations.filter(d => filter === 'All' || d.status === filter).map(d => (
                  <tr key={d.id} className="group hover:bg-gray-50/50">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-600 text-xs font-black">{d.donorName.charAt(0)}</div>
                        <div><p className="text-sm font-black text-gray-900">{d.donorName}</p><p className="text-[9px] text-gray-400 font-bold uppercase">{d.email}</p></div>
                      </div>
                    </td>
                    <td className="px-8 py-4 font-black text-cyan-600 text-sm">{d.amount.toLocaleString()} {d.currency}</td>
                    <td className="px-8 py-4"><span className="px-3 py-1 bg-gray-100 rounded-full text-[8px] font-black uppercase text-gray-500 tracking-tighter">{d.category}</span></td>
                    <td className="px-8 py-4">
                      <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase ${d.status === 'Completed' ? 'text-green-500' : 'text-orange-500'}`}>
                        {d.status === 'Completed' ? <CheckCircle2 size={12}/> : <AlertCircle size={12}/>} {d.status}
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right text-[10px] font-bold text-gray-400">{new Date(d.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Management Sidebar */}
        <div className="xl:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
             <h3 className="text-2xl font-black font-serif italic text-gray-900">Impact Projects</h3>
             <button className="p-3 bg-cyan-500 text-white rounded-xl shadow-lg hover:bg-cyan-600 transition-all active:scale-95"><Plus size={18}/></button>
          </div>
          <div className="space-y-4">
            {projects.map(p => (
              <div key={p.id} className="p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-black text-gray-900 tracking-tight">{p.title}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{p.isActive ? 'Active' : 'Closed'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-300 hover:text-cyan-500"><Plus size={14}/></button>
                    <button className="p-2 text-gray-300 hover:text-red-500"><Trash2 size={14}/></button>
                  </div>
                </div>
                <div className="space-y-2">
                   <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                     <div className="h-full bg-cyan-500" style={{width: `${(p.raised/p.goal)*100}%`}}></div>
                   </div>
                   <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest">
                     <span>{((p.raised/p.goal)*100).toFixed(0)}% Funded</span>
                     <span>{p.raised.toLocaleString()} / {p.goal.toLocaleString()}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </motion.div>
  );
};

export default DonationTab;
