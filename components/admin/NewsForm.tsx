
import React, { useRef } from 'react';
import { Camera, Upload, Newspaper, Type, Layers, Info } from 'lucide-react';
import { NewsItem } from '../../types';

interface NewsFormProps {
  editingItem: NewsItem | null;
  filePreview: string | null;
  urlInput: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const NewsForm: React.FC<NewsFormProps> = ({
  editingItem,
  filePreview,
  urlInput,
  onFileChange,
  onUrlChange,
  onSubmit
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentImage = filePreview || urlInput || editingItem?.mediaUrl || '';

  return (
    <form id="main-editor-form" onSubmit={onSubmit} className="space-y-8">
      {/* Featured Media Selection */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-[0.2em]">
          <Camera size={14} className="text-cyan-500" /> Featured Article Media
        </label>
        <div 
          onClick={() => fileInputRef.current?.click()} 
          className="relative h-56 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-cyan-200 transition-all shadow-inner"
        >
          {currentImage ? (
            <img src={currentImage} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" alt="News Preview" />
          ) : (
            <div className="text-center space-y-2">
              <Upload className="text-cyan-500 mx-auto" size={32}/>
              <p className="text-xs font-bold text-gray-500">Click to upload story cover</p>
            </div>
          )}
          <div className="absolute inset-0 bg-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
            <Camera className="text-cyan-600 mb-1" size={24} />
            <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">Change Media</span>
          </div>
        </div>
        <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/*" />
        <div className="relative group">
          <input 
            value={urlInput} 
            onChange={e => onUrlChange(e.target.value)} 
            placeholder="Paste direct image URL (optional)" 
            className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-xs border border-gray-100 focus:bg-white outline-none transition-all" 
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Type size={14} className="text-cyan-500" /> Catchy Headline
          </label>
          <input 
            name="title" 
            defaultValue={editingItem?.title} 
            required 
            placeholder="Spirit-filled Fellowship Gathering this Sunday..."
            className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] font-bold text-base focus:bg-white focus:ring-4 focus:ring-cyan-50/50 outline-none transition-all" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
              <Layers size={14} className="text-cyan-500" /> Story Classification
            </label>
            <select 
              name="category" 
              defaultValue={editingItem?.category || 'news'} 
              className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] font-bold text-sm focus:bg-white outline-none cursor-pointer"
            >
              <option value="news">Spirit News (Standard)</option>
              <option value="event">Major Event (Featured)</option>
              <option value="announcement">Official Notice</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
              <Type size={14} className="text-cyan-500" /> Media Format
            </label>
            <select 
              name="mediaType" 
              defaultValue={editingItem?.mediaType || 'image'} 
              className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.8rem] font-bold text-sm focus:bg-white outline-none cursor-pointer"
            >
              <option value="image">Static Photography</option>
              <option value="video">Cinematic Video</option>
              <option value="audio">Voice Testimony/Podcast</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">
            <Info size={14} className="text-cyan-500" /> Narrative Content
          </label>
          <textarea 
            name="content" 
            defaultValue={editingItem?.content} 
            required 
            rows={6} 
            placeholder="Type your story here. Use line breaks for better readability..."
            className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] font-medium text-sm focus:bg-white outline-none transition-all resize-none leading-relaxed" 
          />
        </div>
      </div>
    </form>
  );
};

export default NewsForm;
