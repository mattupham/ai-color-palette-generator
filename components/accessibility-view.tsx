"use client";

import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { analyzeContrast } from "@/lib/color-accessibility";
import { Info } from "lucide-react";
import { useState } from "react";

interface AccessibilityViewProps {
  colors: string[];
}

export function AccessibilityView({ colors }: AccessibilityViewProps) {
  const [showAccessibility, setShowAccessibility] = useState(false);

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

  const score = Math.round((passedAA / totalPairs) * 100);

  // Determine the overall accessibility level
  let accessibilityLevel = "Fail";
  let levelColor = "bg-red-500 text-white";

  if (score === 100) {
    if (passedAAA === totalPairs) {
      accessibilityLevel = "AAA";
      levelColor = "bg-green-500 text-white";
    } else {
      accessibilityLevel = "AA";
      levelColor = "bg-yellow-500 text-black";
    }
  } else if (score >= 80) {
    accessibilityLevel = "AA*";
    levelColor = "bg-yellow-500 text-black";
  } else if (score >= 50) {
    accessibilityLevel = "A*";
    levelColor = "bg-orange-500 text-white";
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAccessibility(!showAccessibility)}
          className="text-xs flex items-center gap-1 px-2 h-7"
        >
          <Info className="h-3.5 w-3.5" />
          {showAccessibility ? "Hide Accessibility" : "Show Accessibility"}
        </Button>

        {/* Always visible accessibility summary */}
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-1.5 py-0.5 rounded ${levelColor}`}>
            {accessibilityLevel}
          </span>
          <span
            className={`font-medium ${
              score >= 80
                ? "text-green-500"
                : score >= 60
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {score}%
          </span>
        </div>
      </div>

      {showAccessibility && (
        <div className="grid grid-cols-1 gap-2 mt-2">
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
                  <span className="text-xs font-mono">
                    {pair.formattedRatio}
                  </span>
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
      )}
    </div>
  );
}
