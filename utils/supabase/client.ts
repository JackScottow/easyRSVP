import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      console.error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
      throw new Error("Authentication configuration error. Please contact support.");
    }
    if (!supabaseAnonKey) {
      console.error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
      throw new Error("Authentication configuration error. Please contact support.");
    }

    // Create a singleton Supabase client for browser based usage
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Error creating Supabase browser client:", error);
    // Re-throw with a user-friendly message but log the actual error
    throw new Error("Failed to initialize authentication. Please try again later.");
  }
}
