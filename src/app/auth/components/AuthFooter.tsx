"use client";

import Link from "next/link";

export default function AuthFooter() {
  return (
    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground pt-6 mt-auto">
      <span>By continuing, you agree to our</span>
      <Link href="/terms" className="text-primary hover:underline font-medium">
        Terms of Service
      </Link>
      <span>and</span>
      <Link href="/privacy" className="text-primary hover:underline font-medium">
        Privacy Policy
      </Link>
    </div>
  );
}
