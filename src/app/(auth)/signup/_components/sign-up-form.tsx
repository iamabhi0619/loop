"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpAction, type SignUpState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const initialState: SignUpState = {};

export function SignUpForm({
  initialError,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { initialError?: string }) {
  const [state, formAction, pending] = useActionState(
    signUpAction,
    initialError ? { error: initialError } : initialState,
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="font-medium text-lg tracking-normal">
            Sign up
          </CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  autoComplete="email"
                  defaultValue={state.values?.email}
                  aria-invalid={Boolean(state.error)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  aria-invalid={Boolean(state.error)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeatPassword">Repeat Password</Label>
                <Input
                  id="repeatPassword"
                  name="repeatPassword"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  aria-invalid={Boolean(state.error)}
                />
              </div>
              {state.error && (
                <p className="text-sm text-destructive" aria-live="polite">
                  {state.error}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Creating an account..." : "Sign up"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
