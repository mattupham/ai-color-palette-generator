import { redirect } from "next/navigation";
import { AuthenticatedHome } from "@/components/AuthenticatedHome";
import { verifySession } from "@/lib/dal";

export default async function Home() {
	const session = await verifySession();

	if (!session) {
		redirect("/sign-in");
	}

	return <AuthenticatedHome />;
}
