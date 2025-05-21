import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function RegisterPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const redirectPath = (searchParams.redirect as string) || "/dashboard";

  // Build the redirect URL with the mode and redirect parameters
  const redirectUrl = `/auth?mode=register${redirectPath ? `&redirect=${encodeURIComponent(redirectPath)}` : ""}`;

  // Redirect to the auth page
  redirect(redirectUrl);
}
