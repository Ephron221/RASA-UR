
import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, UserCheck, GraduationCap, Shield, Save, X, Loader2, Star, CheckCircle2, AlertCircle } from 'lucide-react';
import { Leader } from '../../types';

interface LeaderFormProps {
  editingItem: Leader | null;
  filePreview: string | null;
  urlInput: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSyncing: boolean;
}

const ACADEMIC_YEARS = ['2023-2024', '2024-2025', '2025-2026', '2026-2027'];

const LeaderForm: React.FC<LeaderFormProps> = ({
  editingItem,
  filePreview,
  urlInput,
  onFileChange,
  onUrlChange,
  onSubmit,
  isSyncing
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState(false);
  
  // Dynamic image source priority
  const currentImage = filePreview || urlInput || editingItem?.image || '';

  // Reset error if image changes
  useEffect(() => {
    setImageError(false);
  }, [currentImage]);

  return (
    <form id="main-editor-form" onSubmit={onSubmit} className="space-y-10">
      {/* Prominent Image Upload Section */}
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-2">
          <label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">
            Official Portrait
          </label>
          <p className="text-[10px] text-gray-400 font-medium italic">High resolution PNG/JPG recommended</p>
        </div>
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`relative w-56 h-56 rounded-[3.5rem] bg-gray-50 border-4 border-dashed transition-all duration-500 flex items-center justify-center cursor-pointer overflow-hidden group shadow-inner ${
            filePreview || urlInput ? 'border-cyan-500 bg-white ring-8 ring-cyan-50' : 'border-gray-200 hover:border-cyan-400 hover:bg-white'
          }`}
        >
          {currentImage && !imageError ? (
            <img 
              src={currentImage} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-30" 
              alt="Preview" 
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-gray-300 group-hover:text-cyan-500 group-hover:bg-cyan-50 transition-all">
                <Camera size={32} />
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest group-hover:text-cyan-600">Select Portrait</p>
            </div>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-cyan-600/5 backdrop-blur-[2px]">
            <div className="p-4 bg-white rounded-2xl shadow-xl flex flex-col items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
              <Upload className="text-cyan-600" size={24} />
              <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">Update Photo</span>
            </div>
          </div>

          {/* Selection Feedback */}
          {(filePreview || (urlInput && !imageError)) && (
            <div className="absolute top-4 right-4 animate-bounce">
              <div className="p-2 bg-green-500 text-white rounded-full shadow-lg">
                <CheckCircle2 size={16} />
              </div>
            </div>
          )}

          {imageError && (
            <div className="absolute inset-0 bg-red-50 flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="text-red-500 mb-2" size={32} />
              <p className="text-[10px] font-black text-red-600 uppercase">Invalid URL/File</p>
            </div>
          )}
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onFileChange} 
          className="hidden" 
          accept="image/*" 
        />
        
        <div className="w-full max-w-sm relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500">
            <Star size={14} />
          </div>
          <input 
            value={urlInput} 
            onChange={(e) => onUrlChange(e.target.value)} 
            placeholder="Or paste high-res CDN URL here..." 
            className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl font-bold text-[10px] border border-gray-100 focus:bg-white focus:border-cyan-200 outline-none transition-all shadow-sm" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* Basic Info */}
        <div className="md:col-span-2 space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-[0.2em]">
            <UserCheck size={14} className="text-cyan-500" /> Professional Identity
          </label>
          <input 
            name="name" 
            defaultValue={editingItem?.name} 
            required 
            placeholder="e.g. Alain Christian"
            className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] font-bold text-sm focus:bg-white focus:ring-4 focus:ring-cyan-50/50 outline-none transition-all" 
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-[0.2em]">
            <Shield size={14} className="text-cyan-500" /> Designation
          </label>
          <input 
            name="position" 
            defaultValue={editingItem?.position} 
            required 
            placeholder="e.g. President"
            className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] font-bold text-sm focus:bg-white outline-none transition-all" 
          />
        </div>

        {/* Improved Selections */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-[0.2em]">
            <GraduationCap size={14} className="text-cyan-500" /> Academic Term
          </label>
          <div className="relative group">
            <select 
              name="academicYear" 
              defaultValue={editingItem?.academicYear || ACADEMIC_YEARS[1]} 
              className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] font-bold text-sm focus:bg-white outline-none cursor-pointer appearance-none transition-all"
            >
              {ACADEMIC_YEARS.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
              <X size={16} className="rotate-45" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-[0.2em]">
            <Star size={14} className="text-cyan-500" /> Organizational Category
          </label>
          <div className="relative group">
            <select 
              name="type" 
              defaultValue={editingItem?.type || 'Executive'} 
              className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] font-bold text-sm focus:bg-white outline-none cursor-pointer appearance-none transition-all"
            >
              <option value="Executive">Executive Committee (Core Leadership)</option>
              <option value="Arbitration">CA Committee (Advisory & Legal)</option>
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
              <X size={16} className="rotate-45" />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LeaderForm;
