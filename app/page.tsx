import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { AuthenticatedHome } from "@/components/AuthenticatedHome";

export default async function Home() {
	const session = await verifySession();

	if (!session) {
		redirect("/sign-in");
	}

	return <AuthenticatedHome />;
}
