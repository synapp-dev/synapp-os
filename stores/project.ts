import { create } from "zustand";

export interface Project {
  id: string;
  name: string;
  slug: string;
}

interface ProjectStore {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
}

export const useProject = create<ProjectStore>((set) => ({
  currentProject: null,
  setCurrentProject: (project) => set({ currentProject: project }),
})); 