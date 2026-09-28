'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useMatchStore } from '@/lib/store/useMatchStore';
import { LiveScoreBanner } from '@/components/scorecard/LiveScoreBanner';
import { DetailedScorecard } from '@/components/scorecard/DetailedScorecard';
import { BallByBallLog } from '@/components/scorecard/BallByBallLog';
import axios from 'axios';

export default function MatchPage() {
  const params = useParams();
  const matchId = Number(params.id);
  const { connect, disconnect, setScorecard } = useMatchStore();

  useEffect(() => {
    // 1. Fetch initial scorecard via REST
    const fetchInitialData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/matches/${matchId}/scorecard`);
        setScorecard(response.data);
      } catch (error) {
        console.error('Failed to fetch initial scorecard:', error);
      }
    };

    fetchInitialData();

    // 2. Connect to WebSockets for live updates
    connect(matchId);

    // 3. Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [matchId, connect, disconnect, setScorecard]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <LiveScoreBanner />
        <DetailedScorecard />
        <BallByBallLog />
      </div>
    </div>
  );
}
