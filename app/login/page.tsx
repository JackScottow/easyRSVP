"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { SupabaseClient } from "@supabase/supabase-js";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clientInitError, setClientInitError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const client = createSupabaseBrowserClient();
      setSupabase(client);
    } catch (err) {
      console.error("Failed to initialize Supabase client:", err);
      setClientInitError("Authentication service unavailable. Please try again later.");
    }
  }, []);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      setError("Authentication service is not available. Please refresh the page and try again.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        // Redirect to the original requested page or dashboard by default
        router.push(redirectPath);
        router.refresh(); // Force refresh to update server-side session state
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (clientInitError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{clientInitError}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleLogin}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>{redirectPath !== "/dashboard" ? "Please login to continue to the requested page" : "Enter your email and password to access your account"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
            </div>
            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading || !supabase}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
