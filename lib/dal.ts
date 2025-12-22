import "server-only";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function verifySession() {
	// Use Better Auth's recommended approach for RSC
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return session;
}

