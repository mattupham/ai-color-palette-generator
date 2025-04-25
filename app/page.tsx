"use client";

import type React from "react";

import { CopyButton } from "@/components/copy-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { generatePalettes, Palette } from "@/lib/palette-generator";
import { Github, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [feeling, setFeeling] = useState("");
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeling.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const generatedPalettes = await generatePalettes(feeling);
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
      const generatedPalettes = await generatePalettes(feeling);
      setPalettes(generatedPalettes);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to generate palettes. Please try again.");
    } finally {
      setIsGenerating(false);
    }
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
          <ThemeToggle />
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
            />
            <Button type="submit" disabled={isGenerating || !feeling.trim()}>
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
                    disabled={isGenerating}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                <div className="grid gap-6">
                  {palettes.map((palette, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          {palette.name || `Palette ${index + 1}`}
                        </span>
                        <Link
                          href={`/preview?colors=${encodeURIComponent(
                            JSON.stringify(palette)
                          )}`}
                          className="text-xs text-primary hover:underline"
                          target="_blank"
                        >
                          Preview
                        </Link>
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
                      <div className="flex justify-between">
                        {palette.colors.map((color, colorIndex) => (
                          <div key={colorIndex} className="text-xs font-mono">
                            {color}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
