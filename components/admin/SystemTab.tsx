
import React from 'react';
import { motion } from 'framer-motion';
import { Database, Terminal, HardDrive, RefreshCw, CheckCircle2, RotateCcw } from 'lucide-react';

interface SystemTabProps {
  dbHealth: any;
  logs: any[];
  onResetDB: () => void;
}

const SystemTab: React.FC<SystemTabProps> = ({ dbHealth, logs, onResetDB }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 space-y-8 shadow-sm h-fit">
        <h4 className="text-xl font-black font-serif italic text-gray-900 flex items-center gap-3">
          <Database className="text-cyan-500" size={24} /> Persistence Status
        </h4>
        <div className="space-y-4">
          {[
            { label: 'DB Health', value: dbHealth.status, icon: CheckCircle2, color: 'text-green-500' },
            { label: 'Storage Usage', value: dbHealth.size, icon: HardDrive, color: 'text-blue-500' },
            { label: 'Last Sync', value: dbHealth.lastSync, icon: RefreshCw, color: 'text-cyan-500' }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <item.icon size={18} className={item.color}/>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</span>
              </div>
              <span className="font-black text-gray-900 text-sm">{item.value}</span>
            </div>
          ))}
        </div>
        <button onClick={onResetDB} className="w-full py-5 bg-red-50 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-red-100/50">
          <RotateCcw size={18} /> Wipe Local Database
        </button>
      </div>
      <div className="bg-gray-900 p-10 rounded-[3rem] text-white flex flex-col h-[600px] shadow-2xl">
         <h4 className="text-xl font-black font-serif italic flex items-center gap-3 mb-8">
           <Terminal className="text-cyan-400" size={24} /> Activity Logs
         </h4>
         <div className="flex-grow overflow-y-auto scroll-hide space-y-4 pr-2">
            {logs.map(log => (
              <div key={log.id} className="pb-4 border-b border-white/5 last:border-0">
                <p className="text-[9px] text-white/30">{new Date(log.timestamp).toLocaleTimeString()} • {new Date(log.timestamp).toLocaleDateString()}</p>
                <p className="text-[11px] font-bold text-white/80 mt-0.5">{log.action}</p>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="h-full flex items-center justify-center text-white/20 italic text-sm">No activity logs recorded yet.</div>
            )}
         </div>
      </div>
    </motion.div>
  );
};

export default SystemTab;
