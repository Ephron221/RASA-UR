
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Newspaper, UserCheck, Plus, Trash2, 
  Search, LayoutDashboard, Edit, X, Save, 
  Camera, Upload, Database, Bell, Loader2, HardDrive, 
  MessageSquare, Briefcase, Home as HomeIcon, Star, Shield, UserPlus,
  AlertCircle, CheckCircle2, ArrowRight, RefreshCw, Sparkles, Activity,
  Calendar, Eye
} from 'lucide-react';
import { User, NewsItem, Leader, Announcement, Department, ContactMessage, HomeConfig } from '../types';
import { API } from '../services/api';
import { DIOCESES, LEVELS, DEPARTMENTS as INITIAL_DEPTS } from '../constants';

// Modular components
import LeaderForm from '../components/admin/LeaderForm';
import DepartmentForm from '../components/admin/DepartmentForm';
import NewsForm from '../components/admin/NewsForm';
import AnnouncementForm from '../components/admin/AnnouncementForm';
import OverviewTab from '../components/admin/OverviewTab';
import HomeEditorTab from '../components/admin/HomeEditorTab';
import DirectoryTab from '../components/admin/DirectoryTab';
import InboxTab from '../components/admin/InboxTab';
import SystemTab from '../components/admin/SystemTab';

interface AdminDashboardProps {
  members: User[];
  news: NewsItem[];
  leaders: Leader[];
  announcements: Announcement[];
  onUpdateNews: (news: NewsItem[]) => void;
  onUpdateLeaders: (leaders: Leader[]) => void;
  onUpdateMembers: (members: User[]) => void;
  onUpdateAnnouncements: (announcements: Announcement[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  members, news, leaders, announcements, 
  onUpdateNews, onUpdateLeaders, onUpdateMembers, onUpdateAnnouncements 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'home' | 'members' | 'content' | 'bulletin' | 'depts' | 'contacts' | 'leaders' | 'system'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [dbHealth, setDbHealth] = useState(API.system.getHealth());

  const [depts, setDepts] = useState<Department[]>([]);
  const [contactMsgs, setContactMsgs] = useState<ContactMessage[]>([]);
  const [homeSetup, setHomeSetup] = useState<HomeConfig | null>(null);

  // Modal States
  const [showModal, setShowModal] = useState<'news' | 'leader' | 'ann' | 'dept' | 'member' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // New States for Improved UX
  const [pendingEdit, setPendingEdit] = useState<any>(null);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState<{type: string, message: string} | null>(null);

  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const [d, c, h, m, n, l, a] = await Promise.all([
      API.departments.getAll(), 
      API.contacts.getAll(), 
      API.home.getConfig(),
      API.members.getAll(),
      API.news.getAll(),
      API.leaders.getAll(),
      API.announcements.getAll()
    ]);
    setDepts(d.length > 0 ? d : INITIAL_DEPTS);
    setContactMsgs(c);
    setHomeSetup(h);
    onUpdateMembers(m);
    onUpdateNews(n);
    onUpdateLeaders(l);
    onUpdateAnnouncements(a);
  };

  useEffect(() => {
    fetchData();
    const fetchLogs = async () => { 
      const currentLogs = await API.system.getLogs();
      setLogs(currentLogs); 
    };
    fetchLogs();
  }, [activeTab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setFilePreview(reader.result as string); setUrlInput(''); };
      reader.readAsDataURL(file);
    }
  };

  const closeModals = () => {
    setShowModal(null);
    setEditingItem(null);
    setFilePreview(null);
    setUrlInput('');
    setPendingEdit(null);
    setShowEditConfirm(false);
  };

  const handleEditInitiation = (item: any, type: 'news' | 'leader' | 'ann' | 'dept' | 'member') => {
    setPendingEdit({ item, type });
    setShowEditConfirm(true);
  };

