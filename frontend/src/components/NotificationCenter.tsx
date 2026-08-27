"use client";

import React, { useState } from "react";
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Trash2, 
  Send, 
  Check, 
  Radio, 
  ShieldCheck, 
  X, 
  Sparkles, 
  CloudRain, 
  Sprout, 
  Droplets,
  Layers,
  PhoneCall,
  Clock,
  ExternalLink
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface FarmNotification {
  id: string;
  type: "critical" | "warning" | "advisory" | "success";
  title: string;
  message: string;
  category: "weather" | "soil" | "satellite" | "pest" | "scheme";
  timestamp: string;
  isRead: boolean;
  actionText?: string;
}

const SAMPLE_NOTIFICATIONS: FarmNotification[] = [
  {
    id: "notif-1",
    type: "warning",
    category: "weather",
    title: "Heavy Rainfall Advisory (Next 48h)",
    message: "Open-Meteo ECMWF indicates 38mm cumulative rainfall starting tomorrow afternoon. Hold off granular Urea top-dressing to prevent leaching into subsoil.",
    timestamp: "12 mins ago",
    isRead: false,
    actionText: "View Weather Forecast"
  },
  {
    id: "notif-2",
    type: "critical",
    category: "pest",
    title: "High Foliar Blight Risk Detected",
    message: "Relative humidity at 82% with 27.5°C temperature creates prime conditions for Cercospora leaf spot. Preventive spray of Trichoderma viride @ 2.5 kg/acre recommended.",
    timestamp: "45 mins ago",
    isRead: false,
    actionText: "Check Leaf Vision Diagnosis"
  },
  {
    id: "notif-3",
    type: "advisory",
    category: "soil",
    title: "Root-Zone Moisture Stable (0.24 m³/m³)",
    message: "Topsoil moisture is within optimal field capacity. Next scheduled drip irrigation cycle recommended for Day 3 morning.",
    timestamp: "2 hours ago",
    isRead: false,
    actionText: "Inspect Soil Sensors"
  },
  {
    id: "notif-4",
    type: "success",
    category: "satellite",
    title: "Sentinel-2 Satellite Imagery Updated",
    message: "New 10m multispectral L2A raster ingested with mean NDVI 0.422. GeoSR-AI Super-Resolution 2.5m sharpening completed.",
    timestamp: "5 hours ago",
    isRead: true,
    actionText: "View Satellite SRM"
  },
  {
    id: "notif-5",
    type: "advisory",
    category: "scheme",
    title: "PMFBY Crop Insurance Boundary Sync",
    message: "Your demarcated parcel coordinates (5.00 Acres) are ready for official Khasra / GeoJSON insurance claim submission.",
    timestamp: "Yesterday",
    isRead: true,
    actionText: "Download GeoJSON"
  }
];

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

