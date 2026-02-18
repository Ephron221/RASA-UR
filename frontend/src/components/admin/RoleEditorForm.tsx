
import React from 'react';
import { Shield, User, Landmark, MessageSquare, Briefcase, CheckCircle2, Info, Star } from 'lucide-react';
import { User as MemberType, RoleDefinition } from '../../types';

interface RoleEditorFormProps {
  member: MemberType;
  roles: RoleDefinition[];
  onConfirm: (roleId: string) => void;
  isSyncing: boolean;
}

const IconMap: any = { Shield, User, Landmark, MessageSquare, Briefcase, Star };

const RoleEditorForm: React.FC<RoleEditorFormProps> = ({ member, roles, onConfirm, isSyncing }) => {
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>(member.role);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6 p-6 bg-cyan-50 rounded-[2rem] border border-cyan-100">
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-cyan-600 font-black text-2xl shadow-sm">
          {member.profileImage ? <img src={member.profileImage} className="w-full h-full object-cover rounded-2xl" alt="" /> : member.fullName.charAt(0)}
        </div>
        <div>
          <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">Target Identity</p>
          <h4 className="text-xl font-black text-gray-900 leading-tight">{member.fullName}</h4>
          <p className="text-xs font-bold text-gray-400">{member.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-[0.3em]">Select Clearance Definition</label>
        <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-2 scroll-hide">
          {roles.map((role) => {
            const Icon = IconMap[role.icon] || User;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`flex items-start gap-5 p-5 rounded-[2rem] border-2 transition-all text-left group ${
                  selectedRoleId === role.id 
                    ? 'border-cyan-500 bg-cyan-50/30 shadow-lg' 
                    : 'border-gray-50 bg-white hover:border-gray-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${selectedRoleId === role.id ? 'bg-gray-900 text-cyan-400' : 'bg-gray-50 text-gray-400'}`}>
                  <Icon size={22} />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-black uppercase tracking-tight ${selectedRoleId === role.id ? 'text-gray-900' : 'text-gray-400'}`}>{role.label}</span>
                    {selectedRoleId === role.id && <CheckCircle2 className="text-cyan-500" size={18} />}
                  </div>
                  <p className="text-[11px] font-bold text-gray-400 mb-3">{role.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.slice(0, 4).map((p, i) => (
                      <span key={i} className="text-[8px] font-black px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md uppercase tracking-widest">
                        {p.split('.')[1]?.replace('_', ' ')}
                      </span>
                    ))}
                    {role.permissions.length > 4 && <span className="text-[8px] font-black px-2 py-0.5 bg-gray-50 text-gray-400 rounded-md uppercase tracking-widest">+{role.permissions.length - 4} More</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 bg-gray-900 rounded-[2rem] text-white flex items-start gap-4">
        <Info className="text-cyan-400 shrink-0 mt-1" size={20} />
        <p className="text-[11px] font-medium leading-relaxed text-gray-400">
          <span className="text-white font-black uppercase">IT Protocol:</span> Clearance changes take effect on next member handshake. Custom roles defined in the Clearance Architect will appear here automatically.
        </p>
      </div>

      <div className="pt-4">
        <button
          onClick={() => onConfirm(selectedRoleId)}
          disabled={isSyncing || selectedRoleId === member.role}
          className="w-full py-5 bg-cyan-500 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-cyan-600 disabled:opacity-30 transition-all active:scale-95"
        >
          Confirm Role Migration
        </button>
      </div>
    </div>
  );
};

export default RoleEditorForm;
