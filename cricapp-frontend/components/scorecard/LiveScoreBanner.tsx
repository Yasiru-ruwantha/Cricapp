'use client';

import React from 'react';
import { useMatchStore } from '@/lib/store/useMatchStore';

export function LiveScoreBanner() {
  const scorecard = useMatchStore((state) => state.scorecard);

  if (!scorecard) return <div className="p-4 bg-gray-100 rounded-lg animate-pulse">Loading score...</div>;

  return (
    <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between">
      <div className="text-center md:text-left mb-4 md:mb-0">
        <h2 className="text-xl font-bold opacity-80">{scorecard.matchTitle}</h2>
        <div className="text-4xl font-extrabold mt-2 tracking-tight">
          {scorecard.battingTeamName} {scorecard.totalRuns}/{scorecard.totalWickets}
        </div>
        <div className="text-lg opacity-90 mt-1">
          Overs: <span className="font-semibold">{scorecard.oversBowled}</span>
        </div>
      </div>
      
      <div className="text-center md:text-right">
        <div className="bg-white/20 px-4 py-2 rounded-lg inline-block">
          <span className="text-sm font-medium uppercase tracking-wider text-blue-100">Status</span>
          <div className="text-lg font-bold">{scorecard.matchStatus}</div>
        </div>
      </div>
    </div>
  );
}
