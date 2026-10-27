"use client";
import React, { useState, useEffect } from 'react';
import { useTeamStore } from "@/lib/store/teamStore";
import { getUnassignedPlayers, PlayerResponse, PlayerRole } from "@/lib/api/teamApi";

interface GlobalAddPlayerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalAddPlayerDialog({ isOpen, onClose }: GlobalAddPlayerDialogProps) {
  const { teams, addPlayer } = useTeamStore();
  const [teamId, setTeamId] = useState<number | "">("");
  const [mode, setMode] = useState<"existing" | "new">("new");
  const [unassignedPlayers, setUnassignedPlayers] = useState<PlayerResponse[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | "">("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<PlayerRole>("BATSMAN");
  const [age, setAge] = useState<string>("25");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setName("");
      setSelectedPlayerId("");
      if (teams.length > 0 && teamId === "") {
        setTeamId(teams[0].id);
      }
      getUnassignedPlayers()
        .then((players) => {
          setUnassignedPlayers(players);
          if (players.length > 0) {
            setMode("existing");
            setSelectedPlayerId(players[0].id);
          } else {
            setMode("new");
          }
        })
        .catch(() => {
          setMode("new");
        });
    }
  }, [isOpen, teams]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (teamId === "") {
      setError("Please select a team");
      return;
    }

    setLoading(true);

    try {
      if (mode === "existing") {
        if (!selectedPlayerId) {
          setError("Please select a player");
          setLoading(false);
          return;
        }
        const player = unassignedPlayers.find((p) => p.id === Number(selectedPlayerId));
        if (player) {
          await addPlayer(Number(teamId), {
            id: player.id,
            name: player.name,
            role: "PLAYER",
            skillRole: player.role,
            age: player.age,
          });
        }
      } else {
        if (!name.trim()) {
          setError("Player name is required");
          setLoading(false);
          return;
        }
        await addPlayer(Number(teamId), {
          name: name.trim(),
          role: "PLAYER",
          skillRole: role,
          age: age ? parseInt(age, 10) : 25,
        });
      }

      setName("");
      onClose();
    } catch (err: any) {
      console.error("Failed to add player to team:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to add player to team";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Add Player to Team</h2>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 mb-4">
          <button
            type="button"
            onClick={() => setMode("existing")}
            disabled={unassignedPlayers.length === 0}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              mode === "existing"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 disabled:opacity-40"
            }`}
          >
            Select Existing ({unassignedPlayers.length})
          </button>
          <button
            type="button"
            onClick={() => setMode("new")}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              mode === "new"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Create New Player
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Select Team</label>
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="" disabled>Select a team...</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {mode === "existing" ? (
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Select Available Player</label>
              <select
                value={selectedPlayerId}
                onChange={(e) => setSelectedPlayerId(Number(e.target.value))}
                className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                {unassignedPlayers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.role.replace('_', ' ')}{p.age ? `, age ${p.age}` : ''})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Player Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Kumar Sangakkara"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as PlayerRole)}
                    className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="BATSMAN">Batsman</option>
                    <option value="BOWLER">Bowler</option>
                    <option value="ALL_ROUNDER">All-Rounder</option>
                    <option value="WICKET_KEEPER">Wicket Keeper</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Age</label>
                  <input
                    type="number"
                    min="15"
                    max="60"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="25"
                  />
                </div>
              </div>
            </>
          )}

          <div className="mt-6 flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium rounded-lg border text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || teamId === "" || (mode === "new" && !name.trim()) || (mode === "existing" && !selectedPlayerId)}
              className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                mode === "existing" ? "Add to Team" : "Create & Add"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
