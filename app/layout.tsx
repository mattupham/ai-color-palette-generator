import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { TRPCProvider } from "@/lib/trpc/provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "AI Color Palette Generator",
	description: "Generate beautiful color palettes with AI based on your vibe",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					disableTransitionOnChange
					enableSystem
				>
					<TRPCProvider>{children}</TRPCProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
