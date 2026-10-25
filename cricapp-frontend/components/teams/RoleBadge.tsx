"use client";
import React from 'react';
import { Role } from "@/types/team";

export function RoleBadge({ role }: { role: Role }) {
  if (role === "CAPTAIN") {
    return <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full font-semibold">C</span>;
  }
  if (role === "VICE_CAPTAIN") {
    return <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full font-semibold">VC</span>;
  }
  return null;
}
