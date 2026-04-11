
import React, { useRef, useState, useEffect } from 'react';
import { User as UserIcon, Camera, UserCheck, Shield, GraduationCap, Calendar, Briefcase, Info, PlusCircle } from 'lucide-react';
import { User, Department } from '../../types';
import { DIOCESES, LEVELS, DEPARTMENTS as DEPT_CONSTANTS } from '../../constants';
// Fix framer-motion prop errors by casting motion to any
import { motion as motionLib, AnimatePresence } from 'framer-motion';
const motion = motionLib as any;

interface MemberEditorFormProps {
  editingItem: User | null;
  filePreview: string | null;
  urlInput: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  departments?: Department[];
}

const MemberEditorForm: React.FC<MemberEditorFormProps> = ({
  editingItem,
  filePreview,
  urlInput,
  onFileChange,
  onUrlChange,
  onSubmit,
  departments = []
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentImage = filePreview || urlInput || editingItem?.profileImage || '';
  
  const deptList = departments.length > 0 ? departments : DEPT_CONSTANTS;
  
  // Logic to detect if the existing department is custom
  const isCustomDept = editingItem && editingItem.department && !deptList.some(d => d.name === editingItem.department);
  const [deptChoice, setDeptChoice] = useState(isCustomDept ? 'Other' : (editingItem?.department || deptList[0]?.name || ''));

  return (
    <form id="main-editor-form" onSubmit={onSubmit} className="space-y-10">
      {/* Profile Image Section */}
      <div className="flex flex-col items-center gap-6">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative w-32 h-32 rounded-[2.5rem] bg-gray-50 border-4 border-dashed border-gray-100 flex items-center justify-center cursor-pointer group overflow-hidden shadow-inner hover:border-secondary transition-all"
        >
          {currentImage ? (
            <img src={currentImage} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" alt="Member" />
          ) : (
            <UserIcon size={40} className="text-gray-300 group-hover:text-secondary" />
          )}
          <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="text-secondary" size={24} />
          </div>
        </div>
        <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/*" />
        <div className="text-center">
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Member Portrait</p>
          <input 
            value={urlInput} 
            onChange={e => onUrlChange(e.target.value)} 
            placeholder="Or paste CDN URL..." 
            className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[9px] font-bold outline-none focus:bg-white w-48 text-center" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Identity Group */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
            <UserCheck size={14}/> Core Identity
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Full Legal Name</label>
              <input 
                name="fullName" 
                defaultValue={editingItem?.fullName} 
                required 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-secondary/5 font-bold text-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Email Nexus</label>
              <input 
                name="email" 
                type="email"
                defaultValue={editingItem?.email} 
                required 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-secondary/5 font-bold text-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Phone Pulse</label>
              <input 
                name="phone" 
                defaultValue={editingItem?.phone} 
                required 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-secondary/5 font-bold text-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Gender Essence</label>
              <select 
                name="gender" 
                defaultValue={editingItem?.gender || 'Male'} 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-secondary/5 font-bold text-sm"
              >
                <option value="Male">Boy (Male)</option>
                <option value="Female">Girl (Female)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Academic Group */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
            <GraduationCap size={14}/> Academic Context
          </h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Program of Study</label>
              <input 
                name="program" 
                defaultValue={editingItem?.program} 
                required 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-secondary/5 font-bold text-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Current Level</label>
              <select 
                name="level" 
                defaultValue={editingItem?.level || LEVELS[0]} 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-secondary/5 font-bold text-sm"
              >
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4 flex items-center gap-1">
                <Calendar size={10}/> Academic Year <span className="text-red-500">*</span>
              </label>
              <input 
                name="academicYear" 
                defaultValue={editingItem?.academicYear} 
                placeholder="e.g. 2024-2025"
                required 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-secondary/5 font-bold text-sm" 
              />
            </div>
          </div>
        </div>

        {/* Ecclesiological Group */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
            <Briefcase size={14}/> Church Connection
          </h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Diocese of Origin</label>
              <select 
                name="diocese" 
                defaultValue={editingItem?.diocese || DIOCESES[0]} 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-secondary/5 font-bold text-sm"
              >
                {DIOCESES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Ministry Department</label>
                <select 
                  name="department_choice" 
                  value={deptChoice}
                  onChange={(e) => setDeptChoice(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-secondary/5 font-bold text-sm"
                >
                  {deptList.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  <option value="Other">Other / Not Listed</option>
                </select>
              </div>

              <AnimatePresence>
                {deptChoice === 'Other' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="relative space-y-2"
                  >
                    <label className="text-[9px] font-black text-secondary uppercase ml-4">Custom Ministry Name</label>
                    <div className="relative">
                      <PlusCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                      <input 
                        name="department" 
                        defaultValue={isCustomDept ? editingItem?.department : ''} 
                        required 
                        placeholder="Type your ministry name..." 
                        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-secondary/20 rounded-2xl outline-none font-bold text-sm text-black shadow-sm" 
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Hidden field to pass regular department if not 'Other' */}
              {deptChoice !== 'Other' && (
                <input type="hidden" name="department" value={deptChoice} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-secondary/5 rounded-[2rem] border border-secondary/10 flex items-start gap-4">
        <Info className="text-secondary shrink-0 mt-1" size={18} />
        <p className="text-[11px] font-medium leading-relaxed text-secondary/80">
          <span className="font-black uppercase tracking-tighter">Persistence Note:</span> Modifying these parameters will immediately update the Global Registry. Ensure gender and academic year are correct for accurate reporting.
        </p>
      </div>
    </form>
  );
};

export default MemberEditorForm;
