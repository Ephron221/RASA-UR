
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
import Donations from './pages/Donations';
import ProtectedRoute from './components/ProtectedRoute';
import { User, NewsItem, Leader, Announcement, Department } from './types';
import { API } from './services/api';
import { DEPARTMENTS as INITIAL_DEPTS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const initApp = async () => {
      try {
        const savedUser = localStorage.getItem('rasa_user');
        if (savedUser) setUser(JSON.parse(savedUser));

        const [newsData, leadersData, membersData, announcementsData, deptsData] = await Promise.all([
          API.news.getAll(),
          API.leaders.getAll(),
          API.members.getAll(),
          API.announcements.getAll(),
          API.departments.getAll()
        ]);

        setNews(newsData);
        setLeaders(leadersData);
        setMembers(membersData);
        setAnnouncements(announcementsData);
        setDepartments(deptsData.length > 0 ? deptsData : INITIAL_DEPTS);
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
      <Navbar user={user} departments={departments} onLogout={handleLogout} />
      
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
            <Route path="/departments" element={<Departments departments={departments} user={user} />} />
            <Route path="/departments/:id" element={<Departments departments={departments} user={user} />} />
            <Route path="/donations" element={<Donations />} />
            
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
                    depts={departments}
                    onUpdateNews={setNews} 
                    onUpdateLeaders={setLeaders} 
                    onUpdateMembers={setMembers}
                    onUpdateAnnouncements={setAnnouncements}
                    onUpdateDepartments={setDepartments}
                  />
                </ProtectedRoute>
              } 
            />

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
      <section className="mb-24">
        <div className="max-container">
          <h1 className="text-6xl md:text-8xl font-bold font-serif italic mb-8 text-gray-900 leading-tight">Our Eternal <span className="text-cyan-500">Genesis</span></h1>
        </div>
      </section>
    </div>
  </motion.div>
);

export default App;
