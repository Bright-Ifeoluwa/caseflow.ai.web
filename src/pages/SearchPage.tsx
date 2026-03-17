import React, { useState } from 'react';
import { Search, Filter, Gavel, ChevronRight, Scale, ShieldCheck, Zap, ExternalLink, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LegalService, LegalCase } from '../services/legalService';
import { semanticLegalSearch } from '../services/geminiService';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { DemoPaywall } from '../components/DemoPaywall';
import { useUsageLimit } from '../hooks/useUsageLimit';
import UsageLimitBanner from '../components/UsageLimitBanner';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LegalCase[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [domain, setDomain] = useState<string>('');
  const [useAI, setUseAI] = useState(true);
  const [aiResult, setAiResult] = useState<{ text: string, sources: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isLimitReached, incrementUsage } = useUsageLimit();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;
    
    // Only limit AI search
    if (useAI && isLimitReached) return;

    setIsSearching(true);
    setAiResult(null);
    setResults([]);
    setError(null);
    try {
      if (useAI) {
        // DEMO MODE: Hardcoded AI Response
        await new Promise(resolve => setTimeout(resolve, 1500));
        const aiResponse = {
          text: "**Legal Analysis (Demo Mode)**\n\nBased on the query provided, the Nigerian Supreme Court has established clear precedents. In *Adegoke Motors Ltd. v. Adesanya* [1989] 3 NWLR (Pt.109) 250, the court emphasized that rules of court are meant to be obeyed. However, non-compliance may be treated as a mere irregularity depending on the circumstances, as seen in *Nneji v. Chukwu* [1988] 3 NWLR (Pt.81) 184.\n\n**Key Principles:**\n1. Substantial justice over technicalities.\n2. The court's inherent jurisdiction to cure procedural defects.\n3. The distinction between a fundamental vice and a mere irregularity.",
          sources: [
            { title: "Adegoke Motors Ltd. v. Adesanya [1989]", uri: "#" },
            { title: "Nneji v. Chukwu [1988]", uri: "#" }
          ]
        };
        setAiResult(aiResponse);
        await incrementUsage();
      } else {
        const searchResults = await LegalService.searchCases(query, domain || undefined);
        setResults(searchResults);
      }
    } catch (error: any) {
      console.error("Search failed", error);
      setError(error.message || "An unexpected error occurred during search.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter">Legal Research Engine</h1>
        <p className="text-[#141414]/50 font-medium">Search across Nigerian Supreme Court and Court of Appeal judgments.</p>
      </div>

      <UsageLimitBanner />

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 opacity-30" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={useAI ? "Ask a legal question in plain English..." : "Enter legal principles, case names, or citations..."}
            className="w-full bg-white border-2 border-[#141414] rounded-2xl py-5 pl-14 pr-32 focus:outline-none focus:ring-4 focus:ring-[#141414]/5 text-xl font-medium shadow-sm transition-all"
          />
          <button 
            type="submit"
            disabled={isSearching || (useAI && isLimitReached)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#141414] text-[#E4E3E0] px-8 py-3 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg flex items-center gap-2"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : (useAI ? <Zap className="w-4 h-4" /> : null)}
            {isSearching ? 'SEARCHING...' : (useAI && isLimitReached) ? 'LIMIT REACHED' : 'SEARCH'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {['Constitutional', 'Criminal', 'Civil', 'Labour', 'Electoral', 'Administrative'].map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setDomain(domain === d.toLowerCase() + '_law' ? '' : d.toLowerCase() + '_law')}
                disabled={useAI}
                className={`px-4 py-2 rounded-full border border-[#141414] text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  domain === d.toLowerCase() + '_law' ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-[#141414]/5'
                } ${useAI ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                {d} Law
              </button>
            ))}
          </div>
          
          <button
            type="button"
            onClick={() => setUseAI(!useAI)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
              useAI 
                ? 'border-[#141414] bg-[#141414] text-[#E4E3E0]' 
                : 'border-[#141414]/20 hover:border-[#141414]'
            }`}
          >
            <Zap className={`w-4 h-4 ${useAI ? 'text-yellow-400' : 'opacity-50'}`} />
            AI Semantic Search
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {error ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-start gap-4"
          >
            <ShieldCheck className="w-6 h-6 text-red-500 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg">Search Error</h3>
              <p className="text-sm opacity-80 mt-1">{error}</p>
            </div>
          </motion.div>
        ) : aiResult ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-[#141414] rounded-2xl p-8 shadow-xl space-y-6 relative overflow-hidden"
          >
            <div className="flex items-center gap-2 border-b border-[#141414]/10 pb-4">
              <Zap className="w-5 h-5" />
              <h2 className="text-lg font-bold uppercase tracking-widest">AI Legal Analysis</h2>
            </div>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{aiResult.text.split('\n\n')[0]}</ReactMarkdown>
            </div>
            <DemoPaywall feature="Legal Analysis" />
          </motion.div>
        ) : results.length > 0 ? (
          <>
            <div className="flex items-center justify-between border-b border-[#141414] pb-2">
              <h2 className="col-header">Search Results {results.length > 0 && `(${results.length})`}</h2>
              <div className="flex items-center gap-4 text-[10px] font-mono uppercase opacity-50">
                <span>Authority Weight</span>
                <span>Citator Status</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 relative">
              {results.slice(0, 1).map((item, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={item.id}
                >
                  <Link 
                    to={`/cases/${item.id}`}
                    className="data-row flex items-center justify-between p-6 bg-white border border-[#141414] rounded-xl hover:shadow-xl transition-all group"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold group-hover:underline decoration-2 underline-offset-4">{item.caseName}</h3>
                        <span className="text-[10px] font-mono bg-[#141414]/5 px-2 py-0.5 rounded uppercase">{item.court}</span>
                      </div>
                      <p className="text-sm opacity-60 font-medium italic">{item.citation}</p>
                      <p className="text-xs line-clamp-2 opacity-80 max-w-2xl leading-relaxed">{item.summary}</p>
                    </div>
                    
                    <div className="flex items-center gap-8 pl-8">
                      <div className="text-center">
                        <p className="text-[10px] font-mono opacity-40 uppercase">Weight</p>
                        <p className="font-bold text-xl">{item.authorityWeight}</p>
                      </div>
                      <div className="text-center w-24">
                        <p className="text-[10px] font-mono opacity-40 uppercase">Status</p>
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${
                          item.citatorStatus === 'overruled' ? 'border-red-500 text-red-500 bg-red-50' : 
                          item.citatorStatus === 'followed' ? 'border-emerald-500 text-emerald-500 bg-emerald-50' : 
                          'border-blue-500 text-blue-500 bg-blue-50'
                        }`}>
                          {item.citatorStatus}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                    </div>
                  </Link>
                </motion.div>
              ))}
              <DemoPaywall feature="Case Search" />
            </div>
          </>
        ) : !isSearching && (
          <div className="py-20 text-center space-y-4 opacity-20">
            <Scale className="w-16 h-16 mx-auto" />
            <p className="text-xl font-bold italic">Awaiting Legal Inquiry...</p>
          </div>
        )}
      </div>
    </div>
  );
}
