import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, User as UserIcon, Phone, Loader2, Save } from 'lucide-react';
import { User } from '../../types';

interface MemberProfileTabProps {
  currentUser: User;
  onUpdateProfile: (updates: Partial<User>) => Promise<void>;
  isSaving: boolean;
}

const MemberProfileTab: React.FC<MemberProfileTabProps> = ({ currentUser, onUpdateProfile, isSaving }) => {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updates = {
      fullName: formData.get('fullName') as string,
      phone: formData.get('phone') as string,
      profileImage: filePreview || currentUser.profileImage
    };
    onUpdateProfile(updates);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto pb-20">
      <div className="bg-white rounded-[3.5rem] overflow-hidden shadow-sm border border-gray-100">
        <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
           <div className="space-y-1">
              <h3 className="text-2xl font-black font-serif italic text-black leading-none">Identity Sync</h3>
              <p className="text-[9px] font-black text-black/30 uppercase tracking-widest">Update your Archival Parameters</p>
           </div>
        </div>
        <form onSubmit={handleSubmit} className="p-12 space-y-8">
           <div className="flex flex-col items-center gap-4">
              <div 
                onClick={() => fileInputRef.current?.click()} 
                className="w-32 h-32 rounded-[3rem] bg-gray-100 border-4 border-dashed border-gray-200 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-secondary hover:bg-white transition-all relative shadow-inner"
              >
                 {filePreview || currentUser.profileImage ? (
                   <img src={filePreview || currentUser.profileImage} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" alt=""/>
                 ) : (
                   <Camera className="text-black/40 group-hover:text-secondary transition-colors" size={32}/>
                 )}
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="text-secondary" size={24}/></div>
              </div>
              <input type="file" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if(f){ const r = new FileReader(); r.onloadend = () => setFilePreview(r.result as string); r.readAsDataURL(f); } }} className="hidden" accept="image/*" />
              <p className="text-[10px] font-black uppercase text-black/30 tracking-widest">Member Portrait</p>
           </div>
           
           <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-black/40 uppercase ml-4 tracking-widest">Full Legal Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" size={18}/>
                  <input name="fullName" defaultValue={currentUser.fullName} required className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-[1.8rem] font-bold border-none focus:ring-4 focus:ring-secondary/5 outline-none text-black" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-black/40 uppercase ml-4 tracking-widest">Phone Pulse</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" size={18}/>
                  <input name="phone" defaultValue={currentUser.phone} required className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-[1.8rem] font-bold border-none focus:ring-4 focus:ring-secondary/5 outline-none text-black" />
                </div>
             </div>
           </div>

           <button type="submit" disabled={isSaving} className="w-full py-6 bg-secondary text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 hover:bg-black transition-all active:scale-95 disabled:opacity-50">
              {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20}/>} Commit Changes
           </button>
        </form>
      </div>
    </motion.div>
  );
};

export default MemberProfileTab;
