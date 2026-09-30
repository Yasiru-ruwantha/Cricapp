"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTeamStore } from "@/lib/store/teamStore";
import { RosterTable } from "./RosterTable";
import { LogoAvatar } from "./LogoAvatar";
import { ConfirmDialog } from "./ConfirmDialog";
import { AddPlayerDialog } from "./AddPlayerDialog";
import { ArrowLeft, UserPlus, Trash2, Edit2 } from "lucide-react";
import { Role } from "@/types/team";

interface TeamDashboardProps {
  teamId: number;
}

export function TeamDashboard({ teamId }: TeamDashboardProps) {
  const router = useRouter();
  const { teams, isHydrated, setHydrated, deleteTeam, removePlayer, changePlayerRole, addPlayer } = useTeamStore();
  const [showDeleteTeam, setShowDeleteTeam] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);

  // Mock roles as requested
  const currentUserRole = "ADMIN"; 
  const isAdmin = currentUserRole === "ADMIN" || currentUserRole === "ORGANIZER";

  useEffect(() => {
    setHydrated();
  }, [setHydrated]);

  const team = teams.find((t) => t.id === teamId);

  if (!isHydrated) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading dashboard...</div>;
  }

  if (!team) {
    return (
      <div className="container max-w-4xl mx-auto p-4 sm:p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Team not found</h1>
        <Link href="/teams" className="text-blue-600 hover:underline">
          &larr; Back to Teams
        </Link>
      </div>
    );
  }

  const handleDeleteTeam = () => {
    deleteTeam(teamId);
    router.push('/teams');
  };

  const handleRoleChange = (playerId: number, newRole: Role) => {
    if (newRole !== "PLAYER") {
      // Ensure captain/vice-captain are unique
      const existing = team.players.find(p => p.role === newRole);
      if (existing) {
        changePlayerRole(team.id, existing.id, "PLAYER");
      }
    }
    changePlayerRole(team.id, playerId, newRole);
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 sm:p-6">
      <Link href="/teams" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Teams
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b pb-6">
        <div className="flex items-center gap-5">
          <LogoAvatar src={team.logoUrl} fallback={team.name} size={80} />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{team.name}</h1>
            <p className="text-slate-500 mt-1">{team.players.length} Players in roster</p>
          </div>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-3">
            <Link 
              href={`/teams/${team.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border shadow-sm rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <Edit2 size={16} /> Edit Details
            </Link>
            <button 
              onClick={() => setShowDeleteTeam(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Roster</h2>
        {isAdmin && (
          <button 
            onClick={() => setShowAddPlayer(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            <UserPlus size={16} /> Add Player
          </button>
        )}
      </div>

      <RosterTable 
        players={team.players} 
        isAdmin={isAdmin}
        onRemovePlayer={(playerId) => removePlayer(team.id, playerId)}
        onChangeRole={handleRoleChange}
      />

      <ConfirmDialog
        isOpen={showDeleteTeam}
        title="Delete Team"
        description={`Are you sure you want to delete ${team.name}? All players and data will be permanently removed.`}
        confirmText="Delete Team"
        isDestructive
        onConfirm={handleDeleteTeam}
        onCancel={() => setShowDeleteTeam(false)}
      />

      <AddPlayerDialog
        isOpen={showAddPlayer}
        onClose={() => setShowAddPlayer(false)}
        onAdd={(name) => addPlayer(team.id, { name, role: "PLAYER" })}
      />
    </div>
  );
}
