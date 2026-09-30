import { Team } from "@/types/team";

export const initialTeams: Team[] = [
  {
    id: 1,
    name: "Mumbai Indians",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/c/cd/Mumbai_Indians_Logo.svg",
    players: [
      { id: 101, name: "Rohit Sharma", role: "CAPTAIN" },
      { id: 102, name: "Suryakumar Yadav", role: "VICE_CAPTAIN" },
      { id: 103, name: "Jasprit Bumrah", role: "PLAYER" }
    ]
  },
  {
    id: 2,
    name: "Chennai Super Kings",
    players: [
      { id: 201, name: "MS Dhoni", role: "CAPTAIN" },
      { id: 202, name: "Ravindra Jadeja", role: "VICE_CAPTAIN" },
      { id: 203, name: "Ruturaj Gaikwad", role: "PLAYER" }
    ]
  }
];
