"use client";
import React, { useState } from 'react';
import { useTeamStore } from "@/lib/store/teamStore";

interface GlobalAddPlayerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalAddPlayerDialog({ isOpen, onClose }: GlobalAddPlayerDialogProps) {
  const { teams, addPlayer } = useTeamStore();
  const [name, setName] = useState("");
  const [teamId, setTeamId] = useState<number | "">("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && teamId !== "") {
      addPlayer(Number(teamId), { name: name.trim(), role: "PLAYER" });
      setName("");
      setTeamId("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Add Player to Team</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-slate-700">Select Team</label>
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="" disabled>Select a team...</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Player Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="e.g. Virat Kohli" 
              required
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border text-slate-700 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!name.trim() || teamId === ""}
              className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Player
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
