"use client";

import * as React from "react";
import { Building2, ChevronsUpDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useOrganisationStore } from "@/stores/organisation-scope";
import { IfCan, usePermissionWithLoading } from "@/lib/permissions";
import { NewOrganisationSheet } from "@/components/organisms/new-organisation-sheet";

export function OrganisationSwitcher() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const {
    getOrganisations,
    getActiveOrganisation,
    setActiveOrganisation,
    fetchSubscriptions,
    isLoading,
  } = useOrganisationStore();

  // Check create organisation permission with loading state
  const { allowed: canCreateOrganisation, loading: permissionLoading } = usePermissionWithLoading('create_organisation');
  
  // State to control the new organisation sheet
  const [isCreateSheetOpen, setIsCreateSheetOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const organisations = getOrganisations();
  const activeOrganisation = getActiveOrganisation();

  const handleOrganisationSelect = (orgId: string) => {
    const selectedOrg = organisations.find(
      (org) => org.organisation_id === orgId
    );
    if (selectedOrg) {
      setActiveOrganisation(orgId);
      // Update the URL with the new organisation slug
      const currentPath = window.location.pathname;
      const newPath = currentPath.replace(
        /\/[^/]+/,
        `/${selectedOrg.organisation_slug}`
      );
      router.push(newPath);
    }
  };

  const handleCreateOrganisation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(false); // Close the dropdown first
    setTimeout(() => {
      setIsCreateSheetOpen(true); // Then open the sheet
    }, 100); // Small delay to ensure dropdown closes first
  };

  if (isLoading) {
    return (
      <>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" disabled>
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Building2 className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  Loading organisations...
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        {/* Include sheet for all cases */}
        <NewOrganisationSheet
          open={isCreateSheetOpen}
          onOpenChange={setIsCreateSheetOpen}
        />
      </>
    );
  }

  // If there's only one organisation, render a simple button without dropdown but still include create option
  if (organisations.length === 1) {
    const organisation = organisations[0];
    return (
      <>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Building2 className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {organisation.organisation_name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {organisation.role_name}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="start"
                side={isMobile ? "bottom" : "right"}
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-muted-foreground text-xs">
                  Organisations
                </DropdownMenuLabel>
                <DropdownMenuItem
                  key={organisation.organisation_id}
                  onClick={() =>
                    handleOrganisationSelect(organisation.organisation_id)
                  }
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <Building2 className="size-3.5 shrink-0" />
                  </div>
                  {organisation.organisation_name}
                  <DropdownMenuShortcut>⌘1</DropdownMenuShortcut>
                </DropdownMenuItem>
                
                <IfCan action="create_organisation">
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-2 p-2"
                    onClick={handleCreateOrganisation}
                    disabled={permissionLoading}
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                      {permissionLoading ? (
                        <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Plus className="size-4" />
                      )}
                    </div>
                    <div className="font-medium">
                      {permissionLoading ? "Checking permission..." : "Create organisation"}
                    </div>
                  </DropdownMenuItem>
                </IfCan>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        
        {/* Render the sheet outside the dropdown to avoid conflicts */}
        <NewOrganisationSheet
          open={isCreateSheetOpen}
          onOpenChange={setIsCreateSheetOpen}
        />
      </>
    );
  }

  // If there are multiple organisations, render the dropdown switcher
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {activeOrganisation ? (
                    <Building2 className="size-4" />
                  ) : (
                    <Building2 className="size-4" />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {activeOrganisation?.organisation_name ||
                      "No organisation selected"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {activeOrganisation?.role_name || "Create a new organisation"}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Organisations
              </DropdownMenuLabel>
              {organisations.length > 0 ? (
                organisations.map((organisation, index) => (
                  <DropdownMenuItem
                    key={organisation.organisation_id}
                    onClick={() =>
                      handleOrganisationSelect(organisation.organisation_id)
                    }
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border">
                      <Building2 className="size-3.5 shrink-0" />
                    </div>
                    {organisation.organisation_name}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem className="gap-2 p-2 text-muted-foreground">
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <Building2 className="size-3.5 shrink-0" />
                  </div>
                  No organisations found
                </DropdownMenuItem>
              )}
              <IfCan action="create_organisation">
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 p-2"
                  onClick={handleCreateOrganisation}
                  disabled={permissionLoading}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    {permissionLoading ? (
                      <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Plus className="size-4" />
                    )}
                  </div>
                  <div className="font-medium">
                    {permissionLoading ? "Checking permission..." : "Create organisation"}
                  </div>
                </DropdownMenuItem>
              </IfCan>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      
      {/* Render the sheet outside the dropdown to avoid conflicts */}
      <NewOrganisationSheet
        open={isCreateSheetOpen}
        onOpenChange={setIsCreateSheetOpen}
      />
    </>
  );
}
