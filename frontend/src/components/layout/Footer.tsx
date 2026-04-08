import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Fix framer-motion prop errors by casting motion to any
import { motion as motionLib, AnimatePresence } from 'framer-motion';
const motion = motionLib as any;
import { 
  Facebook, Twitter, Instagram, Mail, Phone, 
  MapPin, ArrowUp, Send, CheckCircle2, Sparkles, 
  Heart, ExternalLink, Youtube, MessageCircle, Music, Linkedin
} from 'lucide-react';
import { Department, FooterConfig } from '../../types';

interface FooterProps {
  departments: Department[];
  config: FooterConfig | null;
}

const Footer: React.FC<FooterProps> = ({ departments, config }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      setEmail('');
    }, 5000);
  };

  // Show top 5 ministries dynamically
  const footerMinistries = departments.slice(0, 5);

  const socialLinks = config ? [
    { icon: Facebook, href: config.facebookUrl, label: 'Facebook' },
    { icon: Twitter, href: config.twitterUrl, label: 'Twitter' },
    { icon: Instagram, href: config.instagramUrl, label: 'Instagram' },
    { icon: Youtube, href: config.youtubeUrl, label: 'YouTube' },
    { icon: MessageCircle, href: config.whatsappUrl, label: 'WhatsApp' },
    { icon: Music, href: config.tiktokUrl, label: 'TikTok' },
    { icon: Linkedin, href: config.linkedinUrl, label: 'LinkedIn' },
  ].filter(link => link.href && link.href.length >= 1) : [];

  const contactBio = config?.description || 'Showing Christ to Academicians since 1997. A vibrant sanctuary for faith, excellence, and community within the University of Rwanda.';
  const contactAddress = config?.address || 'UR CST Campus, Nyarugenge, Kigali';
  const contactPhone = config?.phone || '+250 787 846 433';
  const contactEmail = config?.email || 'connect@rasa-ur.org';

  const LOGO_SRC = "/RASA-logo.png";

  return (
    <footer className="bg-primary text-black pt-24 pb-12 relative overflow-hidden border-t border-gray-100">
      {/* Decorative Gradient Pulse */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent"></div>

      <div className="max-container px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
          
          {/* Brand Identity Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="inline-flex items-center gap-4 group">
              <img src={LOGO_SRC} alt="Logo" className="w-12 h-12 object-contain" />
              <span className="text-3xl font-black italic font-serif tracking-tighter">
                RASA <span className="text-secondary">UR</span>
              </span>
            </Link>
            
            <p className="text-black/60 text-lg leading-relaxed font-light">
              {contactBio}
            </p>

            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social, i) => (
                <motion.a 
                  key={`social-${social.label}-${i}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="w-12 h-12 bg-secondary/5 border border-secondary/10 rounded-2xl flex items-center justify-center text-black/60 hover:text-white hover:bg-accent transition-all shadow-sm"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Dynamic Ministries Column */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-sm font-black uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
              <Sparkles size={14} /> Ministries
            </h4>
            <ul className="space-y-4">
              {footerMinistries.map((dept, i) => (
                <li key={`footer-dept-${dept.id || i}`}>
                  <Link 
                    to={`/departments/${dept.id}`}
                    className="text-black/60 hover:text-accent flex items-center gap-2 group transition-colors text-sm font-bold"
                  >
                    <div className="w-1 h-1 bg-secondary rounded-full group-hover:scale-150 transition-transform"></div>
                    {dept.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/departments" className="text-secondary hover:text-accent text-[10px] font-black uppercase tracking-widest flex items-center gap-2 pt-2 transition-colors">
                  View All <ExternalLink size={12} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Navigation Column */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-sm font-black uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
              <ArrowUp size={14} /> Navigate
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'About History', href: '/about' },
                { name: 'Latest News', href: '/news' },
                { name: 'Bulletins', href: '/announcements' },
                { name: 'Support Us', href: '/donations' },
                { name: 'Member Portal', href: '/portal' },
              ].map((link, i) => (
                <li key={`nav-${link.name}-${i}`}>
                  <Link 
                    to={link.href}
                    className="text-black/60 hover:text-accent transition-colors text-sm font-bold flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-black/10 rounded-full group-hover:bg-secondary transition-colors"></div>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4 space-y-8">
            <h4 className="text-sm font-black uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
              <Mail size={14} /> Divine Digest
            </h4>
            <p className="text-black/60 text-sm font-medium leading-relaxed">
              Receive weekly scriptures and association updates directly in your digital mailbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="relative group">
                <AnimatePresence mode="wait">
                  {isSubscribed ? (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 p-4 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest"
                    >
                      <CheckCircle2 size={18} /> Stewardship Synchronized
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="input-container"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@ur.ac.rw"
                        className="flex-grow bg-secondary/5 border border-secondary/10 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-primary focus:border-secondary outline-none transition-all placeholder:text-black/30 text-black"
                      />
                      <button 
                        type="submit"
                        className="p-4 bg-secondary text-white rounded-2xl shadow-md hover:bg-accent active:scale-95 transition-all"
                      >
                        <Send size={20} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>

            <div className="space-y-3 pt-4 border-t border-black/5">
              <p className="flex items-center gap-3 text-black/60 text-sm font-medium">
                <MapPin className="text-secondary shrink-0" size={18} /> 
                {contactAddress}
              </p>
              <p className="flex items-center gap-3 text-black/60 text-sm font-medium">
                <Phone className="text-secondary shrink-0" size={18} /> 
                {contactPhone}
              </p>
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 text-black/60 text-sm font-medium hover:text-accent transition-colors group">
                <Mail className="text-secondary shrink-0" size={18} /> 
                {contactEmail}
                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-black/40 text-[11px] font-black uppercase tracking-widest">
              © {new Date().getFullYear()} RASA UR
            </p>
            <div className="hidden md:block w-1.5 h-1.5 bg-black/10 rounded-full"></div>
            <p className="text-secondary/60 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <Heart size={12} fill="currentColor" /> Agakiza • Urukundo • Umurimo
            </p>
          </div>

          <div className="flex items-center gap-8">
            {/* System Status */}
            <div className="flex items-center gap-3 px-4 py-2 bg-secondary/5 border border-secondary/10 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40">System Online</span>
            </div>

            {/* Back to top */}
            <button 
              onClick={scrollToTop}
              className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black group transition-colors"
            >
              Back to Top
              <div className="w-10 h-10 bg-secondary/5 border border-secondary/10 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all">
                <ArrowUp size={16} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
