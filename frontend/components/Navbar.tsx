"use client";

import React from "react";
import { Home, BookOpen, Zap, AlertTriangle, Cpu, FileText } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isBackendConnected: boolean;
}

export default function Navbar({ activeTab, setActiveTab, isBackendConnected }: NavbarProps) {
  const tabs = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      color: "text-blue-600",
      activeText: "text-blue-700",
      activeBorder: "border-blue-200",
      activeBg: "bg-white",
      dot: "bg-blue-600",
    },
    {
      id: "learn",
      label: "Learn Hamming Code",
      icon: BookOpen,
      color: "text-indigo-600",
      activeText: "text-indigo-700",
      activeBorder: "border-indigo-200",
      activeBg: "bg-white",
      dot: "bg-indigo-600",
    },
    {
      id: "single",
      label: "Single Error Demo",
      icon: Zap,
      color: "text-emerald-600",
      activeText: "text-emerald-700",
      activeBorder: "border-emerald-300",
      activeBg: "bg-white",
      dot: "bg-emerald-600",
    },
    {
      id: "double",
      label: "Double Error Demo",
      icon: AlertTriangle,
      color: "text-rose-600",
      activeText: "text-rose-700",
      activeBorder: "border-rose-300",
      activeBg: "bg-white",
      dot: "bg-rose-600",
    },
    {
      id: "simulator",
      label: "Interactive Simulator",
      icon: Cpu,
      color: "text-violet-600",
      activeText: "text-violet-700",
      activeBorder: "border-violet-300",
      activeBg: "bg-white",
      dot: "bg-violet-600",
    },
    {
      id: "results",
      label: "Results & Exam Answer",
      icon: FileText,
      color: "text-amber-600",
      activeText: "text-amber-800",
      activeBorder: "border-amber-300",
      activeBg: "bg-white",
      dot: "bg-amber-600",
    },
  ];

  return (
    <header className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 space-y-2.5">
        {/* Top Header Row: Brand Logo, Defense Tag & Live Backend Status */}
        <div className="flex items-center justify-between">
          {/* Logo & Academic Title */}
          <div
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => setActiveTab("home")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 font-mono font-black text-lg group-hover:scale-105 group-hover:shadow-indigo-500/35 transition-all duration-200">
              H₇,₄
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                  Hamming(7,4)
                </span>
                <span className="font-extrabold text-base sm:text-lg text-slate-800 hidden xs:inline">
                  Demonstration Suite
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                  Academic Defense
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block font-medium">
                Single-Error Correction <span className="text-emerald-700 font-bold">(SEC)</span> vs. Double-Error Decoder Aliasing <span className="text-rose-700 font-bold">(SDC)</span>
              </p>
            </div>
          </div>

          {/* Right Status Badge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-200 bg-emerald-50 text-emerald-800 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isBackendConnected ? "bg-emerald-400" : "bg-blue-400"}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isBackendConnected ? "bg-emerald-500" : "bg-blue-500"}`}></span>
              </span>
              <span className="text-emerald-900 font-bold text-[11px] sm:text-xs">
                {isBackendConnected ? "Python Backend Connected" : "Client Engine (Ready)"}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold hidden md:inline">
                FastAPI:8000
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Row: Segmented Modern Controls */}
        <div className="overflow-x-auto scrollbar-none pb-0.5">
          <nav className="inline-flex items-center gap-1 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/90 shadow-inner">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? `${tab.activeBg} ${tab.activeText} ${tab.activeBorder} border font-black shadow-xs scale-100`
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold border border-transparent active:scale-98"
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform ${isActive ? tab.color : "text-slate-500 group-hover:text-slate-700"}`} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className={`w-1.5 h-1.5 rounded-full ${tab.dot} animate-pulse`} />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}