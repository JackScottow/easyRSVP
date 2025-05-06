import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Define routes that require authentication
// Only include routes that should be accessible by logged-in users only
const PROTECTED_ROUTES = ["/dashboard"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Check if the request path is a protected route
  const { pathname } = request.nextUrl;
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL or Anon Key is missing in middleware");
      // If this is a protected route, redirect to login
      if (isProtectedRoute) {
        const redirectUrl = new URL("/login", request.url);
        return NextResponse.redirect(redirectUrl);
      }
      return response;
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    });

    try {
      // Get the user
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      // For protected routes, redirect to login if not authenticated
      if (isProtectedRoute && (!user || error)) {
        console.log(`Redirecting unauthenticated user from protected route: ${pathname}`);
        const redirectUrl = new URL("/login", request.url);

        // Add the original URL as a parameter so we can redirect back after login
        redirectUrl.searchParams.set("redirect", pathname);

        return NextResponse.redirect(redirectUrl);
      }
    } catch (authError) {
      console.error("Error checking authentication:", authError);
      // If this is a protected route, redirect to login
      if (isProtectedRoute) {
        const redirectUrl = new URL("/login", request.url);
        return NextResponse.redirect(redirectUrl);
      }
    }
  } catch (error) {
    console.error("Middleware error:", error);
    // If there's a critical error and this is a protected route, redirect to login
    if (isProtectedRoute) {
      const redirectUrl = new URL("/login", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
