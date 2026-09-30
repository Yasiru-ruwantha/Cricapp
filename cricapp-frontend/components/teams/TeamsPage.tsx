"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTeamStore } from "@/lib/store/teamStore";
import { TeamCard } from "./TeamCard";
import { TeamCardSkeleton } from "./TeamCardSkeleton";
import { Plus, Search } from "lucide-react";

export function TeamsPage() {
  const { teams, isHydrated, setHydrated } = useTeamStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    setHydrated();
  }, [setHydrated]);

  const filteredTeams = teams.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Teams</h1>
        <Link 
          href="/teams/new" 
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          <span>New Team</span>
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {!isHydrated ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <TeamCardSkeleton key={i} />)}
        </div>
      ) : filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-xl bg-slate-50 text-slate-500">
          No teams found matching "{search}".
        </div>
      )}
    </div>
  );
}
