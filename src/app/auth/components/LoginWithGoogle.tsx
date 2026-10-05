"use client";

import { Button } from "@/components/ui/button";
import { IconBrandGoogle, IconLoader3 } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function LoginWithGoogle() {
	const [loading, setLoading] = useState(false);

	const handleGoogleLogin = async () => {
		try {
			setLoading(true);
			const client = createClient();
			const { error } = await client.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}`,
				},
			});
			if (error) {
				toast.error(error.message || "Failed to sign in with Google");
				setLoading(false);
			}
		} catch {
			toast.error("An unexpected error occurred");
			setLoading(false);
		}
	};

	return (
		<Button
			type="button"
			variant="default"
			onClick={handleGoogleLogin}
			disabled={loading}
			className="w-full relative group cursor-pointer"
			size="lg"
		>
			{loading ? (
				<div className="flex items-center gap-2">
					<IconLoader3 className="h-5 w-5 animate-spin" />
					<span>Connecting...</span>
				</div>
			) : (
				<div className="flex items-center justify-center gap-3">
					<IconBrandGoogle className="h-5 w-5 transition-transform group-hover:scale-110" />
					<span className="font-semibold">Continue with Google</span>
				</div>
			)}
		</Button>
	);
}
