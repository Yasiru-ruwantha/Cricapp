'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useMatchStore } from '@/lib/store/useMatchStore';

export function DetailedScorecard() {
  const [expandedInning, setExpandedInning] = useState<number>(1);
  const scorecard = useMatchStore((state) => state.scorecard);

  if (!scorecard) return null;

  // Calculate strike rate safely
  const calculateSR = (runs: number, balls: number) => {
    if (!balls || balls === 0) return '0.00';
    return ((runs / balls) * 100).toFixed(2);
  };

  // Calculate economy safely
  const calculateEco = (runs: number, overs: number) => {
    if (!overs || overs === 0) return '0.00';
    // Overs is typically in format like 1.2, which means 1 over and 2 balls.
    // We'll just divide runs by overs directly if it's stored as a decimal or integer.
    return (runs / overs).toFixed(2);
  };

  return (
    <div className="w-full mx-auto font-sans mt-6">
      {/* Current Inning */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
        <div 
          className="flex justify-between items-center px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setExpandedInning(expandedInning === 1 ? 0 : 1)}
        >
          <h2 className="text-xl font-bold text-gray-900">{scorecard.battingTeamName || 'Batting Team'}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              {scorecard.totalRuns}/{scorecard.totalWickets} <span className="text-sm font-normal text-gray-500">({scorecard.oversBowled} Ov)</span>
            </span>
            {expandedInning === 1 ? <ChevronUp className="w-5 h-5 text-gray-700" /> : <ChevronDown className="w-5 h-5 text-gray-700" />}
          </div>
        </div>

        {expandedInning === 1 && (
          <div className="overflow-x-auto border-t border-gray-200">
            {/* Batting Table */}
            <table className="w-full text-sm text-left">
              <thead className="bg-[#f5f5f5] text-gray-600 font-bold">
                <tr>
                  <th className="px-4 py-2">Batters</th>
                  <th className="px-4 py-2"></th>
                  <th className="px-2 py-2 text-center">R</th>
                  <th className="px-2 py-2 text-center">B</th>
                  <th className="px-2 py-2 text-center">4s</th>
                  <th className="px-2 py-2 text-center">6s</th>
                  <th className="px-2 py-2 text-center">SR</th>
                  <th className="px-4 py-2 text-center">Min</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Striker */}
                {scorecard.strikerName && (
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-bold text-[#008080]">{scorecard.strikerName} *</td>
                    <td className="px-4 py-2.5 text-gray-500">batting</td>
                    <td className="px-2 py-2.5 text-center text-gray-800">{scorecard.strikerRuns}</td>
                    <td className="px-2 py-2.5 text-center text-gray-800">{scorecard.strikerBalls}</td>
                    <td className="px-2 py-2.5 text-center text-gray-800">-</td>
                    <td className="px-2 py-2.5 text-center text-gray-800">-</td>
                    <td className="px-2 py-2.5 text-center text-gray-800">{calculateSR(scorecard.strikerRuns, scorecard.strikerBalls)}</td>
                    <td className="px-4 py-2.5 text-center text-gray-800">-</td>
                  </tr>
                )}
                {/* Non-Striker */}
                {scorecard.nonStrikerName && (
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-bold text-[#008080]">{scorecard.nonStrikerName}</td>
                    <td className="px-4 py-2.5 text-gray-500">batting</td>
                    <td className="px-2 py-2.5 text-center text-gray-800">{scorecard.nonStrikerRuns}</td>
                    <td className="px-2 py-2.5 text-center text-gray-800">{scorecard.nonStrikerBalls}</td>
                    <td className="px-2 py-2.5 text-center text-gray-800">-</td>
                    <td className="px-2 py-2.5 text-center text-gray-800">-</td>
                    <td className="px-2 py-2.5 text-center text-gray-800">{calculateSR(scorecard.nonStrikerRuns, scorecard.nonStrikerBalls)}</td>
                    <td className="px-4 py-2.5 text-center text-gray-800">-</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Bowling Table */}
            <table className="w-full text-sm text-left mt-2 border-t border-gray-200">
              <thead className="bg-[#f5f5f5] text-gray-600 font-bold">
                <tr>
                  <th className="px-4 py-2">Bowler</th>
                  <th className="px-2 py-2 text-center">O</th>
                  <th className="px-2 py-2 text-center">M</th>
                  <th className="px-2 py-2 text-center">R</th>
                  <th className="px-2 py-2 text-center">W</th>
                  <th className="px-2 py-2 text-center">0s</th>
                  <th className="px-2 py-2 text-center">4s</th>
                  <th className="px-2 py-2 text-center">6s</th>
                  <th className="px-2 py-2 text-center">WD</th>
                  <th className="px-2 py-2 text-center">NB</th>
                  <th className="px-4 py-2 text-center">Eco</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {scorecard.bowlerName && (
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-bold text-[#008080]">{scorecard.bowlerName}</td>
                    <td className="px-2 py-2.5 text-center text-gray-800">{scorecard.bowlerOvers}</td>
                    <td className="px-2 py-2.5 text-center text-gray-800">-</td>
                    <td className="px-2 py-2.5 text-center text-gray-800">{scorecard.bowlerRuns}</td>
                    <td className="px-2 py-2.5 text-center text-gray-800">{scorecard.bowlerWickets}</td>
                    <td className="px-2 py-2.5 text-center text-gray-800">-</td>
                    <td className="px-2 py-2.5 text-center text-gray-800">-</td>
                    <td className="px-2 py-2.5 text-center text-gray-800">-</td>
                    <td className="px-2 py-2.5 text-center text-gray-800">-</td>
                    <td className="px-2 py-2.5 text-center text-gray-800">-</td>
                    <td className="px-4 py-2.5 text-center text-gray-800">{calculateEco(scorecard.bowlerRuns, scorecard.bowlerOvers)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
