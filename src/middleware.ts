import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import next from "next";
import path from "path";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const{
    data :{session},

  }= await supabase.auth.getSession();

  const pathname =  request.nextUrl.pathname;

    const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register');

  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/tasks') ||
    pathname.startsWith('/projects');

  // Not logged in
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(
      new URL('/login', request.url)
    );
  }

  // Already logged in
  if (session && isAuthRoute) {
    return NextResponse.redirect(
      new URL('/dashboard', request.url)
    );
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
