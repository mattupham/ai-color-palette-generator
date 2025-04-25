import React, { useState } from "react";
import { getFallbackPalettes, usePaletteQuery } from "../lib/palette-queries";

interface PaletteGeneratorProps {
  useMockData?: boolean;
}

const PaletteGenerator: React.FC<PaletteGeneratorProps> = ({
  useMockData = false,
}) => {
  const [feeling, setFeeling] = useState("");
  const [inputValue, setInputValue] = useState("");

  // Use React Query to fetch palettes
  const {
    data: palettes,
    isPending,
    isError,
    error,
  } = usePaletteQuery(feeling, useMockData);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeeling(inputValue);
  };

  return (
    <div className="palette-generator">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a feeling or mood..."
          className="input"
        />
        <button type="submit" className="button" disabled={isPending}>
          Generate Palettes
        </button>
      </form>

      {/* Loading state */}
      {isPending && <div className="loading">Loading palettes...</div>}

      {/* Error state */}
      {isError && (
        <div className="error">
          <p>Error loading palettes: {error?.message}</p>
          <div className="fallback-palettes">
            <h3>Using fallback palettes instead:</h3>
            {getFallbackPalettes().map((palette, index) => (
              <div key={index} className="palette">
                <h4>{palette.name}</h4>
                <div className="colors">
                  {palette.colors.map((color, i) => (
                    <div
                      key={i}
                      className="color-preview"
                      style={{ backgroundColor: color }}
                    >
                      <span>{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success state with palettes */}
      {!isPending && !isError && palettes && (
        <div className="palettes">
          {palettes.map((palette, index) => (
            <div key={index} className="palette">
              <h3>{palette.name}</h3>
              <div className="colors">
                {palette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="color-preview"
                    style={{ backgroundColor: color }}
                  >
                    <span>{color}</span>
                    {palette.roles && (
                      <span className="role">{palette.roles[i]}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaletteGenerator;
