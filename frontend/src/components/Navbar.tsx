"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sprout, 
  Satellite, 
  Globe, 
  Sparkles, 
  MapPin, 
  LogIn, 
  LogOut, 
  User as UserIcon, 
  Navigation as NavigationIcon,
  ChevronDown,
  Activity,
  Layers,
  CloudRain,
  TrendingUp,
  Home as HomeIcon,
  ArrowRight,
  Bell,
  Menu,
  X,
  Droplets
} from "lucide-react";
import { useLanguage, Language } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const SUPPORTED_LANGS: { code: Language; name: string; native: string }[] = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

interface NavbarProps {
  viewMode: "home" | "dashboard";
  onViewModeChange: (mode: "home" | "dashboard") => void;
  onOpenInspector: () => void;
  onOpenCreateFarm: () => void;
  onOpenLocationPicker: () => void;
  onOpenNotifications: () => void;
  unreadAlertsCount?: number;
  locationName: string;
  activeTab: string;
  onTabChange: (tab: any) => void;
}

export default function Navbar({
  viewMode,
  onViewModeChange,
  onOpenInspector,
  onOpenCreateFarm,
  onOpenLocationPicker,
  onOpenNotifications,
  unreadAlertsCount,
  locationName,
  activeTab,
  onTabChange,
}: NavbarProps) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const handleDashboardClick = () => {
    setMobileMenuOpen(false);
    if (user) {
      onViewModeChange("dashboard");
    } else {
      router.push("/login");
    }
  };

  const navItems = [
    { id: "command", label: t("command_center"), icon: Activity, badge: "Live" },
    { id: "satellite_srm", label: t("satellite_srm"), icon: Satellite, badge: "10m L2A" },
    { id: "soil", label: t("soil_precision"), icon: Layers, badge: "4-Layer" },
    { id: "weather_radar", label: t("weather_radar"), icon: CloudRain, badge: "ECMWF" },
    { id: "national_analytics", label: t("national_analytics"), icon: TrendingUp, badge: "ICAR" },
  ];

  return (
    <header className="sticky top-0 z-50 px-2 sm:px-6 pt-2 sm:pt-3 pb-2 transition-all">
      <div className="max-w-7xl mx-auto space-y-2">
        
        {/* Top Floating Pill Container */}
        <div className="rounded-full bg-[#FEFEFA]/95 backdrop-blur-xl border border-[#E5E0D5] px-3 sm:px-6 py-2 sm:py-2.5 shadow-soft flex items-center justify-between gap-2">
          
          {/* Left Branding */}
          <div 
            onClick={() => {
              onViewModeChange("home");
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#4A5D43] flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform shrink-0">
              <Sprout className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-lg font-bold tracking-tight text-[#2C2C24] font-serif">
                  AgriSphere <span className="text-[#4A5D43] italic font-normal">AI</span>
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-extrabold uppercase rounded-full bg-[#EAE6DD] text-[#3D4C37] border border-[#DAD5C9]">
                  SIH 2026
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Center Segmented Pill Switcher */}
          <div className="hidden md:flex bg-[#EAE6DE] p-1 rounded-full items-center gap-1 border border-[#DAD5C9]/60 shadow-inner">
            <button
              onClick={() => onViewModeChange("home")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                viewMode === "home"
                  ? "bg-[#4A5D43] text-white shadow-soft"
                  : "text-[#4A5D43] hover:text-black hover:bg-[#DFD9CE]"
              }`}
            >
              <HomeIcon className="w-3.5 h-3.5" />
              <span>Home Overview</span>
            </button>

            <button
              onClick={handleDashboardClick}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                viewMode === "dashboard"
                  ? "bg-[#4A5D43] text-white shadow-soft"
                  : "text-[#4A5D43] hover:text-black hover:bg-[#DFD9CE]"
              }`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>{user ? "Farm Dashboard" : "Login Dashboard"}</span>
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Agro-Advisory Notification Center Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-full bg-[#FAF8F3] border border-[#E5E0D5] text-[#2C2C24] hover:border-[#4A5D43] transition cursor-pointer shadow-sm group"
              title="Agro-Advisories & Alerts"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4A5D43] group-hover:scale-110 transition-transform" />
              {(unreadAlertsCount ?? 3) > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#E0533C] text-white text-[8px] sm:text-[9px] font-extrabold flex items-center justify-center border-2 border-white shadow-xs">
                  {unreadAlertsCount ?? 3}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center rounded-full bg-[#FAF8F3] border border-[#E5E0D5] px-2 sm:px-3 py-1 shadow-sm hover:border-[#4A5D43] transition">
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#4A5D43] mr-1" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                aria-label="Select Language"
                className="bg-transparent text-[11px] sm:text-xs text-[#2C2C24] font-semibold py-0.5 pr-0.5 outline-none cursor-pointer"
              >
                {SUPPORTED_LANGS.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#FEFEFA] text-[#2C2C24]">
                    {l.native}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Auth Sign In / User Profile */}
            <div className="hidden sm:block">
              {user ? (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A5D43]/10 border border-[#4A5D43]/20 text-xs font-bold text-[#2C2C24]">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Avatar"
                      className="w-4 h-4 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5 text-[#4A5D43]" />
                  )}
                  <span className="truncate max-w-[80px]">
                    {user.user_metadata?.full_name?.split(" ")[0] || "Farmer"}
                  </span>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="text-[#78786C] hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#4A5D43] hover:bg-[#3A4B34] text-white text-xs font-bold shadow-soft transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-full bg-[#FAF8F3] border border-[#E5E0D5] text-[#2C2C24] hover:bg-[#F0EBE5] transition cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-[#4A5D43]" /> : <Menu className="w-4 h-4 text-[#4A5D43]" />}
            </button>

          </div>

        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-[#FEFEFA] border border-[#E5E0D5] rounded-3xl p-4 shadow-xl space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onViewModeChange("home");
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
                  viewMode === "home"
                    ? "bg-[#4A5D43] text-white"
                    : "bg-[#F0EBE5] text-[#2C2C24] hover:bg-[#E5DFD7]"
                }`}
              >
                <HomeIcon className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>

              <button
                onClick={handleDashboardClick}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
                  viewMode === "dashboard"
                    ? "bg-[#4A5D43] text-white"
                    : "bg-[#F0EBE5] text-[#2C2C24] hover:bg-[#E5DFD7]"
                }`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
            </div>

            <div className="pt-2 border-t border-[#E5E0D5] flex items-center justify-between">
              {user ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#2C2C24]">
                    <UserIcon className="w-4 h-4 text-[#4A5D43]" />
                    <span>{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-xs text-red-600 font-bold px-2 py-1 bg-red-50 rounded-lg"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-2xl bg-[#4A5D43] text-white font-bold text-xs block"
                >
                  ➔ Sign In / Farmer Account
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Sub-tier Navigation Pills (when in Dashboard View) */}
        {viewMode === "dashboard" && (
          <nav className="flex space-x-1.5 sm:space-x-2 overflow-x-auto pt-1 pb-1 scrollbar-none px-1 animate-in fade-in duration-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-[#4A5D43] text-white shadow-soft scale-100"
                      : "bg-[#FEFEFA]/90 text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5] border border-[#E5E0D5]"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? "text-white" : "text-[#4A5D43]"}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-extrabold rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#C18C5D]/15 text-[#C18C5D]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

      </div>
    </header>
  );
}
