import { SignUpForm } from "@/app/(auth)/signup/_components/sign-up-form";

export default async function Page(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await props.searchParams;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm initialError={error} />
      </div>
    </div>
  );
}
