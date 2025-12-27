
import React, { useRef, useState } from 'react';
import { Briefcase, Activity, Star, Info, X, Zap, Camera, Upload, Layers, Smile } from 'lucide-react';
import { Department } from '../../types';

interface DepartmentFormProps {
  editingItem: Department | null;
  filePreview: string | null;
  urlInput: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({ 
  editingItem, 
  filePreview, 
  urlInput, 
  onFileChange, 
  onUrlChange, 
  onSubmit 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  
  const currentImage = filePreview || urlInput || editingItem?.image || '';
  const currentIcon = iconPreview || editingItem?.icon || 'Flame';

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setIconPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <form id="main-editor-form" onSubmit={onSubmit} className="space-y-10">
      {/* 1. Main Banner Image */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-[0.2em]">
          <Camera size={14} className="text-cyan-500" /> Ministry Visual Identity (Banner)
        </label>
        <div 
          onClick={() => fileInputRef.current?.click()} 
          className="relative h-56 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-cyan-200 transition-all shadow-inner"
        >
          {currentImage ? (
            <img src={currentImage} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" alt="Dept Preview" />
          ) : (
            <div className="text-center space-y-2">
              <Upload className="text-cyan-500 mx-auto" size={32}/>
              <p className="text-xs font-bold text-gray-400">Upload primary ministry cover</p>
            </div>
          )}
          <div className="absolute inset-0 bg-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
            <Camera className="text-cyan-600 mb-1" size={24} />
            <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">Update Banner</span>
          </div>
        </div>
        <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/*" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* 2. Custom Icon Upload */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Smile size={14} className="text-cyan-500" /> Custom Ministerial Icon
          </label>
          <div className="flex items-center gap-6">
            <div 
              onClick={() => iconInputRef.current?.click()}
              className="w-24 h-24 bg-cyan-50 rounded-3xl border-2 border-dashed border-cyan-100 flex items-center justify-center cursor-pointer hover:bg-white hover:border-cyan-400 transition-all group overflow-hidden"
            >
              {iconPreview || (editingItem?.icon && editingItem.icon.startsWith('data:')) ? (
                <img src={currentIcon} className="w-full h-full object-contain p-2" alt="Icon" />
              ) : (
                <Upload size={24} className="text-cyan-300 group-hover:text-cyan-500" />
              )}
            </div>
            <div className="flex-grow space-y-2">
              <p className="text-[10px] font-bold text-gray-400 leading-tight">Upload a unique symbol for this ministry. High-contrast PNGs with transparency work best.</p>
              <button 
                type="button" 
                onClick={() => iconInputRef.current?.click()}
                className="text-[10px] font-black text-cyan-600 uppercase tracking-widest hover:text-cyan-700"
              >
                Choose File
              </button>
            </div>
          </div>
          <input type="file" ref={iconInputRef} onChange={handleIconUpload} className="hidden" accept="image/*" />
          <input type="hidden" name="icon" value={currentIcon} />
        </div>

        {/* 3. Preset Gallery Fallback */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Layers size={14} className="text-cyan-500" /> Preset Library
          </label>
          <select 
            onChange={(e) => setIconPreview(e.target.value)}
            defaultValue={editingItem?.icon && !editingItem.icon.startsWith('data:') ? editingItem.icon : ''}
            className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] font-bold text-sm focus:bg-white outline-none cursor-pointer appearance-none transition-all"
          >
            <option value="">-- Use Uploaded Custom Icon --</option>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Briefcase size={14} className="text-cyan-500" /> Ministry Name
          </label>
          <input 
            name="name" 
            defaultValue={editingItem?.name} 
            required 
            placeholder="e.g. Call on Jesus"
            className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] font-bold text-sm focus:bg-white focus:ring-4 focus:ring-cyan-50 outline-none transition-all" 
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Layers size={14} className="text-cyan-500" /> Category
          </label>
          <input 
            name="category" 
            defaultValue={editingItem?.category || 'Official RASA Department'} 
            placeholder="e.g. Spiritual Pillar"
            className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] font-bold text-sm focus:bg-white outline-none transition-all" 
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Info size={14} className="text-cyan-500" /> Hook / Tagline
          </label>
          <input 
            name="description" 
            defaultValue={editingItem?.description} 
            required 
            placeholder="Brief mission hook..."
            className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] font-bold text-sm focus:bg-white outline-none transition-all" 
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Activity size={14} className="text-cyan-500" /> Full Ministerial Vision
          </label>
          <textarea 
            name="details" 
            defaultValue={editingItem?.details} 
            required 
            rows={5}
            placeholder="Deep dive into what this department does..."
            className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] font-medium text-sm focus:bg-white outline-none transition-all resize-none leading-relaxed" 
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Zap size={14} className="text-cyan-500" /> Bullet Activities (Comma-separated)
          </label>
          <input 
            name="activities" 
            defaultValue={editingItem?.activities?.join(', ')} 
            required 
            placeholder="e.g. Worship, Rehearsals, Song Writing..."
            className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] font-bold text-sm focus:bg-white outline-none transition-all" 
          />
        </div>
      </div>
    </form>
  );
};

export default DepartmentForm;
