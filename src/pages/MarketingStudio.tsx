import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Video, Image as ImageIcon, Loader2, Key, Play, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUsageLimit } from '../hooks/useUsageLimit';
import UsageLimitBanner from '../components/UsageLimitBanner';

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const CAMPAIGNS = [
  {
    id: 'overview',
    title: 'App Overview & Legal Search',
    description: 'Showcases the core search engine and the platform as a whole.',
    videoPrompt: 'A cinematic, high-resolution promotional video for a legal tech app. The video opens with a minimalist logo: a classic weight scale next to the word "CASEFLOW" in a bold, tightly-spaced modern sans-serif font, with the tagline "Nigerian Legal Intelligence" below it. The scene transitions to a sleek, dark-mode digital interface featuring a prominent search bar. A user types a legal query, and the screen instantly populates with Nigerian Supreme Court case results, highlighted with subtle emerald green accents. Professional, corporate, 4k resolution, smooth camera pan.',
    imagePrompt: 'A sleek, modern promotional flyer for a legal tech app. At the top, a minimalist logo featuring a classic weight scale next to the word "CASEFLOW" in a bold, tightly-spaced modern sans-serif font, and the tagline "Nigerian Legal Intelligence". The center shows a dark-mode digital interface with a search bar and legal case results. The color palette is deep black and off-white, with emerald green highlights. Professional, high-quality, corporate aesthetic.'
  },
  {
    id: 'briefs',
    title: 'App Overview & Brief Generation',
    description: 'Highlights the autonomous brief synthesis feature.',
    videoPrompt: 'A cinematic promotional video for the Caseflow legal app. Opens with the Caseflow logo: a weight scale, bold "CASEFLOW" text, and "Nigerian Legal Intelligence". Transitions to a modern, dark-themed UI where a lawyer clicks "Generate Brief". The screen dynamically types out a structured legal document with headings like "Issue" and "Relevant Law". The lighting is moody and professional, emphasizing the glowing off-white text on a deep black background. 4k, photorealistic.',
    imagePrompt: 'A professional flyer for the Caseflow legal app focusing on Brief Generation. Features the Caseflow logo (weight scale, bold "CASEFLOW" text, "Nigerian Legal Intelligence"). The main visual is a glowing digital legal brief emerging from a dark, sleek interface. Deep black background, off-white text, and subtle emerald green accents. Clean, minimalist, high resolution.'
  },
  {
    id: 'analysis',
    title: 'App Overview & Document Analysis',
    description: 'Focuses on the AI document intelligence and loophole detection.',
    videoPrompt: 'A dynamic promotional video for the Caseflow legal app. Starts with the Caseflow logo (weight scale, bold "CASEFLOW" text, "Nigerian Legal Intelligence"). The camera zooms into a digital contract on a dark-mode interface. An AI scanning effect sweeps across the text, highlighting legal loopholes in red and key clauses in emerald green. Sleek, modern, professional, corporate tech aesthetic, 4k.',
    imagePrompt: 'A modern promotional flyer for the Caseflow legal app highlighting Document Analysis. Displays the Caseflow logo (weight scale, bold "CASEFLOW" text, "Nigerian Legal Intelligence"). The central image is a dark-mode interface showing a legal contract with specific clauses highlighted in emerald green and red. Professional, sleek, high-contrast corporate design.'
  },
  {
    id: 'prediction',
    title: 'App Overview & Outcome Prediction',
    description: 'Showcases the predictive modeling and win probability features.',
    videoPrompt: 'A high-tech promotional video for the Caseflow legal app. Opens with the Caseflow logo (weight scale, bold "CASEFLOW" text, "Nigerian Legal Intelligence"). Transitions to a sleek dashboard showing a large, bold percentage number representing "Win Probability" alongside a glowing digital scale of justice. The interface is deep black with off-white and emerald green data visualizations. Cinematic, professional, dramatic lighting, 4k.',
    imagePrompt: 'A high-tech promotional flyer for the Caseflow legal app focusing on Outcome Prediction. Features the Caseflow logo (weight scale, bold "CASEFLOW" text, "Nigerian Legal Intelligence"). The visual showcases a sleek, dark-mode dashboard with a prominent "85% Win Probability" metric and a glowing digital scale. Deep black background, off-white text, emerald green accents. Minimalist and premium.'
  }
];

