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
                "visible pointer-events-auto opacity-100"
            )}
            tabIndex={status === "inactive" && !isHovered ? -1 : 0}
          >
            <LucideIcons.Users className="w-3 h-3" />
            Users
          </Button>
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
                "visible pointer-events-auto opacity-100"
            )}
            tabIndex={status === "inactive" && !isHovered ? -1 : 0}
          >
            <LucideIcons.FolderOpenDot className="w-3 h-3" />
            Open Folder
          </Button>
        </div>
      </CardContent>
      <CardFooter className={cn(status === "inactive" && "opacity-25")}>
        <div className="flex flex-col gap-2">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <LucideIcons.CornerDownRight className="w-3 h-3" />
            <p className="text-muted-foreground/50 text-xs">Children</p>
          </div>

          <div className="flex flex-wrap gap-1">
            <Badge
              variant="secondary"
              className={`text-xs flex items-center gap-1 bg-transparent border border-primary/20`}
            >
              <LucideIcons.Plus className="w-3 h-3" />
              Add
            </Badge>
            {childRoutes?.length > 0 &&
              childRoutes?.map((childRoute) => (
                <Badge
                  key={childRoute.id}
                  variant="secondary"
                  className={cn(
                    "text-xs flex items-center gap-1",
                    status === "active" && "bg-muted/50",
                    status === "semi-active" && "bg-muted/5 border-primary/25",
                    status === "inactive" &&
                      "bg-transparent border border-muted/20"
                  )}
                >
                  {getIconComponent(childRoute.lucide_icon)}
                  {childRoute.nav_label}
                </Badge>
              ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
