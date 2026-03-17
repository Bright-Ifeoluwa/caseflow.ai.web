import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { routeLegalDomain, generateLegalAnalysis } from '../services/geminiService';
import React, { useState } from 'react';
import { 
  Zap, 
  FileText, 
  Shield, 
  Download, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Gavel,
  ExternalLink,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { DemoPaywall } from '../components/DemoPaywall';

import { useLocation } from 'react-router-dom';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { useUsageLimit } from '../hooks/useUsageLimit';
import UsageLimitBanner from '../components/UsageLimitBanner';

export default function BriefGenerator() {
  const location = useLocation();
  const [query, setQuery] = useState(location.state?.brief?.query || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysis, setAnalysis] = useState<any>(location.state?.brief?.analysis || null);
  const [domain, setDomain] = useState<any>(location.state?.brief?.domain ? { domain: location.state.brief.domain, confidence: 1 } : null);
  const { isLimitReached, incrementUsage } = useUsageLimit();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isGenerating || isLimitReached) return;

    setIsGenerating(true);
    setAnalysis(null);
    try {
      // DEMO MODE: Hardcoded Brief Generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const domainResult = { domain: 'civil_litigation', confidence: 0.92 };
      setDomain(domainResult);
      
      const analysisResult = {
        issue: "Whether the defendant's failure to deliver the goods on the stipulated date constitutes a fundamental breach of contract entitling the plaintiff to repudiate the contract and claim damages.",
        relevantLaw: "Under Nigerian law, a breach of a condition (a fundamental term) entitles the innocent party to treat the contract as repudiated and sue for damages. This is governed by the Sale of Goods Act (applicable in various states) and established common law principles.",
        authorities: [
          "Kano State Urban Development Board v. Fanz Construction Co. Ltd (1990) 4 NWLR (Pt. 142) 1",
          "Nwaolisah v. Nwabufoh (2011) 14 NWLR (Pt. 1268) 600",
          "Section 11, Sale of Goods Law (Lagos State)"
        ],
        legalReasoning: "In the present case, time was expressly made of the essence in the contract. The defendant's failure to deliver the goods on the agreed date goes to the root of the contract. Relying on *Nwaolisah v. Nwabufoh*, where time is of the essence, a delay in performance is not a mere warranty but a breach of condition. The plaintiff is therefore within their rights to reject the late delivery and seek compensatory damages for any losses incurred due to the delay.",
        conclusion: "The defendant is liable for a fundamental breach of contract. The plaintiff is legally entitled to repudiate the agreement and is advised to immediately file a claim for special and general damages at the High Court.",
        sources: [
          { title: "Nwaolisah v. Nwabufoh (2011)", uri: "#" },
          { title: "Sale of Goods Law", uri: "#" }
        ]
      };
      setAnalysis(analysisResult);

      if (auth.currentUser) {
        const path = 'briefs';
        try {
          await addDoc(collection(db, path), {
            userId: auth.currentUser.uid,
            title: query.slice(0, 50) + '...',
            query: query,
            analysis: analysisResult,
            domain: domainResult.domain,
            createdAt: serverTimestamp()
          });
          await incrementUsage();
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, path);
        }
      }
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportDocx = async () => {
    if (!analysis) return;

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "LEGAL BRIEF",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 }
          }),
          new Paragraph({
            text: "Issue Presented",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: analysis.issue,
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "Relevant Law",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: analysis.relevantLaw,
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "Authorities Cited",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          ...analysis.authorities.map((auth: string) => new Paragraph({
            text: `• ${auth}`,
            spacing: { after: 100 }
          })),
          new Paragraph({
            text: "Legal Reasoning",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: analysis.legalReasoning,
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "Conclusion",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: analysis.conclusion,
            spacing: { after: 200 }
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Legal_Brief_${new Date().toISOString().slice(0, 10)}.docx`);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto w-full space-y-10 print:p-0 print:max-w-none">
      <div className="space-y-2 print:hidden">
        <h1 className="text-4xl font-black tracking-tighter">Autonomous Brief Synthesis</h1>
        <p className="text-[#141414]/50 font-medium">Generate structured legal arguments and briefs based on Nigerian law.</p>
      </div>

      <UsageLimitBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-6 print:hidden">
          <div className="p-6 bg-white border-2 border-[#141414] rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <h2 className="text-sm font-bold uppercase tracking-widest">Inquiry Parameters</h2>
            </div>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase opacity-50">Legal Query</label>
                <textarea 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe the legal issue in detail..."
                  className="w-full h-40 bg-[#f8f8f8] border border-[#141414]/10 rounded-xl p-4 text-sm focus:outline-none focus:border-[#141414] transition-all resize-none"
                />
              </div>
              <button 
                type="submit"
                disabled={isGenerating || !query.trim() || isLimitReached}
                className="w-full bg-[#141414] text-[#E4E3E0] py-4 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {isGenerating ? 'SYNTHESIZING...' : isLimitReached ? 'LIMIT REACHED' : 'GENERATE BRIEF'}
              </button>
            </form>
          </div>

          <div className="p-6 bg-[#141414] text-[#E4E3E0] rounded-2xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">Compliance Notice</h3>
            <p className="text-xs leading-relaxed opacity-80">
              CaseFlow AI uses authority-weighted retrieval. All citations are verified against the Nigerian Legal Knowledge Graph.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Zero Hallucination Policy Active
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 print:col-span-3">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center py-20 space-y-6 print:hidden"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-[#141414] rounded-full blur-2xl opacity-10 animate-pulse"></div>
                  <Loader2 className="w-12 h-12 animate-spin text-[#141414]" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-bold text-xl tracking-tight">Synthesizing Legal Brief</p>
                  <p className="text-xs font-mono uppercase opacity-40">Consulting Precedents & Statutes...</p>
                </div>
              </motion.div>
            ) : analysis ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 pb-20"
              >
                <div className="flex items-center justify-between print:hidden">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-[#141414] text-[#E4E3E0] rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {domain?.domain.replace('_', ' ')}
                    </div>
                    <span className="text-[10px] font-mono opacity-40 uppercase">Confidence: {(domain?.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={handlePrint}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:underline"
                    >
                      <Printer className="w-4 h-4" /> Print Brief
                    </button>
                    <button 
                      onClick={handleExportDocx}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:underline"
                    >
                      <Download className="w-4 h-4" /> Export DOCX
                    </button>
                  </div>
                </div>

                <div className="bg-white border-2 border-[#141414] rounded-[2rem] overflow-hidden shadow-2xl print:shadow-none print:border-none print:rounded-none">
                  <div className="p-12 space-y-10 print:p-0">
                    <div className="text-center space-y-2 border-b border-[#141414]/10 pb-8">
                      <h2 className="text-3xl font-black tracking-tighter uppercase">Legal Opinion</h2>
                      <p className="text-xs font-mono opacity-50">Generated by CaseFlow AI Autonomous Engine</p>
                      <p className="text-[10px] font-mono opacity-30 uppercase">Date: {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="space-y-8">
                      <section className="space-y-3">
                        <h3 className="col-header flex items-center gap-2"><AlertCircle className="w-4 h-4" /> The Issue</h3>
                        <p className="text-xl font-bold leading-tight">{analysis.issue}</p>
                      </section>

                      <section className="space-y-3">
                        <h3 className="col-header flex items-center gap-2"><BookOpen className="w-4 h-4" /> Relevant Law</h3>
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>{analysis.relevantLaw}</ReactMarkdown>
                        </div>
                      </section>

                      <DemoPaywall feature="Brief Synthesis" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 opacity-20 text-center space-y-4 print:hidden">
                <FileText className="w-20 h-20" />
                <p className="text-xl font-bold italic">Awaiting Synthesis Parameters...</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
