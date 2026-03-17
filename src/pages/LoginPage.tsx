import React from 'react';
import { Scale, Shield } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
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
            <div className="p-6 bg-[#141414] border border-white/10 rounded-[2.5rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <Scale className="w-16 h-16 text-[#F27D26]" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter text-white">CASEFLOW.AI</h1>
            <p className="text-sm font-mono uppercase tracking-[0.3em] opacity-50 italic">Autonomous Legal Intelligence</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6">
            <p className="text-white/70 leading-relaxed font-medium">
              Access is currently restricted to <span className="text-[#F27D26] font-bold">Founding Members</span>. Please authenticate with your registered professional email.
            </p>
            
            <button 
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-4 bg-white text-black py-5 rounded-2xl font-bold text-lg hover:bg-[#F27D26] hover:text-white transition-all shadow-2xl group"
            >
              <Shield className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Authenticate Access
            </button>
          </div>
          
          <Link to="/" className="inline-block text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
            ← Back to Public Site
          </Link>
        </div>

        <div className="pt-12 border-t border-white/10">
          <p className="text-[10px] uppercase font-mono opacity-40 tracking-widest">A MAVERA Product</p>
        </div>
      </motion.div>
    </div>
  );
}
