
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Shield, Edit, Trash2, FileText, Download, Loader2 } from 'lucide-react';
import { User } from '../../types';

interface DirectoryTabProps {
  members: User[];
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onNewMember: () => void;
  onEditMember: (member: User) => void;
  onDeleteMember: (id: string) => void;
  onToggleAdmin: (member: User) => void;
  currentUser: User;
}

const DirectoryTab: React.FC<DirectoryTabProps> = ({ 
  members, searchTerm, onSearchChange, onNewMember, onEditMember, onDeleteMember, onToggleAdmin, currentUser
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const filteredMembers = members.filter(m => 
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isIT = currentUser.role === 'it';

  const generateReport = async () => {
    setIsExporting(true);
    // Simulate complex report generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const headers = ['Full Name', 'Email', 'Phone', 'Role', 'Program', 'Level', 'Diocese', 'Department', 'Joined At'];
    const rows = members.map(m => [
      m.fullName,
      m.email,
      m.phone,
      m.role,
      m.program,
      m.level,
      m.diocese,
      m.department,
      new Date(m.createdAt).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RASA_Member_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExporting(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text" 
            placeholder="Search members..." 
            value={searchTerm} 
            onChange={(e) => onSearchChange(e.target.value)} 
            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none shadow-sm focus:ring-4 focus:ring-cyan-50 transition-all" 
          />
        </div>
        
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          {isIT && (
            <button 
              disabled={isExporting}
              onClick={generateReport}
              className="flex-grow lg:flex-none px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="animate-spin" size={16} /> : <FileText size={16} />}
              Generate Global Report
            </button>
          )}
          <button onClick={onNewMember} className="flex-grow lg:flex-none px-8 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-cyan-600 transition-all active:scale-95">
            <UserPlus size={16} /> New Member
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black font-serif italic text-gray-900 leading-tight">Member Registry</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total database load: {members.length} records</p>
          </div>
          <div className="flex gap-2">
             <div className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> DB Sync Active
             </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-6">Identity & Email</th>
                <th className="px-8 py-6">Academic Domain</th>
                <th className="px-8 py-6">Clearance</th>
                <th className="px-8 py-6 text-right">Sequence Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredMembers.map(m => (
                <tr key={m.id} className="group hover:bg-cyan-50/30 transition-all duration-500">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-cyan-600 font-black overflow-hidden shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                          {m.profileImage ? <img src={m.profileImage} className="w-full h-full object-cover" alt="" /> : m.fullName.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-gray-900 truncate group-hover:text-cyan-600 transition-colors">{m.fullName}</p>
                        <p className="text-[10px] text-gray-400 font-bold truncate tracking-tight">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-gray-700 truncate">{m.program}</p>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter mt-1">{m.level} • {m.diocese}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${
                      ['it', 'admin'].includes(m.role) ? 'bg-gray-900 text-white' : 
                      ['accountant', 'secretary', 'executive'].includes(m.role) ? 'bg-cyan-50 text-cyan-600' : 
                      'bg-gray-50 text-gray-500'
                    }`}>
                      {m.role === 'it' && <Shield size={10} className="text-cyan-400" />}
                      {m.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button onClick={() => onToggleAdmin(m)} className="p-3 bg-white border border-gray-100 text-cyan-500 rounded-xl hover:bg-cyan-500 hover:text-white transition-all shadow-sm" title="Modify Clearance"><Shield size={16}/></button>
                      <button onClick={() => onEditMember(m)} className="p-3 bg-white border border-gray-100 text-gray-400 rounded-xl hover:bg-gray-900 hover:text-white transition-all shadow-sm"><Edit size={16}/></button>
                      <button onClick={() => onDeleteMember(m.id)} className="p-3 bg-red-50 border border-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-32 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200 mb-4">
                      <Search size={32} />
                    </div>
                    <p className="text-lg font-bold font-serif text-gray-300 italic">No member sequences found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default DirectoryTab;
