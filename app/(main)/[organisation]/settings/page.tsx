import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organisation Settings",
  description: "Manage your organisation settings and preferences",
};

export default function OrganisationSettingsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Organisation Settings</h1>
        <p className="text-muted-foreground">
          Manage your organisation settings, team members, and preferences.
        </p>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Organisation Overview</h2>
          <p className="text-muted-foreground">
            This is the organisation-level settings page. It's accessible at `/org-slug/settings` 
            and is a sibling route to the project routes.
          </p>
        </div>
        
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Route Structure</h2>
          <div className="space-y-2 text-sm">
            <div><code className="bg-muted px-2 py-1 rounded">/org-slug/settings</code> → This page (organisation settings)</div>
            <div><code className="bg-muted px-2 py-1 rounded">/org-slug/project-name</code> → Project page</div>
            <div><code className="bg-muted px-2 py-1 rounded">/org-slug/project-name/settings</code> → Project settings</div>
          </div>
        </div>
      </div>
    </div>
  );
} 