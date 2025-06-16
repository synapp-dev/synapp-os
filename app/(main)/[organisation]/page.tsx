"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderGit2, Plus, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProjectScope } from "@/stores/project-scope";
import { useOrganisation } from "@/stores/organisation";
import { useProject } from "@/stores/project";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";
import { z } from "zod";
import { ProjectTypeCombobox } from "@/components/ui/project-type-combobox";
import { createBrowserClient } from "@/utils/supabase/client";

const projectNameSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(35, "Project name must be less than 35 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Project name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
});

export default function Organisation() {
  const router = useRouter();
  const { currentOrganisation } = useOrganisation();
  const { projects, isLoading, fetchProjects, setActiveProject } =
    useProjectScope();
  const { setCurrentProject } = useProject();
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectType, setProjectType] = useState("web-app");
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [isNameAvailable, setIsNameAvailable] = useState(true);
  const [nameError, setNameError] = useState<string | null>(null);
  const supabase = createBrowserClient();

  // Generate slug from project name
  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, "");
  };

  // Validate project name
  const validateProjectName = (name: string) => {
    try {
      projectNameSchema.parse({ name });
      setNameError(null);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setNameError(error.errors[0].message);
      }
      return false;
    }
  };

  // Check if project name is unique
  const checkProjectName = async (name: string) => {
    if (!name || !currentOrganisation?.id) return;

    setIsCheckingName(true);
    try {
      const { data, error } = await supabase.rpc("check_project_name", {
        p_name: name,
        p_org_id: currentOrganisation.id,
      });

      if (error) {
        console.error("Error checking project name:", error);
      }

      console.log("Project name check response:", { name, isTaken: data });
      setIsNameAvailable(!data);
    } catch (error) {
      console.error("Error checking project name:", error);
    } finally {
      setIsCheckingName(false);
    }
  };

  // Debounce the name check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (projectName) {
        validateProjectName(projectName);
        // Only check availability if name is long enough
        if (projectName.length >= 3) {
          checkProjectName(projectName);
        } else {
          setIsNameAvailable(true); // Reset availability state for short names
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [projectName]);

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
    setIsCreateSheetOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isNameAvailable || !validateProjectName(projectName)) return;

    // TODO: Implement project creation logic
    console.log("Creating project:", {
      projectName,
      projectDescription,
      projectType,
      slug: generateSlug(projectName),
    });
    setIsCreateSheetOpen(false);
    setProjectName("");
    setProjectDescription("");
    setProjectType("web-app");
    setNameError(null);
  };

  if (!currentOrganisation) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6 gap-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={handleCreateProject}>
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </div>

      <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
        <SheetContent
          side="top"
          className="h-fit max-w-md rounded-b-lg mx-auto inset-x-0 [&_[data-overlay-wrapper]]:bg-black/90"
        >
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <FolderGit2 className="h-4 w-4" />
              Create New Project
            </SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6 px-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="projectName"
                    className="text-xs text-muted-foreground ml-2"
                  >
                    Project Name
                  </Label>
                  <span
                    className={cn(
                      "text-xs",
                      projectName.length > 0 && projectName.length < 3
                        ? "text-orange-500"
                        : "text-muted-foreground"
                    )}
                  >
                    {projectName.length}/35
                  </span>
                </div>
                {projectName && (
                  <span className="font-mono text-xs text-muted-foreground">
                    /{generateSlug(projectName)}
                  </span>
                )}
              </div>
              <div className="relative">
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  required
                  minLength={3}
                  maxLength={35}
                  className={cn(
                    "focus-visible:ring-offset-0",
                    !isNameAvailable
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "",
                    isNameAvailable && projectName.length >= 3
                      ? "border-green-500 focus-visible:ring-green-500"
                      : "",
                    nameError
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "",
                    projectName.length > 0 && projectName.length < 3
                      ? "border-orange-500 focus-visible:ring-orange-500"
                      : ""
                  )}
                />
                {isCheckingName ? (
                  <Loader2 className="absolute right-3 top-2 h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  projectName &&
                  projectName.length >= 3 &&
                  (isNameAvailable ? (
                    <CheckCircle2 className="absolute right-3 top-2 h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="absolute right-3 top-2 h-5 w-5 text-red-500" />
                  ))
                )}
              </div>
              {nameError && <p className="text-xs text-red-500">{nameError}</p>}
              {!isNameAvailable && !nameError && (
                <p className="text-xs text-red-500">
                  This project name is already taken
                </p>
              )}
              {projectName.length > 0 &&
                projectName.length < 3 &&
                !nameError && (
                  <p className="text-xs text-orange-500">
                    Project name must be at least 3 characters
                  </p>
                )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="projectType"
                className="text-xs text-muted-foreground ml-2"
              >
                Project Type
              </Label>
              <ProjectTypeCombobox
                value={projectType}
                onValueChange={setProjectType}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="projectDescription"
                className="text-xs text-muted-foreground ml-2"
              >
                Description
              </Label>
              <Textarea
                id="projectDescription"
                value={projectDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setProjectDescription(e.target.value)
                }
                placeholder="Enter project description"
                rows={3}
              />
            </div>
            <SheetFooter className="mt-6">
              <Button
                type="submit"
                disabled={!isNameAvailable || isCheckingName}
              >
                Create Project
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

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
