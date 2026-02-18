
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Plus, Edit, Trash2, CheckCircle2, 
  Settings, Shield, User, Landmark, MessageSquare, Briefcase, Star,
  Info, Save, X, Loader2, ChevronRight, Lock, Key
} from 'lucide-react';
import { RoleDefinition, Permission } from '../../types';
import { ALL_PERMISSIONS } from '../../constants';
import { API } from '../../services/api';

interface ClearanceTabProps {
  roles: RoleDefinition[];
  onRefresh: () => void;
}

const IconOptions = [
  { id: 'Shield', icon: Shield },
  { id: 'User', icon: User },
  { id: 'Landmark', icon: Landmark },
  { id: 'MessageSquare', icon: MessageSquare },
  { id: 'Briefcase', icon: Briefcase },
  { id: 'Star', icon: Star },
];

const ClearanceTab: React.FC<ClearanceTabProps> = ({ roles, onRefresh }) => {
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const categories = Array.from(new Set(ALL_PERMISSIONS.map(p => p.category)));

  const handleCreate = () => {
    setEditingRole({
      id: '',
      label: '',
      icon: 'User',
      description: '',
      permissions: ['tab.overview', 'tab.profile'],
    });
    setShowEditor(true);
  };

  const handleEdit = (role: RoleDefinition) => {
    setEditingRole({ ...role });
    setShowEditor(true);
  };

  const handleSave = async () => {
    if (!editingRole) return;
    if (!editingRole.label.trim()) { alert("Identity Label is required."); return; }
    
    setIsSyncing(true);
    try {
      const roleId = editingRole.id || editingRole.label.toLowerCase().replace(/\s+/g, '-');
      const finalRole = { ...editingRole, id: roleId };
      
      if (roles.find(r => r.id === roleId) && !editingRole.id) {
        alert("This clearance identity already exists.");
        setIsSyncing(false);
        return;
      }

      if (editingRole.id) {
        await API.roles.update(editingRole.id, finalRole);
      } else {
        await API.roles.create(finalRole);
      }
      
      await onRefresh();
      setShowEditor(false);
      setEditingRole(null);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("CRITICAL: Deleting a clearance level will render assigned members as 'Guest'. Proceed?")) return;
    setIsSyncing(true);
    await API.roles.delete(id);
    await onRefresh();
    setIsSyncing(false);
  };

  const togglePermission = (key: string) => {
    if (!editingRole) return;
    const newPerms = editingRole.permissions.includes(key)
      ? editingRole.permissions.filter(k => k !== key)
      : [...editingRole.permissions, key];
    setEditingRole({ ...editingRole, permissions: newPerms });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1">
          <h3 className="text-3xl font-black font-serif italic text-gray-900 flex items-center gap-4">
            <ShieldCheck className="text-cyan-500" size={32} /> Clearance Architect
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Define user authorizations and functional logic</p>
        </div>
        <button onClick={handleCreate} className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl flex items-center gap-3 active:scale-95 transition-all">
          <Plus size={18} /> Initialize New Tier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {roles.map(role => {
          const IconComp = IconOptions.find(i => i.id === role.icon)?.icon || User;
          return (
            <motion.div key={role.id} whileHover={{ y: -5 }} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative group flex flex-col h-full transition-all hover:shadow-xl">
               <div className="flex justify-between items-start mb-6">
                  <div className={`w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 shadow-inner group-hover:bg-cyan-500 group-hover:text-white transition-all`}>
                    <IconComp size={28} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(role)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-900 hover:text-white transition-all"><Edit size={16}/></button>
                    {!role.isSystem && (
                      <button onClick={() => handleDelete(role.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                    )}
                    {role.isSystem && (
                      <div className="p-2.5 bg-gray-100 text-gray-300 rounded-xl"><Lock size={16}/></div>
                    )}
                  </div>
               </div>

               <div className="flex-grow space-y-4">
                  <div>
                    <h4 className="text-xl font-black text-gray-900 tracking-tight leading-tight">{role.label}</h4>
                    <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest mt-1">ID: {role.id}</p>
                  </div>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed">{role.description}</p>
                  
                  <div className="pt-4 border-t border-gray-50 space-y-3">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Core Capabilities</p>
                    <div className="flex flex-wrap gap-2">
                       {role.permissions.slice(0, 6).map(p => (
                         <span key={p} className="px-2 py-1 bg-gray-50 text-gray-500 rounded-md text-[8px] font-black uppercase tracking-tighter">
                           {p.split('.')[1].replace('_', ' ')}
                         </span>
                       ))}
                       {role.permissions.length > 6 && <span className="text-[8px] font-black text-gray-300 uppercase">+{role.permissions.length - 6} more</span>}
                    </div>
                  </div>
               </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {showEditor && editingRole && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-4xl rounded-[3rem] shadow-3xl overflow-hidden border border-white flex flex-col max-h-[95vh]">
               <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-gray-900 text-cyan-400 rounded-2xl flex items-center justify-center shadow-xl"><ShieldCheck size={24}/></div>
                    <h3 className="text-2xl font-black font-serif italic">Identity Specification</h3>
                  </div>
                  <button onClick={() => setShowEditor(false)} className="p-3 bg-white border border-gray-100 text-gray-400 rounded-2xl hover:text-red-500 transition-all"><X size={20}/></button>
               </div>

               <div className="flex-grow overflow-y-auto scroll-hide p-12 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Clearance Label</label>
                          <input 
                            value={editingRole.label}
                            onChange={e => setEditingRole({...editingRole, label: e.target.value})}
                            placeholder="e.g. Intern, Auditor, etc."
                            className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl font-bold text-sm focus:ring-4 focus:ring-cyan-50 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Tier Narrative</label>
                          <textarea 
                            value={editingRole.description}
                            onChange={e => setEditingRole({...editingRole, description: e.target.value})}
                            placeholder="Purpose and limitations of this tier..."
                            rows={3}
                            className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl font-medium text-sm focus:ring-4 focus:ring-cyan-50 outline-none transition-all resize-none"
                          />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Symbolic Avatar</label>
                        <div className="grid grid-cols-3 gap-3">
                           {IconOptions.map(opt => (
                             <button 
                               key={opt.id}
                               onClick={() => setEditingRole({...editingRole, icon: opt.id})}
                               className={`p-6 rounded-3xl border-2 transition-all flex items-center justify-center ${editingRole.icon === opt.id ? 'bg-cyan-50 border-cyan-500 text-cyan-600 shadow-lg shadow-cyan-100' : 'bg-white border-gray-50 text-gray-300 hover:border-gray-200'}`}
                             >
                               <opt.icon size={24}/>
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8 pt-8 border-t border-gray-100">
                     <div className="flex justify-between items-center">
                        <h4 className="text-lg font-black uppercase text-gray-900 tracking-widest flex items-center gap-2"><Key size={18} className="text-cyan-500"/> Granular Authorizations</h4>
                        <span className="text-[10px] font-black text-cyan-600 bg-cyan-50 px-3 py-1 rounded-lg uppercase">{editingRole.permissions.length} Enabled</span>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {categories.map(cat => (
                          <div key={cat} className="space-y-4">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-gray-50 pb-2">{cat} Module</p>
                             <div className="space-y-2">
                                {ALL_PERMISSIONS.filter(p => p.category === cat).map(perm => (
                                  <button 
                                    key={perm.key}
                                    onClick={() => togglePermission(perm.key)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group ${editingRole.permissions.includes(perm.key) ? 'bg-cyan-50 border-cyan-100 text-cyan-800' : 'bg-white border-gray-50 text-gray-400 hover:bg-gray-50'}`}
                                  >
                                    <span className="text-xs font-bold">{perm.label}</span>
                                    {editingRole.permissions.includes(perm.key) ? (
                                      <CheckCircle2 size={16} className="text-cyan-500"/>
                                    ) : (
                                      <div className="w-4 h-4 rounded-full border border-gray-200 group-hover:border-cyan-200 transition-colors"></div>
                                    )}
                                  </button>
                                ))}
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="p-10 border-t border-gray-50 bg-gray-50/30 flex justify-between gap-4">
                  <div className="flex items-center gap-3 p-6 bg-cyan-900 rounded-[2rem] text-white grow-0 max-w-sm">
                    <Info size={16} className="text-cyan-400 shrink-0"/>
                    <p className="text-[10px] font-medium text-gray-300 leading-tight uppercase tracking-tight">Persistence Protocol: Changes will synchronize immediately across the Kernel. Assigned members will receive new permissions on refresh.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setShowEditor(false)} className="px-8 py-4 text-gray-400 font-black text-[10px] uppercase tracking-widest active:scale-95">Cancel</button>
                    <button 
                      onClick={handleSave}
                      disabled={isSyncing}
                      className="px-12 py-5 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:bg-cyan-600 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isSyncing ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} Finalize Tier
                    </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ClearanceTab;
