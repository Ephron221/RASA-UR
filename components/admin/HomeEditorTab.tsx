
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Home as HomeIcon, Edit3, Type, Image as ImageIcon } from 'lucide-react';
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-10 rounded-[3rem] border border-gray-100 space-y-12 shadow-sm">
      <div className="flex justify-between items-center border-b border-gray-50 pb-8">
        <h3 className="text-3xl font-black font-serif italic text-gray-900 flex items-center gap-4">
          <HomeIcon className="text-cyan-500" size={32} /> Visual Identity & Message
        </h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Website Landing Hub</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-12">
        {/* Section 1: Hero Identity */}
        <div className="space-y-8">
          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-600">
            <ImageIcon size={18} /> Hero / Landing Section
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Main Headline</label>
                <input 
                  name="heroTitle" 
                  defaultValue={homeSetup.heroTitle} 
                  className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold text-base border-0 outline-none focus:ring-4 focus:ring-cyan-50 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Active Motto</label>
                <input 
                  name="motto" 
                  defaultValue={homeSetup.motto} 
                  className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold text-sm border-0 outline-none focus:ring-4 focus:ring-cyan-50 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Sub-message Narrative</label>
                <textarea 
                  name="heroSubtitle" 
                  rows={4} 
                  defaultValue={homeSetup.heroSubtitle} 
                  className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold text-sm border-0 outline-none focus:ring-4 focus:ring-cyan-50 transition-all resize-none" 
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Hero Background Asset</label>
              <div onClick={() => fileInputRef.current?.click()} className="relative h-72 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100 flex items-center justify-center cursor-pointer overflow-hidden group shadow-inner">
                 <img 
                    src={filePreview || homeSetup.heroImageUrl} 
                    className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" 
                    alt="Hero Backdrop" 
                 />
                 <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-cyan-600/10">
                   <Camera className="text-cyan-600 mb-2" size={40} />
                   <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">Update Imagery</span>
                 </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/*" />
              <input 
                value={urlInput} 
                onChange={e => onUrlChange(e.target.value)} 
                placeholder="Direct Image Asset URL (Optional)" 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-[10px] border-0 outline-none focus:bg-white" 
              />
            </div>
          </div>
        </div>

        {/* Section 2: About / Overview Identity */}
        <div className="pt-12 border-t border-gray-50 space-y-8">
          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-600">
            <Edit3 size={18} /> Brief Overview Section
          </h4>
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Introduction Title</label>
              <input 
                name="aboutTitle" 
                defaultValue={homeSetup.aboutTitle || 'Who We Are'} 
                className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold text-base border-0 outline-none focus:ring-4 focus:ring-cyan-50 transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Mission Description (The "Brief Introduction")</label>
              <textarea 
                name="aboutText" 
                rows={6} 
                defaultValue={homeSetup.aboutText || 'RASA is a vibrant community of students...'} 
                className="w-full px-8 py-6 bg-gray-50 rounded-3xl font-medium text-base border-0 outline-none focus:ring-4 focus:ring-cyan-50 transition-all leading-relaxed" 
              />
            </div>
          </div>
        </div>

        <div className="pt-10 flex justify-end">
          <button 
            type="submit" 
            className="px-16 py-6 bg-cyan-500 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-cyan-500/30 hover:bg-cyan-600 active:scale-95 transition-all"
          >
            Commit All Landing Changes
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default HomeEditorTab;
