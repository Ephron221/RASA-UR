
import React from 'react';
import { 
  Heart, Music, Shield, MessageSquare, 
  Users, Handshake, Globe, Info, Mail, 
  Activity, Star, Flame, Zap, Cross, ShieldCheck, Smile
} from 'lucide-react';
import { Department } from './types';

export const DEPARTMENTS: (Department & { details: string; activities: string[] })[] = [
  { 
    id: '1', 
    name: 'Call on Jesus', 
    description: 'The heartbeat of revival and corporate prayer.', 
    icon: 'Flame',
    details: 'Call on Jesus is dedicated to igniting spiritual revival through intense, focused prayer and scripture-based meditation. We believe in the power of the Holy Spirit to transform lives and our campus.',
    activities: ['Weekly Revival Nights', 'Prayer Retreats', 'Fasting Fellowships', 'Scripture Memorization']
  },
  { 
    id: '2', 
    name: 'Jackin Worship Team', 
    description: 'Leading the congregation into the presence of God.', 
    icon: 'Music',
    details: 'Our worship team is more than just singers and musicians; we are ministers of the Gospel through song. We focus on excellence in musicality and depth in spiritual preparation.',
    activities: ['Sunday Service Worship', 'Voice Training Sessions', 'Instrumental Workshops', 'Worship Nights']
  },
  { 
    id: '3', 
    name: 'Evangelisation', 
    description: 'Proclaiming Christ to the four corners of our campus.', 
    icon: 'Globe',
    details: 'Tasked with the great commission, the Evangelisation department organizes outreaches, door-to-door evangelism, and campus missions to win souls for the Kingdom.',
    activities: ['Campus Outreaches', 'Door-to-door Witnessing', 'Mission Trips', 'New Convert Follow-up']
  },
  { 
    id: '4', 
    name: 'Media', 
    description: 'Documenting and broadcasting the work of God.', 
    icon: 'Activity',
    details: 'The Media team manages our digital presence, social media, photography, and live streaming. We bridge the gap between our physical fellowships and the digital world.',
    activities: ['Photography & Videography', 'Social Media Management', 'Graphic Design', 'Live Streaming Support']
  },
  { 
    id: '5', 
    name: 'Protocol', 
    description: 'Ensuring order and warmth in the House of the Lord.', 
    icon: 'Shield',
    details: 'Protocol handles ushering, security, and hospitality. We ensure that every person who enters our services feels welcomed, comfortable, and safe.',
    activities: ['Ushering Services', 'Guest Welcoming', 'Venue Management', 'Event Security']
  },
  { 
    id: '6', 
    name: 'Intercession', 
    description: 'Abanyamasengesho - The powerhouse of the ministry.', 
    icon: 'Heart',
    details: 'The Intercessors are the spiritual wall of RASA. We pray for individual needs, campus peace, and the global church, standing in the gap for others.',
    activities: ['Early Morning Prayers', 'All-night Intercessions', 'Individual Prayer Counseling', 'Spiritual Warfare Training']
  },
  { 
    id: '7', 
    name: 'Shalom', 
    description: 'Peace-making and deep fellowship bonds.', 
    icon: 'Star',
    details: 'Shalom focuses on the reconciliation of relationships and the building of a peaceful, loving community. We handle internal disputes and promote brotherly love.',
    activities: ['Fellowship Weekends', 'Conflict Resolution Workshops', 'Social Networking', 'Community Building']
  },
  { 
    id: '8', 
    name: 'Sport', 
    description: 'Physical wellness for spiritual fitness.', 
    icon: 'Zap',
    details: 'We believe our bodies are temples of the Holy Spirit. Through sports, we build discipline, teamwork, and healthy bodies prepared for ministry.',
    activities: ['Football & Volleyball Teams', 'Morning Fitness Runs', 'Inter-department Tournaments', 'Health Awareness Talks']
  },
  { 
    id: '9', 
    name: 'Music', 
    description: 'Professional vocal and instrumental excellence.', 
    icon: 'Mic',
    details: 'The Music department is dedicated to technical musical training, including choir arrangements and technical sound management for all services.',
    activities: ['Choir Rehearsals', 'Sound Engineering Basics', 'Music Theory Classes', 'Instrument Maintenance']
  },
  { 
    id: '10', 
    name: 'Social Affairs', 
    description: 'Serving the physical needs of our members.', 
    icon: 'Handshake',
    details: 'Social Affairs identifies and supports members facing financial, health, or academic challenges. We represent the practical hand of Christ’s love.',
    activities: ['Student Welfare Support', 'Academic Peer Tutoring', 'Community Charity Works', 'Visitation Programs']
  },
];

export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'News', href: '/news' },
  { name: 'Announcements', href: '/announcements' },
  { name: 'Contact Us', href: '/contact' },
];

export const DIOCESES = [
  'Butare', 'Cyangugu', 'Gahini', 'Kigali', 'Kigeme', 'Kivu', 'Muhabura', 'Mityana', 'Byumba', 'Nyagatare'
];

export const LEVELS = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
