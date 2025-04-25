"use client";

import { CopyButton } from "@/components/copy-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { analyzeContrast } from "@/lib/color-accessibility";
import { CheckCircle2, ChevronDown, XCircle } from "lucide-react";

interface AccessibilityViewProps {
  colors: string[];
  isPreview?: boolean;
  showAccessibility: boolean;
  onToggleAccessibility: () => void;
}

export function AccessibilityView({
  colors,
  isPreview = false,
  showAccessibility,
  onToggleAccessibility,
}: AccessibilityViewProps) {
  // Get best text colors (white or black) for each background color
  const colorPairs = colors.map((bgColor) => {
    // Analyze with white text
    const whiteTextAnalysis = analyzeContrast("#FFFFFF", bgColor);
    // Analyze with black text
    const blackTextAnalysis = analyzeContrast("#000000", bgColor);

    // Return the better contrast option
    return whiteTextAnalysis.contrastRatio > blackTextAnalysis.contrastRatio
      ? {
          backgroundColor: bgColor,
          textColor: "#FFFFFF",
          contrastRatio: whiteTextAnalysis.contrastRatio,
          level: whiteTextAnalysis.level,
          formattedRatio: whiteTextAnalysis.formattedRatio,
          isWhiteText: true,
        }
      : {
          backgroundColor: bgColor,
          textColor: "#000000",
          contrastRatio: blackTextAnalysis.contrastRatio,
          level: blackTextAnalysis.level,
          formattedRatio: blackTextAnalysis.formattedRatio,
          isWhiteText: false,
        };
  });

  // Calculate overall score based on number of pairs that meet standards
  const passedAA = colorPairs.filter(
    (pair) => pair.level === "AA" || pair.level === "AAA"
  ).length;
  const passedAAA = colorPairs.filter((pair) => pair.level === "AAA").length;
  const totalPairs = colorPairs.length;

  return (
    <div className="w-full">
      <div
        className={`grid grid-cols-1 gap-2 overflow-hidden transition-all duration-500 ease-in-out ${
          showAccessibility ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mt-2 mb-1">
          <AccessibilityCheck colors={colors} />
        </div>

        {colorPairs.map((pair, index) => (
          <div
            key={index}
            className="flex items-center rounded-md overflow-hidden border"
            style={{ backgroundColor: pair.backgroundColor }}
          >
            <div
              className="flex-1 py-2 px-3 font-medium text-sm flex items-center justify-between"
              style={{ color: pair.textColor }}
            >
              <span>{pair.isWhiteText ? "White Text" : "Black Text"}</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono">{pair.formattedRatio}</span>
                {pair.level === "AAA" && (
                  <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                    AAA
                  </span>
                )}
                {pair.level === "AA" && (
                  <span className="bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded">
                    AA
                  </span>
                )}
                {pair.level === "A" && (
                  <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded">
                    A
                  </span>
                )}
                {pair.level === "Fail" && (
                  <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
                    Fail
                  </span>
                )}
              </div>
            </div>
            <div
              className="p-2 flex items-center justify-center"
              style={{ backgroundColor: pair.backgroundColor }}
            >
              <CopyButton
                textToCopy={pair.backgroundColor}
                className="bg-white/20 hover:bg-white/30"
              />
            </div>
          </div>
        ))}

        <div className="text-xs text-muted-foreground mt-1">
          <p>WCAG 2.1 Compliance:</p>
          <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
            <li>
              AAA: {passedAAA} of {totalPairs} colors (7:1 contrast for normal
              text)
            </li>
            <li>
              AA: {passedAA} of {totalPairs} colors (4.5:1 contrast for normal
              text)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Helper component for accessibility toggle button
export function AccessibilityToggle({
  showAccessibility,
  onToggleAccessibility,
}: {
  showAccessibility: boolean;
  onToggleAccessibility: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggleAccessibility}
      className="text-xs flex items-center gap-1 px-2 h-7 min-w-[140px] justify-center"
    >
      <ChevronDown
        className={`h-3.5 w-3.5 transition-transform duration-300 ${
          showAccessibility ? "rotate-180" : ""
        }`}
      />
      Accessibility Details
    </Button>
  );
}

// Helper component to show if a palette passes accessibility standards
function AccessibilityCheck({ colors }: { colors: string[] }) {
  // Get best text colors (white or black) for each background color
  const colorPairs = colors.map((bgColor) => {
    // Analyze with white text
    const whiteTextAnalysis = analyzeContrast("#FFFFFF", bgColor);
    // Analyze with black text
    const blackTextAnalysis = analyzeContrast("#000000", bgColor);

    // Return the better contrast option
    return whiteTextAnalysis.contrastRatio > blackTextAnalysis.contrastRatio
      ? {
          backgroundColor: bgColor,
          contrastRatio: whiteTextAnalysis.contrastRatio,
          level: whiteTextAnalysis.level,
        }
      : {
          backgroundColor: bgColor,
          contrastRatio: blackTextAnalysis.contrastRatio,
          level: blackTextAnalysis.level,
        };
  });

  // Check different accessibility levels
  const passedAA = colorPairs.filter(
    (pair) => pair.level === "AA" || pair.level === "AAA"
  ).length;
  const passedAAA = colorPairs.filter((pair) => pair.level === "AAA").length;
  const totalPairs = colorPairs.length;

  // Determine the overall level
  let level = "";
  let badgeStyle = "";

  if (passedAAA === totalPairs) {
    level = "WCAG AAA";
    badgeStyle = "bg-green-500/10 text-green-600 dark:text-green-400";
  } else if (passedAA === totalPairs) {
    level = "WCAG AA";
    badgeStyle = "bg-green-300/10 text-green-500 dark:text-green-300";
  } else if (passedAA > 0) {
    level = "Partial AA";
    badgeStyle = "bg-orange-500/10 text-orange-600 dark:text-orange-400";
  } else {
    level = "Fails WCAG";
    badgeStyle = "bg-red-500/10 text-red-600 dark:text-red-400";
  }

  const icon =
    passedAA === totalPairs ? (
      <CheckCircle2 className="h-3 w-3" />
    ) : (
      <XCircle className="h-3 w-3" />
    );

  return (
    <Badge variant="outline" className={`${badgeStyle} gap-1`}>
      {icon}
      <span>{level}</span>
    </Badge>
  );
}
