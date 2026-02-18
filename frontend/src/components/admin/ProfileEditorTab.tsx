
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Camera, Upload, Shield, Database, Loader2, Save, Mail, Phone, MapPin, Briefcase, GraduationCap, Star } from 'lucide-react';
import { User } from '../../types';
import { DIOCESES, DEPARTMENTS, LEVELS } from '../../constants';

interface ProfileEditorTabProps {
  user: User;
  onUpdate: (updatedUser: User) => Promise<void>;
  isSyncing: boolean;
}

const ProfileEditorTab: React.FC<ProfileEditorTabProps> = ({ user, onUpdate, isSyncing }) => {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedUser: User = {
      ...user,
      fullName: formData.get('fullName') as string,
      phone: formData.get('phone') as string,
      diocese: formData.get('diocese') as string,
      department: formData.get('department') as string,
      level: formData.get('level') as string,
      program: formData.get('program') as string,
      profileImage: filePreview || user.profileImage
    };
    await onUpdate(updatedUser);
  };

  const isIT = user.role === 'it';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="bg-white p-10 md:p-16 rounded-[4rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <UserIcon size={300} />
        </div>

        <div className="relative z-10 space-y-12">
          <header className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-gray-50 pb-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer"
              >
                <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500 to-blue-400 rounded-[3rem] blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative w-40 h-40 bg-gray-50 rounded-[2.8rem] border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center">
                  {(filePreview || user.profileImage) ? (
                    <img src={filePreview || user.profileImage} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Admin" />
                  ) : (
                    <UserIcon size={64} className="text-gray-300" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-[2px]">
                    <Camera className="text-white" size={32} />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>

              <div className="text-center md:text-left space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-50 text-cyan-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-cyan-100">
                  {isIT ? <Shield size={12}/> : <Star size={12}/>} Security Tier: {user.role}
                </div>
                <h3 className="text-4xl font-black font-serif italic text-gray-900 leading-none">{user.fullName}</h3>
                <p className="text-gray-400 font-bold flex items-center justify-center md:justify-start gap-2">
                  <Mail size={14} className="text-cyan-500" /> {user.email}
                </p>
              </div>
            </div>

            <button 
              form="admin-profile-form"
              type="submit"
              disabled={isSyncing}
              className="px-10 py-5 bg-gray-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-gray-200 hover:bg-cyan-500 transition-all flex items-center gap-3 active:scale-95"
            >
              {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Sequence Commitment
            </button>
          </header>

          <form id="admin-profile-form" ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-600 ml-4">Identification Layers</h4>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 ml-4 uppercase">Full Legal Identity</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500 transition-colors" size={18} />
                    <input name="fullName" defaultValue={user.fullName} required className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-transparent focus:border-cyan-100 focus:bg-white rounded-3xl font-bold text-sm outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 ml-4 uppercase">Direct Pulse Line (Phone)</label>
                  <div className="relative group">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500 transition-colors" size={18} />
                    <input name="phone" defaultValue={user.phone} required className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-transparent focus:border-cyan-100 focus:bg-white rounded-3xl font-bold text-sm outline-none transition-all" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-600 ml-4">Administrative Context</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 ml-4 uppercase">Ecclesiological Diocese</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-500" size={18} />
                    <select name="diocese" defaultValue={user.diocese} className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-cyan-100 focus:bg-white rounded-3xl font-bold text-sm outline-none cursor-pointer appearance-none">
                      {DIOCESES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 ml-4 uppercase">Official Department</label>
                  <div className="relative">
                    <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-500" size={18} />
                    <select name="department" defaultValue={user.department} className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-cyan-100 focus:bg-white rounded-3xl font-bold text-sm outline-none cursor-pointer appearance-none">
                      {DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[9px] font-black text-gray-400 ml-4 uppercase">Academic Clearance Level</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-500" size={18} />
                    <select name="level" defaultValue={user.level} className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-cyan-100 focus:bg-white rounded-3xl font-bold text-sm outline-none cursor-pointer appearance-none">
                      {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[9px] font-black text-gray-400 ml-4 uppercase">Academic Domain (Program)</label>
                  <input name="program" defaultValue={user.program} required className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-cyan-100 focus:bg-white rounded-3xl font-bold text-sm outline-none transition-all" />
                </div>
              </div>
            </div>
          </form>

          <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-gray-400">
               <Database size={20} />
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Persistence Layer</p>
                  <p className="text-[9px] font-bold">Authenticated Admin ID: {user.id}</p>
               </div>
            </div>
            <div className="px-6 py-3 bg-cyan-50 text-cyan-700 rounded-2xl border border-cyan-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping"></div> Global Synchronization Active
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileEditorTab;
