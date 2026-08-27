"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sprout, 
  Database, 
  Satellite, 
  Bot, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Zap,
  UserCheck
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, signInAsDemoFarmer } = useAuth();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Failed to authenticate with Google.");
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    setLoading(true);
    signInAsDemoFarmer("Ramesh Patel");
    setTimeout(() => {
      router.push("/");
    }, 150);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccessMsg(null);

      if (mode === "signin") {
        const { error: signInErr } = await signInWithEmail(email, password);
        if (signInErr) throw signInErr;
        router.push("/");
      } else {
        const { error: signUpErr } = await signUpWithEmail(email, password);
        if (signUpErr) throw signUpErr;
        setSuccessMsg("Account successfully registered! Logging you in...");
        setTimeout(() => {
          router.push("/");
        }, 300);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#2C2C24] flex flex-col font-sans selection:bg-[#4A5D43] selection:text-white p-4 sm:p-8 relative">
      
      {/* Top Header Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FEFEFA] hover:bg-[#F0EBE5] text-xs font-bold text-[#6B665C] border border-[#E5E0D5] transition shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home Overview</span>
        </Link>

        <div className="flex items-center gap-1.5 text-xs text-[#78786C] font-semibold">
          <ShieldCheck className="w-4 h-4 text-[#4A5D43]" />
          <span>Encrypted Cloud Gateway</span>
        </div>
      </div>

      {/* Main Two-Column Container */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1 my-auto">
        
        {/* Left Column: Branding & Feature Highlights */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#4A5D43] flex items-center justify-center text-white shadow-soft shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-[#2C2C24] font-serif">
                AgriSphere <span className="text-[#4A5D43] italic font-normal">AI</span>
              </span>
              <p className="text-xs text-[#78786C]">
                Unified Agricultural Intelligence & SRM Platform
              </p>
            </div>
          </div>

          {/* Badge & Title */}
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-[#EAE6DD] text-[#3D4C37] text-[10px] font-extrabold uppercase tracking-wider border border-[#DAD5C9]">
              AUTHENTICATION DASHBOARD
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2C2C24] font-serif leading-tight">
              Farmer Access <span className="font-light text-[#4A5D43]">&</span> Cloud Database
            </h1>

            <p className="text-sm text-[#6B665C] leading-relaxed font-medium">
              Sign in with your email or Google account to access your private farm plots, live Doppler radar, and ICAR agronomist precision tools.
            </p>
          </div>

          {/* 3 Feature Cards */}
          <div className="space-y-3 pt-2">
            
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FEFEFA] border border-[#E5E0D5] shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[#4A5D43]/10 text-[#4A5D43] flex items-center justify-center shrink-0 mt-0.5">
                <Satellite className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2C2C24]">Cadastral Satellite Super-Resolution</h4>
                <p className="text-[11px] text-[#78786C]">
                  Real 10m Sentinel-2 optical imagery with 2.5m GeoSR neural super-resolution.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FEFEFA] border border-[#E5E0D5] shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[#C18C5D]/10 text-[#C18C5D] flex items-center justify-center shrink-0 mt-0.5">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2C2C24]">ISRIC SoilGrids & ECMWF 4-Layer Moisture</h4>
                <p className="text-[11px] text-[#78786C]">
                  250m global soil chemistry and root-zone physical moisture profiles.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FEFEFA] border border-[#E5E0D5] shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[#4A5D43]/10 text-[#4A5D43] flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2C2C24]">Krishi Mitra Multimodal AI</h4>
                <p className="text-[11px] text-[#78786C]">
                  24/7 AI agronomist tailored to your specific crop and soil conditions.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Sign In / Register Card */}
        <div className="lg:col-span-6">
          <div className="bg-[#FEFEFA] border border-[#E5E0D5] rounded-[2.5rem] p-7 sm:p-9 shadow-soft-lg space-y-5">
            
            {/* Card Header & Tab Switcher */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#2C2C24] font-serif">
                  {mode === "signin" ? "Sign In" : "Create Account"}
                </h2>
                <p className="text-xs text-[#78786C]">
                  {mode === "signin" 
                    ? "Enter your credentials or use Google" 
                    : "Register your farmer profile in seconds"}
                </p>
              </div>

              <div className="bg-[#EAE6DE] p-1 rounded-full flex items-center gap-1 border border-[#DAD5C9]/60">
                <button
                  type="button"
                  onClick={() => { setMode("signin"); setError(null); }}
                  className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    mode === "signin"
                      ? "bg-[#4A5D43] text-white shadow-soft"
                      : "text-[#4A5D43] hover:text-black"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("register"); setError(null); }}
                  className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    mode === "register"
                      ? "bg-[#4A5D43] text-white shadow-soft"
                      : "text-[#4A5D43] hover:text-black"
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Error or Success Alert */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* 1-Click Demo Login for Instant Evaluation */}
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-300 shadow-sm transition cursor-pointer active:scale-[0.99]"
            >
              <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600 animate-pulse" />
              <span>⚡ 1-Click Instant Demo Login (Nizamabad Smart Farm)</span>
            </button>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-[#FEFEFA] hover:bg-[#FAF8F3] text-[#2C2C24] font-bold text-xs border border-[#DAD5C9] shadow-soft transition cursor-pointer active:scale-[0.99]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.39 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.61 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#E5E0D5] w-full"></div>
              <span className="bg-[#FEFEFA] px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#8A857A]">
                OR EMAIL AND PASSWORD
              </span>
              <div className="border-t border-[#E5E0D5] w-full"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B665C]">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8A857A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@agrisphere.ai"
                    required
                    className="w-full bg-[#F7F5EE] border border-[#E5E0D5] rounded-2xl pl-10 pr-4 py-3 text-xs text-[#2C2C24] font-medium outline-none focus:border-[#4A5D43] transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B665C]">
                    PASSWORD
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8A857A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#F7F5EE] border border-[#E5E0D5] rounded-2xl pl-10 pr-10 py-3 text-xs text-[#2C2C24] font-medium outline-none focus:border-[#4A5D43] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A857A] hover:text-[#2C2C24]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-[#4A5D43] hover:bg-[#3A4B34] text-white font-bold text-xs shadow-soft transition cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{mode === "signin" ? "Sign In with Email" : "Create Account with Email"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* Card Footer */}
            <div className="pt-2 border-t border-[#E5E0D5] flex items-center justify-between text-[10px] text-[#78786C] font-semibold">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4A5D43]" />
                Encrypted Session Storage
              </span>
              <span>100% Reliable</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
