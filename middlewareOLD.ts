import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@/utils/supabase/server";
import { orgProjectAuthMiddleware } from "./middleware/org-project-auth";

export async function middleware(request: NextRequest) {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If the user is not signed in and the current path is not /auth,
  // redirect the user to /auth
  if (!session && request.nextUrl.pathname !== "/auth") {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // If the user is signed in and the current path is / or /auth,
  // redirect the user to /dashboard
  if (session && (request.nextUrl.pathname === "/auth" || request.nextUrl.pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Check organization and project access for protected routes
  const orgProjectAuthResult = await orgProjectAuthMiddleware(request);
  if (orgProjectAuthResult.status !== 200) {
    return orgProjectAuthResult;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};