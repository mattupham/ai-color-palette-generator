"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, RefreshCw } from "lucide-react"
import { generatePalettes } from "@/lib/palette-generator"
import { ThemeToggle } from "@/components/theme-toggle"
import { Skeleton } from "@/components/ui/skeleton"
import { AccessibilityChecker } from "@/components/accessibility-checker"

export default function Home() {
  const [feeling, setFeeling] = useState("")
  const [palettes, setPalettes] = useState<string[][]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feeling.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const generatedPalettes = await generatePalettes(feeling)
      setPalettes(generatedPalettes)
    } catch (err) {
      console.error("Error:", err)
      setError("Failed to generate palettes. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const regeneratePalettes = async () => {
    if (!feeling.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const generatedPalettes = await generatePalettes(feeling)
      setPalettes(generatedPalettes)
    } catch (err) {
      console.error("Error:", err)
      setError("Failed to generate palettes. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (colorCode: string) => {
    navigator.clipboard.writeText(colorCode)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-background text-foreground">
      <div className="w-full max-w-3xl space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Color Palette Generator</h1>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Type how you're feeling and get beautiful color palettes
            </p>
          </div>
          <ThemeToggle />
        </div>

        <form onSubmit={handleSubmit} className="flex w-full max-w-lg mx-auto gap-2">
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

        {error && <div className="p-4 text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg">{error}</div>}

        {isGenerating ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Generating Palettes...</h2>
            </div>

            <div className="grid gap-6">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex h-24 w-full overflow-hidden rounded-lg">
                    {[1, 2, 3, 4, 5].map((_, colorIndex) => (
                      <Skeleton key={colorIndex} className="flex-1 h-full" />
                    ))}
                  </div>
                  <div className="flex justify-between">
                    {[1, 2, 3, 4, 5].map((_, colorIndex) => (
                      <Skeleton key={colorIndex} className="h-4 w-16" />
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
                <Button variant="outline" size="sm" onClick={regeneratePalettes} disabled={isGenerating}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>

              <div className="grid gap-6">
                {palettes.map((palette, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Palette {index + 1}</span>
                      <AccessibilityChecker palette={palette} />
                    </div>
                    <div className="flex h-24 w-full overflow-hidden rounded-lg">
                      {palette.map((color, colorIndex) => (
                        <div key={colorIndex} className="flex-1 relative group" style={{ backgroundColor: color }}>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(color)}
                              className="h-8 w-8 rounded-full bg-white/90 text-black hover:bg-white"
                            >
                              <Copy className="h-4 w-4" />
                              <span className="sr-only">Copy color code</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      {palette.map((color, colorIndex) => (
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
  )
}
