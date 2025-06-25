import { create } from 'zustand';
import { createBrowserClient } from '@/utils/supabase/client';
import type { Route } from '@/types/database';

interface RouteState {
  routes: Route[];
  projectTypeRouteIds: string[];
  rolePermissionRouteIds: string[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchRoutes: (orgSlug: string, projectSlug: string) => Promise<void>;
  fetchRoutesByProjectType: (projectTypeId: string) => Promise<void>;
  fetchRolePermissions: (roleId: string, projectTypeId: string) => Promise<void>;
  addRouteToProjectType: (projectTypeId: string, routeId: string) => Promise<void>;
  removeRouteFromProjectType: (projectTypeId: string, routeId: string) => Promise<void>;
  addRouteToRole: (roleId: string, projectTypeId: string, routeId: string) => Promise<void>;
  removeRouteFromRole: (roleId: string, projectTypeId: string, routeId: string) => Promise<void>;
  clearProjectTypeRoutes: () => void;
  clearRolePermissions: () => void;
  setError: (error: string | null) => void;
}

export const useRouteStore = create<RouteState>((set, get) => ({
  routes: [],
  projectTypeRouteIds: [],
  rolePermissionRouteIds: [],
  loading: false,
  error: null,

  fetchRoutes: async (orgSlug: string, projectSlug: string) => {
    set({ loading: true, error: null });
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.rpc('get_all_routes__admin', {
        org_slug: orgSlug,
        project_slug: projectSlug,
      });

      if (error) {
        set({ error: error.message });
      } else {
        set({ routes: data || [] });
      }
    } catch {
      set({ error: 'Failed to fetch routes' });
    } finally {
      set({ loading: false });
    }
  },

  fetchRoutesByProjectType: async (projectTypeId: string) => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.rpc('get_routes_by_project_type_id', {
        arg_project_type_id: projectTypeId,
      });

      if (error) {
        set({ error: error.message });
      } else {
        const routeIds = data?.map((item) => item.route_id) || [];
        set({ projectTypeRouteIds: routeIds });
      }
    } catch {
      set({ error: 'Failed to fetch project type routes' });
    }
  },

  fetchRolePermissions: async (roleId: string, projectTypeId: string) => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.rpc('get_project_type_route_role_permissions_by_role_id', {
        arg_role_id: roleId,
        arg_project_type_id: projectTypeId,
      });

      if (error) {
        set({ error: error.message });
      } else {
        const routeIds = Array.isArray(data) ? data.map((item) => item.route_id) : [];
        set({ rolePermissionRouteIds: routeIds });
      }
    } catch {
      set({ error: 'Failed to fetch role permissions' });
    }
  },

  addRouteToProjectType: async (projectTypeId: string, routeId: string) => {
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.rpc('add_route_to_project_type', {
        arg_project_type_id: projectTypeId,
        arg_route_id: routeId,
      });

      if (error) {
        set({ error: error.message });
      } else {
        // Refresh the project type routes after adding
        await get().fetchRoutesByProjectType(projectTypeId);
      }
    } catch {
      set({ error: 'Failed to add route to project type' });
    }
  },

  removeRouteFromProjectType: async (projectTypeId: string, routeId: string) => {
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.rpc('remove_route_from_project_type', {
        arg_project_type_id: projectTypeId,
        arg_route_id: routeId,
      });

      if (error) {
        set({ error: error.message });
      } else {
        // Refresh the project type routes after removing
        await get().fetchRoutesByProjectType(projectTypeId);
      }
    } catch {
      set({ error: 'Failed to remove route from project type' });
    }
  },

  addRouteToRole: async (roleId: string, projectTypeId: string, routeId: string) => {
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.rpc('add_route_to_role', {
        arg_role_id: roleId,
        arg_project_type_id: projectTypeId,
        arg_route_id: routeId,
      });

      if (error) {
        set({ error: error.message });
      } else {
        // Refresh the role permissions after adding
        await get().fetchRolePermissions(roleId, projectTypeId);
      }
    } catch {
      set({ error: 'Failed to add route to role' });
    }
  },

  removeRouteFromRole: async (roleId: string, projectTypeId: string, routeId: string) => {
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.rpc('remove_route_from_role', {
        arg_role_id: roleId,
        arg_project_type_id: projectTypeId,
        arg_route_id: routeId,
      });

      if (error) {
        set({ error: error.message });
      } else {
        // Refresh the role permissions after removing
        await get().fetchRolePermissions(roleId, projectTypeId);
      }
    } catch {
      set({ error: 'Failed to remove route from role' });
    }
  },

  clearProjectTypeRoutes: () => {
    set({ projectTypeRouteIds: [] });
  },

  clearRolePermissions: () => {
    set({ rolePermissionRouteIds: [] });
  },

  setError: (error: string | null) => {
    set({ error });
  },
})); 