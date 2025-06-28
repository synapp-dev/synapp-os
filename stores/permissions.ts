import { create } from 'zustand';
import { createBrowserClient } from '@/utils/supabase/client';

const supabase = createBrowserClient();

interface PermissionsState {
  // Cache for permission results
  permissionCache: Map<string, boolean>;
  // Loading states for individual permissions
  loadingStates: Map<string, boolean>;
  
  // Actions
  checkPermission: (actionName: string) => Promise<boolean>;
  getCachedPermission: (actionName: string) => boolean | undefined;
  clearCache: () => void;
  clearPermission: (actionName: string) => void;
}

export const usePermissionsStore = create<PermissionsState>((set, get) => ({
  permissionCache: new Map(),
  loadingStates: new Map(),

  checkPermission: async (actionName: string) => {
    const { permissionCache, loadingStates } = get();
    
    // Check if already cached
    if (permissionCache.has(actionName)) {
      return permissionCache.get(actionName)!;
    }

    // Check if already loading
    if (loadingStates.get(actionName)) {
      // Wait for the existing request to complete
      return new Promise((resolve) => {
        const checkComplete = () => {
          const cached = permissionCache.get(actionName);
          if (cached !== undefined) {
            resolve(cached);
          } else {
            setTimeout(checkComplete, 50); // Poll every 50ms
          }
        };
        checkComplete();
      });
    }

    // Set loading state
    set((state) => ({
      loadingStates: new Map(state.loadingStates).set(actionName, true),
    }));

    try {
      const { data, error } = await supabase.rpc('check_action_permission', {
        action_name: actionName,
      });

      if (error) {
        console.error(`[PermissionsStore] Error checking "${actionName}":`, error);
        const result = false;
        
        // Cache the result (even false results)
        set((state) => ({
          permissionCache: new Map(state.permissionCache).set(actionName, result),
          loadingStates: new Map(state.loadingStates).set(actionName, false),
        }));
        
        return result;
      }

      const result = data ?? false;
      
      // Cache the result
      set((state) => ({
        permissionCache: new Map(state.permissionCache).set(actionName, result),
        loadingStates: new Map(state.loadingStates).set(actionName, false),
      }));

      return result;
    } catch (error) {
      console.error(`[PermissionsStore] Unexpected error checking "${actionName}":`, error);
      const result = false;
      
      // Cache the result
      set((state) => ({
        permissionCache: new Map(state.permissionCache).set(actionName, result),
        loadingStates: new Map(state.loadingStates).set(actionName, false),
      }));
      
      return result;
    }
  },

  getCachedPermission: (actionName: string) => {
    return get().permissionCache.get(actionName);
  },

  clearCache: () => {
    set({
      permissionCache: new Map(),
      loadingStates: new Map(),
    });
  },

  clearPermission: (actionName: string) => {
    set((state) => {
      const newPermissionCache = new Map(state.permissionCache);
      const newLoadingStates = new Map(state.loadingStates);
      
      newPermissionCache.delete(actionName);
      newLoadingStates.delete(actionName);
      
      return {
        permissionCache: newPermissionCache,
        loadingStates: newLoadingStates,
      };
    });
  },
})); 