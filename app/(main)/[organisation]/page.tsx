"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FolderGit2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProjectScope } from "@/stores/project-scope";
import { useOrganisation } from "@/stores/organisation";
import { useProject } from "@/stores/project";

export default function Organisation() {
  const router = useRouter();
  const { currentOrganisation } = useOrganisation();
  const { projects, isLoading, fetchProjects, setActiveProject } =
    useProjectScope();
  const { setCurrentProject } = useProject();

  // Reset project state and fetch projects when visiting this page
  useEffect(() => {
    // Reset both project stores
    setCurrentProject(null);
    setActiveProject(null);

    if (currentOrganisation?.id) {
      fetchProjects(currentOrganisation.id);
    }
  }, [
    currentOrganisation?.id,
    fetchProjects,
    setCurrentProject,
    setActiveProject,
  ]);

  const handleCreateProject = () => {
    // TODO: Implement create project functionality
    console.log("Create project clicked");
  };

  if (!currentOrganisation) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={handleCreateProject}>
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground animate-pulse">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No projects available. Create your first project to get started.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.project_id}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() =>
                router.push(
                  `/${currentOrganisation.slug}/${project.project_slug}/dashboard`
                )
              }
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <FolderGit2 className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-lg">
                    {project.project_name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {project.project_description || "No description available"}
                </p>
                <div className="mt-4">
                  <span className="text-xs text-muted-foreground">
                    Role: {project.role_name}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
