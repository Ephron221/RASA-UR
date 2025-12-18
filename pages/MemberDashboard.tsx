
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Phone, Mail, GraduationCap, MapPin, 
  Briefcase, Calendar, Bell, ShieldCheck, 
  ArrowRight, BookOpen, Heart, Award, 
  Zap, Star, MessageCircle, FileText, ChevronRight,
  Edit3, X, Save, Camera, Upload, Loader2, Database
} from 'lucide-react';
import { User as UserType, Announcement } from '../types';
import { API } from '../services/api';
import { DIOCESES, DEPARTMENTS, LEVELS } from '../constants';

interface MemberDashboardProps {
  user: UserType;
  announcements: Announcement[];
}

const MemberDashboard: React.FC<MemberDashboardProps> = ({ user, announcements }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUser, setCurrentUser] = useState(user);

  const activeAnnouncements = announcements.filter(a => a.isActive).slice(0, 4);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.target as HTMLFormElement);
    
    const updates = {
      fullName: formData.get('fullName') as string,
      phone: formData.get('phone') as string,
      diocese: formData.get('diocese') as string,
      department: formData.get('department') as string,
      level: formData.get('level') as string,
      profileImage: filePreview || currentUser.profileImage
    };

    try {
      await API.members.update(currentUser.id, updates);
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      localStorage.setItem('rasa_user', JSON.stringify(updatedUser));
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed', err);
    } finally {
      setIsSaving(false);
    }
  };

  const infoCards = [
    { label: 'Email Address', value: currentUser.email, icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Phone Number', value: currentUser.phone, icon: Phone, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Academic Program', value: currentUser.program, icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Home Diocese', value: currentUser.diocese, icon: MapPin, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50/50">
      <div className="max-container px-4">
        
        {/* Profile Header Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-white mb-10 relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-end gap-10">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500 to-blue-400 rounded-[2.5rem] blur-lg opacity-20 transition-opacity"></div>
              <div className="relative w-36 h-36 rounded-[2.5rem] bg-white p-1 shadow-2xl overflow-hidden">
                {currentUser.profileImage ? (
                  <img src={currentUser.profileImage} alt={currentUser.fullName} className="w-full h-full object-cover rounded-[2.2rem]" />
                ) : (
                  <div className="w-full h-full rounded-[2.2rem] bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white text-5xl font-bold font-serif shadow-inner">
                    {currentUser.fullName.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-grow text-center lg:text-left space-y-4">
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight font-serif italic">{currentUser.fullName}</h1>
                  <span className="px-4 py-1.5 bg-cyan-50 text-cyan-600 text-xs font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-2 border border-cyan-100/50">
                    <ShieldCheck size={14} /> Verified Member
                  </span>
                </div>
                <p className="text-gray-500 font-medium text-lg">Member Since {new Date(currentUser.createdAt).getFullYear()}</p>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-2 px-5 py-2 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                  <Briefcase size={16} className="text-cyan-500" />
                  <span className="font-bold text-gray-700">{currentUser.department}</span>
                </div>
                <div className="flex items-center gap-2 px-5 py-2 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                  <GraduationCap size={16} className="text-cyan-500" />
                  <span className="font-bold text-gray-700">{currentUser.level}</span>
                </div>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-2xl shadow-lg hover:bg-cyan-600 transition-colors"
                >
                  <Edit3 size={16} />
                  <span className="font-bold">Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {infoCards.map((item, i) => (
                <div key={i} className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm flex items-start gap-5">
                  <div className={`p-4 ${item.bg} ${item.color} rounded-2xl`}><item.icon size={24} /></div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="font-bold text-lg text-gray-900 truncate">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="relative z-10 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold font-serif italic flex items-center gap-3"><Zap size={28} className="text-cyan-500" /> Spiritual Roadmap</h3>
                    <p className="text-gray-500">Track your participation and growth in RASA activities.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-cyan-50 px-5 py-2 rounded-2xl border border-cyan-100">
                    <Star className="text-cyan-600 fill-cyan-600" size={18} />
                    <span className="font-black text-cyan-600">Bronze Disciple</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end"><span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Attendance</span><span className="text-lg font-black text-gray-900">85%</span></div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 rounded-full w-[85%]" /></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-end"><span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Spirit Points</span><span className="text-lg font-black text-gray-900">1,240</span></div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-yellow-500 rounded-full w-[60%]" /></div>
                  </div>
                  <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                    <div className="p-3 bg-white rounded-xl shadow-sm"><Award size={20} className="text-cyan-500" /></div>
                    <div><p className="text-xs text-gray-400 font-bold">Latest Badge</p><p className="font-bold text-sm">Prayer Warrior</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <div className="bg-gray-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold font-serif italic">Live Feed</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">Updates</span>
                  </div>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto scroll-hide pr-2">
                  {activeAnnouncements.map((ann, i) => (
                    <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-3xl space-y-2 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-0.5 ${ann.color} text-[8px] font-black uppercase rounded-md`}>{ann.status}</span>
                        <span className="text-[10px] text-gray-500 font-bold">{ann.date}</span>
                      </div>
                      <p className="font-bold text-gray-100">{ann.title}</p>
                    </div>
                  ))}
                  {activeAnnouncements.length === 0 && <p className="text-gray-500 italic text-sm text-center py-4">No recent updates.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Editor Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              <div className="px-10 pt-10 pb-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-3xl font-black font-serif italic text-gray-900">Update Profile</h2>
                <button onClick={() => setIsEditing(false)} className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-red-500"><X size={20}/></button>
              </div>
              <div className="flex-grow overflow-y-auto p-10 scroll-hide">
                <form id="profile-edit-form" onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Profile Image</label>
                    <div onClick={() => fileInputRef.current?.click()} className="relative w-40 h-40 mx-auto rounded-[2rem] border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden group">
                      {(filePreview || currentUser.profileImage) ? (
                        <img src={filePreview || currentUser.profileImage} className="w-full h-full object-cover group-hover:opacity-70 transition-opacity" alt="" />
                      ) : (
                        <Camera className="text-cyan-500" size={32} />
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Upload className="text-white" size={24}/></div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label><input name="fullName" defaultValue={currentUser.fullName} required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Phone Number</label><input name="phone" defaultValue={currentUser.phone} required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Home Diocese</label><select name="diocese" defaultValue={currentUser.diocese} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm">{DIOCESES.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">RASA Department</label><select name="department" defaultValue={currentUser.department} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm">{DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}</select></div>
                    <div className="space-y-2 md:col-span-2"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Academic Level</label><select name="level" defaultValue={currentUser.level} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm">{LEVELS.map(l => <option key={l} value={l}>{l}</option>)}</select></div>
                  </div>
                </form>
              </div>
              <div className="p-10 border-t border-gray-50 flex gap-4 bg-gray-50/30">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-grow py-5 bg-white border border-gray-200 text-gray-400 rounded-2xl font-black text-[11px] uppercase tracking-widest">Discard</button>
                <button disabled={isSaving} form="profile-edit-form" type="submit" className="flex-[2] py-5 bg-cyan-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-cyan-500/20 hover:bg-cyan-600 flex items-center justify-center gap-3">
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Database size={18} />} 
                  Save Profile
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemberDashboard;
