import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	turbopack: {
		root: __dirname,
	},
	allowedDevOrigins: ["dev.orgatick.site", '10.176.228.82'],
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{ protocol: "https", hostname: "res.cloudinary.com" },
			{ protocol: "https", hostname: "api.dicebear.com" },
			{ protocol: "https", hostname: "avatar.iran.liara.run" },
			{ protocol: "https", hostname: "kvdwhxhykbwfuyzcjukg.supabase.co" },
		],
	},
};

export default nextConfig;
