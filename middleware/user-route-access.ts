import { createServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function userRouteAccessMiddleware(request: NextRequest) {
  const supabase = await createServerClient();
  
  // Extract path components from the URL
  const pathParts = request.nextUrl.pathname.split('/').filter(Boolean);
  
  // Only check access for routes that have organization slugs (skip auth, login, etc.)
  if (pathParts.length >= 1 && 
      !request.nextUrl.pathname.startsWith('/login') && 
      !request.nextUrl.pathname.startsWith('/auth') &&
      !request.nextUrl.pathname.startsWith('/api') &&
      !request.nextUrl.pathname.startsWith('/not-found')) {
    
    const orgSlug = pathParts[0];
    const projectSlug = pathParts.length >= 2 ? pathParts[1] : undefined;
    const parentRoute = pathParts.length >= 3 ? pathParts[2] : undefined;
    const subRoute = pathParts.length >= 4 ? pathParts[3] : undefined;

    // Special case: organisation-level settings route
    if (pathParts.length === 2 && pathParts[1] === 'settings') {
      // Check if user has access to the organisation
      const { data: canAccessOrg, error: orgError } = await supabase.rpc('get_user_organisation_access', {
        org_id: orgSlug,
        uid: undefined // Will use current user
      });

      if (orgError) {
        console.error('Error checking organisation access:', orgError);
        const url = request.nextUrl.clone();
        url.pathname = '/not-found';
        return NextResponse.redirect(url);
      }

      if (!canAccessOrg) {
        const url = request.nextUrl.clone();
        url.pathname = '/not-found';
        return NextResponse.redirect(url);
      }

      return NextResponse.next();
    }

    // For all other routes, use the existing check
    const { data: canAccess, error } = await supabase.rpc('check_user_can_access_route', {
      org_slug: orgSlug,
      project_slug: projectSlug,
      parent_route: parentRoute,
      sub_route: subRoute
    });

    if (error) {
      console.error('Error checking route access:', error);
      // On error, redirect to 404 or error page
      const url = request.nextUrl.clone();
      url.pathname = '/not-found';
      return NextResponse.redirect(url);
    }

    if (!canAccess) {
      // User doesn't have access, redirect to 404
      const url = request.nextUrl.clone();
      url.pathname = '/not-found';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}