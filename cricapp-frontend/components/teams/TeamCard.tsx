"use client";
import React from 'react';
import Link from 'next/link';
import { Team } from "@/types/team";
import { LogoAvatar } from "./LogoAvatar";
import { Users } from "lucide-react";

export function TeamCard({ team }: { team: Team }) {
  const captain = team.players.find((p) => p.role === "CAPTAIN");

  return (
    <Link href={`/teams/${team.id}`} className="block group">
      <div className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <LogoAvatar src={team.logoUrl} fallback={team.name} size={60} />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-slate-900 truncate">{team.name}</h3>
            {captain && (
              <p className="text-sm text-slate-500 truncate">Capt: {captain.name}</p>
            )}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <Users size={16} />
            <span>{team.players.length} Players</span>
          </div>
          <span className="text-blue-600 font-medium group-hover:underline">View Details &rarr;</span>
        </div>
      </div>
    </Link>
  );
}
