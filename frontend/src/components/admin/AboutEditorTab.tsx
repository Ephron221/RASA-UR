
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Image as ImageIcon, History, Target, Sparkles, Star, Plus, Trash2, Save, Loader2, Camera, X } from 'lucide-react';
import { AboutConfig, AboutValue, TimelineEvent } from '../../types';

interface AboutEditorTabProps {
  config: AboutConfig | null;
  onSubmit: (updates: Partial<AboutConfig>) => void;
  isSyncing: boolean;
}

const AboutEditorTab: React.FC<AboutEditorTabProps> = ({ config, onSubmit, isSyncing }) => {
  const [localConfig, setLocalConfig] = useState<AboutConfig | null>(config);
  const [historyPreview, setHistoryPreview] = useState<string | null>(null);
  const historyFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (config) {
      setLocalConfig({
        ...config,
        values: config.values || [],
        timeline: config.timeline || []
      });
    }
  }, [config]);

  if (!localConfig) return (
    <div className="py-20 text-center space-y-4">
      <Loader2 className="animate-spin mx-auto text-cyan-500" size={40} />
      <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Awaiting Heritage Stream...</p>
    </div>
  );

  const handleChange = (field: string, value: any) => {
    setLocalConfig({ ...localConfig, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setHistoryPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const updateValue = (id: string, field: string, value: string) => {
    const newValues = (localConfig.values || []).map(v => v.id === id ? { ...v, [field]: value } : v);
    handleChange('values', newValues);
  };

  const updateTimeline = (id: string, field: string, value: string) => {
    const newTimeline = (localConfig.timeline || []).map(t => t.id === id ? { ...t, [field]: value } : t);
    handleChange('timeline', newTimeline);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUpdates = { ...localConfig };
    if (historyPreview) finalUpdates.historyImage = historyPreview;
    onSubmit(finalUpdates);
  };

  const displayImage = historyPreview || localConfig.historyImage || 'https://images.unsplash.com/photo-1544427928-c49cdfebf193?q=80&w=2000';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-3xl font-black font-serif italic text-gray-900 flex items-center gap-4">
            <History className="text-cyan-500" size={32} /> Legacy & Heritage Editor
          </h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">About Us Management Hub</p>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={isSyncing}
          className="px-8 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-cyan-600 transition-all active:scale-95"
        >
          {isSyncing ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} Persistent Legacy
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-8 space-y-10">
          
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
            <h4 className="text-sm font-black uppercase text-cyan-600 tracking-widest flex items-center gap-2">
              <Edit3 size={18}/> Genesis & History
            </h4>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 ml-4 uppercase">History Headline</label>
                   <input value={localConfig.historyTitle || ''} onChange={e => handleChange('historyTitle', e.target.value)} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none focus:bg-white border-2 border-transparent focus:border-cyan-100 transition-all" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 ml-4 uppercase">Hero Backdrop (Title)</label>
                   <input value={localConfig.heroTitle || ''} onChange={e => handleChange('heroTitle', e.target.value)} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none focus:bg-white border-2 border-transparent focus:border-cyan-100 transition-all" />
                 </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 ml-4 uppercase">History Narrative</label>
                <textarea rows={6} value={localConfig.historyContent || ''} onChange={e => handleChange('historyContent', e.target.value)} className="w-full px-8 py-6 bg-gray-50 rounded-3xl font-medium text-base outline-none focus:bg-white border-2 border-transparent focus:border-cyan-100 transition-all resize-none leading-relaxed" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 ml-4 uppercase">Narrative Visualization</label>
                <div onClick={() => historyFileRef.current?.click()} className="relative h-64 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100 flex items-center justify-center cursor-pointer overflow-hidden group shadow-inner">
                  {displayImage ? (
                    <img src={displayImage} className="w-full h-full object-cover group-hover:opacity-30 transition-opacity" alt="History" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <ImageIcon className="text-gray-300" size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-cyan-600/5">
                    <Camera className="text-cyan-600 mb-2" size={32} />
                    <span className="text-[10px] font-black text-cyan-600 uppercase">Change Story Image</span>
                  </div>
                </div>
                <input type="file" ref={historyFileRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { key: 'vision', icon: Target, title: 'Our Vision' },
              { key: 'mission', icon: Sparkles, title: 'Our Mission' }
            ].map((sec, i) => (
              <div key={`vm-${sec.key}-${i}`} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
                <h4 className="text-sm font-black uppercase text-cyan-600 tracking-widest flex items-center gap-2">
                  <sec.icon size={18}/> {sec.title}
                </h4>
                <div className="space-y-4">
                  <input value={(localConfig as any)[`${sec.key}Title`] || ''} onChange={e => handleChange(`${sec.key}Title`, e.target.value)} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none focus:bg-white border border-transparent focus:border-cyan-100" />
                  <textarea rows={4} value={(localConfig as any)[`${sec.key}Content`] || ''} onChange={e => handleChange(`${sec.key}Content`, e.target.value)} className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-medium text-sm outline-none focus:bg-white border border-transparent focus:border-cyan-100 resize-none leading-relaxed" />
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className="xl:col-span-4 space-y-10">
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
            <h4 className="text-sm font-black uppercase text-cyan-600 tracking-widest flex items-center justify-between">
              Core Values <Star size={18}/>
            </h4>
            <div className="space-y-6">
              {(localConfig.values || []).map((val, i) => (
                <div key={val.id || `val-${i}`} className="p-6 bg-gray-50 rounded-3xl space-y-4 relative group">
                  <div className="space-y-2">
                    <input value={val.title} onChange={e => updateValue(val.id, 'title', e.target.value)} className="w-full bg-white px-4 py-2 rounded-xl font-bold text-xs outline-none border border-transparent focus:border-cyan-200" />
                    <textarea value={val.description} onChange={e => updateValue(val.id, 'description', e.target.value)} className="w-full bg-white px-4 py-2 rounded-xl font-medium text-[11px] outline-none border border-transparent focus:border-cyan-200 resize-none" rows={2} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 p-10 rounded-[3rem] text-white space-y-8 shadow-2xl">
            <h4 className="text-sm font-black uppercase text-cyan-400 tracking-widest flex items-center justify-between">
              Historical Timeline <History size={18}/>
            </h4>
            <div className="space-y-6">
              {(localConfig.timeline || []).map((item, i) => (
                <div key={item.id || `timeline-${i}`} className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-3 relative group hover:bg-white/10 transition-all">
                  <div className="flex gap-4">
                    <input value={item.year} onChange={e => updateTimeline(item.id, 'year', e.target.value)} className="w-20 bg-cyan-500/20 px-3 py-1.5 rounded-lg font-black text-cyan-400 text-xs outline-none border border-cyan-500/20" />
                    <input value={item.title} onChange={e => updateTimeline(item.id, 'title', e.target.value)} className="flex-grow bg-transparent px-2 py-1.5 font-bold text-sm outline-none border-b border-white/10 focus:border-cyan-400" />
                  </div>
                  <textarea value={item.description} onChange={e => updateTimeline(item.id, 'description', e.target.value)} className="w-full bg-transparent px-2 py-1.5 text-[11px] text-gray-400 outline-none resize-none border-none" rows={2} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default AboutEditorTab;
