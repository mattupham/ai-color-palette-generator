/**
 * Utility functions for color accessibility calculations based on WCAG guidelines.
 */

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove the hash if it exists
  hex = hex.replace(/^#/, "");

  // Parse the hex values
  const bigint = parseInt(hex, 16);

  // Handle different hex formats (3 or 6 digits)
  if (hex.length === 3) {
    const r = (((bigint >> 8) & 0xf) / 15) * 255;
    const g = (((bigint >> 4) & 0xf) / 15) * 255;
    const b = ((bigint & 0xf) / 15) * 255;
    return { r, g, b };
  } else if (hex.length === 6) {
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  return null;
}

/**
 * Calculate relative luminance of a color
 * Formula from WCAG 2.0: https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function calculateRelativeLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;

  // Normalize RGB values
  const { r, g, b } = rgb;
  const sR = r / 255;
  const sG = g / 255;
  const sB = b / 255;

  // Calculate RGB values for luminance
  const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
  const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
  const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);

  // Calculate luminance
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculate contrast ratio between two colors
 * Formula from WCAG 2.0: https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const luminance1 = calculateRelativeLuminance(color1);
  const luminance2 = calculateRelativeLuminance(color2);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Determines WCAG compliance level for contrast ratio
 */
export function getWCAGLevel(
  contrastRatio: number,
  isLargeText: boolean = false
): "Fail" | "A" | "AA" | "AAA" {
  if (isLargeText) {
    // Large text standards
    if (contrastRatio >= 7) return "AAA";
    if (contrastRatio >= 4.5) return "AA";
    if (contrastRatio >= 3) return "A";
    return "Fail";
  } else {
    // Normal text standards
    if (contrastRatio >= 7) return "AAA";
    if (contrastRatio >= 4.5) return "AA";
    return "Fail";
  }
}

/**
 * Determines if text color should be white or black based on background color
 */
export function getTextColor(backgroundColor: string): "white" | "black" {
  const luminance = calculateRelativeLuminance(backgroundColor);
  return luminance > 0.5 ? "black" : "white";
}

/**
 * Interface for color contrast analysis result
 */
export interface ContrastAnalysisResult {
  foregroundColor: string;
  backgroundColor: string;
  contrastRatio: number;
  level: "Fail" | "A" | "AA" | "AAA";
  isLargeText: boolean;
  formattedRatio: string;
}

/**
 * Analyze contrast between foreground and background colors
 */
export function analyzeContrast(
  foregroundColor: string,
  backgroundColor: string,
  isLargeText: boolean = false
): ContrastAnalysisResult {
  const contrastRatio = calculateContrastRatio(
    foregroundColor,
    backgroundColor
  );
  const level = getWCAGLevel(contrastRatio, isLargeText);
  const formattedRatio = contrastRatio.toFixed(2) + ":1";

  return {
    foregroundColor,
    backgroundColor,
    contrastRatio,
    level,
    isLargeText,
    formattedRatio,
  };
}

/**
 * Analyze all possible text/background color combinations in a palette
 */
export function analyzePaletteContrast(
  colors: string[]
): ContrastAnalysisResult[] {
  const results: ContrastAnalysisResult[] = [];

  // Check all possible combinations
  for (let i = 0; i < colors.length; i++) {
    for (let j = 0; j < colors.length; j++) {
      if (i !== j) {
        // Analyze both as normal and large text
        results.push(analyzeContrast(colors[i], colors[j], false));
      }
    }
  }

  return results;
}

/**
 * Get accessible text/background color pairs from a palette
 * Returns pairs that meet at least AA standard
 */
export function getAccessibleColorPairs(
  colors: string[]
): {
  text: string;
  background: string;
  contrastRatio: number;
  level: string;
  formattedRatio: string;
}[] {
  const results: {
    text: string;
    background: string;
    contrastRatio: number;
    level: string;
    formattedRatio: string;
  }[] = [];

  for (let i = 0; i < colors.length; i++) {
    for (let j = 0; j < colors.length; j++) {
      if (i !== j) {
        const analysis = analyzeContrast(colors[i], colors[j]);

        // Only include pairs that meet at least AA standard
        if (analysis.level === "AA" || analysis.level === "AAA") {
          results.push({
            text: colors[i],
            background: colors[j],
            contrastRatio: analysis.contrastRatio,
            level: analysis.level,
            formattedRatio: analysis.formattedRatio,
          });
        }
      }
    }
  }

  // Sort by contrast ratio (highest first)
  return results.sort((a, b) => b.contrastRatio - a.contrastRatio);
}
