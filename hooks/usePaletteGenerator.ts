import { trpc } from "@/lib/trpc/client";
import { useCallback, useState } from "react";

export function usePaletteGenerator() {
	const [inputValue, setInputValue] = useState("");

	// React Query mutation handles all state management
	const mutation = trpc.palette.generatePalettes.useMutation();

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (!inputValue.trim()) return;

			mutation.mutate({ vibe: inputValue });
		},
		[inputValue, mutation],
	);

	return {
		inputValue,
		setInputValue,
		mutation,
		handleSubmit,
	};
}
