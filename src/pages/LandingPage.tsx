import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Scale, ChevronRight, Clock, Zap, Shield, ArrowRight, Users, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      const path = `waitlist/${email.toLowerCase()}`;
      try {
        await setDoc(doc(db, 'waitlist', email.toLowerCase()), {
          email: email.toLowerCase(),
          createdAt: new Date().toISOString(),
          status: 'pending'
        });
        setSubmitted(true);
      } catch (error) {
        console.error("Waitlist registration failed", error);
        handleFirestoreError(error, OperationType.CREATE, path);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E4E3E0] font-sans selection:bg-[#F27D26] selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="w-8 h-8 text-[#F27D26]" />
            <span className="font-bold tracking-tighter text-2xl">CASEFLOW.AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium opacity-60">
            <a href="#pain" className="hover:text-white transition-colors">The Problem</a>
            <a href="#solution" className="hover:text-white transition-colors">The Intelligence</a>
            <a href="#exclusivity" className="hover:text-white transition-colors">Waitlist</a>
          </div>
          <Link 
            to="/login" 
            className="px-6 py-2 border border-white/20 rounded-full text-sm font-bold hover:bg-white hover:text-black transition-all"
          >
            Member Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 border border-[#F27D26]/30 text-[#F27D26] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-8">
              A MAVERA Product
            </span>
            <h1 className="text-[12vw] md:text-[8vw] font-black leading-[0.85] tracking-tighter uppercase mb-8">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">Nigerian Law</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl opacity-60 leading-relaxed mb-12">
              Stop searching. Start winning. CaseFlow.ai is the autonomous legal intelligence platform designed exclusively for Nigeria's elite legal practitioners.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <a 
                href="#exclusivity"
                className="w-full md:w-auto px-10 py-5 bg-[#F27D26] text-white rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                Request Access <ChevronRight className="w-5 h-5" />
              </a>
              <p className="text-sm opacity-40 font-mono uppercase tracking-widest">
                Limited to 100 Founding Members
              </p>
            </div>
          </motion.div>
        </div>

        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F27D26]/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      </section>

      {/* The Pain Section */}
      <section id="pain" className="py-32 px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-bold tracking-tight mb-8">
                The Cost of <br />
                <span className="italic font-serif text-[#F27D26]">Traditional Research</span>
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 shrink-0 bg-white/5 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 opacity-60" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Hours Wasted</h3>
                    <p className="opacity-50 leading-relaxed">Manually flipping through Law Reports while your opposing counsel is already drafting their closing argument.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 shrink-0 bg-white/5 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 opacity-60" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Human Error</h3>
                    <p className="opacity-50 leading-relaxed">Missing a critical Supreme Court precedent because it was buried in a 200-page judgment.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 shrink-0 bg-white/5 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 opacity-60" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Slow Turnaround</h3>
                    <p className="opacity-50 leading-relaxed">Clients expect answers in minutes, not days. Don't let your research methods hold your firm back.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#141414] to-black rounded-[2rem] border border-white/10 p-8 flex flex-col justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-[#F27D26]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="space-y-4 relative z-10">
                  <div className="h-2 w-32 bg-white/10 rounded-full" />
                  <div className="h-2 w-48 bg-white/10 rounded-full" />
                  <div className="h-2 w-24 bg-white/10 rounded-full" />
                  <div className="py-8">
                    <p className="text-3xl font-mono text-[#F27D26] animate-pulse">ANALYZING 50,000+ CASES...</p>
                  </div>
                  <div className="h-2 w-40 bg-white/10 rounded-full" />
                  <div className="h-2 w-56 bg-white/10 rounded-full" />
                </div>
                <div className="absolute bottom-8 right-8">
                  <Scale className="w-24 h-24 opacity-5 rotate-12" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section id="solution" className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-6xl font-black tracking-tighter uppercase mb-6">Autonomous Intelligence</h2>
          <p className="opacity-50 max-w-xl mx-auto">We didn't build a search engine. We built an AI associate that knows every Nigerian case ever decided.</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Instant Precedent",
              desc: "Find the exact Supreme Court ruling you need in 0.4 seconds.",
              icon: Zap
            },
            {
              title: "Brief Synthesis",
              desc: "Upload your facts, get a fully drafted legal brief in minutes.",
              icon: FileText
            },
            {
              title: "Outcome Prediction",
              desc: "Know your win probability before you even step into court.",
              icon: Shield
            }
          ].map((feature, i) => (
            <div key={i} className="p-10 bg-white/5 border border-white/10 rounded-[2rem] hover:border-[#F27D26]/50 transition-all group">
              <feature.icon className="w-12 h-12 text-[#F27D26] mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="opacity-50 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Exclusivity / Waitlist Section */}
      <section id="exclusivity" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#141414] to-black border border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative z-10">
          <Lock className="w-16 h-16 text-[#F27D26] mx-auto mb-8" />
          <h2 className="text-5xl font-bold tracking-tight mb-6">The Velvet Rope</h2>
          <p className="text-xl opacity-60 mb-12">
            To maintain the highest quality of service and computational priority, we are only accepting <span className="text-white font-bold">100 Founding Members</span> for our private beta.
          </p>
          
          {submitted ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-12 bg-white/5 border border-[#F27D26]/30 rounded-[2.5rem] space-y-8"
            >
              <div className="flex justify-center">
                <div className="p-4 bg-[#F27D26]/20 rounded-full">
                  <Shield className="w-12 h-12 text-[#F27D26]" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black tracking-tighter text-white uppercase">Access Granted</h3>
                <p className="text-sm font-mono uppercase tracking-[0.2em] text-[#F27D26] italic">Founding Member Verified</p>
              </div>
              <p className="opacity-60 max-w-sm mx-auto leading-relaxed">
                Welcome to the inner circle. Your professional identity has been verified. You now have priority access to the CaseFlow AI engine.
              </p>
              <Link 
                to="/login"
                className="inline-flex items-center gap-3 px-12 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-[#F27D26] hover:text-white transition-all shadow-2xl"
              >
                Enter Portal <ArrowRight className="w-6 h-6" />
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                required
                placeholder="Professional Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-[#F27D26] transition-colors"
              />
              <button 
                type="submit"
                disabled={loading}
                className="px-10 py-4 bg-white text-black rounded-full font-bold hover:bg-[#F27D26] hover:text-white transition-all whitespace-nowrap disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Request Access'}
              </button>
            </form>
          )}
          
          <div className="mt-12 flex items-center justify-center gap-8 opacity-40 text-xs font-mono uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              84/100 Spots Filled
            </div>
            <div>
              Waitlist: 1,240+
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial-gradient from-[#F27D26]/5 to-transparent opacity-50" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Scale className="w-6 h-6 opacity-40" />
            <span className="font-bold tracking-tighter text-xl opacity-40">CASEFLOW.AI</span>
          </div>
          <p className="text-xs opacity-30 uppercase tracking-[0.3em] mb-4">© 2026 MAVERA TECHNOLOGIES. ALL RIGHTS RESERVED.</p>
          <div className="flex justify-center gap-8 text-[10px] font-bold uppercase tracking-widest opacity-30">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FileText(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}
