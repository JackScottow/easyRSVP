"use client";
import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

export default function SupabaseSessionInit() {
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getSession().then(console.log);
  }, []);
  return null;
}
