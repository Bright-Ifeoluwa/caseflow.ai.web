import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useUsageLimit } from '../hooks/useUsageLimit';

export default function UsageLimitBanner() {
  const { count, limit, isLimitReached, loading } = useUsageLimit();

  if (loading || count === null) return null;

  return (
    <div className={`p-4 border rounded-xl flex items-center gap-3 mb-6 ${isLimitReached ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-[#F27D26]/10 border-[#F27D26]/20 text-[#F27D26]'}`}>
      <AlertCircle className="w-5 h-5" />
      <div className="flex-1 text-sm font-medium">
        {isLimitReached ? (
          <span>Daily limit reached (2/2 generations). Your access will reset tomorrow.</span>
        ) : (
          <span>Daily Usage: {count}/{limit} generations used today.</span>
        )}
      </div>
    </div>
  );
}
