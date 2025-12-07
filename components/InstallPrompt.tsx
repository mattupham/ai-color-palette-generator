import Image from "next/image";
import { useEffect, useState } from "react";

// Extend Window interface for MSStream (IE-specific property)
interface WindowWithMSStream extends Window {
	MSStream?: unknown;
}

export function InstallPrompt() {
	const [isIOS, setIsIOS] = useState(false);
	const [isStandalone, setIsStandalone] = useState(false);

	useEffect(() => {
		setIsIOS(
			/iPad|iPhone|iPod/.test(navigator.userAgent) &&
				!(window as WindowWithMSStream).MSStream,
		);

		setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
	}, []);

	if (!isIOS || isStandalone) {
		return null; // Don't show install button if already installed or not iOS
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
			<div className="flex flex-col items-center justify-center">
				<h1 className="mb-8 font-semibold text-3xl">Install to Continue</h1>

				{isIOS && (
					<div className="space-y-8 text-left">
						<div className="space-y-4">
							<p className="text-muted-foreground">Follow these steps:</p>
							<div className="flex items-center gap-3">
								<span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-sm">
									1
								</span>
								<span>Tap the 'Share' icon</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-sm">
									2
								</span>
								<span>Scroll Down</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-sm">
									3
								</span>
								<span>Select 'Add to Home Screen'</span>
							</div>
						</div>
						<Image
							alt="Installation instruction"
							className="rounded-sm"
							height={250}
							src="/install.jpg"
							width={250}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
