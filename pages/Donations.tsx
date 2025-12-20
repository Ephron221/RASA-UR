
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Handshake, ShieldCheck, Sparkles, Send, Loader2, CheckCircle2, DollarSign, ArrowRight, User, Mail, Phone, Info } from 'lucide-react';
import { API } from '../services/api';
import { DonationProject, Donation } from '../types';

const Donations: React.FC = () => {
  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<DonationProject | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    donorName: '',
    email: '',
    phone: '',
    amount: '',
    category: 'One-time' as any
  });

  useEffect(() => {
    API.donations.projects.getAll().then(data => {
      setProjects(data.filter(p => p.isActive));
      setLoading(false);
    });
  }, []);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const donation: Donation = {
      id: Math.random().toString(36).substr(2, 9),
      donorName: formData.donorName,
      email: formData.email,
      phone: formData.phone,
      amount: Number(formData.amount),
      currency: 'RWF',
      category: selectedProject ? 'Project-based' : formData.category,
      project: selectedProject?.title,
      date: new Date().toISOString(),
      status: 'Completed', // Simulated immediate completion
      transactionId: `TX${Math.random().toString(10).substr(2, 8)}`
    };

    try {
      await API.donations.create(donation);
      
      // Update local project progress if it was project-based
      if (selectedProject) {
        await API.donations.projects.update(selectedProject.id, {
          raised: selectedProject.raised + donation.amount
        });
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ donorName: '', email: '', phone: '', amount: '', category: 'One-time' });
        setSelectedProject(null);
      }, 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-32 bg-[#F9FBFC]">
      <div className="max-container px-4">
        
        {/* Header */}
        <header className="mb-20 text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 bg-cyan-50 rounded-full text-cyan-600 font-black text-[10px] uppercase tracking-[0.4em]"
          >
            <Heart size={14} /> Ministry Support
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold font-serif italic text-gray-900 leading-tight tracking-tight"
          >
            Sow into the <span className="text-cyan-500">Mission</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-gray-500 text-xl font-light leading-relaxed max-w-3xl mx-auto"
          >
            Your generous contributions enable RASA UR-Nyarugenge to reach more students, 
            support ministries, and maintain our sacred spaces for fellowships.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Donation Options */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Project List */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black font-serif italic text-gray-900">Current Projects</h3>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Active Needs</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(project => (
                  <motion.div 
                    key={project.id}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedProject(project)}
                    className={`cursor-pointer group relative bg-white p-6 rounded-[2.5rem] border-2 transition-all overflow-hidden ${selectedProject?.id === project.id ? 'border-cyan-500 shadow-xl shadow-cyan-100' : 'border-gray-100 hover:border-cyan-100'}`}
                  >
                    <div className="aspect-video rounded-3xl overflow-hidden mb-6">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xl font-black text-gray-900">{project.title}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{project.description}</p>
                      
                      <div className="pt-4 space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black uppercase text-gray-400">Progress</span>
                          <span className="text-xs font-bold text-cyan-600">{((project.raised / project.goal) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} animate={{ width: `${(project.raised / project.goal) * 100}%` }}
                            className="h-full bg-cyan-500" 
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                          <span>{project.raised.toLocaleString()} RWF</span>
                          <span>{project.goal.toLocaleString()} RWF</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Impact Quote */}
            <div className="p-10 bg-cyan-900 rounded-[3.5rem] text-white relative overflow-hidden">
               <Heart className="absolute top-10 right-10 opacity-5" size={150} />
               <div className="relative z-10 space-y-4">
                 <p className="font-serif italic text-2xl leading-relaxed">"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."</p>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">— 2 CORINTHIANS 9:7</p>
               </div>
            </div>
          </div>

          {/* Donation Form */}
          <div className="lg:col-span-5 sticky top-32">
            <motion.div 
              layout
              className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-gray-100 relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center space-y-6">
                    <div className="w-24 h-24 bg-cyan-50 text-cyan-500 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 size={48} /></div>
                    <h3 className="text-3xl font-black font-serif italic text-gray-900">May God Bless You!</h3>
                    <p className="text-gray-500 font-medium">Your donation of {formData.amount} RWF has been received. Thank you for supporting the RASA ministry.</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" exit={{ opacity: 0 }} className="space-y-8" onSubmit={handleDonate}>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-black font-serif italic text-gray-900">Make a Donation</h3>
                      {selectedProject && (
                        <div className="flex items-center justify-between p-4 bg-cyan-50 border border-cyan-100 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <Sparkles className="text-cyan-600" size={18} />
                            <span className="text-xs font-bold text-cyan-700">Project: {selectedProject.title}</span>
                          </div>
                          <button onClick={() => setSelectedProject(null)} className="text-cyan-400 hover:text-red-500"><X size={16}/></button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-5">
                      <div className="grid grid-cols-1 gap-4">
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-widest">Full Name</label>
                           <div className="relative group">
                             <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500 transition-colors" size={18} />
                             <input required value={formData.donorName} onChange={e => setFormData({...formData, donorName: e.target.value})} placeholder="Donor Name" className="w-full pl-14 pr-8 py-5 bg-gray-50 rounded-[1.8rem] outline-none font-bold text-sm focus:bg-white focus:ring-4 focus:ring-cyan-50 transition-all" />
                           </div>
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-widest">Email Address</label>
                           <div className="relative group">
                             <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500 transition-colors" size={18} />
                             <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="donor@example.com" className="w-full pl-14 pr-8 py-5 bg-gray-50 rounded-[1.8rem] outline-none font-bold text-sm focus:bg-white focus:ring-4 focus:ring-cyan-50 transition-all" />
                           </div>
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-widest">Amount (RWF)</label>
                           <div className="relative group">
                             <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500 transition-colors" size={18} />
                             <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="Min. 1,000 RWF" min="1000" className="w-full pl-14 pr-8 py-5 bg-gray-50 rounded-[1.8rem] outline-none font-black text-xl focus:bg-white focus:ring-4 focus:ring-cyan-50 transition-all" />
                           </div>
                         </div>
                      </div>
                    </div>

                    <button disabled={isSubmitting} className="w-full py-6 bg-cyan-500 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-cyan-600 transition-all flex items-center justify-center gap-4 active:scale-95">
                      {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Handshake size={20} />} Complete Offering
                    </button>
                    
                    <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">
                      <ShieldCheck className="inline-block mr-2 text-cyan-400" size={14} /> 
                      Secure Transaction powered by RASA Finance
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

const X = ({size}: {size: number}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default Donations;
