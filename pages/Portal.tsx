
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Phone, MapPin, Briefcase, GraduationCap, ArrowLeft, Loader2, Camera, X, ShieldCheck, KeyRound, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DIOCESES, LEVELS, DEPARTMENTS } from '../constants';
import { User } from '../types';
import { API } from '../services/api';

interface PortalProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'login' | 'register' | 'forgot' | 'otp' | 'reset';

const Portal: React.FC<PortalProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState('');
  
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProfileImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      if (mode === 'login') {
        // Administration account check
        if (email === 'esront21@gmail.com' && password === 'Diano21%') {
          const adminUser: User = {
            id: 'admin-1',
            fullName: 'RASA Senior Admin',
            email: 'esront21@gmail.com',
            phone: '+250 788 999 999',
            role: 'admin',
            program: 'Administration',
            level: 'N/A',
            diocese: 'Kigali',
            department: 'Executive',
            createdAt: '2021-01-01'
          };
          onLogin(adminUser);
          navigate('/admin');
          return;
        }

        const members = await API.members.getAll();
        const user = members.find(m => m.email === email);
        if (user) {
          onLogin(user);
          navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        } else {
          setError('Invalid credentials.');
        }
      } else if (mode === 'register') {
        const newUser: User = {
          id: `user-${Math.random().toString(36).substr(2, 9)}`,
          fullName: formData.get('fullName') as string,
          email: email,
          phone: formData.get('phone') as string,
          role: 'member',
          program: formData.get('program') as string,
          level: formData.get('level') as string,
          diocese: formData.get('diocese') as string,
          department: formData.get('department') as string,
          profileImage: imagePreview || '',
          createdAt: new Date().toISOString()
        };
        await API.members.create(newUser);
        onLogin(newUser);
        navigate('/dashboard');
      } else if (mode === 'forgot') {
        setResetEmail(email);
        await API.auth.requestOTP(email);
        setMode('otp');
        setSuccessMsg('OTP sent to your email/phone. Please check.');
      } else if (mode === 'otp') {
        const otp = formData.get('otp') as string;
        const valid = await API.auth.verifyOTP(resetEmail, otp);
        if (valid) {
          setMode('reset');
        } else {
          setError('Invalid or expired OTP.');
        }
      } else if (mode === 'reset') {
        const newPass = formData.get('newPassword') as string;
        await API.auth.resetPassword(resetEmail, newPass);
        setMode('login');
        setSuccessMsg('Password updated successfully. Please login.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl"></div>
      </div>

      <motion.div layout className="w-full max-w-xl bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl z-10 border border-gray-100 my-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-cyan-600 font-bold mb-4 hover:underline">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h2 className="text-4xl font-bold font-serif italic mb-2">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Join Our Family'}
            {(mode === 'forgot' || mode === 'otp' || mode === 'reset') && 'Reset Access'}
          </h2>
          <p className="text-gray-500">
            {mode === 'login' && 'Enter your credentials to access the portal'}
            {mode === 'register' && 'Become a registered RASA member'}
            {mode === 'forgot' && 'Provide your email to receive a secure OTP'}
            {mode === 'otp' && 'Enter the 6-digit code sent to you'}
            {mode === 'reset' && 'Set a new secure password'}
          </p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">{error}</div>}
        {successMsg && <div className="mb-6 p-4 bg-cyan-50 text-cyan-700 rounded-2xl text-xs font-bold border border-cyan-100 flex items-center gap-2"><CheckCircle2 size={16}/>{successMsg}</div>}

        <form onSubmit={handleAuth} className="space-y-5">
          <AnimatePresence mode="wait">
            {mode === 'register' && (
              <motion.div key="reg" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                <div onClick={() => fileInputRef.current?.click()} className="relative flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-6 transition-all cursor-pointer group bg-gray-50 hover:bg-white">
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                  {imagePreview ? (
                    <div className="relative w-24 h-24">
                      <img src={imagePreview} className="w-full h-full object-cover rounded-full shadow-lg border-2 border-white" alt=""/>
                      <button onClick={removeImage} className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full shadow-md"><X size={12} /></button>
                    </div>
                  ) : <div className="text-center"><Camera className="mx-auto text-cyan-500 mb-2"/><p className="text-[10px] font-black uppercase text-gray-400">Profile Pic</p></div>}
                </div>
                <div className="relative group"><UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500" size={18} /><input name="fullName" required placeholder="Full Name" className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm focus:bg-white" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative"><Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input name="phone" required placeholder="Phone" className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm" /></div>
                  <div className="relative"><GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><select name="level" required className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm appearance-none">{LEVELS.map(l => <option key={l} value={l}>{l}</option>)}</select></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative"><MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><select name="diocese" required className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm appearance-none">{DIOCESES.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                  <div className="relative"><Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><select name="department" required className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm appearance-none">{DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}</select></div>
                </div>
                <div className="relative group"><GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input name="program" required placeholder="Academic Program" className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm" /></div>
              </motion.div>
            )}

            {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
              <motion.div key="core" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500" size={20} />
                  <input name="email" type="email" required placeholder="Email Address" className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm focus:bg-white" />
                </div>
                {mode !== 'forgot' && (
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500" size={20} />
                    <input name="password" type="password" required placeholder="Password" className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm focus:bg-white" />
                  </div>
                )}
              </motion.div>
            )}

            {mode === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative group">
                <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500" size={20} />
                <input name="otp" required placeholder="Enter 6-digit OTP" maxLength={6} className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-black text-center text-lg tracking-[0.5em] focus:bg-white" />
              </motion.div>
            )}

            {mode === 'reset' && (
              <motion.div key="reset" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500" size={20} />
                  <input name="newPassword" type="password" required placeholder="New Password" className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm focus:bg-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" disabled={loading} className="w-full py-5 bg-cyan-500 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-cyan-600 transition-all shadow-xl shadow-cyan-100 flex items-center justify-center gap-2 active:scale-95">
            {loading ? <Loader2 className="animate-spin" /> : (
              mode === 'login' ? 'Authenticate' : 
              mode === 'register' ? 'Join RASA' : 
              mode === 'forgot' ? 'Get OTP Code' : 
              mode === 'otp' ? 'Verify Code' : 'Update Password'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col gap-4 text-center">
          <p className="text-gray-500 text-sm">
            {mode === 'login' ? (
              <>
                Don't have an account? <button onClick={() => { setMode('register'); setError(null); }} className="text-cyan-600 font-bold hover:underline">Register</button>
                <br/>
                <button onClick={() => { setMode('forgot'); setError(null); }} className="text-gray-400 font-bold text-xs mt-3 uppercase tracking-widest hover:text-cyan-600">Forgot Password?</button>
              </>
            ) : (
              <>Already have an account? <button onClick={() => { setMode('login'); setError(null); }} className="text-cyan-600 font-bold hover:underline">Login</button></>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Portal;
