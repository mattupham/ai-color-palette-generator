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
import { generatePalettes, Palette } from "@/lib/palette-generator";
import { Github, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type DataSourceType = "ai" | "professional" | "summer";

const DEFAULT_DATA_SOURCE = "professional";

export default function Home() {
  const [feeling, setFeeling] = useState(DEFAULT_DATA_SOURCE);
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] =
    useState<DataSourceType>(DEFAULT_DATA_SOURCE);
  const [accessibilityStates, setAccessibilityStates] = useState<
    Record<number, boolean>
  >({});
  const [activePaletteIndex, setActivePaletteIndex] = useState<number | null>(
    null
  );

  // Load default palettes on component mount
  useEffect(() => {
    setIsGenerating(true);
    // For the initial load, we're using a preset
    const isAI = DEFAULT_DATA_SOURCE === ("ai" as DataSourceType);
    generatePalettes(DEFAULT_DATA_SOURCE, !isAI)
      .then((generatedPalettes) => {
        // Mock loading state for 1 second
        setTimeout(() => {
          setPalettes(generatedPalettes);
          setIsGenerating(false);
        }, 1000);
      })
      .catch((err) => {
        console.error("Error:", err);
        setError("Failed to generate palettes. Please try again.");
        setIsGenerating(false);
      });
  }, []);

  // Handle changing the data source
  const handleDataSourceChange = (value: DataSourceType) => {
    setDataSource(value);

    if (value !== "ai") {
      setFeeling(value);

      // Generate palettes immediately for mock data types
      setIsGenerating(true);
      generatePalettes(value, true) // true = use mock data
        .then((generatedPalettes) => {
          // Mock loading state for 1 second
          setTimeout(() => {
            setPalettes(generatedPalettes);
            setIsGenerating(false);
          }, 1000);
        })
        .catch((err) => {
          console.error("Error:", err);
          setTimeout(() => {
            setError("Failed to generate palettes. Please try again.");
            setIsGenerating(false);
          }, 1000);
        });
    } else {
      // Clear the feeling when AI option is selected
      setFeeling("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeling.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      // When submitting form, use the AI API (useMockData = false)
      const generatedPalettes = await generatePalettes(feeling, false);
      setPalettes(generatedPalettes);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to generate palettes. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const regeneratePalettes = async () => {
    if (!feeling.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      // When regenerating, use the AI API (useMockData = false)
      const generatedPalettes = await generatePalettes(feeling, false);
      setPalettes(generatedPalettes);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to generate palettes. Please try again.");
    } finally {
      setIsGenerating(false);
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
      <header className="border-b">
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

      <main className="flex flex-col items-center p-16 md:p-24">
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
            className="flex w-full max-w-lg mx-auto gap-2"
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

          {error && (
            <div className="p-4 text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg">
              {error}
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
