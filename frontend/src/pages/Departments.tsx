
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// Fix framer-motion prop errors by casting motion to any
import { motion as motionLib, AnimatePresence } from 'framer-motion';
const motion = motionLib as any;
import { 
  Heart, Music, Globe, Activity, Shield, Flame, Zap, Mic, Handshake, Info, 
  CheckCircle, ArrowRight, Sparkles, X, Send, Phone, User as UserIcon, 
  GraduationCap, MapPin, CheckCircle2, Loader2, Award, BookOpen, Layers, Camera
} from 'lucide-react';
import { Department, User, DepartmentInterest } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { DIOCESES, LEVELS } from '../constants';
import { API } from '../services/api';

interface DepartmentsProps {
  departments: Department[];
}

const IconMap: Record<string, any> = { Flame, Music, Globe, Activity, Shield, Heart, Mic, Handshake, Zap };

const SmartIcon: React.FC<{ icon: string; size?: number; className?: string }> = ({ icon, size = 24, className = "" }) => {
  if (!icon) return <Info size={size} className={className} />;
  if (icon.startsWith('data:') || icon.startsWith('http')) {
    return <img src={icon} alt="Icon" className={`object-contain ${className}`} style={{ width: size, height: size }} />;
  }
  const LucideIcon = IconMap[icon] || Info;
  return <LucideIcon size={size} className={className} />;
};

