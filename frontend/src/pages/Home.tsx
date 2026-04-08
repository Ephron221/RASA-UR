
import React, { useState, useEffect } from 'react';
// Fix framer-motion prop errors by casting motion to any
import { motion as motionLib, AnimatePresence } from 'framer-motion';
const motion = motionLib as any;
import { Sparkles, Heart, Zap, Target, Loader2, Video, Play } from 'lucide-react';
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
      <div className="h-screen w-full flex flex-col items-center justify-center bg-primary space-y-4">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Loader2 className="text-secondary" size={48} />
        </motion.div>
        <p className="font-black text-[10px] uppercase tracking-[0.4em] text-secondary/50">Synchronizing Divine Pulse...</p>
      </div>
    );
  }

  const ActiveIcon = PULSE_MSGS[pulseIdx].icon;

  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtube.com/embed/')) return url;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {/* Hero Section */}
      <Hero config={config} />

      {/* Dynamic Spiritual Pulse Banner */}
      <div className="bg-primary border-y border-gray-100 py-4 overflow-hidden relative">
        <div className="max-container px-4 flex items-center justify-center">
           <AnimatePresence mode="wait">
             <motion.div 
               key={pulseIdx}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="flex items-center gap-3 text-secondary"
             >
                <ActiveIcon size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">{PULSE_MSGS[pulseIdx].text}</span>
             </motion.div>
           </AnimatePresence>
        </div>
      </div>

      {/* Overview Section */}
      <Overview config={config} />

      {/* MULTIMEDIA GALLERY SECTION */}
      {config.youtubeVideos && config.youtubeVideos.length > 0 && (
        <section className="py-24 bg-primary relative overflow-hidden border-t border-gray-50">
            <div className="max-container px-4 relative z-10">
                <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/5 border border-secondary/10 rounded-full text-secondary font-black text-[9px] uppercase tracking-[0.3em]">
                            <Video size={14} /> Multimedia Sanctuary
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold font-serif italic text-black leading-none">Visions in <span className="text-secondary">Motion</span></h2>
                        <p className="text-black/60 font-medium text-lg italic">"A digital window into the vibrant life of RASA UR."</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {config.youtubeVideos.map((url, idx) => (
                        <motion.div 
                            key={`video-${idx}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative"
                        >
                            <div className="aspect-video bg-black rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white relative group-hover:border-accent transition-all duration-500">
                                <iframe 
                                    className="w-full h-full"
                                    src={getEmbedUrl(url)}
                                    title={`Multimedia Vision ${idx + 1}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="mt-6 flex items-center gap-4 px-6">
                                <div className="w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <Play size={18} fill="currentColor" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Archival Broadcast #{idx + 1}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
      )}

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
