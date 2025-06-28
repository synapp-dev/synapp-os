'use client';

import { useEffect, useState, ReactNode } from 'react';
import { usePermissionsStore } from '@/stores/permissions';

/**
 * RPC wrapper to check if current user can perform an action.
 * Now uses the permissions store for caching.
 */
export async function canPerform(actionName: string): Promise<boolean> {
  return usePermissionsStore.getState().checkPermission(actionName);
}

/**
 * React hook that wraps `canPerform` for use in components.
 * Now uses the permissions store for better performance.
 */
export function usePermission(actionName: string) {
  const [allowed, setAllowed] = useState<boolean>(false);
  const { checkPermission, getCachedPermission } = usePermissionsStore();

  useEffect(() => {
    // Check cache first
    const cached = getCachedPermission(actionName);
    if (cached !== undefined) {
      setAllowed(cached);
      return;
    }

    // If not cached, fetch and cache
    checkPermission(actionName).then(setAllowed);
  }, [actionName, checkPermission, getCachedPermission]);

  return allowed;
}

/**
 * React hook that provides both permission result and loading state.
 */
export function usePermissionWithLoading(actionName: string) {
  const [allowed, setAllowed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { checkPermission, getCachedPermission } = usePermissionsStore();

  useEffect(() => {
    // Check cache first
    const cached = getCachedPermission(actionName);
    if (cached !== undefined) {
      setAllowed(cached);
      setLoading(false);
      return;
    }

    // If not cached, fetch and cache
    setLoading(true);
    checkPermission(actionName).then((result) => {
      setAllowed(result);
      setLoading(false);
    });
  }, [actionName, checkPermission, getCachedPermission]);

  return { allowed, loading };
}

/**
 * Utility function to clear the permissions cache.
 * Useful when user roles or permissions change.
 */
export function clearPermissionsCache(): void {
  usePermissionsStore.getState().clearCache();
}

/**
 * Utility function to clear a specific permission from cache.
 * Useful when a specific permission might have changed.
 */
export function clearPermissionCache(actionName: string): void {
  usePermissionsStore.getState().clearPermission(actionName);
}

/**
 * Conditional wrapper component.
 */
export function IfCan({
  action,
  children,
  fallback = null,
}: {
  action: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const allowed = usePermission(action);

  if (!allowed) return <>{fallback}</>;
  return <>{children}</>;
}
