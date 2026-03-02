import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Loader2, Camera, X, ShieldCheck, ShieldAlert, Key, Send, CheckCircle2, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DIOCESES, LEVELS, DEPARTMENTS } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { API } from '../services/api';
import { User } from '../types';

type AuthMode = 'login' | 'register' | 'forgot';
type RegStep = 'form' | 'verify';

const Portal: React.FC = () => {
  const { login } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [regStep, setRegStep] = useState<RegStep>('form');
  const [recoveryStep, setRecoveryStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [notVerifiedEmail, setNotVerifiedEmail] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [passValue, setPassValue] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryToken, setRecoveryToken] = useState('');

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

  const handleResendOtp = async () => {
    const email = notVerifiedEmail || recoveryEmail;
    if (!email) return;
    
    setResending(true);
    setError(null);
    try {
      const res = await API.auth.resendOtp(email);
      setSuccessMsg(res.message);
      setMode('register');
      setRegStep('verify');
      setRecoveryEmail(email);
    } catch (err: any) {
      setError(err.error || 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    setNotVerifiedEmail(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = (formData.get('email') as string)?.toLowerCase();
    const password = formData.get('password') as string;

    try {
      if (mode === 'login') {
        const user = await API.auth.login(email, password);
        login(user);
        const adminRoles = ['it', 'admin', 'executive', 'accountant', 'secretary'];
        navigate(adminRoles.includes(user.role) ? '/admin' : '/dashboard');
      } else if (mode === 'register') {
        if (regStep === 'form') {
          if (password !== confirmPass) throw new Error("Passwords do not match.");
          const newUser: Partial<User> = {
            fullName: formData.get('fullName') as string, email, password,
            phone: formData.get('phone') as string, role: 'member',
            program: formData.get('program') as string, level: formData.get('level') as string,
            diocese: formData.get('diocese') as string, department: formData.get('department') as string,
            profileImage: imagePreview || '',
          };
          await API.auth.register(newUser);
          setRecoveryEmail(email);
          setRegStep('verify');
          setSuccessMsg('Please check your email for a verification code.');
        } else if (regStep === 'verify') {
          const token = formData.get('otp') as string;
          if (!token) throw new Error('Please enter your verification code.');
          const verifiedUser = await API.auth.verify(recoveryEmail, token);
          login(verifiedUser);
          navigate('/dashboard');
        }
      }
    } catch (err: any) { 
      setError(err.error || err.message || 'Authentication error.');
      if (err.notVerified) {
        setNotVerifiedEmail(err.email);
      }
    } finally { 
      setLoading(false); 
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 
    setError(null);
    setSuccessMsg(null);
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      if (recoveryStep === 1) { 
        const email = (formData.get('email') as string)?.toLowerCase();
        if (!email) throw new Error('Please enter your email address.');
        setRecoveryEmail(email);
        const res = await API.auth.forgotPassword(email);
        setSuccessMsg(res.message);
        setRecoveryStep(2);
      } else if (recoveryStep === 2) { 
        const token = formData.get('otp') as string;
        if (!token) throw new Error('Please enter the recovery token.');
        setRecoveryToken(token);
        setSuccessMsg('Token received. Please enter your new password.');
        setRecoveryStep(3);
      } else if (recoveryStep === 3) {
        const newPassword = formData.get('newPassword') as string;
        if (!newPassword) throw new Error('Please enter a new password.');

        const res = await API.auth.resetPassword(recoveryEmail, recoveryToken, newPassword);
        setSuccessMsg(res.message);
        setMode('login');
        setRecoveryStep(1);
        setRecoveryEmail('');
        setRecoveryToken('');
      }
    } catch (err: any) { 
      setError(err.error || err.message || "An unknown error occurred during password recovery."); 
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
          <Link to="/" className="inline-flex items-center gap-2 text-cyan-600 font-bold mb-4 hover:underline"><ArrowLeft size={16} /> Home</Link>
          <h2 className="text-4xl font-bold font-serif italic mb-2">{mode === 'login' ? 'Divine Access' : mode === 'register' ? 'Register Member' : 'Recover Key'}</h2>
          <p className="text-gray-500 text-sm font-medium">{mode === 'login' ? 'Portal authentication' : mode === 'register' ? (regStep === 'form' ? 'Join RASA' : 'Verify your Email') : 'Security loop'}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black border border-red-100 text-center">
            <ShieldAlert className="inline mr-2" size={16}/>{error}
            {notVerifiedEmail && (
              <button 
                onClick={handleResendOtp}
                className="block mt-2 mx-auto text-cyan-600 underline hover:text-cyan-700 flex items-center justify-center gap-1"
                disabled={resending}
              >
                {resending ? <Loader2 size={12} className="animate-spin"/> : <RefreshCw size={12}/>}
                Resend verification code
              </button>
            )}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl text-xs font-black border border-green-100 text-center">
            <CheckCircle2 className="inline mr-2" size={16}/>{successMsg}
          </div>
        )}

        <AnimatePresence mode="wait">
          {mode !== 'forgot' ? (
            <motion.form key="authForm" onSubmit={handleAuth} className="space-y-6"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <AnimatePresence>
                {mode === 'register' && regStep === 'form' && (
                  <motion.div key="reg" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                    <div onClick={() => fileInputRef.current?.click()} className="relative flex flex-col items-center justify-center border-2 border-dashed rounded-[2.5rem] p-6 cursor-pointer bg-gray-50 hover:bg-white border-gray-200 hover:border-cyan-400">
                      <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                      {imagePreview ? <img src={imagePreview} className="w-24 h-24 object-cover rounded-3xl" alt=""/> : <div className="text-center"><Camera className="mx-auto text-cyan-500"/><p className="text-[10px] font-black uppercase text-gray-400">Portrait</p></div>}
                    </div>
                    <input name="fullName" required placeholder="Full Name" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold text-sm" />
                    <div className="grid grid-cols-2 gap-4">
                      <input name="phone" required placeholder="Phone" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-sm" />
                      <select name="level" className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-sm">{LEVELS.map(l => <option key={l} value={l}>{l}</option>)}</select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <select name="diocese" className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-sm">{DIOCESES.map(d => <option key={d} value={d}>{d}</option>)}</select>
                      <select name="department" className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-sm">{DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}</select>
                    </div>
                    <input name="program" required placeholder="Program" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-sm" />
                  </motion.div>
                )}
              </AnimatePresence>
              { (mode === 'login' || (mode === 'register' && regStep === 'form')) && (
                <div className="space-y-4">
                  <div className="relative"><Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input name="email" type="email" required placeholder="Email" className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-sm" /></div>
                  <div className="space-y-2">
                    <div className="relative"><Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input name="password" type="password" required value={passValue} onChange={e => setPassValue(e.target.value)} placeholder="Password" className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-sm" /></div>
                    {mode === 'register' && <div className="h-1.5 w-full bg-gray-100 rounded-full flex gap-1">{[1,2,3,4,5].map(i => <div key={i} className={`h-full flex-1 transition-all ${i <= passwordStrength.score ? passwordStrength.color : 'bg-gray-100'}`} />)}</div>}
                  </div>
                  {mode === 'register' && <div className="relative"><ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="password" required value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Confirm" className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-sm" /></div>}
                </div>
              )}
              { mode === 'register' && regStep === 'verify' && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <input name="otp" required maxLength={6} placeholder="######" className="w-full py-5 bg-gray-50 rounded-[1.8rem] text-center text-3xl font-black tracking-[0.5em]" />
                    <button 
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resending}
                      className="w-full text-xs font-black text-cyan-600 uppercase flex items-center justify-center gap-2 hover:underline"
                    >
                      {resending ? <Loader2 size={14} className="animate-spin"/> : <RefreshCw size={14}/>}
                      Resend Code
                    </button>
                  </motion.div>
              )}
              <button type="submit" disabled={loading} className="w-full py-5 bg-cyan-500 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-cyan-600 flex items-center justify-center gap-3 active:scale-95">{loading ? <Loader2 className="animate-spin" /> : (mode === 'login' ? 'Enter Sanctuary' : (regStep === 'form' ? 'Register' : 'Verify & Create Account'))}</button>
            </motion.form>
          ) : (
            <motion.form key="recoveryForm" onSubmit={handleRecovery} className="space-y-8"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
               <AnimatePresence mode="wait">
                  {recoveryStep === 1 && <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4"><input name="email" type="email" required placeholder="Email" className="w-full px-6 py-5 bg-gray-50 rounded-[1.8rem] font-bold text-sm" /></motion.div>}
                  {recoveryStep === 2 && <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <input name="otp" required maxLength={6} placeholder="######" className="w-full py-5 bg-gray-50 rounded-[1.8rem] text-center text-3xl font-black tracking-[0.5em]" />
                  </motion.div>}
                  {recoveryStep === 3 && <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4"><input name="newPassword" type="password" required placeholder="New Password" className="w-full px-6 py-5 bg-gray-50 rounded-[1.8rem] font-bold text-sm" /></motion.div>}
               </AnimatePresence>
               <button type="submit" disabled={loading} className="w-full py-5 bg-gray-900 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3">{loading ? <Loader2 className="animate-spin" /> : recoveryStep === 3 ? 'Reset' : 'Broadcast Token'} <Send size={18} /></button>
            </motion.form>
          )}
        </AnimatePresence>
        <div className="mt-10 flex flex-col gap-4 text-center">
          {mode === 'login' && <button onClick={() => setMode('forgot')} className="text-xs font-black text-gray-400 uppercase">Forgot Password?</button>}
          <button onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setRegStep('form');
            setError(null);
            setSuccessMsg(null);
          }} className="text-cyan-600 font-black text-sm">{mode === 'login' ? "New? Register" : "Member? Login"}</button>
        </div>
      </motion.div>
    </div>
  );
};

export default Portal;