"use client";

import * as React from "react";

import { NavUser } from "@/components/nav-user";
import { OrganisationSwitcher } from "@/components/organisation-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ProjectSwitcher } from "@/components/project-switcher";
import { Separator } from "@/components/ui/separator";
import { NavSection } from "@/components/nav-section";
import { useNavigation } from "@/hooks/use-navigation";
import { useProjectScope } from "@/stores/project-scope";
import { LoaderPinwheel } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { getActiveProject } = useProjectScope();
  const activeProject = getActiveProject();
  const { navSections, isLoading, error } = useNavigation(
    activeProject?.project_id || ""
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrganisationSwitcher />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <div className="px-2 pt-4">
          <ProjectSwitcher />
        </div>
        {!activeProject ? (
          <></>
        ) : isLoading ? (
          <div className="p-4 text-muted-foreground text-sm animate-pulse w-full flex justify-center items-center">
            <LoaderPinwheel className="w-4 h-4 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : navSections.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No navigation items available
          </div>
        ) : (
          <div key={activeProject.project_id}>
            {navSections
              .filter((section) => section.items && section.items.length > 0)
              .map((section) => (
                <NavSection key={section.id} {...section} />
              ))}
          </div>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
