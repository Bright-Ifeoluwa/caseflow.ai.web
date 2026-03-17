import React, { useState } from 'react';
import { draftCourtProcess } from '../services/geminiService';
import { FileSignature, Loader2, Zap, Download, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { DemoPaywall } from '../components/DemoPaywall';
import { useUsageLimit } from '../hooks/useUsageLimit';
import UsageLimitBanner from '../components/UsageLimitBanner';

export default function ProcessDrafter() {
  const [processType, setProcessType] = useState('Motion on Notice');
  const [details, setDetails] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const { isLimitReached, incrementUsage } = useUsageLimit();

  const processTypes = [
    'Motion on Notice',
    'Motion Ex Parte',
    'Affidavit',
    'Statement of Claim',
    'Written Address',
    'Notice of Appeal',
    'Letter of Demand'
  ];

  const handleDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim() || isDrafting || isLimitReached) return;

    setIsDrafting(true);
    setDraft(null);
    try {
      const result = await draftCourtProcess(processType, details);
      setDraft(result);
      await incrementUsage();
    } catch (error) {
      console.error("Drafting failed", error);
      setDraft("An error occurred during drafting. Please try again.");
    } finally {
      setIsDrafting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportDocx = async () => {
    if (!draft) return;

    // Basic Markdown to DOCX conversion
    const paragraphs = draft.split('\n').map(line => {
      // Handle basic bolding (e.g., **text**)
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const textRuns = parts.map(part => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return new TextRun({ text: part.slice(2, -2), bold: true });
        }
        return new TextRun({ text: part });
      });

      return new Paragraph({
        children: textRuns,
        spacing: { after: 200 }
      });
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs,
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${processType.replace(/\s+/g, '_')}_Draft.docx`);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-10 print:p-0 print:max-w-none">
      <div className="space-y-2 print:hidden">
        <h1 className="text-4xl font-black tracking-tighter">Court Process Drafter</h1>
        <p className="text-[#141414]/50 font-medium">Generate formal Nigerian court processes compliant with High Court Rules.</p>
      </div>

      <UsageLimitBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-6 print:hidden">
          <div className="p-6 bg-white border-2 border-[#141414] rounded-2xl shadow-xl space-y-6">
            <form onSubmit={handleDraft} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase opacity-50">Process Type</label>
                <select 
                  value={processType}
                  onChange={(e) => setProcessType(e.target.value)}
                  className="w-full bg-[#f8f8f8] border border-[#141414]/10 rounded-xl p-4 text-sm focus:outline-none focus:border-[#141414] transition-all"
                >
                  {processTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase opacity-50">Case Facts & Details</label>
                <textarea 
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Enter parties, court name, suit number, and specific facts or prayers..."
                  className="w-full h-48 bg-[#f8f8f8] border border-[#141414]/10 rounded-xl p-4 text-sm focus:outline-none focus:border-[#141414] transition-all resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={isDrafting || !details.trim() || isLimitReached}
                className="w-full bg-[#141414] text-[#E4E3E0] py-4 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDrafting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {isDrafting ? 'DRAFTING...' : isLimitReached ? 'LIMIT REACHED' : 'GENERATE DRAFT'}
              </button>
            </form>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 print:col-span-3">
          <AnimatePresence mode="wait">
            {isDrafting ? (
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
                  <p className="font-bold text-xl tracking-tight">Drafting Court Process</p>
                  <p className="text-xs font-mono uppercase opacity-40">Applying formatting rules...</p>
                </div>
              </motion.div>
            ) : draft ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 pb-20"
              >
                <div className="flex items-center justify-end gap-4 print:hidden">
                  <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:underline"
                  >
                    <Printer className="w-4 h-4" /> Print Draft
                  </button>
                  <button 
                    onClick={handleExportDocx}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:underline"
                  >
                    <Download className="w-4 h-4" /> Export DOCX
                  </button>
                </div>

                <div className="bg-white border-2 border-[#141414] rounded-[2rem] overflow-hidden shadow-2xl print:shadow-none print:border-none print:rounded-none">
                  <div className="p-12 space-y-8 print:p-0">
                    <div className="prose prose-sm max-w-none print:prose-black font-serif relative overflow-hidden">
                      <ReactMarkdown>{draft.split('\n\n').slice(0, 4).join('\n\n')}</ReactMarkdown>
                      <DemoPaywall feature="Process Drafter" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 opacity-20 text-center space-y-4 print:hidden">
                <FileSignature className="w-20 h-20" />
                <p className="text-xl font-bold italic">Awaiting Process Details...</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
