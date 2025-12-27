
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Newspaper, UserCheck, Plus, 
  LayoutDashboard, Home as HomeIcon, Heart, 
  MessageSquare, Briefcase, Bell, HardDrive, 
  History, Shield, Loader2, Database, Search, Sparkles
} from 'lucide-react';
import { User, NewsItem, Leader, Announcement, Department, ContactMessage, HomeConfig, AboutConfig } from '../types';
import { API } from '../services/api';

// Modular Tab Components
import OverviewTab from '../components/admin/OverviewTab';
import HomeEditorTab from '../components/admin/HomeEditorTab';
import AboutEditorTab from '../components/admin/AboutEditorTab';
import DirectoryTab from '../components/admin/DirectoryTab';
import NewsFeedTab from '../components/admin/NewsFeedTab';
import BulletinTab from '../components/admin/BulletinTab';
import MinistriesTab from '../components/admin/MinistriesTab';
import LeadershipTab from '../components/admin/LeadershipTab';
import DonationTab from '../components/admin/DonationTab';
import InboxTab from '../components/admin/InboxTab';
import SystemTab from '../components/admin/SystemTab';
import SpiritualHubTab from '../components/admin/SpiritualHubTab';

// Modal Forms
import NewsForm from '../components/admin/NewsForm';
import AnnouncementForm from '../components/admin/AnnouncementForm';
import DepartmentForm from '../components/admin/DepartmentForm';
import LeaderForm from '../components/admin/LeaderForm';

