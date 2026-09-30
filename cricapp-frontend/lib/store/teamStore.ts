import { create } from "zustand";
import { Team, Player, Role } from "@/types/team";
import { initialTeams } from "@/lib/mock/teams";

interface TeamStore {
  teams: Team[];
  isHydrated: boolean;
  setHydrated: () => void;
  addTeam: (team: Omit<Team, "id" | "players">) => void;
  updateTeam: (id: number, team: Partial<Team>) => void;
  deleteTeam: (id: number) => void;
  addPlayer: (teamId: number, player: Omit<Player, "id">) => void;
  removePlayer: (teamId: number, playerId: number) => void;
  changePlayerRole: (teamId: number, playerId: number, role: Role) => void;
}

export const useTeamStore = create<TeamStore>((set) => ({
  teams: initialTeams,
  isHydrated: false,
  setHydrated: () => set({ isHydrated: true }),
  addTeam: (team) =>
    set((state) => ({
      teams: [
        ...state.teams,
        {
          ...team,
          id: Math.max(0, ...state.teams.map((t) => t.id)) + 1,
          players: [],
        },
      ],
    })),
  updateTeam: (id, updated) =>
    set((state) => ({
      teams: state.teams.map((t) => (t.id === id ? { ...t, ...updated } : t)),
    })),
  deleteTeam: (id) =>
    set((state) => ({
      teams: state.teams.filter((t) => t.id !== id),
    })),
  addPlayer: (teamId, player) =>
    set((state) => ({
      teams: state.teams.map((t) => {
        if (t.id === teamId) {
          const newPlayerId = Math.max(0, ...t.players.map((p) => p.id)) + 1;
          return { ...t, players: [...t.players, { ...player, id: newPlayerId }] };
        }
        return t;
      }),
    })),
  removePlayer: (teamId, playerId) =>
    set((state) => ({
      teams: state.teams.map((t) => {
        if (t.id === teamId) {
          return { ...t, players: t.players.filter((p) => p.id !== playerId) };
        }
        return t;
      }),
    })),
  changePlayerRole: (teamId, playerId, role) =>
    set((state) => ({
      teams: state.teams.map((t) => {
        if (t.id === teamId) {
          return {
            ...t,
            players: t.players.map((p) => (p.id === playerId ? { ...p, role } : p)),
          };
        }
        return t;
      }),
    })),
}));
