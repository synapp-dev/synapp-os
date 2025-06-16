/**
 * @module ProjectScope
 * @description Manages project scope and permissions for users within organizations.
 * This module provides a Zustand store for handling project-related data and operations,
 * including project fetching, selection, and permission management.
 */

import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";
import { Json } from "@/types/supabase";
import { useProject } from "@/stores/project";
import { useOrganisation } from "@/stores/organisation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Represents the scope and permissions of a project for a user
 */
export interface ProjectScope {
  /** Unique identifier for the project */
  project_id: string;
  /** Display name of the project */
  project_name: string;
  /** Detailed description of the project */
  project_description: string;
  /** URL-friendly identifier for the project */
  project_slug: string;
  /** Unique identifier for the user's role in the project */
  role_id: string;
  /** Display name of the user's role */
  role_name: string;
  /** JSON object containing user's permissions for the project */
  permissions: Json;
}

/**
 * Zustand store interface for managing project scope state and operations
 */
interface ProjectScopeStore {
  /** Array of projects the user has access to */
  projects: ProjectScope[];
  /** Currently active project ID */
  activeProjectId: string | null;
  /** Loading state indicator */
  isLoading: boolean;
  /** Error state message */
  error: string | null;
  
  /** Fetches projects for a specific organization from the database */
  fetchProjects(orgId: string): Promise<void>;
  
  /** Returns all projects in the store */
  getProjects(): ProjectScope[];
  
  /** Finds a project by its ID */
  getProjectById(id: string): ProjectScope | undefined;
  
  /** Finds a project by its slug */
  getProjectBySlug(slug: string): ProjectScope | undefined;
  
  /** Returns the currently active project */
  getActiveProject(): ProjectScope | undefined;
  
  /** Sets the active project and updates related stores */
  setActiveProject(id: string | null): void;
  
  /** Selects a project and navigates to its dashboard */
  selectProject(projectId: string, router: AppRouterInstance): void;
}

/**
 * Zustand store for managing project scope and permissions
 */
export const useProjectScope = create<ProjectScopeStore>((set, get) => ({
  projects: [],
  activeProjectId: null,
  isLoading: false,
  error: null,

  /** Fetches projects for a specific organization from the database */
  fetchProjects: async (orgId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const supabase = createClient();
      
      const { data, error } = await supabase.rpc("get_user_project_scope", {
        org_id: orgId,
      });

      if (error) throw error;

      set({ projects: data, isLoading: false });
    } catch (error) {
      console.error("Project RPC Error:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  /** Returns all projects in the store */
  getProjects: () => {
    const { projects } = get();
    return projects;
  },

  /** Finds a project by its ID */
  getProjectById: (id: string) => {
    const { projects } = get();
    return projects.find(project => project.project_id === id);
  },

  /** Finds a project by its slug */
  getProjectBySlug: (slug: string) => {
    const { projects } = get();
    return projects.find(project => project.project_slug === slug);
  },

  /** Returns the currently active project */
  getActiveProject: () => {
    const { projects, activeProjectId } = get();
    return projects.find(project => project.project_id === activeProjectId);
  },

  /** Sets the active project and updates related stores */
  setActiveProject: (id: string | null) => {
    if (id === null) {
      set({ activeProjectId: null });
      useProject.getState().setCurrentProject(null);
      return;
    }
    
    const project = get().getProjectById(id);
    if (project) {
      set({ activeProjectId: id });
      useProject.getState().setCurrentProject({
        id: project.project_id,
        name: project.project_name,
        slug: project.project_slug
      });
    }
  },

  /** Selects a project and navigates to its dashboard */
  selectProject: (projectId: string, router: AppRouterInstance) => {
    const project = get().getProjectById(projectId);
    const currentOrg = useOrganisation.getState().currentOrganisation;
    
    if (project && currentOrg) {
      get().setActiveProject(projectId);
      router.push(`/${currentOrg.slug}/${project.project_slug}/dashboard`);
    }
  }
}));
