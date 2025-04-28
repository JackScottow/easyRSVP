"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Use for redirection
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/utils/supabase/client"; // Import browser client
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      // Add options here if you want to redirect after email confirmation
      // or store extra data like username in metadata:
      // options: {
      //   emailRedirectTo: `${location.origin}/auth/callback`,
      //   data: { username: yourUsernameState } // If keeping username field
      // }
    });

    setIsLoading(false);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      // Registration successful!
      // Supabase sends a confirmation email by default.
      // You might want to show a message asking the user to check their email.
      setError("Registration successful! Please check your email for confirmation.");
      // Optionally redirect immediately or after a delay
      // router.push('/login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleRegister}>
          {" "}
          {/* Use form element */}
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Register</CardTitle>
            <CardDescription>Create an account to manage your events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Removed Username field */}
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
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
