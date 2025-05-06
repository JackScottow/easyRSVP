import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import React from "react";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import UserMenu from "@/components/layout/UserMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const Navbar = async () => {
  let user = null;

  try {
    const cookieStore = await cookies();

    try {
      const supabase = createClient(cookieStore);
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error in Navbar authentication:", error.message);
      } else {
        user = data.user;
      }
    } catch (clientError) {
      console.error("Failed to initialize Supabase client:", clientError);
    }
  } catch (cookieError) {
    console.error("Failed to access cookies:", cookieError);
  }

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EasyRSVP</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:underline">
                Login
              </Link>
              <Button asChild size="sm">
                <Link href="/register">Sign Up Free</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
