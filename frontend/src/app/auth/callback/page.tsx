"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Sprout, Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // 1. Process client hash fragment if present
    if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        supabase.auth
          .setSession({ access_token, refresh_token })
          .then(() => {
            router.replace("/");
          })
          .catch((err) => {
            console.error("Auth callback session error:", err);
            router.replace("/");
          });
        return;
      }
    }

    // 2. Fallback check for session
    supabase.auth.getSession().then(({ data: { session } }) => {
      router.replace("/");
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col items-center justify-center space-y-4 font-sans text-[#2C2C24]">
      <div className="w-14 h-14 rounded-2xl bg-[#4A5D43] flex items-center justify-center text-white shadow-soft">
        <Sprout className="w-8 h-8" />
      </div>
      <div className="flex items-center gap-2 text-sm font-bold text-[#4A5D43]">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Authenticating your Farmer Profile...</span>
      </div>
    </div>
  );
}
