import React, { useState, useEffect } from 'react';
import { Statute } from '../services/legalService';
import { fetchRealStatuteData } from '../services/geminiService';
import { Book, Search, ChevronRight, Scale, Loader2, Sparkles, FolderOpen, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { statuteStructures } from '../data/statuteStructures';
import { DemoPaywall } from '../components/DemoPaywall';

export default function StatuteViewer() {
  const [actName, setActName] = useState('1999 Constitution');
  const [searchQuery, setSearchQuery] = useState('');
  const [statutes, setStatutes] = useState<Statute[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPart, setSelectedPart] = useState<{chapter: string, part: string, title: string, sections: string} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const acts = [
    '1999 Constitution',
    'Evidence Act',
    'Electoral Act',
    'Labour Act',
    'ACJA',
    'Companies and Allied Matters Act (CAMA)',
    'Cybercrimes Act'
  ];

  const loadStatutes = async (query?: string, specificPart?: string) => {
    setLoading(true);
    setStatutes([]);
    setError(null);
    try {
      const promptQuery = specificPart 
        ? `Fetch the exact text for ${specificPart} of the ${actName}.` 
        : query;
      const results = await fetchRealStatuteData(actName, promptQuery);
      setStatutes(results);
    } catch (error: any) {
      console.error("Failed to load statutes", error);
      setError(error.message || "An unexpected error occurred while fetching statutes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setStatutes([]);
    setSelectedPart(null);
    setError(null);
  }, [actName]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedPart(null);
    loadStatutes(searchQuery);
  };

  const handlePartClick = (chapter: any, part: any) => {
    setSelectedPart({ chapter: chapter.chapter, part: part.part, title: part.title, sections: part.sections });
    loadStatutes(undefined, `${chapter.chapter}, ${part.part} (${part.title}) - Sections ${part.sections}`);
  };

  const currentStructure = statuteStructures[actName] || [];

  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tighter">Statutory Framework</h1>
        <p className="text-[#141414]/50 font-medium">Browse and search the real Laws of the Federation of Nigeria, powered by AI retrieval.</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {acts.map(act => (
          <button
            key={act}
            onClick={() => {
              setActName(act);
              setSearchQuery('');
            }}
            className={`px-6 py-3 rounded-xl border-2 border-[#141414] text-sm font-bold transition-all whitespace-nowrap ${
              actName === act ? 'bg-[#141414] text-[#E4E3E0] shadow-lg scale-[1.02]' : 'bg-white hover:bg-[#141414]/5'
            }`}
          >
            {act}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-[#141414]/40 group-focus-within:text-[#141414] transition-colors" />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search within ${actName} (e.g., "Section 36", "Right to life", "Bail conditions")...`}
          className="w-full bg-white border-2 border-[#141414]/20 rounded-2xl py-5 pl-14 pr-32 text-lg font-medium focus:outline-none focus:border-[#141414] focus:ring-4 focus:ring-[#141414]/5 transition-all shadow-sm"
        />
        <button 
          type="submit"
          disabled={loading || !searchQuery.trim()}
          className="absolute inset-y-2 right-2 bg-[#141414] text-[#E4E3E0] px-6 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Retrieve
        </button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar for Structure */}
        {!searchQuery && currentStructure.length > 0 && (
          <div className="lg:col-span-1 space-y-4">
            <h2 className="col-header border-b border-[#141414] pb-2">{actName} Structure</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {currentStructure.map((chapter, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2 text-[#141414] font-bold text-sm bg-[#f8f8f8] p-3 rounded-xl">
                    <FolderOpen className="w-4 h-4 opacity-50" />
                    <span>{chapter.chapter}: {chapter.title}</span>
                  </div>
                  <div className="pl-4 space-y-1">
                    {chapter.parts.map((part: any, pIdx: number) => (
                      <button
                        key={pIdx}
                        onClick={() => handlePartClick(chapter, part)}
                        className={`w-full text-left flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors ${
                          selectedPart?.part === part.part && selectedPart?.chapter === chapter.chapter
                            ? 'bg-[#141414] text-[#E4E3E0]'
                            : 'hover:bg-[#141414]/5 text-[#141414]/70'
                        }`}
                      >
                        <FileText className="w-3 h-3 opacity-50" />
                        <span className="truncate">{part.part}: {part.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className={`grid grid-cols-1 gap-4 ${!searchQuery && currentStructure.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="flex items-center justify-between border-b border-[#141414] pb-2">
            <h2 className="col-header">
              {actName} - {searchQuery ? 'Search Results' : selectedPart ? `${selectedPart.chapter}, ${selectedPart.part}` : 'Foundational Sections'}
            </h2>
            <span className="text-[10px] font-mono uppercase opacity-50">{statutes.length} Sections Retrieved</span>
          </div>

          <AnimatePresence mode="wait">
            {error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-6 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-start gap-4"
              >
                <Scale className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg">Retrieval Error</h3>
                  <p className="text-sm opacity-80 mt-1">{error}</p>
                </div>
              </motion.div>
            ) : loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-32 flex flex-col items-center justify-center space-y-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-[#141414] rounded-full blur-xl opacity-20 animate-pulse"></div>
                  <Loader2 className="w-10 h-10 animate-spin text-[#141414] relative z-10" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-bold text-lg tracking-tight">Retrieving Real Statutes</p>
                  <p className="text-xs font-mono uppercase opacity-40">Accessing Nigerian legal databases via AI...</p>
                </div>
              </motion.div>
            ) : statutes.length > 0 ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 gap-4 relative"
              >
                {statutes.slice(0, 1).map((s, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    key={s.id || idx}
                    className="p-8 bg-white border border-[#141414] rounded-2xl shadow-sm hover:shadow-xl transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-[#141414] text-[#E4E3E0] text-[10px] font-bold rounded">SECTION {s.section}</span>
                          <h3 className="text-xl font-black tracking-tight">{s.title}</h3>
                        </div>
                        {s.subsection && <p className="text-xs font-mono opacity-40 uppercase">Subsection {s.subsection}</p>}
                      </div>
                      <Book className="w-5 h-5 opacity-10 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-[#141414]/80 leading-relaxed font-medium whitespace-pre-wrap">{s.content}</p>
                    
                    <div className="mt-6 pt-6 border-t border-[#141414]/5 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase opacity-40">{s.legalDomain?.replace('_', ' ') || 'Statutory Law'}</span>
                      <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:underline">
                        View Interpretation Cases <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
                <DemoPaywall feature="Statute Library" />
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 text-center space-y-4 opacity-40"
              >
                <Scale className="w-16 h-16 mx-auto" />
                <p className="text-xl font-bold italic">
                  {actName === '1999 Constitution' && !searchQuery && !selectedPart 
                    ? "Select a Chapter/Part from the sidebar to view sections." 
                    : "No sections found. Try a different search query."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
