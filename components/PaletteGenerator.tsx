import type React from "react";
import { useState } from "react";
import type { Palette } from "@/lib/palette-generator";
import { getFallbackPalettes, getMockPalettes } from "@/lib/palette-queries";
import { trpc } from "@/lib/trpc/client";

interface PaletteGeneratorProps {
	useMockData?: boolean;
}

export const PaletteGenerator: React.FC<PaletteGeneratorProps> = ({
	useMockData = false,
}) => {
	const [inputValue, setInputValue] = useState("");
	const [palettes, setPalettes] = useState<Palette[] | undefined>(undefined);

	// Use tRPC mutation to generate palettes
	const mutation = trpc.palette.generatePalettes.useMutation({
		onSuccess: (data) => {
			setPalettes(data.palettes);
		},
		onError: () => {
			setPalettes(getFallbackPalettes());
		},
	});

	const isPending = mutation.isPending;
	const isError = mutation.isError;
	const error = mutation.error;

	// Handle form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (useMockData) {
			const mockPalettes = getMockPalettes(inputValue.toLowerCase());
			setPalettes(mockPalettes || getFallbackPalettes());
		} else {
			mutation.mutate({ vibe: inputValue });
		}
	};

	return (
		<div className="palette-generator">
			<form onSubmit={handleSubmit}>
				<input
					className="input"
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="Enter a vibe or mood..."
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
