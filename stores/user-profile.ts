import { create } from "zustand";

import { Database } from "@/types/supabase";
import { createBrowserClient } from "@/utils/supabase/client";

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface UserProfileStore {
  currentUser: UserProfile | null;
  authEmail: string | null;
  loading: boolean;
  error: Error | null;
  fetchCurrentUser: () => Promise<void>;
}

export const useUserProfile = create<UserProfileStore>((set) => ({
  currentUser: null,
  authEmail: null,
  loading: false,
  error: null,
  fetchCurrentUser: async () => {
    set({ loading: true, error: null });
    try {
      // Get auth user first
      const supabase = createBrowserClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        set({ loading: false, error: sessionError });
        return;
      }

      if (!session) {
        console.log('No active session');
        set({ loading: false, currentUser: null, authEmail: null });
        return;
      }

      // Then get profile
      const { data: userProfile, error: profileError } = await supabase
        .rpc('get_user_profile').maybeSingle();


      if (profileError) {
        console.error("Profile error:", profileError);
        throw profileError;
      }
      
      set({ 
        currentUser: userProfile as UserProfile, 
        authEmail: session.user.email || null,
        loading: false 
      });
    } catch (error) {
      console.error('Store error:', error);
      set({ error: error as Error, loading: false });
    }
  },
})); 