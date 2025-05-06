import { create } from "zustand";

export interface Organisation {
  id: string;
  name: string;
  slug: string;
}

interface OrganisationStore {
  currentOrganisation: Organisation | null;
  setCurrentOrganisation: (org: Organisation | null) => void;
}

export const useOrganisation = create<OrganisationStore>((set) => ({
  currentOrganisation: null,
  setCurrentOrganisation: (org) => set({ currentOrganisation: org }),
})); 