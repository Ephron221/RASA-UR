
import React, { useState, useEffect } from 'react';
// Fix framer-motion prop errors by casting motion to any
import { motion as motionLib, AnimatePresence } from 'framer-motion';
const motion = motionLib as any;
import { 
  Heart, Handshake, ShieldCheck, Sparkles, Send, Loader2, 
  CheckCircle2, DollarSign, ArrowRight, User, Mail, Phone, 
  Info, CreditCard, Smartphone, Copy, Check, TrendingUp,
  Coins, Gift, Target, X, Landmark, ExternalLink
} from 'lucide-react';
import { API } from '../services/api';
import { DonationProject, Donation } from '../types';
import { useNotification } from '../contexts/NotificationContext';

const Donations: React.FC = () => {
  const { notify } = useNotification();
  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<DonationProject | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'bank'>('momo');
  const [copied, setCopied] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    donorName: '',
    email: '',
    phone: '',
    amount: '500', // Default low money set to 500
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
    
    if (!formData.donorName || !formData.amount || !formData.phone) {
      notify("Incomplete Protocol", "Please provide your identity, pulse line (phone), and magnitude.", "info");
      return;
    }

    if (Number(formData.amount) < 500) {
      notify("Minimum Threshold", "The minimum sacrificial offering is 500 RWF.", "info");
      return;
    }

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
      status: 'Pending',
      transactionId: `${paymentMethod.toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    };

    try {
      await API.donations.create(donation);
      
      // APPRECIATIVE DIVINE FEEDBACK
      notify(
        "Stewardship Appreciated", 
        `Thank you, ${formData.donorName.split(' ')[0]}, for your contribution of ${Number(formData.amount).toLocaleString()} RWF. Your support fuels our mission. May you be blessed abundantly!`, 
        "divine"
      );

      // Reset Form
      setFormData({ donorName: '', email: '', phone: '', amount: '500' });
      setSelectedProject(null);
    } catch (err) {
      console.error(err);
      notify("Transmission Error", "The financial pulse could not be synchronized. Please try again.", "info");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-32 bg-[#F9FBFC] relative overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-cyan-100/40 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-blue-50/50 rounded-full blur-[100px]"
        />
      </div>

      <div className="max-container px-4 relative z-10">
        <header className="mb-24 text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 bg-white border border-cyan-100 rounded-full text-cyan-600 font-black text-[10px] uppercase tracking-[0.4em] shadow-sm"
          >
            <Sparkles size={14} className="animate-pulse" /> Support The Kingdom Vision
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-bold font-serif italic text-gray-900 leading-[0.95] tracking-tight"
          >
            Invest In <span className="text-cyan-500">Grace</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-xl font-light leading-relaxed max-w-3xl mx-auto"
          >
            "God loves a cheerful giver." Your stewardship directly funds outreaches, 
            the "Call on Jesus" revival nights, and sanctuary welfare for all RASA members.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Projects & Access Credentials */}
          <div className="lg:col-span-7 space-y-16">
            
            {/* Mission Mandates Section */}
            <div className="space-y-10">
              <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black font-serif italic text-gray-900">Current Mandates</h3>
                  <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">Active Ministerial Investments</p>
                </div>
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-cyan-500 shadow-sm border border-gray-50"><Target size={24} /></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((project, idx) => (
                  <motion.div 
                    key={project.id} 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: idx * 0.1 }} 
                    whileHover={{ y: -8 }} 
                    onClick={() => setSelectedProject(project)} 
                    className={`cursor-pointer group relative bg-white p-7 rounded-[3.5rem] border-2 transition-all duration-500 ${
                      selectedProject?.id === project.id 
                        ? 'border-cyan-500 shadow-3xl shadow-cyan-100/50 scale-[1.02]' 
                        : 'border-gray-50 hover:border-cyan-100 hover:shadow-xl'
                    }`}
                  >
                    <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-8 relative">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-2xl font-black text-gray-900 leading-tight">{project.title}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed font-medium italic">"{project.description}"</p>
                      <div className="pt-6 space-y-3">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Gathering Progress</span>
                          <span className="text-xs font-black text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">
                            {((project.raised / project.goal) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-0.5">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${(project.raised / project.goal) * 100}%` }} 
                            className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full shadow-lg" 
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {loading && <div className="col-span-2 py-20 text-center"><Loader2 className="animate-spin text-cyan-500 mx-auto" size={40}/></div>}
              </div>
            </div>

            {/* Access Credentials Section */}
            <div className="bg-gray-900 rounded-[4rem] p-10 md:p-16 text-white relative overflow-hidden shadow-3xl">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Coins size={200}/></div>
              
              <div className="relative z-10 space-y-12">
                <div className="space-y-2">
                   <h3 className="text-4xl md:text-5xl font-black font-serif italic">Access Credentials</h3>
                   <p className="text-[10px] font-black uppercase text-cyan-400 tracking-[0.4em]">Official Contribution Channels</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Momo Gateway */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <Smartphone className="text-amber-500" size={24}/>
                       <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Momo Gateway (RW)</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all group">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-4xl font-black font-mono tracking-tighter text-amber-500">411695</span>
                        <button 
                          onClick={() => copyToClipboard('411695', 'momo')} 
                          className="p-4 bg-white/5 rounded-2xl hover:bg-amber-500 hover:text-white transition-all shadow-lg active:scale-90"
                        >
                          {copied === 'momo' ? <Check size={20} className="text-green-400"/> : <Copy size={20} className="text-white/40 group-hover:text-white"/>}
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                         <p className="text-[10px] font-black text-gray-400 uppercase">Registered Name: <span className="text-white">Lambert</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Bank Gateway */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <Landmark className="text-cyan-400" size={24}/>
                       <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">Bank Transfer</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <p className="text-2xl font-black font-mono tracking-tight text-cyan-400">408421629010134</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase">Bank of Populaire</p>
                        </div>
                        <button 
                          onClick={() => copyToClipboard('408421629010134', 'bank')} 
                          className="p-4 bg-white/5 rounded-2xl hover:bg-cyan-500 hover:text-white transition-all shadow-lg active:scale-90"
                        >
                          {copied === 'bank' ? <Check size={20} className="text-green-400"/> : <Copy size={20} className="text-white/40 group-hover:text-white"/>}
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                         <p className="text-[10px] font-black text-gray-400 uppercase">Account Name: <span className="text-white">RASA UR-NYG</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 flex items-start gap-5">
                   <ShieldCheck className="text-emerald-400 shrink-0" size={24}/>
                   <p className="text-sm font-medium text-gray-400 leading-relaxed italic">
                     "Your financial support is highly appreciated. All contributions are recorded in the sanctuary ledger and used solely for the advancement of the Gospel among academicians."
                   </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Donation Form */}
          <div className="lg:col-span-5 lg:sticky lg:top-36 pb-12">
            <motion.div 
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-10 md:p-16 rounded-[4.5rem] shadow-3xl border border-gray-100 relative overflow-hidden"
            >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-50 rounded-full blur-3xl opacity-50"></div>
                
                <form className="space-y-10 relative z-10" onSubmit={handleDonate}>
                  <div className="space-y-2">
                    <h3 className="text-4xl font-black font-serif italic text-gray-900">Initiate Offering</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Identify your divine deposit</p>
                  </div>

                  <div className="flex gap-2 p-1.5 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <button type="button" onClick={() => setPaymentMethod('momo')} className={`flex-1 py-4 rounded-[1.6rem] text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'momo' ? 'bg-amber-500 text-white shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}>Momo Pay</button>
                    <button type="button" onClick={() => setPaymentMethod('bank')} className={`flex-1 py-4 rounded-[1.6rem] text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'bank' ? 'bg-cyan-500 text-white shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}>Bank Transfer</button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Full Legal Identity</label>
                      <div className="relative group">
                         <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500" size={18}/>
                         <input required value={formData.donorName} onChange={e => setFormData({...formData, donorName: e.target.value})} placeholder="Steward Name" className="w-full pl-16 pr-8 py-5 bg-gray-50 rounded-[2.2rem] outline-none font-bold text-sm border-2 border-transparent focus:border-cyan-100 focus:bg-white transition-all shadow-inner" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Phone Pulse (Donor Phone)</label>
                      <div className="relative group">
                         <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500" size={18}/>
                         <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+250..." className="w-full pl-16 pr-8 py-5 bg-gray-50 rounded-[2.2rem] outline-none font-bold text-sm border-2 border-transparent focus:border-cyan-100 focus:bg-white transition-all shadow-inner" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Magnitude (RWF) — Min: 500</label>
                      <div className="relative group">
                         <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-600" size={24}/>
                         <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="500" min="500" className="w-full pl-16 pr-8 py-6 bg-gray-50 rounded-[2.2rem] outline-none font-black text-3xl border-2 border-transparent focus:border-cyan-100 focus:bg-white text-cyan-600 transition-all shadow-inner" />
                      </div>
                      {Number(formData.amount) > 0 && Number(formData.amount) < 500 && (
                        <p className="text-[8px] font-black text-red-500 uppercase ml-4 animate-pulse">Min threshold: 500 RWF</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Email Nexus (Optional)</label>
                      <div className="relative group">
                         <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500" size={18}/>
                         <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email for records" className="w-full pl-16 pr-8 py-5 bg-gray-50 rounded-[2.2rem] outline-none font-bold text-sm border-2 border-transparent focus:border-cyan-100 focus:bg-white transition-all shadow-inner" />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedProject && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="p-6 bg-cyan-50 rounded-[2.5rem] border border-cyan-100 flex items-center justify-between shadow-sm">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-cyan-600 shadow-sm"><Target size={20}/></div>
                            <div>
                              <p className="text-[8px] font-black text-cyan-600 uppercase tracking-widest">Target Mandate</p>
                              <p className="text-sm font-black text-cyan-900 truncate max-w-[180px]">{selectedProject.title}</p>
                            </div>
                         </div>
                         <button type="button" onClick={() => setSelectedProject(null)} className="p-2 bg-white text-gray-300 hover:text-red-500 rounded-xl transition-all"><X size={16}/></button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-4">
                    <button 
                      disabled={isSubmitting || (Number(formData.amount) < 500)} 
                      className="w-full py-6 bg-gray-900 text-white rounded-[2.2rem] font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-cyan-500 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-30"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Heart size={18} fill="currentColor"/> Commit Offering</>}
                    </button>
                    
                    <div className="flex items-center justify-center gap-2">
                       <ShieldCheck className="text-gray-300" size={14}/>
                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                         Ecclesiastical Transparency Protocol Active
                       </p>
                    </div>
                  </div>
                </form>
            </motion.div>

            {/* Quick Donation Tiers */}
            <div className="mt-8 grid grid-cols-3 gap-4">
               {[1000, 5000, 10000].map(amt => (
                 <button 
                  key={amt} 
                  onClick={() => setFormData({...formData, amount: amt.toString()})}
                  className="py-4 bg-white border border-gray-100 rounded-2xl font-black text-[10px] text-gray-400 hover:text-cyan-600 hover:border-cyan-200 transition-all shadow-sm active:scale-95"
                 >
                   {amt.toLocaleString()} RWF
                 </button>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donations;
