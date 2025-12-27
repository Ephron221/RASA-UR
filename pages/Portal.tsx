
import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Loader2, Camera, X, ShieldCheck, ShieldAlert, Key, Send, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DIOCESES, LEVELS, DEPARTMENTS } from '../constants';
import { User } from '../types';
import { db } from '../services/db';
import { API } from '../services/api';

interface PortalProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

const Portal: React.FC<PortalProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [recoveryStep, setRecoveryStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Password Strength Logic
  const [passValue, setPassValue] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const passwordStrength = useMemo(() => {
    if (!passValue) return { score: 0, label: 'Empty', color: 'bg-gray-200' };
    let score = 0;
    if (passValue.length >= 8) score++;
    if (/[A-Z]/.test(passValue)) score++;
    if (/[a-z]/.test(passValue)) score++;
    if (/[0-9]/.test(passValue)) score++;
    if (/[^A-Za-z0-9]/.test(passValue)) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Fair', color: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  }, [passValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = (formData.get('email') as string)?.toLowerCase();
    const password = formData.get('password') as string;

    try {
      if (mode === 'login') {
        const user = await db.verifyMember(email, password);
        if (user) {
          onLogin(user);
          const adminRoles = ['it', 'admin', 'executive', 'accountant', 'secretary'];
          navigate(adminRoles.includes(user.role) ? '/admin' : '/dashboard');
        } else {
          setError('Invalid email or password. Access denied.');
        }
      } else if (mode === 'register') {
        if (password !== confirmPass) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }
        if (passwordStrength.score < 4) {
          setError("Please use a stronger password.");
          setLoading(false);
          return;
        }

        const newUser: any = {
          id: `u-${Math.random().toString(36).substr(2, 9)}`,
          fullName: formData.get('fullName') as string,
          email: email,
          password: password,
          phone: formData.get('phone') as string,
          role: 'member',
          program: formData.get('program') as string,
          level: formData.get('level') as string,
          diocese: formData.get('diocese') as string,
          department: formData.get('department') as string,
          profileImage: imagePreview || '',
          createdAt: new Date().toISOString()
        };
        await db.insert('members', newUser);
        const { password: p, ...u } = newUser;
        onLogin(u as User);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target as HTMLFormElement);
    const email = (formData.get('email') as string)?.toLowerCase();
    const otp = formData.get('otp') as string;
    const newPass = formData.get('newPassword') as string;

    try {
      if (recoveryStep === 1) {
        // Simulated Request OTP
        await API.auth.requestOTP(email);
        setRecoveryStep(2);
        setSuccessMsg(`A security code was sent to ${email}`);
      } else if (recoveryStep === 2) {
        const success = await API.auth.verifyOTP(email, otp);
        if (success) {
          setRecoveryStep(3);
          setSuccessMsg(null);
        } else {
          setError("Invalid security code.");
        }
      } else if (recoveryStep === 3) {
        if (newPass !== confirmPass) throw new Error("Passwords don't match.");
        await API.auth.resetPassword(email, newPass);
        setMode('login');
        setRecoveryStep(1);
        setSuccessMsg("Password successfully updated. You can now login.");
      }
    } catch (err: any) {
      setError(err.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-cyan-200 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-cyan-100 rounded-full blur-[120px]"></div>
      </div>

      <motion.div layout className="w-full max-w-xl bg-white p-8 md:p-12 rounded-[3.5rem] shadow-3xl z-10 border border-white my-10 relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-cyan-600 font-bold mb-4 hover:underline">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h2 className="text-4xl font-bold font-serif italic mb-2">
            {mode === 'login' ? 'Divine Access' : mode === 'register' ? 'Register Member' : 'Recover Key'}
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            {mode === 'login' ? 'Portal authentication required' : mode === 'register' ? 'Join the RASA family' : 'Authentication security loop'}
          </p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black border border-red-100 uppercase tracking-widest text-center flex items-center justify-center gap-3">
            <ShieldAlert size={16} /> {error}
          </motion.div>
        )}

        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl text-xs font-black border border-green-100 uppercase tracking-widest text-center flex items-center justify-center gap-3">
            <CheckCircle2 size={16} /> {successMsg}
          </motion.div>
        )}

        {mode !== 'forgot' ? (
          <form onSubmit={handleAuth} className="space-y-6">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div key="reg" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                  <div onClick={() => fileInputRef.current?.click()} className="relative flex flex-col items-center justify-center border-2 border-dashed rounded-[2.5rem] p-6 transition-all cursor-pointer group bg-gray-50 hover:bg-white border-gray-200 hover:border-cyan-400">
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                    {imagePreview ? (
                      <div className="relative w-24 h-24">
                        <img src={imagePreview} className="w-full h-full object-cover rounded-3xl shadow-lg border-2 border-white" alt=""/>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setImagePreview(null); }} className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full shadow-md"><X size={12} /></button>
                      </div>
                    ) : <div className="text-center"><Camera className="mx-auto text-cyan-500 mb-2"/><p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Portrait Upload</p></div>}
                  </div>
                  <input name="fullName" required placeholder="Full Name" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm focus:bg-white focus:ring-4 focus:ring-cyan-50 transition-all" />
                  <div className="grid grid-cols-2 gap-4">
                    <input name="phone" required placeholder="Phone Number" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm focus:bg-white focus:ring-4 focus:ring-cyan-50 transition-all" />
                    <select name="level" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm cursor-pointer">{LEVELS.map(l => <option key={l} value={l}>{l}</option>)}</select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <select name="diocese" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm cursor-pointer">{DIOCESES.map(d => <option key={d} value={d}>{d}</option>)}</select>
                    <select name="department" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm cursor-pointer">{DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}</select>
                  </div>
                  <input name="program" required placeholder="Academic Program" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm focus:bg-white focus:ring-4 focus:ring-cyan-50 transition-all" />
                </motion.div>
              )}

              <motion.div key="core" className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors" size={20} />
                  <input name="email" type="email" required placeholder="Email Address" className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm focus:bg-white focus:border-cyan-100 transition-all" />
                </div>
                
                <div className="space-y-2">
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors" size={20} />
                    <input 
                      name="password" 
                      type="password" 
                      required 
                      value={passValue}
                      onChange={(e) => setPassValue(e.target.value)}
                      placeholder="Access Password" 
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm focus:bg-white focus:border-cyan-100 transition-all" 
                    />
                  </div>
                  {mode === 'register' && (
                    <div className="px-4 space-y-2">
                       <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-400">
                          <span>Password Strength</span>
                          <span className={passwordStrength.color.replace('bg-', 'text-')}>{passwordStrength.label}</span>
                       </div>
                       <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex gap-1">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className={`h-full flex-1 transition-all ${i <= passwordStrength.score ? passwordStrength.color : 'bg-gray-100'}`} />
                          ))}
                       </div>
                    </div>
                  )}
                </div>

                {mode === 'register' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative group">
                    <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors" size={20} />
                    <input 
                      type="password" 
                      required 
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="Confirm Security Code" 
                      className={`w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border outline-none font-bold text-sm transition-all ${confirmPass && passValue !== confirmPass ? 'border-red-200 bg-red-50' : 'border-gray-100 focus:bg-white'}`} 
                    />
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            <button type="submit" disabled={loading} className="w-full py-5 bg-cyan-500 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-cyan-600 transition-all shadow-xl shadow-cyan-100 flex items-center justify-center gap-3 active:scale-95">
              {loading ? <Loader2 className="animate-spin" /> : (mode === 'login' ? 'Enter Sanctuary' : 'Finalize Initiation')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRecovery} className="space-y-8">
             <AnimatePresence mode="wait">
                {recoveryStep === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <p className="text-gray-400 text-xs text-center leading-relaxed">Enter your registered email. We will broadcast a security token to your consciousness (system).</p>
                    <div className="relative group">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500" size={20} />
                      <input name="email" type="email" required placeholder="Member Email" className="w-full pl-14 pr-8 py-5 bg-gray-50 rounded-[1.8rem] border border-transparent focus:bg-white focus:border-cyan-100 outline-none font-bold text-sm transition-all" />
                    </div>
                  </motion.div>
                )}
                {recoveryStep === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 text-center">
                    <p className="text-gray-400 text-xs leading-relaxed">Verification token received? Enter the 6-digit pulse code below.</p>
                    <div className="relative group">
                      <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                      <input name="otp" required maxLength={6} placeholder="######" className="w-full pl-14 pr-8 py-5 bg-gray-50 rounded-[1.8rem] text-center text-3xl font-black tracking-[0.5em] outline-none transition-all" />
                    </div>
                  </motion.div>
                )}
                {recoveryStep === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <p className="text-gray-400 text-xs text-center leading-relaxed">Verification successful. Construct a new strong security credential.</p>
                    <div className="space-y-4">
                      <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                        <input name="newPassword" type="password" required value={passValue} onChange={e => setPassValue(e.target.value)} placeholder="New Strong Password" className="w-full pl-14 pr-8 py-5 bg-gray-50 rounded-[1.8rem] border border-transparent focus:bg-white outline-none font-bold text-sm transition-all" />
                      </div>
                      <div className="relative group">
                        <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                        <input type="password" required value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Re-type Password" className="w-full pl-14 pr-8 py-5 bg-gray-50 rounded-[1.8rem] border border-transparent focus:bg-white outline-none font-bold text-sm transition-all" />
                      </div>
                    </div>
                  </motion.div>
                )}
             </AnimatePresence>
             
             <button type="submit" disabled={loading} className="w-full py-5 bg-gray-900 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-95 shadow-2xl">
               {loading ? <Loader2 className="animate-spin" /> : recoveryStep === 3 ? 'Override Credentials' : 'Broadcast Token'} <Send size={18} />
             </button>
          </form>
        )}

        <div className="mt-10 flex flex-col gap-4 text-center">
          {mode === 'login' && (
             <button onClick={() => { setMode('forgot'); setError(null); setSuccessMsg(null); }} className="text-xs font-black uppercase text-gray-400 tracking-widest hover:text-cyan-600 transition-colors">Forgot Security Key?</button>
          )}
          <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); setSuccessMsg(null); setRecoveryStep(1); }} className="text-cyan-600 font-black text-sm hover:underline">
            {mode === 'login' ? "New Disciple? Start Initiation" : "Already Initiated? Synchronize"}
          </button>
          {mode === 'forgot' && (
            <button onClick={() => { setMode('login'); setRecoveryStep(1); }} className="text-xs font-black uppercase text-gray-400 tracking-widest hover:text-gray-900">Return to Nexus</button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Portal;
