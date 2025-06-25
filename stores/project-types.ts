/**
 * @module ProjectTypes
 * @description Manages project types data and operations.
 * This module provides a Zustand store for handling project types,
 * including fetching, caching, and utility methods.
 */

import { createBrowserClient } from "@/utils/supabase/client";
import { create } from "zustand";
import type { ProjectType } from "@/types/database";

/**
 * Zustand store interface for managing project types state and operations
 */
interface ProjectTypesStore {
  /** Array of all project types */
  projectTypes: ProjectType[];
  /** Loading state indicator */
  isLoading: boolean;
  /** Error state message */
  error: string | null;
  /** Timestamp of last fetch to enable caching */
  lastFetched: number | null;
  
  /** Fetches all project types from the database */
  fetchProjectTypes(): Promise<void>;
  
  /** Returns all project types in the store */
  getProjectTypes(): ProjectType[];
  
  /** Finds a project type by its ID */
  getProjectTypeById(id: string): ProjectType | undefined;
  
  /** Finds a project type by its name */
  getProjectTypeByName(name: string): ProjectType | undefined;
  
  /** Clears the store data */
  clearProjectTypes(): void;
  
  /** Checks if data is stale (older than 5 minutes) */
  isDataStale(): boolean;
}

/**
 * Zustand store for managing project types
 */
export const useProjectTypes = create<ProjectTypesStore>((set, get) => ({
  projectTypes: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  /** Fetches all project types from the database */
  fetchProjectTypes: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const supabase = createBrowserClient();
      
      const { data, error } = await supabase.rpc("get_all_project_types");

      if (error) throw error;

      set({ 
        projectTypes: data || [], 
        isLoading: false, 
        lastFetched: Date.now() 
      });
    } catch (error) {
      console.error("Project Types RPC Error:", error);
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },

  /** Returns all project types in the store */
  getProjectTypes: () => {
    const { projectTypes } = get();
    return projectTypes;
  },

  /** Finds a project type by its ID */
  getProjectTypeById: (id: string) => {
    const { projectTypes } = get();
    return projectTypes.find(projectType => projectType.id === id);
  },

  /** Finds a project type by its name */
  getProjectTypeByName: (name: string) => {
    const { projectTypes } = get();
    return projectTypes.find(projectType => 
      projectType.name.toLowerCase() === name.toLowerCase()
    );
  },

  /** Clears the store data */
  clearProjectTypes: () => {
    set({ 
      projectTypes: [], 
      error: null, 
      lastFetched: null 
    });
  },

  /** Checks if data is stale (older than 5 minutes) */
  isDataStale: () => {
    const { lastFetched } = get();
    if (!lastFetched) return true;
    
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    return Date.now() - lastFetched > fiveMinutes;
  }
})); 