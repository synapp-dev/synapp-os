import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";
import { Json } from "@/types/supabase";

export interface ProjectScope {
  project_id: string;
  project_name: string;
  project_description: string;
  project_slug: string;
  role_id: string;
  role_name: string;
  permissions: Json;
}

interface ProjectScopeStore {
  projects: ProjectScope[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: (orgId: string) => Promise<void>;
}

export const useProjectScope = create<ProjectScopeStore>((set) => ({
  projects: [],
  isLoading: false,
  error: null,
  fetchProjects: async (orgId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser()
      console.log("Current Supabase User ID:", { user });
      
      const { data, error } = await supabase.rpc("get_user_project_scope", {
        org_id: orgId,
      });
      
      console.log("Project RPC Response:", { data, error });
      
      if (error) throw error;
      
      set({ projects: data, isLoading: false });
    } catch (error) {
      console.error("Project RPC Error:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));
