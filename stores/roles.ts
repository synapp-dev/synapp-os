/**
 * @module Roles
 * @description Manages roles data and operations.
 * This module provides a Zustand store for handling roles,
 * including fetching, caching, and utility methods.
 */

import { createBrowserClient } from "@/utils/supabase/client";
import { create } from "zustand";

/**
 * Role type from the get_all_roles RPC function
 */
type Role = {
  description: string | null;
  id: string;
  name: string;
  scope_id: string;
};

/**
 * Zustand store interface for managing roles state and operations
 */
interface RolesStore {
  /** Array of all roles */
  roles: Role[];
  /** Loading state indicator */
  isLoading: boolean;
  /** Error state message */
  error: string | null;
  /** Timestamp of last fetch to enable caching */
  lastFetched: number | null;
  
  /** Fetches all roles from the database */
  fetchRoles(): Promise<void>;
  
  /** Returns all roles in the store */
  getRoles(): Role[];
  
  /** Finds a role by its ID */
  getRoleById(id: string): Role | undefined;
  
  /** Finds a role by its name */
  getRoleByName(name: string): Role | undefined;
  
  /** Clears the store data */
  clearRoles(): void;
  
  /** Checks if data is stale (older than 5 minutes) */
  isDataStale(): boolean;
}

/**
 * Zustand store for managing roles
 */
export const useRoles = create<RolesStore>((set, get) => ({
  roles: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  /** Fetches all roles from the database */
  fetchRoles: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const supabase = createBrowserClient();
      
      const { data, error } = await supabase.rpc("get_all_roles");

      if (error) throw error;

      set({ 
        roles: data || [], 
        isLoading: false, 
        lastFetched: Date.now() 
      });
    } catch (error) {
      console.error("Roles RPC Error:", error);
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },

  /** Returns all roles in the store */
  getRoles: () => {
    const { roles } = get();
    return roles;
  },

  /** Finds a role by its ID */
  getRoleById: (id: string) => {
    const { roles } = get();
    return roles.find(role => role.id === id);
  },

  /** Finds a role by its name */
  getRoleByName: (name: string) => {
    const { roles } = get();
    return roles.find(role => 
      role.name.toLowerCase() === name.toLowerCase()
    );
  },

  /** Clears the store data */
  clearRoles: () => {
    set({ 
      roles: [], 
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