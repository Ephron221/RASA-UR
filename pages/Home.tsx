
import React, { useState, useEffect } from 'react';
import { NewsItem, Leader, HomeConfig } from '../types';
import { API } from '../services/api';

// Sections
import Hero from '../components/home/Hero';
import Overview from '../components/home/Overview';
import NewsFeed from '../components/home/NewsFeed';
import Leadership from '../components/home/Leadership';

interface HomeProps {
  news: NewsItem[];
  leaders: Leader[];
}

const Home: React.FC<HomeProps> = ({ news, leaders }) => {
  const [config, setConfig] = useState<HomeConfig | null>(null);
  
  useEffect(() => {
    API.home.getConfig().then(setConfig);
  }, []);

  if (!config) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <Hero config={config} />

      {/* Overview Section */}
      <Overview config={config} />

      {/* Dynamic News/Events Feed */}
      <NewsFeed news={news} />

      {/* Leadership Showcase */}
      <Leadership leaders={leaders} />
    </div>
  );
};

export default Home;
