"use client";
import React, { useState } from 'react';
import { Player, Role } from "@/types/team";
import { RoleBadge } from "./RoleBadge";
import { ConfirmDialog } from "./ConfirmDialog";
import { MoreVertical, UserMinus, Shield, ShieldAlert } from "lucide-react";

interface RosterTableProps {
  players: Player[];
  isAdmin: boolean;
  onRemovePlayer: (playerId: number) => void;
  onChangeRole: (playerId: number, role: Role) => void;
}

export function RosterTable({ players, isAdmin, onRemovePlayer, onChangeRole }: RosterTableProps) {
  const [playerToRemove, setPlayerToRemove] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  return (
    <>
      <div className="border rounded-xl bg-white overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b text-slate-600">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium w-32">Role</th>
              {isAdmin && <th className="p-4 font-medium w-16 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y text-slate-700">
            {players.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 3 : 2} className="p-8 text-center text-slate-500">
                  No players in the roster yet.
                </td>
              </tr>
            ) : (
              players.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4">
                    <RoleBadge role={p.role} />
                  </td>
                  {isAdmin && (
                    <td className="p-4 text-right relative">
                      <button 
                        onClick={() => setMenuOpen(menuOpen === p.id ? null : p.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {menuOpen === p.id && (
                        <div className="absolute right-8 top-4 z-10 w-48 bg-white border rounded-lg shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                          <button 
                            onClick={() => { onChangeRole(p.id, "CAPTAIN"); setMenuOpen(null); }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Shield size={14} className="text-amber-500" /> Make Captain
                          </button>
                          <button 
                            onClick={() => { onChangeRole(p.id, "VICE_CAPTAIN"); setMenuOpen(null); }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2"
                          >
                            <ShieldAlert size={14} className="text-blue-500" /> Make Vice Captain
                          </button>
                          <button 
                            onClick={() => { onChangeRole(p.id, "PLAYER"); setMenuOpen(null); }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
                          >
                            Remove Role
                          </button>
                          <div className="h-px bg-slate-100 my-1" />
                          <button 
                            onClick={() => { setPlayerToRemove(p.id); setMenuOpen(null); }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                          >
                            <UserMinus size={14} /> Remove Player
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={playerToRemove !== null}
        title="Remove Player"
        description="Are you sure you want to remove this player from the team? This action cannot be undone."
        confirmText="Remove"
        isDestructive
        onConfirm={() => {
          if (playerToRemove !== null) {
            onRemovePlayer(playerToRemove);
            setPlayerToRemove(null);
          }
        }}
        onCancel={() => setPlayerToRemove(null)}
      />
    </>
  );
}
