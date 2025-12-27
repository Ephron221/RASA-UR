
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowUpRight, Zap, Target, Heart } from 'lucide-react';
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
  const [pulseIdx, setPulseIdx] = useState(0);
  
  useEffect(() => {
    API.home.getConfig().then(setConfig);
    const interval = setInterval(() => {
      setPulseIdx(prev => (prev + 1) % PULSE_MSGS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!config) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const ActiveIcon = PULSE_MSGS[pulseIdx].icon;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <Hero config={config} />

      {/* Dynamic Spiritual Pulse Banner */}
      <div className="bg-gray-900 border-y border-white/5 py-4 overflow-hidden">
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
    </div>
  );
};

export default Home;
