
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Home as HomeIcon, Edit3, Image as ImageIcon, Sparkles, Quote, BarChart3 } from 'lucide-react';
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
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const aboutFileInputRef = useRef<HTMLInputElement>(null);
  
  // Track separate preview for vision image
  const [visionPreview, setVisionPreview] = useState<string | null>(null);

  const handleVisionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setVisionPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (!homeSetup) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-10 rounded-[3rem] border border-gray-100 space-y-12 shadow-sm">
      <div className="flex justify-between items-center border-b border-gray-50 pb-8">
        <h3 className="text-3xl font-black font-serif italic text-gray-900 flex items-center gap-4">
          <HomeIcon className="text-cyan-500" size={32} /> Visual Identity & Message
        </h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Website Landing Hub</p>
      </div>

      <form onSubmit={(e) => {
        // Intercept to add vision image if updated
        if (visionPreview) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'aboutImageUrl_hidden';
          input.value = visionPreview;
          (e.target as HTMLFormElement).appendChild(input);
        }
        onSubmit(e);
      }} className="space-y-12">
        
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
              <div onClick={() => heroFileInputRef.current?.click()} className="relative h-72 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100 flex items-center justify-center cursor-pointer overflow-hidden group shadow-inner">
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
              <input type="file" ref={heroFileInputRef} onChange={onFileChange} className="hidden" accept="image/*" />
              <input 
                name="heroImageUrl_manual"
                value={urlInput} 
                onChange={e => onUrlChange(e.target.value)} 
                placeholder="Direct Image Asset URL (Optional)" 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-[10px] border-0 outline-none focus:bg-white" 
              />
            </div>
          </div>
        </div>

        {/* Section 2: About / Vision Overview */}
        <div className="pt-12 border-t border-gray-50 space-y-8">
          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-600">
            <Edit3 size={18} /> Our Sacred Vision Section
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Introduction Title</label>
                <input 
                  name="aboutTitle" 
                  defaultValue={homeSetup.aboutTitle} 
                  className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold text-base border-0 outline-none focus:ring-4 focus:ring-cyan-50 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Mission Narrative</label>
                <textarea 
                  name="aboutText" 
                  rows={6} 
                  defaultValue={homeSetup.aboutText} 
                  className="w-full px-8 py-6 bg-gray-50 rounded-3xl font-medium text-base border-0 outline-none focus:ring-4 focus:ring-cyan-50 transition-all leading-relaxed" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Vision Image</label>
              <div onClick={() => aboutFileInputRef.current?.click()} className="relative h-72 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100 flex items-center justify-center cursor-pointer overflow-hidden group shadow-inner">
                 <img 
                    src={visionPreview || homeSetup.aboutImageUrl} 
                    className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" 
                    alt="Vision Section" 
                 />
                 <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-cyan-600/10">
                   <Camera className="text-cyan-600 mb-2" size={40} />
                   <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">Update Vision Pic</span>
                 </div>
              </div>
              <input type="file" ref={aboutFileInputRef} onChange={handleVisionFileChange} className="hidden" accept="image/*" />
            </div>
          </div>

          {/* Scripture & Stats Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6 p-8 bg-gray-50 rounded-[2.5rem]">
              <h5 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-600">
                <Quote size={16} /> Featured Scripture
              </h5>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 ml-2 uppercase">Scripture Quote</label>
                  <input name="aboutScripture" defaultValue={homeSetup.aboutScripture} className="w-full px-5 py-3 bg-white rounded-xl font-bold text-sm border-0 outline-none focus:ring-2 focus:ring-cyan-100" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 ml-2 uppercase">Scripture Reference</label>
                  <input name="aboutScriptureRef" defaultValue={homeSetup.aboutScriptureRef} className="w-full px-5 py-3 bg-white rounded-xl font-bold text-sm border-0 outline-none focus:ring-2 focus:ring-cyan-100" />
                </div>
              </div>
            </div>

            <div className="space-y-6 p-8 bg-gray-50 rounded-[2.5rem]">
              <h5 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-600">
                <BarChart3 size={16} /> Dynamic Statistics
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 ml-2 uppercase">Stat 1 Value</label>
                    <input name="stat1Value" defaultValue={homeSetup.stat1Value} className="w-full px-5 py-3 bg-white rounded-xl font-black text-lg border-0 outline-none focus:ring-2 focus:ring-cyan-100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 ml-2 uppercase">Stat 1 Label</label>
                    <input name="stat1Label" defaultValue={homeSetup.stat1Label} className="w-full px-5 py-3 bg-white rounded-xl font-bold text-[10px] border-0 outline-none focus:ring-2 focus:ring-cyan-100" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 ml-2 uppercase">Stat 2 Value</label>
                    <input name="stat2Value" defaultValue={homeSetup.stat2Value} className="w-full px-5 py-3 bg-white rounded-xl font-black text-lg border-0 outline-none focus:ring-2 focus:ring-cyan-100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 ml-2 uppercase">Stat 2 Label</label>
                    <input name="stat2Label" defaultValue={homeSetup.stat2Label} className="w-full px-5 py-3 bg-white rounded-xl font-bold text-[10px] border-0 outline-none focus:ring-2 focus:ring-cyan-100" />
                  </div>
                </div>
              </div>
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
