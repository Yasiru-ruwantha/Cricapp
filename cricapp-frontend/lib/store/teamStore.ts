import { create } from "zustand";
import { Team, Player, Role } from "@/types/team";
import {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addPlayerToTeam,
  removePlayerFromTeam,
  setLeadership,
  getUnassignedPlayers,
  createPlayer,
  getLogoUrl,
  TeamResponse,
  PlayerRole,
} from "@/lib/api/teamApi";

interface TeamStore {
  teams: Team[];
  isHydrated: boolean;
  setHydrated: () => Promise<void>;
  addTeam: (team: Omit<Team, "id" | "players">) => Promise<void>;
  updateTeam: (id: number, team: Partial<Team>) => Promise<void>;
  deleteTeam: (id: number) => Promise<void>;
  addPlayer: (teamId: number, player: { name: string; role?: Role; skillRole?: PlayerRole; age?: number; id?: number }) => Promise<void>;
  removePlayer: (teamId: number, playerId: number) => Promise<void>;
  changePlayerRole: (teamId: number, playerId: number, role: Role) => Promise<void>;
}

function mapBackendTeamToStoreTeam(backendTeam: TeamResponse): Team {
  return {
    id: backendTeam.id,
    name: backendTeam.name,
    logoUrl: getLogoUrl(backendTeam.logoUrl) || undefined,
    players: (backendTeam.players || []).map((p) => {
      let role: Role = "PLAYER";
      if (backendTeam.captainId === p.id) {
        role = "CAPTAIN";
      } else if (backendTeam.viceCaptainId === p.id) {
        role = "VICE_CAPTAIN";
      }
      return {
        id: p.id,
        name: p.name,
        role: role,
        skillRole: p.role,
        age: p.age,
      };
    }),
  };
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  teams: [],
  isHydrated: false,

  setHydrated: async () => {
    try {
      const summaries = await getTeams();
      const fullTeams = await Promise.all(
        summaries.map((s) => getTeamById(s.id).catch(() => null))
      );
      const validTeams = fullTeams
        .filter((t): t is TeamResponse => t !== null)
        .map(mapBackendTeamToStoreTeam);

      set({ teams: validTeams, isHydrated: true });
    } catch (err) {
      console.error("Failed to load teams from backend API:", err);
      set({ isHydrated: true });
    }
  },

  addTeam: async (team) => {
    try {
      const created = await createTeam(team.name, team.logoUrl);
      const mapped = mapBackendTeamToStoreTeam(created);
      set((state) => ({ teams: [...state.teams, mapped] }));
    } catch (err) {
      console.error("Failed to add team via API:", err);
      throw err;
    }
  },

  updateTeam: async (id, updated) => {
    try {
      const currentTeam = get().teams.find((t) => t.id === id);
      const name = updated.name ?? currentTeam?.name ?? "";
      const logoUrl = updated.logoUrl !== undefined ? updated.logoUrl : (currentTeam?.logoUrl ?? null);
      const updatedBackend = await updateTeam(id, name, logoUrl);
      const mapped = mapBackendTeamToStoreTeam(updatedBackend);
      set((state) => ({
        teams: state.teams.map((t) => (t.id === id ? mapped : t)),
      }));
    } catch (err) {
      console.error("Failed to update team via API:", err);
      throw err;
    }
  },

  deleteTeam: async (id) => {
    try {
      await deleteTeam(id);
      set((state) => ({
        teams: state.teams.filter((t) => t.id !== id),
      }));
    } catch (err) {
      console.error("Failed to delete team via API:", err);
      throw err;
    }
  },

  addPlayer: async (teamId, player) => {
    try {
      // 1. If player already has an ID (picked from unassigned list), assign directly
      if (player.id) {
        const updated = await addPlayerToTeam(teamId, player.id);
        const mapped = mapBackendTeamToStoreTeam(updated);
        set((state) => ({
          teams: state.teams.map((t) => (t.id === teamId ? mapped : t)),
        }));
        return;
      }

      // 2. Search unassigned players by name
      const unassigned = await getUnassignedPlayers();
      const existing = unassigned.find(
        (p) => p.name.trim().toLowerCase() === player.name.trim().toLowerCase()
      );

      if (existing) {
        const updated = await addPlayerToTeam(teamId, existing.id);
        const mapped = mapBackendTeamToStoreTeam(updated);
        set((state) => ({
          teams: state.teams.map((t) => (t.id === teamId ? mapped : t)),
        }));
      } else {
        // 3. Create new player record in database assigned to this team
        await createPlayer({
          name: player.name.trim(),
          role: (player.skillRole as PlayerRole) || 'BATSMAN',
          age: player.age || 25,
          teamId: teamId,
        });

        // 4. Reload full team from DB
        const refreshed = await getTeamById(teamId);
        const mapped = mapBackendTeamToStoreTeam(refreshed);
        set((state) => ({
          teams: state.teams.map((t) => (t.id === teamId ? mapped : t)),
        }));
      }
    } catch (err) {
      console.error("Failed to add player via API:", err);
      throw err;
    }
  },

  removePlayer: async (teamId, playerId) => {
    try {
      const updated = await removePlayerFromTeam(teamId, playerId);
      const mapped = mapBackendTeamToStoreTeam(updated);
      set((state) => ({
        teams: state.teams.map((t) => (t.id === teamId ? mapped : t)),
      }));
    } catch (err) {
      console.error("Failed to remove player via API:", err);
      throw err;
    }
  },

  changePlayerRole: async (teamId, playerId, newRole) => {
    const currentTeam = get().teams.find((t) => t.id === teamId);
    if (!currentTeam) return;

    const currentCaptain = currentTeam.players.find((p) => p.role === "CAPTAIN");
    const currentViceCaptain = currentTeam.players.find((p) => p.role === "VICE_CAPTAIN");

    let newCaptainId: number | null = currentCaptain ? currentCaptain.id : null;
    let newViceCaptainId: number | null = currentViceCaptain ? currentViceCaptain.id : null;

    if (newRole === "CAPTAIN") {
      newCaptainId = playerId;
      if (newViceCaptainId === playerId) newViceCaptainId = null;
    } else if (newRole === "VICE_CAPTAIN") {
      newViceCaptainId = playerId;
      if (newCaptainId === playerId) newCaptainId = null;
    } else if (newRole === "PLAYER") {
      if (newCaptainId === playerId) newCaptainId = null;
      if (newViceCaptainId === playerId) newViceCaptainId = null;
    }

    try {
      const updatedBackend = await setLeadership(teamId, newCaptainId, newViceCaptainId);
      const mapped = mapBackendTeamToStoreTeam(updatedBackend);
      set((state) => ({
        teams: state.teams.map((t) => (t.id === teamId ? mapped : t)),
      }));
    } catch (err) {
      console.error("Failed to update leadership via API:", err);
      throw err;
    }
  },
}));
