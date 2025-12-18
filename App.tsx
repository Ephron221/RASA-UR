
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Shield, Heart, Briefcase, Cross, Quote, Sparkles, Book } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Portal from './pages/Portal';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Announcements from './pages/Announcements';
import Contact from './pages/Contact';
import Departments from './pages/Departments';
import ProtectedRoute from './components/ProtectedRoute';
import { User, NewsItem, Leader, Announcement } from './types';
import { API } from './services/api';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const initApp = async () => {
      try {
        const savedUser = localStorage.getItem('rasa_user');
        if (savedUser) setUser(JSON.parse(savedUser));

        const [newsData, leadersData, membersData, announcementsData] = await Promise.all([
          API.news.getAll(),
          API.leaders.getAll(),
          API.members.getAll(),
          API.announcements.getAll()
        ]);

        setNews(newsData);
        setLeaders(leadersData);
        setMembers(membersData);
        setAnnouncements(announcementsData);
      } catch (err) {
        console.error('Failed to boot system:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('rasa_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('rasa_user');
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 space-y-4">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Loader2 className="text-cyan-500" size={48} />
        </motion.div>
        <p className="font-black text-xs uppercase tracking-widest text-gray-400">Booting RASA Core...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home news={news} leaders={leaders} />} />
            <Route path="/portal" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Portal onLogin={handleLogin} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/news" element={<News news={news} />} />
            <Route path="/news/:id" element={<NewsDetail news={news} />} />
            <Route path="/announcements" element={<Announcements announcements={announcements} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/departments/:id" element={<Departments />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute user={user}>
                  <MemberDashboard user={user!} announcements={announcements} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute user={user} requiredRole="admin">
                  <AdminDashboard 
                    members={members} 
                    news={news} 
                    leaders={leaders}
                    announcements={announcements}
                    onUpdateNews={setNews} 
                    onUpdateLeaders={setLeaders} 
                    onUpdateMembers={setMembers}
                    onUpdateAnnouncements={setAnnouncements}
                  />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

const AboutPage = () => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }}
    className="pt-32 pb-20 bg-white"
  >
    <div className="max-container px-4">
      {/* Hero Section */}
      <section className="mb-24">
        <div className="max-w-4xl">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3 text-cyan-600 font-black text-xs uppercase tracking-[0.4em] mb-6"
          >
            <div className="w-12 h-0.5 bg-cyan-500"></div>
            Heritage & Faith
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold font-serif italic mb-8 text-gray-900 leading-tight"
          >
            Our Eternal <span className="text-cyan-500">Genesis</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-gray-500 leading-relaxed font-light italic border-l-4 border-cyan-500 pl-8"
          >
            "To proclaim the Gospel of Jesus Christ to all university students, discipling believers, and influencing local churches."
          </motion.p>
        </div>
      </section>

      {/* History & Origin */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32 items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="absolute -inset-4 bg-cyan-500/10 rounded-[4rem] blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
          <img 
            src="https://images.unsplash.com/photo-1544427928-c49cdfebf193?q=80&w=2000&auto=format&fit=crop" 
            className="relative rounded-[3.5rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 object-cover aspect-video lg:aspect-square" 
            alt="RASA History" 
          />
          <div className="absolute bottom-10 right-10 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 max-w-xs transform group-hover:-translate-y-2 transition-transform">
            <p className="text-xs font-black uppercase tracking-widest text-cyan-600 mb-2">The Genesis</p>
            <p className="font-bold text-gray-900 leading-tight">Founded in 1997 at the former National University of Rwanda (UNR) in Butare.</p>
          </div>
        </motion.div>

        <div className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-black font-serif italic text-gray-900">A Legacy of Revival</h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              RASA (Rwanda Anglican Students Association) emerged from a divine burden to create a spiritual home for Anglican students. What began as a small gathering of believers in Butare has blossomed into a nationwide movement of university students dedicated to the Great Commission.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:bg-white hover:shadow-xl transition-all group">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Sparkles className="text-cyan-500" size={18} /> Vision
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                To be a vibrant community of transformed university students dedicated to God and society, reflecting the glory of Christ in all spheres of life.
              </p>
            </div>
            <div className="p-8 bg-cyan-900 text-white rounded-[2.5rem] shadow-xl group">
              <h4 className="text-sm font-black text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Cross className="text-cyan-400" size={18} /> Mission
              </h4>
              <p className="text-cyan-50/70 text-sm leading-relaxed">
                Empowering students to live out their faith, discipling them through biblical teaching, and influencing campus culture with the love of Christ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Motto Pillars */}
      <section className="mb-32">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl font-bold font-serif italic text-gray-900">Our <span className="text-cyan-500">Motto</span></h2>
          <p className="text-gray-500 uppercase tracking-[0.3em] font-black text-[10px]">Agakiza • Urukundo • Umurimo</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: 'Agakiza', 
              label: 'Salvation', 
              icon: Shield, 
              desc: 'The foundation of our faith. We believe in the transforming power of Jesus Christ and the gift of eternal life.',
              color: 'bg-blue-50 text-blue-600 border-blue-100'
            },
            { 
              title: 'Urukundo', 
              label: 'Love', 
              icon: Heart, 
              desc: 'The bond that unites us. We strive to love God with all our hearts and our neighbors as ourselves.',
              color: 'bg-red-50 text-red-600 border-red-100'
            },
            { 
              title: 'Umurimo', 
              label: 'Work', 
              icon: Briefcase, 
              desc: 'Our commitment to excellence. We serve God through our studies, ministries, and community engagement.',
              color: 'bg-gray-900 text-white border-gray-800'
            }
          ].map((pillar, i) => (
            <motion.div 
              key={i}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-12 rounded-[3.5rem] border ${pillar.color} flex flex-col items-center text-center space-y-6 shadow-sm hover:shadow-2xl transition-all`}
            >
              <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md shadow-inner">
                <pillar.icon size={40} />
              </div>
              <div>
                <h3 className="text-3xl font-black font-serif italic mb-1">{pillar.title}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{pillar.label}</p>
              </div>
              <p className="text-sm opacity-80 leading-relaxed font-medium">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Scriptural Foundation */}
      <section className="relative py-24 px-12 bg-gray-50 rounded-[4rem] overflow-hidden">
        <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
          <Book size={400} />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <div className="w-12 h-1 bg-cyan-500 mx-auto rounded-full"></div>
            <h2 className="text-4xl font-bold font-serif italic text-gray-900">Scriptural Foundation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8 bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 relative"
            >
              <Quote className="absolute -top-6 -left-6 text-cyan-200" size={64} />
              <p className="text-xl text-gray-700 leading-relaxed font-medium italic">
                "Until we all reach unity in the faith and in the knowledge of the Son of God and become mature, attaining to the whole measure of the fullness of Christ."
              </p>
              <div className="pt-6 border-t border-gray-50">
                <p className="text-cyan-600 font-black text-xs uppercase tracking-widest">Ephesians 4:13</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Key Canonical Pillar</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8 bg-gray-900 p-12 rounded-[3rem] shadow-xl relative text-white"
            >
              <Quote className="absolute -top-6 -right-6 text-white/5" size={64} />
              <p className="text-xl text-white/90 leading-relaxed font-medium italic">
                "But you are a chosen people, a royal priesthood, a holy nation, God's special possession, that you may declare the praises of him who called you out of darkness into his wonderful light."
              </p>
              <div className="pt-6 border-t border-white/5">
                <p className="text-cyan-400 font-black text-xs uppercase tracking-widest">1 Peter 2:9</p>
                <p className="text-[10px] text-white/30 font-bold uppercase mt-1">Identity & Purpose</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mt-32 text-center space-y-10">
        <h2 className="text-4xl font-black font-serif italic text-gray-900">Be Part of the Story</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/portal" className="px-12 py-5 bg-cyan-500 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-2xl shadow-cyan-100 hover:bg-cyan-600 transition-all flex items-center gap-3 group">
            Join the Family <Quote size={16} className="rotate-180" />
          </Link>
          <Link to="/contact" className="px-12 py-5 bg-gray-50 text-gray-900 rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100">
            Visit Our Service
          </Link>
        </div>
      </section>
    </div>
  </motion.div>
);

export default App;
