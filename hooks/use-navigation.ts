import { useEffect, useState } from "react";
import { createBrowserClient } from "@/utils/supabase/client";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Types

type NavRoute = {
  id: string;
  path: string;
  nav_label: string;
  nav_group_id: string | null;
  nav_group_name: string | null;
  nav_group_label: string | null;
  nav_group_order: number | null;
  nav_order: number;
  lucide_icon: string | null;
  parent_id: string | null;
};

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: NavItem[];
};

type NavSection = {
  id: string | number;
  title: string;
  items: NavItem[];
};

type NavGroup = {
  order: number;
  label: string;
  routes: NavRoute[];
};

function buildNavItemTree(parent: NavRoute, allRoutes: NavRoute[], parentUrl = ""): NavItem {
  const children = allRoutes
    .filter(route => route.parent_id === parent.id)
    .sort((a, b) => a.nav_order - b.nav_order);

  // Build the full URL for this item
  const fullUrl = parentUrl ? `${parentUrl}/${parent.path}` : parent.path;

  return {
    title: parent.nav_label,
    url: fullUrl,
    icon: parent.lucide_icon
      ? ((Icons as unknown) as Record<string, LucideIcon>)[parent.lucide_icon] || undefined
      : undefined,
    items: children.length
      ? children.map(child => buildNavItemTree(child, allRoutes, fullUrl))
      : undefined,
  };
}

export function useNavigation(projectId: string) {
  const [navData, setNavData] = useState<NavRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [navGroups, setNavGroups] = useState<NavGroup[]>([]);

  useEffect(() => {
    async function fetchNavigation() {
      try {
        setIsLoading(true);
        const supabase = createBrowserClient();
        const { data, error } = await supabase.rpc("get_user_project_nav_items", {
          active_project_id: projectId,
        });
        console.log(projectId, data);
        if (error) throw error;
        setNavData(data || []);
        // Group by unique nav_group_order
        if (data) {
          const groupMap: Record<number, NavGroup> = {};
          (data as NavRoute[]).forEach(route => {
            const order = route.nav_group_order ?? 999;
            if (!groupMap[order]) {
              groupMap[order] = {
                order,
                label: route.nav_group_label || route.nav_group_name || 'Other',
                routes: [],
              };
            }
            groupMap[order].routes.push(route);
          });
          const groups = Object.values(groupMap).sort((a, b) => a.order - b.order);
          setNavGroups(groups);
        } else {
          setNavGroups([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch navigation");
      } finally {
        setIsLoading(false);
      }
    }
    if (projectId) {
      fetchNavigation();
    }
  }, [projectId]);

  // Derive navSections for rendering: one section per group, nested items
  const navSections: NavSection[] = navGroups.map(group => {
    // Only top-level routes: must have no parent_id and belong to this group
    const topLevelRoutes = group.routes
      .filter(route => !route.parent_id && route.nav_group_id === group.routes[0].nav_group_id)
      .sort((a, b) => a.nav_order - b.nav_order);
    return {
      id: group.order,
      title: group.label,
      // When building children, always use ALL routes, not just those in the group
      items: topLevelRoutes.map(route => buildNavItemTree(route, navData, "")),
    };
  });

  return { navData, navGroups, navSections, isLoading, error };
} 