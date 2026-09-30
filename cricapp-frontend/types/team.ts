export type Role = "CAPTAIN" | "VICE_CAPTAIN" | "PLAYER";

export interface Player {
  id: number;
  name: string;
  role: Role;
}

export interface Team {
  id: number;
  name: string;
  logoUrl?: string;
  players: Player[];
}
