import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Allow API routes and static files
	if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
		return NextResponse.next();
	}

	// Check for session cookie
	const sessionToken = request.cookies.get("better-auth.session_token");
	const isAuthenticated = !!sessionToken;

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