interface AdminDashboardProps {
  user: User;
  members: User[];
  news: NewsItem[];
  leaders: Leader[];
  announcements: Announcement[];
  depts: Department[];
  onUpdateNews: (news: NewsItem[]) => void;
  onUpdateLeaders: (leaders: Leader[]) => void;
  onUpdateMembers: (members: User[]) => void;
  onUpdateAnnouncements: (announcements: Announcement[]) => void;
  onUpdateDepartments: (depts: Department[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  user: currentUser, members, news, leaders, announcements, depts,
  onUpdateNews, onUpdateLeaders, onUpdateMembers, onUpdateAnnouncements, onUpdateDepartments
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [dbHealth, setDbHealth] = useState<any>({ status: 'Online', size: '0KB', lastSync: 'N/A' });
  const [contactMsgs, setContactMsgs] = useState<ContactMessage[]>([]);
  const [homeSetup, setHomeSetup] = useState<HomeConfig | null>(null);
  const [aboutSetup, setAboutSetup] = useState<AboutConfig | null>(null);

  // Modal Control
  const [showModal, setShowModal] = useState<'news' | 'leader' | 'ann' | 'dept' | 'member' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');

  // Permissions Mapping
  const isIT = currentUser.role === 'it';
  const isAccountant = currentUser.role === 'accountant';
  const isSecretary = currentUser.role === 'secretary';
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'it';
  const isExecutive = currentUser.role === 'executive';

  const rolePermissions = useMemo(() => ({
    canViewTab: (tabId: string) => {
      if (isIT) return true;
      if (isAccountant) return ['overview', 'donations'].includes(tabId);
      if (isSecretary) return ['overview', 'members', 'content', 'bulletin', 'contacts'].includes(tabId);
      if (isExecutive) return tabId !== 'system';
      return tabId === 'overview';
    },
    canManageMembers: isIT,
    canUpdateContent: isIT || isSecretary || isAdmin || isExecutive,
    canDelete: isIT,
    // Strictly restrict donation verification to the Accountant role
    canVerifyDonations: isAccountant
  }), [currentUser.role]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'home', label: 'Home Editor', icon: HomeIcon },
    { id: 'about', label: 'About Editor', icon: History },
    { id: 'spiritual', label: 'Spiritual Hub', icon: Sparkles },
    { id: 'members', label: 'Directory', icon: Users },
    { id: 'content', label: 'News Feed', icon: Newspaper },
    { id: 'bulletin', label: 'Bulletin', icon: Bell },
    { id: 'depts', label: 'Ministries', icon: Briefcase },
    { id: 'leaders', label: 'Leadership', icon: UserCheck },
    { id: 'donations', label: 'Offerings', icon: Heart },
    { id: 'contacts', label: 'Inbox', icon: MessageSquare },
    { id: 'system', label: 'System', icon: HardDrive },
  ].filter(t => rolePermissions.canViewTab(t.id));

  const fetchData = async () => {
    try {
      const [c, h, a, health, l] = await Promise.all([
        API.contacts.getAll(), 
        API.home.getConfig(),
        API.about.getConfig(),
        API.system.getHealth(),
        API.system.getLogs()
      ]);
      setContactMsgs(c);
      setHomeSetup(h);
      setAboutSetup(a);
      setDbHealth(health);
      setLogs(l);
    } catch (e) {
      console.error("Fetch error", e);
    }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setFilePreview(reader.result as string); setUrlInput(''); };
      reader.readAsDataURL(file);
    }
  };

  const commitWipe = async (type: any, id: string) => {
    if (!rolePermissions.canDelete) return alert("Security: Only IT has wipe authority.");
    if (!window.confirm("Wipe this record permanently?")) return;
    setIsSyncing(true);
    await (API as any)[type].delete(id);
    await fetchData();
    // Refresh parent state
    if (type === 'members') onUpdateMembers(await API.members.getAll());
    if (type === 'news') onUpdateNews(await API.news.getAll());
    if (type === 'announcements') onUpdateAnnouncements(await API.announcements.getAll());
    if (type === 'departments') onUpdateDepartments(await API.departments.getAll());
    if (type === 'leaders') onUpdateLeaders(await API.leaders.getAll());
    setIsSyncing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const media = filePreview || urlInput || editingItem?.image || editingItem?.mediaUrl || editingItem?.profileImage;

    try {
      if (showModal === 'news') {
        const item = { 
          title: formData.get('title') as string, 
          content: formData.get('content') as string, 
          category: formData.get('category') as any, 
          mediaUrl: media, 
          mediaType: formData.get('mediaType') as any, 
          author: currentUser.fullName, 
          date: editingItem?.date || new Date().toISOString().split('T')[0],
          startDate: formData.get('startDate') as string || undefined,
          endDate: formData.get('endDate') as string || undefined,
        };
        if (editingItem) await API.news.update(editingItem.id, item); 
        else await API.news.create({ ...item, id: Math.random().toString(36).substr(2, 9) } as any);
        onUpdateNews(await API.news.getAll());
      } else if (showModal === 'ann') {
        const item = { 
          title: formData.get('title') as string, content: formData.get('content') as string,
          status: formData.get('status') as any, color: formData.get('color') as string,
          isActive: formData.get('isActive') === 'on', date: editingItem?.date || new Date().toISOString().split('T')[0]
        };
        if (editingItem) await API.announcements.update(editingItem.id, item);
        else await API.announcements.create({ ...item, id: Math.random().toString(36).substr(2, 9) } as any);
        onUpdateAnnouncements(await API.announcements.getAll());
      } else if (showModal === 'dept') {
        const item = {
          name: formData.get('name') as string, description: formData.get('description') as string,
          icon: formData.get('icon') as string, details: formData.get('details') as string,
          image: media, activities: (formData.get('activities') as string).split(',').map(s => s.trim())
        };
        if (editingItem) await API.departments.update(editingItem.id, item);
        else await API.departments.create({ ...item, id: Math.random().toString(36).substr(2, 9) } as any);
        onUpdateDepartments(await API.departments.getAll());
      } else if (showModal === 'leader') {
        const item = {
          name: formData.get('name') as string, position: formData.get('position') as string,
          phone: formData.get('phone') as string, academicYear: formData.get('academicYear') as string,
          type: formData.get('type') as any, image: media
        };
        if (editingItem) await API.leaders.update(editingItem.id, item);
        else await API.leaders.create({ ...item, id: Math.random().toString(36).substr(2, 9) } as any);
        onUpdateLeaders(await API.leaders.getAll());
      } else if (showModal === 'member') {
        const item = {
          fullName: formData.get('fullName') as string, email: formData.get('email') as string,
          phone: formData.get('phone') as string, program: formData.get('program') as string,
          level: formData.get('level') as string, diocese: formData.get('diocese') as string,
          department: formData.get('department') as string, role: formData.get('role') as any,
          profileImage: media, createdAt: editingItem?.createdAt || new Date().toISOString()
        };
        if (editingItem) await API.members.update(editingItem.id, item);
        else await API.members.create({ ...item, id: Math.random().toString(36).substr(2, 9) } as any);
        onUpdateMembers(await API.members.getAll());
      }
      setShowModal(null);
      setEditingItem(null);
      setFilePreview(null);
      setUrlInput('');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#F9FBFC]">
      <AnimatePresence>
        {isSyncing && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-10 right-10 z-[300] bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl">
            <Loader2 size={18} className="animate-spin text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Processing Logic...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-container px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-gray-100 sticky top-28">
              <div className="flex items-center gap-3 ml-4 mb-6 pt-4">
                <div className={`w-10 h-10 ${isIT ? 'bg-gray-900 shadow-gray-200' : 'bg-cyan-500 shadow-cyan-100'} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                   {isIT ? <Shield size={20} /> : <LayoutDashboard size={20} />}
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Layer Security</p>
                  <p className={`text-xs font-black uppercase tracking-widest ${isIT ? 'text-gray-900' : 'text-cyan-600'}`}>{currentUser.role}</p>
                </div>
              </div>
              <div className="space-y-1">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-bold text-xs ${activeTab === tab.id ? 'bg-gray-900 text-white shadow-xl' : 'text-gray-400 hover:text-cyan-600 hover:bg-cyan-50'}`}>
                    <tab.icon size={16} /> <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-grow min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && <OverviewTab members={members} news={news} leaders={leaders} announcements={announcements} contactMsgs={contactMsgs} depts={depts} logs={logs} />}
              {activeTab === 'home' && <HomeEditorTab homeSetup={homeSetup} filePreview={filePreview} urlInput={urlInput} onFileChange={handleFileChange} onUrlChange={setUrlInput} onSubmit={async (e) => { e.preventDefault(); setIsSyncing(true); await API.home.updateConfig(homeSetup!); setIsSyncing(false); }} />}
              {activeTab === 'about' && <AboutEditorTab config={aboutSetup} isSyncing={isSyncing} onSubmit={async (u) => { setIsSyncing(true); await API.about.updateConfig(u); fetchData(); setIsSyncing(false); }} />}
              {activeTab === 'spiritual' && <SpiritualHubTab />}
              {activeTab === 'members' && <DirectoryTab members={members} searchTerm={searchTerm} onSearchChange={setSearchTerm} onNewMember={() => setShowModal('member')} onEditMember={(m) => {setEditingItem(m); setShowModal('member');}} onDeleteMember={(id) => commitWipe('members', id)} onToggleAdmin={(m) => {setEditingItem(m); setShowModal('member');}} currentUser={currentUser} />}
              {activeTab === 'content' && <NewsFeedTab news={news} onNew={() => setShowModal('news')} onEdit={(item) => { setEditingItem(item); setShowModal('news'); }} onDelete={(id) => commitWipe('news', id)} />}
              {activeTab === 'bulletin' && <BulletinTab announcements={announcements} onNew={() => setShowModal('ann')} onEdit={(a) => {setEditingItem(a); setShowModal('ann');}} onDelete={(id) => commitWipe('announcements', id)} />}
              {activeTab === 'depts' && <MinistriesTab departments={depts} onNew={() => setShowModal('dept')} onEdit={(d) => {setEditingItem(d); setShowModal('dept');}} onDelete={(id) => commitWipe('departments', id)} />}
              {activeTab === 'leaders' && <LeadershipTab leaders={leaders} onNew={() => setShowModal('leader')} onEdit={(l) => {setEditingItem(l); setShowModal('leader');}} onDelete={(id) => commitWipe('leaders', id)} />}
              {activeTab === 'donations' && <DonationTab user={currentUser} />}
              {activeTab === 'contacts' && <InboxTab contactMsgs={contactMsgs} onMarkRead={(id) => API.contacts.markRead(id)} onMarkAllRead={() => API.contacts.markAllRead()} onDelete={(id) => API.contacts.delete(id)} />}
              {activeTab === 'system' && <SystemTab dbHealth={dbHealth} logs={logs} onResetDB={() => isIT && API.system.resetDB()} />}
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-2xl rounded-[3rem] shadow-3xl flex flex-col max-h-[90vh] overflow-hidden border border-white/20">
              <div className="px-10 pt-10 pb-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <h2 className="text-3xl font-black font-serif italic text-gray-900">{editingItem ? 'Refine' : 'Initialize'} Record</h2>
                <button onClick={() => { setShowModal(null); setEditingItem(null); setFilePreview(null); }} className="p-4 bg-white text-gray-400 rounded-2xl hover:text-red-500 border border-gray-100 shadow-sm transition-all"><Plus size={20} className="rotate-45" /></button>
              </div>
              <div className="flex-grow overflow-y-auto p-10 scroll-hide">
                {showModal === 'news' && <NewsForm editingItem={editingItem} filePreview={filePreview} urlInput={urlInput} onFileChange={handleFileChange} onUrlChange={setUrlInput} onSubmit={handleSave} />}
                {showModal === 'ann' && <AnnouncementForm editingItem={editingItem} onSubmit={handleSave} />}
                {showModal === 'dept' && <DepartmentForm editingItem={editingItem} filePreview={filePreview} urlInput={urlInput} onFileChange={handleFileChange} onUrlChange={setUrlInput} onSubmit={handleSave} />}
                {showModal === 'leader' && <LeaderForm editingItem={editingItem} filePreview={filePreview} urlInput={urlInput} onFileChange={handleFileChange} onUrlChange={setUrlInput} onSubmit={handleSave} isSyncing={isSyncing} />}
                {showModal === 'member' && (
                  <form id="main-editor-form" onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-1"><label className="text-[9px] font-black text-gray-400 uppercase ml-4">Full Name</label><input name="fullName" defaultValue={editingItem?.fullName} required className="w-full px-5 py-3 bg-gray-50 rounded-xl font-bold text-sm border-0 outline-none" /></div>
                      <div className="space-y-1"><label className="text-[9px] font-black text-gray-400 uppercase ml-4">Email</label><input name="email" defaultValue={editingItem?.email} required type="email" className="w-full px-5 py-3 bg-gray-50 rounded-xl font-bold text-sm border-0 outline-none" /></div>
                      <div className="space-y-1"><label className="text-[9px] font-black text-gray-400 uppercase ml-4">Phone</label><input name="phone" defaultValue={editingItem?.phone} required className="w-full px-5 py-3 bg-gray-50 rounded-xl font-bold text-sm border-0 outline-none" /></div>
                      
                      <div className="col-span-2 p-6 rounded-[2rem] border bg-cyan-50/50 border-cyan-100">
                        <label className="text-[10px] font-black text-gray-800 uppercase flex items-center gap-2 mb-3">Authority Permissions</label>
                        <select name="role" defaultValue={editingItem?.role || 'member'} className="w-full px-5 py-4 bg-white rounded-2xl font-black text-xs border border-cyan-100 outline-none">
                          <option value="member">Normal Member</option>
                          <option value="executive">Executive Committee</option>
                          <option value="accountant">Financial Accountant</option>
                          <option value="secretary">Secretariat</option>
                          <option value="admin">Global Administrator</option>
                          <option value="it">IT Super Master</option>
                        </select>
                      </div>
                    </div>
                  </form>
                )}
              </div>
              <div className="p-10 border-t border-gray-50 flex gap-4 bg-gray-50/50">
                <button type="button" onClick={() => { setShowModal(null); setEditingItem(null); }} className="flex-grow py-5 bg-white border border-gray-200 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95">Discard</button>
                <button disabled={isSyncing} form="main-editor-form" type="submit" className="flex-[2] py-5 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95 hover:bg-cyan-600 transition-all">
                  {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <Database size={18} />} Commit Sequential Change
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
