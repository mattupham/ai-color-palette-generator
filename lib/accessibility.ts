// Function to convert hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove # if present
  hex = hex.replace(/^#/, "")

  // Parse hex values
  const bigint = Number.parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return { r, g, b }
}

// Calculate relative luminance for WCAG contrast
export function getLuminance(color: string): number {
  const { r, g, b } = hexToRgb(color)

  // Convert RGB to relative luminance
  const rsrgb = r / 255
  const gsrgb = g / 255
  const bsrgb = b / 255

  const r1 = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4)
  const g1 = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4)
  const b1 = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4)

  return 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1
}

// Calculate contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  const luminance1 = getLuminance(color1)
  const luminance2 = getLuminance(color2)

  const lighter = Math.max(luminance1, luminance2)
  const darker = Math.min(luminance1, luminance2)

  return (lighter + 0.05) / (darker + 0.05)
}

// Determine if the contrast ratio passes WCAG AA and AAA standards
export function getAccessibilityLevel(contrastRatio: number): {
  aa: boolean
  aaa: boolean
  aaLarge: boolean
  aaaLarge: boolean
} {
  return {
    aa: contrastRatio >= 4.5, // AA for normal text
    aaa: contrastRatio >= 7, // AAA for normal text
    aaLarge: contrastRatio >= 3, // AA for large text
    aaaLarge: contrastRatio >= 4.5, // AAA for large text
  }
}

// Get a readable text color (black or white) based on background color
export function getReadableTextColor(backgroundColor: string): string {
  const luminance = getLuminance(backgroundColor)
  return luminance > 0.5 ? "#000000" : "#FFFFFF"
}

// Check if a color is light or dark
export function isLightColor(color: string): boolean {
  const luminance = getLuminance(color)
  return luminance > 0.5
}

// Get a description of the accessibility level
export function getAccessibilityDescription(contrastRatio: number): string {
  const { aa, aaa, aaLarge, aaaLarge } = getAccessibilityLevel(contrastRatio)

  if (aaa) return "Excellent (AAA)"
  if (aa) return "Good (AA)"
  if (aaaLarge) return "Good for large text (AAA)"
  if (aaLarge) return "Acceptable for large text (AA)"
  return "Poor contrast"
}

// Check all adjacent color combinations in a palette
export function checkPaletteAccessibility(palette: string[]): {
  pairs: Array<{
    color1: string
    color2: string
    contrastRatio: number
    accessibilityLevel: ReturnType<typeof getAccessibilityLevel>
    description: string
  }>
  overallRating: "poor" | "fair" | "good" | "excellent"
} {
  const pairs = []
  let passCount = 0
  let totalChecks = 0

  // Check each color against every other color
  for (let i = 0; i < palette.length; i++) {
    for (let j = i + 1; j < palette.length; j++) {
      const color1 = palette[i]
      const color2 = palette[j]
      const contrastRatio = getContrastRatio(color1, color2)
      const accessibilityLevel = getAccessibilityLevel(contrastRatio)
      const description = getAccessibilityDescription(contrastRatio)

      pairs.push({
        color1,
        color2,
        contrastRatio,
        accessibilityLevel,
        description,
      })

      totalChecks++
      if (accessibilityLevel.aa) passCount++
    }
  }

  // Calculate overall rating
  const passRate = passCount / totalChecks
  let overallRating: "poor" | "fair" | "good" | "excellent"

  if (passRate >= 0.8) overallRating = "excellent"
  else if (passRate >= 0.6) overallRating = "good"
  else if (passRate >= 0.4) overallRating = "fair"
  else overallRating = "poor"

  return { pairs, overallRating }
}
