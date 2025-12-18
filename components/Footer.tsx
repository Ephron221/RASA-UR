
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold italic font-serif">RASA UR-Nyarugenge</h3>
            <p className="text-gray-400 leading-relaxed">
              Showing Christ to Academicians since 1997. A non-profit evangelical association under the Anglican Church of Rwanda.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-cyan-500 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-cyan-500 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-cyan-500 transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-cyan-500 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About History</Link></li>
              <li><Link to="/news" className="hover:text-white transition-colors">Latest News</Link></li>
              <li><Link to="/departments" className="hover:text-white transition-colors">Our Departments</Link></li>
              <li><Link to="/portal" className="hover:text-white transition-colors">Member Portal</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-cyan-500 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex gap-3"><MapPin className="text-cyan-500 shrink-0" size={20} /> UR CST Campus, Nyarugenge, Kigali</li>
              <li className="flex gap-3"><Phone className="text-cyan-500 shrink-0" size={20} /> +250 780 000 000</li>
              <li className="flex gap-3"><Mail className="text-cyan-500 shrink-0" size={20} /> info@rasa-nyg.org</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-cyan-500 uppercase tracking-wider">Stay Updated</h4>
            <p className="text-gray-400 mb-4 text-sm">Join our newsletter for weekly scriptures and news.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-gray-800 border-none rounded-lg px-4 py-2 flex-grow text-sm focus:ring-2 focus:ring-cyan-500 outline-none" 
              />
              <button className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg font-bold text-sm transition-colors">Join</button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm gap-4">
          <p>© {new Date().getFullYear()} RASA UR-Nyarugenge. All rights reserved.</p>
          <p>Motto: Agakiza, Urukundo, Umurimo</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
