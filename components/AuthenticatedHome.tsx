"use client";

import { UserMenu } from "@/components/auth/user-menu";
import { LoadingSkeletons } from "@/components/LoadingSkeletons";
import { PaletteDisplay } from "@/components/PaletteDisplay";
import { PaletteForm } from "@/components/PaletteForm";
import { RecommendedVibes } from "@/components/RecommendedVibes";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAccessibilityToggle } from "@/hooks/useAccessibilityToggle";
import { usePaletteGenerator } from "@/hooks/usePaletteGenerator";
import { Github } from "lucide-react";
import Link from "next/link";

const RECOMMENDED_VIBES = [
	"professional",
	"summer",
	"autumn",
	"happy",
	"calm",
	"creative",
	"peaceful",
	"nostalgic",
];

const DEFAULT_VIBE = RECOMMENDED_VIBES[0];

export function AuthenticatedHome() {
	const {
		inputValue,
		setInputValue,
		palettes,
		mutation,
		handleSubmit,
		handleRecommendedVibeClick,
	} = usePaletteGenerator(DEFAULT_VIBE);

	const { accessibilityStates, activePaletteIndex, toggleAccessibility } =
		useAccessibilityToggle();

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
						<UserMenu />
						<ThemeToggle />
					</div>
				</div>
			</header>

			<main className="mt-14 flex flex-col items-center p-4 pt-16 md:p-12 lg:p-24">
				<div className="w-full max-w-3xl space-y-8">
					<div className="space-y-2 text-center">
						<h1 className="font-bold text-3xl tracking-tighter md:text-4xl lg:text-6xl">
							AI Color Palette Generator
						</h1>
						<p className="text-base text-muted-foreground md:text-lg lg:text-2xl">
							Type your vibe and get beautiful color palettes
						</p>
					</div>

					<PaletteForm
						inputValue={inputValue}
						isPending={mutation.isPending}
						onSubmit={handleSubmit}
						setInputValue={setInputValue}
					/>

					<RecommendedVibes
						onVibeClick={handleRecommendedVibeClick}
						vibes={RECOMMENDED_VIBES}
					/>

					{mutation.isError && (
						<div className="rounded-lg bg-red-50 p-4 text-red-500 dark:bg-red-950/20">
							{mutation.error instanceof Error
								? mutation.error.message
								: "Failed to generate palettes. Please try again."}
						</div>
					)}

					{mutation.isPending ? (
						<LoadingSkeletons />
					) : (
						<PaletteDisplay
							accessibilityStates={accessibilityStates}
							activePaletteIndex={activePaletteIndex}
							onToggleAccessibility={toggleAccessibility}
							palettes={palettes || []}
						/>
					)}
				</div>
			</main>
		</div>
	);
}