export default function NotificationCenter({ isOpen, onClose, onNavigateTab }: NotificationCenterProps) {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<FarmNotification[]>(SAMPLE_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all");
  const [isSimulatingDispatch, setIsSimulatingDispatch] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifs = notifications.filter(n => {
    if (filter === "unread") return !n.isRead;
    if (filter === "critical") return n.type === "critical" || n.type === "warning";
    return true;
  });

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSimulateSMS = () => {
    setIsSimulatingDispatch(true);
    setTimeout(() => {
      setIsSimulatingDispatch(false);
      setDispatchSuccess(true);
      setTimeout(() => setDispatchSuccess(false), 3500);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in">
      <div 
        className="fixed inset-y-0 right-0 max-w-full flex sm:pl-10 pl-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen sm:max-w-md max-w-full bg-[#FDFCF8] shadow-2xl border-l border-[#E5E0D5] flex flex-col transform transition-transform ease-in-out duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E5E0D5] bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#4A5D43]/10 flex items-center justify-center text-[#4A5D43]">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif font-bold text-lg text-[#2C2C24]">Agro-Advisory Center</h2>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E0533C] text-white">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#2C2C24]/60 font-mono">Real-time IoT, satellite & ICAR alerts</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#2C2C24]/40 hover:text-[#2C2C24] hover:bg-[#F2EFE9] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SMS / WhatsApp Dispatch Alert Simulation Banner */}
          <div className="px-5 py-3 bg-[#F4F1EA] border-b border-[#E5E0D5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#4A5D43]" />
              <span className="text-xs font-semibold text-[#2C2C24]">Farmer SMS / WhatsApp Broadcast</span>
            </div>
            <button
              onClick={handleSimulateSMS}
              disabled={isSimulatingDispatch || dispatchSuccess}
              className="px-3 py-1 rounded-md bg-[#4A5D43] hover:bg-[#3A4B34] text-white text-[11px] font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSimulatingDispatch ? (
                <>
                  <Radio className="w-3 h-3 animate-spin" />
                  <span>Dispatching...</span>
                </>
              ) : dispatchSuccess ? (
                <>
                  <Check className="w-3 h-3 text-emerald-300" />
                  <span>Dispatched!</span>
                </>
              ) : (
                <>
                  <Send className="w-3 h-3" />
                  <span>Test SMS Alert</span>
                </>
              )}
            </button>
          </div>

          {/* Filter Pills & Actions */}
          <div className="px-5 py-2.5 bg-white border-b border-[#E5E0D5] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFilter("all")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  filter === "all" ? "bg-[#4A5D43] text-white shadow-xs" : "text-[#2C2C24]/60 hover:bg-[#F2EFE9]"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  filter === "unread" ? "bg-[#4A5D43] text-white shadow-xs" : "text-[#2C2C24]/60 hover:bg-[#F2EFE9]"
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter("critical")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  filter === "critical" ? "bg-[#E0533C] text-white shadow-xs" : "text-[#2C2C24]/60 hover:bg-[#F2EFE9]"
                }`}
              >
                Urgent
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-[#4A5D43] hover:underline font-semibold"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredNotifs.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="font-serif font-bold text-sm text-[#2C2C24]">All Caught Up!</p>
                <p className="text-xs text-[#2C2C24]/60 mt-1 max-w-xs">
                  No active warnings or advisories for this parcel. Your crop health telemetry is nominal.
                </p>
              </div>
            ) : (
              filteredNotifs.map((notif) => {
                const isUrgent = notif.type === "critical" || notif.type === "warning";
                
                return (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                      !notif.isRead 
                        ? isUrgent 
                          ? "bg-amber-50/70 border-amber-200/80 shadow-xs" 
                          : "bg-white border-[#4A5D43]/30 shadow-xs" 
                        : "bg-[#FAF9F5] border-[#E5E0D5] opacity-80"
                    }`}
                  >
                    {!notif.isRead && (
                      <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#4A5D43]" />
                    )}

                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        notif.type === "critical" ? "bg-red-100 text-red-700" :
                        notif.type === "warning" ? "bg-amber-100 text-amber-700" :
                        notif.type === "success" ? "bg-emerald-100 text-emerald-700" :
                        "bg-[#4A5D43]/10 text-[#4A5D43]"
                      }`}>
                        {notif.category === "weather" && <CloudRain className="w-4 h-4" />}
                        {notif.category === "pest" && <AlertTriangle className="w-4 h-4" />}
                        {notif.category === "soil" && <Droplets className="w-4 h-4" />}
                        {notif.category === "satellite" && <Layers className="w-4 h-4" />}
                        {notif.category === "scheme" && <ShieldCheck className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-[#2C2C24] leading-snug">
                            {notif.title}
                          </h4>
                        </div>
                        
                        <p className="text-[11px] text-[#2C2C24]/80 mt-1 leading-relaxed">
                          {notif.message}
                        </p>

                        <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-[#E5E0D5]/50">
                          <div className="flex items-center gap-1 text-[10px] text-[#2C2C24]/50 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>{notif.timestamp}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => deleteNotification(notif.id, e)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-[#2C2C24]/40 hover:text-red-600 transition-opacity"
                              title="Delete notification"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {notif.actionText && (
                              <span className="text-[10px] font-bold text-[#4A5D43] flex items-center gap-1 hover:underline">
                                <span>{notif.actionText}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          <div className="p-4 border-t border-[#E5E0D5] bg-[#FAF9F5] text-center">
            <p className="text-[10px] text-[#2C2C24]/60 font-mono">
              🌾 AgriSphere AI Dispatcher • Connected to ICAR-KVK Advisory Grid
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
