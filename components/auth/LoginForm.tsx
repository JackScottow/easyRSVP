"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { SupabaseClient } from "@supabase/supabase-js";

interface LoginFormProps {
  supabase: SupabaseClient;
  redirectPath?: string;
}

export default function LoginForm({ supabase, redirectPath = "/dashboard" }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          if (signInError.message.includes("503") || signInError.message.includes("Service Unavailable")) {
            retryCount++;
            if (retryCount < maxRetries) {
              // Wait for 1 second before retrying
              await new Promise((resolve) => setTimeout(resolve, 1000));
              continue;
            }
          }
          setError(signInError.message);
          break;
        } else {
          // Login successful
          router.push(redirectPath);
          router.refresh();
          break;
        }
      } catch (error) {
        console.error("Login error:", error);
        retryCount++;
        if (retryCount < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
        setError("An unexpected error occurred during login. Please try again.");
        break;
      }
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setOauthError(null);
    setOauthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) {
        setOauthError(error.message);
      }
      // The user will be redirected by Supabase, so no need to handle success here
    } catch (err: any) {
      setOauthError(err.message || "An unexpected error occurred during Google login.");
    } finally {
      setOauthLoading(false);
    }
  };

  return (
    <>
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </form>
      <div className="px-6 pb-6 flex flex-col gap-2">
        <Button type="button" className="w-full bg-white text-black border border-gray-300 hover:bg-gray-100 flex items-center justify-center gap-2" onClick={handleGoogleLogin} disabled={oauthLoading}>
          <svg width="20" height="20" viewBox="0 0 48 48" className="inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303C33.972 32.833 29.418 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c2.803 0 5.377.99 7.413 2.626l6.293-6.293C34.583 6.162 29.617 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c11.045 0 19.799-8.955 19.799-20 0-1.341-.138-2.651-.188-3.917z" />
              <path fill="#34A853" d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 13 24 13c2.803 0 5.377.99 7.413 2.626l6.293-6.293C34.583 6.162 29.617 4 24 4c-7.732 0-14.41 4.388-17.694 10.691z" />
              <path fill="#FBBC05" d="M24 44c5.356 0 10.19-1.797 13.986-4.888l-6.482-5.307C29.418 36 24 36 24 36c-5.418 0-9.972-3.167-11.303-7.917l-6.571 5.081C9.59 39.612 16.268 44 24 44z" />
              <path fill="#EA4335" d="M43.611 20.083H42V20H24v8h11.303C34.418 32.833 29.418 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c2.803 0 5.377.99 7.413 2.626l6.293-6.293C34.583 6.162 29.617 4 24 4c-7.732 0-14.41 4.388-17.694 10.691z" />
            </g>
          </svg>
          {oauthLoading ? "Signing in with Google..." : "Sign in with Google"}
        </Button>
        {oauthError && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{oauthError}</AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
}
