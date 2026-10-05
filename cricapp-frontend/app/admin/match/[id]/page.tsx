"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Client } from "@stomp/stompjs";

interface Player {
  id: number;
  name: string;
  role: string;
}

interface Scorecard {
  matchTitle: string;
  matchStatus: string;
  battingTeamName: string | null;
  bowlingTeamName: string | null;
  totalRuns: number;
  totalWickets: number;
  oversBowled: number;
  strikerName: string | null;
  strikerRuns: number;
  strikerBalls: number;
  nonStrikerName: string | null;
  nonStrikerRuns: number;
  nonStrikerBalls: number;
  bowlerName: string | null;
  bowlerOvers: number;
  bowlerRuns: number;
  bowlerWickets: number;
  recentBalls: string[];
}

export default function AdminScoringDashboard() {
  const params = useParams();
  const matchId = params.id;

  // Form State
  const [runs, setRuns] = useState(0);
  const [extras, setExtras] = useState(0);
  const [extraType, setExtraType] = useState("");
  const [wicket, setWicket] = useState(false);
  const [wicketType, setWicketType] = useState("");
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [strikerId, setStrikerId] = useState("");
  const [bowlerId, setBowlerId] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  // Scoreboard State
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);

  // Fetch initial data
  useEffect(() => {
    // Fetch players for dropdowns
    fetch("http://localhost:8080/api/players")
      .then(res => res.json())
      .then(data => {
        setPlayers(data);
        if (data.length >= 2) {
          setStrikerId(data[0].id.toString());
          setBowlerId(data[1].id.toString());
        }
      })
      .catch(err => console.error("Failed to load players", err));

    // Fetch initial scorecard
    fetch(`http://localhost:8080/api/matches/${matchId}/scorecard`)
      .then(res => res.json())
      .then(data => setScorecard(data))
      .catch(err => console.error("Failed to load scorecard", err));
  }, [matchId]);

  // WebSocket Connection for Live Score
  useEffect(() => {
    const stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to WebSocket");
        stompClient.subscribe(`/topic/match/${matchId}`, (message) => {
          const updatedScorecard = JSON.parse(message.body);
          setScorecard(updatedScorecard);
        });
      }
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [matchId]);

  const handleRecordBall = async () => {
    setLoading(true);
    setLastAction(null);
    try {
      const response = await fetch(`http://localhost:8080/api/matches/${matchId}/ball`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          runs: Number(runs),
          extras: Number(extras),
          extraType: extraType || null,
          wicket: wicket,
          wicketType: wicketType || null,
          strikerId: Number(strikerId),
          bowlerId: Number(bowlerId),
        }),
      });

      if (response.ok) {
        setLastAction("Successfully recorded ball!");
        setRuns(0);
        setExtras(0);
        setExtraType("");
        setWicket(false);
        setWicketType("");
      } else {
        const err = await response.json();
        setLastAction(`Error: ${err.message || 'Failed to record ball'}`);
      }
    } catch (error) {
      setLastAction("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // Derived names for the scoreboard based on current selection
  const currentStrikerName = players.find(p => p.id.toString() === strikerId)?.name || scorecard?.strikerName || 'Batsman 1';
  const currentBowlerName = players.find(p => p.id.toString() === bowlerId)?.name || scorecard?.bowlerName || 'Bowler';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Left Column: Real-Time Scoreboard */}
      <div className="flex flex-col space-y-6">
        <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
          <div className="bg-slate-950 p-6 border-b border-slate-700 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Live Scorecard</h1>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-red-400 font-bold text-sm tracking-widest">LIVE</span>
            </div>
          </div>
          
          {scorecard ? (
            <div className="p-8">
              <div className="text-center mb-8">
                <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">{scorecard.matchTitle}</p>
                <div className="text-6xl font-black text-white flex justify-center items-baseline gap-2">
                  {scorecard.totalRuns}<span className="text-4xl text-slate-500">/</span>{scorecard.totalWickets}
                </div>
                <p className="text-xl text-slate-300 mt-2 font-medium">Overs: <span className="text-white">{scorecard.oversBowled}</span></p>
                {scorecard.battingTeamName && (
                  <p className="text-blue-400 mt-3 font-semibold">{scorecard.battingTeamName} is batting</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 bg-slate-900 rounded-xl p-4 border border-slate-800">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase mb-2">Batters</p>
                  <p className="text-white font-medium flex justify-between">
                    <span>{currentStrikerName}*</span>
                    <span className="font-bold">{scorecard.strikerRuns} <span className="text-xs font-normal text-slate-400">({scorecard.strikerBalls})</span></span>
                  </p>
                  <p className="text-slate-400 flex justify-between mt-1">
                    <span>{scorecard.nonStrikerName || 'Batsman 2'}</span>
                    <span>{scorecard.nonStrikerRuns} <span className="text-xs">({scorecard.nonStrikerBalls})</span></span>
                  </p>
                </div>
                <div className="border-l border-slate-700 pl-4">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-2">Bowler</p>
                  <p className="text-white font-medium flex justify-between">
                    <span>{currentBowlerName}</span>
                    <span className="font-bold">{scorecard.bowlerWickets}-{scorecard.bowlerRuns} <span className="text-xs font-normal text-slate-400">({scorecard.bowlerOvers})</span></span>
                  </p>
                </div>
              </div>

              {scorecard.recentBalls && scorecard.recentBalls.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-2">Recent Balls</p>
                  <div className="flex flex-wrap gap-2">
                    {scorecard.recentBalls.map((b, i) => (
                      <span key={i} className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${b === 'W' ? 'bg-red-500 text-white' : b === '4' || b === '6' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-200'}`}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">Loading live scorecard...</div>
          )}
        </div>
      </div>

      {/* Right Column: Umpire Control Panel */}
      <div className="max-w-xl mx-auto w-full bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700 h-fit">
        
        <div className="bg-slate-950 p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Umpire Controls
          </h2>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Player Selection Dropdowns */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Striker</label>
              <select 
                value={strikerId}
                onChange={(e) => setStrikerId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="" disabled>Select Batsman</option>
                {players.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Bowler</label>
              <select 
                value={bowlerId}
                onChange={(e) => setBowlerId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="" disabled>Select Bowler</option>
                {players.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Run Buttons */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-3">Runs Scored (Bat)</label>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
              {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => setRuns(num)}
                  className={`py-3 rounded-lg font-bold transition-all duration-200 ${
                    runs === num 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105" 
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Extras and Wickets */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-400">Extras</label>
              <div className="grid grid-cols-2 gap-2">
                {["WIDE", "NO_BALL", "BYE", "LEG_BYE"].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      if (extraType === type) {
                        setExtraType("");
                        setExtras(0);
                      } else {
                        setExtraType(type);
                        setExtras(1);
                      }
                    }}
                    className={`py-2 px-3 text-sm rounded-lg font-medium transition-colors ${
                      extraType === type 
                        ? "bg-emerald-600 text-white" 
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {type.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-400">Wicket?</label>
              <button
                onClick={() => {
                  const newWicketState = !wicket;
                  setWicket(newWicketState);
                  if (!newWicketState) setWicketType("");
                }}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                  wicket 
                    ? "bg-red-600 text-white shadow-lg shadow-red-500/30" 
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {wicket ? "OUT!" : "Safe"}
              </button>
              
              {wicket && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-medium text-slate-400 mb-2 mt-2">How Out?</label>
                  <select 
                    value={wicketType}
                    onChange={(e) => setWicketType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    <option value="" disabled>Select Wicket Type</option>
                    <option value="BOWLED">Bowled</option>
                    <option value="CAUGHT">Caught</option>
                    <option value="LBW">LBW</option>
                    <option value="RUN_OUT">Run Out</option>
                    <option value="STUMPED">Stumped</option>
                    <option value="HIT_WICKET">Hit Wicket</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-700">
            <button
              onClick={handleRecordBall}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-[0.98]"
            >
              {loading ? "Recording..." : "Record Delivery"}
            </button>
            
            {lastAction && (
              <p className={`mt-4 text-center font-medium ${lastAction.includes('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
                {lastAction}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
