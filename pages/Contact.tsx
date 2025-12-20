
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, MessageSquare, CheckCircle2, Loader2, User as UserIcon } from 'lucide-react';
import { API } from '../services/api';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const msg = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    try {
      await API.contacts.create(msg);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#F9FBFC]">
      <div className="max-container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 space-y-12">
            <header className="space-y-4">
              <p className="text-cyan-600 font-black text-xs uppercase tracking-[0.4em]">Get In Touch</p>
              <h1 className="text-5xl md:text-7xl font-bold font-serif italic text-gray-900 leading-tight">Connect With <span className="text-cyan-500">RASA</span></h1>
              <p className="text-gray-500 text-lg font-medium">Have questions? We are here to listen and respond.</p>
            </header>
            <div className="space-y-6">
              {[
                { icon: MapPin, label: 'Location', value: 'UR CST Campus, Nyarugenge, Kigali' },
                { icon: Phone, label: 'Helpline', value: '+250 780 000 000' },
                { icon: Mail, label: 'Email', value: 'connect@rasa-nyg.org' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl group transition-all">
                  <div className="p-4 bg-cyan-50 text-cyan-600 rounded-2xl group-hover:bg-cyan-500 group-hover:text-white transition-all"><item.icon size={24} /></div>
                  <div><p className="text-[10px] font-black text-gray-400 uppercase">{item.label}</p><p className="font-bold text-gray-900">{item.value}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-gray-100 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form key="form" exit={{ opacity: 0, y: -20 }} className="space-y-8" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 ml-4 block uppercase tracking-widest">Full Name</label>
                        <input required name="fullName" type="text" placeholder="John Doe" className="w-full px-8 py-5 bg-gray-50 border border-transparent rounded-[1.8rem] focus:bg-white focus:border-cyan-100 outline-none font-bold text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 ml-4 block uppercase tracking-widest">Email</label>
                        <input required name="email" type="email" placeholder="john@example.com" className="w-full px-8 py-5 bg-gray-50 border border-transparent rounded-[1.8rem] focus:bg-white focus:border-cyan-100 outline-none font-bold text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 ml-4 block uppercase tracking-widest">Phone Number</label>
                        <input required name="phone" type="tel" placeholder="+250..." className="w-full px-8 py-5 bg-gray-50 border border-transparent rounded-[1.8rem] focus:bg-white focus:border-cyan-100 outline-none font-bold text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 ml-4 block uppercase tracking-widest">Subject</label>
                        <input required name="subject" type="text" className="w-full px-8 py-5 bg-gray-50 border border-transparent rounded-[1.8rem] focus:bg-white focus:border-cyan-100 outline-none font-bold text-sm" placeholder="Purpose of contact" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 ml-4 block uppercase tracking-widest">Message</label>
                      <textarea required name="message" rows={5} placeholder="Type your message..." className="w-full px-8 py-5 bg-gray-50 border border-transparent rounded-[1.8rem] focus:bg-white focus:border-cyan-100 outline-none font-medium text-sm transition-all resize-none"></textarea>
                    </div>
                    <button disabled={isSubmitting} className="w-full py-5 bg-cyan-500 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-cyan-600 transition-all flex items-center justify-center gap-3 active:scale-95">
                      {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} Send Message
                    </button>
                  </motion.form>
                ) : (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center space-y-6">
                    <div className="w-24 h-24 bg-cyan-50 text-cyan-500 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 size={48} /></div>
                    <h3 className="text-3xl font-black font-serif italic text-gray-900">Message Sent!</h3>
                    <p className="text-gray-500 font-medium">Thank you for connecting. We will reach out to you shortly via email or phone.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