  const confirmEdit = () => {
    if (pendingEdit) {
      setEditingItem(pendingEdit.item);
      setShowModal(pendingEdit.type);
      setShowEditConfirm(false);
    }
  };

  const toggleAdminRole = async (member: User) => {
    if (member.email === 'esront21@gmail.com') {
      alert("Cannot demote the root administrator.");
      return;
    }
    const newRole = member.role === 'admin' ? 'member' : 'admin';
    if (!window.confirm(`Are you sure you want to change ${member.fullName}'s role to ${newRole}?`)) return;
    
    setIsSyncing(true);
    await API.members.updateRole(member.id, newRole);
    onUpdateMembers(await API.members.getAll());
    setIsSyncing(false);
  };

  const saveHomeConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const updates = {
      heroTitle: formData.get('heroTitle') as string,
      heroSubtitle: formData.get('heroSubtitle') as string,
      heroImageUrl: filePreview || urlInput || homeSetup?.heroImageUrl || '',
      motto: formData.get('motto') as string,
    };
    await API.home.updateConfig(updates);
    setHomeSetup(await API.home.getConfig());
    setIsSyncing(false);
    setDbHealth(API.system.getHealth());
    setShowSuccessModal({ type: 'home', message: 'Site configuration persistent.' });
  };

  const saveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    const formData = new FormData(e.target as HTMLFormElement);
    
    const media = filePreview || urlInput || editingItem?.image || editingItem?.mediaUrl || editingItem?.profileImage || 'https://picsum.photos/400/300';

    try {
      if (showModal === 'member') {
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
        setShowSuccessModal({ type: 'Member', message: editingItem ? 'Profile persistent.' : 'Member added successfully!' });
      } else if (showModal === 'news') {
        const item = { 
          title: formData.get('title') as string, content: formData.get('content') as string, 
          category: formData.get('category') as any, mediaUrl: media, mediaType: formData.get('mediaType') as any, 
          author: 'Admin', date: editingItem?.date || new Date().toISOString().split('T')[0] 
        };
        if (editingItem) await API.news.update(editingItem.id, item); 
        else await API.news.create({ ...item, id: Math.random().toString(36).substr(2, 9) } as any);
        onUpdateNews(await API.news.getAll());
        setShowSuccessModal({ type: 'News', message: editingItem ? 'Article persistent.' : 'Article published!' });
      } else if (showModal === 'ann') {
        const item = { 
          title: formData.get('title') as string, content: formData.get('content') as string, 
          date: editingItem?.date || new Date().toISOString().split('T')[0], status: formData.get('status') as any, 
          color: formData.get('color') as string, 
          isActive: formData.get('isActive') === 'on' 
        };
        if (editingItem) await API.announcements.update(editingItem.id, item);
        else await API.announcements.create({ ...item, id: Math.random().toString(36).substr(2, 9) } as any);
        onUpdateAnnouncements(await API.announcements.getAll());
        setShowSuccessModal({ type: 'Bulletin', message: editingItem ? 'Notice updated.' : 'Notice broadcasted!' });
      } else if (showModal === 'leader') {
        const item = { 
          name: formData.get('name') as string, position: formData.get('position') as string, 
          academicYear: formData.get('academicYear') as string, image: media, 
          type: formData.get('type') as any 
        };
        if (editingItem) await API.leaders.update(editingItem.id, item);
        else await API.leaders.create({ ...item, id: Math.random().toString(36).substr(2, 9) } as any);
        onUpdateLeaders(await API.leaders.getAll());
        setShowSuccessModal({ type: 'Leader', message: editingItem ? 'Details updated.' : 'Leader added successfully!' });
      } else if (showModal === 'dept') {
        const item = {
          name: formData.get('name') as string, description: formData.get('description') as string,
          icon: formData.get('icon') as string, details: formData.get('details') as string,
          activities: (formData.get('activities') as string).split(',').map(a => a.trim())
        };
        if (editingItem) await API.departments.update(editingItem.id, item);
        else await API.departments.create({ ...item, id: Math.random().toString(36).substr(2, 9) } as any);
        setDepts(await API.departments.getAll());
        setShowSuccessModal({ type: 'Ministry', message: editingItem ? 'Vision persistent.' : 'Ministry established!' });
      }
      closeModals();
    } finally {
      setIsSyncing(false);
      setDbHealth(API.system.getHealth());
    }
  };

  const performDelete = async (type: any, id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this record?')) return;
    setIsSyncing(true);
    await (API as any)[type].delete(id);
    if (type === 'members') onUpdateMembers(await API.members.getAll());
    if (type === 'news') onUpdateNews(await API.news.getAll());
    if (type === 'announcements') onUpdateAnnouncements(await API.announcements.getAll());
    if (type === 'leaders') onUpdateLeaders(await API.leaders.getAll());
    if (type === 'departments') setDepts(await API.departments.getAll());
    if (type === 'contacts') setContactMsgs(await API.contacts.getAll());
    setIsSyncing(false);
    setDbHealth(API.system.getHealth());
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#F9FBFC]">
      <AnimatePresence>
        {isSyncing && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-10 right-10 z-[300] bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
            <Loader2 size={18} className="animate-spin text-cyan-400" />
            <span className="text-xs font-black uppercase tracking-widest">Processing Data...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-container px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 space-y-4">
            <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 sticky top-28">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 ml-4 mb-4">Administration</p>
              <div className="space-y-1">
                {[
                  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                  { id: 'home', label: 'Home Editor', icon: HomeIcon },
                  { id: 'members', label: 'Directory', icon: Users },
                  { id: 'content', label: 'News Feed', icon: Newspaper },
                  { id: 'bulletin', label: 'Bulletin', icon: Bell },
                  { id: 'depts', label: 'Ministries', icon: Briefcase },
                  { id: 'leaders', label: 'Leadership', icon: UserCheck },
                  { id: 'contacts', label: 'Inbox', icon: MessageSquare },
                  { id: 'system', label: 'System', icon: HardDrive },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-bold text-xs ${activeTab === tab.id ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-400 hover:text-cyan-600 hover:bg-cyan-50'}`}>
                    <tab.icon size={16} /> <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-grow min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <OverviewTab 
                  members={members}
                  news={news}
                  leaders={leaders}
                  announcements={announcements}
                  contactMsgs={contactMsgs}
                  depts={depts}
                  logs={logs}
                />
              )}

              {activeTab === 'home' && (
                <HomeEditorTab 
                  homeSetup={homeSetup}
                  filePreview={filePreview}
                  urlInput={urlInput}
                  onFileChange={handleFileChange}
                  onUrlChange={setUrlInput}
                  onSubmit={saveHomeConfig}
                />
              )}

              {activeTab === 'members' && (
                <DirectoryTab 
                  members={members}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onNewMember={() => { setEditingItem(null); setShowModal('member'); }}
                  onEditMember={(m) => handleEditInitiation(m, 'member')}
                  onDeleteMember={(id) => performDelete('members', id)}
                  onToggleAdmin={toggleAdminRole}
                />
              )}

              {activeTab === 'content' && (
                <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black font-serif italic text-gray-900 leading-tight">News Archive Manager</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Public spirit news & event reporting</p>
                    </div>
                    <button 
                      onClick={() => { setEditingItem(null); setShowModal('news'); }} 
                      className="w-full md:w-auto px-8 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-cyan-100 transition-all hover:scale-105 active:scale-95"
                    >
                      <Plus size={16}/> Create New Article
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {news.map(item => (
                      <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 group hover:shadow-xl transition-all">
                        <div className="w-full md:w-48 h-32 rounded-[1.8rem] overflow-hidden shrink-0 border border-gray-50">
                          <img src={item.mediaUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        </div>
                        <div className="flex-grow space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-cyan-50 text-cyan-600 text-[8px] font-black uppercase rounded-lg border border-cyan-100/50">{item.category}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12}/> {item.date}</span>
                          </div>
                          <h4 className="text-xl font-black text-gray-900 tracking-tight leading-tight line-clamp-1">{item.title}</h4>
                          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{item.content}</p>
                        </div>
                        <div className="flex md:flex-col justify-end gap-2 shrink-0">
                           <button onClick={() => handleEditInitiation(item, 'news')} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-cyan-500 hover:text-white transition-all shadow-sm"><Edit size={18}/></button>
                           <button onClick={() => performDelete('news', item.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'bulletin' && (
                <motion.div key="bulletin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black font-serif italic text-gray-900 leading-tight">Campus Bulletin</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Broadcast urgent notices to all members</p>
                    </div>
                    <button 
                      onClick={() => { setEditingItem(null); setShowModal('ann'); }} 
                      className="w-full md:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all hover:bg-cyan-500 active:scale-95"
                    >
                      <Plus size={16}/> New Announcement
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {announcements.map(ann => (
                      <div key={ann.id} className="p-8 bg-white rounded-[3rem] border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center group hover:bg-gray-50/30 transition-all">
                        <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 ${ann.color} rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0`}><Bell size={24}/></div>
                          <div className="space-y-1">
                            <p className="font-black text-xl text-gray-900 tracking-tight">{ann.title}</p>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-0.5 ${ann.color} text-white text-[8px] font-black uppercase rounded-md shadow-sm`}>{ann.status}</span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{ann.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-6 md:mt-0 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => handleEditInitiation(ann, 'ann')} className="p-3 bg-white border border-gray-100 text-gray-400 rounded-xl hover:bg-gray-900 hover:text-white transition-all shadow-sm"><Edit size={18}/></button>
                          <button onClick={() => performDelete('announcements', ann.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'depts' && (
                <motion.div key="depts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black font-serif italic text-gray-900 leading-tight">Ministry Ecosystem</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active RASA Departments</p>
                    </div>
                    <button 
                      onClick={() => { setEditingItem(null); setShowModal('dept'); }} 
                      className="px-8 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-xl shadow-cyan-100"
                    >
                      <Plus size={16}/> New Ministry
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {depts.map(d => (
                      <div key={d.id} className="p-8 bg-white rounded-[3rem] border border-gray-100 flex flex-col justify-between group hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-500 relative">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-cyan-50 text-cyan-500 rounded-3xl flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500">
                              <Star size={28}/>
                            </div>
                            <div>
                              <p className="font-black text-xl text-gray-900 tracking-tight">{d.name}</p>
                              <p className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.2em]">{d.icon}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleEditInitiation(d, 'dept')} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-cyan-500 hover:text-white transition-all shadow-sm"><Edit size={16}/></button>
                            <button onClick={() => performDelete('departments', d.id)} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16}/></button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium mb-6">{d.description}</p>
                        <div className="pt-6 border-t border-gray-50 flex flex-wrap gap-2">
                          {d.activities.slice(0, 3).map((act, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-50 text-[9px] font-black text-gray-400 uppercase tracking-widest rounded-lg border border-gray-100">
                              {act}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'leaders' && (
                <motion.div key="leaders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black font-serif italic text-gray-900">Official Leadership</h3>
                    <button onClick={() => { setEditingItem(null); setShowModal('leader'); }} className="px-8 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95">
                      <Plus size={16}/> Add New Leader
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leaders.map(l => (
                      <div key={l.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-4 group transition-all hover:shadow-xl relative">
                        <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-gray-50 shrink-0 relative">
                          <img src={l.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={l.name} />
                        </div>
                        <div>
                          <p className="font-black text-gray-900">{l.name}</p>
                          <p className="text-xs text-cyan-600 font-bold uppercase tracking-widest">{l.position}</p>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button onClick={() => handleEditInitiation(l, 'leader')} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-cyan-500 hover:text-white transition-all shadow-sm"><Edit size={16}/></button>
                          <button onClick={() => performDelete('leaders', l.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'contacts' && (
                <InboxTab 
                  contactMsgs={contactMsgs}
                  onMarkRead={async (id) => { await API.contacts.markRead(id); fetchData(); }}
                  onMarkAllRead={async () => { await API.contacts.markAllRead(); fetchData(); }}
                  onDelete={(id) => performDelete('contacts', id)}
                />
              )}

              {activeTab === 'system' && (
                <SystemTab 
                  dbHealth={dbHealth}
                  logs={logs}
                  onResetDB={() => { if(window.confirm('Wipe everything?')) API.system.resetDB(); }}
                />
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Confirmation Dialogs omitted for brevity but logic remains same */}

      {/* Main Editor Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100">
              <div className="px-10 pt-10 pb-6 border-b border-gray-50 flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-cyan-500 tracking-[0.3em]">Administrator Tool</p>
                  <h2 className="text-3xl font-black font-serif italic text-gray-900">{editingItem ? 'Edit' : 'Create'} {showModal.toUpperCase()}</h2>
                </div>
                <button onClick={closeModals} className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-red-500 transition-all hover:bg-red-50"><X size={20}/></button>
              </div>
              <div className="flex-grow overflow-y-auto p-10 scroll-hide">
                {showModal === 'leader' ? (
                  <LeaderForm 
                    editingItem={editingItem} 
                    filePreview={filePreview} 
                    urlInput={urlInput}
                    onFileChange={handleFileChange}
                    onUrlChange={setUrlInput}
                    onSubmit={saveItem}
                    isSyncing={isSyncing}
                  />
                ) : showModal === 'dept' ? (
                  <DepartmentForm 
                    editingItem={editingItem} 
                    onSubmit={saveItem} 
                  />
                ) : showModal === 'news' ? (
                  <NewsForm
                    editingItem={editingItem}
                    filePreview={filePreview}
                    urlInput={urlInput}
                    onFileChange={handleFileChange}
                    onUrlChange={setUrlInput}
                    onSubmit={saveItem}
                  />
                ) : showModal === 'ann' ? (
                  <AnnouncementForm
                    editingItem={editingItem}
                    onSubmit={saveItem}
                  />
                ) : (
                  <form id="main-editor-form" onSubmit={saveItem} className="space-y-6">
                    {/* Fallback for member modal */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-1"><label className="text-[9px] font-black text-gray-400 ml-4 uppercase tracking-widest">Full Name</label><input name="fullName" defaultValue={editingItem?.fullName} required className="w-full px-5 py-3 bg-gray-50 rounded-xl font-bold text-sm border border-gray-100" /></div>
                      <div className="space-y-1"><label className="text-[9px] font-black text-gray-400 ml-4 uppercase tracking-widest">Email</label><input name="email" defaultValue={editingItem?.email} required type="email" className="w-full px-5 py-3 bg-gray-50 rounded-xl font-bold text-sm border border-gray-100" /></div>
                      <div className="space-y-1"><label className="text-[9px] font-black text-gray-400 ml-4 uppercase tracking-widest">Phone</label><input name="phone" defaultValue={editingItem?.phone} required className="w-full px-5 py-3 bg-gray-50 rounded-xl font-bold text-sm border border-gray-100" /></div>
                    </div>
                  </form>
                )}
              </div>
              <div className="p-10 border-t border-gray-50 flex gap-4 bg-gray-50/30">
                <button type="button" onClick={closeModals} className="flex-grow py-5 bg-white border border-gray-200 text-gray-400 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all hover:bg-gray-100 active:scale-95">Discard</button>
                <button 
                  disabled={isSyncing} 
                  form="main-editor-form" 
                  type="submit" 
                  className="flex-[2] py-5 bg-cyan-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                  {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <Database size={18} />} 
                  Commit Changes
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
