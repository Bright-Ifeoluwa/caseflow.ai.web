import React from 'react';
import { motion } from 'motion/react';
import { Lock, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function AccessDenied() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-[#050505] text-[#E4E3E0]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-12"
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="p-6 bg-[#141414] border border-white/10 rounded-[2.5rem] shadow-2xl">
              <Lock className="w-16 h-16 text-[#F27D26]" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Access Denied</h1>
            <p className="text-sm font-mono uppercase tracking-[0.3em] opacity-50 italic">Member Verification Failed</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6">
            <p className="text-white/70 leading-relaxed font-medium">
              Your email <span className="text-white font-bold">{auth.currentUser?.email}</span> is not on our approved waitlist.
            </p>
            <p className="text-sm opacity-50">
              Access is currently restricted to the first 100 Founding Members who registered on our public site.
            </p>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-4 bg-white text-black py-5 rounded-2xl font-bold text-lg hover:bg-[#F27D26] hover:text-white transition-all shadow-2xl group"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              Return to Public Site
            </button>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10">
          <p className="text-[10px] uppercase font-mono opacity-40 tracking-widest">A MAVERA Product</p>
        </div>
      </motion.div>
    </div>
  );
}