const Departments: React.FC<DepartmentsProps> = ({ departments }) => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const activeDept = departments.find(d => d.id === id) || null;

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '', email: user?.email || '', phone: user?.phone || '',
    diocese: user?.diocese || DIOCESES[0], level: user?.level || LEVELS[0],
    program: user?.program || '', motivation: '', experience: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDept) return;
    setIsSubmitting(true);
    try {
      await API.departments.submitInterest({ 
        ...formData, 
        id: Math.random().toString(36).substr(2, 9), 
        departmentId: activeDept.id, 
        departmentName: activeDept.name, 
        status: 'Pending', 
        date: new Date().toISOString() 
      } as any);
      setIsSuccess(true);
      setTimeout(() => {
        setShowInterestModal(false);
        setIsSuccess(false);
        setCurrentStep(1);
      }, 4000);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-32 bg-[#F9FBFC]">
      <div className="max-container px-4">
        
        {/* Navigation Bar */}
        <div className="flex flex-wrap gap-3 mb-20 justify-center bg-white/50 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white shadow-sm w-fit mx-auto">
          <Link to="/departments" className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${!id ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-100' : 'text-gray-400 hover:text-cyan-600 hover:bg-white'}`}>All Faculties</Link>
          {departments.map(dept => (
            <Link key={dept.id} to={`/departments/${dept.id}`} className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${id === dept.id ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-100' : 'text-gray-400 hover:text-cyan-600 hover:bg-white'}`}>
              {dept.name}
            </Link>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!activeDept ? (
            <motion.div 
              key="list" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {departments.map((dept, idx) => (
                <motion.div 
                  key={dept.id} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -10 }}
                  className="group bg-white rounded-[3.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-3xl transition-all duration-700 flex flex-col h-full"
                >
                  <div className="relative aspect-[4/3] overflow-hidden shrink-0">
                    <img src={dept.image || 'https://images.unsplash.com/photo-1544427928-c49cdfebf193?q=80&w=2000'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={dept.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute top-6 left-6 w-14 h-14 bg-white/95 backdrop-blur-xl rounded-2xl flex items-center justify-center text-cyan-600 shadow-xl p-3">
                      <SmartIcon icon={dept.icon} size={28} />
                    </div>
                  </div>
                  <div className="p-10 flex flex-col flex-grow space-y-6">
                    <div>
                      <span className="text-[9px] font-black text-cyan-600 uppercase tracking-[0.2em]">{dept.category || 'Ministry Pillar'}</span>
                      <h3 className="text-3xl font-black text-gray-900 leading-tight mt-1 group-hover:text-cyan-600 transition-colors">{dept.name}</h3>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed font-medium line-clamp-3 italic">"{dept.description}"</p>
                    <div className="pt-6 mt-auto border-t border-gray-50">
                      <Link to={`/departments/${dept.id}`} className="flex items-center justify-between text-cyan-600 font-black text-[10px] uppercase tracking-[0.2em] group/btn">
                        Explore Vision <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="detail" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="space-y-20"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                <div className="lg:col-span-6 space-y-10 order-2 lg:order-1">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-cyan-50 rounded-full text-cyan-600 font-black text-[10px] uppercase tracking-[0.4em]">
                      <SmartIcon icon={activeDept.icon} size={14} /> Ministry Sequence
                    </div>
                    <h2 className="text-6xl md:text-8xl font-black font-serif italic text-gray-900 leading-tight tracking-tighter">
                      {activeDept.name.split(' ').slice(0,-1).join(' ')} <span className="text-cyan-500">{activeDept.name.split(' ').pop()}</span>
                    </h2>
                    <p className="text-xl text-gray-500 leading-relaxed font-light italic border-l-4 border-cyan-500 pl-8 py-2">
                      {activeDept.details}
                    </p>
                  </motion.div>

                  <div className="space-y-6 pt-6">
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Zap size={14} className="text-cyan-500"/> Ministerial Activities
                     </h4>
                     <div className="flex flex-wrap gap-3">
                        {activeDept.activities?.map((act, i) => (
                           <div key={i} className="px-6 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 hover:border-cyan-200 transition-all cursor-default">
                              <CheckCircle2 size={16} className="text-cyan-500"/>
                              <span className="text-sm font-bold text-gray-700">{act}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="pt-8">
                    <button 
                      onClick={() => setShowInterestModal(true)} 
                      className="group px-14 py-6 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-cyan-500 transition-all flex items-center gap-4 active:scale-95"
                    >
                      Join This Ministry <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 order-1 lg:order-2">
                   <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                   >
                      <div className="absolute -inset-10 bg-cyan-100/50 rounded-[5rem] blur-[80px] -z-10 animate-pulse"></div>
                      <div className="relative aspect-square md:aspect-[4/5] rounded-[4rem] overflow-hidden shadow-3xl border-8 border-white">
                        <img 
                          src={activeDept.image || 'https://images.unsplash.com/photo-1544427928-c49cdfebf193?q=80&w=2000'} 
                          className="w-full h-full object-cover shadow-inner" 
                          alt={activeDept.name} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-10 left-10 text-white space-y-2">
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70">Divine Hub</p>
                           <h4 className="text-4xl font-black font-serif italic">{activeDept.name}</h4>
                        </div>
                      </div>
                      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-cyan-500 rounded-[3rem] p-10 flex items-center justify-center text-white shadow-2xl rotate-12 transition-transform hover:rotate-0 duration-500">
                         <SmartIcon icon={activeDept.icon} size={64} />
                      </div>
                   </motion.div>
                </div>
              </div>

              {/* Dynamic Call to Action or FAQ could go here */}
              <div className="pt-32 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-12">
                 {[
                   { icon: Award, title: "Excellence", desc: "Our ministry operates with high academic and spiritual standards." },
                   { icon: BookOpen, title: "Legacy", desc: "Part of the RASA heritage established in 1997 at UNR Butare." },
                   { icon: Handshake, title: "Community", desc: "A sanctuary for members to thrive in fellowship and purpose." }
                 ].map((box, i) => (
                   <div key={i} className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm space-y-6">
                      <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center"><box.icon size={24}/></div>
                      <h5 className="text-xl font-black text-gray-900 leading-tight">{box.title}</h5>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">{box.desc}</p>
                   </div>
                 ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recruitment Modal */}
      <AnimatePresence>
        {showInterestModal && activeDept && (
          <div className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
             <motion.div 
                initial={{ scale: 0.9, y: 20, opacity: 0 }} 
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-3xl overflow-hidden flex flex-col max-h-[90vh]"
             >
                <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-gray-900 text-white rounded-3xl flex items-center justify-center p-4 shadow-xl">
                         <SmartIcon icon={activeDept.icon} size={32}/>
                      </div>
                      <div>
                         <h3 className="text-2xl font-black font-serif italic text-gray-900">Ministry Recruitment</h3>
                         <p className="text-[10px] font-black uppercase text-cyan-600 tracking-widest">Enlisting for {activeDept.name}</p>
                      </div>
                   </div>
                   <button onClick={() => setShowInterestModal(false)} className="p-3 bg-white text-gray-400 rounded-2xl hover:text-red-500 border border-gray-100 shadow-sm transition-all"><X size={20}/></button>
                </div>

                <div className="flex-grow overflow-y-auto scroll-hide p-12">
                   <AnimatePresence mode="wait">
                      {isSuccess ? (
                        <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center space-y-8">
                           <div className="w-32 h-32 bg-green-50 text-green-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-inner border border-green-100">
                              <CheckCircle2 size={64} strokeWidth={2.5}/>
                           </div>
                           <div className="space-y-3">
                              <h4 className="text-4xl font-black font-serif italic text-gray-900">Sequence Complete</h4>
                              <p className="text-gray-500 font-medium text-lg px-8 leading-relaxed">Your spiritual enlisting sequence for <span className="text-cyan-600 font-black">{activeDept.name}</span> has been received in the Kernel.</p>
                           </div>
                        </motion.div>
                      ) : (
                        <motion.form key="form" onSubmit={handleInterestSubmit} className="space-y-10">
                           {currentStep === 1 && (
                             <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                <div className="space-y-6">
                                   <div className="space-y-2">
                                      <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">Full Legal Name</label>
                                      <div className="relative group">
                                         <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500" size={18}/>
                                         <input required name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="As per RASA records" className="w-full pl-16 pr-6 py-5 bg-gray-50 rounded-[2rem] font-bold text-sm outline-none focus:bg-white border-2 border-transparent focus:border-cyan-100 transition-all" />
                                      </div>
                                   </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-2">
                                         <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">Email Nexus</label>
                                         <input required name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="yourname@ur.ac.rw" className="w-full px-8 py-5 bg-gray-50 rounded-[2rem] font-bold text-sm outline-none focus:bg-white border-2 border-transparent focus:border-cyan-100" />
                                      </div>
                                      <div className="space-y-2">
                                         <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">Phone Pulse</label>
                                         <input required name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+250..." className="w-full px-8 py-5 bg-gray-50 rounded-[2rem] font-bold text-sm outline-none focus:bg-white border-2 border-transparent focus:border-cyan-100" />
                                      </div>
                                   </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-2">
                                         <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">Home Diocese</label>
                                         <select name="diocese" value={formData.diocese} onChange={handleInputChange} className="w-full px-8 py-5 bg-gray-50 rounded-[2rem] font-bold text-sm outline-none focus:bg-white border-2 border-transparent focus:border-cyan-100 appearance-none cursor-pointer">
                                            {DIOCESES.map(d => <option key={d} value={d}>{d}</option>)}
                                         </select>
                                      </div>
                                      <div className="space-y-2">
                                         <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">Academic Level</label>
                                         <select name="level" value={formData.level} onChange={handleInputChange} className="w-full px-8 py-5 bg-gray-50 rounded-[2rem] font-bold text-sm outline-none focus:bg-white border-2 border-transparent focus:border-cyan-100 appearance-none cursor-pointer">
                                            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                         </select>
                                      </div>
                                   </div>
                                </div>
                             </motion.div>
                           )}

                           {currentStep === 2 && (
                             <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                <div className="space-y-6">
                                   <div className="space-y-2">
                                      <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">Academic Domain (Program)</label>
                                      <input required name="program" value={formData.program} onChange={handleInputChange} placeholder="e.g. Computer Science" className="w-full px-8 py-5 bg-gray-50 rounded-[2rem] font-bold text-sm outline-none focus:bg-white border-2 border-transparent focus:border-cyan-100" />
                                   </div>
                                   <div className="space-y-2">
                                      <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">Spiritual Motivation</label>
                                      <textarea required name="motivation" value={formData.motivation} onChange={handleInputChange} rows={4} placeholder="Why do you wish to join this ministry?" className="w-full px-8 py-6 bg-gray-50 rounded-[2.5rem] font-medium text-sm outline-none focus:bg-white border-2 border-transparent focus:border-cyan-100 resize-none leading-relaxed" />
                                   </div>
                                   <div className="space-y-2">
                                      <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">Relevant Experience (Optional)</label>
                                      <textarea name="experience" value={formData.experience} onChange={handleInputChange} rows={3} placeholder="Previous ministerial or skill-based experience..." className="w-full px-8 py-6 bg-gray-50 rounded-[2.5rem] font-medium text-sm outline-none focus:bg-white border-2 border-transparent focus:border-cyan-100 resize-none leading-relaxed" />
                                   </div>
                                </div>
                             </motion.div>
                           )}
                        </motion.form>
                      )}
                   </AnimatePresence>
                </div>

                {!isSuccess && (
                  <div className="p-10 border-t border-gray-50 bg-gray-50/30 flex justify-between items-center gap-4">
                     <div className="flex gap-2">
                        {[1, 2].map(s => <div key={s} className={`w-2 h-2 rounded-full transition-all ${currentStep === s ? 'w-8 bg-cyan-500' : 'bg-gray-200'}`}></div>)}
                     </div>
                     <div className="flex gap-4">
                        {currentStep === 2 && <button onClick={() => setCurrentStep(1)} className="px-8 py-4 text-gray-400 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">Back</button>}
                        {currentStep === 1 ? (
                          <button onClick={() => setCurrentStep(2)} className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-3">Next Protocol <ArrowRight size={14}/></button>
                        ) : (
                          <button 
                            onClick={handleInterestSubmit}
                            disabled={isSubmitting}
                            className="px-14 py-5 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-cyan-100 hover:bg-cyan-600 active:scale-95 transition-all flex items-center gap-3"
                          >
                             {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <Send size={16}/>} Finalize Enlisting
                          </button>
                        )}
                     </div>
                  </div>
                )}
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Departments;
