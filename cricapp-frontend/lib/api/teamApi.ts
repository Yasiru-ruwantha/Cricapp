import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Create Axios client with default headers (including dev role for protected endpoints)
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Dev-Role': 'ADMIN', // Dev role header for mutations
  },
});

export type PlayerRole = 'BATSMAN' | 'BOWLER' | 'ALL_ROUNDER' | 'WICKET_KEEPER';

export interface PlayerResponse {
  id: number;
  name: string;
  role: PlayerRole;
  age: number;
}

export interface TeamSummaryResponse {
  id: number;
  name: string;
  logoUrl: string | null;
  captainName: string | null;
  playerCount: number;
}

export interface TeamResponse {
  id: number;
  name: string;
  logoUrl: string | null;
  captainId: number | null;
  viceCaptainId: number | null;
  players: PlayerResponse[];
}

export interface TeamRequest {
  name: string;
  logoUrl?: string | null;
}

export interface CreatePlayerRequest {
  name: string;
  role: PlayerRole;
  age?: number;
  teamId?: number;
}

export interface AddPlayerRequest {
  playerId: number;
}

export interface LeadershipRequest {
  captainId: number | null;
  viceCaptainId: number | null;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: { field: string; message: string }[];
}

// Helper to get full logo URL from backend
export function getLogoUrl(logoUrl: string | null): string {
  if (!logoUrl) return '';
  if (logoUrl.startsWith('http')) return logoUrl;
  return `http://localhost:8080${logoUrl}`;
}

// ----------------- API Methods -----------------

/**
 * Fetch all teams or filter by name search
 */
export async function getTeams(search?: string): Promise<TeamSummaryResponse[]> {
  const params = search && search.trim() ? { search: search.trim() } : {};
  const response = await apiClient.get<TeamSummaryResponse[]>('/teams', { params });
  return response.data;
}

/**
 * Fetch full team details by ID (including players roster)
 */
export async function getTeamById(id: number): Promise<TeamResponse> {
  const response = await apiClient.get<TeamResponse>(`/teams/${id}`);
  return response.data;
}

/**
 * Create a new cricket team with optional logo URL
 */
export async function createTeam(name: string, logoUrl?: string | null): Promise<TeamResponse> {
  const response = await apiClient.post<TeamResponse>('/teams', { name, logoUrl: logoUrl || null });
  return response.data;
}

/**
 * Update team name and optional logo URL
 */
export async function updateTeam(id: number, name: string, logoUrl?: string | null): Promise<TeamResponse> {
  const response = await apiClient.put<TeamResponse>(`/teams/${id}`, { name, logoUrl: logoUrl || null });
  return response.data;
}

export const updateTeamName = updateTeam;

/**
 * Create a new player in database and optionally assign to a team
 */
export async function createPlayer(data: CreatePlayerRequest): Promise<PlayerResponse> {
  const response = await apiClient.post<PlayerResponse>('/players', data);
  return response.data;
}

/**
 * Delete a team (unassigns players and deletes team record)
 */
export async function deleteTeam(id: number): Promise<void> {
  await apiClient.delete(`/teams/${id}`);
}

/**
 * Upload a team logo image (PNG/JPG up to 2MB)
 */
export async function uploadTeamLogo(id: number, file: File): Promise<TeamResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<TeamResponse>(`/teams/${id}/logo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

/**
 * Add an unassigned player to a team's squad
 */
export async function addPlayerToTeam(teamId: number, playerId: number): Promise<TeamResponse> {
  const response = await apiClient.post<TeamResponse>(`/teams/${teamId}/players`, { playerId });
  return response.data;
}

/**
 * Remove a player from a team's squad
 */
export async function removePlayerFromTeam(teamId: number, playerId: number): Promise<TeamResponse> {
  const response = await apiClient.delete<TeamResponse>(`/teams/${teamId}/players/${playerId}`);
  return response.data;
}

/**
 * Assign captain and vice-captain for a team
 */
export async function setLeadership(
  teamId: number,
  captainId: number | null,
  viceCaptainId: number | null
): Promise<TeamResponse> {
  const response = await apiClient.put<TeamResponse>(`/teams/${teamId}/leadership`, {
    captainId,
    viceCaptainId,
  });
  return response.data;
}

/**
 * Fetch unassigned players available for squad selection
 */
export async function getUnassignedPlayers(search?: string): Promise<PlayerResponse[]> {
  const params: Record<string, string | boolean> = { unassigned: true };
  if (search && search.trim()) {
    params.search = search.trim();
  }
  const response = await apiClient.get<PlayerResponse[]>('/players', { params });
  return response.data;
}
