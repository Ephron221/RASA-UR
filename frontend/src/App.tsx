
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
// Fix framer-motion prop errors by casting motion to any
import { AnimatePresence, motion as motionLib } from 'framer-motion';
const motion = motionLib as any;
import { Loader2 } from 'lucide-react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
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
import About from './pages/About';
import ProtectedRoute from './routes/ProtectedRoute';
import SacredToast from './components/SacredToast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { User, NewsItem, Leader, Announcement, Department, FooterConfig, HomeConfig, RoleDefinition } from './types';
import { API } from './services/api';
import { DEPARTMENTS as INITIAL_DEPTS } from './constants';

const AppContent: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [footerConfig, setFooterConfig] = useState<FooterConfig | null>(null);
  const [homeConfig, setHomeConfig] = useState<HomeConfig | null>(null);
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // Determine if the current user should be in the Admin or Member dashboard
  const userAccess = useMemo(() => {
    if (!user) return { isAdmin: false };
    const roleDef = roles.find(r => r.id === user.role);
    // IT Architect is always admin. Anyone with a "tab." permission is considered an administrative user.
    const isAdmin = user.role === 'it' || (roleDef?.permissions.some(p => p.startsWith('tab.')) ?? false);
    return { isAdmin };
  }, [user, roles]);

  // --- DYNAMIC ROLE REDIRECTION ---
  useEffect(() => {
    if (!user || isDataLoading) return;

    const isDashboardPath = location.pathname === '/dashboard';
    const isAdminPath = location.pathname === '/admin';

    if (userAccess.isAdmin && isDashboardPath) {
      navigate('/admin', { replace: true });
    } else if (!userAccess.isAdmin && isAdminPath) {
      navigate('/dashboard', { replace: true });
    }
  }, [userAccess.isAdmin, location.pathname, navigate, isDataLoading, user]);

  const refreshGlobalData = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        API.news.getAll(),
        API.leaders.getAll(),
        API.members.getAll(),
        API.announcements.getAll(),
        API.departments.getAll(),
        API.footer.getConfig(),
        API.home.getConfig(),
        API.roles.getAll()
      ]);

      const [newsRes, leadersRes, membersRes, annRes, deptsRes, footerRes, homeRes, rolesRes] = results;

      if (newsRes.status === 'fulfilled') setNews(newsRes.value || []);
      if (leadersRes.status === 'fulfilled') setLeaders(leadersRes.value || []);
      if (membersRes.status === 'fulfilled') setMembers(membersRes.value || []);
      if (annRes.status === 'fulfilled') setAnnouncements(annRes.value || []);
      if (footerRes.status === 'fulfilled') setFooterConfig(footerRes.value);
      if (homeRes.status === 'fulfilled') setHomeConfig(homeRes.value);
      if (rolesRes.status === 'fulfilled') setRoles(rolesRes.value || []);
      if (deptsRes.status === 'fulfilled') {
        setDepartments(deptsRes.value?.length ? deptsRes.value : INITIAL_DEPTS);
      }
    } catch (err) {
      console.error('Data sync issue:', err);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  useEffect(() => { refreshGlobalData(); }, [refreshGlobalData]);

  if (authLoading || isDataLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 space-y-4">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Loader2 className="text-cyan-500" size={48} />
        </motion.div>
        <p className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-400">Synchronizing Divine Kernel...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar departments={departments} />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home news={news} leaders={leaders} />} />
            <Route path="/portal" element={
              user ? (
                userAccess.isAdmin
                  ? <Navigate to="/admin" replace />
                  : <Navigate to="/dashboard" replace />
              ) : <Portal />
            } />
            <Route path="/about" element={<About />} />
            <Route path="/news" element={<News news={news} />} />
            <Route path="/news/:id" element={<NewsDetail news={news} />} />
            <Route path="/announcements" element={<Announcements announcements={announcements} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/departments" element={<Departments departments={departments} />} />
            <Route path="/departments/:id" element={<Departments departments={departments} />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/dashboard" element={<ProtectedRoute><MemberDashboard announcements={announcements} /></ProtectedRoute>} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute isAdminRequired={true}>
                  <AdminDashboard
                    members={members} news={news} leaders={leaders}
                    announcements={announcements} depts={departments}
                    onUpdateNews={setNews} onUpdateLeaders={setLeaders}
                    onUpdateMembers={setMembers} onUpdateAnnouncements={setAnnouncements}
                    onUpdateDepartments={setDepartments} onUpdateFooter={setFooterConfig}
                  />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer departments={departments} config={footerConfig} />
      <SacredToast />
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  </AuthProvider>
);

export default App;
