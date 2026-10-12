"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { type SignInValues, signInSchema, type SignUpValues, signUpSchema } from "@/lib/validation/auth";

export type SignUpState = {
  error?: string;
  values?: Pick<SignUpValues, "email">;
};

export async function signUpAction(_prevState: SignUpState, formData: FormData): Promise<SignUpState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    repeatPassword: formData.get("repeatPassword"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid form data",
      values: { email: String(formData.get("email") ?? "") },
    };
  }

  const { email, password } = parsed.data;

  const headerStore = await headers();
  const host = headerStore.get("host") ?? "localhost:3000";
  const proto = headerStore.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}`,
    },
  });

  if (error) {
    console.log("error", error);
    return { error: error.message, values: { email } };
  }

  redirect("/signup/success");
}

export type SignInState = {
  error?: string;
  values?: Pick<SignInValues, "email">;
};

export async function signInAction(_prevState: SignInState, formData: FormData): Promise<SignInState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid form data",
      values: { email: String(formData.get("email") ?? "") },
    };
  }

  const { email, password } = parsed.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message, values: { email } };
  }

  redirect("/protected");
}
