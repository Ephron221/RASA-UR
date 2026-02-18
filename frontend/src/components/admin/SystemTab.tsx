import React, { useState, useEffect } from 'react';
// Fix framer-motion prop errors by casting motion to any
import { motion as motionLib, AnimatePresence } from 'framer-motion';
const motion = motionLib as any;
/* Added missing Globe and AlertTriangle to lucide-react imports */
import { 
  Database, Terminal, HardDrive, RefreshCw, 
  CheckCircle2, RotateCcw, ShieldCheck, Zap, 
  Download, History, Trash2, AlertCircle, 
  Cpu, Activity, Server, FileBox, Save,
  ChevronRight, ArrowLeft, Loader2, Code2, ExternalLink, Signal,
  Layers, Users, Sparkles, Newspaper, ShieldAlert,
  Globe, AlertTriangle
} from 'lucide-react';
import { API } from '../../services/api';

interface SystemTabProps {
  dbHealth: any;
  logs: any[];
  onResetDB: () => void;
}

const SystemTab: React.FC<SystemTabProps> = ({ dbHealth, logs, onResetDB }) => {
  const [backups, setBackups] = useState<any[]>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'monitor' | 'backups' | 'dev'>('monitor');
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  const [pingStatus, setPingStatus] = useState<'Idle' | 'Checking' | 'Success' | 'Fail'>('Idle');
  const [liveHealth, setLiveHealth] = useState<any>(dbHealth);

  const fetchBackups = async () => {
    try {
      const b = await API.system.getBackups();
      setBackups(b || []);
    } catch (e) {
      console.error("Backup fetch failed", e);
    }
  };

  const refreshHealth = async () => {
    try {
      const h = await API.system.getHealth();
      setLiveHealth(h);
    } catch (e) {
      console.error("Health fetch failed");
    }
  };

  useEffect(() => {
    fetchBackups();
    const interval = setInterval(refreshHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const handlePing = async () => {
    setPingStatus('Checking');
    try {
      const health = await API.system.getHealth();
      if (health.status === 'Online') {
        setPingStatus('Success');
        setLiveHealth(health);
      } else {
        setPingStatus('Fail');
      }
    } catch {
      setPingStatus('Fail');
    }
    setTimeout(() => setPingStatus('Idle'), 3000);
  };

  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    try {
      await API.system.createBackup(`System Snapshot - ${new Date().toLocaleString()}`);
      await fetchBackups();
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async (id: string) => {
    if (!window.confirm("CRITICAL: Restoring will overwrite all current portal data. Proceed?")) return;
    setIsRestoring(id);
    try {
      await API.system.restoreBackup(id);
      window.location.reload();
    } finally {
      setIsRestoring(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h3 className="text-3xl font-black font-serif italic text-gray-900 flex items-center gap-4">
            <Cpu className="text-cyan-500" size={32} /> Kernel Infrastructure
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">System architecture & data persistence</p>
        </div>
        
        <div className="flex p-1.5 bg-gray-100 rounded-2xl border border-gray-200">
           {['monitor', 'backups', 'dev'].map((t) => (
             <button 
              key={t}
              onClick={() => setActiveSubTab(t as any)}
              className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-cyan-600'}`}
             >
               {t === 'dev' ? 'Developer Portal' : t.charAt(0).toUpperCase() + t.slice(1)}
             </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'monitor' && (
          <motion.div 
            key="monitor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white p-10 rounded-[3rem] border border-gray-100 space-y-10 shadow-sm h-fit">
                <div className="flex justify-between items-center border-b border-gray-50 pb-6">
                  <h4 className="text-xl font-black font-serif italic text-gray-900 flex items-center gap-3">
                    <Database className="text-cyan-500" size={24} /> Persistence
                  </h4>
                  <div className={`flex items-center gap-2 px-3 py-1 ${liveHealth.database?.includes('Local') ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'} rounded-full text-[9px] font-black uppercase tracking-widest`}>
                     <ShieldCheck size={12} /> {liveHealth.database || 'Encrypted'}
                  </div>
                </div>
                
                <div className="space-y-5">
                  {[
                    { label: 'DB STATUS', value: liveHealth.status, icon: CheckCircle2, color: 'text-green-500' },
                    { label: 'ENGINE VERSION', value: liveHealth.version || '2.5.0-Verified', icon: Server, color: 'text-blue-500' },
                    { label: 'MONGODB SIZE', value: liveHealth.storage || liveHealth.size, icon: HardDrive, color: 'text-orange-500' },
                    { label: 'SYSTEM UPTIME', value: '100%', icon: Activity, color: 'text-cyan-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <item.icon size={16} className={`${item.color} group-hover:scale-125 transition-transform`}/>
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{item.label}</span>
                      </div>
                      <span className="font-black text-gray-900 text-xs">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-50 space-y-6">
                   <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     <Layers size={14} className="text-cyan-500"/> Collection Monitor
                   </h5>
                   <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-50 p-4 rounded-2xl text-center">
                         <Users size={16} className="mx-auto mb-1 text-blue-500"/>
                         <p className="text-lg font-black text-gray-900 leading-none">{liveHealth.collections?.members || 0}</p>
                         <p className="text-[7px] font-black text-gray-400 uppercase mt-1">Members</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl text-center">
                         <Sparkles size={16} className="mx-auto mb-1 text-cyan-500"/>
                         <p className="text-lg font-black text-gray-900 leading-none">{liveHealth.collections?.verses || 0}</p>
                         <p className="text-[7px] font-black text-gray-400 uppercase mt-1">Verses</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl text-center">
                         <Newspaper size={16} className="mx-auto mb-1 text-orange-500"/>
                         <p className="text-lg font-black text-gray-900 leading-none">{liveHealth.collections?.news || 0}</p>
                         <p className="text-[7px] font-black text-gray-400 uppercase mt-1">Stories</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                 <button 
                  onClick={handlePing}
                  disabled={pingStatus === 'Checking'}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all"
                 >
                    {pingStatus === 'Checking' ? <Loader2 className="animate-spin" size={16}/> : <Signal size={16}/>}
                    {pingStatus === 'Checking' ? 'Pinging Kernel...' : pingStatus === 'Success' ? 'Pulse Verified' : pingStatus === 'Fail' ? 'Handshake Failed' : 'Check Connectivity'}
                 </button>
              </div>
            </div>

            <div className="lg:col-span-8">
               <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden h-full">
                  <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
                     <h4 className="text-xl font-black font-serif italic text-gray-900 flex items-center gap-3">
                        <Terminal size={24} className="text-cyan-500" /> Kernel Real-time Log
                     </h4>
                     <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Streaming Encrypted Data</span>
                  </div>
                  <div className="p-8 space-y-4 font-mono text-[11px] leading-relaxed max-h-[500px] overflow-y-auto scroll-hide bg-[#0D1117] text-gray-300">
                    {logs.map((log, i) => (
                      <div key={i} className="flex gap-4 border-l-2 border-cyan-500/20 pl-4 py-1 hover:bg-white/5 transition-colors">
                        <span className="text-cyan-500/50 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        <span className="text-gray-400 uppercase text-[9px] font-bold shrink-0">{log.action.split(':')[0]}</span>
                        <span className="text-white font-medium">{log.action.split(':')[1] || log.action}</span>
                      </div>
                    ))}
                    {logs.length === 0 && <div className="text-gray-500 italic py-10 text-center">Kernel command buffer empty. No logs recorded.</div>}
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'backups' && (
          <motion.div 
            key="backups" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex gap-6 items-center">
                  <div className="w-16 h-16 bg-cyan-50 text-cyan-600 rounded-3xl flex items-center justify-center shadow-inner">
                     <FileBox size={32} />
                  </div>
                  <div>
                     <h4 className="text-2xl font-black text-gray-900 tracking-tight">Manual State Snapshot</h4>
                     <p className="text-sm text-gray-400 font-medium">Generate a complete point-in-time recovery image of the MongoDB portal.</p>
                  </div>
               </div>
               <button 
                onClick={handleCreateBackup}
                disabled={isBackingUp}
                className="px-10 py-5 bg-cyan-500 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 hover:bg-cyan-600 active:scale-95 transition-all disabled:opacity-50"
               >
                  {isBackingUp ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                  Commit Snapshot
               </button>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-gray-50 bg-gray-50/20">
                  <h4 className="text-xl font-black font-serif italic text-gray-900 flex items-center gap-3">
                     <History size={24} className="text-cyan-500" /> Recovery Archive
                  </h4>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                        <tr>
                           <th className="px-10 py-6">ID & TIMESTAMP</th>
                           <th className="px-10 py-6">DESCRIPTION</th>
                           <th className="px-10 py-6">MAGNITUDE</th>
                           <th className="px-10 py-6 text-right">SEQUENCES</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {backups.map(b => (
                          <tr key={b.id} className="hover:bg-cyan-50/10 transition-all group">
                             <td className="px-10 py-6">
                                <div className="space-y-1">
                                   <p className="font-black text-gray-900 text-xs">{b.id}</p>
                                   <p className="text-[9px] font-bold text-gray-400 uppercase">{new Date(b.timestamp).toLocaleString()}</p>
                                </div>
                             </td>
                             <td className="px-10 py-6">
                                <p className="text-xs font-bold text-gray-600">{b.description}</p>
                             </td>
                             <td className="px-10 py-6">
                                <span className="px-3 py-1 bg-gray-100 rounded-lg text-[9px] font-black text-gray-500">{b.size}</span>
                             </td>
                             <td className="px-10 py-6 text-right">
                                <button 
                                  onClick={() => handleRestore(b.id)}
                                  disabled={isRestoring === b.id}
                                  className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-cyan-500 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                >
                                   {isRestoring === b.id ? <Loader2 className="animate-spin" size={12}/> : <RotateCcw size={12} className="inline mr-2"/>}
                                   Restore Point
                                </button>
                             </td>
                          </tr>
                        ))}
                        {backups.length === 0 && (
                          <tr><td colSpan={4} className="py-32 text-center text-gray-300 italic font-serif">No recovery snapshots detected in persistence layer.</td></tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'dev' && (
          <motion.div 
            key="dev" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-900 p-10 rounded-[3.5rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-10 opacity-5"><Code2 size={200}/></div>
                   <h4 className="text-2xl font-black font-serif italic flex items-center gap-3">
                      <Code2 className="text-cyan-400" /> Divine Kernel Console
                   </h4>
                   <div className="space-y-4">
                      <p className="text-gray-400 text-sm font-medium leading-relaxed">Direct manipulation of association parameters via the REST abstraction layer.</p>
                      <div className="grid grid-cols-1 gap-3">
                         {[
                           { label: 'API Base', value: 'http://localhost:5000/api', icon: Globe },
                           { label: 'Protocol', value: 'GraphQL over REST', icon: RefreshCw },
                           { label: 'Security', value: 'JWT + LocalStorage Auth', icon: ShieldCheck }
                         ].map((d, i) => (
                           <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                              <div className="flex items-center gap-3 text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                                 <d.icon size={14}/> {d.label}
                              </div>
                              <span className="font-mono text-xs text-white/70">{d.value}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                   <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                      Initialize Swagger Sandbox <ExternalLink size={14}/>
                   </button>
                </div>

                <div className="bg-white p-10 rounded-[3.5rem] border border-red-100 space-y-8 shadow-sm">
                   <h4 className="text-2xl font-black font-serif italic text-red-600 flex items-center gap-3">
                      <ShieldAlert size={28} /> Terminal Sequence Danger Zone
                   </h4>
                   <p className="text-gray-400 text-sm font-medium leading-relaxed">Permanent destructive actions. Use only in event of catastrophic kernel corruption.</p>
                   
                   <div className="space-y-6">
                      <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex items-start gap-4">
                         <AlertTriangle className="text-red-500 shrink-0" size={24} />
                         <div>
                            <p className="font-black text-red-900 text-xs uppercase tracking-tight">Full Archive Purge</p>
                            <p className="text-[10px] text-red-600 font-bold leading-tight mt-1">Wipes all local and MongoDB data. Resets portal to factory Genesis state.</p>
                         </div>
                      </div>
                      <button 
                        onClick={onResetDB}
                        className="w-full py-5 bg-red-600 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-100 hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                         <Trash2 size={18}/> Execute Hard Kernel Reset
                      </button>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SystemTab;