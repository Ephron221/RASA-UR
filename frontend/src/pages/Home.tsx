
import React, { useState, useEffect } from 'react';
// Fix framer-motion prop errors by casting motion to any
import { motion as motionLib, AnimatePresence } from 'framer-motion';
const motion = motionLib as any;
import { Sparkles, ArrowUpRight, Zap, Target, Heart, Loader2 } from 'lucide-react';
import { NewsItem, Leader, HomeConfig } from '../types';
import { API } from '../services/api';

// Sections
import Hero from '../components/home/Hero';
import Overview from '../components/home/Overview';
import NewsFeed from '../components/home/NewsFeed';
import Leadership from '../components/home/Leadership';
import DailyVerseSection from '../components/home/DailyVerseSection';
import QuizSection from '../components/home/QuizSection';

interface HomeProps {
  news: NewsItem[];
  leaders: Leader[];
}

const PULSE_MSGS = [
  { text: "Showing Christ to Academicians", icon: Sparkles },
  { text: "Agakiza • Urukundo • Umurimo", icon: Heart },
  { text: "1.2K+ Members Synchronized", icon: Zap },
  { text: "Eph 4:13 - The Great Mandate", icon: Target }
];

const Home: React.FC<HomeProps> = ({ news, leaders }) => {
  const [config, setConfig] = useState<HomeConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pulseIdx, setPulseIdx] = useState(0);
  
  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      try {
        const data = await API.home.getConfig();
        setConfig(data);
      } catch (err) {
        console.error("Home Sync Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();

    const interval = setInterval(() => {
      setPulseIdx(prev => (prev + 1) % PULSE_MSGS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading || !config) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617] space-y-4">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Loader2 className="text-cyan-500" size={48} />
        </motion.div>
        <p className="font-black text-[10px] uppercase tracking-[0.4em] text-cyan-500/50">Synchronizing Divine Pulse...</p>
      </div>
    );
  }

  const ActiveIcon = PULSE_MSGS[pulseIdx].icon;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {/* Hero Section */}
      <Hero config={config} />

      {/* Dynamic Spiritual Pulse Banner */}
      <div className="bg-gray-900 border-y border-white/5 py-4 overflow-hidden relative">
        <div className="max-container px-4 flex items-center justify-center">
           <AnimatePresence mode="wait">
             <motion.div 
               key={pulseIdx}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="flex items-center gap-3 text-cyan-400"
             >
                <ActiveIcon size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">{PULSE_MSGS[pulseIdx].text}</span>
             </motion.div>
           </AnimatePresence>
        </div>
      </div>

      {/* Overview Section */}
      <Overview config={config} />

      {/* Daily Verse Section */}
      <DailyVerseSection />

      {/* Sanctuary Quiz Challenges */}
      <QuizSection />

      {/* Dynamic News/Events Feed */}
      <NewsFeed news={news} />

      {/* Leadership Showcase */}
      <Leadership leaders={leaders} />
    </motion.div>
  );
};

export default Home;
