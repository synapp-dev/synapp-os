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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Building2, Plus } from "lucide-react";
import { useOrganisationStore } from "@/stores/organisation-scope";
import { useRouter } from "next/navigation";

interface NewOrganisationSheetProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function NewOrganisationSheet({
  trigger,
  open,
  onOpenChange,
}: NewOrganisationSheetProps) {
  const router = useRouter();
  const { createOrganisation } = useOrganisationStore();
  
  const [organisationName, setOrganisationName] = React.useState("");
  const [organisationDescription, setOrganisationDescription] = React.useState("");
  const [organisationSlug, setOrganisationSlug] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Auto-generate slug from name
  React.useEffect(() => {
    if (organisationName) {
      const slug = organisationName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setOrganisationSlug(slug);
    }
  }, [organisationName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organisationName.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newOrganisation = await createOrganisation({
        name: organisationName.trim(),
        description: organisationDescription.trim() || null,
        slug: organisationSlug.trim() || null,
      });

      if (newOrganisation) {
        // Reset form
        setOrganisationName("");
        setOrganisationDescription("");
        setOrganisationSlug("");
        
        // Close sheet
        onOpenChange?.(false);
        
        // Navigate to the new organisation
        router.push(`/${newOrganisation.organisation_slug || newOrganisation.organisation_id}`);
      }
    } catch (error) {
      console.error("Failed to create organisation:", error);
      // TODO: Add proper error handling/toast notification
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setOrganisationName("");
    setOrganisationDescription("");
    setOrganisationSlug("");
    onOpenChange?.(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </SheetTrigger> */}
      <SheetContent
        className="w-[400px] sm:w-[540px] mx-auto h-fit"
        side="top"
      >
        <Card>
          <SheetHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Building2 className="size-4" />
              </div>
              <div>
                <SheetTitle>Create New Organisation</SheetTitle>
                <SheetDescription>
                  Set up a new organisation for your team
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Organisation Details</h3>

              <div className="space-y-2">
                <Label htmlFor="organisation-name">Organisation Name *</Label>
                <Input
                  id="organisation-name"
                  value={organisationName}
                  onChange={(e) => setOrganisationName(e.target.value)}
                  placeholder="Enter organisation name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organisation-slug">Organisation Slug</Label>
                <Input
                  id="organisation-slug"
                  value={organisationSlug}
                  onChange={(e) => setOrganisationSlug(e.target.value)}
                  placeholder="organisation-slug"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  This will be used in the URL. Leave empty to auto-generate from the name.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organisation-description">Description</Label>
                <Textarea
                  id="organisation-description"
                  value={organisationDescription}
                  onChange={(e) => setOrganisationDescription(e.target.value)}
                  placeholder="Enter organisation description"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </form>

          <div className="flex gap-2 pt-6 border-t">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={!organisationName.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Creating...
                </>
              ) : (
                "Create Organisation"
              )}
            </Button>
          </div>
        </Card>
      </SheetContent>
    </Sheet>
  );
} 