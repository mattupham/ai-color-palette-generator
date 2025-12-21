import { Github } from "lucide-react";
import Link from "next/link";
import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SignInPage() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="fixed top-0 right-0 left-0 z-10 border-b bg-background">
				<div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4">
					<Link
						className="inline-flex items-center justify-center font-medium text-sm"
						href="https://github.com/mattupham"
						target="_blank"
					>
						<Github className="h-5 w-5" />
						<span className="sr-only">GitHub</span>
					</Link>
					<div className="flex items-center gap-4">
						<ThemeToggle />
					</div>
				</div>
			</header>
			<SignInDialog />
		</div>
	);
}
