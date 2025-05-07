"use client";

import * as React from "react";
import {
  ChevronsUpDown,
  FolderGit2,
  Plus,
  MousePointer2,
  LoaderPinwheel,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useProjectScope } from "@/stores/project-scope";
import { useOrganisation } from "@/stores/organisation";

export function ProjectSwitcher() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { currentOrganisation } = useOrganisation();
  const { projects, isLoading, fetchProjects, activeProjectId, selectProject } =
    useProjectScope();

  React.useEffect(() => {
    if (currentOrganisation?.id) {
      fetchProjects(currentOrganisation.id);
    }
  }, [currentOrganisation?.id, fetchProjects]);

  const handleCreateProject = () => {
    // TODO: Implement create project functionality
    console.log("Create project clicked");
  };

  if (!currentOrganisation) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div
                className={`flex aspect-square size-8 items-center justify-center rounded-lg transition-all duration-1000 ${
                  isLoading || !activeProjectId
                    ? "border border-muted"
                    : "border-sidebar-primary border"
                }`}
              >
                {isLoading ? (
                  <LoaderPinwheel className="size-4 animate-spin" />
                ) : !activeProjectId ? (
                  <MousePointer2 className="size-4 animate-[var(--animate-bounce-pulse)]" />
                ) : (
                  <FolderGit2 className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span
                  className="truncate font-medium animate-slide-left-fade-in"
                  key={activeProjectId}
                >
                  {isLoading ? (
                    <p className="animate-slide-down-fade-in text-muted-foreground">
                      Loading...
                    </p>
                  ) : projects.length > 0 ? (
                    projects.find((p) => p.project_id === activeProjectId)
                      ?.project_name || (
                      <div className="animate-pulse">Select a project</div>
                    )
                  ) : (
                    "No projects available"
                  )}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {activeProjectId
                    ? projects.find((p) => p.project_id === activeProjectId)
                        ?.role_name
                    : currentOrganisation.name}
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
              Projects
            </DropdownMenuLabel>

            {projects.map((project) => (
              <DropdownMenuItem
                key={project.project_id}
                className="gap-2 p-2"
                onClick={() => selectProject(project.project_id, router)}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <FolderGit2 className="size-4" />
                </div>
                <div className="grid">
                  <div className="font-medium">{project.project_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {project.role_name}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={handleCreateProject}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="font-medium">Create project</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
