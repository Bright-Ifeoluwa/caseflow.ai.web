import React, { useState } from 'react';
import { Scale, Activity, AlertTriangle, BookOpen, Loader2, Target, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { predictCaseOutcome } from '../services/geminiService';
import { DemoPaywall } from '../components/DemoPaywall';
import { useUsageLimit } from '../hooks/useUsageLimit';
import UsageLimitBanner from '../components/UsageLimitBanner';

export default function PredictorPage() {
  const [facts, setFacts] = useState('');
  const [domain, setDomain] = useState('Civil Litigation');
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { isLimitReached, incrementUsage } = useUsageLimit();

  const domains = ['Civil Litigation', 'Criminal Defense', 'Constitutional Law', 'Labour & Employment', 'Corporate/Commercial', 'Electoral Petitions'];

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facts.trim() || facts.length < 50 || isPredicting || isLimitReached) {
      if (!facts.trim() || facts.length < 50) {
        setError("Please provide more detailed facts (at least 50 characters) for an accurate prediction.");
      }
      return;
    }
    
    setIsPredicting(true);
    setError(null);
    setPrediction(null);
    
    try {
      // DEMO MODE: Hardcoded Prediction
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = {
        winProbability: 68,
        predictedOutcome: "The court is likely to find in favor of the plaintiff, provided that the evidentiary burden of proving the breach of contract is met. The provided facts suggest a strong prima facie case.",
        riskFactors: [
          "Potential statute of limitations issues if the breach occurred more than 6 years ago.",
          "Lack of written documentation for the oral modifications to the agreement.",
          "Credibility of the primary witness during cross-examination."
        ],
        keyPrecedents: [
          "Best (Nig.) Ltd. v. Blackwood Hodge (Nig.) Ltd. (2011) 5 NWLR (Pt. 1239) 95",
          "BFI Group Corp. v. B.P.E. (2012) 18 NWLR (Pt. 1332) 209"
        ],
        reasoning: "Applying the IRAC method:\n\n**Issue:** Whether a valid contract existed and was subsequently breached by the defendant.\n\n**Rule:** Under Nigerian contract law, a binding agreement requires offer, acceptance, consideration, and intention to create legal relations. A breach occurs when a party fails to perform their obligations without a lawful excuse.\n\n**Application:** The facts indicate that consideration was exchanged and performance commenced. The defendant's sudden cessation of performance likely constitutes a fundamental breach.\n\n**Conclusion:** The plaintiff has a high probability of success, subject to the risk factors identified."
      };
      setPrediction(result);
      await incrementUsage();
    } catch (err: any) {
      setError(err.message || "Prediction failed.");
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
          <Target className="w-8 h-8" />
          Outcome Predictor
        </h1>
        <p className="text-[#141414]/50 font-medium">
          AI-driven predictive modeling based on Nigerian jurisprudence and historical case outcomes.
        </p>
      </div>

      <UsageLimitBanner />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6 bg-white p-6 border-2 border-[#141414] rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold border-b border-[#141414]/10 pb-4">Case Details</h2>
          <form onSubmit={handlePredict} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-50">Legal Domain</label>
              <select 
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full p-3 bg-[#f8f8f8] border border-[#141414]/20 rounded-xl font-medium focus:outline-none focus:border-[#141414]"
              >
                {domains.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-50">Fact Pattern</label>
              <textarea 
                value={facts}
                onChange={(e) => setFacts(e.target.value)}
                placeholder="Enter the material facts of the case in detail. Include dates, actions, and key evidence..."
                className="w-full h-64 p-4 bg-[#f8f8f8] border border-[#141414]/20 rounded-xl font-medium resize-none focus:outline-none focus:border-[#141414]"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg text-sm flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={isPredicting || !facts.trim() || isLimitReached}
              className="w-full bg-[#141414] text-[#E4E3E0] py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPredicting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
              {isPredicting ? 'ANALYZING PRECEDENTS...' : isLimitReached ? 'LIMIT REACHED' : 'RUN PREDICTION MODEL'}
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!prediction && !isPredicting ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-[#141414]/20 rounded-2xl opacity-50"
              >
                <Scale className="w-16 h-16 mb-4" />
                <p className="font-bold text-lg">Awaiting Case Facts</p>
                <p className="text-sm">Enter the facts to generate a probabilistic outcome analysis.</p>
              </motion.div>
            ) : isPredicting ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center space-y-4 p-12"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-[#141414] rounded-full blur-xl opacity-20 animate-pulse"></div>
                  <Loader2 className="w-12 h-12 animate-spin text-[#141414] relative z-10" />
                </div>
                <p className="font-bold uppercase tracking-widest text-sm animate-pulse">Running Monte Carlo Simulation...</p>
              </motion.div>
            ) : prediction ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* Probability Score */}
                <div className="bg-white p-6 border-2 border-[#141414] rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">Win Probability</h3>
                    <p className="text-sm font-medium mt-1">Based on historical precedent</p>
                  </div>
                  <div className="text-5xl font-black tracking-tighter">
                    {prediction.winProbability}%
                  </div>
                </div>

                {/* Predicted Outcome */}
                <div className="bg-[#141414] text-[#E4E3E0] p-6 rounded-2xl shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Predicted Outcome</h3>
                  <p className="font-medium leading-relaxed">{prediction.predictedOutcome}</p>
                </div>

                <DemoPaywall feature="Outcome Predictor" />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
