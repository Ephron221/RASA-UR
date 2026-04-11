
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Newspaper, UserCheck, Plus,
  LayoutDashboard, Home as HomeIcon, Heart,
  MessageSquare, Briefcase, Bell, HardDrive,
  History, Shield, Loader2, Database, Search, Sparkles, User as UserIcon, Settings,
  Type, X, Save, ShieldCheck, FileText, RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { User, NewsItem, Leader, Announcement, Department, ContactMessage, HomeConfig, AboutConfig, FooterConfig, RoleDefinition } from '../types';
import { API } from '../services/api';

// Tab Components
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
import ProfileEditorTab from '../components/admin/ProfileEditorTab';
import FooterEditorTab from '../components/admin/FooterEditorTab';
import ClearanceTab from '../components/admin/ClearanceTab';
import MembersReportTab from '../components/admin/MembersReportTab';

// Modal Forms
import NewsForm from '../components/admin/NewsForm';
import AnnouncementForm from '../components/admin/AnnouncementForm';
import DepartmentForm from '../components/admin/DepartmentForm';
import LeaderForm from '../components/admin/LeaderForm';
import RoleEditorForm from '../components/admin/RoleEditorForm';
import MemberEditorForm from '../components/admin/MemberEditorForm';

interface AdminDashboardProps {
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
  onUpdateFooter: (config: FooterConfig) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  members, news, leaders, announcements, depts,
  onUpdateNews, onUpdateLeaders, onUpdateMembers, onUpdateAnnouncements, onUpdateDepartments, onUpdateFooter
}) => {
  const { user: currentUser, updateUser } = useAuth();
  const { notify } = useNotification();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSyncing, setIsSyncing] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [dbHealth, setDbHealth] = useState<any>({ status: 'Online', size: '0KB' });
  const [contactMsgs, setContactMsgs] = useState<ContactMessage[]>([]);
  const [homeSetup, setHomeSetup] = useState<HomeConfig | null>(null);
  const [aboutSetup, setAboutSetup] = useState<AboutConfig | null>(null);
  const [footerSetup, setFooterSetup] = useState<FooterConfig | null>(null);
  const [roleDefinitions, setRoleDefinitions] = useState<RoleDefinition[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal Control
  const [showModal, setShowModal] = useState<'news' | 'leader' | 'ann' | 'dept' | 'member' | 'role' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');

  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) setIsSyncing(true);
    try {
      const [c, h, a, health, l, f, an, de, lea, ne, me, roles] = await Promise.all([
        API.contacts.getAll(), API.home.getConfig(), API.about.getConfig(), API.system.getHealth(),
        API.system.getLogs(), API.footer.getConfig(), API.announcements.getAll(),
        API.departments.getAll(), API.leaders.getAll(), API.news.getAll(), API.members.getAll(),
        API.roles.getAll()
      ]);
      setContactMsgs(c || []);
      setHomeSetup(h);
      setAboutSetup(a);
      setDbHealth(health || { status: 'Offline', size: '0KB' });
      setLogs(l || []);
      setFooterSetup(f);
      setRoleDefinitions(roles || []);
      onUpdateAnnouncements(an || []);
      onUpdateDepartments(de || []);
      onUpdateLeaders(lea || []);
      onUpdateNews(ne || []);
      onUpdateMembers(me || []);
      if (f) onUpdateFooter(f);

      if (isManual) notify("Kernel Synchronized", "All administrative protocols and role clearances have been updated.", "success");
    } catch (e) {
      console.error("Admin Fetch Error:", e);
      if (isManual) notify("Sync Failed", "Could not connect to the Divine Kernel.", "error");
    } finally {
      if (isManual) setIsSyncing(false);
    }
  }, [onUpdateAnnouncements, onUpdateDepartments, onUpdateLeaders, onUpdateNews, onUpdateMembers, onUpdateFooter, notify]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Calculated Permissions based on the specific Role Definition
  const currentRoleDef = useMemo(() =>
    roleDefinitions?.find(r => r.id === currentUser?.role),
    [roleDefinitions, currentUser?.role]);

  const rolePermissions = useMemo(() => ({
    canViewTab: (tabId: string) => {
      // MASTER OVERRIDE: IT Architect sees everything
      if (currentUser?.role === 'it') return true;

      // FORCE VISIBILITY for Members Report for EXCOM and Accountant roles
      const privilegedRoles = ['executive', 'admin', 'accountant'];
      if (tabId === 'reports' && privilegedRoles.includes(currentUser?.role || '')) {
        return true;
      }

      if (!currentRoleDef) return false;
      return currentRoleDef.permissions.includes(`tab.${tabId}`);
    },
    canDo: (actionKey: string) => {
      if (currentUser?.role === 'it') return true;
      if (!currentRoleDef) return false;
      return currentRoleDef.permissions.includes(`action.${actionKey}`);
    }
  }), [currentRoleDef, currentUser?.role]);

  const tabs = useMemo(() => [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: UserIcon },
    { id: 'reports', label: 'Members Report', icon: FileText },
    { id: 'home', label: 'Home Editor', icon: HomeIcon },
    { id: 'about', label: 'About Editor', icon: History },
    { id: 'footer', label: 'Footer Editor', icon: Type },
    { id: 'spiritual', label: 'Spiritual Hub', icon: Sparkles },
    { id: 'members', label: 'Directory', icon: Users },
    { id: 'clearance', label: 'Clearance Architect', icon: ShieldCheck },
    { id: 'content', label: 'News Feed', icon: Newspaper },
    { id: 'bulletin', label: 'Bulletin', icon: Bell },
    { id: 'depts', label: 'Ministries', icon: Briefcase },
    { id: 'leaders', label: 'Leadership', icon: UserCheck },
    { id: 'donations', label: 'Offerings', icon: Heart },
    { id: 'contacts', label: 'Inbox', icon: MessageSquare },
    { id: 'system', label: 'System', icon: HardDrive },
  ].filter(t => rolePermissions.canViewTab(t.id)), [rolePermissions]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateRole = async (role: string) => {
    if (!editingItem) return;
    setIsSyncing(true);
    try {
      await API.members.updateRole(editingItem.id, role);
      await fetchData();
      setShowModal(null);
      setEditingItem(null);
      notify("Clearance Migration", `Tier protocols for ${editingItem.fullName} have been successfully updated.`, "divine");
    } catch (err: any) {
      const errorMsg = err.error || (err.response?.data?.error) || "Failed to update role protocols.";
      notify("Clearance Error", errorMsg, "error");
    } finally { setIsSyncing(false); }
  };

  const handleUpdateAnnStatus = async (id: string, active: boolean) => {
    setIsSyncing(true);
    try {
      await API.announcements.update(id, { isActive: active });
      await fetchData();
      notify("Bulletin Pulse", `Announcement status toggled.`, "success");
    } finally { setIsSyncing(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const media = filePreview || urlInput || editingItem?.image || editingItem?.mediaUrl || editingItem?.profileImage;

    try {
      let notifyTitle = "Sequence Committed";
      let notifyMsg = "The Kernel has successfully synchronized your changes.";

      if (showModal === 'ann') {
        const item = { title: formData.get('title') as string, content: formData.get('content') as string, status: formData.get('status') as any, color: formData.get('color') as string, isActive: form.querySelector<HTMLInputElement>('[name="isActive"]')?.checked ?? true, date: editingItem?.date || new Date().toISOString().split('T')[0] };
        if (editingItem) await API.announcements.update(editingItem.id, item); else await API.announcements.create({ ...item, id: Math.random().toString(36).substr(2, 9) } as any);
      } else if (showModal === 'dept') {
        const item = { name: formData.get('name') as string, description: formData.get('description') as string, details: formData.get('details') as string, icon: formData.get('icon') as string, category: formData.get('category') as string, activities: (formData.get('activities') as string).split(',').map(s => s.trim()), image: media };
        if (editingItem) await API.departments.update(editingItem.id, item); else await API.departments.create({ ...item, id: Math.random().toString(36).substr(2, 9) } as any);
      } else if (showModal === 'leader') {
        const item = { name: formData.get('name') as string, position: formData.get('position') as string, phone: formData.get('phone') as string, academicYear: formData.get('academicYear') as string, image: media, type: formData.get('type') as any };
        if (editingItem) await API.leaders.update(editingItem.id, item); else await API.leaders.create({ ...item, id: Math.random().toString(36).substr(2, 9) } as any);
      } else if (showModal === 'news') {
        const item = { title: formData.get('title') as string, content: formData.get('content') as string, category: formData.get('category') as any, mediaUrl: media, mediaType: formData.get('mediaType') as any, author: currentUser?.fullName || 'Admin', date: editingItem?.date || new Date().toISOString().split('T')[0] };
        if (editingItem) await API.news.update(editingItem.id, item); else await API.news.create({ ...item, id: Math.random().toString(36).substr(2, 9) } as any);
      } else if (showModal === 'member') {
        const item = {
          fullName: formData.get('fullName') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          program: formData.get('program') as string,
          level: formData.get('level') as string,
          diocese: formData.get('diocese') as string,
          department: formData.get('department') as string,
          academicYear: formData.get('academicYear') as string,
          gender: formData.get('gender') as string,
          profileImage: media
        };
        if (editingItem) { await API.members.update(editingItem.id, item); } else { await API.members.create(item as Partial<User>); }
      } else if (!showModal && activeTab === 'home') {
        const updates: Partial<HomeConfig> = {
          heroTitle: formData.get('heroTitle') as string, 
          heroSubtitle: formData.get('heroSubtitle') as string, 
          heroImageUrl: urlInput || filePreview || homeSetup?.heroImageUrl || '', 
          motto: formData.get('motto') as string, 
          aboutTitle: formData.get('aboutTitle') as string, 
          aboutText: formData.get('aboutText') as string, 
          aboutImageUrl: (form.querySelector<HTMLInputElement>('[name="aboutImageUrl_hidden"]')?.value) || homeSetup?.aboutImageUrl || '', 
          aboutScripture: formData.get('aboutScripture') as string, 
          aboutScriptureRef: formData.get('aboutScriptureRef') as string,
          youtubeVideos: formData.getAll('youtubeVideos[]') as string[],
          stat1Value: formData.get('stat1Value') as string,
          stat1Label: formData.get('stat1Label') as string,
          stat2Value: formData.get('stat2Value') as string,
          stat2Label: formData.get('stat2Label') as string,
        };
        await API.home.updateConfig(updates);
      }

      await fetchData();
      setShowModal(null); setEditingItem(null); setFilePreview(null); setUrlInput('');
      notify(notifyTitle, notifyMsg, "divine");
    } catch (err: any) {
      console.error("Save Error:", err);
      const msg = err.error || err.message || "The Kernel encountered a sequence error.";
      notify("Protocol Failure", msg, "error");
    } finally { setIsSyncing(false); }
  };

  const handleDelete = async (collection: string, id: string) => {
    if (!window.confirm('Purge from Kernel permanently?')) return;
    setIsSyncing(true);
    try {
      if (collection === 'ann') await API.announcements.delete(id);
      else if (collection === 'dept') await API.departments.delete(id);
      else if (collection === 'news') await API.news.delete(id);
      else if (collection === 'leaders') await API.leaders.delete(id);
      else if (collection === 'members') await API.members.delete(id);
      await fetchData();
      notify("Archive Purged", "The selected record has been successfully de-linked.", "success");
    } finally { setIsSyncing(false); }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-primary">
      <AnimatePresence>
        {isSyncing && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-10 right-10 z-[300] bg-black text-white px-6 py-4 rounded-2xl flex items-center gap-4 shadow-2xl">
            <Loader2 size={18} className="animate-spin text-secondary" />
            <span className="text-[10px] uppercase tracking-widest font-black">Kernel Sync...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-container px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-gray-100 sticky top-28">
              <div className="flex items-center justify-between mb-8 ml-4 pt-4 pr-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg"><Shield size={20} className="text-secondary" /></div>
                  <div><p className="text-[9px] font-black uppercase text-black/40 mb-1">Clearance</p><p className="text-xs font-black text-black uppercase">{currentRoleDef?.label || currentUser?.role}</p></div>
                </div>
                <button onClick={() => fetchData(true)} className="p-2 hover:bg-gray-50 rounded-xl text-black/20 hover:text-secondary transition-colors" title="Force Refresh Permissions">
                  <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
                </button>
              </div>
              <div className="space-y-1">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-2xl font-bold text-xs transition-all ${activeTab === tab.id ? 'bg-black text-white shadow-lg' : 'text-black/40 hover:text-black hover:bg-gray-50'}`}>
                    <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 2} /> <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-grow min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && <OverviewTab members={members} news={news} leaders={leaders} announcements={announcements} contactMsgs={contactMsgs} depts={depts} logs={logs} />}
              {activeTab === 'profile' && currentUser && <ProfileEditorTab user={currentUser} isSyncing={isSyncing} onUpdate={async (u) => { setIsSyncing(true); await API.members.update(u.id, u); updateUser(u); fetchData(); setIsSyncing(false); notify("Stewardship Updated", "Profile synchronized.", "success"); }} />}
              {activeTab === 'reports' && <MembersReportTab onEditMember={(m) => { setEditingItem(m); setShowModal('member'); }} onDeleteMember={(id) => handleDelete('members', id)} onNewMember={() => { setEditingItem(null); setShowModal('member'); }} />}
              {activeTab === 'members' && <DirectoryTab members={members} roles={roleDefinitions} searchTerm={searchTerm} onSearchChange={setSearchTerm} onNewMember={() => { setEditingItem(null); setShowModal('member'); }} onEditMember={(m) => { setEditingItem(m); setShowModal('member'); }} onDeleteMember={(id) => handleDelete('members', id)} onToggleAdmin={(m) => { setEditingItem(m); setShowModal('role'); }} currentUser={currentUser!} canManage={rolePermissions.canDo('manage_roles')} />}
              {activeTab === 'clearance' && <ClearanceTab roles={roleDefinitions} onRefresh={fetchData} />}
              {activeTab === 'donations' && <DonationTab user={currentUser!} canVerify={rolePermissions.canDo('verify_donations')} />}
              {activeTab === 'bulletin' && <BulletinTab announcements={announcements} onNew={() => { setEditingItem(null); setShowModal('ann'); }} onEdit={(a) => { setEditingItem(a); setShowModal('ann'); }} onDelete={(id) => handleDelete('ann', id)} onToggleStatus={handleUpdateAnnStatus} canManage={rolePermissions.canViewTab('bulletin')} />}
              {activeTab === 'depts' && <MinistriesTab departments={depts} onNew={() => { setEditingItem(null); setShowModal('dept'); }} onEdit={(d) => { setEditingItem(d); setShowModal('dept'); }} onDelete={(id) => handleDelete('dept', id)} />}
              {activeTab === 'leaders' && <LeadershipTab leaders={leaders} onNew={() => { setEditingItem(null); setShowModal('leader'); }} onEdit={(l) => { setEditingItem(l); setShowModal('leader'); }} onDelete={(id) => handleDelete('leaders', id)} />}
              {activeTab === 'content' && <NewsFeedTab news={news} onNew={() => { setEditingItem(null); setShowModal('news'); }} onEdit={(item) => { setEditingItem(item); setShowModal('news'); }} onDelete={(id) => handleDelete('news', id)} />}
              {activeTab === 'contacts' && <InboxTab contactMsgs={contactMsgs} onMarkRead={(id) => { API.contacts.markRead(id).then(fetchData); }} onMarkAllRead={() => { API.contacts.markAllRead().then(fetchData); }} onDelete={(id) => handleDelete('contact', id)} />}
              {activeTab === 'system' && <SystemTab dbHealth={dbHealth} logs={logs} onResetDB={() => rolePermissions.canDo('reset_db') && API.system.resetDB()} />}
              {activeTab === 'home' && <HomeEditorTab homeSetup={homeSetup} filePreview={filePreview} urlInput={urlInput} onFileChange={handleFileChange} onUrlChange={setUrlInput} onSubmit={handleSave} />}
              {activeTab === 'about' && <AboutEditorTab config={aboutSetup} isSyncing={isSyncing} onSubmit={async (updates) => { setIsSyncing(true); await API.about.updateConfig(updates); await fetchData(); setIsSyncing(false); notify("Heritage Synchronized", "Archives updated.", "divine"); }} />}
              {activeTab === 'footer' && <FooterEditorTab config={footerSetup} onSubmit={async (conf) => { setIsSyncing(true); await API.footer.updateConfig(conf); await fetchData(); setIsSyncing(false); notify("Nexus Reach Points", "Footer bio synchronized.", "success"); }} isSyncing={isSyncing} />}
              {activeTab === 'spiritual' && <SpiritualHubTab />}
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-2xl rounded-[3rem] shadow-3xl overflow-hidden border border-white flex flex-col max-h-[90vh]">
              <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <h3 className="text-2xl font-black font-serif italic text-black">
                  {showModal === 'role' ? 'Clearance Protocol' : editingItem ? 'Refine Sequence' : 'Initialize Module'}
                </h3>
                <button onClick={() => { setShowModal(null); setEditingItem(null); setFilePreview(null); setUrlInput(''); }} className="p-3 bg-white border border-gray-100 text-black/20 rounded-2xl hover:text-red-500 transition-all"><X size={20} /></button>
              </div>
              <div className="flex-grow overflow-y-auto p-12 scroll-hide">
                {showModal === 'ann' && <AnnouncementForm editingItem={editingItem} onSubmit={handleSave} />}
                {showModal === 'dept' && <DepartmentForm editingItem={editingItem} filePreview={filePreview} urlInput={urlInput} onFileChange={handleFileChange} onUrlChange={setUrlInput} onSubmit={handleSave} />}
                {showModal === 'leader' && <LeaderForm editingItem={editingItem} filePreview={filePreview} urlInput={urlInput} onFileChange={handleFileChange} onUrlChange={setUrlInput} onSubmit={handleSave} isSyncing={isSyncing} />}
                {showModal === 'news' && <NewsForm editingItem={editingItem} filePreview={filePreview} urlInput={urlInput} onFileChange={handleFileChange} onUrlChange={setUrlInput} onSubmit={handleSave} />}
                {showModal === 'role' && <RoleEditorForm member={editingItem} roles={roleDefinitions} onConfirm={handleUpdateRole} isSyncing={isSyncing} />}
                {showModal === 'member' && <MemberEditorForm editingItem={editingItem} filePreview={filePreview} urlInput={urlInput} onFileChange={handleFileChange} onUrlChange={setUrlInput} onSubmit={handleSave} />}
              </div>
              {showModal !== 'role' && (
                <div className="p-10 border-t border-gray-50 bg-gray-50/30 flex justify-end gap-4">
                  <button onClick={() => { setShowModal(null); setEditingItem(null); setFilePreview(null); setUrlInput(''); }} className="px-8 py-4 text-black/40 font-black text-[10px] uppercase tracking-widest">Discard</button>
                  <button form="main-editor-form" type="submit" className="px-12 py-4 bg-secondary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-secondary/90 transition-all"><Save size={16} /> Commit Changes</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
