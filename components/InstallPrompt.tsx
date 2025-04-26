import Image from "next/image";
import { useEffect, useState } from "react";

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (!isIOS || isStandalone) {
    return null; // Don't show install button if already installed or not iOS
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold mb-8">Install to Continue</h1>

        {isIOS && (
          <div className="space-y-8 text-left">
            <div className="space-y-4">
              <p className="text-muted-foreground">Follow these steps:</p>
              <div className="flex items-center gap-3">
                <span className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </span>
                <span>Tap the 'Share' icon</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </span>
                <span>Scroll Down</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </span>
                <span>Select 'Add to Home Screen'</span>
              </div>
            </div>
            <Image
              src="/install.jpg"
              alt="Installation instruction"
              width={250}
              height={250}
              className="rounded-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}
