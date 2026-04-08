import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
// Fix framer-motion prop errors by casting motion to any
import { motion as motionLib } from 'framer-motion';
const motion = motionLib as any;
import { 
  Calendar, User, ArrowLeft, Play, 
  Clock, Share2, Bookmark, MessageSquare,
  ChevronRight, Mic, Video, Star, Quote, Heart,
  ArrowRight
} from 'lucide-react';
import { NewsItem } from '../types';

interface NewsDetailProps {
  news: NewsItem[];
}

const NewsDetail: React.FC<NewsDetailProps> = ({ news }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const item = news.find(n => n.id === id);
  const recentNews = news.filter(n => n.id !== id).slice(0, 4);

  // Scroll to top when the item changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!item) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center justify-center space-y-6">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
          <Star size={48} />
        </div>
        <h2 className="text-4xl font-bold font-serif italic text-black">Story not found</h2>
        <p className="text-black/50">The article you are looking for might have been moved or removed.</p>
        <Link to="/news" className="px-8 py-3 bg-secondary text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:bg-secondary/90 transition-all">
          Back to Archive
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-32 bg-primary"
    >
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden bg-black">
        <motion.div 
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {item.mediaType === 'image' ? (
            <img 
              src={item.mediaUrl} 
              alt={item.title} 
              className="w-full h-full object-cover opacity-70" 
            />
          ) : (
            <div className="w-full h-full bg-gray-950 flex items-center justify-center">
               <div className="relative">
                 <div className="absolute -inset-10 bg-secondary/20 rounded-full blur-3xl animate-pulse"></div>
                 {item.mediaType === 'video' ? <Video size={100} className="text-secondary relative z-10" /> : <Mic size={100} className="text-secondary relative z-10" />}
               </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
        </motion.div>

        <div className="absolute inset-0 flex items-end">
          <div className="max-container w-full px-4 pb-20 md:pb-32 space-y-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <span className="px-5 py-2 bg-secondary text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-secondary/20">
                {item.category}
              </span>
              <span className="px-5 py-2 bg-white/10 backdrop-blur-xl text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">
                {item.mediaType === 'image' ? 'Visual Report' : 'Media Coverage'}
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-4xl md:text-8xl font-bold text-white font-serif italic leading-[1.1] max-w-5xl tracking-tight"
            >
              {item.title}
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-10 text-white/50 text-xs font-black uppercase tracking-[0.3em]"
            >
              <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white"><User size={14} /></div> {item.author}</div>
              <div className="flex items-center gap-3"><Calendar size={18} className="text-secondary" /> {new Date(item.date).toLocaleDateString()}</div>
              <div className="hidden sm:flex items-center gap-3"><Clock size={18} className="text-secondary" /> 4 MIN READ</div>
            </motion.div>
          </div>
        </div>

        {/* Floating Back Navigation */}
        <div className="absolute top-36 left-0 right-0 z-30 pointer-events-none">
          <div className="max-container px-4">
            <button 
              onClick={() => navigate('/news')}
              className="pointer-events-auto flex items-center gap-4 text-white hover:text-secondary font-black text-[10px] uppercase tracking-[0.2em] transition-all group"
            >
              <div className="p-4 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 group-hover:bg-secondary group-hover:text-white group-hover:scale-110 group-hover:-translate-x-1 transition-all duration-300">
                <ArrowLeft size={18} />
              </div>
              Archive
            </button>
          </div>
        </div>
      </section>

      {/* Article Body Section */}
      <section className="relative z-10 -mt-10 py-20 bg-white rounded-t-[4rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <div className="max-container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            {/* Main Article Content */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* Media Enhancement for Audio/Video */}
              {item.mediaType !== 'image' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-10 md:p-14 bg-gray-50 rounded-[3.5rem] border border-gray-100 flex flex-col items-center justify-center text-center space-y-8 shadow-inner"
                >
                   <div className="relative group">
                     <div className="absolute -inset-6 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all"></div>
                     <div className="w-28 h-28 bg-secondary text-white rounded-full flex items-center justify-center shadow-2xl shadow-secondary/30 relative z-10 transition-transform group-hover:scale-110 duration-500">
                       {item.mediaType === 'video' ? <Play size={48} fill="white" className="ml-1" /> : <Mic size={48} />}
                     </div>
                   </div>
                   <div className="space-y-2">
                     <p className="font-black text-black uppercase tracking-[0.3em] text-sm">Divine Broadcasting</p>
                     <p className="text-xs text-black/40 font-bold uppercase tracking-widest">Listen to the Holy Spirit Testimony</p>
                   </div>
                   <div className="w-full max-w-lg bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                     <audio controls className="w-full opacity-80">
                       <source src={item.mediaUrl} />
                     </audio>
                   </div>
                </motion.div>
              )}

              {/* Textual Content */}
              <div className="max-w-4xl mx-auto prose prose-xl prose-secondary text-black/70 leading-[1.8] font-medium selection:bg-secondary/10">
                <div className="mb-12 flex justify-center">
                  <div className="w-16 h-1 bg-gray-100 rounded-full"></div>
                </div>
                
                {/* Dynamically split content into paragraphs with refined styling */}
                {item.content.split('\n').map((para, i) => {
                  if (para.trim() === '') return null;
                  return (
                    <motion.p 
                      key={i} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="mb-10 text-xl md:text-2xl text-black/60 font-light"
                    >
                      {i === 0 ? (
                        <span className="float-left text-7xl font-serif font-black text-secondary mr-4 mt-2 leading-none">
                          {para.charAt(0)}
                        </span>
                      ) : null}
                      {i === 0 ? para.substring(1) : para}
                    </motion.p>
                  );
                })}

                {/* Pull Quote Simulation if content is long */}
                {item.content.length > 500 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="my-16 p-12 bg-secondary/5 rounded-[3rem] border-l-[10px] border-secondary relative"
                  >
                    <Quote className="absolute top-10 right-10 text-secondary/10" size={80} />
                    <p className="text-2xl md:text-3xl font-serif italic font-bold text-black leading-snug relative z-10">
                      "Our service is not just for the campus, but for the expansion of the Kingdom through excellence and faith."
                    </p>
                    <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-secondary">— RASA NYG Leadership Council</p>
                  </motion.div>
                )}
              </div>

              {/* Interaction Bar */}
              <div className="pt-16 border-t border-gray-100 flex flex-wrap items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-3 px-6 py-4 bg-gray-50 text-black/60 rounded-2xl hover:bg-secondary/5 hover:text-secondary transition-all font-black text-[10px] uppercase tracking-widest group">
                    <Share2 size={20} className="group-hover:rotate-12 transition-transform" /> Share Story
                  </button>
                  <button className="p-4 bg-gray-50 text-black/20 rounded-2xl hover:bg-secondary/5 hover:text-secondary transition-all">
                    <Bookmark size={22} />
                  </button>
                  <button className="flex items-center gap-3 px-6 py-4 bg-gray-50 text-black/60 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all font-black text-[10px] uppercase tracking-widest group">
                    <Heart size={20} className="group-hover:scale-110 transition-transform" /> 241
                  </button>
                </div>
                <button className="px-10 py-5 bg-black text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-secondary transition-all flex items-center gap-3 shadow-xl active:scale-95">
                  <MessageSquare size={18} /> Join Conversation
                </button>
              </div>
            </div>

            {/* Contextual Sidebar */}
            <div className="lg:col-span-4 space-y-12">
               
               {/* Recent Stories Widget */}
               <div className="p-10 bg-gray-50 rounded-[3.5rem] border border-gray-100 space-y-10 shadow-sm">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-6">
                    <h3 className="text-xl font-black font-serif italic text-black">Spirit Feed</h3>
                    <div className="flex gap-1">
                      {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></div>)}
                    </div>
                  </div>
                  <div className="space-y-10">
                    {recentNews.map((recent, idx) => (
                      <Link key={recent.id} to={`/news/${recent.id}`} className="flex gap-6 group items-center">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-sm ring-1 ring-gray-100">
                          <img src={recent.mediaUrl} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" alt="" />
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-[9px] font-black text-secondary uppercase tracking-[0.2em]">{recent.category}</p>
                          <h4 className="font-bold text-black leading-tight group-hover:text-secondary transition-colors line-clamp-2 text-sm">
                            {recent.title}
                          </h4>
                        </div>
                      </Link>
                    ))}
                    {recentNews.length === 0 && <p className="text-black/20 italic text-xs py-10 text-center">No other recent stories.</p>}
                  </div>
                  <Link to="/news" className="w-full py-5 bg-white border border-gray-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-secondary hover:text-white hover:border-secondary transition-all duration-300 shadow-sm active:scale-95">
                    Explore All <ChevronRight size={16} />
                  </Link>
               </div>

               {/* Community Interaction Card */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="p-12 bg-black text-white rounded-[3.5rem] shadow-2xl relative overflow-hidden group border border-gray-900"
               >
                  <div className="relative z-10 space-y-8">
                    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center border border-white/10 group-hover:bg-secondary transition-colors duration-500">
                      <Star className="text-secondary fill-secondary" size={32} />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold font-serif italic leading-tight">Share Your <span className="text-secondary">Testimony</span></h3>
                      <p className="text-sm text-white/60 leading-relaxed font-medium">Has God done something miraculous in your academic journey? Let your light shine by sharing your story with the RASA family.</p>
                    </div>
                    <Link to="/portal" className="inline-flex w-full items-center justify-center px-8 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-secondary hover:text-white transition-all duration-300 shadow-xl group-hover:-translate-y-1">
                      Start Writing <ArrowRight size={16} className="ml-3" />
                    </Link>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                  <div className="absolute top-10 right-10 p-4 opacity-5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-700">
                    <Star size={160} className="text-white" fill="currentColor" />
                  </div>
               </motion.div>

               {/* Newsletter Inline Widget */}
               <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 space-y-6">
                  <h4 className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em]">Digest Subscription</h4>
                  <p className="text-xs text-black/50 font-bold">Get weekly spiritual digests delivered to your inbox.</p>
                  <div className="flex flex-col gap-3">
                    <input type="email" placeholder="student@ur.ac.rw" className="w-full px-6 py-4 rounded-xl border border-gray-200 text-xs font-bold outline-none focus:ring-2 focus:ring-secondary/20 transition-all text-black" />
                    <button className="w-full py-4 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">Subscribe</button>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <section className="mt-20 border-t border-gray-50 pt-20">
        <div className="max-container px-4 text-center space-y-8">
          <p className="text-black/40 font-black text-[10px] uppercase tracking-[0.4em]">Continue Your Journey</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/news" className="px-12 py-5 bg-gray-100 text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-white transition-all">
              All Stories
            </Link>
            <Link to="/departments" className="px-12 py-5 bg-black text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-secondary transition-all">
              Our Ministries
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default NewsDetail;