
import React from 'react';
import { Briefcase, Activity, Star, Info, X, Zap } from 'lucide-react';
import { Department } from '../../types';

interface DepartmentFormProps {
  editingItem: Department | null;
  onSubmit: (e: React.FormEvent) => void;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({ editingItem, onSubmit }) => {
  return (
    <form id="main-editor-form" onSubmit={onSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name & Icon */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Briefcase size={14} className="text-cyan-500" /> Ministry Name
          </label>
          <input 
            name="name" 
            defaultValue={editingItem?.name} 
            required 
            placeholder="e.g. Call on Jesus"
            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm focus:bg-white focus:ring-4 focus:ring-cyan-50 outline-none transition-all" 
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Star size={14} className="text-cyan-500" /> Icon Identifier
          </label>
          <select 
            name="icon" 
            defaultValue={editingItem?.icon || 'Flame'}
            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm focus:bg-white outline-none cursor-pointer appearance-none transition-all"
          >
            <option value="Flame">Flame (Spiritual/Revival)</option>
            <option value="Music">Music (Worship/Choir)</option>
            <option value="Globe">Globe (Evangelism/Mission)</option>
            <option value="Heart">Heart (Social/Intercession)</option>
            <option value="Shield">Shield (Protocol/Security)</option>
            <option value="Activity">Activity (Media/Broadcasting)</option>
            <option value="Zap">Zap (Sports/Fitness)</option>
            <option value="Handshake">Handshake (Social Affairs)</option>
          </select>
        </div>

        {/* Short Description */}
        <div className="md:col-span-2 space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Info size={14} className="text-cyan-500" /> Hook / Tagline
          </label>
          <input 
            name="description" 
            defaultValue={editingItem?.description} 
            required 
            placeholder="The heartbeat of revival and corporate prayer."
            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm focus:bg-white outline-none transition-all" 
          />
        </div>

        {/* Full Details */}
        <div className="md:col-span-2 space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Activity size={14} className="text-cyan-500" /> Ministerial Vision
          </label>
          <textarea 
            name="details" 
            defaultValue={editingItem?.details} 
            required 
            rows={4}
            placeholder="Describe the deeper purpose and vision of this ministry..."
            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm focus:bg-white outline-none transition-all resize-none" 
          />
        </div>

        {/* Activities */}
        <div className="md:col-span-2 space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Zap size={14} className="text-cyan-500" /> Core Activities
          </label>
          <div className="relative">
            <input 
              name="activities" 
              defaultValue={editingItem?.activities?.join(', ')} 
              required 
              placeholder="e.g. Weekly Revival, Prayer Retreats, Fasting..."
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm focus:bg-white outline-none transition-all" 
            />
            <p className="mt-2 text-[9px] text-gray-400 font-bold uppercase tracking-widest ml-4">Separate activities with commas</p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DepartmentForm;
