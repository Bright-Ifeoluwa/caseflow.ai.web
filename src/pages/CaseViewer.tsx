import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LegalService, LegalCase } from '../services/legalService';
import { 
  Gavel, 
  Calendar, 
  MapPin, 
  User, 
  ArrowLeft, 
  Share2, 
  Bookmark,
  ChevronRight,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { DemoPaywall } from '../components/DemoPaywall';

export default function CaseViewer() {
  const { id } = useParams<{ id: string }>();
  const [legalCase, setLegalCase] = useState<LegalCase | null>(null);
  const [citator, setCitator] = useState<{ citedBy: LegalCase[], cites: LegalCase[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setLoading(true);
      try {
        const c = await LegalService.getCaseById(id);
        setLegalCase(c);
        const cit = await LegalService.getCitatorData(id);
        if (cit) setCitator({ citedBy: cit.citedBy as LegalCase[], cites: cit.cites as LegalCase[] });
      } catch (error) {
        console.error("Failed to load case", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <div className="p-20 text-center animate-pulse font-mono uppercase tracking-widest">Retrieving Judgment...</div>;
  if (!legalCase) return <div className="p-20 text-center">Case not found.</div>;

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <header className="p-8 border-b border-[#141414] bg-[#E4E3E0]">
        <div className="max-w-5xl mx-auto space-y-6">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:underline">
            <ArrowLeft className="w-3 h-3" /> Back to Search
          </Link>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${
                legalCase.citatorStatus === 'overruled' ? 'border-red-500 text-red-500 bg-red-50' : 
                legalCase.citatorStatus === 'followed' ? 'border-emerald-500 text-emerald-500 bg-emerald-50' : 
                'border-blue-500 text-blue-500 bg-blue-50'
              }`}>
                {legalCase.citatorStatus}
              </span>
              <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest">{legalCase.citation}</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter leading-tight">{legalCase.caseName}</h1>
          </div>

          <div className="flex flex-wrap gap-8 pt-4">
            <div className="flex items-center gap-2">
              <Gavel className="w-4 h-4 opacity-40" />
              <div>
                <p className="text-[10px] font-mono uppercase opacity-40">Court</p>
                <p className="text-sm font-bold">{legalCase.court}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 opacity-40" />
              <div>
                <p className="text-[10px] font-mono uppercase opacity-40">Year</p>
                <p className="text-sm font-bold">{legalCase.year}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 opacity-40" />
              <div>
                <p className="text-[10px] font-mono uppercase opacity-40">Presiding Judge</p>
                <p className="text-sm font-bold">{legalCase.judge}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Text */}
        <div className="flex-1 overflow-y-auto p-12 border-r border-[#141414]">
          <div className="max-w-3xl mx-auto space-y-12">
            <section className="space-y-4">
              <h2 className="col-header">Judgment Summary</h2>
              <p className="text-lg leading-relaxed font-medium text-[#141414]/80">{legalCase.summary}</p>
            </section>

            <section className="space-y-4">
              <h2 className="col-header">Full Text</h2>
              <div className="prose prose-lg max-w-none font-serif leading-loose whitespace-pre-wrap relative overflow-hidden">
                {legalCase.fullText.substring(0, 800)}...
                <DemoPaywall feature="Full Case Text" />
              </div>
            </section>
          </div>
        </div>

        {/* Citator Sidebar */}
        <aside className="w-96 overflow-y-auto bg-[#f8f8f8] p-8 space-y-10">
          <section className="space-y-4">
            <h3 className="col-header flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Cited By ({citator?.citedBy.length || 0})
            </h3>
            <div className="space-y-3">
              {citator?.citedBy.map(c => (
                <Link key={c.id} to={`/cases/${c.id}`} className="block p-4 bg-white border border-[#141414]/10 rounded-lg hover:border-[#141414] transition-all group">
                  <p className="text-xs font-bold group-hover:underline">{c.caseName}</p>
                  <p className="text-[10px] opacity-40 font-mono mt-1">{c.year} • {c.court}</p>
                </Link>
              ))}
              {citator?.citedBy.length === 0 && <p className="text-xs opacity-40 italic">No citations found.</p>}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="col-header flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Cites ({citator?.cites.length || 0})
            </h3>
            <div className="space-y-3">
              {citator?.cites.map(c => (
                <Link key={c.id} to={`/cases/${c.id}`} className="block p-4 bg-white border border-[#141414]/10 rounded-lg hover:border-[#141414] transition-all group">
                  <p className="text-xs font-bold group-hover:underline">{c.caseName}</p>
                  <p className="text-[10px] opacity-40 font-mono mt-1">{c.year} • {c.court}</p>
                </Link>
              ))}
              {citator?.cites.length === 0 && <p className="text-xs opacity-40 italic">No references found.</p>}
            </div>
          </section>

          <div className="pt-8 border-t border-[#141414]/10">
            <div className="p-4 bg-[#141414] text-[#E4E3E0] rounded-xl space-y-2">
              <p className="text-[10px] font-mono uppercase opacity-50">Authority Score</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black">{legalCase.authorityWeight}</span>
                <span className="text-xs opacity-50 pb-1">/ 10</span>
              </div>
              <p className="text-[10px] leading-tight opacity-70">Based on court level and citation frequency in the Nigerian Legal Knowledge Graph.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
