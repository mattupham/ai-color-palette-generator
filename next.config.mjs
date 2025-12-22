/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				pathname: "/**",
			},
		],
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
				{
					key: "Content-Security-Policy",
					value:
						"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://accounts.google.com https://apis.google.com; style-src 'self' 'unsafe-inline' https://accounts.google.com; img-src 'self' data: https://lh3.googleusercontent.com https://avatars.githubusercontent.com; connect-src 'self' https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://vercel.live https://accounts.google.com https://oauth2.googleapis.com https://*.googleapis.com; font-src 'self' data:; frame-src https://accounts.google.com;",
				},
				],
			},
			{
				source: "/sw.js",
				headers: [
					{
						key: "Content-Type",
						value: "application/javascript; charset=utf-8",
					},
					{
						key: "Cache-Control",
						value: "no-cache, no-store, must-revalidate",
					},
					{
						key: "Content-Security-Policy",
						value:
							"default-src 'self'; script-src 'self'; connect-src 'self' https://lh3.googleusercontent.com https://avatars.githubusercontent.com; img-src 'self' data: https://lh3.googleusercontent.com https://avatars.githubusercontent.com;",
					},
				],
			},
		];
	},
};

export default nextConfig;
