"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "../../components/auth/RegisterForm";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "login";
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [activeTab, setActiveTab] = useState(mode);

  useEffect(() => {
    try {
      const client = createSupabaseBrowserClient();
      setSupabase(client);
    } catch (err) {
      console.error("Failed to initialize Supabase client:", err);
    }
  }, []);

  // Update URL when tab changes without full navigation
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("mode", value);
    window.history.pushState(null, "", `?${newParams.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col pt-20 px-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <div className="relative">
              <TabsContent value="login" className="m-0 mt-2">
                {supabase && <LoginForm supabase={supabase} redirectPath={redirectPath} />}
              </TabsContent>
              <TabsContent value="register" className="m-0 mt-2">
                {supabase && <RegisterForm supabase={supabase} redirectPath={redirectPath} />}
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
