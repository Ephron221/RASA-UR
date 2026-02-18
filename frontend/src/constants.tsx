
import React from 'react';
import { 
  Heart, Music, Shield, MessageSquare, 
  Users, Handshake, Globe, Info, Mail, 
  Activity, Star, Flame, Zap, Cross, ShieldCheck, Smile
} from 'lucide-react';
import { Department, Permission } from './types';

export const ALL_PERMISSIONS: Permission[] = [
  { key: 'tab.overview', label: 'Overview Access', category: 'General' },
  { key: 'tab.profile', label: 'Profile Editor', category: 'General' },
  { key: 'tab.home', label: 'Home Page CMS', category: 'Content' },
  { key: 'tab.about', label: 'About History CMS', category: 'Content' },
  { key: 'tab.footer', label: 'Footer & Socials CMS', category: 'Content' },
  { key: 'tab.spiritual', label: 'Spiritual Hub Admin', category: 'Spiritual' },
  { key: 'tab.members', label: 'Member Registry', category: 'Users' },
  { key: 'tab.content', label: 'News Feed Admin', category: 'Content' },
  { key: 'tab.bulletin', label: 'Bulletin Board Admin', category: 'Content' },
  { key: 'tab.depts', label: 'Ministries Admin', category: 'General' },
  { key: 'tab.leaders', label: 'Leadership Admin', category: 'General' },
  { key: 'tab.donations', label: 'Financial Ledger', category: 'Finance' },
  { key: 'tab.contacts', label: 'Inbox / Messages', category: 'Communication' },
  { key: 'tab.system', label: 'System Kernel', category: 'System' },
  { key: 'tab.clearance', label: 'Clearance Architect', category: 'Users' },
  
  { key: 'action.verify_donations', label: 'Verify Offerings', category: 'Finance' },
  { key: 'action.purge_finance', label: 'Wipe Finance Logs', category: 'Finance' },
  { key: 'action.manage_roles', label: 'Assign Clearances', category: 'Users' },
  { key: 'action.reset_db', label: 'Execute Kernel Reset', category: 'System' },
  { key: 'action.edit_members', label: 'Modify Member Data', category: 'Users' },
];

export const DEPARTMENTS: (Department & { details: string; activities: string[] })[] = [
  { 
    id: '1', 
    name: 'Call on Jesus', 
    description: 'The heartbeat of revival and corporate prayer.', 
    icon: 'Flame',
    details: 'Call on Jesus is dedicated to igniting spiritual revival through intense, focused prayer and scripture-based meditation.',
    activities: ['Weekly Revival Nights', 'Prayer Retreats', 'Fasting Fellowships', 'Scripture Memorization']
  },
  { 
    id: '2', 
    name: 'Jackin Worship Team', 
    description: 'Leading the congregation into the presence of God.', 
    icon: 'Music',
    details: 'Our worship team is more than just singers and musicians; we are ministers of the Gospel through song.',
    activities: ['Sunday Service Worship', 'Voice Training Sessions', 'Instrumental Workshops', 'Worship Nights']
  },
  { 
    id: '3', 
    name: 'Evangelisation', 
    description: 'Proclaiming Christ to the four corners of our campus.', 
    icon: 'Globe',
    details: 'Tasked with the great commission, the Evangelisation department organizes outreaches.',
    activities: ['Campus Outreaches', 'Door-to-door Witnessing', 'Mission Trips']
  },
  { 
    id: '4', 
    name: 'Media', 
    description: 'Documenting and broadcasting the work of God.', 
    icon: 'Activity',
    details: 'The Media team manages our digital presence, social media, photography, and live streaming.',
    activities: ['Photography & Videography', 'Social Media Management', 'Graphic Design']
  },
  { 
    id: '5', 
    name: 'Protocol', 
    description: 'Ensuring order and warmth in the House of the Lord.', 
    icon: 'Shield',
    details: 'Protocol handles ushering, security, and hospitality.',
    activities: ['Ushering Services', 'Guest Welcoming', 'Venue Management']
  },
];

export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'News', href: '/news' },
  { name: 'Announcements', href: '/announcements' },
  { name: 'Support Us', href: '/donations' },
  { name: 'Contact Us', href: '/contact' },
];

export const DIOCESES = [
  'Butare', 'Cyangugu', 'Gahini', 'Kigali', 'Kigeme', 'Kivu', 'Muhabura', 'Mityana', 'Byumba', 'Nyagatare'
];

export const LEVELS = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
