"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Navigation, 
  Play, 
  Pause, 
  RotateCcw, 
  BatteryCharging, 
  Droplets, 
  Gauge, 
  Wind, 
  ShieldCheck, 
  Sparkles, 
  Radio, 
  Sliders,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface DroneFlightSimulatorProps {
  farmName: string;
  areaAcres: number;
  centerLat: number;
  centerLon: number;
  onClose?: () => void;
}

export default function DroneFlightSimulator({
  farmName,
  areaAcres = 5.0,
  centerLat = 18.675,
  centerLon = 78.102,
  onClose
}: DroneFlightSimulatorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [flightProgress, setFlightProgress] = useState(0); // 0 to 100%
  const [altitudeMeters, setAltitudeMeters] = useState(15);
  const [chemicalType, setChemicalType] = useState<"nano_urea" | "neem_bio" | "zinc_micronutrient">("nano_urea");
  const [speedMs, setSpeedMs] = useState(6.0); // 6 m/s
  const [currentWaypoint, setCurrentWaypoint] = useState(1);
  const totalWaypoints = 12;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Derived Calculations
  const swathWidthMeters = Math.round(altitudeMeters * 0.32 * 10) / 10; // ~4.8m at 15m alt
  const totalDistanceMeters = Math.round(Math.sqrt(areaAcres * 4046.86) * 14); // ~2,800m for 5 acres
  const totalFlightTimeSeconds = Math.round(totalDistanceMeters / speedMs);
  const totalFlightMinutes = (totalFlightTimeSeconds / 60).toFixed(1);
  
  const tankCapacityLiters = 10.0;
  const applicationRateLitersPerAcre = chemicalType === "nano_urea" ? 1.5 : chemicalType === "neem_bio" ? 2.0 : 1.0;
  const totalLiquidNeededLiters = Math.round(areaAcres * applicationRateLitersPerAcre * 10) / 10;
  const batteryDrainPct = Math.min(100, Math.round((totalFlightTimeSeconds / 1500) * 100)); // 25 min max flight time

  // Animation Loop for Canvas Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let progress = flightProgress;
    let running = isPlaying;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const pad = 45;

      // 1. Draw Field Boundary Grid
      ctx.strokeStyle = "#4A5D43";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(74, 93, 67, 0.08)";
      ctx.beginPath();
      ctx.rect(pad, pad, w - pad * 2, h - pad * 2);
      ctx.fill();
      ctx.stroke();

      // Draw subtle soil crop row lines
      ctx.strokeStyle = "rgba(193, 140, 93, 0.25)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      for (let y = pad + 15; y < h - pad; y += 18) {
        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(w - pad, y);
        ctx.stroke();
      }

      // 2. Generate Zigzag Waypoints
      const numLines = 6;
      const waypoints: { x: number; y: number }[] = [];
      const stepY = (h - pad * 2) / (numLines - 1);

      for (let i = 0; i < numLines; i++) {
        const y = pad + i * stepY;
        if (i % 2 === 0) {
          waypoints.push({ x: pad + 15, y });
          waypoints.push({ x: w - pad - 15, y });
        } else {
          waypoints.push({ x: w - pad - 15, y });
          waypoints.push({ x: pad + 15, y });
        }
      }

      // Draw Full Planned Waypoint Path
      ctx.strokeStyle = "rgba(220, 38, 38, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      waypoints.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();

      // Draw Waypoint dots
      waypoints.forEach((pt, idx) => {
        ctx.fillStyle = idx === 0 ? "#16A34A" : idx === waypoints.length - 1 ? "#DC2626" : "rgba(74, 93, 67, 0.6)";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Compute Current Drone Position along Waypoints based on progress
      const totalSegments = waypoints.length - 1;
      const progressFraction = progress / 100;
      const currentSegmentFloat = progressFraction * totalSegments;
      const currentSegmentIndex = Math.min(Math.floor(currentSegmentFloat), totalSegments - 1);
      const segmentProgress = currentSegmentFloat - currentSegmentIndex;

      const p1 = waypoints[currentSegmentIndex];
      const p2 = waypoints[Math.min(currentSegmentIndex + 1, totalSegments)];

      const droneX = p1.x + (p2.x - p1.x) * segmentProgress;
      const droneY = p1.y + (p2.y - p1.y) * segmentProgress;

      // 4. Draw Sprayed Covered Swath (Green Trail behind drone)
      ctx.strokeStyle = "rgba(74, 93, 67, 0.35)";
      ctx.lineWidth = swathWidthMeters * 5;
      ctx.lineCap = "round";
      ctx.setLineDash([]);
      ctx.beginPath();
      for (let i = 0; i <= currentSegmentIndex; i++) {
        if (i === 0) ctx.moveTo(waypoints[i].x, waypoints[i].y);
        else ctx.lineTo(waypoints[i].x, waypoints[i].y);
      }
      ctx.lineTo(droneX, droneY);
      ctx.stroke();

      // 5. Draw Animated Spraying Mist Cone underneath drone
      if (running && progress < 100) {
        ctx.fillStyle = "rgba(59, 130, 246, 0.25)";
        ctx.beginPath();
        ctx.arc(droneX, droneY, swathWidthMeters * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(16, 185, 129, 0.4)";
        ctx.beginPath();
        ctx.arc(droneX, droneY, swathWidthMeters * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Draw Quadcopter Drone Icon
      ctx.save();
      ctx.translate(droneX, droneY);

      // Rotating Propellers
      const angle = (Date.now() / 60) % (Math.PI * 2);
      ctx.strokeStyle = "#2C2C24";
      ctx.lineWidth = 2.5;

      // Arms
      ctx.beginPath();
      ctx.moveTo(-12, -12);
      ctx.lineTo(12, 12);
      ctx.moveTo(12, -12);
      ctx.lineTo(-12, 12);
      ctx.stroke();

      // Rotors
      const rotorRadius = 5;
      [-12, 12].forEach((rx) => {
        [-12, 12].forEach((ry) => {
          ctx.fillStyle = "rgba(220, 38, 38, 0.8)";
          ctx.beginPath();
          ctx.arc(rx, ry, rotorRadius, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(rx - Math.cos(angle) * rotorRadius, ry - Math.sin(angle) * rotorRadius);
          ctx.lineTo(rx + Math.cos(angle) * rotorRadius, ry + Math.sin(angle) * rotorRadius);
          ctx.stroke();
        });
      });

      // Drone Central Body
      ctx.fillStyle = "#4A5D43";
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Drone Status LED
      ctx.fillStyle = running ? "#10B981" : "#EF4444";
      ctx.beginPath();
      ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Update Waypoint Counter
      setCurrentWaypoint(Math.min(totalWaypoints, currentSegmentIndex + 1));

      // Progress Increment when running
      if (running && progress < 100) {
        progress += (speedMs / totalFlightTimeSeconds) * 1.5;
        if (progress >= 100) {
          progress = 100;
          setIsPlaying(false);
        }
        setFlightProgress(progress);
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, flightProgress, altitudeMeters, speedMs, chemicalType, swathWidthMeters, totalFlightTimeSeconds]);

  const handleTogglePlay = () => {
    if (flightProgress >= 100) {
      setFlightProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setFlightProgress(0);
    setCurrentWaypoint(1);
  };

  const remainingTankLiters = Math.max(0, (totalLiquidNeededLiters * (1 - flightProgress / 100))).toFixed(1);
  const remainingBattery = Math.max(10, Math.round(100 - (batteryDrainPct * (flightProgress / 100))));

  return (
    <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DED8CF]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#4A5D43]/10 text-[#4A5D43] flex items-center justify-center font-bold">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-[#2C2C24] font-serif">
                Autonomous AI Drone Spray Mission Planner
              </h3>
              <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Precision Ag 4.0
              </span>
            </div>
            <p className="text-xs text-[#78786C]">
              Cadastral Zigzag Waypoint Trajectory for <b className="text-[#2C2C24]">{farmName}</b> ({areaAcres} Acres)
            </p>
          </div>
        </div>

        {/* Live Mission Status Pill */}
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? "bg-emerald-500 animate-ping" : flightProgress >= 100 ? "bg-blue-500" : "bg-amber-500"}`}></span>
          <span className="text-xs font-bold font-mono text-[#2C2C24]">
            {isPlaying ? "ACTIVE SPRAY MISSION" : flightProgress >= 100 ? "MISSION COMPLETED" : "STANDBY ON GROUND"}
          </span>
        </div>
      </div>

      {/* Main Simulation Viewport (Canvas + Telemetry HUD) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left 2 Cols: Interactive Canvas */}
        <div className="lg:col-span-2 relative bg-[#F7F5EE] rounded-3xl border border-[#DED8CF] overflow-hidden shadow-inner flex items-center justify-center p-3">
          <canvas
            ref={canvasRef}
            width={580}
            height={340}
            className="w-full h-[320px] sm:h-[340px] block"
          />

          {/* Canvas Floating Telemetry Overlay */}
          <div className="absolute top-3 left-3 bg-[#FEFEFA]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#DED8CF] text-[11px] font-mono text-[#2C2C24] font-bold shadow-xs space-y-0.5">
            <p className="text-[#4A5D43]">Waypoint: {currentWaypoint} / {totalWaypoints}</p>
            <p className="text-[#78786C]">Swath Width: {swathWidthMeters} m</p>
          </div>

          <div className="absolute top-3 right-3 bg-[#FEFEFA]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#DED8CF] text-[11px] font-mono font-bold shadow-xs text-right">
            <span className="text-emerald-700">Coverage: {Math.round(flightProgress)}%</span>
          </div>

          {/* Progress Bar under canvas */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#E5E0D5]">
            <div
              className="h-full bg-[#4A5D43] transition-all duration-300"
              style={{ width: `${flightProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Right Col: Mission Controls & Real-time Payload Metrics */}
        <div className="flex flex-col justify-between space-y-4 bg-[#FAF8F3] p-5 rounded-3xl border border-[#E5E0D5]">
          
          {/* Mission Parameters */}
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#78786C] block">
              Mission Flight Parameters
            </span>

            {/* Chemical Formulation Selector */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#2C2C24] flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-[#4A5D43]" />
                Spray Formulation:
              </label>
              <select
                value={chemicalType}
                onChange={(e) => setChemicalType(e.target.value as any)}
                className="w-full bg-white border border-[#DED8CF] rounded-xl px-3 py-1.5 text-xs text-[#2C2C24] font-semibold outline-none cursor-pointer"
              >
                <option value="nano_urea">ICAR Nano-Urea (1.5 L/Ac)</option>
                <option value="neem_bio">Neem Seed Kernel Extract 1500 PPM (2.0 L/Ac)</option>
                <option value="zinc_micronutrient">Foliar Zinc + Boron Chelated (1.0 L/Ac)</option>
              </select>
            </div>

            {/* Altitude Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-[#2C2C24]">
                <span>Flight Altitude:</span>
                <span className="font-mono text-[#4A5D43] font-bold">{altitudeMeters} m AGL</span>
              </div>
              <input
                type="range"
                min="10"
                max="25"
                step="1"
                value={altitudeMeters}
                onChange={(e) => setAltitudeMeters(Number(e.target.value))}
                className="w-full accent-[#4A5D43] cursor-pointer"
              />
            </div>

            {/* Live Real-Time Payload Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-[#E5E0D5]">
                <span className="text-[10px] text-[#78786C] block font-semibold">Tank Payload</span>
                <span className="text-sm font-bold font-serif text-[#2C2C24]">
                  {remainingTankLiters} / {totalLiquidNeededLiters} L
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-[#E5E0D5]">
                <span className="text-[10px] text-[#78786C] block font-semibold flex items-center gap-1">
                  <BatteryCharging className="w-3 h-3 text-emerald-600" />
                  Battery
                </span>
                <span className="text-sm font-bold font-serif text-emerald-700">
                  {remainingBattery}%
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-[#E5E0D5]">
                <span className="text-[10px] text-[#78786C] block font-semibold">Est. Flight Time</span>
                <span className="text-sm font-bold font-serif text-[#2C2C24]">
                  {totalFlightMinutes} mins
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-[#E5E0D5]">
                <span className="text-[10px] text-[#78786C] block font-semibold">Total Distance</span>
                <span className="text-sm font-bold font-serif text-[#4A5D43]">
                  {(totalDistanceMeters / 1000).toFixed(2)} km
                </span>
              </div>
            </div>
          </div>

          {/* Action Control Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#E5E0D5]">
            <button
              onClick={handleTogglePlay}
              className={`flex-1 py-2.5 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-soft ${
                isPlaying
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-[#4A5D43] hover:bg-[#3A4B34]"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Mission</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>{flightProgress >= 100 ? "Restart Mission" : "Launch AI Spray Mission"}</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-white hover:bg-[#F0EBE5] text-[#2C2C24] border border-[#DED8CF] transition cursor-pointer"
              title="Reset Drone to Home Base"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
