"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import * as LucideIcons from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createBrowserClient } from "@/utils/supabase/client";
import { useRouteStore } from "@/stores/route";
import { useParams } from "next/navigation";

/**
 * Props for the NewRouteSheet component
 */
interface NewRouteSheetProps {
  /** Optional parent route ID. If provided, the new route will be created as a child of this route */
  parentId?: string | null;
  /** Custom trigger element. If not provided, defaults to a "New Route" button */
  trigger?: React.ReactNode;
  /** Callback function called when a route is successfully created */
  onRouteCreated?: (routeId: string) => void;
}

/**
 * NewRouteSheet - A reusable component for creating new routes
 *
 * This component can be used anywhere in the application to create new routes.
 * It supports creating both top-level routes and child routes.
 *
 * @example
 * // Basic usage with default trigger
 * <NewRouteSheet />
 *
 * @example
 * // Create a child route with custom trigger
 * <NewRouteSheet
 *   parentId="parent-route-id"
 *   trigger={<Button>Add Child Route</Button>}
 *   onRouteCreated={(routeId) => console.log('Created route:', routeId)}
 * />
 *
 * @example
 * // Create a top-level route with custom trigger
 * <NewRouteSheet
 *   trigger={<Button variant="outline">Create Route</Button>}
 * />
 */
export function NewRouteSheet({
  parentId = null,
  trigger,
  onRouteCreated,
}: NewRouteSheetProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Form state
  const [navLabel, setNavLabel] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [path, setPath] = React.useState("");
  const [navOrder, setNavOrder] = React.useState(0);
  const [lucideIcon, setLucideIcon] = React.useState("");
  const [method, setMethod] = React.useState("GET");
  const [navGroupId, setNavGroupId] = React.useState<string | null>(null);
  const [parentRoute, setParentRoute] = React.useState<string | null>(null);
  const [parentRouteId, setParentRouteId] = React.useState<string | null>(
    parentId ?? null
  );
  const params = useParams();
  const { fetchRoutes } = useRouteStore();

  const resetForm = () => {
    setNavLabel("");
    setDescription("");
    setPath("");
    setNavOrder(0);
    setLucideIcon("");
    setMethod("GET");
    setNavGroupId(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createBrowserClient();

      // Validate required fields
      if (!navLabel.trim() || !path.trim()) {
        throw new Error("Navigation label and path are required");
      }

      // Ensure path starts with /
      const normalizedPath = path.startsWith("/") ? path : `/${path}`;

      const { data, error } = await supabase
        .from("routes")
        .insert({
          nav_label: navLabel.trim(),
          description: description.trim() || null,
          path: normalizedPath,
          nav_order: navOrder,
          lucide_icon: lucideIcon || null,
          method: method,
          nav_group_id: navGroupId,
          parent_id: parentId,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Refresh routes in the store
      if (params.organisation && params.project) {
        await fetchRoutes(
          params.organisation as string,
          params.project as string
        );
      }

      // Call the callback if provided
      if (onRouteCreated && data) {
        onRouteCreated(data.id);
      }

      // Close the sheet and reset form
      setOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create route");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {trigger || (
          <Button size="sm">
            <LucideIcons.Plus className="w-4 h-4" />
            New Route
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="max-w-xl mx-auto" side="top">
        <Card className="rounded-t-none">
          <CardHeader>
            <div className="flex items-center gap-3">
              <LucideIcons.Plus className="w-4 h-4" />
              <div>
                <SheetTitle>Create New Route</SheetTitle>
                <SheetDescription>
                  {parentId
                    ? "Create a new child route"
                    : "Create a new route for your application"}
                </SheetDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-6">
              {/* Basic Information */}
              <div className="space-y-4">
                {/* <h3 className="text-sm font-medium">Basic Information</h3> */}

                <div className="space-y-2">
                  <Label htmlFor="nav-label">Parent Route</Label>
                  <Input
                    id="parent-route"
                    value={parentRoute ?? ""}
                    onChange={(e) => {
                      setParentRoute(e.target.value ?? null);
                      setParentRouteId(parentId ?? null);
                    }}
                    placeholder="Enter parent route"
                    required
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nav-label">Navigation Label</Label>
                  <Input
                    id="nav-label"
                    value={navLabel}
                    onChange={(e) => setNavLabel(e.target.value)}
                    placeholder="Enter navigation label"
                    required
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
                  <Label htmlFor="path">Path *</Label>
                  <Input
                    id="path"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    placeholder="/example-path"
                    required
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
                    min="0"
                  />
                </div>
              </div>

              <Separator />

              {/* Route Configuration */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Route Configuration</h3>

                <div className="space-y-2">
                  <Label htmlFor="method">HTTP Method</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lucide-icon">Icon</Label>
                  <div className="flex items-center gap-2"></div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <LucideIcons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Route"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </SheetContent>
    </Sheet>
  );
}