export default function MarketingStudio() {
  const [hasKey, setHasKey] = useState(false);
  const [isCheckingKey, setIsCheckingKey] = useState(true);
  const [activeTab, setActiveTab] = useState<'video' | 'image'>('video');
  const [selectedCampaign, setSelectedCampaign] = useState(CAMPAIGNS[0]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [generatedAsset, setGeneratedAsset] = useState<{ type: 'video' | 'image', url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isLimitReached, incrementUsage } = useUsageLimit();

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    setIsCheckingKey(true);
    try {
      if (window.aistudio?.hasSelectedApiKey) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasKey(has);
      } else {
        // Fallback if not in AI Studio environment
        setHasKey(!!process.env.API_KEY || !!process.env.GEMINI_API_KEY);
      }
    } catch (e) {
      console.error("Error checking API key:", e);
    } finally {
      setIsCheckingKey(false);
    }
  };

  const handleSelectKey = async () => {
    try {
      if (window.aistudio?.openSelectKey) {
        await window.aistudio.openSelectKey();
        // Assume success to mitigate race condition
        setHasKey(true);
      } else {
        alert("API Key selection is only available in the AI Studio environment.");
      }
    } catch (e) {
      console.error("Error opening key selector:", e);
    }
  };

  const generateVideo = async () => {
    if (isLimitReached) return;
    setIsGenerating(true);
    setError(null);
    setGeneratedAsset(null);
    setProgressMessage('Initializing Veo 3.1 Fast Generate model...');

    try {
      // Create a fresh instance to ensure it picks up the newly selected key
      const ai = new GoogleGenAI({});
      
      setProgressMessage('Submitting video generation request...');
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: selectedCampaign.videoPrompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      const loadingMessages = [
        "Rendering frames...",
        "Applying cinematic lighting...",
        "Synthesizing motion...",
        "Finalizing video output...",
        "This usually takes a few minutes. Please don't close this tab."
      ];
      
      let messageIndex = 0;
      const messageInterval = setInterval(() => {
        setProgressMessage(loadingMessages[messageIndex % loadingMessages.length]);
        messageIndex++;
      }, 15000);

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }
      
      clearInterval(messageInterval);

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        // We need to fetch it with the API key to get the actual video blob
        setProgressMessage('Downloading generated video...');
        const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': apiKey,
          },
        });
        
        if (!response.ok) throw new Error("Failed to download video from URI");
        
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setGeneratedAsset({ type: 'video', url: objectUrl });
        await incrementUsage();
      } else {
        throw new Error("No video URI returned from the model.");
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate video.");
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        setError("API Key error. Please select your API key again.");
      }
    } finally {
      setIsGenerating(false);
      setProgressMessage('');
    }
  };

  const generateImage = async () => {
    if (isLimitReached) return;
    setIsGenerating(true);
    setError(null);
    setGeneratedAsset(null);
    setProgressMessage('Initializing Gemini 3.1 Flash Image model...');

    try {
      const ai = new GoogleGenAI({});
      
      setProgressMessage('Generating high-resolution flyer...');
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [{ text: selectedCampaign.imagePrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "3:4",
            imageSize: "2K"
          }
        },
      });

      let imageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setGeneratedAsset({ type: 'image', url: imageUrl });
        await incrementUsage();
      } else {
        throw new Error("No image data returned from the model.");
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate flyer.");
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        setError("API Key error. Please select your API key again.");
      }
    } finally {
      setIsGenerating(false);
      setProgressMessage('');
    }
  };

  const handleGenerate = () => {
    if (isLimitReached) return;
    if (activeTab === 'video') {
      generateVideo();
    } else {
      generateImage();
    }
  };

  if (isCheckingKey) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#141414]" />
      </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-[#141414]/5 rounded-full flex items-center justify-center mb-4">
          <Key className="w-10 h-10 text-[#141414]" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter">API Key Required</h1>
        <p className="text-lg opacity-60 max-w-xl leading-relaxed">
          To generate high-quality promotional videos and flyers using Google's Veo and Imagen models, you need to provide a paid Google Cloud API key.
        </p>
        <div className="p-4 bg-blue-50 text-blue-800 rounded-xl max-w-xl text-sm text-left space-y-2">
          <p className="font-bold flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Billing Requirement</p>
          <p>The selected API key must belong to a Google Cloud project with billing enabled. For more information, visit the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline font-bold">billing documentation</a>.</p>
        </div>
        <button 
          onClick={handleSelectKey}
          className="px-8 py-4 bg-[#141414] text-[#E4E3E0] rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Key className="w-5 h-5" /> Select API Key
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tighter">Publicity Studio</h1>
        <p className="text-[#141414]/50 font-medium">Generate promotional videos and flyers for Caseflow AI using Veo and Imagen.</p>
      </div>

      <UsageLimitBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-8">
          <div className="flex p-1 bg-[#141414]/5 rounded-xl">
            <button
              onClick={() => setActiveTab('video')}
              className={`flex-1 py-3 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'video' ? 'bg-white shadow-sm text-[#141414]' : 'text-[#141414]/50 hover:text-[#141414]'}`}
            >
              <Video className="w-4 h-4" /> Promo Videos
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`flex-1 py-3 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'image' ? 'bg-white shadow-sm text-[#141414]' : 'text-[#141414]/50 hover:text-[#141414]'}`}
            >
              <ImageIcon className="w-4 h-4" /> Flyers
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">Select Campaign Focus</h3>
            <div className="space-y-3">
              {CAMPAIGNS.map(campaign => (
                <button
                  key={campaign.id}
                  onClick={() => setSelectedCampaign(campaign)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedCampaign.id === campaign.id ? 'border-[#141414] bg-[#141414]/5' : 'border-[#141414]/10 hover:border-[#141414]/30 bg-white'}`}
                >
                  <p className="font-bold">{campaign.title}</p>
                  <p className="text-xs opacity-60 mt-1">{campaign.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-[#141414] text-[#E4E3E0] rounded-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">Generation Prompt</h3>
            <p className="text-sm leading-relaxed opacity-90 italic">
              "{activeTab === 'video' ? selectedCampaign.videoPrompt : selectedCampaign.imagePrompt}"
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || isLimitReached}
            className="w-full py-4 bg-[#141414] text-[#E4E3E0] rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            {isGenerating ? 'GENERATING...' : isLimitReached ? 'LIMIT REACHED' : `GENERATE ${activeTab === 'video' ? 'VIDEO' : 'FLYER'}`}
          </button>

          {error && (
            <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2">
          <div className="h-full min-h-[600px] bg-[#141414]/5 border-2 border-dashed border-[#141414]/20 rounded-[2rem] flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center space-y-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#141414] rounded-full blur-2xl opacity-10 animate-pulse"></div>
                    <Loader2 className="w-16 h-16 animate-spin text-[#141414]" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-xl">Generating {activeTab === 'video' ? 'Video' : 'Flyer'}...</p>
                    <p className="text-sm font-mono opacity-50 animate-pulse">{progressMessage}</p>
                  </div>
                </motion.div>
              ) : generatedAsset ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full flex flex-col items-center justify-center space-y-6"
                >
                  <div className="w-full flex-1 relative rounded-xl overflow-hidden shadow-2xl bg-[#141414] flex items-center justify-center">
                    {generatedAsset.type === 'video' ? (
                      <video 
                        src={generatedAsset.url} 
                        controls 
                        autoPlay 
                        loop 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <img 
                        src={generatedAsset.url} 
                        alt="Generated Flyer" 
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  <a
                    href={generatedAsset.url}
                    download={`caseflow-${activeTab}-${selectedCampaign.id}.${activeTab === 'video' ? 'mp4' : 'png'}`}
                    className="px-8 py-4 bg-white border-2 border-[#141414] text-[#141414] rounded-xl font-bold hover:bg-[#141414] hover:text-white transition-all flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" /> Download {activeTab === 'video' ? 'Video' : 'Flyer'}
                  </a>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center text-center space-y-4 opacity-40"
                >
                  {activeTab === 'video' ? <Video className="w-20 h-20" /> : <ImageIcon className="w-20 h-20" />}
                  <p className="text-xl font-bold italic">Select a campaign and click generate.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
