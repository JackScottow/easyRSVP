import { createServerClient, type CookieOptions } from "@supabase/ssr";
import * as dotenv from "dotenv";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

dotenv.config({ path: ".env.local" });

export function createClient(cookieStore: ReadonlyRequestCookies) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      console.error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
      throw new Error("Authentication configuration error");
    }
    if (!supabaseAnonKey) {
      console.error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
      throw new Error("Authentication configuration error");
    }

    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          try {
            return cookieStore.get(name)?.value;
          } catch (error) {
            console.error(`Error getting cookie ${name}:`, error);
            return undefined;
          }
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            console.debug("Cookie set failed (expected in Server Components):", error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            console.debug("Cookie remove failed (expected in Server Components):", error);
          }
        },
      },
    });
  } catch (error) {
    console.error("Error creating Supabase server client:", error);
    throw new Error("Failed to initialize authentication service");
  }
}
