import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Briefcase, BookOpen, Wallet, User as UserIcon, LogOut, ChevronRight, Loader2, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { API } from '../services/api';
import { Announcement, DailyVerse, BibleQuiz, NewsItem, DepartmentInterest, Donation, Department, DonationProject } from '../types';

import MemberOverviewTab from '../components/member/MemberOverviewTab';
import MemberProfileTab from '../components/member/MemberProfileTab';
import MemberSpiritualTab from '../components/member/MemberSpiritualTab';
import MemberOfferingsTab from '../components/member/MemberOfferingsTab';
import MemberMinistriesTab from '../components/member/MemberMinistriesTab';

interface MemberDashboardProps {
  announcements: Announcement[];
}

const MemberDashboard: React.FC<MemberDashboardProps> = ({ announcements }) => {
  const { user: currentUser, updateUser, logout } = useAuth();
  const { notify } = useNotification();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Modular Data States
  const [dailyVerse, setDailyVerse] = useState<DailyVerse | null>(null);
  const [quizzes, setQuizzes] = useState<BibleQuiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<BibleQuiz | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<NewsItem[]>([]);
  
  // Ministries State
  const [departments, setDepartments] = useState<Department[]>([]);
  const [pendingRequests, setPendingRequests] = useState<DepartmentInterest[]>([]);
  
  // Offerings State
  const [userDonations, setUserDonations] = useState<Donation[]>([]);
  const [donationProjects, setDonationProjects] = useState<DonationProject[]>([]);
  
  // Profile State
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const loadDashboardData = async () => {
    setIsLoadingData(true);
    try {
      const [verse, qz, newsData, depts, interests, donProjects, allDonations] = await Promise.all([
        API.spiritual.verses.getDaily(),
        API.spiritual.quizzes.getActive(),
        API.news.getAll(),
        API.departments.getAll(),
        API.departments.getInterests(),
        API.donations.projects.getAll(),
        API.donations.getAll()
      ]);
      
      setDailyVerse(verse);
      setQuizzes(qz || []);
      setUpcomingEvents(newsData?.filter((n: NewsItem) => n.category === 'event').slice(0, 3) || []);
      setDepartments(depts || []);
      setPendingRequests(interests || []);
      setDonationProjects(donProjects || []);
      
      // Filter donations by current user
      if (currentUser) {
        setUserDonations(allDonations.filter(d => 
          d.donorName === currentUser.fullName || 
          d.email === currentUser.email || 
          d.phone === currentUser.phone
        ));
      }

    } catch (err) {
      console.error("Dashboard Load Error:", err);
      // Fallback
      setDepartments([{ id: '1', name: 'Media Team', description: 'Technical and AV.' }, { id: '2', name: 'Choir', description: 'Worship and praise.' }] as any);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (currentUser) loadDashboardData();
  }, [currentUser]);

  const handleUpdateProfile = async (updates: Partial<typeof currentUser>) => {
    if (!currentUser) return;
    setIsSavingProfile(true);
    try {
      await API.members.update(currentUser.id, updates);
      updateUser({ ...currentUser, ...updates });
      notify("Identity Synchronized", "Your profile has been updated.", "success");
    } catch (err) {
      notify("Sync Failure", "Failed to update profile.", "error");
    } finally { 
      setIsSavingProfile(false); 
    }
  };

  const navItems = [
    { id: 'overview', icon: Layout, label: 'Overview' },
    { id: 'ministries', icon: Briefcase, label: 'My Ministries' },
    { id: 'spiritual', icon: BookOpen, label: 'Sanctuary Quests' },
    { id: 'offerings', icon: Wallet, label: 'My Offerings' },
    { id: 'profile', icon: UserIcon, label: 'Identity Sync' },
  ];

  const currentLevelProgress = useMemo(() => {
    if (!currentUser) return 0;
    const points = currentUser.spiritPoints || 0;
    return (points % 500) / 5; 
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] pt-28">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Persistent Sidebar Setup */}
      <aside className={`fixed lg:sticky top-[7rem] left-0 h-[calc(100vh-7rem)] w-[280px] bg-white border-r border-gray-100 shadow-[0_0_40px_rgba(0,0,0,0.02)] z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Header containing name and title */}
        <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex flex-col items-start gap-2">
          <div className="flex items-center gap-3 mb-1">
            <span className="px-3 py-1 bg-secondary text-white text-[8px] font-black uppercase rounded-lg tracking-widest">{currentUser.role} Clearance</span>
          </div>
          <h2 className="text-xl font-black font-serif italic text-black leading-tight uppercase flex items-center gap-2">
            {currentUser.fullName.split(' ')[0]} 
          </h2>
          <p className="text-[9px] font-black uppercase text-black/30 tracking-[0.2em] flex items-center gap-1"><MapPin size={10}/> {currentUser.diocese}</p>
          
          <div className="w-20 h-20 rounded-[1.5rem] bg-secondary overflow-hidden shadow-xl mt-4 border-2 border-white/50">
             {currentUser.profileImage ? (
               <img src={currentUser.profileImage} className="w-full h-full object-cover" alt={currentUser.fullName} />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-white text-3xl font-black bg-gradient-to-br from-secondary to-black">
                 {currentUser.fullName.charAt(0)}
               </div>
             )}
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2 custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group
                ${activeTab === item.id ? 'bg-black text-white shadow-xl scale-[1.02]' : 'text-gray-400 hover:bg-gray-50 hover:text-secondary'}`}
            >
              <item.icon size={18} className={activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-secondary'}/>
              <span className="font-black text-[10px] uppercase tracking-widest">{item.label}</span>
              {activeTab === item.id && <ChevronRight size={14} className="ml-auto opacity-50"/>}
            </button>
          ))}
        </nav>

        {/* Bottom Area */}
        <div className="p-6 border-t border-gray-50 bg-white">
          <button onClick={logout} className="w-full flex items-center justify-center gap-3 py-4 bg-gray-50 text-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all group">
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Eject from System
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 pt-8 lg:pt-0">
        
        {/* Mobile Navbar trigger */}
        <div className="lg:hidden fixed top-[4.5rem] w-full z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 p-4 flex items-center justify-between">
          <h2 className="font-black text-xs uppercase tracking-widest">Dash<span className="text-secondary">board</span></h2>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-gray-50 rounded-xl"><Layout size={20}/></button>
        </div>

        <div className="flex-1 max-w-[1600px] w-full mx-auto p-6 lg:p-10 xl:p-12">
          {isLoadingData ? (
             <div className="h-full w-full flex flex-col items-center justify-center space-y-4 pt-20">
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Loader2 className="text-secondary" size={48} /></motion.div>
               <p className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-400">Verifying Kingdom Archives...</p>
             </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'overview' && (
                  <MemberOverviewTab 
                    currentUser={currentUser} dailyVerse={dailyVerse} upcomingEvents={upcomingEvents} 
                    announcements={announcements} quizzes={quizzes} setActiveQuiz={(q) => {setActiveQuiz(q); setActiveTab('spiritual');}}
                    currentLevelProgress={currentLevelProgress}
                  />
                )}
                {activeTab === 'ministries' && (
                  <MemberMinistriesTab 
                    currentUser={currentUser} departments={departments} 
                    pendingRequests={pendingRequests} onRefresh={loadDashboardData}
                  />
                )}
                {activeTab === 'spiritual' && (
                  <MemberSpiritualTab 
                    currentUser={currentUser} quizzes={quizzes} updateUser={updateUser}
                    activeQuiz={activeQuiz} setActiveQuiz={setActiveQuiz}
                  />
                )}
                {activeTab === 'offerings' && (
                  <MemberOfferingsTab 
                    currentUser={currentUser} userDonations={userDonations} 
                    projects={donationProjects} onRefresh={loadDashboardData}
                  />
                )}
                {activeTab === 'profile' && (
                  <MemberProfileTab 
                    currentUser={currentUser} onUpdateProfile={handleUpdateProfile} isSaving={isSavingProfile}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
};

export default MemberDashboard;
