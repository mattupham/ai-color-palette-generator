"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthenticatedHome } from "@/components/AuthenticatedHome";
import { useSession } from "@/lib/auth/client";

export default function Home() {
	const { data: session, isPending } = useSession();
	const router = useRouter();

	useEffect(() => {
		// Only redirect if we're done loading and there's no session
		if (!isPending && !session) {
			router.push("/sign-in");
		}
	}, [session, isPending, router]);

	// Show loading state while checking session
	if (isPending) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
			</div>
		);
	}

	// If no session, show nothing (will redirect)
	if (!session) {
		return null;
	}

	return <AuthenticatedHome />;
}
