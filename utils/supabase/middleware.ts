import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { userRouteAccessMiddleware } from '@/middleware/user-route-access'
import { Database } from '@/types/supabase'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

// 1. Handle root redirect logic
if (user && pathname === '/') {

  const { data: lastView } = await supabase.rpc('get_user_last_view_or_default_redirect')

  
  // Handle lastView as an array - take the first item if it exists
  const lastViewItem = Array.isArray(lastView) ? lastView[0] : lastView
  
  if (lastViewItem && lastViewItem.org_slug) {
    const redirectTo = lastViewItem.project_slug
      ? `/${lastViewItem.org_slug}/${lastViewItem.project_slug}`
      : `/${lastViewItem.org_slug}`

    const url = request.nextUrl.clone()
    url.pathname = redirectTo
    return NextResponse.redirect(url)
  } 
}


  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  if (user && request.nextUrl.pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Check organization and project access for protected routes
  const routeAccessResult = await userRouteAccessMiddleware(request)
  if (routeAccessResult.status !== 200) {
    return routeAccessResult
  }

  // 2. Update last visited context if on org or project page
const slugSegments = pathname.split('/').filter(Boolean)

if (user && slugSegments.length >= 1) {
  const org_slug = slugSegments[0]
  const project_slug = slugSegments[1] ?? null

  await supabase.rpc('update_last_visited_context_by_slug', {
    org_slug: org_slug,
    project_slug: project_slug,
  })

 
}


  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}