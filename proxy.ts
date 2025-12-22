import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Allow API routes and static files (including ALL auth routes)
	if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
		return NextResponse.next();
	}

	// Optimistic check: Read session from cookie instead of database
	// This avoids database calls on every request for better performance
	const sessionCookie = request.cookies.get("better-auth.session_token");
	const isAuthenticated = !!sessionCookie?.value;

	// Redirect logic
	if (pathname === "/sign-in" && isAuthenticated) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	if (pathname === "/" && !isAuthenticated) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/", "/sign-in"],
};

