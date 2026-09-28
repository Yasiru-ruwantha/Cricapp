'use client';

import React from 'react';
import { useMatchStore } from '@/lib/store/useMatchStore';

export function DetailedScorecard() {
  const scorecard = useMatchStore((state) => state.scorecard);

  if (!scorecard) return null;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mt-6">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">Current Inning</h3>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Batsmen */}
          <div>
            <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Batsmen</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="font-medium text-gray-800">{scorecard.strikerName || 'Batsman 1'}*</span>
                <span className="font-bold">{scorecard.strikerRuns} <span className="text-gray-400 text-sm font-normal">({scorecard.strikerBalls})</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">{scorecard.nonStrikerName || 'Batsman 2'}</span>
                <span className="font-bold">{scorecard.nonStrikerRuns} <span className="text-gray-400 text-sm font-normal">({scorecard.nonStrikerBalls})</span></span>
              </div>
            </div>
          </div>

          {/* Bowler */}
          <div>
            <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Bowler</h4>
            <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
              <div>
                <div className="font-semibold text-gray-800">{scorecard.bowlerName || 'Current Bowler'}</div>
                <div className="text-sm text-gray-500 mt-1">Overs: {scorecard.bowlerOvers}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl">{scorecard.bowlerWickets}/{scorecard.bowlerRuns}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
