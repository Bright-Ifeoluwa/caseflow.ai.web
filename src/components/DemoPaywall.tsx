import React from 'react';
import { Lock, Rocket } from 'lucide-react';

export function DemoPaywall({ feature }: { feature: string }) {
  return (
    <div className="relative mt-8">
      {/* Blurred background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#E4E3E0] z-10 pointer-events-none h-48 -top-48"></div>
      
      <div className="relative z-20 bg-[#141414] text-[#E4E3E0] p-8 rounded-3xl text-center space-y-6 shadow-2xl max-w-2xl mx-auto border border-white/10">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-yellow-400" />
        </div>
        <h3 className="text-3xl font-black tracking-tighter">Unlock Full {feature}</h3>
        <p className="text-lg opacity-80 max-w-md mx-auto leading-relaxed">
          You've reached the limit of the interactive demo. To view the complete analysis, citations, and export capabilities, please upgrade to the full platform or wait for our official launch day.
        </p>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => alert('Upgrade functionality will be available on launch day!')}
            className="w-full sm:w-auto px-8 py-4 bg-[#E4E3E0] text-[#141414] rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <Rocket className="w-5 h-5" />
            Upgrade to Premium
          </button>
          <button 
            onClick={() => alert('You have been added to the waitlist!')}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#E4E3E0]/20 rounded-xl font-bold hover:bg-white/5 transition-colors"
          >
            Join Launch Waitlist
          </button>
        </div>
      </div>
    </div>
  );
}
