"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signInAsDemoFarmer: (farmerName?: string) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = "agrisense_auth_user";
const LOCAL_STORAGE_FARMERS_DB = "agrisense_registered_farmers";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to create a standardized User object
  const createLocalUser = (email: string, fullName?: string): User => {
    const name = fullName || email.split("@")[0].replace(/[^a-zA-Z]/g, " ").trim();
    return {
      id: "usr_" + Math.random().toString(36).substring(2, 11),
      app_metadata: { provider: "email" },
      user_metadata: {
        full_name: name.charAt(0).toUpperCase() + name.slice(1) || "Farmer",
        email: email,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`
      },
      aud: "authenticated",
      email: email,
      created_at: new Date().toISOString(),
      role: "authenticated",
      updated_at: new Date().toISOString()
    } as User;
  };

  useEffect(() => {
    // 1. Check if OAuth returned with hash fragment #access_token=...&refresh_token=...
    if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        supabase.auth
          .setSession({ access_token, refresh_token })
          .then(({ data, error }) => {
            if (!error && data.session) {
              setSession(data.session);
              setUser(data.session.user);
              try {
                localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.session.user));
              } catch (_) {}
            }
            window.history.replaceState(null, "", window.location.pathname);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      }
    }

    // 2. Fetch existing Supabase session or Local fallback user
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);
        setLoading(false);
      } else {
        // Check local storage fallback
        try {
          const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        } catch (_) {}
        setLoading(false);
      }
    });

    // 3. Listen to Supabase auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (newSession?.user) {
        setSession(newSession);
        setUser(newSession.user);
        try {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newSession.user));
        } catch (_) {}
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/auth/callback`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

  const signInWithEmail = async (email: string, password: string): Promise<{ error: any }> => {
    const cleanEmail = email.toLowerCase().trim();

    // 1. Try Supabase first
    try {
      const res = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (!res.error && res.data.session) {
        setSession(res.data.session);
        setUser(res.data.session.user);
        try {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(res.data.session.user));
        } catch (_) {}
        return { error: null };
      }
    } catch (_) {}

    // 2. Local Fallback Database Validation
    try {
      const farmersRaw = localStorage.getItem(LOCAL_STORAGE_FARMERS_DB);
      const farmers = farmersRaw ? JSON.parse(farmersRaw) : {};

      if (farmers[cleanEmail]) {
        if (farmers[cleanEmail].password === password) {
          const localUser = createLocalUser(cleanEmail, farmers[cleanEmail].name);
          setUser(localUser);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(localUser));
          return { error: null };
        } else {
          return { error: { message: "Invalid password for this account. Please try again." } };
        }
      } else {
        // Auto-create local user session if not in DB
        const localUser = createLocalUser(cleanEmail);
        farmers[cleanEmail] = { password, name: localUser.user_metadata.full_name };
        localStorage.setItem(LOCAL_STORAGE_FARMERS_DB, JSON.stringify(farmers));
        setUser(localUser);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(localUser));
        return { error: null };
      }
    } catch (e: any) {
      return { error: { message: e.message || "Failed to sign in." } };
    }
  };

  const signUpWithEmail = async (email: string, password: string): Promise<{ error: any }> => {
    const cleanEmail = email.toLowerCase().trim();

    // 1. Try Supabase first
    try {
      const res = await supabase.auth.signUp({ email: cleanEmail, password });
      if (!res.error && res.data.user) {
        if (res.data.session) {
          setSession(res.data.session);
          setUser(res.data.session.user);
        } else {
          // Auto-sign in locally if Supabase requires confirmation
          const localUser = createLocalUser(cleanEmail);
          setUser(localUser);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(localUser));
        }
        return { error: null };
      }
    } catch (_) {}

    // 2. Local Fallback Database Registration
    try {
      const farmersRaw = localStorage.getItem(LOCAL_STORAGE_FARMERS_DB);
      const farmers = farmersRaw ? JSON.parse(farmersRaw) : {};

      const localUser = createLocalUser(cleanEmail);
      farmers[cleanEmail] = { password, name: localUser.user_metadata.full_name };
      localStorage.setItem(LOCAL_STORAGE_FARMERS_DB, JSON.stringify(farmers));
      setUser(localUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(localUser));
      return { error: null };
    } catch (e: any) {
      return { error: { message: e.message || "Failed to register." } };
    }
  };

  const signInAsDemoFarmer = (farmerName: string = "Ramesh Patel") => {
    const demoUser = createLocalUser("demo.farmer@agrisense.gov.in", farmerName);
    setUser(demoUser);
    try {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
    } catch (_) {}
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (_) {}
    try {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    } catch (_) {}
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInAsDemoFarmer,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
