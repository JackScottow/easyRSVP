"use client"; // Needs to be a client component for form interaction

import React from "react";
import { createSupabaseBrowserClient as createClient } from "@/utils/supabase/client"; // Use correct function name and alias it
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";

interface UserMenuProps {
  user: User;
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // Refresh server components
    router.push("/"); // Redirect to home
  };

  return (
    <div className="flex items-center gap-4">
      <Link href="/dashboard">
        <Button variant="outline" size="sm" className="text-sm  hidden sm:inline">
          Dashboard
        </Button>
      </Link>
      <form action={handleLogout}>
        <Button variant="outline" size="sm" type="submit">
          Logout
        </Button>
      </form>
    </div>
  );
};

export default UserMenu;
