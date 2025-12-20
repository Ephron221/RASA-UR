
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

  // Project Editor States
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<DonationProject | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Permission Logic
  const isSeniorAdmin = user.email === 'esront21@gmail.com';
  const canVerify = user.role === 'admin'; 
  const canManageProjects = isSeniorAdmin;

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

  // Detailed Financial Statistics
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
      activeProjectsCount: activeProjects.length,
      globalGoal,
      globalRaised,
      fundingPercentage: globalGoal > 0 ? (globalRaised / globalGoal) * 100 : 0
    };
  }, [donations, projects]);

  const filteredDonations = donations.filter(d => {
    const matchesFilter = filter === 'All' || d.status === filter;
    const matchesSearch = d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (d.project || 'General').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleConfirmDonation = async (donation: Donation) => {
    if (!canVerify) return;
    if (!window.confirm(`Confirm receipt of ${donation.amount.toLocaleString()} RWF from ${donation.donorName}?`)) return;
    
    setIsSyncing(true);
    const project = projects.find(p => p.title === donation.project);
    await API.donations.updateStatus(donation.id, 'Completed');
    if (project) {
      await API.donations.projects.update(project.id, {
        raised: project.raised + donation.amount
      });
    }
    await fetchData();
    setIsSyncing(false);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageProjects) return;

    setIsSyncing(true);
    const formData = new FormData(e.target as HTMLFormElement);
    
    const projectData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      goal: Number(formData.get('goal')),
      image: filePreview || editingProject?.image || 'https://picsum.photos/800/400',
      isActive: formData.get('isActive') === 'on',
      raised: editingProject?.raised || 0
    };

    if (editingProject) {
      await API.donations.projects.update(editingProject.id, projectData);
    } else {
      await API.donations.projects.create({
        ...projectData,
        id: Math.random().toString(36).substr(2, 9)
      } as any);
    }

    setShowProjectModal(false);
    setEditingProject(null);
    setFilePreview(null);
    await fetchData();
    setIsSyncing(false);
  };

  const handleDeleteProject = async (id: string) => {
    if (!canManageProjects) return;
    if (!window.confirm('Permanently delete this project?')) return;
    setIsSyncing(true);
    await API.donations.projects.delete(id);
    await fetchData();
    setIsSyncing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Logs', value: `${stats.total.toLocaleString()} RWF`, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'Verified + Pending' },
          { label: 'Verified Funds', value: `${stats.verified.toLocaleString()} RWF`, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: 'In Bank/MoMo' },
          { label: 'Awaiting Action', value: `${stats.pending.toLocaleString()} RWF`, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', sub: `${donations.filter(d => d.status === 'Pending').length} Offerings` },
          { label: 'Donor Pool', value: new Set(donations.map(d => d.email)).size, icon: Handshake, color: 'text-purple-600', bg: 'bg-purple-50', sub: 'Unique Supporters' },
        ].map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col gap-4 group"
          >
            <div className={`p-4 w-fit rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}><item.icon size={22} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
              <p className="text-2xl font-black text-gray-900 leading-tight">{item.value}</p>
              <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">{item.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Global Progress Tracker */}
      <div className="bg-gray-900 p-10 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Target size={240} />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-4 max-w-xl">
               <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-cyan-500 rounded-full text-[10px] font-black uppercase tracking-widest">Global Goal</div>
                  <TrendingUp className="text-cyan-400" size={18} />
               </div>
               <h3 className="text-4xl font-black font-serif italic">Ministry Funding Milestone</h3>
               <p className="text-gray-400 text-sm leading-relaxed">Combined financial objective of all active RASA missions. Your verification of offerings moves this bar closer to the divine target.</p>
            </div>
            <div className="w-full md:w-80 space-y-4">
               <div className="flex justify-between items-end">
                  <span className="text-3xl font-black text-cyan-400">{stats.fundingPercentage.toFixed(1)}%</span>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-gray-400 uppercase">Raised So Far</p>
                     <p className="text-sm font-bold">{stats.globalRaised.toLocaleString()} RWF</p>
                  </div>
               </div>
               <div className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${Math.min(100, stats.fundingPercentage)}%` }}
                     transition={{ duration: 1.5, ease: "easeOut" }}
                     className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                  />
               </div>
               <div className="flex justify-between text-[9px] font-black text-gray-500 uppercase tracking-widest">
                  <span>Start Phase</span>
                  <span>Target: {stats.globalGoal.toLocaleString()} RWF</span>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Donation Feed */}
        <div className="xl:col-span-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-black font-serif italic text-gray-900">Offering Ledger</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verification & Transparency Portal</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500 transition-colors" size={14} />
                <input 
                  type="text"
                  placeholder="Donor, ID, or Project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-xs font-bold outline-none w-48 focus:bg-white transition-all"
                />
              </div>
              <div className="w-px h-6 bg-gray-100"></div>
              {['All', 'Completed', 'Pending'].map(f => (
                <button 
                  key={f} 
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-100' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-6">Donor Details</th>
                  <th className="px-8 py-6">Contribution</th>
                  <th className="px-8 py-6">Validation</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredDonations.map(d => (
                  <tr key={d.id} className="group hover:bg-cyan-50/15 transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner ${d.status === 'Completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'}`}>
                          {d.donorName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-gray-900 truncate">{d.donorName}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter truncate">{d.transactionId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-2 text-cyan-600">
                          <DollarSign size={14} className="opacity-50" />
                          <span className="font-black text-base">{d.amount.toLocaleString()}</span>
                          <span className="text-[10px] font-bold opacity-70">RWF</span>
                       </div>
                       <p className="text-[9px] text-gray-400 font-black uppercase mt-1 flex items-center gap-1.5">
                          <Layers size={10}/> {d.project || 'General Support'}
                       </p>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${d.status === 'Completed' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 'bg-orange-50 text-orange-500 border border-orange-100'}`}>
                        {d.status === 'Completed' ? <CheckCircle2 size={12}/> : <Loader2 size={12} className="animate-spin" />} {d.status}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       {d.status === 'Pending' ? (
                         <button 
                            disabled={isSyncing || !canVerify}
                            onClick={() => handleConfirmDonation(d)}
                            className={`px-5 py-2.5 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-2 ml-auto ${canVerify ? 'bg-emerald-500 shadow-emerald-100 hover:bg-emerald-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
                         >
                           {isSyncing ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Verify Receipt
                         </button>
                       ) : (
                         <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(d.date).toLocaleDateString()}</p>
                            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Verified</p>
                         </div>
                       )}
                    </td>
                  </tr>
                ))}
                {filteredDonations.length === 0 && (
                   <tr><td colSpan={4} className="px-8 py-24 text-center">
                     <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                        <Search size={40} />
                     </div>
                     <p className="text-xl font-bold font-serif text-gray-300 italic">Financial logs yielded no results.</p>
                   </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Management Sidebar */}
        <div className="xl:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
             <div className="space-y-1">
                <h3 className="text-2xl font-black font-serif italic text-gray-900 leading-tight">Project Hub</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{projects.length} Registered Needs</p>
             </div>
             {canManageProjects && (
               <button 
                  onClick={() => { setEditingProject(null); setFilePreview(null); setShowProjectModal(true); }}
                  className="p-3.5 bg-cyan-500 text-white rounded-2xl shadow-xl shadow-cyan-100 hover:bg-cyan-600 transition-all active:scale-95 border-b-4 border-cyan-700"
               >
                 <Plus size={20}/>
               </button>
             )}
          </div>
          
          {!canManageProjects && (
            <div className="p-6 bg-cyan-50 border border-cyan-100 rounded-[2rem] flex gap-4 items-center">
              <ShieldAlert className="text-cyan-500 shrink-0" size={24} />
              <p className="text-xs font-bold text-cyan-800 leading-snug">Project lifecycle management is restricted to the Senior Admin account.</p>
            </div>
          )}

          <div className="space-y-5">
            {projects.map(p => (
              <motion.div 
                key={p.id} 
                layout
                className="p-7 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm space-y-5 group relative overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
                      <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-black text-gray-900 tracking-tight leading-tight truncate max-w-[150px]">{p.title}</p>
                      <p className={`text-[9px] font-black uppercase ${p.isActive ? 'text-emerald-500' : 'text-rose-400'}`}>
                        {p.isActive ? 'Live Listing' : 'Internal Archive'}
                      </p>
                    </div>
                  </div>
                  {canManageProjects && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => { setEditingProject(p); setFilePreview(null); setShowProjectModal(true); }} className="p-3 bg-cyan-50 text-cyan-500 rounded-xl hover:bg-cyan-500 hover:text-white transition-all shadow-sm"><Edit size={16}/></button>
                      <button onClick={() => handleDeleteProject(p.id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={16}/></button>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between items-end">
                      <div className="flex items-center gap-1.5 text-cyan-600">
                        <TrendingUp size={12} />
                        <span className="text-xl font-black">{((p.raised/p.goal)*100).toFixed(0)}%</span>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Raised Milestone</p>
                         <p className="text-xs font-bold text-gray-700">{p.raised.toLocaleString()} RWF</p>
                      </div>
                   </div>
                   <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (p.raised/p.goal)*100)}%` }}
                        className="h-full bg-cyan-500 rounded-full" 
                     />
                   </div>
                   <p className="text-[9px] font-bold text-center text-gray-400 uppercase tracking-[0.2em] pt-1">Goal: {p.goal.toLocaleString()} RWF</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Editor Modal */}
      <AnimatePresence>
        {showProjectModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-3xl overflow-hidden border border-white">
               <div className="p-12 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-cyan-500 tracking-[0.3em]">Project Life-Cycle</p>
                    <h4 className="text-3xl font-black font-serif italic text-gray-900">{editingProject ? 'Modify Intent' : 'Initialize Mission'}</h4>
                 </div>
                 <button onClick={() => setShowProjectModal(false)} className="p-4 bg-white text-gray-400 rounded-2xl hover:text-rose-500 transition-all shadow-sm border border-gray-100"><X size={20}/></button>
               </div>
               
               <form onSubmit={handleSaveProject} className="p-12 space-y-8 max-h-[60vh] overflow-y-auto scroll-hide">
                 <div className="space-y-4">
                   <label className="text-[11px] font-black uppercase text-gray-400 ml-4 tracking-widest flex items-center gap-2">
                     <Camera size={14} className="text-cyan-500" /> Narrative Visualization
                   </label>
                   <div onClick={() => fileInputRef.current?.click()} className="relative h-48 bg-gray-50 rounded-[2.5rem] border-4 border-dashed border-gray-100 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-cyan-200 transition-all shadow-inner">
                     {(filePreview || editingProject?.image) ? (
                        <img src={filePreview || editingProject?.image} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" alt="" />
                     ) : (
                        <div className="text-center space-y-2">
                           <Upload className="text-gray-300 mx-auto" size={40}/>
                           <p className="text-[10px] font-black uppercase text-gray-400">Attach Cover Asset</p>
                        </div>
                     )}
                     <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-cyan-600/10 backdrop-blur-[2px] transition-opacity">
                        <Camera className="text-cyan-600 mb-2" size={32}/>
                        <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">Update Imagery</span>
                     </div>
                   </div>
                   <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Project Mission Name</label>
                      <input name="title" defaultValue={editingProject?.title} required className="w-full px-8 py-5 bg-gray-50 rounded-[1.8rem] font-bold text-sm outline-none focus:bg-white border-2 border-transparent focus:border-cyan-100 transition-all" placeholder="e.g. Gospel Outreach Sound System" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Financial Target (RWF)</label>
                      <div className="relative group">
                         <PiggyBank className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500" size={20} />
                         <input name="goal" type="number" defaultValue={editingProject?.goal} required className="w-full pl-16 pr-8 py-5 bg-gray-50 rounded-[1.8rem] font-black text-2xl outline-none focus:bg-white border-2 border-transparent focus:border-cyan-100 transition-all" placeholder="2000000" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Divine Burden / Description</label>
                      <textarea name="description" defaultValue={editingProject?.description} rows={5} required className="w-full px-8 py-6 bg-gray-50 rounded-[2rem] font-medium text-base outline-none focus:bg-white border-2 border-transparent focus:border-cyan-100 transition-all resize-none leading-relaxed shadow-inner" placeholder="Why is this project essential for the ministry?" />
                    </div>
                    
                    <div className="flex items-center gap-4 p-6 bg-cyan-50/50 rounded-[2rem] border border-cyan-100/50">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-cyan-600 shadow-sm border border-cyan-50">
                        <CheckCircle2 size={24} />
                      </div>
                      <div className="flex-grow">
                        <label className="flex items-center gap-3 cursor-pointer select-none group">
                          <input type="checkbox" name="isActive" defaultChecked={editingProject?.isActive ?? true} className="w-6 h-6 accent-cyan-500 rounded-lg cursor-pointer" />
                          <div className="space-y-0.5">
                            <p className="text-xs font-black uppercase tracking-widest text-cyan-900 group-hover:text-cyan-600 transition-colors">Visible to Public</p>
                            <p className="text-[9px] font-bold text-cyan-600/60 uppercase">Allow members to sow into this need</p>
                          </div>
                        </label>
                      </div>
                    </div>
                 </div>
               </form>

               <div className="p-12 border-t border-gray-50 bg-gray-50/30 flex gap-5">
                  <button type="button" onClick={() => setShowProjectModal(false)} className="flex-grow py-5 bg-white border border-gray-200 text-gray-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-100 active:scale-95 transition-all">Discard</button>
                  <button type="submit" onClick={(e) => { e.preventDefault(); (document.querySelector('form') as HTMLFormElement).requestSubmit(); }} disabled={isSyncing} className="flex-[2] py-5 bg-cyan-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-cyan-500/20 flex items-center justify-center gap-3 hover:bg-cyan-600 active:scale-95 transition-all">
                    {isSyncing ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>} {editingProject ? 'Apply Changes' : 'Initialize Mission'}
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default DonationTab;
