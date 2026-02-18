
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle, Music, Type, Save, Loader2, Globe, Info } from 'lucide-react';
import { FooterConfig } from '../../types';

interface FooterEditorTabProps {
  config: FooterConfig | null;
  onSubmit: (updates: FooterConfig) => void;
  isSyncing: boolean;
}

const FooterEditorTab: React.FC<FooterEditorTabProps> = ({ config, onSubmit, isSyncing }) => {
  const [localConfig, setLocalConfig] = useState<FooterConfig | null>(config);

  useEffect(() => {
    if (config) {
      setLocalConfig(config);
    }
  }, [config]);

  if (!localConfig) return (
    <div className="py-20 text-center space-y-4">
      <Loader2 className="animate-spin mx-auto text-cyan-500" size={40} />
      <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Handshaking with Footer Module...</p>
    </div>
  );

  const handleChange = (field: keyof FooterConfig, value: string) => {
    setLocalConfig({ ...localConfig, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(localConfig);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10">
        <header className="flex justify-between items-center border-b border-gray-50 pb-8">
          <div className="space-y-1">
            <h3 className="text-3xl font-black font-serif italic text-gray-900 flex items-center gap-4">
              <Globe className="text-cyan-500" size={32} /> Global Footer Control
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Public visibility & connectivity settings</p>
          </div>
          <button 
            onClick={handleSubmit} 
            disabled={isSyncing}
            className="px-10 py-5 bg-gray-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-cyan-500 transition-all flex items-center gap-3 active:scale-95"
          >
            {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Sequence Commitment
          </button>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Section 1: Bio & Core Info */}
          <div className="space-y-8">
            <div className="space-y-4">
               <h4 className="text-[11px] font-black text-cyan-600 uppercase tracking-[0.4em] ml-4 flex items-center gap-2"><Info size={14}/> Association Narrative</h4>
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Footer Bio Description</label>
                 <textarea 
                  value={localConfig.description} 
                  onChange={e => handleChange('description', e.target.value)} 
                  rows={4} 
                  className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-cyan-100 focus:bg-white rounded-[2.5rem] outline-none font-medium text-sm transition-all resize-none leading-relaxed shadow-inner" 
                 />
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-[11px] font-black text-cyan-600 uppercase tracking-[0.4em] ml-4 flex items-center gap-2"><MapPin size={14}/> Reach Points</h4>
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Physical Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input value={localConfig.address} onChange={e => handleChange('address', e.target.value)} className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-transparent focus:border-cyan-100 focus:bg-white rounded-[1.8rem] font-bold text-sm outline-none transition-all shadow-inner" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Official Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input value={localConfig.phone} onChange={e => handleChange('phone', e.target.value)} className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-transparent focus:border-cyan-100 focus:bg-white rounded-[1.8rem] font-bold text-sm outline-none transition-all shadow-inner" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Support Email</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input value={localConfig.email} onChange={e => handleChange('email', e.target.value)} className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-transparent focus:border-cyan-100 focus:bg-white rounded-[1.8rem] font-bold text-sm outline-none transition-all shadow-inner" />
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Section 2: Social Media Hub */}
          <div className="space-y-8">
             <h4 className="text-[11px] font-black text-cyan-600 uppercase tracking-[0.4em] ml-4 flex items-center gap-2"><Facebook size={14}/> Social Nexus Links</h4>
             <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Facebook URL</label>
                  <div className="relative">
                    <Facebook className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                    <input value={localConfig.facebookUrl} onChange={e => handleChange('facebookUrl', e.target.value)} className="w-full pl-16 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] font-bold text-xs outline-none focus:bg-white transition-all shadow-inner" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Instagram URL</label>
                  <div className="relative">
                    <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 text-rose-500" size={18} />
                    <input value={localConfig.instagramUrl} onChange={e => handleChange('instagramUrl', e.target.value)} className="w-full pl-16 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] font-bold text-xs outline-none focus:bg-white transition-all shadow-inner" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-4">YouTube Channel URL</label>
                  <div className="relative">
                    <Youtube className="absolute left-6 top-1/2 -translate-y-1/2 text-red-600" size={18} />
                    <input value={localConfig.youtubeUrl} onChange={e => handleChange('youtubeUrl', e.target.value)} className="w-full pl-16 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] font-bold text-xs outline-none focus:bg-white transition-all shadow-inner" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-4">WhatsApp Link</label>
                  <div className="relative">
                    <MessageCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                    <input value={localConfig.whatsappUrl} onChange={e => handleChange('whatsappUrl', e.target.value)} className="w-full pl-16 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] font-bold text-xs outline-none focus:bg-white transition-all shadow-inner" placeholder="https://wa.me/..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-4">TikTok Profile URL</label>
                  <div className="relative">
                    <Music className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-900" size={18} />
                    <input value={localConfig.tiktokUrl} onChange={e => handleChange('tiktokUrl', e.target.value)} className="w-full pl-16 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] font-bold text-xs outline-none focus:bg-white transition-all shadow-inner" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Twitter/X URL</label>
                  <div className="relative">
                    <Twitter className="absolute left-6 top-1/2 -translate-y-1/2 text-sky-400" size={18} />
                    <input value={localConfig.twitterUrl} onChange={e => handleChange('twitterUrl', e.target.value)} className="w-full pl-16 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] font-bold text-xs outline-none focus:bg-white transition-all shadow-inner" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-4">LinkedIn URL</label>
                  <div className="relative">
                    <Linkedin className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-800" size={18} />
                    <input value={localConfig.linkedinUrl} onChange={e => handleChange('linkedinUrl', e.target.value)} className="w-full pl-16 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] font-bold text-xs outline-none focus:bg-white transition-all shadow-inner" />
                  </div>
                </div>
             </div>
             
             <div className="mt-8 p-8 bg-gray-900 rounded-[3rem] text-white space-y-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Globe size={100}/></div>
                <h5 className="text-xl font-bold font-serif italic text-cyan-400">Stewardship Note</h5>
                <p className="text-xs text-gray-400 leading-relaxed font-light">The footer serves as the final handshake. Ensure all social nexus points are active and direct members to authentic RASA content.</p>
             </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default FooterEditorTab;
