
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Handshake, ShieldCheck, Sparkles, Send, Loader2, CheckCircle2, DollarSign, ArrowRight, User, Mail, Phone, Info, CreditCard, Smartphone, Copy, Check } from 'lucide-react';
import { API } from '../services/api';
import { DonationProject, Donation } from '../types';

const Donations: React.FC = () => {
  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<DonationProject | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'bank'>('momo');
  const [copied, setCopied] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    donorName: '',
    email: '',
    phone: '',
    amount: '',
  });

  useEffect(() => {
    API.donations.projects.getAll().then(data => {
      setProjects(data.filter(p => p.isActive));
      setLoading(false);
    });
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

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
      category: selectedProject ? 'Project-based' : 'One-time',
      project: selectedProject?.title,
      date: new Date().toISOString(),
      status: 'Pending', // Now pending until Admin confirms
      transactionId: `${paymentMethod.toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    };

    try {
      await API.donations.create(donation);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ donorName: '', email: '', phone: '', amount: '' });
        setSelectedProject(null);
      }, 6000);
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
            Your contributions fuel the gospel. RASA UR-Nyarugenge relies on the generosity of current members, alumni, and friends.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Donation Options */}
          <div className="lg:col-span-7 space-y-12">
            {/* Project List */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black font-serif italic text-gray-900">Current Needs</h3>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Targeted Projects</span>
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
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Payment Details Card */}
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
              <h3 className="text-2xl font-black font-serif italic text-gray-900">Official Payment Methods</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* MoMo Pay Info */}
                <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg"><Smartphone size={20}/></div>
                    <p className="font-black text-amber-900 text-sm uppercase tracking-widest">MoMo Pay</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-amber-600 uppercase">Merchant Code</p>
                    <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-amber-200">
                      <span className="text-2xl font-black text-amber-900">411695</span>
                      <button onClick={() => copyToClipboard('411695', 'momo')} className="text-amber-500 hover:text-amber-700 transition-colors">
                        {copied === 'momo' ? <Check size={20}/> : <Copy size={20}/>}
                      </button>
                    </div>
                    <p className="text-[10px] font-bold text-amber-600 mt-2">Owner: Lambert (RASA Finance)</p>
                  </div>
                </div>

                {/* Bank Account Info */}
                <div className="p-8 bg-cyan-50 rounded-3xl border border-cyan-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500 text-white rounded-xl flex items-center justify-center shadow-lg"><CreditCard size={20}/></div>
                    <p className="font-black text-cyan-900 text-sm uppercase tracking-widest">Bank Transfer</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-cyan-600 uppercase">Account Number</p>
                    <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-cyan-200">
                      <span className="text-lg font-black text-cyan-900">408421629010134</span>
                      <button onClick={() => copyToClipboard('408421629010134', 'bank')} className="text-cyan-500 hover:text-cyan-700 transition-colors">
                        {copied === 'bank' ? <Check size={20}/> : <Copy size={20}/>}
                      </button>
                    </div>
                    <p className="text-[10px] font-bold text-cyan-600 mt-2">Bank of Populaire (BPR)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Form */}
          <div className="lg:col-span-5 sticky top-32">
            <motion.div layout className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-gray-100 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center space-y-6">
                    <div className="w-24 h-24 bg-cyan-50 text-cyan-500 rounded-full flex items-center justify-center mx-auto shadow-inner"><CheckCircle2 size={48} /></div>
                    <h3 className="text-3xl font-black font-serif italic text-gray-900">Pledge Received!</h3>
                    <p className="text-gray-500 font-medium">Thank you! Please ensure you send the funds to the provided account. An admin will verify and confirm your offering shortly.</p>
                    <button onClick={() => setIsSuccess(false)} className="px-8 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Done</button>
                  </motion.div>
                ) : (
                  <motion.form key="form" exit={{ opacity: 0 }} className="space-y-8" onSubmit={handleDonate}>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-black font-serif italic text-gray-900">Submit Offering</h3>
                      <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                        <button type="button" onClick={() => setPaymentMethod('momo')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'momo' ? 'bg-amber-500 text-white shadow-lg' : 'text-gray-400'}`}>Momo Pay</button>
                        <button type="button" onClick={() => setPaymentMethod('bank')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'bank' ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-400'}`}>Bank Transfer</button>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-4">
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-widest">Full Name</label>
                           <div className="relative group">
                             <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                             <input required value={formData.donorName} onChange={e => setFormData({...formData, donorName: e.target.value})} placeholder="Donor Name" className="w-full pl-14 pr-8 py-5 bg-gray-50 rounded-[1.8rem] outline-none font-bold text-sm focus:bg-white focus:ring-4 focus:ring-cyan-50 transition-all border border-transparent focus:border-cyan-100" />
                           </div>
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-widest">Email Address</label>
                           <div className="relative group">
                             <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                             <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="donor@example.com" className="w-full pl-14 pr-8 py-5 bg-gray-50 rounded-[1.8rem] outline-none font-bold text-sm focus:bg-white focus:ring-4 focus:ring-cyan-50 transition-all border border-transparent focus:border-cyan-100" />
                           </div>
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-widest">Amount (RWF)</label>
                           <div className="relative group">
                             <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                             <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="Min. 500 RWF" min="500" className="w-full pl-14 pr-8 py-5 bg-gray-50 rounded-[1.8rem] outline-none font-black text-xl focus:bg-white focus:ring-4 focus:ring-cyan-50 transition-all border border-transparent focus:border-cyan-100" />
                           </div>
                         </div>
                      </div>
                    </div>

                    <div className="p-6 bg-cyan-50/50 border border-cyan-100/50 rounded-3xl space-y-3">
                      <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest flex items-center gap-2"><Info size={14}/> Instructions</p>
                      <p className="text-xs text-cyan-800 leading-relaxed font-medium">
                        1. Select a targeted project or general offering.<br/>
                        2. Send at least <b>500 RWF</b> to the {paymentMethod === 'momo' ? 'Momo Pay Code' : 'Bank Account'}.<br/>
                        3. Submit this form so we can identify your contribution.
                      </p>
                    </div>

                    <button disabled={isSubmitting} className="w-full py-6 bg-cyan-500 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-cyan-600 transition-all flex items-center justify-center gap-4 active:scale-95">
                      {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Handshake size={20} />} Log Offering
                    </button>
                    
                    <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">
                      <ShieldCheck className="inline-block mr-2 text-cyan-400" size={14} /> 
                      Ministry Accountability portal
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
