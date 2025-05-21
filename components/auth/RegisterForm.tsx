"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { SupabaseClient } from "@supabase/supabase-js";

interface RegisterFormProps {
  supabase: SupabaseClient;
  redirectPath?: string;
}

export default function RegisterForm({ supabase, redirectPath = "/dashboard" }: RegisterFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setIsLoading(false);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      // Registration successful!
      setError("Registration successful! Please check your email for confirmation.");
    }
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
      setOauthError(err.message || "An unexpected error occurred during Google sign up.");
    } finally {
      setOauthLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleRegister}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Register</CardTitle>
          <CardDescription>Create an account to manage your events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Choose a password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading} />
          </div>
          {error && (
            <Alert variant={error.includes("successful") ? "default" : "destructive"}>
              <Terminal className="h-4 w-4" />
              <AlertTitle>{error.includes("successful") ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
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
          {oauthLoading ? "Signing up with Google..." : "Sign up with Google"}
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
