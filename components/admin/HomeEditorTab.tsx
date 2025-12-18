
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Home as HomeIcon } from 'lucide-react';
import { HomeConfig } from '../../types';

interface HomeEditorTabProps {
  homeSetup: HomeConfig | null;
  filePreview: string | null;
  urlInput: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const HomeEditorTab: React.FC<HomeEditorTabProps> = ({ 
  homeSetup, filePreview, urlInput, onFileChange, onUrlChange, onSubmit 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!homeSetup) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-10 rounded-[3rem] border border-gray-100 space-y-8 shadow-sm">
      <h3 className="text-2xl font-black font-serif italic text-gray-900 flex items-center gap-3">
        <HomeIcon className="text-cyan-500" /> Landing Page Setup
      </h3>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Hero Title</label>
              <input name="heroTitle" defaultValue={homeSetup.heroTitle} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-sm border-0 outline-none focus:ring-4 focus:ring-cyan-50" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Motto</label>
              <input name="motto" defaultValue={homeSetup.motto} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-sm border-0 outline-none focus:ring-4 focus:ring-cyan-50" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Hero Subtitle</label>
              <textarea name="heroSubtitle" rows={4} defaultValue={homeSetup.heroSubtitle} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-sm border-0 outline-none focus:ring-4 focus:ring-cyan-50" />
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Hero Background</label>
            <div onClick={() => fileInputRef.current?.click()} className="relative h-64 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100 flex items-center justify-center cursor-pointer overflow-hidden group">
               <img src={filePreview || homeSetup.heroImageUrl} className="w-full h-full object-cover group-hover:opacity-60 transition-opacity" alt="" />
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <Camera className="text-white" size={40} />
               </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" />
            <input value={urlInput} onChange={e => onUrlChange(e.target.value)} placeholder="Or paste image URL" className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-xs" />
          </div>
        </div>
        <button type="submit" className="px-10 py-5 bg-cyan-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-cyan-100 active:scale-95 transition-all">Commit Site Changes</button>
      </form>
    </motion.div>
  );
};

export default HomeEditorTab;
