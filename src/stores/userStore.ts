import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/client";
import { User } from "@/types/table";
import { UserStore } from "@/types/user-store";
import { toast } from "sonner";
import { create } from "zustand";

const deriveUsername = (authUser: any) => {
  const chosen = authUser.user_metadata?.username?.trim();
  if (chosen) return chosen;

  const local = (authUser.email?.split('@')[0] || 'user')
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 20) || 'user';

  // users.username is UNIQUE; the bare email local part is not
  // (john@a.com and john@b.com would collide). The suffix is derived from
  // the auth id so it is stable across re-syncs.
  return `${local}-${authUser.id.slice(0, 6)}`;
};

const syncUserToPublic = async (authUser: any, userData?: Partial<User>) => {
  if (!authUser?.id) return null;

  const userRecord = {
    id: authUser.id,
    username: deriveUsername(authUser),
    name: userData?.name || authUser.user_metadata?.name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
    avatar: userData?.avatar || authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
    status: 'online',
    last_seen: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('users')
    .upsert(userRecord, { onConflict: 'id' })
    .select('*')
    .single();

  if (error) {
    console.error("Error syncing user:", error);
    return null;
  }
  return data as User;
};

const client = createClient();

export const useUserStore = create<UserStore>((set) => ({
  id: null,
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email: string, password: string, _isRemember: boolean) => {
    try {
      set({ loading: true });
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        toast.error(error.message || "Login failed");
        return false;
      }

      if (data.user) {
        const syncedUser = await syncUserToPublic(data.user);
        if (syncedUser) {
          set({ user: syncedUser, id: syncedUser.id, isAuthenticated: true, token: data.session?.access_token || null });
          toast.success("Login successful");
          return true;
        }
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  register: async (email: string, password: string, name: string, gender: string) => {
    try {
      set({ loading: true });
      const { error } = await client.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { name, gender, username: email.trim().toLowerCase().split('@')[0] },
        },
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        return false;
      }

      toast.success("Registration successful");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      set({ loading: true });
      await client.auth.signOut();
      set({ id: null, user: null, token: null, isAuthenticated: false });
      toast.success("Logout successful");
    } catch (error: any) {
      toast.error("Logout failed");
    } finally {
      set({ loading: false });
    }
  },

  forgetPassword: async (email: string) => {
    try {
      set({ loading: true });
      const { error } = await client.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) {
        toast.error(error.message || "Failed to send reset link");
        return false;
      }
      toast.success("Password reset link sent");
      return true;
    } catch (error: any) {
      toast.error("Failed to send reset link");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  fetchUser: async () => {
    try {
      set({ loading: true });
      const { data: { session } } = await client.auth.getSession();

      if (session?.user) {
        const syncedUser = await syncUserToPublic(session.user);
        if (syncedUser) {
          set({ user: syncedUser, id: syncedUser.id, isAuthenticated: true, token: session.access_token });
        } else {
          set({ user: null, isAuthenticated: false });
        }
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ loading: false });
    }
  },
}));
