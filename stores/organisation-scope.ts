import { create } from 'zustand';

import { useOrganisation } from './organisation';
import { Json } from '@/types/supabase';
import { createBrowserClient } from '@/utils/supabase/client';

type OrganisationSubscription = {
  organisation_id: string;
  organisation_name: string;
  organisation_slug: string;
  organisation_logo: string;
  organisation_metadata: Json;
  user_role_id: string | null;
  role_id: string;
  role_name: string;
};

interface CreateOrganisationData {
  name: string;
  description?: string | null;
  slug?: string | null;
}

interface OrganisationState {
  subscriptions: OrganisationSubscription[];
  activeOrganisationId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchSubscriptions: () => Promise<void>;
  getOrganisations: () => OrganisationSubscription[];
  getOrganisationById: (id: string) => OrganisationSubscription | undefined;
  getOrganisationBySlug: (slug: string) => OrganisationSubscription | undefined;
  hasRole: (organisationId: string, roleName: string) => boolean;
  getActiveOrganisation: () => OrganisationSubscription | undefined;
  setActiveOrganisation: (id: string) => void;
  createOrganisation: (data: CreateOrganisationData) => Promise<OrganisationSubscription | null>;
}

export const useOrganisationStore = create<OrganisationState>((set, get) => ({
  subscriptions: [],
  activeOrganisationId: null,
  isLoading: false,
  error: null,
  fetchSubscriptions: async () => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createBrowserClient();
      
      const { data, error } = await supabase.rpc('get_user_org_scope');
      
      if (error) throw error;
      
      set({ subscriptions: data, isLoading: false });
      
      // Set active organisation to first one if none is selected
      if (!get().activeOrganisationId && data.length > 0) {
        const firstOrg = data[0];
        set({ activeOrganisationId: firstOrg.organisation_id });
        // Set the current organisation in the useOrganisation store
        useOrganisation.getState().setCurrentOrganisation({
          id: firstOrg.organisation_id,
          name: firstOrg.organisation_name,
          slug: firstOrg.organisation_slug
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch organisation subscriptions',
        isLoading: false 
      });
    }
  },
  getOrganisations: () => {
    const { subscriptions } = get();
    return subscriptions;
  },
  getOrganisationById: (id: string) => {
    const { subscriptions } = get();
    return subscriptions.find(org => org.organisation_id === id);
  },
  getOrganisationBySlug: (slug: string) => {
    const { subscriptions } = get();
    return subscriptions.find(org => org.organisation_slug === slug);
  },
  hasRole: (organisationId: string, roleName: string) => {
    const { subscriptions } = get();
    return subscriptions.some(
      org => org.organisation_id === organisationId && org.role_name === roleName
    );
  },
  getActiveOrganisation: () => {
    const { subscriptions, activeOrganisationId } = get();
    return subscriptions.find(org => org.organisation_id === activeOrganisationId);
  },
  setActiveOrganisation: (id: string) => {
    const org = get().getOrganisationById(id);
    if (org) {
      set({ activeOrganisationId: id });
      // Update the current organisation in the useOrganisation store
      useOrganisation.getState().setCurrentOrganisation({
        id: org.organisation_id,
        name: org.organisation_name,
        slug: org.organisation_slug
      });
    }
  },
  createOrganisation: async (data: CreateOrganisationData) => {
    try {
      const supabase = createBrowserClient();
      
      // Insert the new organisation
      const { data: newOrg, error: insertError } = await supabase
        .from('organisations')
        .insert({
          name: data.name,
          description: data.description,
          slug: data.slug,
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      // Refresh the subscriptions to include the new organisation
      await get().fetchSubscriptions();
      
      // Find the newly created organisation in the subscriptions
      const newSubscription = get().getOrganisationById(newOrg.id);
      
      if (newSubscription) {
        // Set it as the active organisation
        get().setActiveOrganisation(newOrg.id);
        return newSubscription;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to create organisation:', error);
      throw error;
    }
  }
}));