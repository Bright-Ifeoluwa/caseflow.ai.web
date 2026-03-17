import React, { useState } from 'react';
import { analyzeDocument } from '../services/geminiService';
import { Upload, FileText, Loader2, Zap, AlertCircle, Download, Printer, Shield, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { DemoPaywall } from '../components/DemoPaywall';
import { useUsageLimit } from '../hooks/useUsageLimit';
import UsageLimitBanner from '../components/UsageLimitBanner';

export default function DocumentAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analysisMode, setAnalysisMode] = useState('general');
  const [confidentialMode, setConfidentialMode] = useState(true);
  const { isLimitReached, incrementUsage } = useUsageLimit();

  const modes = [
    { id: 'general', label: 'General Analysis' },
    { id: 'loopholes', label: 'Identify Loopholes & Risks' },
    { id: 'obligations', label: 'Extract Obligations' },
    { id: 'summary', label: 'Summarize Key Terms' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !preview || isAnalyzing || isLimitReached) return;

    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const base64Data = preview.split(',')[1];
      
      let finalPrompt = prompt;
      if (analysisMode === 'loopholes') finalPrompt = "Identify all legal loopholes, ambiguities, and potential liabilities in this document. " + prompt;
      if (analysisMode === 'obligations') finalPrompt = "Extract and list all binding obligations, deadlines, and deliverables for all parties involved. " + prompt;
      if (analysisMode === 'summary') finalPrompt = "Provide a concise summary of the key terms, conditions, and the overall legal effect of this document. " + prompt;
      if (analysisMode === 'general' && !prompt) finalPrompt = "Provide a comprehensive legal review of this document.";

      if (confidentialMode) {
        finalPrompt += "\n\nCONFIDENTIALITY INSTRUCTION: Automatically redact or anonymize any Personally Identifiable Information (PII), names, addresses, or sensitive financial figures in your analysis output.";
      }

      // DEMO MODE: Hardcoded Analysis
      await new Promise(resolve => setTimeout(resolve, 2500));
      const result = `**Document Intelligence Report (Demo Mode)**

### 1. Document Overview
The uploaded document appears to be a **Commercial Lease Agreement** between [REDACTED] (Landlord) and [REDACTED] (Tenant). The term is specified as 5 years, commencing on [REDACTED DATE].

### 2. Key Obligations & Deliverables
*   **Tenant:** Must pay an annual rent of [REDACTED AMOUNT] in advance. Must maintain the interior of the premises in good repair.
*   **Landlord:** Must ensure quiet enjoyment of the premises. Responsible for structural repairs and exterior maintenance.

### 3. Identified Risks & Loopholes
*   **Force Majeure Clause:** The current clause is overly broad and does not explicitly exclude economic hardship or lack of funds, which could be exploited by the tenant to excuse non-payment.
*   **Termination for Convenience:** There is no clear provision allowing the Landlord to terminate the lease early if the property needs to be redeveloped.
*   **Indemnity:** The indemnity clause heavily favors the Landlord, potentially exposing the Tenant to liability for issues beyond their control.

### 4. Recommendations
1.  Draft a more specific Force Majeure clause that explicitly lists covered events (e.g., acts of God, war, pandemics) and excludes financial inability to pay.
2.  Include a mutual break clause allowing either party to terminate after 3 years with 6 months' written notice.
3.  Negotiate a cap on the Tenant's indemnity obligations.`;
      
      setAnalysis(result);
      await incrementUsage();
    } catch (error) {
      console.error("Analysis failed", error);
      setAnalysis("An error occurred during analysis. Please ensure the file is a valid image or PDF and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportDocx = async () => {
    if (!analysis) return;

    const paragraphs = analysis.split('\n').map(line => {
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
    saveAs(blob, `Document_Analysis_${new Date().toISOString().slice(0, 10)}.docx`);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-10 print:p-0 print:max-w-none">
      <div className="space-y-2 print:hidden">
        <h1 className="text-4xl font-black tracking-tighter">Document Intelligence</h1>
        <p className="text-[#141414]/50 font-medium">Upload contracts, judgments, or briefs for autonomous AI review and risk extraction.</p>
      </div>

      <UsageLimitBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-6 print:hidden">
          <div className="p-6 bg-white border-2 border-[#141414] rounded-2xl shadow-xl space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-mono uppercase opacity-50">Upload Document (PDF/Image)</label>
              
              <div className="relative border-2 border-dashed border-[#141414]/20 rounded-xl p-8 text-center hover:border-[#141414] transition-colors cursor-pointer group">
                <input 
                  type="file" 
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <Upload className="w-8 h-8 mx-auto mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                <p className="text-sm font-bold">Drag & Drop or Click</p>
                <p className="text-xs opacity-50 mt-1">{file ? file.name : 'Max size: 10MB'}</p>
              </div>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-mono uppercase opacity-50">Analysis Mode</label>
                <div className="grid grid-cols-1 gap-2">
                  {modes.map(mode => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setAnalysisMode(mode.id)}
                      className={`p-3 text-left text-sm font-bold rounded-xl border transition-all flex items-center gap-3 ${
                        analysisMode === mode.id 
                          ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' 
                          : 'bg-white border-[#141414]/20 hover:border-[#141414]'
                      }`}
                    >
                      <Search className="w-4 h-4 opacity-50" />
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase opacity-50">Custom Instructions (Optional)</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'Focus specifically on the termination clause...'"
                  className="w-full h-24 bg-[#f8f8f8] border border-[#141414]/10 rounded-xl p-4 text-sm focus:outline-none focus:border-[#141414] transition-all resize-none"
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#f8f8f8] border border-[#141414]/10 rounded-xl cursor-pointer" onClick={() => setConfidentialMode(!confidentialMode)}>
                <div className={`w-5 h-5 rounded flex items-center justify-center border ${confidentialMode ? 'bg-[#141414] border-[#141414]' : 'border-[#141414]/30'}`}>
                  {confidentialMode && <Shield className="w-3 h-3 text-[#E4E3E0]" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest">Confidentiality Mode</p>
                  <p className="text-[10px] opacity-50">Auto-redact PII and sensitive data in output</p>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isAnalyzing || !file || isLimitReached}
                className="w-full bg-[#141414] text-[#E4E3E0] py-4 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {isAnalyzing ? 'ANALYZING...' : isLimitReached ? 'LIMIT REACHED' : 'RUN INTELLIGENCE'}
              </button>
            </form>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 print:col-span-3">
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
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
                  <p className="font-bold text-xl tracking-tight">Reviewing Document</p>
                  <p className="text-xs font-mono uppercase opacity-40">Extracting clauses & legal context...</p>
                </div>
              </motion.div>
            ) : analysis ? (
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
                    <Printer className="w-4 h-4" /> Print Report
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
                    <div className="flex items-center gap-3 border-b border-[#141414]/10 pb-6 print:hidden">
                      <AlertCircle className="w-6 h-6" />
                      <h2 className="text-2xl font-black tracking-tighter uppercase">Intelligence Report</h2>
                    </div>

                    <div className="prose prose-sm max-w-none print:prose-black font-serif relative overflow-hidden">
                      <ReactMarkdown>{analysis.split('### 3.')[0]}</ReactMarkdown>
                      <DemoPaywall feature="Document Intelligence" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 opacity-20 text-center space-y-4 print:hidden">
                <FileText className="w-20 h-20" />
                <p className="text-xl font-bold italic">Awaiting Document Upload...</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
