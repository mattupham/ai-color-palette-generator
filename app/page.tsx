"use client";

import type React from "react";

import {
  AccessibilityToggle,
  AccessibilityView,
} from "@/components/accessibility-view";
import { CopyButton } from "@/components/copy-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Palette } from "@/lib/palette-generator";
import {
  getFallbackPalettes,
  getMockPalettes,
  usePaletteMutation,
} from "@/lib/palette-queries";
import { Github, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type DataSourceType = "ai" | "professional" | "summer";

const DEFAULT_DATA_SOURCE = "professional";

export default function Home() {
  const [feeling, setFeeling] = useState(DEFAULT_DATA_SOURCE);
  const [dataSource, setDataSource] =
    useState<DataSourceType>(DEFAULT_DATA_SOURCE);
  const [accessibilityStates, setAccessibilityStates] = useState<
    Record<number, boolean>
  >({});
  const [activePaletteIndex, setActivePaletteIndex] = useState<number | null>(
    null
  );
  const [palettes, setPalettes] = useState<Palette[] | undefined>(undefined);

  // Use React Query mutation for generating palettes
  const {
    mutate,
    isPending: isGenerating,
    isError,
    error,
  } = usePaletteMutation();

  // Load default palettes on component mount
  useEffect(() => {
    if (DEFAULT_DATA_SOURCE !== ("ai" as DataSourceType)) {
      setFeeling(DEFAULT_DATA_SOURCE);
      // For non-AI sources, use mock data
      setPalettes(getMockPalettes(DEFAULT_DATA_SOURCE));
    } else {
      setFeeling(""); // Clear feeling for AI mode
    }
  }, []);

  // Handle changing the data source
  const handleDataSourceChange = (value: DataSourceType) => {
    setDataSource(value);

    if (value !== "ai") {
      setFeeling(value);
      // For non-AI sources, use mock data
      setPalettes(getMockPalettes(value));
    } else {
      // Clear the feeling when AI option is selected
      setFeeling("");
      setPalettes(undefined);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeling.trim()) return;

    if (dataSource === "ai") {
      // Make API call for AI-generated palettes
      mutate(feeling, {
        onSuccess: (data) => {
          setPalettes(data.palettes);
        },
        onError: () => {
          // Use fallback palettes on error
          setPalettes(getFallbackPalettes());
        },
      });
    }
  };

  const regeneratePalettes = async () => {
    if (!feeling.trim()) return;

    if (dataSource === "ai") {
      // Make API call for AI-generated palettes
      mutate(feeling, {
        onSuccess: (data) => {
          setPalettes(data.palettes);
        },
        onError: () => {
          // Use fallback palettes on error
          setPalettes(getFallbackPalettes());
        },
      });
    }
  };

  const isAIMode = dataSource === "ai";

  const toggleAccessibility = (index: number) => {
    const isCurrentlyOpen = !!accessibilityStates[index];
    const newState = !isCurrentlyOpen;

    // Create a new state object with all dropdowns closed
    const newAccessibilityStates: Record<number, boolean> = {};

    // If we're opening this dropdown, set only this one to true
    // If we're closing this dropdown, keep all closed
    if (newState) {
      newAccessibilityStates[index] = true;
    }

    setAccessibilityStates(newAccessibilityStates);

    // If showing accessibility, set this palette as active, otherwise set to null
    setActivePaletteIndex(newState ? index : null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b fixed top-0 left-0 right-0 z-10 bg-background">
        <div className="container flex h-14 items-center justify-between">
          <Link
            href="https://github.com/mattupham"
            target="_blank"
            className="inline-flex items-center justify-center text-sm font-medium"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Select value={dataSource} onValueChange={handleDataSourceChange}>
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue>
                    {dataSource === "ai"
                      ? "AI Generated"
                      : dataSource === "professional"
                      ? "Professional"
                      : "Summer"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai">AI Generated</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex flex-col items-center p-16 md:p-24 mt-14">
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-6xl">
              Color Palette Generator
            </h1>
            <p className="text-base text-muted-foreground md:text-lg lg:text-2xl">
              Type how you're feeling and get beautiful color palettes
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-lg mx-auto gap-4"
          >
            <Input
              placeholder="I'm feeling..."
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              className="flex-1"
              disabled={!isAIMode}
            />
            <Button
              type="submit"
              disabled={isGenerating || !feeling.trim() || !isAIMode}
            >
              {isGenerating ? "Generating..." : "Generate"}
            </Button>
          </form>

          {isError && (
            <div className="p-4 text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg">
              {error instanceof Error
                ? error.message
                : "Failed to generate palettes. Please try again."}
            </div>
          )}

          {isGenerating ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">
                  Generating Palettes...
                </h2>
              </div>

              <div className="grid gap-6">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="h-24 w-full rounded-lg" />
                    <div className="flex justify-between">
                      {[1, 2, 3, 4, 5].map((_, colorIndex) => (
                        <div key={colorIndex} className="text-xs font-mono">
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            palettes &&
            palettes.length > 0 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Your Palettes</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={regeneratePalettes}
                    disabled={isGenerating || !isAIMode}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                <div className="grid gap-6">
                  {palettes.map((palette, index) => {
                    const isActive = activePaletteIndex === index;
                    const shouldFade = activePaletteIndex !== null && !isActive;

                    return (
                      <div
                        key={index}
                        className={`space-y-2 transition-all duration-500 ${
                          shouldFade
                            ? "opacity-20 pointer-events-none"
                            : "opacity-100"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">
                            {palette.name || `Palette ${index + 1}`}
                          </span>
                          <div className="flex items-center gap-2">
                            <AccessibilityToggle
                              showAccessibility={!!accessibilityStates[index]}
                              onToggleAccessibility={() =>
                                toggleAccessibility(index)
                              }
                            />
                          </div>
                        </div>
                        <div className="flex h-24 w-full overflow-hidden rounded-lg">
                          {palette.colors.map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="flex-1 relative group cursor-pointer"
                              style={{ backgroundColor: color }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out bg-black/20">
                                <CopyButton textToCopy={color} />
                              </div>
                              {palette.roles && (
                                <div className="absolute bottom-1 left-0 right-0 text-center text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="bg-black/60 text-white px-1 py-0.5 rounded">
                                    {palette.roles[colorIndex]}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-5 gap-0 w-full">
                          {palette.colors.map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="text-xs font-mono text-center"
                            >
                              {color}
                            </div>
                          ))}
                        </div>

                        <AccessibilityView
                          colors={palette.colors}
                          showAccessibility={!!accessibilityStates[index]}
                          onToggleAccessibility={() =>
                            toggleAccessibility(index)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
