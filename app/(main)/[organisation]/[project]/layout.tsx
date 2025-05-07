"use client";

import { useEffect, use } from "react";
import { useOrganisationStore } from "@/stores/organisation-scope";
import { useProjectScope } from "@/stores/project-scope";

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ organisation: string; project: string }>;
}) {
  const unwrappedParams = use(params);
  const { fetchSubscriptions, getOrganisationBySlug, setActiveOrganisation } =
    useOrganisationStore();
  const { fetchProjects, getProjectBySlug, setActiveProject } =
    useProjectScope();

  useEffect(() => {
    const initializeStore = async () => {
      // Fetch user's organizations
      await fetchSubscriptions();

      // Find and set active organization
      const org = getOrganisationBySlug(unwrappedParams.organisation);
      if (org) {
        setActiveOrganisation(org.organisation_id);

        // Fetch and set active project
        await fetchProjects(org.organisation_id);
        const project = getProjectBySlug(unwrappedParams.project);
        if (project) {
          setActiveProject(project.project_id);
        }
      }
    };

    initializeStore();
  }, [
    unwrappedParams.organisation,
    unwrappedParams.project,
    fetchProjects,
    fetchSubscriptions,
    getOrganisationBySlug,
    getProjectBySlug,
    setActiveOrganisation,
    setActiveProject,
  ]);

  return <>{children}</>;
}
