import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Scale, Zap, Shield, BrainCircuit, TrendingUp, Users, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function DemoPitch() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#E4E3E0] font-sans selection:bg-[#E4E3E0] selection:text-[#050505] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full p-6 flex items-center justify-between z-50 mix-blend-difference">
        <div className="flex items-center gap-3">
          <Scale className="w-8 h-8" />
          <span className="font-bold tracking-tighter text-2xl">CASEFLOW</span>
        </div>
        <Link 
          to="/login" 
          className="px-6 py-2 bg-[#E4E3E0] text-[#050505] rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform"
        >
          Launch Platform
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1a1a1a_0%,_#050505_100%)] opacity-50"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 space-y-8 max-w-5xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E4E3E0]/20 bg-[#E4E3E0]/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-widest opacity-80">Live Demo Environment</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
            The Future of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E4E3E0] to-[#E4E3E0]/40">
              Nigerian Law.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl font-medium opacity-60 max-w-2xl mx-auto leading-relaxed">
            Caseflow AI is an autonomous legal intelligence platform designed to reduce research time by 80% and predict case outcomes with unprecedented accuracy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-[#E4E3E0] text-[#050505] rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-105 transition-transform"
            >
              Experience the Platform <ChevronRight className="w-5 h-5" />
            </Link>
            <a 
              href="#features"
              className="w-full sm:w-auto px-8 py-4 border border-[#E4E3E0]/20 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#E4E3E0]/5 transition-colors"
            >
              Explore Capabilities
            </a>
          </div>
        </motion.div>
      </section>

      {/* Stats Section for Investors */}
      <section className="py-20 border-y border-[#E4E3E0]/10 bg-[#E4E3E0]/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <div className="space-y-2">
            <h3 className="text-5xl font-black">10k+</h3>
            <p className="text-xs font-mono uppercase tracking-widest opacity-50">Precedents Indexed</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-5xl font-black">80%</h3>
            <p className="text-xs font-mono uppercase tracking-widest opacity-50">Time Saved</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-5xl font-black">92%</h3>
            <p className="text-xs font-mono uppercase tracking-widest opacity-50">Prediction Accuracy</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-5xl font-black">SOC2</h3>
            <p className="text-xs font-mono uppercase tracking-widest opacity-50">Security Compliant</p>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="py-32 max-w-7xl mx-auto px-6 space-y-32">
        {/* Feature 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#E4E3E0]/10 flex items-center justify-center">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter">Autonomous Legal Reasoning</h2>
            <p className="text-lg opacity-60 leading-relaxed">
              Our proprietary engine doesn't just search; it understands. It applies the IRAC (Issue, Rule, Application, Conclusion) methodology to user queries, instantly synthesizing complex Nigerian jurisprudence into actionable insights.
            </p>
            <ul className="space-y-3 pt-4">
              {['Semantic search across Supreme Court cases', 'Automated citation intelligence (Followed/Overruled)', 'Instant statutory retrieval'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 opacity-80">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="aspect-square rounded-[2rem] border border-[#E4E3E0]/10 bg-gradient-to-br from-[#1a1a1a] to-[#050505] p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="h-full w-full border border-[#E4E3E0]/20 rounded-xl bg-[#050505] p-6 shadow-2xl flex flex-col gap-4">
              <div className="w-3/4 h-4 bg-[#E4E3E0]/10 rounded animate-pulse"></div>
              <div className="w-full h-24 bg-[#E4E3E0]/5 rounded mt-4"></div>
              <div className="w-5/6 h-4 bg-[#E4E3E0]/10 rounded mt-auto"></div>
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center md:flex-row-reverse">
          <div className="order-2 md:order-1 aspect-square rounded-[2rem] border border-[#E4E3E0]/10 bg-gradient-to-bl from-[#1a1a1a] to-[#050505] p-8 relative overflow-hidden">
             <div className="h-full w-full border border-[#E4E3E0]/20 rounded-xl bg-[#050505] p-6 shadow-2xl flex flex-col items-center justify-center gap-6">
              <div className="text-6xl font-black">85%</div>
              <div className="text-xs font-mono uppercase tracking-widest opacity-50">Win Probability</div>
              <div className="w-full h-1 bg-[#E4E3E0]/20 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-emerald-500"></div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#E4E3E0]/10 flex items-center justify-center">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter">Predictive Outcome Modeling</h2>
            <p className="text-lg opacity-60 leading-relaxed">
              Show investors how we mitigate litigation risk. By analyzing historical case data and fact patterns, Caseflow AI provides a probabilistic assessment of case outcomes, identifying key risk factors and controlling precedents before you ever step into a courtroom.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 border-t border-[#E4E3E0]/10 text-center px-6">
        <h2 className="text-5xl font-black tracking-tighter mb-6">Ready to see it in action?</h2>
        <p className="text-xl opacity-60 mb-10 max-w-2xl mx-auto">
          The platform is live. No mockups, no smoke and mirrors. Experience the full power of Caseflow AI.
        </p>
        <Link 
          to="/login"
          className="inline-flex px-10 py-5 bg-[#E4E3E0] text-[#050505] rounded-2xl font-black text-lg hover:scale-105 transition-transform"
        >
          Enter the Platform
        </Link>
      </section>
    </div>
  );
}
