
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Book, Plus, Edit, Trash2, CheckCircle, 
  MessageSquare, History, List, Clock, Save, 
  X, Loader2, Award, User, Target, BarChart, Settings, CheckSquare,
  Database, PlusCircle, Trash, ChevronDown, Check, BookOpen, Calendar, Search, Filter, AlertTriangle
} from 'lucide-react';
import { DailyVerse, BibleQuiz, QuizQuestion, VerseReflection, QuizResult } from '../../types';
import { API } from '../../services/api';

const SpiritualHubTab: React.FC = () => {
  const [activeSub, setActiveSub] = useState<'verse' | 'quiz' | 'reflections' | 'results'>('verse');
  const [verses, setVerses] = useState<DailyVerse[]>([]);
  const [quizzes, setQuizzes] = useState<BibleQuiz[]>([]);
  const [reflections, setReflections] = useState<VerseReflection[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [quizFilter, setQuizFilter] = useState('All Quizzes');

  // Form states
  const [editingVerse, setEditingVerse] = useState<DailyVerse | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<BibleQuiz | null>(null);
  const [showModal, setShowModal] = useState<string | null>(null);
  
  // Interactive Quiz Builder State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  const fetchData = async () => {
    const [v, q, r, res] = await Promise.all([
      API.spiritual.verses.getAll(),
      API.spiritual.quizzes.getAll(),
      API.spiritual.verses.getReflections(),
      API.spiritual.quizzes.getResults()
    ]);
    setVerses(v);
    setQuizzes(q);
    setReflections(r);
    setResults(res);
  };

  useEffect(() => { fetchData(); }, []);

  // Initialize questions when editing a quiz
  useEffect(() => {
    if (editingQuiz) {
      setQuizQuestions(editingQuiz.questions || []);
    } else {
      setQuizQuestions([]);
    }
  }, [editingQuiz, showModal]);

  const filteredVerses = useMemo(() => {
    return verses.filter(v => 
      v.theme.toLowerCase().includes(searchTerm.toLowerCase()) || 
      v.verse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.reference.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [verses, searchTerm]);

  const filteredResults = useMemo(() => {
    if (quizFilter === 'All Quizzes') return results;
    return results.filter(r => r.quizId === quizFilter);
  }, [results, quizFilter]);

  const handleSaveVerse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const v: any = {
      theme: formData.get('theme'),
      verse: formData.get('verse'),
      reference: formData.get('reference'),
      description: formData.get('description'),
      date: formData.get('date') || new Date().toISOString().split('T')[0],
      isActive: true
    };
    if (editingVerse) await API.spiritual.verses.update(editingVerse.id, v);
    else await API.spiritual.verses.create({ ...v, id: Math.random().toString(36).substr(2, 9) });
    
    await fetchData();
    setShowModal(null);
    setEditingVerse(null);
    setIsSyncing(false);
  };

  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quizQuestions.length === 0) {
      alert("Please add at least one question to the sanctuary test.");
      return;
    }

    setIsSyncing(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const q: any = {
      title: formData.get('title'),
      description: formData.get('description'),
      timeLimit: Number(formData.get('timeLimit')),
      isActive: true,
      date: new Date().toISOString().split('T')[0],
      questions: quizQuestions
    };
    if (editingQuiz) await API.spiritual.quizzes.update(editingQuiz.id, q);
    else await API.spiritual.quizzes.create({ ...q, id: Math.random().toString(36).substr(2, 9) });
    
    await fetchData();
    setShowModal(null);
    setEditingQuiz(null);
    setIsSyncing(false);
  };

  const confirmDelete = async (action: () => Promise<any>, msg: string) => {
    if (window.confirm(msg)) {
      setIsSyncing(true);
      await action();
      await fetchData();
      setIsSyncing(false);
    }
  };

  const addQuestion = () => {
    const newQ: QuizQuestion = {
      id: 'q-' + Math.random().toString(36).substr(2, 5),
      text: '',
      type: 'mcq',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 'Option 1'
    };
    setQuizQuestions([...quizQuestions, newQ]);
  };

  const removeQuestion = (id: string) => {
    setQuizQuestions(quizQuestions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuizQuestions(quizQuestions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const updateOption = (qId: string, optIdx: number, val: string) => {
    setQuizQuestions(quizQuestions.map(q => {
      if (q.id === qId && q.options) {
        const newOpts = [...q.options];
        newOpts[optIdx] = val;
        const wasCorrect = q.correctAnswer === q.options[optIdx];
        return { 
          ...q, 
          options: newOpts, 
          correctAnswer: wasCorrect ? val : q.correctAnswer 
        };
      }
      return q;
    }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="space-y-1">
          <h3 className="text-3xl font-black font-serif italic text-gray-900 flex items-center gap-4">
            <Sparkles className="text-cyan-500" size={32} /> Spiritual Hub
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Word, Wisdom & Moderation Management</p>
        </div>
        <div className="flex p-1.5 bg-gray-100 rounded-2xl">
          {[
            { id: 'verse', label: 'Scriptures' },
            { id: 'quiz', label: 'Quizzes' },
            { id: 'reflections', label: 'Reflections' },
            { id: 'results', label: 'Leaderboard' }
          ].map((tab) => (
             <button 
              key={tab.id}
              onClick={() => { setActiveSub(tab.id as any); setSearchTerm(''); }}
              className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeSub === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-cyan-600'}`}
             >
               {tab.label}
             </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSub === 'verse' && (
          <motion.div key="verse" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4">
                <div className="relative w-full max-w-md group">
                   <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500 transition-colors" size={18} />
                   <input 
                    type="text" 
                    placeholder="Search spiritual archive..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-xs outline-none shadow-sm focus:ring-4 focus:ring-cyan-50"
                   />
                </div>
                <button onClick={() => { setEditingVerse(null); setShowModal('verse'); }} className="w-full md:w-auto px-8 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                  <Plus size={16}/> New Scripture
                </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVerses.map(v => (
                  <div key={v.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 relative group flex flex-col h-full">
                     <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                        <button onClick={() => {setEditingVerse(v); setShowModal('verse');}} className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-cyan-600 shadow-sm"><Edit size={16}/></button>
                        <button onClick={() => confirmDelete(() => API.spiritual.verses.delete(v.id), "Purge this Word from the archive?")} className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white shadow-sm transition-all"><Trash2 size={16}/></button>
                     </div>
                     <div className="space-y-4 flex-grow">
                        <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-600 rounded-lg text-[9px] font-black uppercase">{v.date}</span>
                        <h5 className="text-xl font-black text-gray-900 leading-tight">{v.theme}</h5>
                        <p className="text-sm font-serif italic text-gray-500 leading-relaxed">"{v.verse}"</p>
                        <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">— {v.reference}</p>
                     </div>
                  </div>
                ))}
             </div>
             {filteredVerses.length === 0 && (
               <div className="py-32 text-center text-gray-300 italic font-serif text-xl border-2 border-dashed border-gray-100 rounded-[3rem]">No scriptures found matching search criteria.</div>
             )}
          </motion.div>
        )}

        {activeSub === 'reflections' && (
           <motion.div key="reflections" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                 <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                    <h4 className="text-xl font-black font-serif italic text-gray-900">Member Reflections Moderation</h4>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{reflections.length} Total transmitted insights</span>
                 </div>
                 <div className="divide-y divide-gray-50">
                    {reflections.map(r => (
                       <div key={r.id} className="p-8 flex items-start gap-6 hover:bg-gray-50/50 transition-all group">
                          <div className="w-14 h-14 bg-cyan-500 text-white rounded-2xl flex items-center justify-center font-black text-xl shrink-0 shadow-lg">{r.userName.charAt(0)}</div>
                          <div className="flex-grow space-y-2">
                             <div className="flex items-center gap-3">
                                <span className="font-black text-gray-900">{r.userName}</span>
                                <span className="text-[10px] text-gray-400 uppercase font-bold">{new Date(r.timestamp).toLocaleString()}</span>
                             </div>
                             <p className="text-sm text-gray-600 leading-relaxed font-medium italic">"{r.content}"</p>
                          </div>
                          <button 
                            onClick={() => confirmDelete(() => API.spiritual.verses.deleteReflection(r.id), "Purge this member reflection?")}
                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                            title="Moderation: Delete"
                          >
                             <Trash2 size={18}/>
                          </button>
                       </div>
                    ))}
                    {reflections.length === 0 && <div className="py-32 text-center text-gray-300 italic font-serif">No member reflections recorded in this era.</div>}
                 </div>
              </div>
           </motion.div>
        )}

        {activeSub === 'quiz' && (
           <motion.div key="quiz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-between items-center px-4">
                 <h4 className="text-xl font-black font-serif italic text-gray-900">Sanctuary Test Architect</h4>
                 <button onClick={() => { setEditingQuiz(null); setShowModal('quiz'); }} className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3">
                    <Plus size={16}/> Deploy New Sequence
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {quizzes.map(q => (
                    <div key={q.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6 flex flex-col">
                       <div className="flex justify-between items-start">
                          <div className="p-4 bg-cyan-50 text-cyan-600 rounded-2xl"><BookOpen size={24}/></div>
                          <div className="flex flex-col items-end gap-1">
                             <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase ${q.isActive ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                {q.isActive ? 'Live' : 'Draft'}
                             </span>
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{q.timeLimit} Min Sequence</span>
                          </div>
                       </div>
                       <div className="flex-grow space-y-2">
                          <h5 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">{q.title}</h5>
                          <p className="text-xs text-gray-500 font-medium">{q.questions.length} auto-correction sequences</p>
                       </div>
                       <div className="pt-6 border-t border-gray-50 flex gap-3">
                          <button onClick={() => {setEditingQuiz(q); setShowModal('quiz');}} className="flex-grow py-3 bg-gray-50 text-gray-700 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-cyan-50 hover:text-cyan-600 transition-all border border-transparent hover:border-cyan-100">Modify Data</button>
                          <button onClick={() => confirmDelete(() => API.spiritual.quizzes.delete(q.id), "Purge this Sanctuary Test?")} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16}/></button>
                       </div>
                    </div>
                 ))}
              </div>
           </motion.div>
        )}

        {activeSub === 'results' && (
           <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                 <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-1">
                       <h4 className="text-xl font-black font-serif italic text-gray-900">Spiritual Leaderboard</h4>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Analytics from timed challenges</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                       <div className="relative flex-grow md:w-64 group">
                          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500" size={14}/>
                          <select 
                            value={quizFilter} 
                            onChange={e => setQuizFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl font-bold text-[10px] uppercase outline-none focus:ring-4 focus:ring-cyan-50"
                          >
                             <option value="All Quizzes">Filter by Challenge</option>
                             {quizzes.map(q => <option key={q.id} value={q.id}>{q.title}</option>)}
                          </select>
                       </div>
                    </div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                          <tr>
                             <th className="px-8 py-6">Identity</th>
                             <th className="px-8 py-6">Sanctuary Test</th>
                             <th className="px-8 py-6">Evaluation</th>
                             <th className="px-8 py-6 text-right">Moderation</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                          {filteredResults.map(res => (
                             <tr key={res.id} className="hover:bg-cyan-50/20 transition-all group">
                                <td className="px-8 py-5">
                                   <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-md group-hover:scale-110 transition-transform">{res.userId.charAt(0)}</div>
                                      <div>
                                         <p className="font-black text-gray-900 text-sm tracking-tight">{res.userId}</p>
                                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{new Date(res.timestamp).toLocaleDateString()}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-5">
                                   <div className="flex items-center gap-2">
                                      <BookOpen size={12} className="text-cyan-500" />
                                      <span className="text-xs font-bold text-gray-500 truncate max-w-[150px]">{quizzes.find(q => q.id === res.quizId)?.title || res.quizId}</span>
                                   </div>
                                </td>
                                <td className="px-8 py-5">
                                   <div className="flex flex-col gap-1.5">
                                      <div className="flex justify-between items-center w-32">
                                         <span className="text-xs font-black text-gray-900">{res.score}/{res.total} pts</span>
                                         <span className="text-[9px] font-black text-cyan-600">+{Math.floor((res.score / res.total) * 100)} SP</span>
                                      </div>
                                      <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                         <motion.div initial={{ width: 0 }} animate={{ width: `${(res.score / res.total) * 100}%` }} className="h-full bg-cyan-500 shadow-sm" />
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                   <button 
                                      onClick={() => confirmDelete(() => API.spiritual.quizzes.deleteResult(res.id), "Wipe this score from the record?")}
                                      className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                   >
                                      <Trash2 size={16}/>
                                   </button>
                                </td>
                             </tr>
                          ))}
                          {filteredResults.length === 0 && (
                             <tr><td colSpan={4} className="py-32 text-center text-gray-300 italic font-serif">No scores recorded for this sequence category.</td></tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Modals */}
      <AnimatePresence>
         {showModal === 'verse' && (
            <div className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
               <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden flex flex-col max-h-[90vh] shadow-3xl"
               >
                  <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                     <h3 className="text-2xl font-black font-serif italic">Divine Message Architect</h3>
                     <button type="button" onClick={() => setShowModal(null)} className="p-3 bg-white text-gray-400 rounded-2xl hover:text-red-500 border border-gray-100 shadow-sm transition-all"><X size={20}/></button>
                  </div>
                  
                  <form onSubmit={handleSaveVerse} className="flex flex-col flex-grow overflow-hidden">
                    <div className="flex-grow overflow-y-auto p-10 space-y-8 scroll-hide">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Word Date</label>
                          <div className="relative">
                            <Calendar size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-500" />
                            <input name="date" type="date" defaultValue={editingVerse?.date || new Date().toISOString().split('T')[0]} className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-cyan-50 font-bold" />
                          </div>
                        </div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase ml-4">Daily Theme</label><input name="theme" defaultValue={editingVerse?.theme} required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-cyan-50 font-bold" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase ml-4">The Holy Word (Scripture)</label><textarea name="verse" defaultValue={editingVerse?.verse} required rows={3} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-cyan-50 font-medium italic resize-none" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase ml-4">Book & Reference</label><input name="reference" defaultValue={editingVerse?.reference} required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-cyan-50 font-bold" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase ml-4">Divine Context (Description)</label><textarea name="description" defaultValue={editingVerse?.description} required rows={4} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-cyan-50 font-medium leading-relaxed" /></div>
                      </div>
                    </div>
                    
                    <div className="p-10 border-t border-gray-50 bg-gray-50/30 flex gap-4">
                      <button type="button" onClick={() => setShowModal(null)} className="flex-grow py-5 bg-white border border-gray-200 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95">Discard</button>
                      <button disabled={isSyncing} type="submit" className="flex-[2] py-5 bg-cyan-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-cyan-600 transition-all flex items-center justify-center gap-3 active:scale-95">
                        {isSyncing ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} Commit Word to RASA
                      </button>
                    </div>
                  </form>
               </motion.div>
            </div>
         )}

         {showModal === 'quiz' && (
            <div className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
               <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden flex flex-col max-h-[95vh] shadow-3xl"
               >
                  <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                     <h3 className="text-2xl font-black font-serif italic">Sanctuary Test Designer</h3>
                     <button type="button" onClick={() => { setShowModal(null); setEditingQuiz(null); }} className="p-3 bg-white text-gray-400 rounded-2xl hover:text-red-500 border border-gray-100 shadow-sm transition-all"><X size={20}/></button>
                  </div>
                  
                  <form onSubmit={handleSaveQuiz} className="flex flex-col flex-grow overflow-hidden">
                    <div className="flex-grow overflow-y-auto p-10 space-y-10 scroll-hide">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-8 space-y-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Quiz Title</label>
                             <input name="title" defaultValue={editingQuiz?.title} required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-cyan-50 font-bold" />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Description / Instruction</label>
                             <textarea name="description" defaultValue={editingQuiz?.description} required rows={3} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-cyan-50 font-medium resize-none leading-relaxed" />
                           </div>
                        </div>
                        <div className="md:col-span-4 space-y-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase ml-4 flex items-center gap-2"><Clock size={12}/> Time Limit (Min)</label>
                             <input name="timeLimit" type="number" defaultValue={editingQuiz?.timeLimit || 5} required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none focus:ring-4 focus:ring-cyan-50 font-black text-xl" />
                           </div>
                           <div className="p-6 bg-cyan-50 rounded-3xl border border-cyan-100 text-[10px] text-cyan-800 flex items-start gap-3 italic">
                             <Target className="shrink-0" size={16}/>
                             <span>Automated correction is active. Select the correct choice for each sequence.</span>
                           </div>
                        </div>
                      </div>

                      <div className="space-y-8 pt-8 border-t border-gray-100">
                         <div className="flex justify-between items-center px-4">
                            <h4 className="text-lg font-black uppercase tracking-widest text-gray-900">Quest Sequences</h4>
                            <button 
                              type="button" 
                              onClick={addQuestion}
                              className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-cyan-500 transition-all shadow-xl active:scale-95"
                            >
                               <PlusCircle size={14}/> Add Biblical Question
                            </button>
                         </div>

                         <div className="space-y-6">
                            {quizQuestions.map((q, idx) => (
                               <motion.div 
                                key={q.id} 
                                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                                className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm relative group"
                               >
                                  <button 
                                    type="button" 
                                    onClick={() => removeQuestion(q.id)}
                                    className="absolute -top-3 -right-3 p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg opacity-0 group-hover:opacity-100"
                                  >
                                    <Trash size={16}/>
                                  </button>

                                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                     <div className="lg:col-span-1 flex items-start justify-center pt-4">
                                        <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black">{idx + 1}</div>
                                     </div>
                                     <div className="lg:col-span-11 space-y-6">
                                        <div className="space-y-2">
                                           <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Question Inquiry</label>
                                           <input 
                                            value={q.text} 
                                            onChange={e => updateQuestion(q.id, 'text', e.target.value)}
                                            placeholder="Who walked on water with Jesus?"
                                            className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-0 outline-none font-bold text-sm focus:bg-white focus:ring-2 focus:ring-cyan-100" 
                                           />
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                           {q.options?.map((opt, optIdx) => (
                                              <div key={optIdx} className="flex gap-2">
                                                 <input 
                                                  value={opt}
                                                  onChange={e => updateOption(q.id, optIdx, e.target.value)}
                                                  className={`flex-grow px-5 py-3 rounded-xl border-2 font-bold text-xs outline-none transition-all ${q.correctAnswer === opt ? 'bg-cyan-50 border-cyan-500 text-cyan-700' : 'bg-white border-gray-100'}`}
                                                 />
                                                 <button 
                                                  type="button"
                                                  onClick={() => updateQuestion(q.id, 'correctAnswer', opt)}
                                                  className={`shrink-0 p-3 rounded-xl border transition-all ${q.correctAnswer === opt ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg' : 'bg-gray-50 text-gray-300 border-gray-100 hover:border-cyan-200'}`}
                                                 >
                                                    <Check size={18}/>
                                                 </button>
                                              </div>
                                           ))}
                                        </div>
                                     </div>
                                  </div>
                               </motion.div>
                            ))}
                            {quizQuestions.length === 0 && (
                               <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                                  <BookOpen size={48} className="mx-auto text-gray-200 mb-4"/>
                                  <p className="text-gray-400 italic font-serif">Sanctuary Test structure is empty. Initiate questions to begin.</p>
                               </div>
                            )}
                         </div>
                      </div>
                    </div>
                    
                    <div className="p-10 border-t border-gray-50 bg-gray-50/30 flex gap-4">
                      <button type="button" onClick={() => { setShowModal(null); setEditingQuiz(null); }} className="flex-grow py-5 bg-white border border-gray-200 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95">Discard</button>
                      <button disabled={isSyncing} type="submit" className="flex-[2] py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-cyan-600 transition-all flex items-center justify-center gap-3 active:scale-95">
                        {isSyncing ? <Loader2 className="animate-spin" size={18}/> : <Database size={18}/>} Deploy Timed Challenge
                      </button>
                    </div>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SpiritualHubTab;
