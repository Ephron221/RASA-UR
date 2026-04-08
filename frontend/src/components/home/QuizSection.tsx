
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Sparkles, Target, Users, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BibleQuiz } from '../../types';
import { API } from '../../services/api';

const QuizSection: React.FC = () => {
  const [quizzes, setQuizzes] = useState<BibleQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.spiritual.quizzes.getActive().then(data => {
      setQuizzes(data || []);
      setLoading(false);
    });
  }, []);

  if (loading || quizzes.length === 0) return null;

  return (
    <section className="py-24 bg-primary relative overflow-hidden border-b border-gray-50">
      {/* Sacred Geometry Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-secondary/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-accent/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-container px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-8">
          <div className="space-y-6 max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/5 backdrop-blur-xl border border-secondary/10 rounded-full text-secondary font-black text-[9px] uppercase tracking-[0.3em]"
            >
              <Shield size={12} className="text-secondary" /> Wisdom & Knowledge
            </motion.div>
            <div className="space-y-2">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold font-serif italic text-black leading-tight"
              >
                The Sanctuary <span className="text-secondary">Quests</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-black/60 text-base font-light leading-relaxed max-w-lg"
              >
                Test your command of the Word through timed divine sequences. 
                Earn Spirit Points and ascend the ranks of the RASA fellowship.
              </motion.p>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-6 p-6 bg-white shadow-xl border border-gray-100 rounded-[2rem] backdrop-blur-3xl"
          >
             <div className="flex items-center gap-4 border-r border-gray-100 pr-6">
                <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center border border-secondary/20">
                   <Users size={18} />
                </div>
                <div>
                   <p className="text-black font-black text-lg">1.2K</p>
                   <p className="text-[8px] font-black uppercase text-black/40 tracking-widest">Participants</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center border border-accent/20">
                   <Zap size={18} />
                </div>
                <div>
                   <p className="text-black font-black text-lg">Daily</p>
                   <p className="text-[8px] font-black uppercase text-black/40 tracking-widest">Refreshed</p>
                </div>
             </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz, idx) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-white border border-gray-100 rounded-[2.5rem] p-8 hover:border-accent/30 transition-all duration-500 flex flex-col h-full relative overflow-hidden shadow-sm hover:shadow-xl"
            >
              {/* Card Glow Effect */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/5 rounded-full blur-[60px] group-hover:bg-accent/10 transition-all"></div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="w-12 h-12 bg-secondary/5 rounded-2xl flex items-center justify-center text-secondary border border-secondary/5 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                  <Target size={22} />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-[8px] font-black uppercase tracking-widest text-black/40 group-hover:text-accent transition-colors">
                  <Clock size={10} /> {quiz.timeLimit}m Limit
                </div>
              </div>

              <div className="space-y-3 flex-grow mb-8 relative z-10">
                <h3 className="text-lg font-black text-black group-hover:text-accent transition-colors tracking-tight">
                  {quiz.title}
                </h3>
                <p className="text-black/50 text-xs font-medium leading-relaxed line-clamp-2 italic">
                  "{quiz.description}"
                </p>
              </div>

              <div className="space-y-6 relative z-10 pt-6 border-t border-gray-50">
                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                  <span className="text-black/40">Reward Tier</span>
                  <span className="text-secondary font-bold">100 SPIRIT POINTS</span>
                </div>

                <Link 
                  to="/portal" 
                  className="flex items-center justify-between group/btn bg-gray-50 hover:bg-accent p-1.5 pr-4 rounded-2xl transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center shadow-lg group-hover/btn:bg-white group-hover/btn:text-accent transition-all">
                    <ArrowRight size={18} />
                  </div>
                  <span className="text-black font-black text-[9px] uppercase tracking-[0.3em] group-hover/btn:text-white transition-all">Start Quest</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 text-center space-y-6"
        >
          <div className="flex justify-center gap-1.5 opacity-30">
             {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-secondary rounded-full" />)}
          </div>
          <Link 
            to="/portal"
            className="inline-flex items-center gap-4 px-12 py-4 bg-secondary text-white rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:bg-accent transition-all active:scale-95 group shadow-xl"
          >
            Access Full Archive <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default QuizSection;
