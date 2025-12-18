
import React from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Shield, Edit, Trash2 } from 'lucide-react';
import { User } from '../../types';

interface DirectoryTabProps {
  members: User[];
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onNewMember: () => void;
  onEditMember: (member: User) => void;
  onDeleteMember: (id: string) => void;
  onToggleAdmin: (member: User) => void;
}

const DirectoryTab: React.FC<DirectoryTabProps> = ({ 
  members, searchTerm, onSearchChange, onNewMember, onEditMember, onDeleteMember, onToggleAdmin 
}) => {
  const filteredMembers = members.filter(m => 
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text" 
            placeholder="Search members..." 
            value={searchTerm} 
            onChange={(e) => onSearchChange(e.target.value)} 
            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none shadow-sm" 
          />
        </div>
        <button onClick={onNewMember} className="w-full sm:w-auto px-8 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
          <UserPlus size={16} /> New Member
        </button>
      </div>
      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Member</th>
                <th className="px-8 py-5">Program</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredMembers.map(m => (
                <tr key={m.id} className="group hover:bg-cyan-50/20 transition-all">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600 font-black overflow-hidden shrink-0">
                        {m.profileImage ? <img src={m.profileImage} className="w-full h-full object-cover" alt="" /> : m.fullName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-gray-900 truncate">{m.fullName}</p>
                        <p className="text-[10px] text-gray-400 font-bold truncate">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-xs font-bold text-gray-600 truncate">{m.program}</p>
                    <p className="text-[9px] text-gray-400">{m.level}</p>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${m.role === 'admin' ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {m.role}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onToggleAdmin(m)} className="p-2.5 bg-cyan-50 text-cyan-500 rounded-xl hover:bg-cyan-500 hover:text-white transition-all" title="Toggle Admin Role"><Shield size={16}/></button>
                      <button onClick={() => onEditMember(m)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-900 hover:text-white transition-all"><Edit size={16}/></button>
                      <button onClick={() => onDeleteMember(m.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-gray-300 italic">No members match your search criteria.</td>
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
