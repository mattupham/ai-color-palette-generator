"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
	textToCopy: string;
	className?: string;
}

export function CopyButton({ textToCopy, className = "" }: CopyButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent event bubbling
		navigator.clipboard.writeText(textToCopy);
		setCopied(true);

		// Reset after 2 seconds
		setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	return (
		<Button
			aria-label={copied ? "Copied!" : "Copy color code"}
			className={`rounded-full bg-white/90 text-black hover:bg-white ${className} perspective`}
			onClick={handleCopy}
			size="icon"
			style={{ perspective: "1000px" }}
		>
			<div
				className="preserve-3d relative h-full w-full transform-gpu transition-transform duration-300"
				style={{
					transformStyle: "preserve-3d",
					transform: copied ? "rotateY(180deg)" : "rotateY(0deg)",
				}}
			>
				{/* Copy icon - front side */}
				<div
					className="backface-hidden absolute inset-0 flex items-center justify-center"
					style={{ backfaceVisibility: "hidden" }}
				>
					<Copy className="h-4 w-4" />
				</div>

				{/* Check icon - back side (flipped 180 degrees) */}
				<div
					className="backface-hidden absolute inset-0 flex items-center justify-center"
					style={{
						backfaceVisibility: "hidden",
						transform: "rotateY(180deg)",
					}}
				>
					<Check className="h-4 w-4" />
				</div>
			</div>
		</Button>
	);
}
