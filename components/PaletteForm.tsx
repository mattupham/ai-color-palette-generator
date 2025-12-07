import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PaletteFormProps {
	inputValue: string;
	setInputValue: (value: string) => void;
	onSubmit: (e: React.FormEvent) => void;
	isPending: boolean;
}

export function PaletteForm({
	inputValue,
	setInputValue,
	onSubmit,
	isPending,
}: PaletteFormProps) {
	const disabled = isPending || !inputValue.trim();

	return (
		<form
			className="mx-auto mb-4 flex w-full max-w-lg gap-4"
			onSubmit={onSubmit}
		>
			<Input
				className="flex-1"
				disabled={isPending}
				onChange={(e) => setInputValue(e.target.value)}
				placeholder="My vibe is..."
				value={inputValue}
			/>
			<Button disabled={disabled} isLoading={isPending} type="submit">
				Generate
			</Button>
		</form>
	);
}
