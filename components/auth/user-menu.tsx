"use client";

import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@/lib/auth/client";

export function UserMenu() {
	const { data: session, isPending } = useSession();

	if (isPending) {
		return (
			<Avatar>
				<AvatarFallback className="animate-pulse" />
			</Avatar>
		);
	}

	if (!session?.user) {
		return null;
	}

	const handleSignOut = async () => {
		await signOut();
		window.location.href = "/";
	};

	const userInitial =
		session.user.name?.charAt(0).toUpperCase() ||
		session.user.email?.charAt(0).toUpperCase() ||
		"U";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="relative h-10 w-10 rounded-full p-0" variant="ghost">
					<Avatar>
						<AvatarImage
							alt={session.user.name || "User avatar"}
							src={session.user.image || undefined}
						/>
						<AvatarFallback className="bg-primary font-semibold text-primary-foreground">
							{userInitial}
						</AvatarFallback>
					</Avatar>
					<span className="sr-only">User menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="font-medium text-sm leading-none">
							{session.user.name}
						</p>
						<p className="text-muted-foreground text-xs leading-none">
							{session.user.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Sign out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
