
import React from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, Palette } from 'lucide-react';
import { Announcement } from '../../types';

interface AnnouncementFormProps {
  editingItem: Announcement | null;
  onSubmit: (e: React.FormEvent) => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ editingItem, onSubmit }) => {
  return (
    <form id="main-editor-form" onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Bell size={14} className="text-cyan-500" /> Announcement Subject
          </label>
          <input 
            name="title" 
            defaultValue={editingItem?.title} 
            required 
            placeholder="e.g. Mid-week Prayer Resumption"
            className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] font-bold text-sm focus:bg-white focus:ring-4 focus:ring-cyan-50/50 outline-none transition-all" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
              <AlertTriangle size={14} className="text-cyan-500" /> Priority Status
            </label>
            <select 
              name="status" 
              defaultValue={editingItem?.status || 'Info'} 
              className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] font-bold text-sm focus:bg-white outline-none"
            >
              <option value="Info">Information (Friendly Update)</option>
              <option value="Notice">Notice (Standard Requirement)</option>
              <option value="Urgent">Urgent (Immediate Action)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
              <Palette size={14} className="text-cyan-500" /> Visual Theme
            </label>
            <select 
              name="color" 
              defaultValue={editingItem?.color || 'bg-cyan-500'} 
              className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] font-bold text-sm focus:bg-white outline-none"
            >
              <option value="bg-cyan-500">Ocean Cyan (Default)</option>
              <option value="bg-blue-600">Royal Blue (Information)</option>
              <option value="bg-orange-500">Fire Orange (Urgent)</option>
              <option value="bg-emerald-500">Growth Green (Success)</option>
              <option value="bg-rose-500">Rose Red (Alert)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Info size={14} className="text-cyan-500" /> Detailed Message
          </label>
          <textarea 
            name="content" 
            defaultValue={editingItem?.content} 
            required 
            rows={5} 
            placeholder="Describe the notice in detail..."
            className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] font-medium text-sm focus:bg-white outline-none transition-all resize-none leading-relaxed" 
          />
        </div>

        <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-[1.5rem] border border-gray-100">
           <div className="shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center text-cyan-500 shadow-sm border border-gray-100">
             <CheckCircle size={20} />
           </div>
           <div className="flex-grow">
             <label className="flex items-center gap-3 cursor-pointer select-none group">
               <input 
                 type="checkbox" 
                 name="isActive" 
                 defaultChecked={editingItem?.isActive ?? true} 
                 className="w-5 h-5 accent-cyan-500"
               />
               <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-cyan-600 transition-colors">Broadcast to Bulletin Immediately</span>
             </label>
           </div>
        </div>
      </div>
    </form>
  );
};

export default AnnouncementForm;
