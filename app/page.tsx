"use client";

import { LoadingSkeletons } from "@/components/LoadingSkeletons";
import { PaletteDisplay } from "@/components/PaletteDisplay";
import { PaletteForm } from "@/components/PaletteForm";
import { RecommendedFeelings } from "@/components/RecommendedFeelings";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAccessibilityToggle } from "@/hooks/useAccessibilityToggle";
import { usePaletteGenerator } from "@/hooks/usePaletteGenerator";
import { Github } from "lucide-react";
import Link from "next/link";

// Recommended feelings for quick selection
const RECOMMENDED_FEELINGS = [
  "professional", // Uses mock data
  "summer", // Uses mock data
  "autumn", // Uses mock data
  "happy",
  "calm",
  "creative",
  "peaceful",
  "nostalgic",
];

export default function Home() {
  const {
    inputValue,
    setInputValue,
    palettes,
    isGenerating,
    isError,
    error,
    handleSubmit,
    regeneratePalettes,
    handleRecommendedFeelingClick,
  } = usePaletteGenerator();

  const { accessibilityStates, activePaletteIndex, toggleAccessibility } =
    useAccessibilityToggle();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b fixed top-0 left-0 right-0 z-10 bg-background">
        <div className="container mx-auto max-w-screen-2xl px-4 flex h-14 items-center justify-between">
          <Link
            href="https://github.com/mattupham"
            target="_blank"
            className="inline-flex items-center justify-center text-sm font-medium"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex flex-col items-center p-4 pt-16 md:p-12 lg:p-24 mt-14">
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-6xl">
              Color Palette Generator
            </h1>
            <p className="text-base text-muted-foreground md:text-lg lg:text-2xl">
              Type how you&apos;re feeling and get beautiful color palettes
            </p>
          </div>

          {/* Form for entering feeling */}
          <PaletteForm
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSubmit={handleSubmit}
            isGenerating={isGenerating}
          />

          {/* Recommended feelings */}
          {!inputValue.trim() && (
            <RecommendedFeelings
              feelings={RECOMMENDED_FEELINGS}
              onFeelingClick={handleRecommendedFeelingClick}
            />
          )}

          {/* Error message */}
          {isError && (
            <div className="p-4 text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg">
              {error instanceof Error
                ? error.message
                : "Failed to generate palettes. Please try again."}
            </div>
          )}

          {/* Loading state or palette display */}
          {isGenerating ? (
            <LoadingSkeletons />
          ) : (
            <PaletteDisplay
              palettes={palettes || []}
              isGenerating={isGenerating}
              onRefresh={regeneratePalettes}
              accessibilityStates={accessibilityStates}
              onToggleAccessibility={toggleAccessibility}
              activePaletteIndex={activePaletteIndex}
            />
          )}
        </div>
      </main>
    </div>
  );
}
