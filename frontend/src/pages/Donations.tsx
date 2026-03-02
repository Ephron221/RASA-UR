import React, { useState, useEffect, useRef } from 'react';
// Fix framer-motion prop errors by casting motion to any
import { motion as motionLib, AnimatePresence } from 'framer-motion';
const motion = motionLib as any;
import { 
  Heart, Handshake, ShieldCheck, Sparkles, Send, Loader2, 
  CheckCircle2, DollarSign, ArrowRight, User, Mail, Phone, 
  Info, CreditCard, Smartphone, Copy, Check, TrendingUp,
  Coins, Gift, Target, X, Landmark, ExternalLink, FileText, Camera, Upload
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
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    donorName: '',
    email: '',
    phone: '',
    amount: '500', 
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

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProofPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
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
      transactionId: `${paymentMethod.toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      paymentProof: proofPreview || undefined
    };

    try {
      await API.donations.create(donation);
      notify("Stewardship Appreciated", `Your contribution of ${Number(formData.amount).toLocaleString()} RWF has been logged. Our finance team will verify the proof shortly.`, "divine");
      setFormData({ donorName: '', email: '', phone: '', amount: '500' });
      setSelectedProject(null);
      setProofPreview(null);
    } catch (err) {
      console.error(err);
      notify("Transmission Error", "Failed to sync contribution. Please try again.", "info");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-32 bg-[#F9FBFC] relative overflow-x-hidden">
      <div className="max-container px-4 relative z-10">
        <header className="mb-24 text-center space-y-8">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-3 px-6 py-2.5 bg-white border border-cyan-100 rounded-full text-cyan-600 font-black text-[10px] uppercase tracking-[0.4em] shadow-sm"><Sparkles size={14} className="animate-pulse" /> Support The Kingdom Vision</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-6xl md:text-9xl font-bold font-serif italic text-gray-900 leading-[0.95] tracking-tight">Invest In <span className="text-cyan-500">Grace</span></motion.h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 space-y-16">
            <div className="space-y-10">
              <div className="flex items-center justify-between border-b border-gray-100 pb-6"><div className="space-y-1"><h3 className="text-3xl font-black font-serif italic text-gray-900">Current Mandates</h3><p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">Active Ministerial Investments</p></div><div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-cyan-500 shadow-sm border border-gray-50"><Target size={24} /></div></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((project, idx) => (
                  <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} onClick={() => setSelectedProject(project)} className={`cursor-pointer group relative bg-white p-7 rounded-[3.5rem] border-2 transition-all duration-500 ${selectedProject?.id === project.id ? 'border-cyan-500 shadow-3xl scale-[1.02]' : 'border-gray-50 hover:border-cyan-100'}`}>
                    <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-8 relative"><img src={project.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"/><div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div></div>
                    <div className="space-y-4"><h4 className="text-2xl font-black text-gray-900 leading-tight">{project.title}</h4><p className="text-sm text-gray-500 line-clamp-2 leading-relaxed font-medium italic">"{project.description}"</p></div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-[4rem] p-10 md:p-16 text-white relative overflow-hidden shadow-3xl">
              <div className="relative z-10 space-y-12">
                <div className="space-y-2"><h3 className="text-4xl md:text-5xl font-black font-serif italic">Access Credentials</h3><p className="text-[10px] font-black uppercase text-cyan-400 tracking-[0.4em]">Official Contribution Channels</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6"><div className="flex items-center gap-3"><Smartphone className="text-amber-500" size={24}/><p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Momo Gateway (RW)</p></div><div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all group"><div className="flex justify-between items-center mb-4"><span className="text-4xl font-black font-mono tracking-tighter text-amber-500">411695</span><button onClick={() => copyToClipboard('411695', 'momo')} className="p-4 bg-white/5 rounded-2xl hover:bg-amber-500 hover:text-white transition-all shadow-lg">{copied === 'momo' ? <Check size={20} className="text-green-400"/> : <Copy size={20} className="text-white/40 group-hover:text-white"/>}</button></div><p className="text-[10px] font-black text-gray-400 uppercase">Registered Name: <span className="text-white">Lambert</span></p></div></div>
                  <div className="space-y-6"><div className="flex items-center gap-3"><Landmark className="text-cyan-400" size={24}/><p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">Bank Transfer</p></div><div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all group"><div className="flex justify-between items-start mb-4"><div className="space-y-1"><p className="text-2xl font-black font-mono tracking-tight text-cyan-400">408421629010134</p><p className="text-[10px] font-black text-gray-400 uppercase">Bank of Populaire</p></div><button onClick={() => copyToClipboard('408421629010134', 'bank')} className="p-4 bg-white/5 rounded-2xl hover:bg-cyan-500 hover:text-white transition-all shadow-lg">{copied === 'bank' ? <Check size={20} className="text-green-400"/> : <Copy size={20} className="text-white/40 group-hover:text-white"/>}</button></div><p className="text-[10px] font-black text-gray-400 uppercase">Account Name: <span className="text-white">RASA UR-NYG</span></p></div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-36 pb-12">
            <motion.div layout className="bg-white p-10 md:p-16 rounded-[4.5rem] shadow-3xl border border-gray-100 relative overflow-hidden">
                <form className="space-y-10 relative z-10" onSubmit={handleDonate}>
                  <div className="space-y-2"><h3 className="text-4xl font-black font-serif italic text-gray-900">Initiate Offering</h3><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Identify your divine deposit</p></div>
                  <div className="flex gap-2 p-1.5 bg-gray-50 rounded-[2rem] border border-gray-100"><button type="button" onClick={() => setPaymentMethod('momo')} className={`flex-1 py-4 rounded-[1.6rem] text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'momo' ? 'bg-amber-500 text-white shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}>Momo Pay</button><button type="button" onClick={() => setPaymentMethod('bank')} className={`flex-1 py-4 rounded-[1.6rem] text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'bank' ? 'bg-cyan-500 text-white shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}>Bank Transfer</button></div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2"><label className="text-[9px] font-black text-gray-400 uppercase ml-4">Full Legal Identity</label><div className="relative group"><User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500" size={18}/><input required value={formData.donorName} onChange={e => setFormData({...formData, donorName: e.target.value})} placeholder="Steward Name" className="w-full pl-16 pr-8 py-5 bg-gray-50 rounded-[2.2rem] outline-none font-bold text-sm border-2 border-transparent focus:border-cyan-100 transition-all" /></div></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><label className="text-[9px] font-black text-gray-400 uppercase ml-4">Phone Pulse</label><input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+250..." className="w-full px-8 py-5 bg-gray-50 rounded-[2.2rem] outline-none font-bold text-sm border-2 border-transparent focus:border-cyan-100 transition-all" /></div>
                      <div className="space-y-2"><label className="text-[9px] font-black text-gray-400 uppercase ml-4">Magnitude (RWF)</label><input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="500" className="w-full px-8 py-5 bg-gray-50 rounded-[2.2rem] outline-none font-black text-lg border-2 border-transparent focus:border-cyan-100 transition-all text-cyan-600" /></div>
                    </div>

                    {/* PAYMENT PROOF UPLOAD */}
                    <div className="space-y-4 pt-4 border-t border-gray-50">
                       <label className="text-[10px] font-black text-cyan-600 uppercase tracking-widest ml-4 flex items-center gap-2"><FileText size={14}/> Upload Verification Document</label>
                       <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-[2.5rem] p-8 cursor-pointer transition-all duration-300 ${proofPreview ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 bg-gray-50/50 hover:bg-white hover:border-cyan-200'}`}
                       >
                          <input type="file" ref={fileInputRef} onChange={handleProofUpload} accept="image/*,.pdf" className="hidden" />
                          {proofPreview ? (
                            <div className="relative group">
                              <img src={proofPreview} className="w-32 h-32 object-cover rounded-3xl shadow-lg border-4 border-white" alt="Proof"/>
                              <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><RefreshCw size={24} className="text-white animate-spin-slow"/></div>
                            </div>
                          ) : (
                            <div className="text-center space-y-2">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-cyan-500 shadow-sm mx-auto mb-2"><Upload size={20}/></div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Attach Bank Slip / Digital Receipt</p>
                              <p className="text-[8px] font-medium text-gray-300 italic px-6 leading-relaxed">"A digital witness of your contribution for ecclesiastical transparency."</p>
                            </div>
                          )}
                          {proofPreview && <button type="button" onClick={(e) => {e.stopPropagation(); setProofPreview(null);}} className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-red-50 text-red-500 rounded-full shadow-sm"><X size={14}/></button>}
                       </div>
                    </div>
                  </div>

                  <button disabled={isSubmitting || Number(formData.amount) < 500} className="w-full py-6 bg-gray-900 text-white rounded-[2.2rem] font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-cyan-500 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-30">
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Heart size={18} fill="currentColor"/> Commit Offering</>}
                  </button>
                </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RefreshCw = ({size, className}: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>;

export default Donations;
