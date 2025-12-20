
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Handshake, Plus, Trash2, DollarSign, Calendar, Filter, Search, BarChart3, TrendingUp, Layers, CheckCircle2, AlertCircle, Edit, X, Camera, Upload, Loader2, Save } from 'lucide-react';
import { API } from '../../services/api';
import { Donation, DonationProject } from '../../types';

const DonationTab: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [isSyncing, setIsSyncing] = useState(false);

  // Project Editor States
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<DonationProject | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const totalRaised = donations.filter(d => d.status === 'Completed').reduce((acc, curr) => acc + curr.amount, 0);

  const handleConfirmDonation = async (donation: Donation) => {
    if (!window.confirm(`Confirm receipt of ${donation.amount.toLocaleString()} RWF from ${donation.donorName}?`)) return;
    
    setIsSyncing(true);
    // Find associated project if any
    const project = projects.find(p => p.title === donation.project);
    
    // Update donation status to completed
    await API.donations.updateStatus(donation.id, 'Completed');
    
    // If it was for a project, update project raised amount
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
    if (!window.confirm('Are you sure? This will remove the project from the public donations page.')) return;
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
      
      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Confirmed Offerings', value: `${totalRaised.toLocaleString()} RWF`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Active Projects', value: projects.filter(p => p.isActive).length, icon: Layers, color: 'text-cyan-600', bg: 'bg-cyan-50' },
          { label: 'Pending Verification', value: donations.filter(d => d.status === 'Pending').length, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
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
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {donations.filter(d => filter === 'All' || d.status === filter).map(d => (
                  <tr key={d.id} className="group hover:bg-gray-50/50">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-600 text-xs font-black">{d.donorName.charAt(0)}</div>
                        <div><p className="text-sm font-black text-gray-900">{d.donorName}</p><p className="text-[9px] text-gray-400 font-bold uppercase">{d.transactionId}</p></div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                       <p className="font-black text-cyan-600 text-sm">{d.amount.toLocaleString()} RWF</p>
                       <p className="text-[8px] text-gray-400 font-black uppercase">{d.project || 'General'}</p>
                    </td>
                    <td className="px-8 py-4">
                      <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase ${d.status === 'Completed' ? 'text-green-500' : 'text-orange-500'}`}>
                        {d.status === 'Completed' ? <CheckCircle2 size={12}/> : <AlertCircle size={12}/>} {d.status}
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                       {d.status === 'Pending' ? (
                         <button 
                            disabled={isSyncing}
                            onClick={() => handleConfirmDonation(d)}
                            className="px-4 py-2 bg-green-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-green-600 active:scale-95 transition-all"
                         >
                           {isSyncing ? '...' : 'Verify Receipt'}
                         </button>
                       ) : (
                         <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{new Date(d.date).toLocaleDateString()}</span>
                       )}
                    </td>
                  </tr>
                ))}
                {donations.length === 0 && (
                   <tr><td colSpan={4} className="px-8 py-20 text-center text-gray-300 italic">No offerings logged yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Management Sidebar */}
        <div className="xl:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
             <h3 className="text-2xl font-black font-serif italic text-gray-900">Project Hub</h3>
             <button 
                onClick={() => { setEditingProject(null); setFilePreview(null); setShowProjectModal(true); }}
                className="p-3 bg-cyan-500 text-white rounded-xl shadow-lg hover:bg-cyan-600 transition-all active:scale-95"
             >
               <Plus size={18}/>
             </button>
          </div>
          <div className="space-y-4">
            {projects.map(p => (
              <div key={p.id} className="p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm space-y-4 group">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                      <img src={p.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-black text-gray-900 tracking-tight leading-tight">{p.title}</p>
                      <p className={`text-[8px] font-black uppercase ${p.isActive ? 'text-green-500' : 'text-red-400'}`}>{p.isActive ? 'Visible' : 'Hidden'}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { setEditingProject(p); setShowProjectModal(true); }} className="p-2 text-gray-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg transition-colors"><Edit size={14}/></button>
                    <button onClick={() => handleDeleteProject(p.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14}/></button>
                  </div>
                </div>
                <div className="space-y-2">
                   <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                     <div className="h-full bg-cyan-500" style={{width: `${Math.min(100, (p.raised/p.goal)*100)}%`}}></div>
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

      {/* Project Editor Modal */}
      <AnimatePresence>
        {showProjectModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-lg rounded-[3rem] shadow-3xl overflow-hidden">
               <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                 <h4 className="text-2xl font-black font-serif italic text-gray-900">{editingProject ? 'Edit Project' : 'New Project'}</h4>
                 <button onClick={() => setShowProjectModal(false)} className="p-3 bg-white text-gray-400 rounded-2xl hover:text-red-500 transition-all shadow-sm"><X size={20}/></button>
               </div>
               
               <form onSubmit={handleSaveProject} className="p-10 space-y-6 max-h-[60vh] overflow-y-auto scroll-hide">
                 <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Project Visual</label>
                   <div onClick={() => fileInputRef.current?.click()} className="relative h-40 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 flex items-center justify-center cursor-pointer overflow-hidden group">
                     {(filePreview || editingProject?.image) ? (
                        <img src={filePreview || editingProject?.image} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" alt="" />
                     ) : (
                        <Upload className="text-gray-300" size={32}/>
                     )}
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-cyan-600/5 transition-opacity">
                        <Camera className="text-cyan-600" size={24}/>
                     </div>
                   </div>
                   <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                 </div>

                 <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Project Title</label>
                      <input name="title" defaultValue={editingProject?.title} required className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none focus:bg-white border border-transparent focus:border-cyan-100" placeholder="e.g. New Sound System" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Funding Goal (RWF)</label>
                      <input name="goal" type="number" defaultValue={editingProject?.goal} required className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-black text-lg outline-none focus:bg-white border border-transparent focus:border-cyan-100" placeholder="2000000" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Description</label>
                      <textarea name="description" defaultValue={editingProject?.description} rows={4} required className="w-full px-6 py-4 bg-gray-50 rounded-3xl font-medium text-sm outline-none focus:bg-white border border-transparent focus:border-cyan-100 resize-none" placeholder="Explain the project impact..." />
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <input type="checkbox" name="isActive" defaultChecked={editingProject?.isActive ?? true} className="w-5 h-5 accent-cyan-500" />
                      <span className="text-xs font-black uppercase text-gray-500 tracking-widest">Live on Donation Page</span>
                    </div>
                 </div>
               </form>

               <div className="p-10 border-t border-gray-50 bg-gray-50/30 flex gap-4">
                  <button type="button" onClick={() => setShowProjectModal(false)} className="flex-grow py-4 bg-white border border-gray-200 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest">Discard</button>
                  <button type="submit" onClick={(e) => { e.preventDefault(); (document.querySelector('form') as HTMLFormElement).requestSubmit(); }} disabled={isSyncing} className="flex-[2] py-4 bg-cyan-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                    {isSyncing ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} Commit Project
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
