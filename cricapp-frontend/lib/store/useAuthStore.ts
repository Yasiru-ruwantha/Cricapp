import { create } from 'zustand';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  role: string | null;
  loading: boolean;
  initialize: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    fullName?: string,
    role?: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  role: null,
  loading: true,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const role =
        (session?.user?.app_metadata?.role as string) ||
        (session?.user?.user_metadata?.role as string) ||
        null;

      set({
        session,
        user: session?.user ?? null,
        role: role ? role.toUpperCase() : null,
        loading: false,
      });

      supabase.auth.onAuthStateChange((_event, newSession) => {
        const newRole =
          (newSession?.user?.app_metadata?.role as string) ||
          (newSession?.user?.user_metadata?.role as string) ||
          null;

        set({
          session: newSession,
          user: newSession?.user ?? null,
          role: newRole ? newRole.toUpperCase() : null,
          loading: false,
        });
      });
    } catch {
      set({ loading: false });
    }
  },

  signInWithEmail: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.session) {
      const role =
        (data.session.user?.app_metadata?.role as string) ||
        (data.session.user?.user_metadata?.role as string) ||
        null;
      set({
        session: data.session,
        user: data.session.user,
        role: role ? role.toUpperCase() : null,
      });
    }
    return { error };
  },

  signUpWithEmail: async (email, password, fullName, role = 'ORGANIZER') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
          role: role,
        },
      },
    });

    if (!error && data.session) {
      set({
        session: data.session,
        user: data.session.user,
        role: role.toUpperCase(),
      });
    }
    return { error };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, role: null });
  },
}));

