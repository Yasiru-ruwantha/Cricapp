'use client';

import React from 'react';
import { useMatchStore } from '@/lib/store/useMatchStore';

export function BallByBallLog() {
  const scorecard = useMatchStore((state) => state.scorecard);

  if (!scorecard || !scorecard.recentBalls || scorecard.recentBalls.length === 0) return null;

  return (
    <div className="mt-6">
      <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Recent Balls</h4>
      <div className="flex flex-wrap gap-2">
        {scorecard.recentBalls.map((ball, index) => {
          let bgColor = 'bg-gray-100 text-gray-700 border-gray-200';
          
          if (ball === 'W') {
            bgColor = 'bg-red-500 text-white border-red-600';
          } else if (ball === '4' || ball === '6') {
            bgColor = 'bg-green-500 text-white border-green-600';
          } else if (ball.includes('wd') || ball.includes('nb')) {
            bgColor = 'bg-orange-100 text-orange-800 border-orange-200';
          }

          return (
            <div 
              key={index} 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border shadow-sm ${bgColor}`}
            >
              {ball}
            </div>
          );
        })}
      </div>
    </div>
  );
}
