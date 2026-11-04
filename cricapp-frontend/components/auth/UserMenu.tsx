"use client";

import React, { useState, useEffect } from 'react';
import { LogOut, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { AuthModal } from '@/components/auth/AuthModal';

export function UserMenu() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, role, loading, initialize, signOut } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <div className="h-8 w-20 bg-slate-100 rounded-lg animate-pulse" />
    );
  }

  if (!user) {
    return (
      <>
        <Button
          onClick={() => setIsAuthModalOpen(true)}
          variant="outline"
          className="text-teal-600 border-teal-600 hover:bg-teal-50 hover:text-teal-700 bg-transparent rounded-lg px-5 font-semibold cursor-pointer"
        >
          Sign in
        </Button>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs uppercase border border-teal-200">
          {displayName.slice(0, 2)}
        </div>
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-800 leading-tight">{displayName}</span>
          {role && (
            <span className="text-[10px] text-teal-700 font-semibold uppercase flex items-center gap-0.5">
              <Shield size={10} /> {role}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => signOut()}
        title="Sign Out"
        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
}

