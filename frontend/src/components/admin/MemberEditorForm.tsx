
import React, { useRef, useState } from 'react';
import { User as UserIcon, Camera, Upload, Mail, Phone, MapPin, Briefcase, GraduationCap, Info, UserCheck, Shield } from 'lucide-react';
import { User, Role } from '../../types';
import { DIOCESES, LEVELS, DEPARTMENTS } from '../../constants';

interface MemberEditorFormProps {
  editingItem: User | null;
  filePreview: string | null;
  urlInput: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const MemberEditorForm: React.FC<MemberEditorFormProps> = ({
  editingItem,
  filePreview,
  urlInput,
  onFileChange,
  onUrlChange,
  onSubmit
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentImage = filePreview || urlInput || editingItem?.profileImage || '';

  return (
    <form id="main-editor-form" onSubmit={onSubmit} className="space-y-10">
      {/* Profile Image Section */}
      <div className="flex flex-col items-center gap-6">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative w-32 h-32 rounded-[2.5rem] bg-gray-50 border-4 border-dashed border-gray-100 flex items-center justify-center cursor-pointer group overflow-hidden shadow-inner hover:border-cyan-400 transition-all"
        >
          {currentImage ? (
            <img src={currentImage} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" alt="Member" />
          ) : (
            <UserIcon size={40} className="text-gray-300 group-hover:text-cyan-500" />
          )}
          <div className="absolute inset-0 bg-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="text-cyan-600" size={24} />
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
          <h4 className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
            <UserCheck size={14}/> Core Identity
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Full Legal Name</label>
              <input 
                name="fullName" 
                defaultValue={editingItem?.fullName} 
                required 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-cyan-50 font-bold text-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Email Nexus</label>
              <input 
                name="email" 
                type="email"
                defaultValue={editingItem?.email} 
                required 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-cyan-50 font-bold text-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Phone Pulse</label>
              <input 
                name="phone" 
                defaultValue={editingItem?.phone} 
                required 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-cyan-50 font-bold text-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Security Tier</label>
              <div className="px-6 py-4 bg-gray-100 rounded-2xl text-gray-500 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <Shield size={14}/> {editingItem?.role || 'Guest'}
              </div>
            </div>
          </div>
        </div>

        {/* Academic Group */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
            <GraduationCap size={14}/> Academic Context
          </h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Program of Study</label>
              <input 
                name="program" 
                defaultValue={editingItem?.program} 
                required 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-cyan-50 font-bold text-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Current Level</label>
              <select 
                name="level" 
                defaultValue={editingItem?.level || LEVELS[0]} 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-cyan-50 font-bold text-sm"
              >
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Ecclesiological Group */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
            <Briefcase size={14}/> Church Connection
          </h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Diocese of Origin</label>
              <select 
                name="diocese" 
                defaultValue={editingItem?.diocese || DIOCESES[0]} 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-cyan-50 font-bold text-sm"
              >
                {DIOCESES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Ministry Department</label>
              <select 
                name="department" 
                defaultValue={editingItem?.department || DEPARTMENTS[0].name} 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-cyan-50 font-bold text-sm"
              >
                {DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-cyan-50 rounded-[2rem] border border-cyan-100 flex items-start gap-4">
        <Info className="text-cyan-500 shrink-0 mt-1" size={18} />
        <p className="text-[11px] font-medium leading-relaxed text-cyan-800">
          <span className="font-black uppercase tracking-tighter">Persistence Note:</span> Modifying these parameters will immediately update the Global Registry. Members may need to re-verify their identity if critical fields are altered.
        </p>
      </div>
    </form>
  );
};

export default MemberEditorForm;
