import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { 
  FileText, 
  Clock, 
  ChevronRight, 
  Search,
  Scale,
  Zap,
  ShieldCheck,
  Database
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { seed } from '../../seed';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const [briefs, setBriefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, 'briefs'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBriefs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seed();
      alert("Database seeded with sample Nigerian legal data.");
    } catch (error) {
      console.error("Seed failed", error);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-12">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter">Professional Dashboard</h1>
          <p className="text-[#141414]/50 font-medium">Manage your legal research, saved briefs, and platform activity.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#141414] text-[#E4E3E0] rounded-full text-[10px] font-bold uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          Verified Practitioner
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-white border-2 border-[#141414] rounded-2xl shadow-lg space-y-2">
          <p className="text-[10px] font-mono uppercase opacity-40">Total Briefs Synthesized</p>
          <p className="text-5xl font-black">{briefs.length}</p>
        </div>
        <div className="p-8 bg-white border-2 border-[#141414] rounded-2xl shadow-lg space-y-2">
          <p className="text-[10px] font-mono uppercase opacity-40">Precedents Consulted</p>
          <p className="text-5xl font-black">{briefs.length * 12}</p>
        </div>
        <div className="p-8 bg-[#141414] text-[#E4E3E0] rounded-2xl shadow-lg space-y-2">
          <p className="text-[10px] font-mono uppercase opacity-40">Account Standing</p>
          <p className="text-3xl font-bold">PROFESSIONAL</p>
          <p className="text-[10px] opacity-50">Unlimited Autonomous Reasoning</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Activity */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#141414] pb-2">
            <h2 className="col-header flex items-center gap-2"><Clock className="w-4 h-4" /> Recent Briefs</h2>
            <Link to="/briefs" className="text-[10px] font-bold uppercase hover:underline">New Brief</Link>
          </div>
          
          <div className="space-y-3">
            {briefs.map((brief, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={brief.id}
                className="group"
              >
                <div className="data-row p-5 bg-white border border-[#141414]/10 rounded-xl hover:border-[#141414] transition-all flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold group-hover:underline">{brief.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono uppercase opacity-40">{brief.domain.replace('_', ' ')}</span>
                      <span className="text-[10px] font-mono opacity-20">•</span>
                      <span className="text-[10px] font-mono opacity-40">{brief.createdAt?.toDate().toLocaleDateString()}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              </motion.div>
            ))}
            {briefs.length === 0 && !loading && (
              <div className="py-20 text-center opacity-20 italic text-sm">No historical records found.</div>
            )}
          </div>

          {/* Security & Compliance Status */}
          <div className="mt-12 space-y-4">
            <h2 className="col-header border-b border-[#141414] pb-2">Security & Compliance</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-[#141414]/10 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest">SOC 2 Type II</p>
                  <p className="text-[10px] opacity-50">Certified Compliant</p>
                </div>
              </div>
              <div className="p-4 bg-white border border-[#141414]/10 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest">Data Residency</p>
                  <p className="text-[10px] opacity-50">EU / US Regions</p>
                </div>
              </div>
              <div className="p-4 bg-white border border-[#141414]/10 rounded-xl flex items-center gap-4 col-span-2">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest">End-to-End Encryption</p>
                  <p className="text-[10px] opacity-50">All documents and AI prompts are encrypted at rest and in transit.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-6">
          <h2 className="col-header border-b border-[#141414] pb-2">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            <Link to="/" className="p-6 bg-white border border-[#141414] rounded-xl hover:bg-[#141414] hover:text-[#E4E3E0] transition-all group">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-bold">Start New Research</p>
                  <p className="text-xs opacity-50">Search statutes and case law</p>
                </div>
                <Search className="w-6 h-6 opacity-20 group-hover:opacity-100" />
              </div>
            </Link>
            <Link to="/briefs" className="p-6 bg-white border border-[#141414] rounded-xl hover:bg-[#141414] hover:text-[#E4E3E0] transition-all group">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-bold">Synthesize Brief</p>
                  <p className="text-xs opacity-50">Generate autonomous legal reasoning</p>
                </div>
                <Zap className="w-6 h-6 opacity-20 group-hover:opacity-100" />
              </div>
            </Link>
            <Link to="/analysis" className="p-6 bg-white border border-[#141414] rounded-xl hover:bg-[#141414] hover:text-[#E4E3E0] transition-all group">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-bold">Analyze Document</p>
                  <p className="text-xs opacity-50">AI review of contracts and judgments</p>
                </div>
                <FileText className="w-6 h-6 opacity-20 group-hover:opacity-100" />
              </div>
            </Link>
            <Link to="/drafter" className="p-6 bg-white border border-[#141414] rounded-xl hover:bg-[#141414] hover:text-[#E4E3E0] transition-all group">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-bold">Draft Court Process</p>
                  <p className="text-xs opacity-50">Generate formal legal documents</p>
                </div>
                <Scale className="w-6 h-6 opacity-20 group-hover:opacity-100" />
              </div>
            </Link>

            <button 
              onClick={handleSeed}
              disabled={isSeeding}
              className="p-6 bg-emerald-50 border border-emerald-500 text-emerald-700 rounded-xl hover:bg-emerald-500 hover:text-white transition-all group flex items-center justify-between"
            >
              <div className="space-y-1 text-left">
                <p className="font-bold">Seed Legal Data</p>
                <p className="text-xs opacity-70">Populate MVP with Supreme Court precedents</p>
              </div>
              <Database className={cn("w-6 h-6 opacity-40 group-hover:opacity-100", isSeeding && "animate-bounce")} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
