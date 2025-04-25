"use client";

import { AccessibilityView } from "@/components/accessibility-view";
import { CopyButton } from "@/components/copy-button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PaletteData {
  name?: string;
  colors: string[];
  roles?: string[];
}

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const [palette, setPalette] = useState<PaletteData | null>(null);

  useEffect(() => {
    const colorsParam = searchParams.get("colors");
    if (colorsParam) {
      try {
        const parsedColors = JSON.parse(decodeURIComponent(colorsParam));
        setPalette(parsedColors);
      } catch (error) {
        console.error("Failed to parse colors:", error);
      }
    }
  }, [searchParams]);

  if (!palette) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading palette...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container py-4">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Generator
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6">
          {palette.name || "Color Palette"}
        </h1>

        {/* Full Height Color Preview */}
        <div className="grid grid-cols-1 md:grid-cols-5 h-[50vh] gap-0 mb-6 rounded-lg overflow-hidden">
          {palette.colors.map((color, index) => (
            <div
              key={index}
              className="relative flex items-center justify-center group"
              style={{ backgroundColor: color }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
                <CopyButton textToCopy={color} />
              </div>
              <div className="text-center">
                <div
                  className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm"
                  style={{
                    color:
                      color.startsWith("#fff") || color.startsWith("#f")
                        ? "#000"
                        : "#fff",
                  }}
                >
                  <p className="font-mono text-sm">{color}</p>
                  {palette.roles && (
                    <p className="text-xs mt-1 font-medium">
                      {palette.roles[index]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Accessibility Information */}
        <div className="max-w-2xl mx-auto">
          <AccessibilityView colors={palette.colors} isPreview={true} />
        </div>
      </div>
    </div>
  );
}
