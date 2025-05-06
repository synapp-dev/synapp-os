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

// This is sample data for user
const data = {
  user: {
    name: "Aaron Girton",
    email: "aaron@synapp.com.au",
    avatar: "/avatars/shadcn.jpg",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { projects } = useProjectScope();
  const activeProject = projects[0]; // Get the first project as active for now
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
        {isLoading ? (
          <div className="p-4 text-center">Loading navigation...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : navSections.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No navigation items available
          </div>
        ) : (
          navSections
            .filter((section) => section.items && section.items.length > 0)
            .map((section) => <NavSection key={section.id} {...section} />)
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
