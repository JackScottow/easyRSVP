"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Menu } from "lucide-react";
import UserMenu from "@/components/layout/UserMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    // Get current user
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EasyRSVP</span>
          </Link>
        </div>
        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-4">
          {user ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const supabase = createSupabaseBrowserClient();
                  await supabase.auth.signOut();
                  window.location.href = "/";
                }}>
                <Button variant="outline" size="sm" type="submit">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Sign Up Free</Link>
              </Button>
            </>
          )}
          <ThemeToggle />
        </div>
        {/* Mobile Nav: ThemeToggle + Burger */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button className="p-2 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary" onClick={() => setMobileMenuOpen((open) => !open)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pb-4">
          <div className="flex flex-col gap-2 bg-background rounded shadow-md p-4 mt-2">
            {user ? (
              <div className="flex flex-col gap-2 w-full">
                <Button asChild variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const supabase = createSupabaseBrowserClient();
                    await supabase.auth.signOut();
                    window.location.href = "/";
                  }}
                  className="w-full">
                  <Button variant="outline" size="sm" type="submit" className="w-full">
                    Logout
                  </Button>
                </form>
              </div>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/register">Sign Up Free</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
