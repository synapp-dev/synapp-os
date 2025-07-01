"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import * as LucideIcons from "lucide-react";
import type { Route } from "@/types/database";
import { Card } from "@/components/ui/card";
import { NewRouteSheet } from "@/components/organisms/new-route-sheet";

interface RouteSettingsSheetProps {
  route: Route;
  childRoutes: Route[];
  getIconComponent: (iconName: string) => React.ReactNode;
  trigger?: React.ReactNode;
}

export function RouteSettingsSheet({
  route,
  childRoutes,
  getIconComponent,
  trigger,
}: RouteSettingsSheetProps) {
  const [isEnabled, setIsEnabled] = React.useState(true);
  const [navLabel, setNavLabel] = React.useState(route.nav_label);
  const [description, setDescription] = React.useState(route.description || "");
  const [path, setPath] = React.useState(route.path);
  const [navOrder, setNavOrder] = React.useState(route.nav_order);

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving route settings:", {
      id: route.id,
      navLabel,
      description,
      path,
      navOrder,
      isEnabled,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <LucideIcons.Settings className="w-4 h-4" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        className="w-[400px] sm:w-[540px] mx-auto h-fit"
        side="bottom"
      >
        <Card>
          <SheetHeader>
            <div className="flex items-center gap-3">
              {getIconComponent(route.lucide_icon)}
              <div>
                <SheetTitle>Route Settings</SheetTitle>
                <SheetDescription>
                  Configure settings for {route.nav_label}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex flex-col gap-6 py-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Basic Information</h3>

              <div className="space-y-2">
                <Label htmlFor="nav-label">Navigation Label</Label>
                <Input
                  id="nav-label"
                  value={navLabel}
                  onChange={(e) => setNavLabel(e.target.value)}
                  placeholder="Enter navigation label"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter route description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="path">Path</Label>
                <Input
                  id="path"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  placeholder="/example-path"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nav-order">Navigation Order</Label>
                <Input
                  id="nav-order"
                  type="number"
                  value={navOrder}
                  onChange={(e) => setNavOrder(parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Status</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enabled">Enable Route</Label>
                  <p className="text-xs text-muted-foreground">
                    Show this route in navigation
                  </p>
                </div>
                <Switch
                  id="enabled"
                  checked={isEnabled}
                  onCheckedChange={setIsEnabled}
                />
              </div>
            </div>

            <Separator />

            {/* Child Routes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Child Routes</h3>
                <NewRouteSheet
                  parentId={route.id}
                  trigger={
                    <Button variant="outline" size="sm">
                      <LucideIcons.Plus className="w-4 h-4 mr-2" />
                      Add Child
                    </Button>
                  }
                />
              </div>

              {childRoutes.length > 0 ? (
                <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {childRoutes.map((childRoute) => (
                    <div
                      key={childRoute.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {getIconComponent(childRoute.lucide_icon)}
                        <span className="text-sm font-medium">
                          {childRoute.nav_label}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          /{childRoute.path}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <LucideIcons.Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <LucideIcons.FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No child routes configured</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-6 border-t">
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
          </div>
        </Card>
      </SheetContent>
    </Sheet>
  );
}
