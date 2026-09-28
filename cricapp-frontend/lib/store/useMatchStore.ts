import { create } from 'zustand';
import { Client } from '@stomp/stompjs';

export interface MatchScorecard {
  matchId: number;
  matchTitle: string;
  matchStatus: string;
  battingTeamName: string;
  bowlingTeamName: string;
  totalRuns: number;
  totalWickets: number;
  oversBowled: number;
  strikerName: string;
  strikerRuns: number;
  strikerBalls: number;
  nonStrikerName: string;
  nonStrikerRuns: number;
  nonStrikerBalls: number;
  bowlerName: string;
  bowlerOvers: number;
  bowlerRuns: number;
  bowlerWickets: number;
  recentBalls: string[];
}

interface MatchState {
  scorecard: MatchScorecard | null;
  stompClient: Client | null;
  isConnected: boolean;
  connect: (matchId: number) => void;
  disconnect: () => void;
  setScorecard: (scorecard: MatchScorecard) => void;
}

export const useMatchStore = create<MatchState>((set, get) => ({
  scorecard: null,
  stompClient: null,
  isConnected: false,

  setScorecard: (scorecard) => set({ scorecard }),

  connect: (matchId: number) => {
    // Prevent multiple connections
    if (get().isConnected) return;

    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      set({ isConnected: true, stompClient: client });
      console.log('Connected to WebSocket for match:', matchId);

      // Subscribe to match updates
      client.subscribe(`/topic/match/${matchId}`, (message) => {
        if (message.body) {
          const newScorecard = JSON.parse(message.body);
          set({ scorecard: newScorecard });
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.activate();
  },

  disconnect: () => {
    const { stompClient } = get();
    if (stompClient) {
      stompClient.deactivate();
      set({ isConnected: false, stompClient: null });
    }
  },
}));
