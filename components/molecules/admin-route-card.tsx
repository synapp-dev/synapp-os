import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import type { Route } from "@/types/database";
import React from "react";
import { cn } from "@/lib/utils";
import { RouteSettingsSheet } from "@/components/organisms/route-settings-sheet";
import { useSearchParams } from "next/navigation";
import { useRouteStore } from "@/stores/route";
import { useProjectTypes } from "@/stores/project-types";
import { useRoles } from "@/stores/roles";

export function AdminRouteCard({
  route,
  childRoutes,
  getRouteStatus,
  getIconComponent,
}: {
  route: Route;
  childRoutes: Route[];
  getRouteStatus: (routeId: string) => "active" | "semi-active" | "inactive";
  getIconComponent: (iconName: string) => React.ReactNode;
}) {
  const status = getRouteStatus(route.id);
  const [isHovered, setIsHovered] = React.useState(false);

  const searchParams = useSearchParams();
  const activeProjectTypeId = searchParams.get("project-type") ?? null;
  const activeRole = searchParams.get("role") ?? null;

  const {
    addRouteToProjectType,
    removeRouteFromProjectType,
    addRouteToRole,
    removeRouteFromRole,
  } = useRouteStore();

  const { getProjectTypeById } = useProjectTypes();
  const { getRoleById } = useRoles();
  
  // Get the project type name if we have an active project type ID
  const projectType = activeProjectTypeId ? getProjectTypeById(activeProjectTypeId) : null;
  const projectTypeName = projectType?.name || "Project";

  // Get the role name if we have an active role ID
  const role = activeRole ? getRoleById(activeRole) : null;
  const roleName = role?.name || "Role";

  // Helper function to get Lucide icon component by name
  const getProjectTypeIcon = (iconName: string | null) => {
    if (!iconName) return <LucideIcons.FolderOpenDot className="w-3 h-3" />;
    
    const IconComponent = LucideIcons[
      iconName as keyof typeof LucideIcons
    ] as React.ComponentType<{ className?: string }>;
    
    return IconComponent ? <IconComponent className="w-3 h-3" /> : <LucideIcons.FolderOpenDot className="w-3 h-3" />;
  };

  const handleProjectButtonClick = async () => {
    if (!activeProjectTypeId) return;

    if (status === "inactive") {
      await addRouteToProjectType(activeProjectTypeId, route.id);
    } else {
      await removeRouteFromProjectType(activeProjectTypeId, route.id);
    }
  };

  const handleRoleButtonClick = async () => {
    if (!activeProjectTypeId || !activeRole) return;

    const isRouteActiveForRole = status === "active";

    if (isRouteActiveForRole) {
      await removeRouteFromRole(activeRole, activeProjectTypeId, route.id);
    } else {
      await addRouteToRole(activeRole, activeProjectTypeId, route.id);
    }
  };

  const handleChildRouteClick = async (childRouteId: string) => {
    if (!activeProjectTypeId) return;

    // Check if the child route is currently active for the project type
    const childRouteStatus = getRouteStatus(childRouteId);
    const isChildRouteActive = childRouteStatus === "active" || childRouteStatus === "semi-active";

    if (activeRole) {
      // If role is selected, handle role permissions (like main cards)
      const isRouteActiveForRole = childRouteStatus === "active";
      
      if (isRouteActiveForRole) {
        await removeRouteFromRole(activeRole, activeProjectTypeId, childRouteId);
      } else {
        await addRouteToRole(activeRole, activeProjectTypeId, childRouteId);
      }
    } else {
      // If no role selected, handle project type (add/remove from project type)
      if (isChildRouteActive) {
        await removeRouteFromProjectType(activeProjectTypeId, childRouteId);
      } else {
        await addRouteToProjectType(activeProjectTypeId, childRouteId);
      }
    }
  };

  return (
    <Card
      key={route.id}
      className={cn(
        "relative group hover:shadow-md transition-all flex flex-col justify-between min-h-52",
        status === "active" && "bg-muted/50",
        status === "semi-active" && "bg-muted/5 border-primary/25",
        status === "inactive" && "bg-transparent border border-muted/20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Overlay settings button, only visible on hover */}
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <RouteSettingsSheet
          route={route}
          childRoutes={childRoutes}
          getIconComponent={getIconComponent}
          trigger={
            <Button variant="ghost" size="icon">
              <LucideIcons.Settings className="w-4 h-4" />
            </Button>
          }
        />
      </div>
      <CardHeader
        className={cn(
          "pb-3 flex items-center justify-between",
          status === "inactive" && "text-muted-foreground/50"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={cn(
                "text-xs",
                status === "inactive" &&
                  "text-muted-foreground/50 bg-transparent border border-muted-foreground/5"
              )}
            >
              {route.nav_order}
            </Badge>
            <div className="rounded-full w-0.5 h-0.5 bg-muted-foreground" />
            {getIconComponent(route.lucide_icon)}
            <CardTitle className="">{route.nav_label}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              status === "inactive" &&
                "text-muted-foreground/50 bg-transparent border border-muted-foreground/5"
            )}
          >
            /{route.path}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {activeProjectTypeId && (
          <div className="flex gap-2">
            <Button
              variant={status === "inactive" ? "outline" : "secondary"}
              size="sm"
              className={cn(
                "flex items-center gap-2 text-xs transition-all",
                status === "inactive" &&
                  !isHovered &&
                  "invisible pointer-events-none opacity-0",
                status === "inactive" &&
                  isHovered &&
                  "visible pointer-eevents-auto opacity-100"
              )}
              tabIndex={status === "inactive" && !isHovered ? -1 : 0}
              onClick={handleProjectButtonClick}
            >
              {getProjectTypeIcon(projectType?.lucide_icon ?? null)}
              {projectTypeName}
            </Button>
            {activeRole && (
              <>
                {status === "active" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className={cn(
                      "flex items-center gap-2 text-xs transition-all"
                    )}
                    onClick={handleRoleButtonClick}
                  >
                    <LucideIcons.Users className="w-3 h-3" />
                    {roleName}
                  </Button>
                )}
                {status === "semi-active" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex items-center gap-2 text-xs transition-all",
                      !isHovered && "invisible pointer-events-none opacity-0",
                      isHovered && "visible pointer-events-auto opacity-100"
                    )}
                    tabIndex={!isHovered ? -1 : 0}
                    onClick={handleRoleButtonClick}
                  >
                    <LucideIcons.Users className="w-3 h-3" />
                    {roleName}
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className={cn(status === "inactive" && "opacity-25")}>
        <div className="flex flex-col gap-2">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <LucideIcons.CornerDownRight className="w-3 h-3" />
            <p className="text-muted-foreground/50 text-xs">Children</p>
          </div>

          <div className="flex flex-wrap gap-1">
            {childRoutes?.length > 0 &&
              childRoutes?.map((childRoute) => {
                const childRouteStatus = getRouteStatus(childRoute.id);
                
                // Determine the visual state based on context
                let visualState;
                if (activeRole) {
                  // When role is selected, use the status directly
                  visualState = childRouteStatus;
                } else {
                  // When only project type is selected, treat project type routes as "active"
                  visualState = childRouteStatus === "inactive" ? "inactive" : "active";
                }
                
                return (
                  <Badge
                    key={childRoute.id}
                    variant="secondary"
                    className={cn(
                      "text-xs flex items-center gap-1 cursor-pointer transition-all hover:opacity-80",
                      // Active: in project type (when no role) OR in both project type and role
                      visualState === "active" && "bg-muted",
                      // Semi-active: in project type but not role (only when role is selected)
                      visualState === "semi-active" && "bg-transparent border border-primary/50",
                      // Inactive: in neither
                      visualState === "inactive" && "bg-transparent text-muted-foreground/50"
                    )}
                    onClick={() => handleChildRouteClick(childRoute.id)}
                  >
                    {getIconComponent(childRoute.lucide_icon)}
                    {childRoute.nav_label}
                  </Badge>
                );
              })}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
