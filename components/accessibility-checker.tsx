"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  checkPaletteAccessibility,
  getReadableTextColor,
  getContrastRatio,
  getAccessibilityLevel,
} from "@/lib/accessibility"
import { AlertTriangle, CheckCircle, Info } from "lucide-react"

interface AccessibilityCheckerProps {
  palette: string[]
}

export function AccessibilityChecker({ palette }: AccessibilityCheckerProps) {
  const [open, setOpen] = useState(false)
  const { pairs, overallRating } = checkPaletteAccessibility(palette)

  // Get rating color and icon
  const getRatingDisplay = (rating: string) => {
    switch (rating) {
      case "excellent":
        return {
          color: "text-green-500 dark:text-green-400",
          icon: <CheckCircle className="h-5 w-5" />,
          bg: "bg-green-50 dark:bg-green-950/20",
        }
      case "good":
        return {
          color: "text-blue-500 dark:text-blue-400",
          icon: <CheckCircle className="h-5 w-5" />,
          bg: "bg-blue-50 dark:bg-blue-950/20",
        }
      case "fair":
        return {
          color: "text-yellow-500 dark:text-yellow-400",
          icon: <AlertTriangle className="h-5 w-5" />,
          bg: "bg-yellow-50 dark:bg-yellow-950/20",
        }
      case "poor":
        return {
          color: "text-red-500 dark:text-red-400",
          icon: <AlertTriangle className="h-5 w-5" />,
          bg: "bg-red-50 dark:bg-red-950/20",
        }
      default:
        return {
          color: "text-gray-500 dark:text-gray-400",
          icon: <Info className="h-5 w-5" />,
          bg: "bg-gray-50 dark:bg-gray-950/20",
        }
    }
  }

  const ratingDisplay = getRatingDisplay(overallRating)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`${ratingDisplay.color} ${ratingDisplay.bg} border-0 hover:bg-opacity-80`}
        >
          {ratingDisplay.icon}
          <span className="ml-2 capitalize">{overallRating}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Accessibility Analysis</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex items-center mb-4">
            <div className="mr-2">{ratingDisplay.icon}</div>
            <h3 className={`text-lg font-medium ${ratingDisplay.color} capitalize`}>
              {overallRating} Accessibility Rating
            </h3>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Color Pairs</TabsTrigger>
              <TabsTrigger value="text">Text Readability</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-medium mb-2">What This Means</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  This palette has an overall accessibility rating of{" "}
                  <span className={`${ratingDisplay.color} font-medium capitalize`}>{overallRating}</span>. This rating
                  is based on the contrast ratios between different color combinations in your palette.
                </p>

                <h4 className="font-medium mb-2">WCAG Guidelines</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>
                    <span className="font-medium">AA Standard (minimum):</span> Contrast ratio of at least 4.5:1 for
                    normal text and 3:1 for large text
                  </li>
                  <li>
                    <span className="font-medium">AAA Standard (enhanced):</span> Contrast ratio of at least 7:1 for
                    normal text and 4.5:1 for large text
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {palette.map((color, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-md flex items-center justify-center text-xs font-mono"
                    style={{ backgroundColor: color, color: getReadableTextColor(color) }}
                  >
                    {color}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-4">
                {pairs.map((pair, index) => {
                  const { color1, color2, contrastRatio, description } = pair
                  const textColor1 = getReadableTextColor(color1)
                  const textColor2 = getReadableTextColor(color2)

                  // Determine status color
                  let statusColor = "text-red-500 dark:text-red-400"
                  if (contrastRatio >= 7) statusColor = "text-green-500 dark:text-green-400"
                  else if (contrastRatio >= 4.5) statusColor = "text-blue-500 dark:text-blue-400"
                  else if (contrastRatio >= 3) statusColor = "text-yellow-500 dark:text-yellow-400"

                  return (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div className="grid grid-cols-2">
                        <div
                          className="p-4 flex items-center justify-center"
                          style={{ backgroundColor: color1, color: textColor1 }}
                        >
                          <span className="font-mono">{color1}</span>
                        </div>
                        <div
                          className="p-4 flex items-center justify-center"
                          style={{ backgroundColor: color2, color: textColor2 }}
                        >
                          <span className="font-mono">{color2}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-muted flex justify-between items-center">
                        <span className="text-sm">Contrast: {contrastRatio.toFixed(2)}:1</span>
                        <span className={`text-sm font-medium ${statusColor}`}>{description}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="text">
              <div className="space-y-6">
                {palette.map((bgColor, index) => {
                  const textColor = getReadableTextColor(bgColor)
                  const contrastRatio = getContrastRatio(bgColor, textColor)
                  const { aa, aaa } = getAccessibilityLevel(contrastRatio)

                  // Determine status
                  let statusText = "Poor"
                  let statusColor = "text-red-500 dark:text-red-400"

                  if (aaa) {
                    statusText = "Excellent"
                    statusColor = "text-green-500 dark:text-green-400"
                  } else if (aa) {
                    statusText = "Good"
                    statusColor = "text-blue-500 dark:text-blue-400"
                  }

                  return (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div
                        className="p-6 flex flex-col space-y-2"
                        style={{ backgroundColor: bgColor, color: textColor }}
                      >
                        <h3 className="text-xl font-bold">Sample Heading</h3>
                        <p>This is an example of normal text on this background color.</p>
                        <p className="text-sm">This is smaller text that might be harder to read.</p>
                      </div>
                      <div className="p-3 bg-muted flex justify-between items-center">
                        <span className="text-sm">
                          {bgColor} + {textColor === "#000000" ? "Black" : "White"} Text
                        </span>
                        <div className="flex items-center">
                          <span className="text-sm mr-2">Contrast: {contrastRatio.toFixed(2)}:1</span>
                          <span className={`text-sm font-medium ${statusColor}`}>{statusText}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
