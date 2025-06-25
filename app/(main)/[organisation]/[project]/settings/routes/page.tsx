"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import * as LucideIcons from "lucide-react";
import type { Route } from "@/types/database";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { ProjectTypeRouteCombobox } from "@/components/molecules/project-type-route-combobox";
import { ProjectTypeRouteRolePermissionsCombobox } from "@/components/molecules/project-type-route-role-permissions-combobox";
import { AdminRouteCard } from "@/components/molecules/admin-route-card";
import { StaggeredAnimation } from "@/components/atoms/staggered-animation";
import { useRouteStore } from "@/stores/route";

function RoutesGrid({
  routes,
  projectTypeRouteIds,
  projectTypeId,
  rolePermissionRouteIds,
  roleId,
}: {
  routes: Route[];
  projectTypeRouteIds: string[];
  projectTypeId: string | null;
  rolePermissionRouteIds: string[];
  roleId: string | null;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter routes based on search query
  const filteredRoutes = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return routes;
    }

    const query = debouncedSearchQuery.toLowerCase();
    return routes.filter((route) => {
      // Search across all relevant fields
      const searchableFields = [
        route.nav_label,
        route.path,
        route.nav_group_label,
        route.lucide_icon,
        route.id,
        route.nav_order?.toString(),
        route.nav_group_order?.toString(),
      ].filter(Boolean);

      return searchableFields.some((field) =>
        field.toLowerCase().includes(query)
      );
    });
  }, [routes, debouncedSearchQuery]);

  // Filter routes without parent_id (null values)
  const parentRoutes = filteredRoutes.filter(
    (route) => route.parent_id === null
  );

  // Group routes by nav_group_label
  const groupedRoutes = parentRoutes.reduce((acc, route) => {
    const groupLabel = route.nav_group_label || "Ungrouped";
    if (!acc[groupLabel]) {
      acc[groupLabel] = [];
    }
    acc[groupLabel].push(route);
    return acc;
  }, {} as Record<string, Route[]>);

  // Sort groups by nav_group_order (use the first route's nav_group_order for each group)
  const sortedGroups = Object.entries(groupedRoutes).sort(
    ([, routesA], [, routesB]) => {
      const orderA = routesA[0]?.nav_group_order ?? 999;
      const orderB = routesB[0]?.nav_group_order ?? 999;
      return orderA - orderB;
    }
  );

  // Helper to determine if a route is active for the current project type
  const isRouteActive = (routeId: string) => {
    // No project type selected: all active
    if (!projectTypeId) return true;
    // Project type selected, but no routes: all inactive
    if (Array.isArray(projectTypeRouteIds) && projectTypeRouteIds.length === 0)
      return false;
    // Project type selected, some routes: only those in the list are active
    return projectTypeRouteIds.includes(routeId);
  };

  // Sort routes within each group by nav_order
  sortedGroups.forEach(([, groupRoutes]) => {
    groupRoutes.sort((a, b) => {
      // First sort by active status (active routes first)
      const aIsActive = isRouteActive(a.id);
      const bIsActive = isRouteActive(b.id);
      if (aIsActive && !bIsActive) return -1;
      if (!aIsActive && bIsActive) return 1;
      // Then sort by nav_order
      return a.nav_order - b.nav_order;
    });
  });

  // Helper to determine status of a route for the current project type/role
  const getRouteStatus = (routeId: string) => {
    if (!projectTypeId) return "active";
    if (!roleId) {
      return projectTypeRouteIds.includes(routeId) ? "active" : "inactive";
    }
    if (rolePermissionRouteIds.includes(routeId)) return "active";
    if (projectTypeRouteIds.includes(routeId)) return "semi-active";
    return "inactive";
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = LucideIcons[
      iconName as keyof typeof LucideIcons
    ] as React.ComponentType<{ className?: string }>;
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
  };

  const getChildRoutes = (parentId: string) => {
    return filteredRoutes
      .filter((route) => route.parent_id === parentId)
      .sort((a, b) => a.nav_order - b.nav_order);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tool Menu */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 -mx-6 px-6">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-4 items-center w-full">
            <Button size="sm">
              <LucideIcons.Plus className="w-4 h-4" />
              New Route
            </Button>

            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search routes by name, path, group, icon, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              {searchQuery && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                  {debouncedSearchQuery !== searchQuery
                    ? "Searching..."
                    : `${parentRoutes.length} result${
                        parentRoutes.length !== 1 ? "s" : ""
                      }`}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-4 items-center w-full justify-end">
            <ProjectTypeRouteCombobox />
            <ProjectTypeRouteRolePermissionsCombobox />
          </div>
        </div>

        <Separator className="mt-4" />
      </div>

      <div className="flex flex-col gap-8">
        {sortedGroups.length > 0 ? (
          sortedGroups.map(([groupLabel, groupRoutes]) => (
            <div key={groupLabel} className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{groupLabel}</h2>
                <Badge variant="outline" className="text-xs">
                  {groupRoutes.length} route
                  {groupRoutes.length !== 1 ? "s" : ""}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupRoutes.map((route, index) => {
                  const childRoutes = getChildRoutes(route.id);
                  return (
                    <StaggeredAnimation key={route.id} index={index}>
                      <AdminRouteCard
                        key={route.id}
                        route={route}
                        childRoutes={childRoutes}
                        getRouteStatus={getRouteStatus}
                        getIconComponent={getIconComponent}
                      />
                    </StaggeredAnimation>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery
              ? "No routes found matching your search."
              : "No routes available."}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RoutesPage() {
  const searchParams = useSearchParams();
  const projectTypeId = searchParams.get("project-type");
  const roleId = searchParams.get("role");

  // Use the Zustand store
  const {
    routes,
    projectTypeRouteIds,
    rolePermissionRouteIds,
    loading,
    error,
    fetchRoutes,
    fetchRoutesByProjectType,
    fetchRolePermissions,
    clearProjectTypeRoutes,
    clearRolePermissions,
  } = useRouteStore();

  // Fetch routes on component mount and when project type changes
  useEffect(() => {
    fetchRoutes("synapp", "administration");
  }, [fetchRoutes]);

  // Fetch project type routes when project type changes
  useEffect(() => {
    if (projectTypeId) {
      fetchRoutesByProjectType(projectTypeId);
    } else {
      clearProjectTypeRoutes();
    }
  }, [projectTypeId, fetchRoutesByProjectType, clearProjectTypeRoutes]);

  // Fetch role permissions when both project type and role are present
  useEffect(() => {
    if (projectTypeId && roleId) {
      fetchRolePermissions(roleId, projectTypeId);
    } else {
      clearRolePermissions();
    }
  }, [projectTypeId, roleId, fetchRolePermissions, clearRolePermissions]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2">
          <LucideIcons.Waypoints className="w-4 h-4" />
          <h1 className="text-2xl font-bold">Routes</h1>
        </div>
      </div>

      {error ? (
        <div className="text-red-500">Error loading routes: {error}</div>
      ) : loading ? (
        <div className="text-muted-foreground">Loading routes...</div>
      ) : (
        <RoutesGrid
          routes={routes}
          projectTypeRouteIds={projectTypeRouteIds}
          projectTypeId={projectTypeId}
          rolePermissionRouteIds={rolePermissionRouteIds}
          roleId={roleId}
        />
      )}
    </div>
  );
}
