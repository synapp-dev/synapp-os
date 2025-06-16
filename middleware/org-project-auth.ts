import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@/utils/supabase/server";

export async function orgProjectAuthMiddleware(request: NextRequest) {
  const supabase = await createServerClient();
  
  // Extract organization and project slugs from the URL
  const pathParts = request.nextUrl.pathname.split('/').filter(Boolean);
  if (pathParts.length < 2) return NextResponse.next();
  
  const [orgSlug, projectSlug] = pathParts;
  
  // Get user's session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Fetch user's organization access
  const { data: orgAccess, error: orgError } = await supabase.rpc('get_user_org_scope');
  if (orgError) {
    console.error('Error fetching org access:', orgError);
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Check if user has access to the organization
  const hasOrgAccess = orgAccess.some(org => org.organisation_slug === orgSlug);
  if (!hasOrgAccess) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // If we're in a project route, check project access
  if (projectSlug) {
    const org = orgAccess.find(org => org.organisation_slug === orgSlug);
    if (!org) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Fetch user's project access for this organization
    const { data: projectAccess, error: projectError } = await supabase.rpc('get_user_project_scope', {
      org_id: org.organisation_id
    });

    if (projectError) {
      console.error('Error fetching project access:', projectError);
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Check if user has access to the project
    const hasProjectAccess = projectAccess.some(project => project.project_slug === projectSlug);
    if (!hasProjectAccess) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // If we're at the base project URL (e.g., /org/project), redirect to dashboard
    if (pathParts.length === 2) {
      return NextResponse.redirect(new URL(`/${orgSlug}/${projectSlug}/dashboard`, request.url));
    }
  }

  return NextResponse.next();
} 