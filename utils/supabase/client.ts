import { createBrowserClient } from "@supabase/ssr";
// Remove dotenv import - Next.js handles NEXT_PUBLIC_ variables automatically for browser
// import * as dotenv from "dotenv";

// Remove dotenv config - not needed in browser code
// dotenv.config({ path: ".env.local" });

export function createSupabaseBrowserClient() {
  // Access variable directly - Next.js replaces this during build/dev
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!supabaseAnonKey) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  // Create a singleton Supabase client for browser based usage
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
