import type React from "react";
import { useState } from "react";
import type { Palette } from "@/lib/palette-generator";
import { getFallbackPalettes, usePaletteQuery } from "@/lib/palette-queries";

interface PaletteGeneratorProps {
	useMockData?: boolean;
}

export const PaletteGenerator: React.FC<PaletteGeneratorProps> = ({
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
					className="input"
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="Enter a feeling or mood..."
					type="text"
					value={inputValue}
				/>
				<button className="button" disabled={isPending} type="submit">
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
						{getFallbackPalettes().map((palette: Palette, index: number) => (
							<div className="palette" key={index}>
								<h4>{palette.name}</h4>
								<div className="colors">
									{palette.colors.map((color: string, i: number) => (
										<div
											className="color-preview"
											key={i}
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
					{palettes.map((palette: Palette, index: number) => (
						<div className="palette" key={index}>
							<h3>{palette.name}</h3>
							<div className="colors">
								{palette.colors.map((color: string, i: number) => (
									<div
										className="color-preview"
										key={i}
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
