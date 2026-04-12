import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, Target, CheckCircle2, Sparkles, Save, Loader2, X } from 'lucide-react';
import { BibleQuiz, QuizResult, User } from '../../types';
import { API } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';

interface MemberSpiritualTabProps {
  currentUser: User;
  quizzes: BibleQuiz[];
  updateUser: (user: User) => void;
  activeQuiz: BibleQuiz | null;
  setActiveQuiz: (q: BibleQuiz | null) => void;
}

const MemberSpiritualTab: React.FC<MemberSpiritualTabProps> = ({ currentUser, quizzes, updateUser, activeQuiz, setActiveQuiz }) => {
  const { notify } = useNotification();
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const handleQuizSubmit = async () => {
    if (!activeQuiz || !currentUser) return;
    setIsSubmittingQuiz(true);
    let score = 0;
    activeQuiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) score++;
    });

    const result: QuizResult = {
      id: Math.random().toString(36).substr(2, 9),
      quizId: activeQuiz.id,
      userId: currentUser.id,
      score,
      total: activeQuiz.questions.length,
      timestamp: new Date().toISOString()
    };

    try {
      await API.spiritual.quizzes.submitResult(result);
      setQuizResult(result);
      const earnedPoints = Math.floor((score/result.total)*100);
      updateUser({ ...currentUser, spiritPoints: (currentUser.spiritPoints || 0) + earnedPoints });
      notify("Quest Complete", `Congratulations! You earned ${earnedPoints} Spirit Points.`, "success");
    } finally { setIsSubmittingQuiz(false); }
  };

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black font-serif italic text-black tracking-tight mb-2">Sanctuary Quests</h2>
          <p className="text-[9px] font-black uppercase text-black/30 tracking-[0.3em]">Test your knowledge and elevate your Spirit Points</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map(q => (
          <div key={q.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-secondary/5 text-secondary rounded-2xl flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all"><BookOpen size={24}/></div>
                <span className="text-[10px] font-black text-black/40 uppercase tracking-widest flex items-center gap-2"><Clock size={12}/> {q.timeLimit}m</span>
              </div>
              <h5 className="text-xl font-black text-black mb-2">{q.title}</h5>
              <p className="text-sm text-black/50 mb-6 italic line-clamp-2">"{q.description}"</p>
              <button onClick={() => setActiveQuiz(q)} className="w-full py-4 bg-gray-50 text-black font-black text-[10px] uppercase tracking-widest group-hover:bg-secondary group-hover:text-white transition-all rounded-2xl">Begin Quest</button>
          </div>
        ))}
        {quizzes.length === 0 && (
          <div className="lg:col-span-3 py-20 text-center">
            <Target size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No Active Quests</p>
          </div>
        )}
      </div>

      {/* Quiz Modal Layout */}
      <AnimatePresence>
        {activeQuiz && (
            <div className="fixed inset-0 z-[600] bg-white flex flex-col p-8 md:p-16 text-black overflow-y-auto">
              <div className="max-w-4xl mx-auto w-full space-y-12">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-8">
                    <div className="space-y-1">
                        <h2 className="text-4xl font-black font-serif italic text-secondary leading-none">{activeQuiz.title}</h2>
                        <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.4em] mt-2">Sanctuary Quest Protocol</p>
                    </div>
                    <button onClick={() => { setActiveQuiz(null); setQuizResult(null); setQuizAnswers({}); }} className="p-4 bg-gray-50 rounded-[1.5rem] hover:bg-red-50 hover:text-red-500 transition-all text-black/40 shadow-sm"><X size={32}/></button>
                  </div>

                  {quizResult ? (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-20 space-y-10 bg-gray-50 rounded-[4rem] border border-gray-100 shadow-inner">
                        <div className="w-48 h-48 bg-secondary/10 rounded-[4rem] border-4 border-white flex items-center justify-center mx-auto shadow-2xl relative">
                          <div className="absolute inset-0 bg-secondary rounded-[4rem] opacity-5 animate-ping" />
                          <CheckCircle2 size={96} className="text-secondary relative z-10" />
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-6xl font-black italic font-serif text-black leading-none">Quest Complete</h3>
                          <p className="text-3xl text-black/60 font-medium">Final Score: <span className="text-secondary font-black">{quizResult.score} / {quizResult.total}</span></p>
                          <div className="inline-flex items-center gap-2 px-6 py-2 bg-amber-500 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">
                            <Sparkles size={14}/> +{Math.floor((quizResult.score/quizResult.total)*100)} Spirit Points Earned
                          </div>
                        </div>

                        {/* Correction Sequence */}
                        <div className="mt-12 text-left bg-white p-8 md:p-12 rounded-[3.5rem] shadow-sm border border-gray-100 max-w-3xl mx-auto space-y-8">
                           <h4 className="text-2xl font-black italic font-serif text-black border-b border-gray-50 pb-6">Correction Sequence</h4>
                           <div className="space-y-8">
                             {activeQuiz.questions.map((q, i) => {
                                const userAnswer = quizAnswers[q.id];
                                const isCorrect = userAnswer === q.correctAnswer;
                                return (
                                   <div key={q.id} className="space-y-4">
                                       <div className="flex items-start gap-4">
                                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-black text-white ${isCorrect ? 'bg-secondary' : 'bg-red-500'}`}>
                                             {i + 1}
                                          </div>
                                          <div>
                                             <p className="font-bold text-black text-lg leading-tight mt-1">{q.text}</p>
                                          </div>
                                       </div>
                                       <div className="pl-12 space-y-2">
                                          {!isCorrect && (
                                             <div className="px-5 py-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 relative">
                                                <span className="opacity-60 uppercase text-[9px] font-black tracking-widest block mb-1">Your Selection</span>
                                                {userAnswer || 'No Answer Provided'}
                                             </div>
                                          )}
                                          <div className={`px-5 py-4 rounded-2xl text-sm font-bold border relative ${isCorrect ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-gray-50 text-black border-gray-100'}`}>
                                              <span className="opacity-40 uppercase text-[9px] font-black tracking-widest block mb-1">Correct Answer</span>
                                              {q.correctAnswer}
                                          </div>
                                       </div>
                                   </div>
                                );
                             })}
                           </div>
                        </div>

                        <button onClick={() => { setActiveQuiz(null); setQuizResult(null); setQuizAnswers({}); }} className="px-20 py-6 bg-black text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-secondary transition-all active:scale-95">Return to Sanctuary</button>
                    </motion.div>
                  ) : (
                    <div className="space-y-12 pb-20">
                        {activeQuiz.questions.map((q, i) => (
                          <div key={q.id} className="space-y-8 bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                              <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl">{i + 1}</div>
                                <h4 className="text-3xl font-black text-black leading-tight tracking-tight">{q.text}</h4>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {q.options.map(opt => (
                                    <button 
                                    key={opt}
                                    onClick={() => setQuizAnswers({...quizAnswers, [q.id]: opt})}
                                    className={`p-8 rounded-[2rem] border-4 text-left transition-all font-black text-xl relative overflow-hidden group ${quizAnswers[q.id] === opt ? 'bg-secondary border-secondary text-white shadow-2xl scale-105' : 'bg-white border-white hover:border-secondary/20 text-black/40 hover:text-black shadow-sm'}`}
                                    >
                                      {quizAnswers[q.id] === opt && <div className="absolute top-0 right-0 p-4"><CheckCircle2 size={24}/></div>}
                                      {opt}
                                    </button>
                                ))}
                              </div>
                          </div>
                        ))}
                        <div className="pt-10 flex justify-center">
                          <button 
                            disabled={Object.keys(quizAnswers).length < activeQuiz.questions.length || isSubmittingQuiz}
                            onClick={handleQuizSubmit}
                            className="px-24 py-8 bg-secondary text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.5em] shadow-[0_20px_50px_rgba(59,107,31,0.4)] hover:bg-black active:scale-95 disabled:opacity-30 flex items-center gap-6 transition-all"
                          >
                              {isSubmittingQuiz ? <Loader2 className="animate-spin" size={28}/> : <Save size={28}/>} Submit Sequence
                          </button>
                        </div>
                    </div>
                  )}
              </div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemberSpiritualTab;
